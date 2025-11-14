/**
 * Save A Life App - Login Screen
 * User authentication with email/phone and password, biometric options
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';

import { COLORS, SPACING, COMPONENT_THEME } from '../../styles/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const emailInputRef = useRef<any>(null);
  const phoneInputRef = useRef<any>(null);
  const passwordInputRef = useRef<any>(null);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email && !formData.phoneNumber) {
      newErrors.email = 'Email or phone number is required';
      newErrors.phoneNumber = 'Email or phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful login
      Alert.alert(
        'Login Successful',
        'Welcome back to Save A Life!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to main app
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' as never }],
              });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Login Failed',
        'Invalid email/phone number or password. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle biometric login
  const handleBiometricLogin = async () => {
    try {
      // In a real app, this would use react-native-biometrics
      Alert.alert(
        'Biometric Login',
        'Face ID / Touch ID authentication would be triggered here',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Biometric login error:', error);
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  // Handle signup
  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <LinearGradient
      colors={['#FF3B30', '#FF6B60', '#FF9500']}
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
                <Icon name="shield-checkmark" size={60} color={COLORS.text.light} />
              </View>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to access your emergency features
            </Text>
          </View>

          {/* Login Form */}
          <Card style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Sign In</Text>
              <Text style={styles.formSubtitle}>
                Enter your credentials to continue
              </Text>
            </View>

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

            {/* OR Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

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
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              showPasswordToggle
              onTogglePassword={() => setShowPassword(!showPassword)}
              leftIcon={{ uri: 'lock-icon' }} // Replace with actual icon
              error={errors.password}
              style={styles.input}
              ref={passwordInputRef}
              onSubmitEditing={handleLogin}
            />

            {/* Remember Me & Forgot Password */}
            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={() => handleInputChange('rememberMe', !formData.rememberMe)}
              >
                <View style={[
                  styles.checkbox,
                  formData.rememberMe && styles.checkboxChecked
                ]}>
                  {formData.rememberMe && (
                    <Icon name="checkmark" size={12} color={COLORS.text.light} />
                  )}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <Button
              title={loading ? 'Signing In...' : 'Sign In'}
              onPress={handleLogin}
              variant="primary"
              size="large"
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
            />

            {/* Biometric Login */}
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={handleBiometricLogin}
            >
              <Icon name="finger-print" size={24} color={COLORS.primaryRed[500]} />
              <Text style={styles.biometricText}>Sign in with Face ID / Touch ID</Text>
            </TouchableOpacity>
          </Card>

          {/* Signup Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Emergency Notice */}
          <Card variant="info" style={styles.emergencyNotice}>
            <View style={styles.emergencyContent}>
              <Icon name="information-circle" size={24} color={COLORS.infoBlue[500]} />
              <Text style={styles.emergencyText}>
                Save A Life is designed for emergency situations. Your account helps us reach your emergency contacts quickly when you need help.
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
    marginBottom: SPACING.xxl,
  },
  logoContainer: {
    marginBottom: SPACING.lg,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 32,
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border.light,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: 14,
    color: COLORS.text.tertiary,
    fontWeight: '500',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  checkboxChecked: {
    backgroundColor: COLORS.primaryRed[500],
    borderColor: COLORS.primaryRed[500],
  },
  rememberMeText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primaryRed[500],
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: SPACING.md,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.input,
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  biometricText: {
    marginLeft: SPACING.sm,
    fontSize: 16,
    color: COLORS.primaryRed[500],
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  signupText: {
    fontSize: 16,
    color: COLORS.text.light,
  },
  signupLink: {
    fontSize: 16,
    color: COLORS.text.light,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  emergencyNotice: {
    marginTop: SPACING.md,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  emergencyText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.infoBlue[700],
    marginLeft: SPACING.sm,
    lineHeight: 20,
  },
});

export default LoginScreen;