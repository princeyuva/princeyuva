/**
 * Save A Life App - Home Screen
 * Main dashboard with SOS button, status cards, and quick actions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Geolocation from 'react-native-geolocation-service';

import { COLORS, SPACING } from '../../styles/theme';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import SOSButton from '../../components/emergency/SOSButton';
import { EmergencyType, UserStatus } from '../../../shared/types/user';

const { width: screenWidth } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [userStatus, setUserStatus] = useState<UserStatus>(UserStatus.SAFE);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [nearbyHelpersCount, setNearbyHelpersCount] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null);

  // Mock data - in real app, this would come from API
  const [weatherConditions, setWeatherConditions] = useState({
    temperature: 72,
    conditions: 'Clear',
    icon: 'sunny-outline',
  });

  const [emergencyContacts] = useState([
    { name: 'John Doe', phone: '+1234567890', relationship: 'Spouse' },
    { name: 'Jane Smith', phone: '+0987654321', relationship: 'Parent' },
  ]);

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
    getCurrentLocation();
    startLocationTracking();
  }, []);

  // Load user data from API/local storage
  const loadUserData = async () => {
    try {
      // In real app, this would fetch from your API
      // For now, set some mock data
      setLastCheckIn(new Date());
      setNearbyHelpersCount(15);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Location error:', error);
        Alert.alert('Location Error', 'Unable to get your current location. Please enable GPS.');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  // Start location tracking
  const startLocationTracking = () => {
    // In a real app, this would start continuous location updates
    // with proper permissions and battery optimization
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    getCurrentLocation();
    setRefreshing(false);
  };

  // Handle SOS button press
  const handleSOSPress = (emergencyType: EmergencyType) => {
    // Navigate to emergency confirmation screen
    navigation.navigate('SOSConfirmation', { emergencyType });
  };

  // Handle SOS cancel
  const handleSOSCancel = () => {
    console.log('SOS cancelled by user');
  };

  // Handle status toggle (Safe/In Danger)
  const handleStatusToggle = () => {
    const newStatus = userStatus === UserStatus.SAFE ? UserStatus.IN_DANGER : UserStatus.SAFE;
    setUserStatus(newStatus);

    // In real app, this would update the server and notify contacts
    Alert.alert(
      'Status Updated',
      `You are now marked as ${newStatus === UserStatus.SAFE ? 'Safe' : 'In Danger'}`,
      [{ text: 'OK' }]
    );
  };

  // Handle "I Need Help"
  const handleNeedHelp = () => {
    navigation.navigate('Map', { mode: 'request-help' });
  };

  // Handle "I Can Help"
  const handleCanHelp = () => {
    navigation.navigate('Map', { mode: 'offer-help' });
  };

  // Handle check-in
  const handleCheckIn = () => {
    const now = new Date();
    setLastCheckIn(now);
    setUserStatus(UserStatus.SAFE);

    // In real app, this would notify emergency contacts
    Alert.alert(
      'Check-in Successful',
      `Your emergency contacts have been notified that you're safe.`,
      [{ text: 'OK' }]
    );
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Get status color
  const getStatusColor = () => {
    switch (userStatus) {
      case UserStatus.SAFE:
        return COLORS.safetyGreen[500];
      case UserStatus.IN_DANGER:
        return COLORS.primaryRed[500];
      default:
        return COLORS.neutral[400];
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Status Card */}
      <Card
        title={`Status: ${userStatus === UserStatus.SAFE ? 'Safe' : 'In Danger'}`}
        subtitle={location ? 'Location: Available' : 'Location: Unknown'}
        variant={userStatus === UserStatus.SAFE ? 'safe' : 'emergency'}
        size="medium"
        style={styles.statusCard}
      >
        <View style={styles.statusContent}>
          <View style={styles.locationInfo}>
            <Text style={styles.statusText}>
              Last check-in: {lastCheckIn ? formatTime(lastCheckIn) : 'Never'}
            </Text>
            {weatherConditions && (
              <View style={styles.weatherInfo}>
                <Text style={styles.weatherText}>
                  {weatherConditions.temperature}°F • {weatherConditions.conditions}
                </Text>
              </View>
            )}
          </View>
          <Button
            title={userStatus === UserStatus.SAFE ? "I'm Safe" : "Mark Safe"}
            onPress={handleStatusToggle}
            variant={userStatus === UserStatus.SAFE ? 'safe' : 'emergency'}
            size="small"
            style={styles.statusButton}
          />
        </View>
      </Card>

      {/* SOS Button */}
      <View style={styles.sosContainer}>
        <SOSButton
          onPress={handleSOSPress}
          onCancel={handleSOSCancel}
          size="large"
          testMode={false}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <View style={styles.quickActionsRow}>
          <Button
            title="I Need Help"
            onPress={handleNeedHelp}
            variant="secondary"
            icon={<Text style={styles.buttonIcon}>🆘</Text>}
            style={styles.quickActionbutton}
          />
          <Button
            title="I Can Help"
            onPress={handleCanHelp}
            variant="safe"
            icon={<Text style={styles.buttonIcon}>🤝</Text>}
            style={styles.quickActionbutton}
          />
        </View>
        <Button
          title="Check In"
          onPress={handleCheckIn}
          variant="outline"
          icon={<Text style={styles.buttonIcon}>✓</Text>}
          style={styles.checkInButton}
        />
      </View>

      {/* Recent Activity */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Emergency Contacts Summary */}
        <Card
          title="Emergency Contacts"
          subtitle={`${emergencyContacts.length} contacts ready`}
          variant="info"
          size="medium"
          onPress={() => navigation.navigate('Settings', { screen: 'EmergencyContacts' })}
          style={styles.activityCard}
        >
          <View style={styles.contactsList}>
            {emergencyContacts.slice(0, 2).map((contact, index) => (
              <View key={index} style={styles.contactItem}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRelation}>{contact.relationship}</Text>
              </View>
            ))}
            {emergencyContacts.length > 2 && (
              <Text style={styles.moreContacts}>
                +{emergencyContacts.length - 2} more contacts
              </Text>
            )}
          </View>
        </Card>

        {/* Nearby Helpers */}
        <Card
          title="Nearby Helpers"
          subtitle={`${nearbyHelpersCount} verified helpers nearby`}
          variant="helper"
          size="medium"
          onPress={() => navigation.navigate('Map')}
          style={styles.activityCard}
        >
          <View style={styles.helpersInfo}>
            <Text style={styles.helpersText}>
              Average response time: 2-5 minutes
            </Text>
            <View style={styles.helpersBadges}>
              <View style={styles.helperBadge}>
                <Text style={styles.helperBadgeText}>First Aid</Text>
              </View>
              <View style={styles.helperBadge}>
                <Text style={styles.helperBadgeText}>CPR</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Emergency Tips */}
        <Card
          title="Emergency Tip"
          subtitle="Stay calm and follow these steps"
          variant="info"
          size="medium"
          style={styles.activityCard}
        >
          <Text style={styles.tipText}>
            In an emergency, remember to: 1) Stay calm, 2) Assess the situation, 3) Call for help, 4) Provide first aid if trained.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
  },
  statusCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  statusContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  weatherInfo: {
    marginTop: 4,
  },
  weatherText: {
    fontSize: 12,
    color: COLORS.text.tertiary,
  },
  statusButton: {
    minWidth: 100,
  },
  sosContainer: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  quickActionsContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  quickActionbutton: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  checkInButton: {
    width: '100%',
  },
  buttonIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  activityCard: {
    marginBottom: SPACING.md,
  },
  contactsList: {
    marginTop: SPACING.sm,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  contactRelation: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  moreContacts: {
    fontSize: 14,
    color: COLORS.primaryRed[500],
    fontWeight: '500',
    marginTop: SPACING.xs,
  },
  helpersInfo: {
    marginTop: SPACING.sm,
  },
  helpersText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  helpersBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  helperBadge: {
    backgroundColor: COLORS.safetyGreen[100],
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    marginRight: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  helperBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.safetyGreen[700],
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text.primary,
    marginTop: SPACING.sm,
  },
});

// Add Text component import and styles
import { Text } from 'react-native';

export default HomeScreen;