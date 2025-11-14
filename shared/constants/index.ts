// App Configuration
export const APP_CONFIG = {
  NAME: 'Save A Life',
  VERSION: '1.0.0',
  DESCRIPTION: 'Emergency response mobile app with SOS functionality, AI detection, and helper network',
  SUPPORT_EMAIL: 'support@savealife.com',
  EMERGENCY_NUMBER: '911',
  MAX_EMERGENCY_CONTACTS: 10,
  MAX_HELPER_NETWORK_RADIUS: 5000, // meters
  LOCATION_UPDATE_INTERVAL: 5000, // milliseconds
  SOS_COUNTDOWN_DURATION: 3000, // milliseconds
  DEFAULT_LOCATION_SHARING_DURATION: 60, // minutes
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  USER: {
    PROFILE: '/user/profile',
    EMERGENCY_CONTACTS: '/user/emergency-contacts',
    PREFERENCES: '/user/preferences',
    LOCATION: '/user/location',
  },
  EMERGENCY: {
    SOS: '/emergency/sos',
    ALERTS: '/emergency/alerts',
    CANCEL: '/emergency/cancel',
    STATUS: '/emergency/status',
    HELP_REQUESTS: '/emergency/help-requests',
  },
  MEDICAL: {
    ID: '/medical/id',
    CONDITIONS: '/medical/conditions',
    ALLERGIES: '/medical/allergies',
    MEDICATIONS: '/medical/medications',
    DEVICES: '/medical/devices',
  },
  LOCATION: {
    CURRENT: '/location/current',
    SHARING: '/location/sharing',
    HISTORY: '/location/history',
    NEARBY_HELPERS: '/location/nearby-helpers',
    PLACES: '/location/places',
  },
  NOTIFICATIONS: {
    SETTINGS: '/notifications/settings',
    HISTORY: '/notifications/history',
    REGISTER_DEVICE: '/notifications/register-device',
    MARK_READ: '/notifications/mark-read',
  },
  HELPERS: {
    REGISTER: '/helpers/register',
    AVAILABLE: '/helpers/available',
    RESPOND: '/helpers/respond',
    UPDATE_LOCATION: '/helpers/update-location',
  },
} as const;

// Emergency Types
export const EMERGENCY_TYPES = {
  MEDICAL: 'medical',
  ACCIDENT: 'accident',
  FIRE: 'fire',
  CRIME: 'crime',
  LOST: 'lost',
  OTHER: 'other',
} as const;

// Alert Severities
export const ALERT_SEVERITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// Helper Skills
export const HELPER_SKILLS = {
  FIRST_AID: 'first_aid',
  CPR: 'cpr',
  AED: 'aed',
  FIRE_SAFETY: 'fire_safety',
  SEARCH_AND_RESCUE: 'search_and_rescue',
  MEDICAL_PROFESSIONAL: 'medical_professional',
  LAW_ENFORCEMENT: 'law_enforcement',
  FIREFIGHTER: 'firefighter',
} as const;

// Blood Types
export const BLOOD_TYPES = {
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-',
  UNKNOWN: 'unknown',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SOS_ACTIVATED: 'sos_activated',
  SOS_CANCELLED: 'sos_cancelled',
  EMERGENCY_ALERT: 'emergency_alert',
  HELP_REQUEST: 'help_request',
  HELP_ACCEPTED: 'help_accepted',
  HELP_DECLINED: 'help_declined',
  HELPER_ARRIVED: 'helper_arrived',
  LOCATION_SHARING_STARTED: 'location_sharing_started',
  LOCATION_SHARING_STOPPED: 'location_sharing_stopped',
  CHECK_IN_REMINDER: 'check_in_reminder',
  CHECK_IN_RECEIVED: 'check_in_received',
  MEDICAL_ID_UPDATED: 'medical_id_updated',
  EMERGENCY_CONTACT_UPDATED: 'emergency_contact_updated',
  BATTERY_LOW: 'battery_low',
  GPS_ISSUES: 'gps_issues',
  NETWORK_ISSUES: 'network_issues',
  AI_DETECTION_ALERT: 'ai_detection_alert',
  FALSE_ALARM_DETECTED: 'false_alarm_detected',
  EMERGENCY_BROADCAST: 'emergency_broadcast',
  WEATHER_ALERT: 'weather_alert',
  COMMUNITY_ALERT: 'community_alert',
  SYSTEM_MAINTENANCE: 'system_maintenance',
  FEATURE_UPDATE: 'feature_update',
} as const;

// Location Sources
export const LOCATION_SOURCES = {
  GPS: 'gps',
  NETWORK: 'network',
  PASSIVE: 'passive',
  MANUAL: 'manual',
  BEACON: 'beacon',
  WIFI: 'wifi',
} as const;

// AI Detection Types
export const AI_DETECTION_TYPES = {
  CRASH_DETECTION: 'crash_detection',
  FALL_DETECTION: 'fall_detection',
  NO_MOVEMENT_DETECTION: 'no_movement_detection',
  VOICE_ACTIVATION: 'voice_activation',
  HEART_RATE_ANOMALY: 'heart_rate_anomaly',
  DEVIATION_FROM_PATTERN: 'deviation_from_pattern',
} as const;

