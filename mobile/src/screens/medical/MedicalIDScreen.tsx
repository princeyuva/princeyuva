/**
 * Save A Life App - Medical ID Screen
 * FHIR-compliant medical information with emergency access and QR code
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
  ActionSheetIOS,
  Platform,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';

import { COLORS, SPACING, COMPONENT_THEME } from '../../styles/theme';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import { BloodType, Gender, OrganDonorStatus } from '../../../shared/types/medical';

const MedicalIDScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [isEditing, setIsEditing] = useState(false);
  const [medicalData, setMedicalData] = useState({
    personalInfo: {
      fullName: 'John Doe',
      dateOfBirth: '1985-06-15',
      age: 38,
      height: '175',
      weight: '70',
      bloodType: BloodType.A_POSITIVE,
      gender: Gender.MALE,
      identificationNumber: '',
    },
    emergencyContacts: [
      { name: 'Jane Doe', relationship: 'Spouse', phone: '+1234567890', isPrimary: true },
      { name: 'Dr. Smith', relationship: 'Primary Care Physician', phone: '+0987654321', isPrimary: false },
    ],
    medicalConditions: [
      { name: 'Type 2 Diabetes', severity: 'moderate', diagnosedDate: '2020-01-15' },
      { name: 'Hypertension', severity: 'mild', diagnosedDate: '2019-03-20' },
    ],
    allergies: [
      { type: 'medication', substance: 'Penicillin', severity: 'severe', reactions: ['Anaphylaxis'] },
      { type: 'food', substance: 'Peanuts', severity: 'moderate', reactions: ['Hives', 'Swelling'] },
    ],
    medications: [
      { name: 'Metformin', dosage: '500mg', frequency: 'twice_daily', purpose: 'Diabetes' },
      { name: 'Lisinopril', dosage: '10mg', frequency: 'once_daily', purpose: 'Blood Pressure' },
    ],
    medicalDevices: [
      { type: 'none', name: '', manufacturer: '', serialNumber: '' },
    ],
    insuranceInfo: {
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'POL123456789',
      memberId: 'MEM987654321',
    },
    organDonorStatus: OrganDonorStatus.DONOR,
    emergencyInstructions: 'Carries epinephrine auto-injector for severe allergies. Contact spouse first in emergency.',
  });

  const qrCodeRef = useRef<any>(null);

  // Handle edit mode toggle
  const toggleEdit = () => {
    if (isEditing) {
      // Save changes (in real app, this would call API)
      Alert.alert(
        'Medical ID Updated',
        'Your medical information has been saved successfully.',
        [{ text: 'OK' }]
      );
    }
    setIsEditing(!isEditing);
  };

  // Share medical ID
  const shareMedicalID = async () => {
    try {
      const shareOptions = {
        message: `Emergency Medical Information for ${medicalData.personalInfo.fullName}\n\n` +
                 `Blood Type: ${medicalData.personalInfo.bloodType}\n` +
                 `Emergency Contact: ${medicalData.emergencyContacts[0]?.name} - ${medicalData.emergencyContacts[0]?.phone}\n\n` +
                 `Download Save A Life app to access full medical information.`,
        url: 'https://savealife.com/medical-id',
      };

      await Share.share(shareOptions);
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  // Generate QR code data
  const getQRCodeData = () => {
    return JSON.stringify({
      type: 'medical_id',
      version: '1.0',
      patientId: 'user-12345', // In real app, this would be actual user ID
      fullName: medicalData.personalInfo.fullName,
      bloodType: medicalData.personalInfo.bloodType,
      emergencyContacts: medicalData.emergencyContacts,
      allergies: medicalData.allergies.filter(a => a.severity === 'severe'),
      criticalConditions: medicalData.medicalConditions.filter(c => c.severity === 'severe'),
      timestamp: new Date().toISOString(),
    });
  };

  // Show QR code options
  const showQROptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Show QR Code', 'Share QR Code', 'Cancel'],
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            // Show QR code modal
            Alert.alert(
              'Emergency QR Code',
              'Show this QR code to first responders in an emergency',
              [{ text: 'OK' }]
            );
          } else if (buttonIndex === 1) {
            shareMedicalID();
          }
        }
      );
    } else {
      Alert.alert(
        'QR Code Options',
        'Choose an action',
        [
          { text: 'Show QR Code', onPress: () => {} },
          { text: 'Share Medical ID', onPress: shareMedicalID },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  // Render personal info section
  const renderPersonalInfo = () => (
    <Card title="Personal Information" variant="medical" style={styles.section}>
      {isEditing ? (
        <View>
          <Input
            label="Full Name"
            value={medicalData.personalInfo.fullName}
            onChangeText={(value) => setMedicalData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, fullName: value }
            }))}
            style={styles.input}
          />
          <Input
            label="Date of Birth"
            value={medicalData.personalInfo.dateOfBirth}
            onChangeText={(value) => setMedicalData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, dateOfBirth: value }
            }))}
            placeholder="YYYY-MM-DD"
            style={styles.input}
          />
          <Input
            label="Height (cm)"
            value={medicalData.personalInfo.height}
            onChangeText={(value) => setMedicalData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, height: value }
            }))}
            keyboardType="numeric"
            style={styles.input}
          />
          <Input
            label="Weight (kg)"
            value={medicalData.personalInfo.weight}
            onChangeText={(value) => setMedicalData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, weight: value }
            }))}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
      ) : (
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{medicalData.personalInfo.fullName}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>{medicalData.personalInfo.dateOfBirth}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>{medicalData.personalInfo.age} years</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Blood Type</Text>
            <View style={styles.bloodTypeContainer}>
              <Text style={styles.infoValue}>{medicalData.personalInfo.bloodType}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Height</Text>
            <Text style={styles.infoValue}>{medicalData.personalInfo.height} cm</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Weight</Text>
            <Text style={styles.infoValue}>{medicalData.personalInfo.weight} kg</Text>
          </View>
        </View>
      )}
    </Card>
  );

  // Render emergency contacts
  const renderEmergencyContacts = () => (
    <Card title="Emergency Contacts" variant="emergency" style={styles.section}>
      {medicalData.emergencyContacts.map((contact, index) => (
        <View key={index} style={styles.contactItem}>
          <View style={styles.contactHeader}>
            <Text style={styles.contactName}>{contact.name}</Text>
            {contact.isPrimary && (
              <View style={styles.primaryBadge}>
                <Text style={styles.primaryText}>Primary</Text>
              </View>
            )}
          </View>
          <Text style={styles.contactRelation}>{contact.relationship}</Text>
          <Text style={styles.contactPhone}>{contact.phone}</Text>
        </View>
      ))}
    </Card>
  );

  // Render medical conditions
  const renderMedicalConditions = () => (
    <Card title="Medical Conditions" variant="medical" style={styles.section}>
      {medicalData.medicalConditions.map((condition, index) => (
        <View key={index} style={styles.conditionItem}>
          <View style={styles.conditionHeader}>
            <Text style={styles.conditionName}>{condition.name}</Text>
            <View style={[
              styles.severityBadge,
              { backgroundColor: condition.severity === 'severe' ? COLORS.primaryRed[100] : COLORS.alertOrange[100] }
            ]}>
              <Text style={[
                styles.severityText,
                { color: condition.severity === 'severe' ? COLORS.primaryRed[700] : COLORS.alertOrange[700] }
              ]}>
                {condition.severity}
              </Text>
            </View>
          </View>
          <Text style={styles.conditionDate}>Diagnosed: {condition.diagnosedDate}</Text>
        </View>
      ))}
    </Card>
  );

  // Render allergies
  const renderAllergies = () => (
    <Card title="Allergies" variant="warning" style={styles.section}>
      {medicalData.allergies.map((allergy, index) => (
        <View key={index} style={styles.allergyItem}>
          <View style={styles.allergyHeader}>
            <Text style={styles.allergySubstance}>{allergy.substance}</Text>
            <View style={[
              styles.severityBadge,
              { backgroundColor: allergy.severity === 'severe' ? COLORS.primaryRed[100] : COLORS.alertOrange[100] }
            ]}>
              <Text style={[
                styles.severityText,
                { color: allergy.severity === 'severe' ? COLORS.primaryRed[700] : COLORS.alertOrange[700] }
              ]}>
                {allergy.severity}
              </Text>
            </View>
          </View>
          <Text style={styles.allergyReactions}>Reactions: {allergy.reactions.join(', ')}</Text>
        </View>
      ))}
    </Card>
  );

  // Render medications
  const renderMedications = () => (
    <Card title="Current Medications" variant="medical" style={styles.section}>
      {medicalData.medications.map((medication, index) => (
        <View key={index} style={styles.medicationItem}>
          <Text style={styles.medicationName}>{medication.name}</Text>
          <Text style={styles.medicationDetails}>
            {medication.dosage} - {medication.frequency.replace('_', ' ')}
          </Text>
          <Text style={styles.medicationPurpose}>For: {medication.purpose}</Text>
        </View>
      ))}
    </Card>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Medical ID</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={showQROptions} style={styles.qrButton}>
            <Icon name="qr-code" size={24} color={COLORS.infoBlue[500]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleEdit} style={styles.editButton}>
            <Icon name={isEditing ? "save" : "create"} size={24} color={COLORS.infoBlue[500]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Emergency Banner */}
      <Card variant="emergency" style={styles.emergencyBanner}>
        <View style={styles.emergencyContent}>
          <Icon name="warning" size={32} color={COLORS.primaryRed[600]} />
          <View style={styles.emergencyText}>
            <Text style={styles.emergencyTitle}>Emergency Information</Text>
            <Text style={styles.emergencySubtitle}>
              Show this screen to first responders in an emergency
            </Text>
          </View>
        </View>
      </Card>

      {/* Medical Information */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderPersonalInfo()}
        {renderEmergencyContacts()}
        {renderMedicalConditions()}
        {renderAllergies()}
        {renderMedications()}

        {/* Organ Donor Status */}
        <Card title="Organ Donation" variant="info" style={styles.section}>
          <View style={styles.donorStatus}>
            <Icon name="heart" size={24} color={COLORS.safetyGreen[500]} />
            <View style={styles.donorText}>
              <Text style={styles.donorTitle}>Organ Donor</Text>
              <Text style={styles.donorStatus}>
                {medicalData.organDonorStatus === OrganDonorStatus.DONOR ? 'Registered Donor' : 'Not a Donor'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Emergency Instructions */}
        {medicalData.emergencyInstructions && (
          <Card title="Emergency Instructions" variant="warning" style={styles.section}>
            <Text style={styles.instructionsText}>
              {medicalData.emergencyInstructions}
            </Text>
          </Card>
        )}

        {/* Insurance Information */}
        <Card title="Insurance Information" variant="info" style={styles.section}>
          <View style={styles.insuranceInfo}>
            <View style={styles.insuranceItem}>
              <Text style={styles.insuranceLabel}>Provider</Text>
              <Text style={styles.insuranceValue}>{medicalData.insuranceInfo.provider}</Text>
            </View>
            <View style={styles.insuranceItem}>
              <Text style={styles.insuranceLabel}>Policy Number</Text>
              <Text style={styles.insuranceValue}>{medicalData.insuranceInfo.policyNumber}</Text>
            </View>
            <View style={styles.insuranceItem}>
              <Text style={styles.insuranceLabel}>Member ID</Text>
              <Text style={styles.insuranceValue}>{medicalData.insuranceInfo.memberId}</Text>
            </View>
          </View>
        </Card>

        {/* QR Code Section */}
        <Card title="Emergency QR Code" variant="info" style={styles.section}>
          <View style={styles.qrContainer}>
            <QRCode
              value={getQRCodeData()}
              size={200}
              color={COLORS.text.primary}
              backgroundColor={COLORS.background.primary}
              getRef={qrCodeRef}
            />
            <Text style={styles.qrDescription}>
              First responders can scan this QR code to access your critical medical information quickly.
            </Text>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qrButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  editButton: {
    padding: SPACING.sm,
  },
  emergencyBanner: {
    margin: SPACING.md,
    backgroundColor: COLORS.primaryRed[50],
    borderColor: COLORS.primaryRed[200],
    borderWidth: 2,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyText: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primaryRed[700],
    marginBottom: SPACING.xs,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: COLORS.primaryRed[600],
    lineHeight: 18,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  section: {
    marginBottom: SPACING.md,
  },
  input: {
    marginBottom: SPACING.md,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    padding: SPACING.sm,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  bloodTypeContainer: {
    backgroundColor: COLORS.primaryRed[100],
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  contactItem: {
    padding: SPACING.md,
    backgroundColor: COLORS.background.primary,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  primaryBadge: {
    backgroundColor: COLORS.safetyGreen[100],
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  primaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.safetyGreen[700],
  },
  contactRelation: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  contactPhone: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.infoBlue[500],
  },
  conditionItem: {
    padding: SPACING.md,
    backgroundColor: COLORS.background.primary,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  conditionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  conditionName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  conditionDate: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  allergyItem: {
    padding: SPACING.md,
    backgroundColor: COLORS.background.primary,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  allergyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  allergySubstance: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    flex: 1,
  },
  allergyReactions: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  medicationItem: {
    padding: SPACING.md,
    backgroundColor: COLORS.background.primary,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  medicationDetails: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  medicationPurpose: {
    fontSize: 14,
    color: COLORS.infoBlue[500],
  },
  donorStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donorText: {
    marginLeft: SPACING.md,
  },
  donorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  donorStatus: {
    fontSize: 14,
    color: COLORS.safetyGreen[600],
  },
  instructionsText: {
    fontSize: 14,
    color: COLORS.text.primary,
    lineHeight: 20,
  },
  insuranceInfo: {
    backgroundColor: COLORS.background.primary,
    padding: SPACING.md,
    borderRadius: 8,
  },
  insuranceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  insuranceLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  insuranceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  qrContainer: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  qrDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.md,
    lineHeight: 18,
  },
});

export default MedicalIDScreen;