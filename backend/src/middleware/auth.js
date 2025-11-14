/**
 * Save A Life Authentication Middleware
 * JWT token verification and user authentication
 */

const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const { cache } = require('../config/redis');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Generate JWT access token
 */
const generateAccessToken = (userId) => {
  return jwt.sign(
    {
      userId,
      type: 'access',
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Generate JWT refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      userId,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );
};

/**
 * Verify JWT access token
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

/**
 * Verify JWT refresh token
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Access token is required'
      });
    }

    // Check if token is blacklisted (for logout)
    const isBlacklisted = await cache.exists(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        error: 'Token has been revoked',
        message: 'Please login again'
      });
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Check if token type is correct
    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token type',
        message: 'Access token is required'
      });
    }

    // Get user from database
    const user = await db('users')
      .where({ id: decoded.userId, status: 'active' })
      .first();

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
        message: 'User account may be inactive or deleted'
      });
    }

    // Check if user is verified
    if (!user.is_verified) {
      return res.status(401).json({
        success: false,
        error: 'Account not verified',
        message: 'Please verify your email address'
      });
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      phoneNumber: user.phone_number,
      fullName: user.full_name,
      isVerified: user.is_verified,
      isHelper: user.is_helper,
      helperVerificationStatus: user.helper_verification_status
    };

    // Attach token for potential blacklisting
    req.token = token;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      message: error.message
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token is present but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    // Check if token is blacklisted
    const isBlacklisted = await cache.exists(`blacklist:${token}`);
    if (isBlacklisted) {
      req.user = null;
      return next();
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    if (decoded.type !== 'access') {
      req.user = null;
      return next();
    }

    // Get user from database
    const user = await db('users')
      .where({ id: decoded.userId, status: 'active' })
      .first();

    if (user && user.is_verified) {
      req.user = {
        id: user.id,
        email: user.email,
        phoneNumber: user.phone_number,
        fullName: user.full_name,
        isVerified: user.is_verified,
        isHelper: user.is_helper,
        helperVerificationStatus: user.helper_verification_status
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    // Log error but don't fail request
    console.error('Optional authentication error:', error);
    req.user = null;
    next();
  }
};

/**
 * Helper verification middleware
 * Requires user to be a verified helper
 */
const requireHelper = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Please login to access this resource'
      });
    }

    if (!req.user.isHelper) {
      return res.status(403).json({
        success: false,
        error: 'Helper access required',
        message: 'This resource is only available to verified helpers'
      });
    }

    if (req.user.helperVerificationStatus !== 'verified') {
      return res.status(403).json({
        success: false,
        error: 'Helper not verified',
        message: 'Your helper application is still being processed'
      });
    }

    next();
  } catch (error) {
    console.error('Helper verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication error',
      message: 'Failed to verify helper status'
    });
  }
};

/**
 * Rate limiting middleware for authentication endpoints
 */
const authRateLimit = async (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const key = `auth_rate_limit:${clientIP}`;

  try {
    const requests = await cache.incr(key);

    if (requests === 1) {
      await cache.expire(key, 300); // 5 minutes window
    }

    if (requests > 10) { // 10 requests per 5 minutes
      return res.status(429).json({
        success: false,
        error: 'Too many authentication attempts',
        message: 'Please try again later',
        retryAfter: 300
      });
    }

    next();
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Continue even if rate limiting fails
    next();
  }
};

/**
 * Token refresh middleware
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token required',
        message: 'Refresh token is required to get new access token'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token type',
        message: 'Refresh token is required'
      });
    }

    // Get user from database
    const user = await db('users')
      .where({ id: decoded.userId, status: 'active' })
      .first();

    if (!user || !user.is_verified) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
        message: 'User not found or not verified'
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user.id);

    // Store new access token in Redis for tracking
    await cache.set(`access_token:${user.id}`, newAccessToken, 900); // 15 minutes

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        tokenType: 'Bearer',
        expiresIn: 900 // 15 minutes
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(401).json({
      success: false,
      error: 'Token refresh failed',
      message: error.message
    });
  }
};

/**
 * Logout middleware
 * Blacklists the current token
 */
const logout = async (req, res, next) => {
  try {
    if (req.token) {
      // Add token to blacklist
      await cache.set(`blacklist:${req.token}`, 'true', 900); // 15 minutes
    }

    // Remove access token from Redis
    if (req.user) {
      await cache.del(`access_token:${req.user.id}`);
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      error: 'Logout failed',
      message: 'Failed to logout properly'
    });
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  authenticateToken,
  optionalAuth,
  requireHelper,
  authRateLimit,
  refreshToken,
  logout,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN
};