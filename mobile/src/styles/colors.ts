/**
 * Save A Life App Color Palette
 * Modern, minimal design with clean gradients for emergency response
 */

// Primary Colors
export const COLORS = {
  // Emergency Red - Used for SOS, critical alerts
  primaryRed: {
    50: '#FFF5F5',
    100: '#FED7D7',
    200: '#FEB2B2',
    300: '#FC8181',
    400: '#F56565',
    500: '#FF3B30', // Primary emergency red
    600: '#E53E3E',
    700: '#C53030',
    800: '#9B2C2C',
    900: '#742A2A',
  },

  // Safety Green - Used for safe status, verified helpers
  safetyGreen: {
    50: '#F0FFF4',
    100: '#C6F6D5',
    200: '#9AE6B4',
    300: '#68D391',
    400: '#48BB78',
    500: '#34C759', // Primary safety green
    600: '#30D158',
    700: '#2F9E44',
    800: '#276749',
    900: '#22543D',
  },

  // Alert Orange - Used for warnings, medium priority
  alertOrange: {
    50: '#FFFAF0',
    100: '#FED7AA',
    200: '#FBD38D',
    300: '#F6AD55',
    400: '#ED8936',
    500: '#FF9500', // Primary alert orange
    600: '#DD6B20',
    700: '#C05621',
    800: '#9C4221',
    900: '#7B341E',
  },

  // Info Blue - Used for information, navigation
  infoBlue: {
    50: '#EBF8FF',
    100: '#BEE3F8',
    200: '#90CDF4',
    300: '#63B3ED',
    400: '#4299E1',
    500: '#007AFF', // Primary info blue
    600: '#3182CE',
    700: '#2B6CB0',
    800: '#2C5282',
    900: '#2A4E7C',
  },

  // Neutral Grays
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Semantic Colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',

  // Status Colors
  online: '#34C759',
  offline: '#8E8E93',
  busy: '#FF9500',
  away: '#FF3B30',

  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
    tertiary: '#FFFFFF',
    dark: '#000000',
    darkSecondary: '#1C1C1E',
  },

  // Text Colors
  text: {
    primary: '#000000',
    secondary: '#3C3C43',
    tertiary: '#3C3C4399',
    light: '#FFFFFF',
    dark: '#000000',
  },

  // Border Colors
  border: {
    light: 'rgba(60, 60, 67, 0.29)',
    medium: 'rgba(60, 60, 67, 0.18)',
    dark: 'rgba(60, 60, 67, 0.12)',
  },

  // Overlay Colors
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.7)',
  },

  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(0, 0, 0, 0.3)',
  },
} as const;

// Gradient Definitions
export const GRADIENTS = {
  // SOS Button Gradient - Radial with pulse effect
  sosButton: {
    colors: [COLORS.primaryRed[500], COLORS.primaryRed[400]],
    type: 'radial' as const,
    angle: 90,
  },

  // Safe Status Gradient - Linear
  safeStatus: {
    colors: [COLORS.safetyGreen[500], COLORS.safetyGreen[600]],
    type: 'linear' as const,
    angle: 45,
  },

  // Alert Gradient - Linear
  alertGradient: {
    colors: [COLORS.alertOrange[500], COLORS.alertOrange[400]],
    type: 'linear' as const,
    angle: 135,
  },

  // Info Gradient - Linear
  infoGradient: {
    colors: [COLORS.infoBlue[500], COLORS.infoBlue[400]],
    type: 'linear' as const,
    angle: 45,
  },

  // Background Card Gradient - Subtle
  cardGradient: {
    colors: [COLORS.background.primary, COLORS.background.secondary],
    type: 'linear' as const,
    angle: 180,
  },

  // Onboarding Welcome Gradient - Full screen
  welcomeGradient: {
    colors: [COLORS.infoBlue[500], COLORS.safetyGreen[400]],
    type: 'linear' as const,
    angle: 135,
  },

  // Emergency Screen Gradient - Urgent red
  emergencyScreen: {
    colors: [COLORS.primaryRed[900], COLORS.primaryRed[600]],
    type: 'linear' as const,
    angle: 180,
  },

  // Dark Mode Background Gradient
  darkModeBackground: {
    colors: [COLORS.background.dark, COLORS.background.darkSecondary],
    type: 'linear' as const,
    angle: 180,
  },
} as const;

// Color Utility Functions
export const getColorByPriority = (priority: string): string => {
  switch (priority) {
    case 'critical':
    case 'emergency':
      return COLORS.primaryRed[500];
    case 'high':
      return COLORS.alertOrange[500];
    case 'medium':
      return COLORS.warning;
    case 'low':
    case 'normal':
      return COLORS.infoBlue[500];
    default:
      return COLORS.neutral[500];
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'safe':
    case 'active':
    case 'verified':
      return COLORS.safetyGreen[500];
    case 'danger':
    case 'emergency':
    case 'critical':
      return COLORS.primaryRed[500];
    case 'warning':
    case 'pending':
      return COLORS.alertOrange[500];
    case 'unknown':
    case 'offline':
      return COLORS.neutral[400];
    default:
      return COLORS.neutral[500];
  }
};

export const getEmergencyTypeColor = (type: string): string => {
  switch (type) {
    case 'medical':
      return COLORS.primaryRed[500];
    case 'fire':
      return COLORS.alertOrange[500];
    case 'crime':
      return COLORS.neutral[700];
    case 'accident':
      return COLORS.warning;
    case 'lost':
      return COLORS.infoBlue[500];
    default:
      return COLORS.primaryRed[500];
  }
};

export const getHelperSkillColor = (skill: string): string => {
  switch (skill) {
    case 'first_aid':
    case 'cpr':
    case 'aed':
      return COLORS.safetyGreen[500];
    case 'medical_professional':
      return COLORS.primaryRed[500];
    case 'firefighter':
      return COLORS.alertOrange[500];
    case 'law_enforcement':
      return COLORS.neutral[600];
    default:
      return COLORS.infoBlue[500];
  }
};

// Accessibility-friendly color combinations
export const ACCESSIBLE_COLORS = {
  // High contrast combinations for accessibility
  textOnPrimary: COLORS.text.primary, // Black on white
  textOnDark: COLORS.text.light, // White on dark
  textOnEmergency: COLORS.text.light, // White on emergency red
  textOnSuccess: COLORS.text.primary, // Black on green
  textOnWarning: COLORS.text.primary, // Black on orange
  textOnInfo: COLORS.text.light, // White on blue

  // Border colors with sufficient contrast
  borderOnLight: COLORS.border.light,
  borderOnDark: COLORS.neutral[300],

  // Focus indicators (WCAG compliant)
  focus: COLORS.infoBlue[500],
  focusDark: COLORS.infoBlue[300],
} as const;

// Dark mode color adaptations
export const DARK_MODE_COLORS = {
  background: COLORS.background.dark,
  cardBackground: COLORS.background.darkSecondary,
  textPrimary: COLORS.text.light,
  textSecondary: COLORS.neutral[300],
  border: COLORS.neutral[600],
  overlay: COLORS.overlay.dark,
  shadow: 'rgba(0, 0, 0, 0.5)',
} as const;