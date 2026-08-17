/**
 * CrashlyticsService — Safe wrapper around @react-native-firebase/crashlytics.
 * Handles Expo Go / Web / Dev environments without crashing when native Firebase is absent.
 */

import { NativeModules, Platform } from 'react-native';

/**
 * Checks if the native Firebase App and Crashlytics modules are linked.
 * In Expo Go / Web, these native modules are not available.
 */
function isNativeFirebaseAvailable(): boolean {
  if (Platform.OS === 'web') return false;
  return Boolean(
    NativeModules &&
    (NativeModules.RNFBAppModule || NativeModules.RNFBCrashlyticsModule)
  );
}

let crashlyticsInstance: any = undefined;

function getCrashlytics() {
  if (crashlyticsInstance !== undefined) {
    return crashlyticsInstance;
  }

  if (!isNativeFirebaseAvailable()) {
    crashlyticsInstance = null;
    return null;
  }

  try {
    const crashlyticsModule = require('@react-native-firebase/crashlytics');
    const fn = crashlyticsModule?.default || crashlyticsModule;
    crashlyticsInstance = typeof fn === 'function' ? fn() : null;
  } catch (err) {
    if (__DEV__) {
      console.warn('[CrashlyticsService] Native Firebase not available in current environment:', err);
    }
    crashlyticsInstance = null;
  }

  return crashlyticsInstance;
}

export const CrashlyticsService = {
  recordError(error: Error | unknown, jsErrorName?: string): void {
    try {
      const cl = getCrashlytics();
      if (cl && typeof cl.recordError === 'function') {
        if (error instanceof Error) {
          cl.recordError(error, jsErrorName);
        } else {
          cl.recordError(new Error(String(error)), jsErrorName);
        }
      } else if (__DEV__) {
        console.debug('[CrashlyticsService:Dev] recordError:', jsErrorName, error);
      }
    } catch {
      // Swallowed silently so Crashlytics never causes an app crash
    }
  },

  log(message: string): void {
    try {
      const cl = getCrashlytics();
      if (cl && typeof cl.log === 'function') {
        cl.log(message);
      } else if (__DEV__) {
        console.debug('[CrashlyticsService:Dev] log:', message);
      }
    } catch {
      // Swallowed silently
    }
  },

  setUserId(userId: string): void {
    try {
      const cl = getCrashlytics();
      if (cl && typeof cl.setUserId === 'function') {
        cl.setUserId(userId);
      }
    } catch {
      // Swallowed silently
    }
  },

  setAttribute(key: string, value: string): void {
    try {
      const cl = getCrashlytics();
      if (cl && typeof cl.setAttribute === 'function') {
        cl.setAttribute(key, value);
      }
    } catch {
      // Swallowed silently
    }
  },
};
