import { ExpoConfig, ConfigContext } from 'expo/config';
import { withProjectBuildGradle } from 'expo/config-plugins';
import fs from 'fs';

const hasGoogleServices = fs.existsSync('./google-services.json');
const admobAppId = process.env.EXPO_PUBLIC_ADMOB_APP_ID || 'ca-app-pub-3940256099942544~3347511713';

const withPlayServicesAdsFix = (config: ExpoConfig): ExpoConfig => {
  return withProjectBuildGradle(config, (gradleConfig) => {
    if (gradleConfig.modResults.language === 'groovy') {
      const forceDep = `
allprojects {
    tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
        kotlinOptions {
            freeCompilerArgs += ["-Xskip-metadata-version-check"]
        }
    }
}
`;
      if (!gradleConfig.modResults.contents.includes('-Xskip-metadata-version-check')) {
        gradleConfig.modResults.contents += forceDep;
      }
    }
    return gradleConfig;
  });
};

export default ({ config }: ConfigContext): ExpoConfig & Record<string, any> =>
  withPlayServicesAdsFix({
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
        'expo-notifications',
        {
          color: '#65744A',
        },
      ],
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
            compileSdkVersion: 35,
            targetSdkVersion: 35,
          },
        },
      ],
      [
        'react-native-google-mobile-ads',
        {
          androidAppId: admobAppId,
          iosAppId: admobAppId,
        },
      ],
      '@react-native-google-signin/google-signin',
      ...(hasGoogleServices
        ? ['@react-native-firebase/app', '@react-native-firebase/crashlytics']
        : []),
    ],
    'react-native-google-mobile-ads': {
      android_app_id: admobAppId,
      ios_app_id: admobAppId,
    },
    experiments: {
      typedRoutes: true,
    },
    owner: 'susant9876',
    extra: {
      mongodbApiUrl: process.env.EXPO_PUBLIC_MONGODB_API_URL,
      admobAppId: admobAppId,
      eas: {
        projectId: '67cafc66-29e1-4414-a258-812d7960d9c2',
      },
    },
  });

