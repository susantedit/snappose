/**
 * Type-safe route constants.
 * [Req 47.2]
 */

export const Routes = {
  // Auth
  SPLASH: '/(auth)/splash',
  ONBOARDING: '/(auth)/onboarding',

  // Tabs
  HOME: '/(tabs)',
  SEARCH: '/(tabs)/search',
  CAMERA: '/(tabs)/camera',
  FAVORITES: '/(tabs)/favorites',
  SETTINGS: '/(tabs)/settings',

  // Stack
  POSE_DETAIL: (id: string) => `/pose/${id}`,
  CATEGORY: (slug: string) => `/category/${slug}`,
  GALLERY: '/gallery',
  DOWNLOADS: '/downloads',
} as const;

/** Deep link scheme: snappose://pose/beach-001 */
export const DEEP_LINK_SCHEME = 'snappose';
