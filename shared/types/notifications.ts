export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  category: NotificationCategory;
  data?: NotificationData;
  isRead: boolean;
  isPush: boolean;
  isSilent: boolean;
  sound?: string;
  vibrationPattern?: VibrationPattern;
  icon?: string;
  imageUrl?: string;
  actionButtons?: NotificationAction[];
  scheduledFor?: string;
  expiresAt?: string;
  createdAt: string;
  readAt?: string;
  deliveredAt?: string;
}

export enum NotificationType {
  SOS_ACTIVATED = 'sos_activated',
  SOS_CANCELLED = 'sos_cancelled',
  EMERGENCY_ALERT = 'emergency_alert',
  HELP_REQUEST = 'help_request',
  HELP_ACCEPTED = 'help_accepted',
  HELP_DECLINED = 'help_declined',
  HELPER_ARRIVED = 'helper_arrived',
  LOCATION_SHARING_STARTED = 'location_sharing_started',
  LOCATION_SHARING_STOPPED = 'location_sharing_stopped',
  CHECK_IN_REMINDER = 'check_in_reminder',
  CHECK_IN_RECEIVED = 'check_in_received',
  MEDICAL_ID_UPDATED = 'medical_id_updated',
  EMERGENCY_CONTACT_UPDATED = 'emergency_contact_updated',
  BATTERY_LOW = 'battery_low',
  GPS_ISSUES = 'gps_issues',
  NETWORK_ISSUES = 'network_issues',
  AI_DETECTION_ALERT = 'ai_detection_alert',
  FALSE_ALARM_DETECTED = 'false_alarm_detected',
  EMERGENCY_BROADCAST = 'emergency_broadcast',
  WEATHER_ALERT = 'weather_alert',
  COMMUNITY_ALERT = 'community_alert',
  SYSTEM_MAINTENANCE = 'system_maintenance',
  FEATURE_UPDATE = 'feature_update'
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  CRITICAL = 'critical',
  EMERGENCY = 'emergency'
}

export enum NotificationCategory {
  EMERGENCY = 'emergency',
  SAFETY = 'safety',
  HEALTH = 'health',
  LOCATION = 'location',
  SYSTEM = 'system',
  SOCIAL = 'social',
  REMINDER = 'reminder',
  UPDATE = 'update'
}

export interface NotificationData {
  alertId?: string;
  emergencyType?: string;
  userId?: string;
  helperId?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  countdownSeconds?: number;
  actionUrl?: string;
  deepLink?: string;
  customData?: Record<string, any>;
}

export enum VibrationPattern {
  NONE = 'none',
  SHORT = 'short',
  LONG = 'long',
  DOUBLE = 'double',
  TRIPLE = 'triple',
  PULSE = 'pulse',
  EMERGENCY = 'emergency',
  NOTIFICATION = 'notification',
  SUCCESS = 'success',
  WARNING = 'warning'
}

export interface NotificationAction {
  id: string;
  title: string;
  type: ActionType;
  url?: string;
  deepLink?: string;
  isDestructive?: boolean;
  isAuthenticationRequired?: boolean;
}

export enum ActionType {
  VIEW_DETAILS = 'view_details',
  ACCEPT_HELP = 'accept_help',
  DECLINE_HELP = 'decline_help',
  CALL_EMERGENCY = 'call_emergency',
  CANCEL_ALERT = 'cancel_alert',
  MARK_SAFE = 'mark_safe',
  VIEW_LOCATION = 'view_location',
  SHARE_LOCATION = 'share_location',
  CALL_CONTACT = 'call_contact',
  OPEN_APP = 'open_app',
  DISMISS = 'dismiss'
}

export interface NotificationSettings {
  id: string;
  userId: string;
  globalSettings: GlobalNotificationSettings;
  typeSettings: TypeNotificationSettings;
  categorySettings: CategoryNotificationSettings;
  quietHours: QuietHours;
  emergencyOverride: EmergencyOverrideSettings;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalNotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  badgeEnabled: boolean;
  previewEnabled: boolean;
  ledEnabled: boolean;
  groupNotifications: boolean;
  maxNotificationsInQueue: number;
  autoDeleteAfterDays: number;
}

export interface TypeNotificationSettings {
  [key in NotificationType]: TypeNotificationSetting;
}

export interface TypeNotificationSetting {
  enabled: boolean;
  sound?: string;
  vibrationPattern?: VibrationPattern;
  priority: NotificationPriority;
  showInLockScreen: boolean;
  showAsBanner: boolean;
  deliverQuietly: boolean;
}

export interface CategoryNotificationSettings {
  [key in NotificationCategory]: CategoryNotificationSetting;
}

export interface CategoryNotificationSetting {
  enabled: boolean;
  priority: NotificationPriority;
  allowDuringQuietHours: boolean;
  bypassDoNotDisturb: boolean;
}

export interface QuietHours {
  enabled: boolean;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  timezone: string;
  daysOfWeek: number[]; // 0-6, Sunday = 0
  allowEmergencyCalls: boolean;
  allowCriticalAlerts: boolean;
}

export interface EmergencyOverrideSettings {
  enabled: boolean;
  overrideSilentMode: boolean;
  overrideDoNotDisturb: boolean;
  maxVolume: boolean;
  forceVibration: boolean;
  flashScreen: boolean;
  repeatSound: boolean;
  repeatInterval: number; // seconds
}

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  titleTemplate: string;
  messageTemplate: string;
  variables: TemplateVariable[];
  defaultSound?: string;
  defaultVibrationPattern?: VibrationPattern;
  defaultPriority: NotificationPriority;
  defaultCategory: NotificationCategory;
  supportedLanguages: string[];
}

export interface TemplateVariable {
  name: string;
  type: VariableType;
  required: boolean;
  defaultValue?: string;
  description: string;
}

export enum VariableType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  TIME = 'time',
  LOCATION = 'location',
  USER_NAME = 'user_name',
  CONTACT_NAME = 'contact_name',
  EMERGENCY_TYPE = 'emergency_type',
  COUNTDOWN = 'countdown',
  DISTANCE = 'distance',
  DURATION = 'duration'
}

export interface PushNotificationConfig {
  fcmToken: string;
  apnsToken?: string;
  platform: 'ios' | 'android';
  appVersion: string;
  deviceModel: string;
  osVersion: string;
  timezone: string;
  language: string;
  isActive: boolean;
  registeredAt: string;
  lastUsedAt: string;
}

export interface NotificationDeliveryReport {
  id: string;
  notificationId: string;
  userId: string;
  deviceToken: string;
  status: DeliveryStatus;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  errorMessage?: string;
  retryCount: number;
  platform: 'ios' | 'android' | 'web';
}

export enum DeliveryStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

export interface NotificationAnalytics {
  id: string;
  date: string;
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  deliveryRate: number;
  readRate: number;
  averageDeliveryTime: number; // milliseconds
  typeBreakdown: TypeAnalytics[];
  categoryBreakdown: CategoryAnalytics[];
  platformBreakdown: PlatformAnalytics[];
}

export interface TypeAnalytics {
  type: NotificationType;
  sent: number;
  delivered: number;
  read: number;
  averageReadTime: number; // milliseconds from delivery to read
}

export interface CategoryAnalytics {
  category: NotificationCategory;
  sent: number;
  delivered: number;
  read: number;
  averageReadTime: number;
}

export interface PlatformAnalytics {
  platform: 'ios' | 'android' | 'web';
  sent: number;
  delivered: number;
  read: number;
  averageDeliveryTime: number;
}