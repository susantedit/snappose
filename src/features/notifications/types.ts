/**
 * Snap Pose — Notification Personality & Intelligence System Types.
 * [Req 33, 42]
 */

export type NotificationCategoryFamily =
  | 'DAILY_MOTIVATION'
  | 'COMEBACK'
  | 'LOW_SCORE'
  | 'MEDIUM_SCORE'
  | 'HIGH_SCORE'
  | 'PERFECT_SCORE'
  | 'NO_PERSON'
  | 'REPEATED_FAILED'
  | 'STREAK'
  | 'POSE_CHALLENGE'
  | 'CATEGORY_BASED'
  | 'TIME_AWARE'
  | 'SPECIAL_EVENT'
  | 'MILESTONE';

export type NotificationType = NotificationCategoryFamily | 'daily_pose' | 'capture_window_reset';

export type TimeWindow = 'morning' | 'afternoon' | 'evening' | 'night' | 'any';

export type NotificationTone =
  | 'roasted'
  | 'funny'
  | 'crispy'
  | 'savage'
  | 'confident'
  | 'hype'
  | 'coaching'
  | 'achievement'
  | 'playful'
  | 'positive'
  | 'motivational'
  | 'clever'
  | 'teasing';

export interface NotificationPersonalityMessage {
  id: string;
  title: string;
  body: string;
  category: NotificationCategoryFamily;
  subCategory?: string; // e.g. 'trek', 'cafe', 'beach', 'selfie', 'mountain', 'friday', 'weekend'
  deepLink: string;
  tone: NotificationTone;
  minInactivityDays?: number;
  maxInactivityDays?: number;
  minScore?: number;
  maxScore?: number;
  minStreakDays?: number;
  minRepeatedAttempts?: number;
  targetCategories?: string[];
  timeWindow?: TimeWindow;
  daysOfWeek?: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  milestoneThreshold?: number;
}

export type NotificationFrequency = 'daily' | 'every_other_day' | 'smart_ai';
export type NotificationToneFilter = 'all' | NotificationTone;

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
  preferredFrequency: NotificationFrequency;
  preferredTone: NotificationToneFilter;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
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
  read: boolean;
  actionTaken?: string | null;
  snoozedUntil?: number | null;
}

export interface NotificationEngineContext {
  lastActiveTimestamp: number;
  totalAttempts: number;
  bestScore: number;
  lastAttemptScore?: number;
  recentFailedAttemptsCount?: number;
  streakDays?: number;
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
