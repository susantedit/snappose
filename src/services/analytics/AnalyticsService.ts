/**
 * AnalyticsService — typed safe wrapper around @react-native-firebase/analytics.
 * Handles Expo Go / Web / Dev environments without crashing when native Firebase is absent.
 */

import { NativeModules, Platform } from 'react-native';

// ─── Event name union ────────────────────────────────────────────────────────

export type AnalyticsEventName =
  | 'app_open'
  | 'screen_view'
  | 'pose_open'
  | 'camera_open'
  | 'photo_capture'
  | 'favorite_add'
  | 'search_started'
  | 'native_ad_loaded'
  | 'rewarded_completed'
  | 'auto_capture'
  | 'voice_guidance_played'
  | 'capture_limit_hit'
  | 'reward_ad_watched'
  | 'personalization_enabled'
  | 'personalization_disabled'
  | 'recommendation_shown'
  | 'recommendation_clicked'
  | 'recommendation_accepted'
  | 'recommendation_rejected'
  | 'recommendation_feedback'
  | 'preference_updated'
  | 'recommendation_session_started'
  | 'recommendation_session_completed';

// ─── Sensitive key deny-list ──────────────────────────────────────────────────

const SENSITIVE_KEY_FRAGMENTS: string[] = ['password', 'token', 'frame', 'biometric'];

function sanitiseParams(
  params: Record<string, string | number | boolean> | undefined,
): Record<string, string | number | boolean> | undefined {
  if (!params) return undefined;

  const safe: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(params)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = SENSITIVE_KEY_FRAGMENTS.some((fragment) =>
      lowerKey.includes(fragment),
    );
    if (!isSensitive) {
      safe[key] = value;
    }
  }

  return Object.keys(safe).length > 0 ? safe : undefined;
}

export interface UserProperties {
  userType?: 'anonymous' | 'google';
  country?: string;
  language?: string;
  appVersion?: string;
  deviceModel?: string;
}

function isNativeFirebaseAvailable(): boolean {
  if (Platform.OS === 'web') return false;
  return Boolean(
    NativeModules &&
    (NativeModules.RNFBAppModule || NativeModules.RNFBAnalyticsModule)
  );
}

let analyticsInstance: any = undefined;

function getAnalytics() {
  if (analyticsInstance !== undefined) {
    return analyticsInstance;
  }

  if (!isNativeFirebaseAvailable()) {
    analyticsInstance = null;
    return null;
  }

  try {
    const analyticsModule = require('@react-native-firebase/analytics');
    const fn = analyticsModule?.default || analyticsModule;
    analyticsInstance = typeof fn === 'function' ? fn() : null;
  } catch (err) {
    if (__DEV__) {
      console.warn('[AnalyticsService] Native Firebase Analytics not available in current environment:', err);
    }
    analyticsInstance = null;
  }

  return analyticsInstance;
}

const AnalyticsService = {
  logEvent(
    name: AnalyticsEventName,
    params?: Record<string, string | number | boolean>,
  ): void {
    try {
      const an = getAnalytics();
      if (an && typeof an.logEvent === 'function') {
        const sanitised = sanitiseParams(params);
        an.logEvent(name, sanitised as Record<string, unknown>).catch(() => {});
      } else if (__DEV__) {
        console.debug('[AnalyticsService:Dev] Event:', name, params);
      }
    } catch {
      // Silently swallow
    }
  },

  logScreenView(screenName: string, screenClass?: string): void {
    try {
      const an = getAnalytics();
      if (an && typeof an.logScreenView === 'function') {
        an.logScreenView({
          screen_name: screenName,
          screen_class: screenClass ?? screenName,
        }).catch(() => {});
      } else if (__DEV__) {
        console.debug('[AnalyticsService:Dev] ScreenView:', screenName);
      }
    } catch {
      // Silently swallow
    }
  },

  setUserProperty(name: string, value: string | null): void {
    try {
      const an = getAnalytics();
      if (an && typeof an.setUserProperty === 'function') {
        an.setUserProperty(name, value).catch(() => {});
      }
    } catch {
      // Silently swallow
    }
  },

  setUserProperties(props: UserProperties): void {
    try {
      const an = getAnalytics();
      if (an && typeof an.setUserProperties === 'function') {
        const flat: Record<string, string> = {};
        if (props.userType !== undefined) flat['userType'] = props.userType;
        if (props.country !== undefined) flat['country'] = props.country;
        if (props.language !== undefined) flat['language'] = props.language;
        if (props.appVersion !== undefined) flat['appVersion'] = props.appVersion;
        if (props.deviceModel !== undefined) flat['deviceModel'] = props.deviceModel;
        if (Object.keys(flat).length > 0) {
          an.setUserProperties(flat).catch(() => {});
        }
      }
    } catch {
      // Silently swallow
    }
  },
} as const;

export default AnalyticsService;
