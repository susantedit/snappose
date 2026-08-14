/**
 * App config API service and React Query hook.
 * Caches config in MMKV with 1-hour stale time. [Req 46]
 */

import { apiGet } from './client';
import { mmkv } from '@/database/mmkv/mmkvClient';
import { MMKV_KEYS } from '@/database/mmkv/keys';

export interface AppConfig {
  latestVersion: string;
  minimumVersion: string;
  maintenanceMode: boolean;
  adsEnabled: boolean;
  autoCaptureThreshold: number;
  voiceGuidanceEnabled: boolean;
  featuredCategories: string[];
  forceUpdate: boolean;
}

const STALE_MS = 60 * 60 * 1000; // 1 hour

export async function fetchAppConfig(): Promise<AppConfig> {
  const config = await apiGet<AppConfig>('/app-config');
  // Cache in MMKV
  mmkv.set(MMKV_KEYS.APP_CONFIG, JSON.stringify({ config, fetchedAt: Date.now() }));
  return config;
}

export function getCachedAppConfig(): AppConfig | null {
  const raw = mmkv.getString(MMKV_KEYS.APP_CONFIG);
  if (!raw) return null;
  try {
    const { config, fetchedAt } = JSON.parse(raw) as { config: AppConfig; fetchedAt: number };
    if (Date.now() - fetchedAt > STALE_MS) return null; // stale
    return config;
  } catch {
    return null;
  }
}
