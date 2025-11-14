export interface MedicalID {
  id: string;
  userId: string;
  personalInfo: PersonalMedicalInfo;
  medicalConditions: MedicalCondition[];
  allergies: Allergy[];
  medications: Medication[];
  medicalDevices: MedicalDevice[];
  emergencyContacts: EmergencyMedicalContact[];
  insuranceInfo: InsuranceInformation;
  doctorInfo: DoctorInformation;
  advancedDirectives: AdvancedDirective[];
  organDonorStatus: OrganDonorStatus;
  bloodType: BloodType;
  createdAt: string;
  updatedAt: string;
  lastVerified?: string;
}

export interface PersonalMedicalInfo {
  fullName: string;
  dateOfBirth: string;
  age?: number;
  height?: string; // cm
  weight?: string; // kg
  bloodType: BloodType;
  gender?: Gender;
  photo?: string; // base64 or URL
  identificationNumber?: string;
}

export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
  UNKNOWN = 'unknown'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

export interface MedicalCondition {
  id: string;
  name: string;
  icd10Code?: string; // International Classification of Diseases
  severity: ConditionSeverity;
  diagnosedDate: string;
  isChronic: boolean;
  medications?: string[]; // references to medication IDs
  symptoms?: string[];
  treatmentNotes?: string;
  emergencyInstructions?: string;
}

export enum ConditionSeverity {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  LIFE_THREATENING = 'life_threatening'
}

export interface Allergy {
  id: string;
  type: AllergyType;
  substance: string;
  severity: AllergySeverity;
  reactions: string[];
  notes?: string;
  emergencyTreatment?: string;
}

export enum AllergyType {
  FOOD = 'food',
  MEDICATION = 'medication',
  ENVIRONMENTAL = 'environmental',
  INSECT = 'insect',
  LATEX = 'latex',
  OTHER = 'other'
}

export enum AllergySeverity {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  ANAPHYLAXIS = 'anaphylaxis'
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: MedicationFrequency;
  route: MedicationRoute;
  purpose: string;
  prescribedBy?: string;
  startDate: string;
  endDate?: string;
  isAsNeeded: boolean;
  instructions?: string;
  sideEffects?: string[];
  interactions?: string[];
}

export enum MedicationFrequency {
  ONCE_DAILY = 'once_daily',
  TWICE_DAILY = 'twice_daily',
  THREE_TIMES_DAILY = 'three_times_daily',
  FOUR_TIMES_DAILY = 'four_times_daily',
  EVERY_OTHER_DAY = 'every_other_day',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  AS_NEEDED = 'as_needed'
}

export enum MedicationRoute {
  ORAL = 'oral',
  INJECTABLE = 'injectable',
  TOPICAL = 'topical',
  INHALATION = 'inhalation',
  NASAL = 'nasal',
  EYE_DROPS = 'eye_drops',
  EAR_DROPS = 'ear_drops',
  RECTAL = 'rectal',
  TRANSDERMAL = 'transdermal'
}

export interface MedicalDevice {
  id: string;
  type: MedicalDeviceType;
  name: string;
  manufacturer?: string;
  modelNumber?: string;
  serialNumber?: string;
  implantedDate?: string;
  expiryDate?: string;
  settings?: string;
  emergencyInstructions?: string;
  contactInfo?: string;
}

export enum MedicalDeviceType {
  PACEMAKER = 'pacemaker',
  DEFIBRILLATOR = 'defibrillator',
  INSULIN_PUMP = 'insulin_pump',
  HEARING_AID = 'hearing_aid',
  COCHLEAR_IMPLANT = 'cochlear_implant',
  OXYGEN_TANK = 'oxygen_tank',
  CPAP_MACHINE = 'cpap_machine',
  NEUROSTIMULATOR = 'neurostimulator',
  ORTHOPEDIC_IMPLANT = 'orthopedic_implant',
  PROSTHETIC = 'prosthetic',
  OTHER = 'other'
}

export interface EmergencyMedicalContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  alternativePhone?: string;
  email?: string;
  isPrimaryContact: boolean;
  isMedicalDecisionMaker: boolean;
  hasMedicalPowerOfAttorney: boolean;
}

export interface InsuranceInformation {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  memberId: string;
  type: InsuranceType;
  coverageNotes?: string;
  customerServicePhone?: string;
  website?: string;
}

export enum InsuranceType {
  PRIVATE = 'private',
  MEDICARE = 'medicare',
  MEDICAID = 'medicaid',
  EMPLOYER_PROVIDED = 'employer_provided',
  MILITARY = 'military',
  VA = 'va',
  OTHER = 'other'
}

export interface DoctorInformation {
  primaryCarePhysician?: Doctor;
  specialists?: Doctor[];
  preferredHospital?: Hospital;
  emergencyContactHospital?: Hospital;
}

export interface Doctor {
  name: string;
  specialty: string;
  phoneNumber: string;
  fax?: string;
  address?: string;
  hospitalAffiliation?: string;
}

export interface Hospital {
  name: string;
  address: string;
  phoneNumber: string;
  emergencyRoomPhone?: string;
  distance?: number; // kilometers from home
}

export interface AdvancedDirective {
  id: string;
  type: DirectiveType;
  title: string;
  description: string;
  effectiveDate: string;
  documentUrl?: string;
  isDigitalCopy: boolean;
  witnessInfo?: string;
  notaryInfo?: string;
}

export enum DirectiveType {
  LIVING_WILL = 'living_will',
  DNR_ORDER = 'do_not_resuscitate',
  HEALTHCARE_POWER_OF_ATTORNEY = 'healthcare_power_of_attorney',
  ORGAN_DONATION = 'organ_donation',
  SPECIFIC_TREATMENT_REFUSAL = 'specific_treatment_refusal'
}

export enum OrganDonorStatus {
  DONOR = 'donor',
  NON_DONOR = 'non_donor',
  UNSURE = 'unsure',
  REGISTERED_DONOR = 'registered_donor'
}

export interface MedicalQRCode {
  id: string;
  userId: string;
  qrCodeData: string;
  emergencyAccessKey: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  lastAccessed?: string;
  accessCount: number;
}