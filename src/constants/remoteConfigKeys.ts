/**
 * Firebase Remote Config keys.
 * [Req 17.7, 46.2]
 */

export const RemoteConfigKeys = {
  AUTO_CAPTURE_THRESHOLD: 'autoCaptureThreshold',
  VOICE_GUIDANCE_ENABLED: 'voiceGuidanceEnabled',
  ADS_ENABLED: 'adsEnabled',
  MAINTENANCE_MODE: 'maintenanceMode',
  MINIMUM_VERSION: 'minimumVersion',
  LATEST_VERSION: 'latestVersion',
  FEATURED_CATEGORIES: 'featuredCategories',
  AI_MODEL_VERSION: 'aiModelVersion',
} as const;
