export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: string;
  source: LocationSource;
}

export enum LocationSource {
  GPS = 'gps',
  NETWORK = 'network',
  PASSIVE = 'passive',
  MANUAL = 'manual',
  BEACON = 'beacon',
  WIFI = 'wifi'
}

export interface LocationSharingSession {
  id: string;
  userId: string;
  sessionId: string;
  startTime: string;
  endTime?: string;
  duration: number; // minutes
  sharedWith: SharedWithEntity[];
  isActive: boolean;
  locationUpdateInterval: number; // seconds
  lastLocationUpdate?: string;
  batteryLevel?: number;
  isEmergencySharing: boolean;
}

export interface SharedWithEntity {
  id: string;
  type: ShareTargetType;
  name: string;
  hasAccess: boolean;
  grantedAt: string;
  expiresAt?: string;
  canViewHistory: boolean;
}

export enum ShareTargetType {
  EMERGENCY_CONTACT = 'emergency_contact',
  HELPER = 'helper',
  EMERGENCY_SERVICES = 'emergency_services',
  TEMPORARY_LINK = 'temporary_link',
  PUBLIC_HELPER_NETWORK = 'public_helper_network'
}

export interface Geofence {
  id: string;
  name: string;
  center: LocationData;
  radius: number; // meters
  isActive: boolean;
  type: GeofenceType;
  notificationSettings: GeofenceNotificationSettings;
  createdAt: string;
  triggers: GeofenceTrigger[];
}

export enum GeofenceType {
  HOME = 'home',
  WORK = 'work',
  SCHOOL = 'school',
  HOSPITAL = 'hospital',
  DANGER_ZONE = 'danger_zone',
  SAFE_ZONE = 'safe_zone',
  CUSTOM = 'custom'
}

export interface GeofenceNotificationSettings {
  entryNotification: boolean;
  exitNotification: boolean;
  dwellTimeNotification: boolean; // notification after staying for X minutes
  dwellTimeMinutes: number;
  notificationSound: boolean;
  notificationVibration: boolean;
}

export interface GeofenceTrigger {
  id: string;
  type: GeofenceTriggerType;
  triggeredAt: string;
  location: LocationData;
  action: GeofenceAction;
}

export enum GeofenceTriggerType {
  ENTER = 'enter',
  EXIT = 'exit',
  DWELL = 'dwell'
}

export enum GeofenceAction {
  NOTIFY_CONTACTS = 'notify_contacts',
  START_LOCATION_SHARING = 'start_location_sharing',
  SEND_CHECK_IN = 'send_check_in',
  EMERGENCY_ALERT = 'emergency_alert',
  CUSTOM_NOTIFICATION = 'custom_notification'
}

export interface LocationHistory {
  id: string;
  userId: string;
  locations: LocationData[];
  startTime: string;
  endTime: string;
  purpose: HistoryPurpose;
  isEmergencyHistory: boolean;
  shareableLinkId?: string;
}

export enum HistoryPurpose {
  DAILY_ACTIVITY = 'daily_activity',
  EMERGENCY_RESPONSE = 'emergency_response',
  TRAVEL_LOG = 'travel_log',
  EXERCISE_TRACKING = 'exercise_tracking',
  PARENTAL_MONITORING = 'parental_monitoring',
  CARE_MONITORING = 'care_monitoring'
}

export interface Place {
  id: string;
  name: string;
  address: string;
  location: LocationData;
  placeType: PlaceType;
  phone?: string;
  website?: string;
  hours?: string;
  isEmergencyService: boolean;
  isVerified: boolean;
}

export enum PlaceType {
  HOSPITAL = 'hospital',
  URGENT_CARE = 'urgent_care',
  PHARMACY = 'pharmacy',
  FIRE_STATION = 'fire_station',
  POLICE_STATION = 'police_station',
  SHELTER = 'shelter',
  DOCTOR_OFFICE = 'doctor_office',
  CLINIC = 'clinic',
  SCHOOL = 'school',
  WORKPLACE = 'workplace',
  HOME = 'home',
  PUBLIC_BUILDING = 'public_building',
  LANDMARK = 'landmark',
  CUSTOM = 'custom'
}

