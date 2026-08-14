import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Snap Pose',
  slug: 'snap-pose',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#F6F1E7',
  },
  scheme: 'snappose',
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.example.snappose',
    infoPlist: {
      NSCameraUsageDescription:
        'Snap Pose needs camera access to overlay pose guides and capture photos.',
      NSMicrophoneUsageDescription:
        'Snap Pose needs microphone access for video capture.',
      NSPhotoLibraryUsageDescription:
        'Snap Pose saves captured photos to your photo library.',
      NSPhotoLibraryAddUsageDescription:
        'Snap Pose saves captured photos to your photo library.',
    },
  },
  android: {
    package: 'com.example.snappose',
    versionCode: 1,
    compileSdkVersion: 34,
    targetSdkVersion: 34,
    minSdkVersion: 26,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#F6F1E7',
    },
    permissions: [
      'android.permission.CAMERA',
      'android.permission.READ_MEDIA_IMAGES',
      'android.permission.READ_MEDIA_VIDEO',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.RECORD_AUDIO',
      'android.permission.VIBRATE',
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.RECEIVE_BOOT_COMPLETED',
    ],
    googleServicesFile: './google-services.json',
  },
  web: {
    bundler: 'metro',
    output: 'static',
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
    '@react-native-firebase/app',
    '@react-native-firebase/crashlytics',
    'react-native-google-mobile-ads',
  ],
  experiments: {
    typedRoutes: true,
  },
  // EAS Update — OTA JS-layer delivery
  updates: {
    url: 'https://u.expo.dev/YOUR_EAS_PROJECT_ID',
    enabled: true,
    // 'fingerprintRuntime' ties the OTA bundle to the exact native build fingerprint,
    // preventing mismatched JS from loading on incompatible native code.
    checkAutomatically: 'ON_LOAD',
    fallbackToCacheTimeout: 0,
  },
  runtimeVersion: {
    policy: 'fingerprintRuntime',
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
