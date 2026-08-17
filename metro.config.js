const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === 'react-native-google-mobile-ads' &&
    (platform === 'web' || !process.env.EXPO_USE_REAL_ADMOB)
  ) {
    return {
      filePath: path.resolve(__dirname, 'src/mocks/react-native-google-mobile-ads.web.ts'),
      type: 'sourceFile',
    };
  }
  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
