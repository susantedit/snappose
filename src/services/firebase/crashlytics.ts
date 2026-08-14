import crashlytics from '@react-native-firebase/crashlytics';

export const CrashlyticsService = {
  recordError(error: Error | unknown, jsErrorName?: string): void {
    try {
      if (error instanceof Error) {
        crashlytics().recordError(error, jsErrorName);
      } else {
        crashlytics().recordError(new Error(String(error)), jsErrorName);
      }
    } catch {
      // Swallowed silently so Crashlytics never causes an app crash
    }
  },

  log(message: string): void {
    try {
      crashlytics().log(message);
    } catch {
      // Swallowed silently
    }
  },

  setUserId(userId: string): void {
    try {
      crashlytics().setUserId(userId);
    } catch {
      // Swallowed silently
    }
  },

  setAttribute(key: string, value: string): void {
    try {
      crashlytics().setAttribute(key, value);
    } catch {
      // Swallowed silently
    }
  },
};
