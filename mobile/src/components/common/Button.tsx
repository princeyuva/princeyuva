/**
 * Save A Life App - Common Button Component
 * Reusable button component with multiple variants and emergency-specific styles
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Platform,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COMPONENT_THEME, COLORS } from '../../styles/theme';
import { TYPOGRAPHY_STYLES } from '../../styles/typography';

export interface ButtonProps {
  // Basic props
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'emergency' | 'safe' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large' | 'xlarge';

  // State props
  loading?: boolean;
  disabled?: boolean;
  active?: boolean;

  // Styling props
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;

  // Icon props
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';

  // Emergency-specific props
  emergency?: boolean;
  pulseAnimation?: boolean;

  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
}

interface ButtonStyles {
  container: ViewStyle;
  text: TextStyle;
  gradient?: {
    colors: string[];
    start: { x: number; y: number };
    end: { x: number; y: number };
  };
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  active = false,
  style,
  textStyle,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  emergency = false,
  pulseAnimation = false,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
}) => {
  // Determine button styles based on variant and size
  const getButtonStyles = (): ButtonStyles => {
    const baseStyles: ButtonStyles = {
      container: {},
      text: {},
    };

    // Size styles
    const sizeStyles = {
      small: {
        container: {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
          minHeight: 36,
        },
        text: {
          fontSize: 14,
        },
      },
      medium: {
        container: {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 12,
          minHeight: 44,
        },
        text: {
          fontSize: 16,
        },
      },
      large: {
        container: {
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 16,
          minHeight: 52,
        },
        text: {
          fontSize: 18,
        },
      },
      xlarge: {
        container: {
          paddingVertical: 20,
          paddingHorizontal: 40,
          borderRadius: 20,
          minHeight: 60,
        },
        text: {
          fontSize: 20,
        },
      },
    };

    // Variant styles
    const variantStyles = {
      primary: {
        container: {
          backgroundColor: COLORS.primaryRed[500],
          shadowColor: COLORS.shadow.dark,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        },
        text: {
          color: COLORS.text.light,
          fontWeight: '600',
        },
      },
      secondary: {
        container: {
          backgroundColor: COLORS.neutral[100],
          borderWidth: 1,
          borderColor: COLORS.neutral[300],
        },
        text: {
          color: COLORS.text.primary,
          fontWeight: '500',
        },
      },
      emergency: {
        container: {
          backgroundColor: COLORS.primaryRed[500],
          shadowColor: COLORS.primaryRed[500],
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
          borderWidth: 2,
          borderColor: COLORS.primaryRed[300],
        },
        text: {
          color: COLORS.text.light,
          fontWeight: '700',
          fontSize: size === 'xlarge' ? 24 : 18,
          letterSpacing: 1,
        },
        gradient: {
          colors: [COLORS.primaryRed[500], COLORS.primaryRed[600]],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        },
      },
      safe: {
        container: {
          backgroundColor: COLORS.safetyGreen[500],
          shadowColor: COLORS.safetyGreen[500],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        },
        text: {
          color: COLORS.text.light,
          fontWeight: '600',
        },
        gradient: {
          colors: [COLORS.safetyGreen[500], COLORS.safetyGreen[600]],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        },
      },
      outline: {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: COLORS.primaryRed[500],
        },
        text: {
          color: COLORS.primaryRed[500],
          fontWeight: '600',
        },
      },
      ghost: {
        container: {
          backgroundColor: 'transparent',
        },
        text: {
          color: COLORS.primaryRed[500],
          fontWeight: '500',
        },
      },
    };

    // Combine styles
    const combinedStyles = {
      container: {
        ...baseStyles.container,
        ...sizeStyles[size].container,
        ...variantStyles[variant].container,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        flexDirection: 'row' as const,
        opacity: disabled ? 0.5 : active ? 0.8 : 1,
        width: fullWidth ? '100%' : 'auto',
      },
      text: {
        ...baseStyles.text,
        ...sizeStyles[size].text,
        ...variantStyles[variant].text,
        textAlign: 'center' as const,
      },
      gradient: variantStyles[variant].gradient,
    };

    // Disabled state
    if (disabled) {
      combinedStyles.container.backgroundColor = COLORS.neutral[200];
      combinedStyles.text.color = COLORS.neutral[400];
    }

    return combinedStyles;
  };

  const buttonStyles = getButtonStyles();

  // Render button content
  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={buttonStyles.text.color || COLORS.text.light}
        />
      );
    }

    const content = [
      icon && iconPosition === 'left' && (
        <View key="left-icon" style={styles.iconLeft}>
          {icon}
        </View>
      ),
      <Text
        key="text"
        style={[
          buttonStyles.text,
          textStyle,
          icon && styles.textWithIcon,
        ]}
      >
        {title}
      </Text>,
      icon && iconPosition === 'right' && (
        <View key="right-icon" style={styles.iconRight}>
          {icon}
        </View>
      ),
    ].filter(Boolean);

    return <>{content}</>;
  };

  // Determine if gradient should be used
  const useGradient = buttonStyles.gradient && !disabled;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        buttonStyles.container,
        style,
        emergency && styles.emergencyButton,
      ]}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ disabled: disabled || loading }}
      activeOpacity={0.8}
    >
      {useGradient ? (
        <LinearGradient
          colors={buttonStyles.gradient!.colors}
          start={buttonStyles.gradient!.start}
          end={buttonStyles.gradient!.end}
          style={[
            buttonStyles.container,
            { backgroundColor: 'transparent' },
            style,
          ]}
        >
          {renderContent()}
        </LinearGradient>
      ) : (
        renderContent()
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  emergencyButton: {
    // Emergency-specific button styles
    borderWidth: 3,
    borderColor: COLORS.primaryRed[300],
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  textWithIcon: {
    // Adjust text when icon is present
  },
});

export default Button;