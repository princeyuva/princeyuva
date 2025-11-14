/**
 * Save A Life App - SOS Button Component
 * Critical emergency SOS button with countdown, vibration, and emergency features
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Vibration,
  Dimensions,
  Alert,
  BackHandler,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COMPONENT_THEME, COLORS, ANIMATION_DURATION, SPACING } from '../../styles/theme';
import { EmergencyType } from '../../../shared/types/user';

interface SOSButtonProps {
  // Core functionality
  onPress: (type: EmergencyType) => void;
  onCancel: () => void;

  // Configuration
  countdownDuration?: number; // milliseconds
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showCountdown?: boolean;
  requireConfirmation?: boolean;

  // Emergency types
  emergencyTypes?: EmergencyType[];

  // Styling
  style?: any;
  disabled?: boolean;
  testMode?: boolean;

  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SOSButton: React.FC<SOSButtonProps> = ({
  onPress,
  onCancel,
  countdownDuration = 3000,
  size = 'large',
  showCountdown = true,
  requireConfirmation = true,
  emergencyTypes = [EmergencyType.MEDICAL, EmergencyType.ACCIDENT, EmergencyType.CRIME, EmergencyType.FIRE, EmergencyType.LOST, EmergencyType.OTHER],
  style,
  disabled = false,
  testMode = false,
  accessibilityLabel = 'SOS Emergency Button',
  accessibilityHint = 'Press and hold to activate emergency alert',
}) => {
  // State management
  const [isPressed, setIsPressed] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(countdownDuration / 1000);
  const [showEmergencyTypes, setShowEmergencyTypes] = useState(false);
  const [selectedEmergencyType, setSelectedEmergencyType] = useState<EmergencyType>(EmergencyType.MEDICAL);

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const countdownAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Countdown timer ref
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Start pulse animation
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  // Handle back button during countdown
  useEffect(() => {
    const handleBackButton = () => {
      if (isCountingDown) {
        handleCancel();
        return true;
      }
      return false;
    };

    if (isCountingDown && Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    }

    return () => {
      if (Platform.OS === 'android') {
        BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      }
    };
  }, [isCountingDown]);

  // Get button size
  const getButtonSize = () => {
    const sizes = {
      small: screenWidth * 0.4, // 40% of screen width
      medium: screenWidth * 0.5, // 50% of screen width
      large: screenWidth * 0.6, // 60% of screen width
      xlarge: screenWidth * 0.7, // 70% of screen width
    };
    return sizes[size];
  };

  // Handle press in
  const handlePressIn = () => {
    if (disabled || testMode) return;

    setIsPressed(true);
    setIsCountingDown(true);

    // Start countdown animation
    Animated.timing(scaleAnim, {
      toValue: 0.9,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Start vibration
    if (Platform.OS === 'ios') {
      Vibration.vibrate([0, 200, 100, 200]);
    } else {
      Vibration.vibrate(200);
    }

    // Start countdown
    startCountdown();
  };

  // Handle press out
  const handlePressOut = () => {
    if (disabled || testMode) return;

    if (isCountingDown && countdown > 0) {
      handleCancel();
    }
  };

  // Start countdown
  const startCountdown = () => {
    let remainingTime = countdownDuration / 1000;
    setCountdown(remainingTime);

    countdownTimerRef.current = setInterval(() => {
      remainingTime -= 0.1;
      setCountdown(Math.max(0, remainingTime));

      // Vibrate on each second
      if (Math.floor(remainingTime) !== Math.floor(remainingTime + 0.1)) {
        Vibration.vibrate(100);
      }

      // Countdown animation
      Animated.timing(countdownAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        countdownAnim.setValue(1);
      });

      if (remainingTime <= 0) {
        handleCountdownComplete();
      }
    }, 100);
  };

  // Handle countdown complete
  const handleCountdownComplete = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }

    setIsCountingDown(false);
    setIsPressed(false);

    // Reset scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
    }).start();

    // Vibrate to indicate completion
    Vibration.vibrate([0, 500, 200, 500]);

    if (requireConfirmation && emergencyTypes.length > 1) {
      setShowEmergencyTypes(true);
    } else {
      activateEmergency(selectedEmergencyType);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }

    setIsCountingDown(false);
    setIsPressed(false);
    setCountdown(countdownDuration / 1000);
    setShowEmergencyTypes(false);

    // Reset animations
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
    }).start();

    countdownAnim.setValue(1);

    // Cancel vibration
    Vibration.cancel();

    if (onCancel) {
      onCancel();
    }
  };

  // Activate emergency
  const activateEmergency = (type: EmergencyType) => {
    setShowEmergencyTypes(false);

    // Strong vibration pattern for emergency activation
    Vibration.vibrate([0, 800, 200, 800, 200, 800]);

    if (onPress) {
      onPress(type);
    }
  };

  // Select emergency type
  const handleEmergencyTypeSelect = (type: EmergencyType) => {
    setSelectedEmergencyType(type);
    activateEmergency(type);
  };

  // Get emergency type display name
  const getEmergencyTypeName = (type: EmergencyType): string => {
    const names = {
      [EmergencyType.MEDICAL]: 'Medical Emergency',
      [EmergencyType.ACCIDENT]: 'Accident/Collision',
      [EmergencyType.CRIME]: 'Crime/Safety',
      [EmergencyType.FIRE]: 'Fire',
      [EmergencyType.LOST]: 'Lost/Disoriented',
      [EmergencyType.OTHER]: 'Other',
    };
    return names[type];
  };

  const buttonSize = getButtonSize();

  // Render emergency type selection
  if (showEmergencyTypes) {
    return (
      <View style={[styles.emergencyTypeContainer, style]}>
        <Text style={styles.emergencyTypeTitle}>Select Emergency Type</Text>
        <View style={styles.emergencyTypeGrid}>
          {emergencyTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.emergencyTypeButton,
                selectedEmergencyType === type && styles.selectedEmergencyType,
              ]}
              onPress={() => handleEmergencyTypeSelect(type)}
              accessibilityLabel={getEmergencyTypeName(type)}
              accessibilityRole="button"
            >
              <Text style={[
                styles.emergencyTypeText,
                selectedEmergencyType === type && styles.selectedEmergencyTypeText,
              ]}>
                {getEmergencyTypeName(type)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          accessibilityLabel="Cancel emergency"
          accessibilityRole="button"
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {/* Countdown display */}
      {showCountdown && isCountingDown && (
        <View style={styles.countdownContainer}>
          <Animated.Text
            style={[
              styles.countdownText,
              {
                transform: [
                  {
                    scale: countdownAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1.5, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            {Math.ceil(countdown)}
          </Animated.Text>
          <Text style={styles.cancelHint}>Release to cancel</Text>
        </View>
      )}

      {/* SOS Button */}
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.buttonContainer,
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
          },
          isPressed && styles.buttonPressed,
          disabled && styles.buttonDisabled,
        ]}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            {
              transform: [
                { scale: scaleAnim },
                { scale: pulseAnim },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[COLORS.primaryRed[500], COLORS.primaryRed[600]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.gradientButton,
              {
                width: buttonSize,
                height: buttonSize,
                borderRadius: buttonSize / 2,
              },
            ]}
          >
            <Text style={styles.sosText}>SOS</Text>
          </LinearGradient>
        </Animated.View>

        {/* Emergency ring effect */}
        {isCountingDown && (
          <Animated.View
            style={[
              styles.emergencyRing,
              {
                width: buttonSize + 20,
                height: buttonSize + 20,
                borderRadius: (buttonSize + 20) / 2,
                transform: [
                  {
                    scale: countdownAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1.2, 0.8],
                    }),
                  },
                ],
              },
            ]}
          />
        )}
      </TouchableOpacity>

      {/* Instructions */}
      {!isCountingDown && (
        <Text style={styles.instructions}>
          Press and hold to activate emergency alert
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  buttonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primaryRed[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonPressed: {
    shadowColor: COLORS.primaryRed[600],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  gradientButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.primaryRed[300],
  },
  sosText: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.text.light,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  emergencyRing: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: COLORS.primaryRed[500],
    opacity: 0.6,
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  countdownText: {
    fontSize: 72,
    fontWeight: '900',
    color: COLORS.primaryRed[600],
    marginBottom: SPACING.sm,
  },
  cancelHint: {
    fontSize: 16,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  instructions: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    lineHeight: 22,
  },
  emergencyTypeContainer: {
    flex: 1,
    padding: SPACING.lg,
    backgroundColor: COLORS.background.primary,
    justifyContent: 'center',
  },
  emergencyTypeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  emergencyTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  emergencyTypeButton: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: SPACING.md,
    margin: SPACING.sm,
    minWidth: 140,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border.light,
  },
  selectedEmergencyType: {
    backgroundColor: COLORS.primaryRed[50],
    borderColor: COLORS.primaryRed[500],
  },
  emergencyTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
    lineHeight: 18,
  },
  selectedEmergencyTypeText: {
    color: COLORS.primaryRed[700],
  },
  cancelButton: {
    alignSelf: 'center',
    padding: SPACING.md,
    borderRadius: 8,
    backgroundColor: COLORS.neutral[100],
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
});

export default SOSButton;