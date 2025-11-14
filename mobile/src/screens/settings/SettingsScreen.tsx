/**
 * Save A Life App - Settings Screen
 * Complete settings with emergency preferences, privacy controls, and account management
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import { COLORS, SPACING, COMPONENT_THEME } from '../../styles/theme';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

interface SettingsItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'action' | 'navigation' | 'info';
  value?: boolean;
  onPress?: () => void;
  icon?: string;
  destructive?: boolean;
}

const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState({
    // Emergency Settings
    sosCountdownDuration: 3,
    autoCallEmergencyServices: false,
    defaultEmergencyType: 'medical',
    emergencyMessage: 'I need help! This is an emergency.',

    // Privacy Settings
    locationSharingWithContacts: true,
    locationSharingWithHelpers: true,
    shareMedicalInfo: true,
    dataCollection: true,

    // Notification Settings
    pushNotifications: true,
    emergencyAlerts: true,
    helperRequests: true,
    checkInReminders: true,

    // App Preferences
    darkMode: false,
    soundEffects: true,
    vibrationPatterns: true,
    language: 'English',
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your Save A Life account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // Handle logout logic
            console.log('User signed out');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Handle account deletion
            console.log('Account deleted');
          },
        },
      ]
    );
  };

  const openURL = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open the link');
    });
  };

  const settingsSections: SettingsSection[] = [
    {
      title: 'Emergency Settings',
      items: [
        {
          id: 'sos-countdown',
          title: 'SOS Countdown Duration',
          subtitle: `${settings.sosCountdownDuration} seconds`,
          type: 'navigation',
          icon: 'timer',
          onPress: () => {
            Alert.alert(
              'SOS Countdown',
              'Choose countdown duration for SOS activation',
              [
                { text: '2 seconds', onPress: () => updateSetting('sosCountdownDuration', 2) },
                { text: '3 seconds', onPress: () => updateSetting('sosCountdownDuration', 3) },
                { text: '5 seconds', onPress: () => updateSetting('sosCountdownDuration', 5) },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          },
        },
        {
          id: 'auto-call-emergency',
          title: 'Auto-Call Emergency Services',
          subtitle: 'Automatically call 911 after SOS countdown',
          type: 'toggle',
          value: settings.autoCallEmergencyServices,
          icon: 'call',
          onPress: () => updateSetting('autoCallEmergencyServices', !settings.autoCallEmergencyServices),
        },
        {
          id: 'emergency-message',
          title: 'Emergency Message',
          subtitle: settings.emergencyMessage,
          type: 'navigation',
          icon: 'chatbubble',
          onPress: () => {
            Alert.prompt(
              'Emergency Message',
              'Customize your emergency alert message',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Save',
                  onPress: (message) => {
                    if (message) {
                      updateSetting('emergencyMessage', message);
                    }
                  },
                },
              ],
              'plain-text',
              settings.emergencyMessage
            );
          },
        },
      ],
    },
    {
      title: 'Privacy Settings',
      items: [
        {
          id: 'location-contacts',
          title: 'Location Sharing - Contacts',
          subtitle: 'Share location with emergency contacts',
          type: 'toggle',
          value: settings.locationSharingWithContacts,
          icon: 'location',
          onPress: () => updateSetting('locationSharingWithContacts', !settings.locationSharingWithContacts),
        },
        {
          id: 'location-helpers',
          title: 'Location Sharing - Helpers',
          subtitle: 'Share location with verified helpers',
          type: 'toggle',
          value: settings.locationSharingWithHelpers,
          icon: 'people',
          onPress: () => updateSetting('locationSharingWithHelpers', !settings.locationSharingWithHelpers),
        },
        {
          id: 'medical-info',
          title: 'Share Medical Information',
          subtitle: 'Share Medical ID with emergency responders',
          type: 'toggle',
          value: settings.shareMedicalInfo,
          icon: 'medical',
          onPress: () => updateSetting('shareMedicalInfo', !settings.shareMedicalInfo),
        },
        {
          id: 'data-collection',
          title: 'Data Collection',
          subtitle: 'Allow app to collect usage data for improvement',
          type: 'toggle',
          value: settings.dataCollection,
          icon: 'analytics',
          onPress: () => updateSetting('dataCollection', !settings.dataCollection),
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'push-notifications',
          title: 'Push Notifications',
          subtitle: 'Receive notifications on your device',
          type: 'toggle',
          value: settings.pushNotifications,
          icon: 'notifications',
          onPress: () => updateSetting('pushNotifications', !settings.pushNotifications),
        },
        {
          id: 'emergency-alerts',
          title: 'Emergency Alerts',
          subtitle: 'Alerts for nearby emergencies',
          type: 'toggle',
          value: settings.emergencyAlerts,
          icon: 'warning',
          onPress: () => updateSetting('emergencyAlerts', !settings.emergencyAlerts),
        },
        {
          id: 'helper-requests',
          title: 'Helper Requests',
          subtitle: 'Notifications when someone needs help',
          type: 'toggle',
          value: settings.helperRequests,
          icon: 'help-circle',
          onPress: () => updateSetting('helperRequests', !settings.helperRequests),
        },
        {
          id: 'check-in-reminders',
          title: 'Check-in Reminders',
          subtitle: 'Remind me to check in regularly',
          type: 'toggle',
          value: settings.checkInReminders,
          icon: 'checkmark-circle',
          onPress: () => updateSetting('checkInReminders', !settings.checkInReminders),
        },
      ],
    },
    {
      title: 'App Preferences',
      items: [
        {
          id: 'dark-mode',
          title: 'Dark Mode',
          subtitle: 'Use dark theme',
          type: 'toggle',
          value: settings.darkMode,
          icon: 'moon',
          onPress: () => updateSetting('darkMode', !settings.darkMode),
        },
        {
          id: 'sound-effects',
          title: 'Sound Effects',
          subtitle: 'Play sounds for alerts and actions',
          type: 'toggle',
          value: settings.soundEffects,
          icon: 'volume-high',
          onPress: () => updateSetting('soundEffects', !settings.soundEffects),
        },
        {
          id: 'vibration',
          title: 'Vibration Patterns',
          subtitle: 'Vibrate for alerts and emergencies',
          type: 'toggle',
          value: settings.vibrationPatterns,
          icon: 'phone-portrait',
          onPress: () => updateSetting('vibrationPatterns', !settings.vibrationPatterns),
        },
        {
          id: 'language',
          title: 'Language',
          subtitle: settings.language,
          type: 'navigation',
          icon: 'globe',
          onPress: () => {
            Alert.alert(
              'Language',
              'Choose your preferred language',
              [
                { text: 'English', onPress: () => updateSetting('language', 'English') },
                { text: 'Spanish', onPress: () => updateSetting('language', 'Spanish') },
                { text: 'French', onPress: () => updateSetting('language', 'French') },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          },
        },
      ],
    },
    {
      title: 'Emergency Contacts',
      items: [
        {
          id: 'manage-contacts',
          title: 'Manage Emergency Contacts',
          subtitle: 'Add or remove emergency contacts',
          type: 'navigation',
          icon: 'people',
          onPress: () => {
            // Navigate to emergency contacts screen
            console.log('Navigate to emergency contacts');
          },
        },
        {
          id: 'test-alerts',
          title: 'Test Emergency Alerts',
          subtitle: 'Send test alerts to your contacts',
          type: 'action',
          icon: 'test-tube',
          onPress: () => {
            Alert.alert(
              'Test Alert',
              'Send a test emergency alert to your emergency contacts?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Send Test',
                  onPress: () => {
                    // Send test alert
                    Alert.alert('Test Sent', 'Test alert sent to your emergency contacts');
                  },
                },
              ]
            );
          },
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help-center',
          title: 'Help Center',
          subtitle: 'Get help and support',
          type: 'navigation',
          icon: 'help-buoy',
          onPress: () => openURL('https://savealife.com/help'),
        },
        {
          id: 'privacy-policy',
          title: 'Privacy Policy',
          subtitle: 'Read our privacy policy',
          type: 'navigation',
          icon: 'lock-closed',
          onPress: () => openURL('https://savealife.com/privacy'),
        },
        {
          id: 'terms-of-service',
          title: 'Terms of Service',
          subtitle: 'Read our terms of service',
          type: 'navigation',
          icon: 'document-text',
          onPress: () => openURL('https://savealife.com/terms'),
        },
        {
          id: 'about',
          title: 'About',
          subtitle: 'Save A Life v1.0.0',
          type: 'info',
          icon: 'information-circle',
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          type: 'navigation',
          icon: 'person',
          onPress: () => {
            // Navigate to profile edit
            console.log('Navigate to profile edit');
          },
        },
        {
          id: 'change-password',
          title: 'Change Password',
          subtitle: 'Update your password',
          type: 'navigation',
          icon: 'key',
          onPress: () => {
            // Navigate to password change
            console.log('Navigate to password change');
          },
        },
        {
          id: 'logout',
          title: 'Sign Out',
          subtitle: 'Sign out of your account',
          type: 'action',
          icon: 'log-out',
          onPress: handleLogout,
        },
        {
          id: 'delete-account',
          title: 'Delete Account',
          subtitle: 'Permanently delete your account',
          type: 'action',
          destructive: true,
          icon: 'trash',
          onPress: handleDeleteAccount,
        },
      ],
    },
  ];

  const renderSettingsItem = (item: SettingsItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingsItem}
        onPress={item.onPress}
        disabled={item.type === 'info'}
      >
        <View style={styles.itemLeft}>
          <Icon
            name={item.icon as any}
            size={24}
            color={item.destructive ? COLORS.primaryRed[500] : COLORS.infoBlue[500]}
          />
          <View style={styles.itemText}>
            <Text style={[
              styles.itemTitle,
              item.destructive && { color: COLORS.primaryRed[500] }
            ]}>
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
            )}
          </View>
        </View>
        <View style={styles.itemRight}>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={() => item.onPress?.()}
              trackColor={{ false: COLORS.neutral[200], true: COLORS.infoBlue[200] }}
              thumbColor={item.value ? COLORS.infoBlue[500] : COLORS.neutral[400]}
            />
          )}
          {item.type === 'navigation' && (
            <Icon name="chevron-forward" size={20} color={COLORS.neutral[400]} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Settings List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section) => (
          <Card key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map(renderSettingsItem)}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
  },
  header: {
    padding: SPACING.md,
    backgroundColor: COLORS.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  section: {
    marginBottom: SPACING.md,
    padding: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    backgroundColor: 'transparent',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemText: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  itemSubtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  itemRight: {
    alignItems: 'center',
  },
});

export default SettingsScreen;