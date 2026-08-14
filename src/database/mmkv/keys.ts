/**
 * All MMKV key constants used across the app.
 *
 * Authentication tokens are NEVER stored here — use Expo SecureStore instead. [Req 26.1]
 * [Req 25.3]
 */

export const MMKV_KEYS = {
  /** Theme preference: 'light' | 'dark' | 'system' */
  THEME: 'theme',
  /** BCP 47 locale code */
  LANGUAGE: 'language',
  /** First-launch gate — boolean [Req 2.2] */
  ONBOARDING_COMPLETED: 'onboardingCompleted',
  /** JSON-serialised camera preferences */
  CAMERA_SETTINGS: 'cameraSettings',
  /** Overlay opacity 0–100, default 55 */
  OVERLAY_OPACITY: 'overlayOpacity',
  /** Last browsed category slug */
  LAST_CATEGORY: 'lastCategory',
  /** Master notification toggle — boolean */
  NOTIFICATION_ENABLED: 'notificationEnabled',
  /** JSON session metadata (NO auth token) */
  SESSION: 'session',
  /** Cold-start detection — boolean */
  FIRST_LAUNCH: 'firstLaunch',
  /** Unix ms timestamp of last Firestore sync */
  LAST_SYNC: 'lastSync',
  /** JSON array of QueuedOperation [Req 41.3] */
  OFFLINE_QUEUE: 'offlineQueue',
  /** Cached app_config JSON + fetchedAt [Req 46.1] */
  APP_CONFIG: 'appConfig',
  /** Rolling capture count within the current 6-hour window */
  CAPTURE_COUNT: 'captureCount',
  /** Unix ms timestamp when the current capture window started */
  WINDOW_START_TIME: 'windowStartTime',
  /** Bonus captures granted via rewarded ad */
  BONUS_CAPTURES: 'bonusCaptures',
  /** Unix ms timestamp of the last interstitial ad shown */
  LAST_INTERSTITIAL_TIMESTAMP: 'lastInterstitialTimestamp',
  /** ISO date string (YYYY-MM-DD) of the last app-open ad shown */
  APP_OPEN_AD_LAST_DATE: 'appOpenAdLastDate',
} as const;

export type MMKVKey = (typeof MMKV_KEYS)[keyof typeof MMKV_KEYS];
