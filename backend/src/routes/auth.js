/**
 * Save A Life Authentication Routes
 * User registration, login, password reset, and email verification
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');
const { v4: uuidv4 } = require('uuid');

const { db } = require('../config/database');
const { cache } = require('../config/redis');
const {
  generateAccessToken,
  generateRefreshToken,
  authRateLimit,
  refreshToken,
  logout
} = require('../middleware/auth');
const { sendEmailVerification, sendPasswordResetEmail } = require('../services/notificationService');

const router = express.Router();

/**
 * Register new user
 */
router.post('/register', authRateLimit, async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      password,
      dateOfBirth,
      agreeToTerms
    } = req.body;

    // Validation
    if (!fullName || !email || !phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Full name, email, phone number, and password are required'
      });
    }

    if (!agreeToTerms) {
      return res.status(400).json({
        success: false,
        error: 'Terms agreement required',
        message: 'You must agree to the terms of service to register'
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    // Validate phone number format
    if (!validator.isMobilePhone(phoneNumber, 'any')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format',
        message: 'Please provide a valid phone number'
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password too weak',
        message: 'Password must be at least 8 characters long'
      });
    }

    // Check if email already exists
    const existingEmailUser = await db('users').where({ email }).first();
    if (existingEmailUser) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists',
        message: 'An account with this email address already exists'
      });
    }

    // Check if phone number already exists
    const existingPhoneUser = await db('users').where({ phone_number: phoneNumber }).first();
    if (existingPhoneUser) {
      return res.status(409).json({
        success: false,
        error: 'Phone number already exists',
        message: 'An account with this phone number already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate verification token
    const emailVerificationToken = uuidv4();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const [newUser] = await db('users').insert({
      full_name: fullName,
      email: email.toLowerCase(),
      phone_number: phoneNumber,
      password_hash: passwordHash,
      salt: salt,
      date_of_birth: dateOfBirth ? new Date(dateOfBirth) : null,
      email_verification_token: emailVerificationToken,
      email_verification_expires: emailVerificationExpires,
      status: 'active',
      preferences: {
        sosCountdownDuration: 3, // seconds
        autoCallEmergencyServices: false,
        defaultEmergencyType: 'medical',
        notificationSounds: true,
        vibrationPatterns: true,
        locationAccuracy: 'high',
        batteryOptimization: false,
        darkMode: false,
        language: 'en'
      },
      location_sharing_settings: {
        shareWithEmergencyContacts: true,
        shareWithHelpers: true,
        shareDuration: 60, // minutes
        shareAccuracy: 'high',
        backgroundLocationEnabled: true
      }
    }).returning('*');

    // Remove sensitive data
    const userResponse = {
      id: newUser.id,
      fullName: newUser.full_name,
      email: newUser.email,
      phoneNumber: newUser.phone_number,
      isVerified: newUser.is_verified,
      dateOfBirth: newUser.date_of_birth,
      createdAt: newUser.created_at
    };

    // Send verification email
    try {
      await sendEmailVerification(newUser.email, emailVerificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }

    // Generate tokens
    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    // Store access token in Redis for tracking
    await cache.set(`access_token:${newUser.id}`, accessToken, 900); // 15 minutes

    res.status(201).json({
      success: true,
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: 900 // 15 minutes
      },
      message: 'Registration successful. Please check your email to verify your account.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: 'Failed to create user account'
    });
  }
});

/**
 * Login user
 */
