/**
 * AnalyticsService — Safe wrapper around @react-native-firebase/analytics.
 *
 * Handles Expo Go / Web / Dev environments gracefully.
 * In production native builds with Firebase configured, logs real events to
 * Firebase Analytics for funnel analysis, retention, and A/B testing.
 *
 * Usage:
 *   AnalyticsService.logEvent('pose_captured', { poseId: 'pose-1', score: 87 });
 *   AnalyticsService.logScreenView('camera');
 */

import { NativeModules, Platform } from 'react-native';

function isNativeFirebaseAvailable(): boolean {
  if (Platform.OS === 'web') return false;
  return Boolean(
    NativeModules &&
    (NativeModules.RNFBAppModule || NativeModules.RNFBAnalyticsModule),
  );
}

let analyticsInstance: any = undefined;

function getAnalytics() {
  if (analyticsInstance !== undefined) return analyticsInstance;

  if (!isNativeFirebaseAvailable()) {
    analyticsInstance = null;
    return null;
  }

  try {
    const m = require('@react-native-firebase/analytics');
    const fn = m?.default || m;
    analyticsInstance = typeof fn === 'function' ? fn() : null;
  } catch (err) {
    if (__DEV__) {
      console.warn('[AnalyticsService] Firebase Analytics not available:', err);
    }
    analyticsInstance = null;
  }
  return analyticsInstance;
}

export const AnalyticsService = {
  /**
   * Log a custom analytics event.
   * @param eventName Snake_case event name (e.g. 'pose_captured')
   * @param params    Optional event parameters (string | number | boolean values only)
   */
  logEvent(eventName: string, params?: Record<string, string | number | boolean>): void {
    try {
      const analytics = getAnalytics();
      if (analytics?.logEvent) {
        analytics.logEvent(eventName, params);
      } else if (__DEV__) {
        console.debug('[Analytics:Dev] logEvent:', eventName, params);
      }
    } catch {
      // Never let analytics crash the app
    }
  },

  /**
   * Set the authenticated user's Firebase UID for attribution and funnel tracking.
   * Call this when auth state changes.
   */
  setUserId(userId: string | null): void {
    try {
      const analytics = getAnalytics();
      if (analytics?.setUserId) {
        analytics.setUserId(userId);
      }
    } catch {}
  },

  /**
   * Set a persistent user property for audience segmentation.
   * @param name  Property name (snake_case, max 24 chars)
   * @param value Property value (max 36 chars)
   */
  setUserProperty(name: string, value: string): void {
    try {
      const analytics = getAnalytics();
      if (analytics?.setUserProperty) {
        analytics.setUserProperty(name, value);
      }
    } catch {}
  },

  /**
   * Log a screen view event for navigation analytics.
   * @param screenName The screen name (e.g. 'camera', 'pose_detail')
   * @param screenClass Optional component class name
   */
  logScreenView(screenName: string, screenClass?: string): void {
    try {
      const analytics = getAnalytics();
      if (analytics?.logScreenView) {
        analytics.logScreenView({
          screen_name: screenName,
          screen_class: screenClass ?? screenName,
        });
      } else if (__DEV__) {
        console.debug('[Analytics:Dev] screenView:', screenName);
      }
    } catch {}
  },

  /**
   * Log an in-app purchase or subscription event (for AdMob ROAS tracking).
   */
  logPurchase(params: {
    transactionId?: string;
    currency: string;
    value: number;
    items?: Array<{ itemId: string; itemName: string; price: number }>;
  }): void {
    try {
      const analytics = getAnalytics();
      if (analytics?.logPurchase) {
        analytics.logPurchase(params);
      } else if (__DEV__) {
        console.debug('[Analytics:Dev] purchase:', params);
      }
    } catch {}
  },

  /**
   * Log when the user completes the onboarding flow.
   */
  logTutorialComplete(): void {
    this.logEvent('tutorial_complete');
  },

  /**
   * Log when the user opens a specific pose for reference.
   */
  logPoseView(poseId: string, category: string): void {
    this.logEvent('pose_viewed', { pose_id: poseId, category });
  },

  /**
   * Log when a photo is successfully captured.
   */
  logPhotoCapture(poseId: string, score: number, mode: string): void {
    this.logEvent('photo_captured', {
      pose_id: poseId,
      match_score: score,
      shooting_mode: mode,
    });
  },
};
