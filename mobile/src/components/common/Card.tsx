/**
 * Save A Life App - Common Card Component
 * Reusable card component with multiple variants for different use cases
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COMPONENT_THEME, COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../styles/theme';
import { TYPOGRAPHY_STYLES } from '../../styles/typography';

export interface CardProps {
  // Content props
  title?: string;
  subtitle?: string;
  description?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  image?: ImageSourcePropType;

  // Styling props
  variant?: 'default' | 'emergency' | 'safe' | 'warning' | 'info' | 'medical' | 'helper';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  contentStyle?: ViewStyle;

  // Interaction props
  onPress?: () => void;
  disabled?: boolean;
  active?: boolean;

  // Layout props
  horizontal?: boolean;
  showShadow?: boolean;
  showBorder?: boolean;

  // Accessibility
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  description,
  leftIcon,
  rightIcon,
  image,
  variant = 'default',
  size = 'medium',
  style,
  contentStyle,
  onPress,
  disabled = false,
  active = false,
  horizontal = false,
  showShadow = true,
  showBorder = true,
  accessible = true,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
}) => {
  // Get card styles based on variant
  const getCardStyles = () => {
    const variantStyles = {
      default: {
        container: {
          backgroundColor: COLORS.background.primary,
          borderColor: COLORS.border.light,
        },
        title: {
          color: COLORS.text.primary,
        },
        subtitle: {
          color: COLORS.text.secondary,
        },
        description: {
          color: COLORS.text.primary,
        },
      },
      emergency: {
        container: {
          backgroundColor: COLORS.primaryRed[50],
          borderColor: COLORS.primaryRed[200],
          borderWidth: 2,
        },
        title: {
          color: COLORS.primaryRed[700],
        },
        subtitle: {
          color: COLORS.primaryRed[600],
        },
        description: {
          color: COLORS.primaryRed[600],
        },
        gradient: {
          colors: [COLORS.primaryRed[100], COLORS.primaryRed[50]],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        },
      },
      safe: {
        container: {
          backgroundColor: COLORS.safetyGreen[50],
          borderColor: COLORS.safetyGreen[200],
        },
        title: {
          color: COLORS.safetyGreen[700],
        },
        subtitle: {
          color: COLORS.safetyGreen[600],
        },
        description: {
          color: COLORS.safetyGreen[600],
        },
      },
      warning: {
        container: {
          backgroundColor: COLORS.alertOrange[50],
          borderColor: COLORS.alertOrange[200],
        },
        title: {
          color: COLORS.alertOrange[700],
        },
        subtitle: {
          color: COLORS.alertOrange[600],
        },
        description: {
          color: COLORS.alertOrange[600],
        },
      },
      info: {
        container: {
          backgroundColor: COLORS.infoBlue[50],
          borderColor: COLORS.infoBlue[200],
        },
        title: {
          color: COLORS.infoBlue[700],
        },
        subtitle: {
          color: COLORS.infoBlue[600],
        },
        description: {
          color: COLORS.infoBlue[600],
        },
      },
      medical: {
        container: {
          backgroundColor: COLORS.background.primary,
          borderColor: COLORS.infoBlue[200],
          borderWidth: 1,
        },
        title: {
          color: COLORS.text.primary,
          fontWeight: '600',
        },
        subtitle: {
          color: COLORS.text.secondary,
        },
        description: {
          color: COLORS.text.primary,
        },
      },
      helper: {
        container: {
          backgroundColor: COLORS.background.primary,
          borderColor: COLORS.safetyGreen[200],
        },
        title: {
          color: COLORS.text.primary,
        },
        subtitle: {
          color: COLORS.text.secondary,
        },
        description: {
          color: COLORS.text.primary,
        },
      },
    };

    const sizeStyles = {
      small: {
        container: {
          padding: SPACING.sm,
          borderRadius: BORDER_RADIUS.sm,
        },
        title: {
          fontSize: 16,
          fontWeight: '600',
        },
        subtitle: {
          fontSize: 14,
        },
        description: {
          fontSize: 12,
        },
      },
      medium: {
        container: {
          padding: SPACING.md,
          borderRadius: BORDER_RADIUS.md,
        },
        title: {
          fontSize: 18,
          fontWeight: '600',
        },
        subtitle: {
          fontSize: 16,
        },
        description: {
          fontSize: 14,
        },
      },
      large: {
        container: {
          padding: SPACING.lg,
          borderRadius: BORDER_RADIUS.lg,
        },
        title: {
          fontSize: 20,
          fontWeight: '700',
        },
        subtitle: {
          fontSize: 18,
        },
        description: {
          fontSize: 16,
        },
      },
    };

    return {
      ...variantStyles[variant],
      ...sizeStyles[size],
    };
  };

  const cardStyles = getCardStyles();

  // Shadow styles
  const shadowStyle = showShadow ? (variant === 'emergency' ? SHADOWS.emergency : SHADOWS.md) : {};

  // Border styles
  const borderStyle = showBorder ? {
    borderWidth: cardStyles.container.borderWidth || 1,
    borderColor: cardStyles.container.borderColor,
  } : {};

  // Combine container styles
  const containerStyle = [
    styles.container,
    cardStyles.container,
    shadowStyle,
    borderStyle,
    {
      opacity: disabled ? 0.5 : active ? 0.8 : 1,
      flexDirection: horizontal ? 'row' : 'column',
    },
    style,
  ];

  const contentContainerStyle = [
    styles.content,
    horizontal && styles.horizontalContent,
    contentStyle,
  ];

  // Render header section
  const renderHeader = () => {
    if (!title && !leftIcon && !rightIcon) return null;

    return (
      <View style={styles.header}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <View style={styles.titleContainer}>
          {title && (
            <Text style={[styles.title, cardStyles.title]}>{title}</Text>
          )}
          {subtitle && (
            <Text style={[styles.subtitle, cardStyles.subtitle]}>{subtitle}</Text>
          )}
        </View>
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
    );
  };

  // Render image
  const renderImage = () => {
    if (!image) return null;

    return (
      <Image
        source={image}
        style={[
          styles.image,
          horizontal ? styles.horizontalImage : styles.verticalImage,
        ]}
        resizeMode="cover"
      />
    );
  };

  // Render description
  const renderDescription = () => {
    if (!description) return null;

    return (
      <Text style={[styles.description, cardStyles.description]}>
        {description}
      </Text>
    );
  };

  // Determine if we need gradient background
  const useGradient = cardStyles.gradient && !disabled;

  const CardComponent = useGradient ? LinearGradient : View;
  const gradientProps = useGradient ? cardStyles.gradient : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || !onPress}
      style={containerStyle}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole={onPress ? accessibilityRole : undefined}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <CardComponent
        {...gradientProps}
        style={StyleSheet.flatten(contentContainerStyle)}
      >
        {renderImage()}
        <View style={styles.textContent}>
          {renderHeader()}
          {renderDescription()}
        </View>
      </CardComponent>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background.primary,
    marginVertical: SPACING.xs,
  },
  content: {
    flex: 1,
  },
  horizontalContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  titleContainer: {
    flex: 1,
  },
  rightIcon: {
    marginLeft: SPACING.sm,
  },
  title: {
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    lineHeight: 20,
  },
  description: {
    lineHeight: 22,
  },
  image: {
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
  },
  verticalImage: {
    width: '100%',
    height: 120,
  },
  horizontalImage: {
    width: 80,
    height: 80,
    marginRight: SPACING.md,
    borderRadius: BORDER_RADIUS.round,
  },
});

export default Card;