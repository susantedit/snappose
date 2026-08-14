/**
 * Jest global test setup.
 *
 * Loaded via the `setupFilesAfterFramework` entry in package.json.
 * Runs after the test framework (Jest) is installed in the environment
 * but before any test suite executes.
 */

// Extend Jest's expect with @testing-library/jest-native matchers
// (e.g. toBeVisible, toHaveTextContent, toBeDisabled).
import '@testing-library/jest-native/extend-expect';

// Silence the noisy React Native Animated "useNativeDriver" warning in tests.
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock expo-localization so i18n initialises without a real device.
jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageTag: 'en', languageCode: 'en', regionCode: 'US' }],
  locale: 'en-US',
  locales: [{ languageTag: 'en-US' }],
  timezone: 'America/New_York',
  isRTL: false,
}));

// Mock react-native-mmkv so store tests run in Node (no native module needed).
jest.mock('react-native-mmkv', () => {
  const store: Record<string, string | number | boolean> = {};
  return {
    MMKV: jest.fn().mockImplementation(() => ({
      set: jest.fn((key: string, value: string | number | boolean) => {
        store[key] = value;
      }),
      getString: jest.fn((key: string) => (typeof store[key] === 'string' ? store[key] : undefined)),
      getNumber: jest.fn((key: string) => (typeof store[key] === 'number' ? store[key] : undefined)),
      getBoolean: jest.fn((key: string) => (typeof store[key] === 'boolean' ? store[key] : undefined)),
      delete: jest.fn((key: string) => {
        delete store[key];
      }),
      contains: jest.fn((key: string) => key in store),
      clearAll: jest.fn(() => {
        Object.keys(store).forEach((k) => delete store[k]);
      }),
    })),
  };
});

// Mock @react-native-firebase/* modules — real Firebase requires native build.
jest.mock('@react-native-firebase/analytics', () => () => ({
  logEvent: jest.fn(),
  setUserProperties: jest.fn(),
  setUserId: jest.fn(),
}));

jest.mock('@react-native-firebase/crashlytics', () => () => ({
  log: jest.fn(),
  recordError: jest.fn(),
  setCustomKey: jest.fn(),
  setUserId: jest.fn(),
}));

// Mock expo-speech (native TTS not available in Jest Node environment).
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
  isSpeakingAsync: jest.fn().mockResolvedValue(false),
  isAvailableAsync: jest.fn().mockResolvedValue(true),
}));
