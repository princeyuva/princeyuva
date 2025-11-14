/**
 * Save A Life App - Map Screen
 * Helper network map with emergency situations and nearby helpers
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, Callout, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/Ionicons';

import { COLORS, SPACING, COMPONENT_THEME } from '../../styles/theme';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

interface Helper {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  skills: string[];
  verificationStatus: 'verified' | 'pending';
  distance: number;
  rating: number;
  responseTime: number;
}

interface EmergencyAlert {
  id: string;
  type: string;
  location: {
    latitude: number;
    longitude: number;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'responding' | 'resolved';
  description: string;
  timeElapsed: string;
}

const MapScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [userLocation, setUserLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [selectedHelper, setSelectedHelper] = useState<Helper | null>(null);
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyAlert | null>(null);
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [emergencies, setEmergencies] = useState<EmergencyAlert[]>([]);
  const [mapMode, setMapMode] = useState<'view' | 'request-help' | 'offer-help'>('view');
  const [loading, setLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    loadInitialData();
    getCurrentLocation();
  }, []);

  const loadInitialData = () => {
    // Mock nearby helpers
    const mockHelpers: Helper[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        location: { latitude: 37.78825, longitude: -122.4324 },
        skills: ['First Aid', 'CPR', 'AED'],
        verificationStatus: 'verified',
        distance: 0.3,
        rating: 4.8,
        responseTime: 3,
      },
      {
        id: '2',
        name: 'Mike Chen',
        location: { latitude: 37.79025, longitude: -122.4304 },
        skills: ['First Aid', 'Search and Rescue'],
        verificationStatus: 'verified',
        distance: 0.5,
        rating: 4.9,
        responseTime: 5,
      },
      {
        id: '3',
        name: 'Dr. Emily Wilson',
        location: { latitude: 37.78625, longitude: -122.4344 },
        skills: ['Medical Professional', 'CPR'],
        verificationStatus: 'verified',
        distance: 0.8,
        rating: 5.0,
        responseTime: 2,
      },
    ];

    // Mock emergency alerts
    const mockEmergencies: EmergencyAlert[] = [
      {
        id: 'e1',
        type: 'medical',
        location: { latitude: 37.79125, longitude: -122.4284 },
        severity: 'high',
        status: 'active',
        description: 'Medical emergency - person collapsed',
        timeElapsed: '2 min ago',
      },
      {
        id: 'e2',
        type: 'accident',
        location: { latitude: 37.78525, longitude: -122.4364 },
        severity: 'medium',
        status: 'responding',
        description: 'Car accident - minor injuries',
        timeElapsed: '15 min ago',
      },
    ];

    setHelpers(mockHelpers);
    setEmergencies(mockEmergencies);
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setRegion({
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
      },
      (error) => {
        console.error('Location error:', error);
        Alert.alert('Location Error', 'Unable to get your current location');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    console.log('Map pressed:', coordinate);
  };

  const handleHelperPress = (helper: Helper) => {
    setSelectedHelper(helper);
    setSelectedEmergency(null);
  };

  const handleEmergencyPress = (emergency: EmergencyAlert) => {
    setSelectedEmergency(emergency);
    setSelectedHelper(null);
  };

  const handleRequestHelp = () => {
    setMapMode('request-help');
    Alert.alert(
      'Request Help',
      'Your request will be sent to nearby verified helpers. They will see your location and can respond to assist you.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Request', onPress: sendHelpRequest },
      ]
    );
  };

  const sendHelpRequest = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setMapMode('view');
      Alert.alert(
        'Help Request Sent',
        'Your request has been sent to 15 nearby helpers. Average response time: 2-5 minutes.',
        [{ text: 'OK' }]
      );
    }, 2000);
  };

  const handleOfferHelp = () => {
    setMapMode('offer-help');
    Alert.alert(
      'Offer Help',
      'You will be notified of nearby emergencies. Make sure you\'re able to respond quickly if alerted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Enable Helper Mode', onPress: enableHelperMode },
      ]
    );
  };

  const enableHelperMode = () => {
    setMapMode('view');
    Alert.alert(
      'Helper Mode Enabled',
      'You\'re now available to help with nearby emergencies. You\'ll receive notifications when someone needs assistance.',
      [{ text: 'OK' }]
    );
  };

  const handleRespondToEmergency = (emergency: EmergencyAlert) => {
    Alert.alert(
      'Respond to Emergency',
      `Are you sure you want to respond to this ${emergency.type} emergency?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Respond', onPress: () => respondToEmergency(emergency) },
      ]
    );
  };

  const respondToEmergency = (emergency: EmergencyAlert) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSelectedEmergency(null);
      Alert.alert(
        'Response Sent',
        'Your response has been sent. The person in need will be notified that you\'re on your way.',
        [{ text: 'OK' }]
      );
    }, 1500);
  };

  const focusOnUserLocation = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }, 1000);
    }
  };

  const getEmergencyMarkerColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return COLORS.primaryRed[600];
      case 'high':
        return COLORS.primaryRed[500];
      case 'medium':
        return COLORS.alertOrange[500];
      case 'low':
        return COLORS.warning;
      default:
        return COLORS.infoBlue[500];
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Helper Network</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={focusOnUserLocation} style={styles.headerButton}>
            <Icon name="locate" size={24} color={COLORS.infoBlue[500]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowFilterModal(true)} style={styles.headerButton}>
            <Icon name="options" size={24} color={COLORS.infoBlue[500]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={true}
        onPress={handleMapPress}
      >
        {/* User Location Circle */}
        <Circle
          center={userLocation}
          radius={100}
          strokeColor={COLORS.infoBlue[500]}
          fillColor="rgba(0, 122, 255, 0.1)"
          strokeWidth={2}
        />

        {/* Helper Markers */}
        {helpers.map((helper) => (
          <Marker
            key={helper.id}
            coordinate={helper.location}
            onPress={() => handleHelperPress(helper)}
          >
            <View style={[
              styles.helperMarker,
              { backgroundColor: helper.verificationStatus === 'verified' ? COLORS.safetyGreen[500] : COLORS.neutral[400] }
            ]}>
              <Icon name="person" size={16} color={COLORS.text.light} />
            </View>
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{helper.name}</Text>
                <Text style={styles.calloutText}>{helper.skills.join(', ')}</Text>
                <Text style={styles.calloutText}>{helper.distance} km away</Text>
                <Text style={styles.calloutText}>⭐ {helper.rating} • {helper.responseTime} min response</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Emergency Markers */}
        {emergencies.map((emergency) => (
          <Marker
            key={emergency.id}
            coordinate={emergency.location}
            onPress={() => handleEmergencyPress(emergency)}
          >
            <View style={[
              styles.emergencyMarker,
              { backgroundColor: getEmergencyMarkerColor(emergency.severity) }
            ]}>
              <Icon name="warning" size={16} color={COLORS.text.light} />
            </View>
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{emergency.type} Emergency</Text>
                <Text style={styles.calloutText}>{emergency.description}</Text>
                <Text style={styles.calloutText}>Severity: {emergency.severity}</Text>
                <Text style={styles.calloutText}>{emergency.timeElapsed}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          title="I Need Help"
          onPress={handleRequestHelp}
          variant="emergency"
          size="medium"
          style={styles.actionButton}
        />
        <Button
          title="I Can Help"
          onPress={handleOfferHelp}
          variant="safe"
          size="medium"
          style={styles.actionButton}
        />
      </View>

      {/* Info Cards */}
      <View style={styles.infoCards}>
        <Card style={styles.infoCard}>
          <View style={styles.infoCardContent}>
            <Icon name="people" size={20} color={COLORS.safetyGreen[500]} />
            <View style={styles.infoText}>
              <Text style={styles.infoValue}>{helpers.length}</Text>
              <Text style={styles.infoLabel}>Helpers Nearby</Text>
            </View>
          </View>
        </Card>
        <Card style={styles.infoCard}>
          <View style={styles.infoCardContent}>
            <Icon name="warning" size={20} color={COLORS.primaryRed[500]} />
            <View style={styles.infoText}>
              <Text style={styles.infoValue}>{emergencies.filter(e => e.status === 'active').length}</Text>
              <Text style={styles.infoLabel}>Active Emergencies</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Selected Helper Modal */}
      <Modal
        visible={!!selectedHelper}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedHelper(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedHelper && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Helper Details</Text>
                  <TouchableOpacity onPress={() => setSelectedHelper(null)}>
                    <Icon name="close" size={24} color={COLORS.text.secondary} />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.modalBody}>
                  <View style={styles.helperDetail}>
                    <Text style={styles.helperName}>{selectedHelper.name}</Text>
                    <View style={styles.helperStatus}>
                      <View style={[
                        styles.verificationBadge,
                        { backgroundColor: selectedHelper.verificationStatus === 'verified' ? COLORS.safetyGreen[100] : COLORS.neutral[100] }
                      ]}>
                        <Text style={[
                          styles.verificationText,
                          { color: selectedHelper.verificationStatus === 'verified' ? COLORS.safetyGreen[700] : COLORS.neutral[700] }
                        ]}>
                          {selectedHelper.verificationStatus}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.helperInfo}>
                    <Text style={styles.helperInfoLabel}>Skills</Text>
                    <View style={styles.skillsContainer}>
                      {selectedHelper.skills.map((skill, index) => (
                        <View key={index} style={styles.skillBadge}>
                          <Text style={styles.skillText}>{skill}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={styles.helperInfo}>
                    <Text style={styles.helperInfoLabel}>Distance</Text>
                    <Text style={styles.helperInfoValue}>{selectedHelper.distance} km away</Text>
                  </View>
                  <View style={styles.helperInfo}>
                    <Text style={styles.helperInfoLabel}>Rating</Text>
                    <Text style={styles.helperInfoValue}>⭐ {selectedHelper.rating}/5.0</Text>
                  </View>
                  <View style={styles.helperInfo}>
                    <Text style={styles.helperInfoLabel}>Average Response Time</Text>
                    <Text style={styles.helperInfoValue}>{selectedHelper.responseTime} minutes</Text>
                  </View>
                  <Button
                    title="Contact Helper"
                    onPress={() => {/* Handle contact */}}
                    variant="primary"
                    style={styles.contactButton}
                  />
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Selected Emergency Modal */}
      <Modal
        visible={!!selectedEmergency}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedEmergency(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedEmergency && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Emergency Details</Text>
                  <TouchableOpacity onPress={() => setSelectedEmergency(null)}>
                    <Icon name="close" size={24} color={COLORS.text.secondary} />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.modalBody}>
                  <View style={styles.emergencyDetail}>
                    <Text style={styles.emergencyType}>{selectedEmergency.type.toUpperCase()}</Text>
                    <View style={[
                      styles.severityBadge,
                      { backgroundColor: getEmergencyMarkerColor(selectedEmergency.severity) }
                    ]}>
                      <Text style={styles.severityText}>{selectedEmergency.severity}</Text>
                    </View>
                  </View>
                  <Text style={styles.emergencyDescription}>{selectedEmergency.description}</Text>
                  <Text style={styles.emergencyTime}>{selectedEmergency.timeElapsed}</Text>

                  {selectedEmergency.status === 'active' && (
                    <Button
                      title="Respond to Emergency"
                      onPress={() => handleRespondToEmergency(selectedEmergency)}
                      variant="emergency"
                      loading={loading}
                      style={styles.respondButton}
                    />
                  )}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  map: {
    flex: 1,
  },
  helperMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.text.light,
  },
  emergencyMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.text.light,
  },
  calloutContainer: {
    width: 200,
    padding: SPACING.sm,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  calloutText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 100,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  infoCards: {
    position: 'absolute',
    top: 100,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCard: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    backgroundColor: COLORS.background.primary,
    padding: SPACING.sm,
  },
  infoCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: SPACING.sm,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  modalBody: {
    padding: SPACING.lg,
  },
  helperDetail: {
    marginBottom: SPACING.lg,
  },
  helperName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  helperStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  helperInfo: {
    marginBottom: SPACING.md,
  },
  helperInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  helperInfoValue: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    backgroundColor: COLORS.infoBlue[100],
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    marginRight: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.infoBlue[700],
  },
  contactButton: {
    marginTop: SPACING.lg,
  },
  emergencyDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emergencyType: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  severityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.light,
  },
  emergencyDescription: {
    fontSize: 16,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  emergencyTime: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
  },
  respondButton: {
    marginTop: SPACING.lg,
  },
});

export default MapScreen;