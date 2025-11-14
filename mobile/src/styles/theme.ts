/**
 * Save A Life App Theme System
 * Complete theme definition including colors, typography, spacing, and component styles
 */

import { COLORS, GRADIENTS, getColorByPriority, getStatusColor } from './colors';
import { TYPOGRAPHY_STYLES, FONT_FAMILY, FONT_SIZES, FONT_WEIGHTS } from './typography';

// Spacing System (8pt grid)
export const SPACING = {
  // Base spacing unit (8px)
  xs: 4,    // 0.5rem
  sm: 8,    // 1rem
  md: 16,   // 2rem
  lg: 24,   // 3rem
  xl: 32,   // 4rem
  xxl: 48,  // 6rem
  xxxl: 64, // 8rem

  // Component-specific spacing
  padding: {
    container: 16,
    card: 16,
    button: 12,
    input: 16,
    modal: 24,
    screen: 16,
  },
  margin: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  gap: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
} as const;

// Border Radius System
export const BORDER_RADIUS = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 9999, // Full circle
  // Component-specific radius
  button: 12,
  card: 16,
  input: 8,
  modal: 20,
  avatar: 9999,
} as const;

// Shadow System
export const SHADOWS = {
  none: 'none',
  sm: {
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: COLORS.shadow.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  // Emergency-specific shadows
  emergency: {
    shadowColor: COLORS.primaryRed[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  success: {
    shadowColor: COLORS.safetyGreen[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 750,
  // Emergency-specific animations
  emergency: {
    sosPulse: 1000,
    alertBlink: 500,
    countdown: 1000,
    slideUp: 250,
    fadeIn: 200,
  },
} as const;

// Animation Easing
export const EASING = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  // Custom easing for emergency animations
  emergency: {
    urgent: 'cubic-bezier(0.4, 0.0, 0.2, 1)', // Fast, snappy
    alert: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Spring-like
    countdown: 'cubic-bezier(0.4, 0.0, 0.6, 1)', // Emphasized
  },
} as const;

// Z-Index Levels
export const Z_INDEX = {
  background: -1,
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  popover: 400,
  tooltip: 500,
  toast: 600,
  loading: 700,
  overlay: 800,
  emergency: 999, // Highest priority for emergency alerts
  emergencyModal: 1000,
} as const;

// Breakpoints for Responsive Design
export const BREAKPOINTS = {
  small: 375,  // iPhone SE
  medium: 414, // iPhone 12/13/14
  large: 768,  // iPad mini
  xlarge: 1024, // iPad
  xxlarge: 1440, // iPad Pro
} as const;

// Component Theme Definitions
export const COMPONENT_THEME = {
  // SOS Button Theme
  sosButton: {
    container: {
      width: 200,
      height: 200,
      borderRadius: BORDER_RADIUS.round,
      backgroundColor: COLORS.primaryRed[500],
      shadow: SHADOWS.emergency,
      // Animation props
      pulseAnimation: {
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
      },
    },
    text: {
      ...TYPOGRAPHY_STYLES.emergency.sosButton,
      color: COLORS.text.light,
    },
    states: {
      pressed: {
        backgroundColor: COLORS.primaryRed[600],
        transform: [{ scale: 0.95 }],
      },
      disabled: {
        backgroundColor: COLORS.neutral[300],
        opacity: 0.6,
      },
    },
  },

  // Safe Button Theme
  safeButton: {
    container: {
      paddingVertical: SPACING.padding.button,
      paddingHorizontal: SPACING.padding.button * 2,
      borderRadius: BORDER_RADIUS.button,
      backgroundColor: COLORS.safetyGreen[500],
      shadow: SHADOWS.success,
    },
    text: {
      ...TYPOGRAPHY_STYLES.ui.button,
      color: COLORS.text.light,
    },
    states: {
      pressed: {
        backgroundColor: COLORS.safetyGreen[600],
        transform: [{ scale: 0.95 }],
      },
    },
  },

  // Card Theme
  card: {
    container: {
      backgroundColor: COLORS.background.primary,
      borderRadius: BORDER_RADIUS.card,
      padding: SPACING.padding.card,
      shadow: SHADOWS.md,
      borderWidth: 1,
      borderColor: COLORS.border.light,
    },
    header: {
      marginBottom: SPACING.margin.sm,
    },
    title: {
      ...TYPOGRAPHY_STYLES.headlines.h4,
      color: COLORS.text.primary,
    },
    subtitle: {
      ...TYPOGRAPHY_STYLES.body.small,
      color: COLORS.text.secondary,
    },
    content: {
      ...TYPOGRAPHY_STYLES.body.regular,
      color: COLORS.text.primary,
    },
  },

  // Input Theme
  input: {
    container: {
      borderWidth: 1,
      borderColor: COLORS.border.medium,
      borderRadius: BORDER_RADIUS.input,
      padding: SPACING.padding.input,
      backgroundColor: COLORS.background.primary,
    },
    text: {
      ...TYPOGRAPHY_STYLES.ui.input,
      color: COLORS.text.primary,
    },
    placeholder: {
      ...TYPOGRAPHY_STYLES.ui.input,
      color: COLORS.text.tertiary,
    },
    label: {
      ...TYPOGRAPHY_STYLES.ui.label,
      color: COLORS.text.secondary,
      marginBottom: SPACING.margin.xs,
    },
    states: {
      focused: {
        borderColor: COLORS.infoBlue[500],
        shadow: {
          shadowColor: COLORS.infoBlue[500],
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        },
      },
      error: {
        borderColor: COLORS.primaryRed[500],
      },
      disabled: {
        backgroundColor: COLORS.neutral[100],
        borderColor: COLORS.neutral[300],
      },
    },
  },

  // Emergency Alert Theme
  emergencyAlert: {
    container: {
      backgroundColor: COLORS.primaryRed[50],
      borderColor: COLORS.primaryRed[200],
      borderWidth: 2,
      borderRadius: BORDER_RADIUS.card,
      padding: SPACING.padding.card,
      shadow: SHADOWS.emergency,
    },
    title: {
      ...TYPOGRAPHY_STYLES.emergency.alertTitle,
      color: COLORS.primaryRed[700],
    },
    message: {
      ...TYPOGRAPHY_STYLES.emergency.alertMessage,
      color: COLORS.primaryRed[600],
    },
    countdown: {
      ...TYPOGRAPHY_STYLES.emergency.countdown,
      color: COLORS.primaryRed[800],
      textAlign: 'center' as const,
    },
  },

  // Medical ID Theme
  medicalId: {
    container: {
      backgroundColor: COLORS.background.primary,
      borderRadius: BORDER_RADIUS.card,
      padding: SPACING.padding.card,
      shadow: SHADOWS.md,
    },
    header: {
      ...TYPOGRAPHY_STYLES.medical.header,
      color: COLORS.text.primary,
      marginBottom: SPACING.margin.md,
    },
    section: {
      marginBottom: SPACING.margin.lg,
    },
    label: {
      ...TYPOGRAPHY_STYLES.medical.label,
      color: COLORS.text.secondary,
      marginBottom: SPACING.margin.xs,
    },
    value: {
      ...TYPOGRAPHY_STYLES.medical.value,
      color: COLORS.text.primary,
    },
    critical: {
      ...TYPOGRAPHY_STYLES.medical.critical,
      color: COLORS.primaryRed[600],
    },
  },

  // Helper Card Theme
  helperCard: {
    container: {
      backgroundColor: COLORS.background.primary,
      borderRadius: BORDER_RADIUS.card,
      padding: SPACING.padding.card,
      shadow: SHADOWS.md,
      borderWidth: 1,
      borderColor: COLORS.border.light,
    },
    verifiedBadge: {
      backgroundColor: COLORS.safetyGreen[100],
      color: COLORS.safetyGreen[700],
    },
    skillBadge: {
      backgroundColor: COLORS.infoBlue[100],
      color: COLORS.infoBlue[700],
    },
  },

  // Navigation Theme
  navigation: {
    tabBar: {
      backgroundColor: COLORS.background.primary,
      borderTopColor: COLORS.border.medium,
      borderTopWidth: 1,
      height: 80,
      paddingBottom: 20,
      paddingTop: 8,
    },
    tabLabel: {
      ...TYPOGRAPHY_STYLES.navigation.tabLabel,
      color: COLORS.text.tertiary,
    },
    tabLabelActive: {
      color: COLORS.primaryRed[500],
    },
    header: {
      backgroundColor: COLORS.background.primary,
      shadow: SHADOWS.sm,
    },
    headerTitle: {
      ...TYPOGRAPHY_STYLES.navigation.headerTitle,
      color: COLORS.text.primary,
    },
  },

  // Modal Theme
  modal: {
    overlay: {
      backgroundColor: COLORS.overlay.medium,
    },
    container: {
      backgroundColor: COLORS.background.primary,
      borderRadius: BORDER_RADIUS.modal,
      padding: SPACING.padding.modal,
      shadow: SHADOWS.xl,
      maxHeight: '80%',
    },
    title: {
      ...TYPOGRAPHY_STYLES.headlines.h3,
      color: COLORS.text.primary,
      marginBottom: SPACING.margin.md,
    },
  },
} as const;

// Dark Mode Theme Overrides
export const DARK_THEME = {
  ...COMPONENT_THEME,
  card: {
    ...COMPONENT_THEME.card,
    container: {
      ...COMPONENT_THEME.card.container,
      backgroundColor: COLORS.background.darkSecondary,
      borderColor: COLORS.neutral[600],
    },
    title: {
      ...COMPONENT_THEME.card.title,
      color: COLORS.text.light,
    },
    subtitle: {
      ...COMPONENT_THEME.card.subtitle,
      color: COLORS.neutral[400],
    },
    content: {
      ...COMPONENT_THEME.card.content,
      color: COLORS.text.light,
    },
  },
  input: {
    ...COMPONENT_THEME.input,
    container: {
      ...COMPONENT_THEME.input.container,
      backgroundColor: COLORS.background.darkSecondary,
      borderColor: COLORS.neutral[600],
    },
    text: {
      ...COMPONENT_THEME.input.text,
      color: COLORS.text.light,
    },
    label: {
      ...COMPONENT_THEME.input.label,
      color: COLORS.neutral[400],
    },
  },
  navigation: {
    ...COMPONENT_THEME.navigation,
    tabBar: {
      ...COMPONENT_THEME.navigation.tabBar,
      backgroundColor: COLORS.background.dark,
      borderTopColor: COLORS.neutral[700],
    },
    header: {
      ...COMPONENT_THEME.navigation.header,
      backgroundColor: COLORS.background.dark,
    },
  },
} as const;

// Theme Utility Functions
export const getTheme = (isDarkMode: boolean = false) => {
  return isDarkMode ? DARK_THEME : COMPONENT_THEME;
};

export const getEmergencyTheme = (severity: 'low' | 'medium' | 'high' | 'critical') => {
  const color = getColorByPriority(severity);
  return {
    container: {
      borderColor: color,
      backgroundColor: `${color}10`, // 10% opacity
    },
    title: {
      color: color,
    },
    accent: color,
  };
};

// Complete Theme Export
export const THEME = {
  colors: COLORS,
  gradients: GRADIENTS,
  typography: TYPOGRAPHY_STYLES,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  animation: {
    duration: ANIMATION_DURATION,
    easing: EASING,
  },
  zIndex: Z_INDEX,
  breakpoints: BREAKPOINTS,
  components: COMPONENT_THEME,
  darkMode: DARK_THEME,
} as const;