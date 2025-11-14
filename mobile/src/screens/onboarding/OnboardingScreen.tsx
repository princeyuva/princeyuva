/**
 * Save A Life App - Onboarding Screen
 * 3-screen onboarding flow: Welcome, Permissions, Quick Setup
 */

import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
  PermissionsAndroid,
  Alert,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import { COLORS, GRADIENTS, SPACING, ANIMATION_DURATION } from '../../styles/theme';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface OnboardingScreenProps {
  navigation: any;
}

type OnboardingStep = 'welcome' | 'permissions' | 'quickSetup' | 'complete';

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [permissions, setPermissions] = useState({
    location: false,
    notifications: false,
    contacts: false,
    camera: false,
  });
  const [emergencyContact, setEmergencyContact] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [locationSharing, setLocationSharing] = useState('always');

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Animate screen transitions
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION.normal,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION.normal,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Required',
            message: 'Save A Life needs access to your location to send help in emergencies and share your location with emergency contacts.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'Grant',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      // For iOS, location permission is handled through Info.plist
      return true;
    } catch (err) {
      console.warn('Location permission error:', err);
      return false;
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    // In a real app, this would use react-native-permissions
    // For now, simulate permission grant
    return true;
  };

  // Request contacts permission
  const requestContactsPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission Required',
            message: 'Save A Life needs access to your contacts to set up emergency contacts.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'Grant',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (err) {
      console.warn('Contacts permission error:', err);
      return false;
    }
  };

  // Request camera permission
  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission Required',
            message: 'Save A Life needs camera access for medical documentation and QR code scanning.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'Grant',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (err) {
      console.warn('Camera permission error:', err);
      return false;
    }
  };

  // Handle permission request
  const handleRequestPermission = async (permission: keyof typeof permissions) => {
    let granted = false;

    switch (permission) {
      case 'location':
        granted = await requestLocationPermission();
        break;
      case 'notifications':
        granted = await requestNotificationPermission();
        break;
      case 'contacts':
        granted = await requestContactsPermission();
        break;
      case 'camera':
        granted = await requestCameraPermission();
        break;
    }

    setPermissions(prev => ({ ...prev, [permission]: granted }));

    if (!granted) {
      Alert.alert(
        'Permission Required',
        `This permission is required for Save A Life to function properly. Please enable it in your device settings.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  // Grant all permissions
  const grantAllPermissions = async () => {
    const locationGranted = await requestLocationPermission();
    const notificationsGranted = await requestNotificationPermission();
    const contactsGranted = await requestContactsPermission();
    const cameraGranted = await requestCameraPermission();

    setPermissions({
      location: locationGranted,
      notifications: notificationsGranted,
      contacts: contactsGranted,
      camera: cameraGranted,
    });

    const allGranted = locationGranted && notificationsGranted && contactsGranted && cameraGranted;

    if (allGranted) {
      setCurrentStep('quickSetup');
    } else {
      Alert.alert(
        'Permissions Required',
        'Some permissions are required for the app to function properly. You can enable them later in settings.'
      );
    }
  };

  // Handle onboarding completion
  const handleCompleteSetup = () => {
    // In a real app, this would save the settings and create user account
    navigation.replace('Login');
  };

  // Render welcome screen
  const renderWelcomeScreen = () => (
    <Animated.View
      style={[
        styles.stepContent,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <LinearGradient
          colors={GRADIENTS.welcomeGradient.colors}
          start={GRADIENTS.welcomeGradient.start}
          end={GRADIENTS.welcomeGradient.end}
          style={styles.iconGradient}
        >
          <Icon name="shield-checkmark" size={80} color={COLORS.text.light} />
        </LinearGradient>
      </View>

      <Text style={styles.title}>Save A Life</Text>
      <Text style={styles.subtitle}>Your Emergency Companion</Text>

      <Text style={styles.description}>
        Instant help when you need it most. One-touch SOS, AI-powered emergency detection,
        and a network of nearby helpers ready to assist.
      </Text>

      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <Icon name="alert-circle" size={24} color={COLORS.primaryRed[500]} />
          <Text style={styles.featureText}>One-touch SOS</Text>
        </View>
        <View style={styles.featureItem}>
          <Icon name="analytics" size={24} color={COLORS.infoBlue[500]} />
          <Text style={styles.featureText}>AI Detection</Text>
        </View>
        <View style={styles.featureItem}>
          <Icon name="people" size={24} color={COLORS.safetyGreen[500]} />
          <Text style={styles.featureText}>Helper Network</Text>
        </View>
      </View>

      <Button
        title="Continue"
        onPress={() => setCurrentStep('permissions')}
        variant="primary"
        size="large"
        style={styles.continueButton}
      />
    </Animated.View>
  );

  // Render permissions screen
  const renderPermissionsScreen = () => (
    <Animated.View
      style={[
        styles.stepContent,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.title}>Permissions</Text>
      <Text style={styles.subtitle}>
        Save A Life needs these permissions to keep you safe
      </Text>

      <ScrollView style={styles.permissionsList} showsVerticalScrollIndicator={false}>
        <Card
          title="Location Access"
          subtitle="Always allow for emergencies"
          variant="info"
          leftIcon={
            <Icon
              name="location"
              size={24}
              color={permissions.location ? COLORS.safetyGreen[500] : COLORS.neutral[400]}
            />
          }
          onPress={() => handleRequestPermission('location')}
          style={styles.permissionCard}
        >
          <Text style={styles.permissionDescription}>
            Required to send your location to emergency services and helpers when you need help.
          </Text>
          <Text style={[styles.permissionStatus, { color: permissions.location ? COLORS.safetyGreen[500] : COLORS.neutral[400] }]}>
            {permissions.location ? '✓ Granted' : 'Required'}
          </Text>
        </Card>

        <Card
          title="Notifications"
          subtitle="Critical alerts and updates"
          variant="info"
          leftIcon={
            <Icon
              name="notifications"
              size={24}
              color={permissions.notifications ? COLORS.safetyGreen[500] : COLORS.neutral[400]}
            />
          }
          onPress={() => handleRequestPermission('notifications')}
          style={styles.permissionCard}
        >
          <Text style={styles.permissionDescription}>
            Receive emergency alerts, helper notifications, and safety updates.
          </Text>
          <Text style={[styles.permissionStatus, { color: permissions.notifications ? COLORS.safetyGreen[500] : COLORS.neutral[400] }]}>
            {permissions.notifications ? '✓ Granted' : 'Required'}
          </Text>
        </Card>

        <Card
          title="Contacts"
          subtitle="Emergency contacts setup"
          variant="info"
          leftIcon={
            <Icon
              name="people"
              size={24}
              color={permissions.contacts ? COLORS.safetyGreen[500] : COLORS.neutral[400]}
            />
          }
          onPress={() => handleRequestPermission('contacts')}
          style={styles.permissionCard}
        >
          <Text style={styles.permissionDescription}>
            Access your contacts to easily set up emergency contacts who will be notified in an emergency.
          </Text>
          <Text style={[styles.permissionStatus, { color: permissions.contacts ? COLORS.safetyGreen[500] : COLORS.neutral[400] }]}>
            {permissions.contacts ? '✓ Granted' : 'Required'}
          </Text>
        </Card>

        <Card
          title="Camera"
          subtitle="Medical documentation"
          variant="info"
          leftIcon={
            <Icon
              name="camera"
              size={24}
              color={permissions.camera ? COLORS.safetyGreen[500] : COLORS.neutral[400]}
            />
          }
          onPress={() => handleRequestPermission('camera')}
          style={styles.permissionCard}
        >
          <Text style={styles.permissionDescription}>
            For medical documentation, QR code scanning, and profile photos.
          </Text>
          <Text style={[styles.permissionStatus, { color: permissions.camera ? COLORS.safetyGreen[500] : COLORS.neutral[400] }]}>
            {permissions.camera ? '✓ Granted' : 'Required'}
          </Text>
        </Card>
      </ScrollView>

      <View style={styles.permissionButtons}>
        <Button
          title="Grant All Permissions"
          onPress={grantAllPermissions}
          variant="primary"
          size="large"
          style={styles.grantButton}
        />
        <Button
          title="Skip for Now"
          onPress={() => setCurrentStep('quickSetup')}
          variant="outline"
          size="medium"
          style={styles.skipButton}
        />
      </View>
    </Animated.View>
  );

  // Render quick setup screen
  const renderQuickSetupScreen = () => (
    <Animated.View
      style={[
        styles.stepContent,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.title}>Quick Setup</Text>
      <Text style={styles.subtitle}>
        Let's get you ready for emergencies
      </Text>

      <ScrollView style={styles.setupForm} showsVerticalScrollIndicator={false}>
        <Card
          title="Emergency Contact"
          subtitle="At least one contact is required"
          variant="medical"
          style={styles.setupCard}
        >
          <Text style={styles.setupLabel}>
            Enter phone number of your primary emergency contact
          </Text>
          {/* In a real app, this would be an Input component */}
          <Text style={styles.setupInputPlaceholder}>
            +1 (555) 123-4567
          </Text>
        </Card>

        <Card
          title="Medical Conditions"
          subtitle="Optional but recommended"
          variant="medical"
          style={styles.setupCard}
        >
          <Text style={styles.setupLabel}>
            Any medical conditions emergency responders should know about?
          </Text>
          <Text style={styles.setupInputPlaceholder}>
            e.g., Diabetes, Allergies, Heart condition
          </Text>
        </Card>

        <Card
          title="Location Sharing"
          subtitle="Choose your preference"
          variant="info"
          style={styles.setupCard}
        >
          <Text style={styles.setupLabel}>
            Share your location during emergencies?
          </Text>
          {/* In a real app, this would be radio buttons */}
          <View style={styles.locationOptions}>
            <Text style={styles.locationOption}>Always share</Text>
            <Text style={styles.locationOption}>Share during emergencies only</Text>
            <Text style={styles.locationOption}>Ask me first</Text>
          </View>
        </Card>
      </ScrollView>

      <Button
        title="Complete Setup"
        onPress={handleCompleteSetup}
        variant="primary"
        size="large"
        emergency
        style={styles.completeButton}
      />
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={GRADIENTS.welcomeGradient.colors}
      start={GRADIENTS.welcomeGradient.start}
      end={GRADIENTS.welcomeGradient.end}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width:
                  currentStep === 'welcome'
                    ? '33%'
                    : currentStep === 'permissions'
                    ? '66%'
                    : '100%',
              },
            ]}
          />
        </View>
        <Text style={styles.stepIndicator}>
          {currentStep === 'welcome' && 'Step 1 of 3'}
          {currentStep === 'permissions' && 'Step 2 of 3'}
          {currentStep === 'quickSetup' && 'Step 3 of 3'}
        </Text>
      </View>

      {currentStep === 'welcome' && renderWelcomeScreen()}
      {currentStep === 'permissions' && renderPermissionsScreen()}
      {currentStep === 'quickSetup' && renderQuickSetupScreen()}
    </LinearGradient>
  );
};

// Add Text component for styles
import { Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: COLORS.background.primary,
    borderRadius: 2,
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.text.light,
    borderRadius: 2,
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.light,
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text.light,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.light,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    opacity: 0.9,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text.light,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    opacity: 0.8,
    paddingHorizontal: SPACING.md,
  },
  featuresContainer: {
    marginBottom: SPACING.xxl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginLeft: SPACING.md,
  },
  continueButton: {
    marginTop: 'auto',
  },
  permissionsList: {
    flex: 1,
    marginBottom: SPACING.lg,
  },
  permissionCard: {
    marginBottom: SPACING.md,
  },
  permissionDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  permissionStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  permissionButtons: {
    marginTop: 'auto',
  },
  grantButton: {
    marginBottom: SPACING.sm,
  },
  skipButton: {
    alignSelf: 'center',
  },
  setupForm: {
    flex: 1,
    marginBottom: SPACING.lg,
  },
  setupCard: {
    marginBottom: SPACING.md,
  },
  setupLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  setupInputPlaceholder: {
    fontSize: 16,
    color: COLORS.text.tertiary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
  },
  locationOptions: {
    marginTop: SPACING.sm,
  },
  locationOption: {
    fontSize: 16,
    color: COLORS.text.primary,
    paddingVertical: SPACING.xs,
  },
  completeButton: {
    marginTop: 'auto',
  },
});

export default OnboardingScreen;