router.post('/login', authRateLimit, async (req, res) => {
  try {
    const { email, phoneNumber, password, rememberMe } = req.body;

    // Validation
    if (!password || (!email && !phoneNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Missing credentials',
        message: 'Password and either email or phone number are required'
      });
    }

    // Find user by email or phone
    let user;
    if (email) {
      user = await db('users').where({ email: email.toLowerCase() }).first();
    } else {
      user = await db('users').where({ phone_number: phoneNumber }).first();
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'No account found with these credentials'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        error: 'Account inactive',
        message: 'Your account has been suspended or deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Incorrect password'
      });
    }

    // Update last login
    await db('users')
      .where({ id: user.id })
      .update({
        last_login_at: new Date(),
        last_login_ip: req.ip
      });

    // Remove sensitive data
    const userResponse = {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      phoneNumber: user.phone_number,
      isVerified: user.is_verified,
      isHelper: user.is_helper,
      helperVerificationStatus: user.helper_verification_status,
      dateOfBirth: user.date_of_birth,
      preferences: user.preferences,
      lastLoginAt: new Date()
    };

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshTokenToken = generateRefreshToken(user.id);

    // Store access token in Redis for tracking
    const tokenExpiry = rememberMe ? 7 * 24 * 60 * 60 : 900; // 7 days or 15 minutes
    await cache.set(`access_token:${user.id}`, accessToken, tokenExpiry);

    res.json({
      success: true,
      data: {
        user: userResponse,
        accessToken,
        refreshToken: refreshTokenToken,
        tokenType: 'Bearer',
        expiresIn: tokenExpiry
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: 'Failed to authenticate user'
    });
  }
});

/**
 * Refresh access token
 */
router.post('/refresh', refreshToken);

/**
 * Logout user
 */
router.post('/logout', logout);

/**
 * Request password reset
 */
router.post('/request-password-reset', authRateLimit, async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Missing contact information',
        message: 'Email or phone number is required'
      });
    }

    // Find user
    let user;
    if (email) {
      user = await db('users').where({ email: email.toLowerCase() }).first();
    } else {
      user = await db('users').where({ phone_number: phoneNumber }).first();
    }

    // Always return success to prevent user enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with this email/phone, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    // Update user with reset token
    await db('users')
      .where({ id: user.id })
      .update({
        reset_password_token: resetToken,
        reset_password_expires: resetExpires
      });

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
    }

    res.json({
      success: true,
      message: 'If an account exists with this email/phone, a password reset link has been sent'
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      error: 'Password reset request failed',
      message: 'Failed to process password reset request'
    });
  }
});

/**
 * Reset password
 */
router.post('/reset-password', authRateLimit, async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Reset token and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password too weak',
        message: 'Password must be at least 8 characters long'
      });
    }

    // Find user with valid reset token
    const user = await db('users')
      .where({
        reset_password_token: token,
        reset_password_expires: db.raw('NOW()')
      })
      .first();

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token',
        message: 'Please request a new password reset link'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update user
    await db('users')
      .where({ id: user.id })
      .update({
        password_hash: passwordHash,
        salt: salt,
        reset_password_token: null,
        reset_password_expires: null
      });

    res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      error: 'Password reset failed',
      message: 'Failed to reset password'
    });
  }
});

/**
 * Verify email
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Missing verification token',
        message: 'Email verification token is required'
      });
    }

    // Find user with valid verification token
    const user = await db('users')
      .where({
        email_verification_token: token,
        email_verification_expires: db.raw('NOW()')
      })
      .first();

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token',
        message: 'Please request a new verification email'
      });
    }

    // Update user
    await db('users')
      .where({ id: user.id })
      .update({
        is_verified: true,
        email_verified_at: new Date(),
        email_verification_token: null,
        email_verification_expires: null
      });

    res.json({
      success: true,
      message: 'Email verified successfully. Your account is now active.'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Email verification failed',
      message: 'Failed to verify email'
    });
  }
});

/**
 * Resend verification email
 */
router.post('/resend-verification', authRateLimit, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Missing email',
        message: 'Email address is required'
      });
    }

    // Find user
    const user = await db('users').where({ email: email.toLowerCase() }).first();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'No account found with this email address'
      });
    }

    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        error: 'Already verified',
        message: 'This email address is already verified'
      });
    }

    // Generate new verification token
    const emailVerificationToken = uuidv4();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user
    await db('users')
      .where({ id: user.id })
      .update({
        email_verification_token: emailVerificationToken,
        email_verification_expires: emailVerificationExpires
      });

    // Send verification email
    try {
      await sendEmailVerification(user.email, emailVerificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return res.status(500).json({
        success: false,
        error: 'Failed to send verification email',
        message: 'Please try again later'
      });
    }

    res.json({
      success: true,
      message: 'Verification email sent successfully. Please check your inbox.'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resend verification email',
      message: 'Please try again later'
    });
  }
});

module.exports = router;