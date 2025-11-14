/**
 * Save A Life App Typography System
 * Clean, modern typography optimized for emergency situations and readability
 */

// Font Families
export const FONT_FAMILY = {
  // Primary fonts - SF Pro (iOS system fonts)
  primary: {
    regular: 'SFProText-Regular',
    medium: 'SFProText-Medium',
    semibold: 'SFProText-Semibold',
    bold: 'SFProText-Bold',
    heavy: 'SFProText-Heavy',
    light: 'SFProText-Light',
  },
  // Display fonts - SF Pro Display
  display: {
    regular: 'SFProDisplay-Regular',
    medium: 'SFProDisplay-Medium',
    semibold: 'SFProDisplay-Semibold',
    bold: 'SFProDisplay-Bold',
    heavy: 'SFProDisplay-Heavy',
    light: 'SFProDisplay-Light',
  },
  // Monospace for codes and technical info
  monospace: {
    regular: 'SFMono-Regular',
    medium: 'SFMono-Medium',
    semibold: 'SFMono-Semibold',
    bold: 'SFMono-Bold',
  },
  // Fallback for Android
  fallback: {
    regular: 'Roboto-Regular',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
  },
} as const;

// Font Sizes
export const FONT_SIZES = {
  // Display sizes - for major headlines
  display: {
    xxlarge: 48, // Emergency buttons, major alerts
    xlarge: 40, // Screen titles
    large: 34, // Section headers
    medium: 28, // Card titles
    small: 24, // Sub-headers
  },
  // Text sizes - for body content
  text: {
    xxlarge: 22, // Large body text
    xlarge: 20, // Important text
    large: 18, // Standard body text
    medium: 17, // Default body text (Apple standard)
    small: 16, // Secondary text
    xsmall: 14, // Caption text
    xxsmall: 12, // Fine print
  },
  // UI sizes - for interface elements
  ui: {
    large: 17, // Buttons, inputs
    medium: 16, // Small buttons
    small: 14, // Labels, tags
    xsmall: 12, // Status indicators
  },
  // Emergency-specific sizes
  emergency: {
    sosButton: 64, // SOS button text
    countdown: 72, // Countdown timer
    alertTitle: 28, // Emergency alert titles
    alertMessage: 18, // Emergency alert messages
  },
} as const;

// Font Weights
export const FONT_WEIGHTS = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
  black: '900',
} as const;

// Line Heights
export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
  // Emergency-specific line heights
  emergency: {
    alert: 1.3,
    instructions: 1.5,
    countdown: 1.0,
  },
} as const;

// Letter Spacing
export const LETTER_SPACING = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1.0,
  widest: 2.0,
  // Emergency-specific spacing
  emergency: {
    sosButton: 1.0,
    countdown: 0.5,
  },
} as const;