// Permission Types
export const PERMISSIONS = {
  LOCATION: {
    ALWAYS: 'always',
    WHEN_IN_USE: 'whenInUse',
  },
  NOTIFICATIONS: 'notifications',
  CAMERA: 'camera',
    MICROPHONE: 'microphone',
  CONTACTS: 'contacts',
  PHONE_CALL: 'phone_call',
  SMS: 'sms',
} as const;

// Error Codes
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  LOCATION_UNAVAILABLE: 'LOCATION_UNAVAILABLE',
  INVALID_INPUT: 'INVALID_INPUT',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT',
  OFFLINE_MODE: 'OFFLINE_MODE',
  BATTERY_LOW: 'BATTERY_LOW',
  GPS_DISABLED: 'GPS_DISABLED',
  EMERGENCY_SERVICES_UNAVAILABLE: 'EMERGENCY_SERVICES_UNAVAILABLE',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SOS_ACTIVATED: 'Emergency alert sent successfully',
  SOS_CANCELLED: 'Emergency alert cancelled',
  LOCATION_SHARING_STARTED: 'Location sharing started',
  LOCATION_SHARING_STOPPED: 'Location sharing stopped',
  EMERGENCY_CONTACT_ADDED: 'Emergency contact added successfully',
  MEDICAL_ID_UPDATED: 'Medical ID updated successfully',
  HELP_REQUEST_SENT: 'Help request sent to nearby helpers',
  CHECK_IN_SENT: 'Check-in sent to emergency contacts',
  SETTINGS_SAVED: 'Settings saved successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  AUTHENTICATION_ERROR: 'Authentication failed. Please log in again.',
  PERMISSION_DENIED: 'Permission denied. Please enable required permissions.',
  LOCATION_UNAVAILABLE: 'Location unavailable. Please enable GPS.',
  INVALID_INPUT: 'Invalid input. Please check your information.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT: 'Request timeout. Please try again.',
  OFFLINE_MODE: 'You are offline. Some features may not be available.',
  BATTERY_LOW: 'Battery level is low. Emergency features will continue to work.',
  GPS_DISABLED: 'GPS is disabled. Please enable location services.',
  EMERGENCY_SERVICES_UNAVAILABLE: 'Emergency services temporarily unavailable.',
  INVALID_PHONE_NUMBER: 'Invalid phone number format.',
  INVALID_EMAIL: 'Invalid email address.',
  PASSWORD_TOO_WEAK: 'Password is too weak. Please use a stronger password.',
  EMAIL_ALREADY_EXISTS: 'Email address already exists.',
  PHONE_ALREADY_EXISTS: 'Phone number already exists.',
  INVALID_VERIFICATION_CODE: 'Invalid verification code.',
  VERIFICATION_CODE_EXPIRED: 'Verification code has expired.',
  TOO_MANY_ATTEMPTS: 'Too many attempts. Please try again later.',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 15,
  MESSAGE_MAX_LENGTH: 500,
  NOTES_MAX_LENGTH: 1000,
  ADDRESS_MAX_LENGTH: 200,
  EMERGENCY_NOTE_MAX_LENGTH: 300,
} as const;

// Time Constants
export const TIME_CONSTANTS = {
  MILLISECONDS_PER_SECOND: 1000,
  SECONDS_PER_MINUTE: 60,
  MINUTES_PER_HOUR: 60,
  HOURS_PER_DAY: 24,
  DAYS_PER_WEEK: 7,
  MILLISECONDS_PER_MINUTE: 60 * 1000,
  MILLISECONDS_PER_HOUR: 60 * 60 * 1000,
  MILLISECONDS_PER_DAY: 24 * 60 * 60 * 1000,
} as const;

// Distance Constants
export const DISTANCE_CONSTANTS = {
  METERS_PER_KILOMETER: 1000,
  METERS_PER_MILE: 1609.34,
  FEET_PER_METER: 3.28084,
  FEET_PER_MILE: 5280,
  EARTH_RADIUS_KM: 6371,
} as const;

// Battery Levels
export const BATTERY_LEVELS = {
  CRITICAL: 0.05, // 5%
  LOW: 0.15, // 15%
  MEDIUM: 0.30, // 30%
  GOOD: 0.60, // 60%
  HIGH: 0.80, // 80%
} as const;

// Location Accuracy
export const LOCATION_ACCURACY = {
  EXCELLENT: 5, // meters
  GOOD: 10, // meters
  FAIR: 20, // meters
  POOR: 50, // meters
} as const;

// Emergency Response Times
export const RESPONSE_TIMES = {
  EMERGENCY_SERVICES_TARGET: 300, // 5 minutes in seconds
  HELPER_RESPONSE_TARGET: 120, // 2 minutes in seconds
  NOTIFICATION_DELIVERY_TARGET: 2, // 2 seconds
  LOCATION_UPDATE_TARGET: 5, // 5 seconds
} as const;