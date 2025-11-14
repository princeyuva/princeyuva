export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  profilePicture?: string;
  dateOfBirth: string;
  isVerified: boolean;
  isHelper: boolean;
  helperVerificationStatus?: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  emergencyContacts: EmergencyContact[];
  medicalId?: MedicalID;
  preferences: UserPreferences;
  locationSharing: LocationSharingSettings;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phoneNumber: string;
  email?: string;
  relationship: string;
  isPrimary: boolean;
  priority: number;
  createdAt: string;
}

export interface UserPreferences {
  sosCountdownDuration: number; // seconds
  autoCallEmergencyServices: boolean;
  defaultEmergencyType: EmergencyType;
  notificationSounds: boolean;
  vibrationPatterns: boolean;
  locationAccuracy: 'high' | 'balanced' | 'low';
  batteryOptimization: boolean;
  darkMode: boolean;
  language: string;
}

export interface LocationSharingSettings {
  shareWithEmergencyContacts: boolean;
  shareWithHelpers: boolean;
  shareDuration: number; // minutes
  shareAccuracy: 'high' | 'balanced' | 'low';
  backgroundLocationEnabled: boolean;
}

export enum EmergencyType {
  MEDICAL = 'medical',
  ACCIDENT = 'accident',
  FIRE = 'fire',
  CRIME = 'crime',
  LOST = 'lost',
  OTHER = 'other'
}

export enum UserStatus {
  SAFE = 'safe',
  IN_DANGER = 'in_danger',
  UNKNOWN = 'unknown'
}