// Typography Styles
export const TYPOGRAPHY_STYLES = {
  // Emergency Text Styles
  emergency: {
    sosButton: {
      fontFamily: FONT_FAMILY.display.heavy,
      fontSize: FONT_SIZES.emergency.sosButton,
      fontWeight: FONT_WEIGHTS.heavy,
      letterSpacing: LETTER_SPACING.emergency.sosButton,
      textTransform: 'uppercase' as const,
    },
    countdown: {
      fontFamily: FONT_FAMILY.display.bold,
      fontSize: FONT_SIZES.emergency.countdown,
      fontWeight: FONT_WEIGHTS.bold,
      letterSpacing: LETTER_SPACING.emergency.countdown,
    },
    alertTitle: {
      fontFamily: FONT_FAMILY.display.semibold,
      fontSize: FONT_SIZES.emergency.alertTitle,
      fontWeight: FONT_WEIGHTS.semibold,
      lineHeight: LINE_HEIGHTS.emergency.alert,
    },
    alertMessage: {
      fontFamily: FONT_FAMILY.primary.regular,
      fontSize: FONT_SIZES.emergency.alertMessage,
      fontWeight: FONT_WEIGHTS.regular,
      lineHeight: LINE_HEIGHTS.emergency.instructions,
    },
  },

  // Headline Styles
  headlines: {
    h1: {
      fontFamily: FONT_FAMILY.display.bold,
      fontSize: FONT_SIZES.display.xxlarge,
      fontWeight: FONT_WEIGHTS.bold,
      lineHeight: LINE_HEIGHTS.tight,
    },
    h2: {
      fontFamily: FONT_FAMILY.display.semibold,
      fontSize: FONT_SIZES.display.xlarge,
      fontWeight: FONT_WEIGHTS.semibold,
      lineHeight: LINE_HEIGHTS.tight,
    },
    h3: {
      fontFamily: FONT_FAMILY.display.semibold,
      fontSize: FONT_SIZES.display.large,
      fontWeight: FONT_WEIGHTS.semibold,
      lineHeight: LINE_HEIGHTS.normal,
    },
    h4: {
      fontFamily: FONT_FAMILY.display.medium,
      fontSize: FONT_SIZES.display.medium,
      fontWeight: FONT_WEIGHTS.medium,
      lineHeight: LINE_HEIGHTS.normal,
    },
  },

  // Body Text Styles
  body: {
    large: {
      fontFamily: FONT_FAMILY.primary.regular,
      fontSize: FONT_SIZES.text.xxlarge,
      fontWeight: FONT_WEIGHTS.regular,
      lineHeight: LINE_HEIGHTS.relaxed,
    },
    regular: {
      fontFamily: FONT_FAMILY.primary.regular,
      fontSize: FONT_SIZES.text.large,
      fontWeight: FONT_WEIGHTS.regular,
      lineHeight: LINE_HEIGHTS.normal,
    },
    medium: {
      fontFamily: FONT_FAMILY.primary.regular,
      fontSize: FONT_SIZES.text.medium,
      fontWeight: FONT_WEIGHTS.regular,
      lineHeight: LINE_HEIGHTS.normal,
    },
    small: {
      fontFamily: FONT_FAMILY.primary.regular,
      fontSize: FONT_SIZES.text.small,
      fontWeight: FONT_WEIGHTS.regular,
      lineHeight: LINE_HEIGHTS.normal,
    },
  },

  // UI Element Styles
  ui: {
    button: {
      fontFamily: FONT_FAMILY.primary.semibold,
      fontSize: FONT_SIZES.ui.large,
      fontWeight: FONT_WEIGHTS.semibold,
      letterSpacing: LETTER_SPACING.wide,
      textTransform: 'none' as const,
    },
    buttonLarge: {
      fontFamily: FONT_FAMILY.primary.semibold,
      fontSize: FONT_SIZES.text.xlarge,
      fontWeight: FONT_WEIGHTS.semibold,
      letterSpacing: LETTER_SPACING.wide,
    },
    buttonSmall: {
      fontFamily: FONT_FAMILY.primary.medium,
      fontSize: FONT_SIZES.ui.medium,
      fontWeight: FONT_WEIGHTS.medium,
    },
    input: {
      fontFamily: FONT_FAMILY.primary.regular,
      fontSize: FONT_SIZES.ui.large,
      fontWeight: FONT_WEIGHTS.regular,
    },
    label: {
      fontFamily: FONT_FAMILY.primary.medium,
      fontSize: FONT_SIZES.ui.small,
      fontWeight: FONT_WEIGHTS.medium,
      letterSpacing: LETTER_SPACING.wide,
    },
    caption: {
      fontFamily: FONT_FAMILY.primary.regular,
      fontSize: FONT_SIZES.text.xsmall,
      fontWeight: FONT_WEIGHTS.regular,
      lineHeight: LINE_HEIGHTS.normal,
    },
    footnote: {
      fontFamily: FONT_FAMILY.primary.regular,
      fontSize: FONT_SIZES.text.xxsmall,
      fontWeight: FONT_WEIGHTS.regular,
      lineHeight: LINE_HEIGHTS.normal,
    },
  },

  // Navigation Styles
  navigation: {
    tabLabel: {
      fontFamily: FONT_FAMILY.primary.medium,
      fontSize: FONT_SIZES.ui.small,
      fontWeight: FONT_WEIGHTS.medium,
      letterSpacing: LETTER_SPACING.wide,
    },
    headerTitle: {
      fontFamily: FONT_FAMILY.display.semibold,
      fontSize: FONT_SIZES.text.large,
      fontWeight: FONT_WEIGHTS.semibold,
    },
    headerButton: {
      fontFamily: FONT_FAMILY.primary.medium,
      fontSize: FONT_SIZES.ui.medium,
      fontWeight: FONT_WEIGHTS.medium,
    },
  },

  // Status and Indicator Styles
  status: {
    success: {
      fontFamily: FONT_FAMILY.primary.semibold,
      fontSize: FONT_SIZES.ui.small,
      fontWeight: FONT_WEIGHTS.semibold,
      textTransform: 'uppercase' as const,
    },
    warning: {
      fontFamily: FONT_FAMILY.primary.semibold,
      fontSize: FONT_SIZES.ui.small,
      fontWeight: FONT_WEIGHTS.semibold,
      textTransform: 'uppercase' as const,
    },
    error: {
      fontFamily: FONT_FAMILY.primary.semibold,
      fontSize: FONT_SIZES.ui.small,
      fontWeight: FONT_WEIGHTS.semibold,
      textTransform: 'uppercase' as const,
    },
    info: {
      fontFamily: FONT_FAMILY.primary.semibold,
      fontSize: FONT_SIZES.ui.small,
      fontWeight: FONT_WEIGHTS.semibold,
      textTransform: 'uppercase' as const,
    },
  },

  // Medical ID Styles (for readability by first responders)
  medical: {
    header: {
      fontFamily: FONT_FAMILY.display.bold,
      fontSize: FONT_SIZES.text.xlarge,
      fontWeight: FONT_WEIGHTS.bold,
      lineHeight: LINE_HEIGHTS.normal,
    },
    label: {
      fontFamily: FONT_FAMILY.primary.semibold,
      fontSize: FONT_SIZES.text.small,
      fontWeight: FONT_WEIGHTS.semibold,
      letterSpacing: LETTER_SPACING.wide,
      textTransform: 'uppercase' as const,
    },
    value: {
      fontFamily: FONT_FAMILY.primary.regular,
      fontSize: FONT_SIZES.text.medium,
      fontWeight: FONT_WEIGHTS.regular,
      lineHeight: LINE_HEIGHTS.relaxed,
    },
    critical: {
      fontFamily: FONT_FAMILY.primary.bold,
      fontSize: FONT_SIZES.text.medium,
      fontWeight: FONT_WEIGHTS.bold,
      lineHeight: LINE_HEIGHTS.normal,
    },
  },
} as const;

