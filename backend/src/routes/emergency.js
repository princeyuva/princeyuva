/**
 * Save A Life Emergency Routes
 * SOS activation, emergency alerts, and helper coordination
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const geolib = require('geolib');

const { db } = require('../config/database');
const { cache } = require('../config/redis');
const { sendEmergencyAlert, notifyNearbyHelpers, notifyEmergencyServices } = require('../services/notificationService');

const router = express.Router();

/**
 * Activate SOS emergency alert
 */
router.post('/sos', async (req, res) => {
  try {
    const { emergencyType, location, customMessage, autoCallServices } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!emergencyType || !location) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Emergency type and location are required'
      });
    }

    // Validate emergency type
    const validTypes = ['medical', 'accident', 'fire', 'crime', 'lost', 'other'];
    if (!validTypes.includes(emergencyType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid emergency type',
        message: 'Emergency type must be one of: ' + validTypes.join(', ')
      });
    }

    // Validate location
    if (!location.latitude || !location.longitude) {
      return res.status(400).json({
        success: false,
        error: 'Invalid location',
        message: 'Latitude and longitude are required'
      });
    }

    // Check for active emergencies from this user
    const activeEmergency = await db('emergency_alerts')
      .where({
        user_id: userId,
        status: 'active'
      })
      .first();

    if (activeEmergency) {
      return res.status(409).json({
        success: false,
        error: 'Active emergency exists',
        message: 'You already have an active emergency alert'
      });
    }

    // Determine severity based on emergency type
    let severity = 'medium';
    if (emergencyType === 'medical' || emergencyType === 'fire') {
      severity = 'high';
    } else if (emergencyType === 'crime') {
      severity = 'critical';
    }

    // Create emergency alert
    const [newAlert] = await db('emergency_alerts').insert({
      id: uuidv4(),
      user_id: userId,
      type: emergencyType,
      severity: severity,
      title: `${emergencyType.charAt(0).toUpperCase() + emergencyType.slice(1)} Emergency`,
      description: customMessage || `${emergencyType} emergency reported`,
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy_meters: location.accuracy,
      altitude: location.altitude,
      address: location.address,
      status: 'active',
      auto_generated: false,
      emergency_services_notified: autoCallServices || false,
    }).returning('*');

    // Get user's emergency contacts
    const emergencyContacts = await db('emergency_contacts')
      .where({ user_id: userId, is_primary: true })
      .orderBy('priority', 'asc');

    // Get user's Medical ID information
    const medicalId = await db('medical_ids')
      .where({ user_id: userId })
      .first();

    // Start location sharing session
    const locationSessionId = uuidv4();
    await cache.setex(
      `location_share:${locationSessionId}`,
      3600, // 1 hour
      JSON.stringify({
        alertId: newAlert.id,
        userId: userId,
        startTime: new Date().toISOString(),
        active: true,
      })
    );

    // Notify emergency contacts
    const contactPromises = emergencyContacts.map(contact =>
      sendEmergencyAlert(contact, newAlert, medicalId)
    );

    // Find nearby helpers
    const nearbyHelpers = await findNearbyHelpers(
      location.latitude,
      location.longitude,
      5000 // 5km radius
    );

    // Notify nearby helpers
    const helperPromises = nearbyHelpers.map(helper =>
      notifyNearbyHelpers(helper, newAlert, medicalId)
    );

    // Notify emergency services if requested
    let emergencyServicesResult = null;
    if (autoCallServices) {
      emergencyServicesResult = await notifyEmergencyServices(newAlert, medicalId);
    }

    // Store alert in Redis for real-time updates
    await cache.setex(
      `emergency:${newAlert.id}`,
      86400, // 24 hours
      JSON.stringify({
        ...newAlert,
        emergency_contacts: emergencyContacts,
        medical_id: medicalId ? {
          blood_type: medicalId.blood_type,
          allergies: medicalId.allergies,
          emergency_contacts: medicalId.emergency_contacts
        } : null,
        helpers_notified: nearbyHelpers.length,
        location_session_id: locationSessionId
      })
    );

    // Execute all notifications in parallel
    await Promise.allSettled([...contactPromises, ...helperPromises]);

    // Broadcast emergency via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('emergency-activated', {
        alertId: newAlert.id,
        type: emergencyType,
        location: location,
        severity: severity,
        userId: userId
      });
    }

    res.status(201).json({
      success: true,
      data: {
        alert: {
          id: newAlert.id,
          type: newAlert.type,
          severity: newAlert.severity,
          status: newAlert.status,
          location: {
            latitude: newAlert.latitude,
            longitude: newAlert.longitude,
            address: newAlert.address
          },
          createdAt: newAlert.created_at
        },
        contactsNotified: emergencyContacts.length,
        helpersNotified: nearbyHelpers.length,
        locationSessionId: locationSessionId,
        emergencyServicesNotified: !!emergencyServicesResult
      },
      message: 'Emergency alert activated successfully'
    });

  } catch (error) {
    console.error('SOS activation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to activate emergency alert',
      message: 'Internal server error'
    });
  }
});

