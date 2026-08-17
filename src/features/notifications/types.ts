/**
 * Snap Pose — Notification Personality & Intelligence System Types.
 * [Req 33, 42]
 */

export type NotificationCategoryFamily =
  | 'DAILY_MOTIVATION'
  | 'COMEBACK'
  | 'HIGH_SCORE'
  | 'POSE_CHALLENGE'
  | 'CATEGORY_BASED'
  | 'TIME_AWARE'
  | 'SPECIAL_EVENT'
  | 'MILESTONE';

export type NotificationType = NotificationCategoryFamily | 'daily_pose' | 'capture_window_reset';

export type TimeWindow = 'morning' | 'afternoon' | 'evening' | 'night' | 'any';

export interface NotificationPersonalityMessage {
  id: string;
  title: string;
  body: string;
  category: NotificationCategoryFamily;
  subCategory?: string; // e.g. 'trek', 'cafe', 'beach', 'selfie', 'mountain', 'friday', 'weekend'
  deepLink: string;
  tone: 'playful' | 'clever' | 'confident' | 'motivational' | 'teasing';
  minInactivityDays?: number;
  maxInactivityDays?: number;
  minScore?: number;
  targetCategories?: string[];
  timeWindow?: TimeWindow;
  daysOfWeek?: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  milestoneThreshold?: number;
}

export interface NotificationPreferences {
  enabled: boolean;
  dailyReminders: boolean;
  poseChallenges: boolean;
  achievements: boolean;
  personalization: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // e.g. "22:00"
  quietHoursEnd: string; // e.g. "08:00"
  preferredHour: number; // e.g. 18 (6 PM)
  preferredMinute: number; // e.g. 30
}

export interface NotificationDeliveryLog {
  id: string;
  messageId: string;
  title: string;
  body: string;
  category: NotificationCategoryFamily;
  deepLink: string;
  timestamp: number;
  delivered: boolean;
  opened: boolean;
}

export interface NotificationEngineContext {
  lastActiveTimestamp: number;
  totalAttempts: number;
  bestScore: number;
  favoriteCategories: string[];
  favoritePosesCount: number;
  currentTime: Date;
  recentDeliveredMessageIds: string[];
  consecutiveIgnoredCount: number;
}

export interface NotificationSelectionResult {
  message: NotificationPersonalityMessage;
  scheduledTime: Date;
  reason: string;
  score: number;
}
