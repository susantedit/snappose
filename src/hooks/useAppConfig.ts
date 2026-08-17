import { useQuery } from '@tanstack/react-query';
import { fetchAppConfig, AppConfig } from '@/services/api/config';
import { mmkvGet, mmkvSet } from '@/database/mmkv/mmkvClient';

const CONFIG_CACHE_KEY = 'app_config_cache';

export function useAppConfig() {
  return useQuery<AppConfig>({
    queryKey: ['appConfig'],
    queryFn: async () => {
      try {
        const config = await fetchAppConfig();
        mmkvSet(CONFIG_CACHE_KEY, config);
        return config;
      } catch (err) {
        const cached = mmkvGet<AppConfig>(CONFIG_CACHE_KEY);
        if (cached) return cached;
        return {
          maintenanceMode: false,
          minimumVersion: '1.0.0',
          latestVersion: '1.0.0',
          adsEnabled: true,
          autoCaptureThreshold: 94,
          voiceGuidanceEnabled: true,
          featuredCategories: [],
          forceUpdate: false,
        };
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