/**
 * Cancel active emergency
 */
router.post('/cancel', async (req, res) => {
  try {
    const { alertId, reason } = req.body;
    const userId = req.user.id;

    if (!alertId) {
      return res.status(400).json({
        success: false,
        error: 'Missing alert ID',
        message: 'Alert ID is required'
      });
    }

    // Find and update the emergency alert
    const [updatedAlert] = await db('emergency_alerts')
      .where({
        id: alertId,
        user_id: userId,
        status: 'active'
      })
      .update({
        status: 'cancelled',
        resolved_at: new Date(),
        resolution_notes: reason || 'Cancelled by user'
      })
      .returning('*');

    if (!updatedAlert) {
      return res.status(404).json({
        success: false,
        error: 'Emergency not found',
        message: 'No active emergency found with this ID'
      });
    }

    // Calculate response time
    const activationTime = new Date(updatedAlert.created_at);
    const cancelTime = new Date();
    const responseTimeSeconds = Math.floor((cancelTime - activationTime) / 1000);

    // Update response time
    await db('emergency_alerts')
      .where({ id: alertId })
      .update({ response_time_seconds: responseTimeSeconds });

    // Update Redis cache
    const cachedAlert = await cache.get(`emergency:${alertId}`);
    if (cachedAlert) {
      const alertData = JSON.parse(cachedAlert);
      alertData.status = 'cancelled';
      alertData.resolvedAt = cancelTime.toISOString();
      alertData.responseTimeSeconds = responseTimeSeconds;
      alertData.resolutionNotes = reason || 'Cancelled by user';
      await cache.setex(`emergency:${alertId}`, 86400, JSON.stringify(alertData));
    }

    // Stop location sharing session
    const locationSessionKey = `location_share:*`;
    const keys = await cache.keys(locationSessionKey);
    for (const key of keys) {
      const sessionData = await cache.get(key);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session.alertId === alertId) {
          session.active = false;
          session.endTime = new Date().toISOString();
          await cache.setex(key, 3600, JSON.stringify(session));
        }
      }
    }

    // Broadcast cancellation via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('emergency-cancelled', {
        alertId: alertId,
        userId: userId,
        reason: reason || 'Cancelled by user'
      });
    }

    res.json({
      success: true,
      data: {
        alertId: updatedAlert.id,
        status: updatedAlert.status,
        cancelledAt: updatedAlert.resolved_at,
        responseTimeSeconds: responseTimeSeconds
      },
      message: 'Emergency alert cancelled successfully'
    });

  } catch (error) {
    console.error('Emergency cancellation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel emergency alert',
      message: 'Internal server error'
    });
  }
});

/**
 * Update emergency status
 */
