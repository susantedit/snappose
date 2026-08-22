import { ExpoConfig, ConfigContext } from 'expo/config';
import fs from 'fs';

const hasGoogleServices = fs.existsSync('./google-services.json');

export default ({ config }: ConfigContext): ExpoConfig & Record<string, any> => ({
  ...config,
  name: 'POSEHANUM',
  slug: 'posehanum',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#F6F1E7',
  },
  scheme: 'posehanum',
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.snappose.app',
    infoPlist: {
      NSCameraUsageDescription:
        'POSEHANUM needs camera access to overlay pose guides and capture photos.',
      NSMicrophoneUsageDescription:
        'POSEHANUM needs microphone access for voice-guided coaching.',
      NSPhotoLibraryUsageDescription:
        'POSEHANUM saves captured photos to your photo library.',
      NSPhotoLibraryAddUsageDescription:
        'POSEHANUM saves captured photos to your photo library.',
    },
  },
  android: {
    package: 'com.snappose.app',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#F6F1E7',
    },
    permissions: [
      'android.permission.CAMERA',
      'android.permission.READ_MEDIA_IMAGES',
      'android.permission.READ_MEDIA_VIDEO',
      'android.permission.READ_MEDIA_AUDIO',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.RECORD_AUDIO',
      'android.permission.VIBRATE',
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.RECEIVE_BOOT_COMPLETED',
    ],
    googleServicesFile: hasGoogleServices ? './google-services.json' : undefined,
  },
  web: {
    bundler: 'metro',
    output: 'single',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-camera',
      {
        cameraPermission:
          'Allow Snap Pose to access your camera to overlay pose guides and capture photos.',
        microphonePermission:
          'Allow Snap Pose to access your microphone for video capture.',
        recordAudioAndroid: true,
      },
    ],
    [
      'expo-media-library',
      {
        photosPermission:
          'Allow Snap Pose to save captured photos to your photo library.',
        savePhotosPermission:
          'Allow Snap Pose to save captured photos to your photo library.',
        audioPermission:
          'Allow Snap Pose to access audio.',
        isAccessMediaLocationEnabled: true,
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          minSdkVersion: 26,
          compileSdkVersion: 34,
          targetSdkVersion: 34,
          buildToolsVersion: '34.0.0',
        },
      },
    ],
    ...(hasGoogleServices
      ? ['@react-native-firebase/app', '@react-native-firebase/crashlytics']
      : []),
  ],
  'react-native-google-mobile-ads': {
    android_app_id: process.env.EXPO_PUBLIC_ADMOB_APP_ID,
    ios_app_id: process.env.EXPO_PUBLIC_ADMOB_APP_ID,
  },
  experiments: {
    typedRoutes: true,
  },
  // EAS Update — OTA JS-layer delivery
  updates: {
    url: 'https://u.expo.dev/YOUR_EAS_PROJECT_ID',
    enabled: true,
    // 'fingerprint' ties the OTA bundle to the exact native build fingerprint,
    // preventing mismatched JS from loading on incompatible native code.
    checkAutomatically: 'ON_LOAD',
    fallbackToCacheTimeout: 0,
  },
  runtimeVersion: {
    policy: 'fingerprint',
  },
  extra: {
    mongodbApiUrl: process.env.EXPO_PUBLIC_MONGODB_API_URL,
    admobAppId: process.env.EXPO_PUBLIC_ADMOB_APP_ID,
    eas: {
      projectId: 'YOUR_EAS_PROJECT_ID',
    },
  },
  owner: 'snappose',
});

