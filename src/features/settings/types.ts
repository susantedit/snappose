/**
 * Settings feature types.
 * [Req 23, 25.3]
 */

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  overlayOpacity: number;
  autoCaptureThreshold: number;
  voiceGuidanceEnabled: boolean;
  gridType: 'thirds' | 'golden' | 'none';
  flashMode: 'auto' | 'on' | 'off';
  smileRequired: boolean;
  notificationsEnabled: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  language: 'en',
  overlayOpacity: 55,
  autoCaptureThreshold: 95,
  voiceGuidanceEnabled: true,
  gridType: 'none',
  flashMode: 'auto',
  smileRequired: false,
  notificationsEnabled: false,
};
