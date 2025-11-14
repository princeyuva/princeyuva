/**
 * Save A Life App - Main Navigation System
 * Complete navigation structure with authentication flow and emergency features
 */

import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import { COLORS, COMPONENT_THEME } from '../styles/theme';

// Screen imports (will be created)
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import HomeScreen from '../screens/home/HomeScreen';
import MapScreen from '../screens/map/MapScreen';
import MedicalIDScreen from '../screens/medical/MedicalIDScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import SOSConfirmationScreen from '../screens/emergency/SOSConfirmationScreen';
import EmergencyDetectionScreen from '../screens/emergency/EmergencyDetectionScreen';
import LocationSharingScreen from '../screens/location/LocationSharingScreen';
import AlertsScreen from '../screens/alerts/AlertsScreen';

// Stack navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Authentication Stack
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background.primary },
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

// Emergency Stack (for emergency-related screens)
const EmergencyStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background.primary },
        mode: 'modal',
        gestureEnabled: false, // Disable gestures during emergency
      }}
    >
      <Stack.Screen name="SOSConfirmation" component={SOSConfirmationScreen} />
      <Stack.Screen name="EmergencyDetection" component={EmergencyDetectionScreen} />
      <Stack.Screen name="LocationSharing" component={LocationSharingScreen} />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Map':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'MedicalID':
              iconName = focused ? 'medical' : 'medical-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primaryRed[500],
        tabBarInactiveTintColor: COLORS.text.tertiary,
        tabBarStyle: COMPONENT_THEME.navigation.tabBar,
        tabBarLabelStyle: COMPONENT_THEME.navigation.tabLabel,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          accessibilityLabel: 'Home screen with SOS button',
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
          accessibilityLabel: 'Helper network map',
        }}
      />
      <Tab.Screen
        name="MedicalID"
        component={MedicalIDScreen}
        options={{
          tabBarLabel: 'Medical ID',
          accessibilityLabel: 'Medical information',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          accessibilityLabel: 'App settings and preferences',
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator: React.FC = () => {
  // State management would normally come from Redux/Context
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  // In a real app, these would come from your state management
  useEffect(() => {
    // Check authentication status
    // Check if user has completed onboarding
    // This would typically involve checking secure storage or API calls
  }, []);

  // Determine which stack to show
  if (isEmergencyActive) {
    return (
      <NavigationContainer>
        <EmergencyStack />
      </NavigationContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
};

// Emergency navigation helper
export const triggerEmergencyNavigation = () => {
  // This would be called from SOS button or emergency detection
  // In a real implementation, this would update global state
  // to show the emergency stack
};

export default AppNavigator;