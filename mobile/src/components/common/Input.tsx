/**
 * Save A Life App - Common Input Component
 * Reusable input component with validation and emergency-specific features
 */

import React, { useState, forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { COMPONENT_THEME, COLORS, SPACING, BORDER_RADIUS } from '../../styles/theme';
import { TYPOGRAPHY_STYLES } from '../../styles/typography';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  // Label and description
  label?: string;
  description?: string;
  error?: string;
  warning?: string;
  success?: string;

  // Styling
  variant?: 'default' | 'emergency' | 'medical';
  size?: 'small' | 'medium' | 'large';
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;

  // Icons
  leftIcon?: ImageSourcePropType;
  rightIcon?: ImageSourcePropType;
  onRightIconPress?: () => void;

  // Input features
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  clearable?: boolean;
  onClear?: () => void;

  // Validation
  required?: boolean;
  valid?: boolean;
  showValidIndicator?: boolean;

  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const Input = forwardRef<TextInput, InputProps>(({
  label,
  description,
  error,
  warning,
  success,
  variant = 'default',
  size = 'medium',
  containerStyle,
  inputStyle,
  labelStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  showPasswordToggle = false,
  clearable = false,
  onClear,
  required = false,
  valid = false,
  showValidIndicator = false,
  accessibilityLabel,
  accessibilityHint,
  value,
  onChangeText,
  ...textInputProps
}, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  // Get input styles based on variant and state
  const getInputStyles = () => {
    const baseStyle = {
      borderWidth: 1,
      borderRadius: BORDER_RADIUS.input,
      paddingHorizontal: SPACING.md,
      paddingVertical: size === 'small' ? SPACING.sm : SPACING.md,
    };

    const sizeStyles = {
      small: {
        fontSize: 14,
        minHeight: 36,
      },
      medium: {
        fontSize: 16,
        minHeight: 44,
      },
      large: {
        fontSize: 18,
        minHeight: 52,
        paddingVertical: SPACING.lg,
      },
    };

    const variantStyles = {
      default: {
        backgroundColor: COLORS.background.primary,
        borderColor: error ? COLORS.primaryRed[500] : warning ? COLORS.alertOrange[500] : success ? COLORS.safetyGreen[500] : isFocused ? COLORS.infoBlue[500] : COLORS.border.medium,
        color: COLORS.text.primary,
      },
      emergency: {
        backgroundColor: COLORS.primaryRed[50],
        borderColor: error ? COLORS.primaryRed[600] : isFocused ? COLORS.primaryRed[500] : COLORS.primaryRed[300],
        color: COLORS.primaryRed[800],
      },
      medical: {
        backgroundColor: COLORS.infoBlue[50],
        borderColor: error ? COLORS.primaryRed[500] : isFocused ? COLORS.infoBlue[500] : COLORS.infoBlue[200],
        color: COLORS.text.primary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      fontFamily: 'SFProText-Regular',
    };
  };

  const inputStyles = getInputStyles();

  // Handle right icon press
  const handleRightIconPress = () => {
    if (showPasswordToggle) {
      setIsPasswordVisible(!isPasswordVisible);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  // Render right content
  const renderRightContent = () => {
    if (showPasswordToggle) {
      return (
        <TouchableOpacity
          onPress={handleRightIconPress}
          style={styles.iconButton}
          accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
          accessibilityRole="button"
        >
          <Text style={styles.passwordToggleText}>
            {isPasswordVisible ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      );
    }

    if (clearable && value) {
      return (
        <TouchableOpacity
          onPress={onClear || (() => onChangeText?.(''))}
          style={styles.iconButton}
          accessibilityLabel="Clear input"
          accessibilityRole="button"
        >
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      );
    }

    if (rightIcon) {
      if (onRightIconPress) {
        return (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.iconButton}
            accessibilityLabel="Right icon button"
            accessibilityRole="button"
          >
            <Image source={rightIcon} style={styles.rightIcon} />
          </TouchableOpacity>
        );
      }
      return <Image source={rightIcon} style={styles.rightIcon} />;
    }

    if (showValidIndicator && valid) {
      return (
        <View style={styles.validIndicator}>
          <Text style={styles.validIndicatorText}>✓</Text>
        </View>
      );
    }

    return null;
  };

  // Render helper text
  const renderHelperText = () => {
    if (error) {
      return (
        <Text style={[styles.helperText, styles.errorText]}>{error}</Text>
      );
    }
    if (warning) {
      return (
        <Text style={[styles.helperText, styles.warningText]}>{warning}</Text>
      );
    }
    if (success) {
      return (
        <Text style={[styles.helperText, styles.successText]}>{success}</Text>
      );
    }
    if (description) {
      return (
        <Text style={[styles.helperText, styles.descriptionText]}>{description}</Text>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[
            styles.label,
            variant === 'emergency' && styles.emergencyLabel,
            labelStyle,
          ]}>
            {label}
          </Text>
          {required && (
            <Text style={[styles.required, variant === 'emergency' && styles.emergencyRequired]}>
              *
            </Text>
          )}
        </View>
      )}

      {/* Input Container */}
      <View style={[
        styles.inputContainer,
        error && styles.errorContainer,
        isFocused && styles.focusedContainer,
      ]}>
        {/* Left Icon */}
        {leftIcon && (
          <Image source={leftIcon} style={styles.leftIcon} />
        )}

        {/* Text Input */}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            inputStyles,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || showPasswordToggle || clearable || showValidIndicator) && styles.inputWithRightIcon,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={variant === 'emergency' ? COLORS.primaryRed[400] : COLORS.text.tertiary}
          accessibilityLabel={accessibilityLabel || label}
          accessibilityHint={accessibilityHint}
          {...textInputProps}
        />

        {/* Right Content */}
        {renderRightContent()}
      </View>

      {/* Helper Text */}
      {renderHelperText()}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY_STYLES.ui.label,
    color: COLORS.text.secondary,
  },
  emergencyLabel: {
    color: COLORS.primaryRed[700],
    fontWeight: '600',
  },
  required: {
    color: COLORS.primaryRed[500],
    marginLeft: 2,
    fontSize: 14,
    fontWeight: '600',
  },
  emergencyRequired: {
    color: COLORS.primaryRed[600],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.border.medium,
  },
  errorContainer: {
    borderColor: COLORS.primaryRed[500],
    backgroundColor: COLORS.primaryRed[50],
  },
  focusedContainer: {
    borderColor: COLORS.infoBlue[500],
    shadowColor: COLORS.infoBlue[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text.primary,
    paddingVertical: SPACING.md,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  leftIcon: {
    width: 20,
    height: 20,
    marginLeft: SPACING.md,
    marginRight: SPACING.sm,
    tintColor: COLORS.neutral[400],
  },
  rightIcon: {
    width: 20,
    height: 20,
    marginHorizontal: SPACING.md,
    tintColor: COLORS.neutral[400],
  },
  iconButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordToggleText: {
    color: COLORS.infoBlue[500],
    fontSize: 14,
    fontWeight: '500',
  },
  clearText: {
    color: COLORS.neutral[400],
    fontSize: 18,
    fontWeight: 'bold',
  },
  validIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.safetyGreen[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  validIndicatorText: {
    color: COLORS.text.light,
    fontSize: 12,
    fontWeight: 'bold',
  },
  helperText: {
    fontSize: 14,
    marginTop: SPACING.xs,
    lineHeight: 18,
  },
  errorText: {
    color: COLORS.primaryRed[600],
  },
  warningText: {
    color: COLORS.alertOrange[600],
  },
  successText: {
    color: COLORS.safetyGreen[600],
  },
  descriptionText: {
    color: COLORS.text.secondary,
  },
});

Input.displayName = 'Input';

export default Input;