export interface NavigationRoute {
  id: string;
  origin: LocationData;
  destination: LocationData;
  waypoints?: LocationData[];
  distance: number; // meters
  duration: number; // seconds
  trafficInfo?: TrafficInfo;
  instructions: NavigationInstruction[];
  routeType: RouteType;
  isSafeRoute: boolean;
  createdAt: string;
}

export interface TrafficInfo {
  congestionLevel: CongestionLevel;
  incidents: TrafficIncident[];
  alternativeRoutes?: number;
  estimatedDelay: number; // seconds
}

export enum CongestionLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HEAVY = 'heavy',
  SEVERE = 'severe'
}

export interface TrafficIncident {
  id: string;
  type: IncidentType;
  location: LocationData;
  severity: IncidentSeverity;
  description: string;
  startTime: string;
  estimatedEndTime?: string;
  lanesAffected?: number;
}

export enum IncidentType {
  ACCIDENT = 'accident',
  CONSTRUCTION = 'construction',
  ROAD_CLOSURE = 'road_closure',
  WEATHER = 'weather',
  DEBRIS = 'debris',
  DISABLED_VEHICLE = 'disabled_vehicle',
  OTHER = 'other'
}

export enum IncidentSeverity {
  MINOR = 'minor',
  MODERATE = 'moderate',
  MAJOR = 'major',
  CRITICAL = 'critical'
}

export interface NavigationInstruction {
  id: string;
  text: string;
  instructionType: InstructionType;
  distance: number; // meters
  duration: number; // seconds
  maneuver?: Maneuver;
}

export enum InstructionType {
  TURN_LEFT = 'turn_left',
  TURN_RIGHT = 'turn_right',
  CONTINUE_STRAIGHT = 'continue_straight',
  MAKE_U_TURN = 'make_u_turn',
  MERGE = 'merge',
  TAKE_EXIT = 'take_exit',
  ENTER_ROUNDABOUT = 'enter_roundabout',
  EXIT_ROUNDABOUT = 'exit_roundabout',
  ARRIVE = 'arrive',
  DEPART = 'depart'
}

export interface Maneuver {
  bearingBefore?: number;
  bearingAfter?: number;
  location: LocationData;
  modifier?: ManeuverModifier;
}

export enum ManeuverModifier {
  LEFT = 'left',
  RIGHT = 'right',
  STRAIGHT = 'straight',
  SLIGHT_LEFT = 'slight_left',
  SLIGHT_RIGHT = 'slight_right',
  SHARP_LEFT = 'sharp_left',
  SHARP_RIGHT = 'sharp_right',
  U_TURN = 'u_turn'
}

export enum RouteType {
  FASTEST = 'fastest',
  SHORTEST = 'shortest',
  SAFEST = 'safest',
  SCENIC = 'scenic',
  WHEELCHAIR_ACCESSIBLE = 'wheelchair_accessible',
  EMERGENCY_ROUTE = 'emergency_route'
}

export interface EmergencyLocationMarker {
  id: string;
  alertId: string;
  location: LocationData;
  type: MarkerType;
  status: MarkerStatus;
  createdAt: string;
  expiresAt?: string;
  notes?: string;
  isPrivate: boolean;
}

export enum MarkerType {
  SOS_ACTIVATION = 'sos_activation',
  HELPER_LOCATION = 'helper_location',
  EMERGENCY_SERVICES = 'emergency_services',
  HOSPITAL = 'hospital',
  SHELTER = 'shelter',
  DANGER_AREA = 'danger_area',
  SAFE_ZONE = 'safe_zone',
  MEETING_POINT = 'meeting_point'
}

export enum MarkerStatus {
  ACTIVE = 'active',
  RESPONDING = 'responding',
  RESOLVED = 'resolved',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}