// Typography Utilities
export const getTypographyStyle = (variant: keyof typeof TYPOGRAPHY_STYLES) => {
  return TYPOGRAPHY_STYLES[variant];
};

export const getEmergencyTextStyle = (type: 'sosButton' | 'countdown' | 'alertTitle' | 'alertMessage') => {
  return TYPOGRAPHY_STYLES.emergency[type];
};

export const getHeadlineStyle = (level: 'h1' | 'h2' | 'h3' | 'h4') => {
  return TYPOGRAPHY_STYLES.headlines[level];
};

export const getBodyStyle = (size: 'large' | 'regular' | 'medium' | 'small') => {
  return TYPOGRAPHY_STYLES.body[size];
};

export const getUIStyle = (type: 'button' | 'buttonLarge' | 'buttonSmall' | 'input' | 'label' | 'caption' | 'footnote') => {
  return TYPOGRAPHY_STYLES.ui[type];
};

// Responsive Typography
export const RESPONSIVE typography = {
  // Adjust font sizes for different screen sizes
  smallScreen: {
    scale: 0.9, // 90% of normal size
    breakpoints: { width: 375 },
  },
  mediumScreen: {
    scale: 1.0, // Normal size
    breakpoints: { width: 414 },
  },
  largeScreen: {
    scale: 1.1, // 110% of normal size
    breakpoints: { width: 768 },
  },
} as const;

// Accessibility Typography
export const ACCESSIBILITY_OPTIONS = {
  // High contrast mode
  highContrast: {
    fontWeightAdjustment: 1, // Use bolder weights
    letterSpacingAdjustment: 0.5, // Increase letter spacing
    lineHeightAdjustment: 1.2, // Increase line height
  },
  // Large text mode
  largeText: {
    scale: 1.3, // 130% of normal size
    weightAdjustment: 1, // Use bolder weights for readability
  },
  // Dyslexia-friendly
  dyslexiaFriendly: {
    fontFamily: FONT_FAMILY.primary.regular, // Use sans-serif fonts
    letterSpacing: LETTER_SPACING.wide, // Increase letter spacing
    lineHeight: LINE_HEIGHTS.loose, // Increase line height
    wordSpacing: 1.2, // Increase word spacing
  },
} as const;