/**
 * Zustand settingsStore — persisted in MMKV under key `cameraSettings`.
 * [Req 25.3]
 */

import { create } from 'zustand';
import { mmkv } from '@/database/mmkv/mmkvClient';
import { MMKV_KEYS } from '@/database/mmkv/keys';

export type Theme = 'light' | 'dark' | 'system';
export type GridType = 'none' | 'thirds' | 'golden';
export type FlashMode = 'auto' | 'on' | 'off';

/** Camera-specific settings persisted together as a JSON blob. */
export interface CameraSettings {
  flashMode: FlashMode;
  gridType: GridType;
  overlayOpacity: number;         // 0–100, default 55
  autoCaptureThreshold: number;   // 80–99, default 95  [Req 17.6]
  voiceGuidanceEnabled: boolean;
  smileRequired: boolean;         // optional auto-capture gate [Req 16.5]
}

export interface SettingsState {
  // --- Flat top-level fields ---
  theme: Theme;
  language: string;
  overlayOpacity: number;           // mirror of camera.overlayOpacity for easy access
  autoCaptureThreshold: number;     // mirror of camera.autoCaptureThreshold
  voiceGuidanceEnabled: boolean;    // mirror of camera.voiceGuidanceEnabled
  gridType: GridType;               // mirror of camera.gridType
  flashMode: FlashMode;             // mirror of camera.flashMode
  smileRequired: boolean;           // mirror of camera.smileRequired
  notificationsEnabled: boolean;

  // --- Camera sub-object ---
  camera: CameraSettings;

  // --- Actions ---
  updateCameraSettings: (partial: Partial<CameraSettings>) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  resetToDefaults: () => void;
}

const DEFAULT_CAMERA: CameraSettings = {
  flashMode: 'auto',
  gridType: 'none',
  overlayOpacity: 55,
  autoCaptureThreshold: 95,
  voiceGuidanceEnabled: true,
  smileRequired: true,
};

/** Safely load JSON from MMKV, returning defaults on missing/malformed data. */
function loadJSON<T>(key: string, defaults: T): T {
  const stored = mmkv.getString(key);
  if (!stored) return defaults;
  try {
    return { ...defaults, ...(JSON.parse(stored) as Partial<T>) };
  } catch {
    return defaults;
  }
}

const initialCamera = loadJSON(MMKV_KEYS.CAMERA_SETTINGS, DEFAULT_CAMERA);

export const useSettingsStore = create<SettingsState>((set, get) => ({
  // Flat fields
  theme: (mmkv.getString(MMKV_KEYS.THEME) as Theme | undefined) ?? 'system',
  language: mmkv.getString(MMKV_KEYS.LANGUAGE) ?? 'en',
  overlayOpacity: initialCamera.overlayOpacity,
  autoCaptureThreshold: initialCamera.autoCaptureThreshold,
  voiceGuidanceEnabled: initialCamera.voiceGuidanceEnabled,
  gridType: initialCamera.gridType,
  flashMode: initialCamera.flashMode,
  smileRequired: initialCamera.smileRequired,
  notificationsEnabled: mmkv.getBoolean(MMKV_KEYS.NOTIFICATION_ENABLED) ?? false,

  // Camera sub-object
  camera: initialCamera,

  // --- Actions ---

  updateCameraSettings: (partial) => {
    const updated: CameraSettings = { ...get().camera, ...partial };
    mmkv.set(MMKV_KEYS.CAMERA_SETTINGS, JSON.stringify(updated));
    set({
      camera: updated,
      // Keep flat mirrors in sync
      overlayOpacity: updated.overlayOpacity,
      autoCaptureThreshold: updated.autoCaptureThreshold,
      voiceGuidanceEnabled: updated.voiceGuidanceEnabled,
      gridType: updated.gridType,
      flashMode: updated.flashMode,
      smileRequired: updated.smileRequired,
    });
  },

  setTheme: (theme) => {
    mmkv.set(MMKV_KEYS.THEME, theme);
    set({ theme });
  },

  setLanguage: (language) => {
    mmkv.set(MMKV_KEYS.LANGUAGE, language);
    set({ language });
  },

  setNotificationsEnabled: (enabled) => {
    mmkv.set(MMKV_KEYS.NOTIFICATION_ENABLED, enabled);
    set({ notificationsEnabled: enabled });
  },

  resetToDefaults: () => {
    mmkv.set(MMKV_KEYS.CAMERA_SETTINGS, JSON.stringify(DEFAULT_CAMERA));
    mmkv.set(MMKV_KEYS.THEME, 'system');
    mmkv.set(MMKV_KEYS.LANGUAGE, 'en');
    mmkv.set(MMKV_KEYS.NOTIFICATION_ENABLED, false);
    set({
      theme: 'system',
      language: 'en',
      notificationsEnabled: false,
      camera: { ...DEFAULT_CAMERA },
      overlayOpacity: DEFAULT_CAMERA.overlayOpacity,
      autoCaptureThreshold: DEFAULT_CAMERA.autoCaptureThreshold,
      voiceGuidanceEnabled: DEFAULT_CAMERA.voiceGuidanceEnabled,
      gridType: DEFAULT_CAMERA.gridType,
      flashMode: DEFAULT_CAMERA.flashMode,
      smileRequired: DEFAULT_CAMERA.smileRequired,
    });
  },
}));