router.put('/:alertId/status', async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status, resolutionNotes } = req.body;
    const userId = req.user.id;

    const validStatuses = ['active', 'responding', 'resolved', 'false_alarm'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
        message: 'Status must be one of: ' + validStatuses.join(', ')
      });
    }

    // Find and update the emergency alert
    const [updatedAlert] = await db('emergency_alerts')
      .where({
        id: alertId,
        user_id: userId
      })
      .update({
        status: status,
        resolved_at: status === 'resolved' || status === 'false_alarm' ? new Date() : null,
        resolution_notes: resolutionNotes
      })
      .returning('*');

    if (!updatedAlert) {
      return res.status(404).json({
        success: false,
        error: 'Emergency not found',
        message: 'No emergency found with this ID'
      });
    }

    // Calculate resolution time if resolved
    let resolutionTimeSeconds = null;
    if (status === 'resolved' || status === 'false_alarm') {
      const activationTime = new Date(updatedAlert.created_at);
      const resolutionTime = new Date();
      resolutionTimeSeconds = Math.floor((resolutionTime - activationTime) / 1000);

      await db('emergency_alerts')
        .where({ id: alertId })
        .update({
          resolution_time_seconds: resolutionTimeSeconds
        });
    }

    // Update Redis cache
    const cachedAlert = await cache.get(`emergency:${alertId}`);
    if (cachedAlert) {
      const alertData = JSON.parse(cachedAlert);
      alertData.status = status;
      alertData.resolutionNotes = resolutionNotes;
      if (resolutionTimeSeconds) {
        alertData.resolutionTimeSeconds = resolutionTimeSeconds;
      }
      await cache.setex(`emergency:${alertId}`, 86400, JSON.stringify(alertData));
    }

    res.json({
      success: true,
      data: {
        alertId: updatedAlert.id,
        status: updatedAlert.status,
        resolvedAt: updatedAlert.resolved_at,
        resolutionTimeSeconds: resolutionTimeSeconds
      },
      message: `Emergency status updated to ${status}`
    });

  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update emergency status',
      message: 'Internal server error'
    });
  }
});

/**
 * Get user's emergency history
 */
router.get('/history', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    const offset = (page - 1) * limit;

    const emergencies = await db('emergency_alerts')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    const total = await db('emergency_alerts')
      .where({ user_id: userId })
      .count('* as count')
      .first();

    res.json({
      success: true,
      data: {
        emergencies: emergencies,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total.count),
          pages: Math.ceil(total.count / limit)
        }
      }
    });

  } catch (error) {
    console.error('Emergency history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch emergency history',
      message: 'Internal server error'
    });
  }
});

/**
 * Update location during active emergency
 */
router.post('/location-update', async (req, res) => {
  try {
    const { alertId, latitude, longitude, accuracy, batteryLevel } = req.body;
    const userId = req.user.id;

    if (!alertId || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Alert ID, latitude, and longitude are required'
      });
    }

    // Verify alert belongs to user and is active
    const alert = await db('emergency_alerts')
      .where({
        id: alertId,
        user_id: userId,
        status: 'active'
      })
      .first();

    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Active emergency not found',
        message: 'No active emergency found with this ID'
      });
    }

    // Store location update in Redis
    const locationData = {
      alertId: alertId,
      userId: userId,
      latitude: latitude,
      longitude: longitude,
      accuracy: accuracy,
      batteryLevel: batteryLevel,
      timestamp: new Date().toISOString()
    };

    await cache.setex(
      `location:${alertId}:${Date.now()}`,
      300, // 5 minutes
      JSON.stringify(locationData)
    );

    // Broadcast location update via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`emergency:${alertId}`).emit('location-update', locationData);
      io.to('helpers-active').emit('emergency-location-update', {
        alertId: alertId,
        location: {
          latitude: latitude,
          longitude: longitude
        }
      });
    }

    res.json({
      success: true,
      message: 'Location updated successfully'
    });

  } catch (error) {
    console.error('Location update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update location',
      message: 'Internal server error'
    });
  }
});

/**
 * Find nearby helpers (internal function)
 */
async function findNearbyHelpers(latitude, longitude, radiusKm = 5) {
  try {
    // Get all verified helpers within radius
    const helpers = await db('users')
      .join('helpers', 'users.id', 'helpers.user_id')
      .where('users.is_helper', true)
      .where('helpers.verification_status', 'verified')
      .where('helpers.is_available', true);

    // Filter by distance (in a real app, this would use PostGIS for better performance)
    const nearbyHelpers = [];
    for (const helper of helpers) {
      if (helpers.current_location_lat && helpers.current_location_lng) {
        const distance = geolib.getDistanceBetweenPoints(
          { latitude, longitude },
          { latitude: helper.current_location_lat, longitude: helper.current_location_lng }
        );

        if (distance <= radiusKm * 1000) { // Convert km to meters
          nearbyHelpers.push({
            id: helper.id,
            name: helper.full_name,
            location: {
              latitude: helper.current_location_lat,
              longitude: helper.current_location_lng
            },
            skills: helper.skills || [],
            distance: distance / 1000, // Convert to km
            rating: helper.rating || 0
          });
        }
      }
    }

    // Sort by distance
    nearbyHelpers.sort((a, b) => a.distance - b.distance);

    return nearbyHelpers;
  } catch (error) {
    console.error('Error finding nearby helpers:', error);
    return [];
  }
}

module.exports = router;