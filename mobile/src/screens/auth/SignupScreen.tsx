/**
 * Save A Life App - Signup Screen
 * User registration with form validation and terms acceptance
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';

import { COLORS, SPACING, BORDER_RADIUS } from '../../styles/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nameInputRef = useRef<any>(null);
  const emailInputRef = useRef<any>(null);
  const phoneInputRef = useRef<any>(null);
  const passwordInputRef = useRef<any>(null);
  const confirmPasswordInputRef = useRef<any>(null);

  // Handle input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Full name validation
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.terms = 'You must agree to the Terms of Service';
    }

    if (!formData.agreeToPrivacy) {
      newErrors.privacy = 'You must agree to the Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle signup
  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Account Created!',
        'Your Save A Life account has been created successfully. Please check your email to verify your account.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Signup Failed',
        'Failed to create account. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle login navigation
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  // Open terms link
  const openTerms = () => {
    Linking.openURL('https://savealife.com/terms');
  };

  // Open privacy policy link
  const openPrivacyPolicy = () => {
    Linking.openURL('https://savealife.com/privacy');
  };

  return (
    <LinearGradient
      colors={['#007AFF', '#0051D5', '#003D99']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Icon name="shield-checkmark" size={50} color={COLORS.text.light} />
              </View>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join Save A Life and be prepared for emergencies
            </Text>
          </View>

          {/* Signup Form */}
          <Card style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Sign Up</Text>
              <Text style={styles.formSubtitle}>
                Create your emergency response account
              </Text>
            </View>

            {/* Full Name Input */}
            <Input
              label="Full Name"
              value={formData.fullName}
              onChangeText={(value) => handleInputChange('fullName', value)}
              placeholder="Enter your full name"
              autoCapitalize="words"
              leftIcon={{ uri: 'person-icon' }} // Replace with actual icon
              error={errors.fullName}
              style={styles.input}
              ref={nameInputRef}
              onSubmitEditing={() => emailInputRef.current?.focus()}
            />

            {/* Email Input */}
            <Input
              label="Email Address"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={{ uri: 'mail-icon' }} // Replace with actual icon
              error={errors.email}
              style={styles.input}
              ref={emailInputRef}
              onSubmitEditing={() => phoneInputRef.current?.focus()}
            />

            {/* Phone Input */}
            <Input
              label="Phone Number"
              value={formData.phoneNumber}
              onChangeText={(value) => handleInputChange('phoneNumber', value)}
              placeholder="+1 (555) 123-4567"
              keyboardType="phone-pad"
              leftIcon={{ uri: 'phone-icon' }} // Replace with actual icon
              error={errors.phoneNumber}
              style={styles.input}
              ref={phoneInputRef}
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />

            {/* Password Input */}
            <Input
              label="Password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              placeholder="Create a strong password"
              secureTextEntry={!showPassword}
              showPasswordToggle
              onTogglePassword={() => setShowPassword(!showPassword)}
              leftIcon={{ uri: 'lock-icon' }} // Replace with actual icon
              error={errors.password}
              style={styles.input}
              ref={passwordInputRef}
              onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
            />

            {/* Confirm Password Input */}
            <Input
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              placeholder="Confirm your password"
              secureTextEntry={!showConfirmPassword}
              showPasswordToggle
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              leftIcon={{ uri: 'lock-icon' }} // Replace with actual icon
              error={errors.confirmPassword}
              style={styles.input}
              ref={confirmPasswordInputRef}
              onSubmitEditing={handleSignup}
            />

            {/* Date of Birth (Optional) */}
            <Input
              label="Date of Birth (Optional)"
              value={formData.dateOfBirth}
              onChangeText={(value) => handleInputChange('dateOfBirth', value)}
              placeholder="MM/DD/YYYY"
              leftIcon={{ uri: 'calendar-icon' }} // Replace with actual icon
              style={styles.input}
            />

            {/* Terms and Privacy */}
            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => handleInputChange('agreeToTerms', !formData.agreeToTerms)}
              >
                <View style={[
                  styles.checkbox,
                  formData.agreeToTerms && styles.checkboxChecked
                ]}>
                  {formData.agreeToTerms && (
                    <Icon name="checkmark" size={12} color={COLORS.text.light} />
                  )}
                </View>
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={styles.link} onPress={openTerms}>
                    Terms of Service
                  </Text>
                </Text>
              </TouchableOpacity>

              {errors.terms && (
                <Text style={styles.errorText}>{errors.terms}</Text>
              )}

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => handleInputChange('agreeToPrivacy', !formData.agreeToPrivacy)}
              >
                <View style={[
                  styles.checkbox,
                  formData.agreeToPrivacy && styles.checkboxChecked
                ]}>
                  {formData.agreeToPrivacy && (
                    <Icon name="checkmark" size={12} color={COLORS.text.light} />
                  )}
                </View>
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={styles.link} onPress={openPrivacyPolicy}>
                    Privacy Policy
                  </Text>
                </Text>
              </TouchableOpacity>

              {errors.privacy && (
                <Text style={styles.errorText}>{errors.privacy}</Text>
              )}
            </View>

            {/* Signup Button */}
            <Button
              title={loading ? 'Creating Account...' : 'Create Account'}
              onPress={handleSignup}
              variant="primary"
              size="large"
              loading={loading}
              disabled={loading}
              style={styles.signupButton}
            />
          </Card>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Security Notice */}
          <Card variant="info" style={styles.securityNotice}>
            <View style={styles.securityContent}>
              <Icon name="shield-checkmark" size={24} color={COLORS.infoBlue[500]} />
              <Text style={styles.securityText}>
                Your information is encrypted and secure. We only share your location with emergency contacts and verified helpers during emergencies.
              </Text>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoContainer: {
    marginBottom: SPACING.lg,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text.light,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.light,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 22,
  },
  formCard: {
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
  },
  formHeader: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  formSubtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  input: {
    marginBottom: SPACING.md,
  },
  termsContainer: {
    marginVertical: SPACING.lg,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.infoBlue[500],
    borderColor: COLORS.infoBlue[500],
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  link: {
    color: COLORS.infoBlue[500],
    textDecorationLine: 'underline',
  },
  errorText: {
    fontSize: 12,
    color: COLORS.primaryRed[500],
    marginLeft: 32,
    marginTop: -SPACING.xs,
    marginBottom: SPACING.sm,
  },
  signupButton: {
    marginTop: SPACING.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  loginText: {
    fontSize: 16,
    color: COLORS.text.light,
  },
  loginLink: {
    fontSize: 16,
    color: COLORS.text.light,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  securityNotice: {
    marginTop: SPACING.md,
  },
  securityContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.infoBlue[700],
    marginLeft: SPACING.sm,
    lineHeight: 20,
  },
});

export default SignupScreen;