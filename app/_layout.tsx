import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from '@/constants/theme';
import { mmkv } from '@/database/mmkv/mmkvClient';
import { MMKV_KEYS } from '@/database/mmkv/keys';

/**
 * React Query client — configured once at root level.
 * Stale times set per-query; GC after 7 days. [Req 41.4]
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 24 * 60 * 60 * 1000, // 24 h default
      gcTime: 7 * 24 * 60 * 60 * 1000, // 7-day GC
      retry: 3,
    },
  },
});

/**
 * Inner layout that can access ThemeProvider context.
 */
function InnerLayout() {
  const { theme } = useTheme();

  // MMKV hydration — mark first launch complete so splash can route correctly.
  useEffect(() => {
    const isFirst = mmkv.getBoolean(MMKV_KEYS.FIRST_LAUNCH);
    if (isFirst === undefined) {
      mmkv.set(MMKV_KEYS.FIRST_LAUNCH, true);
    }
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth group — splash + onboarding; no bottom tab bar */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        {/* Main tab group */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Stack screens accessible from anywhere */}
        <Stack.Screen
          name="pose/[id]"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="category/[slug]"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="gallery/index"
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="downloads/index"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="capture-limit/index"
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
            presentation: 'modal',
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>

      <StatusBar style={theme.colors.statusBar} />
    </>
  );
}

/**
 * Root layout — wraps the entire app with global providers.
 *
 * Provider order (outer → inner):
 *   1. GestureHandlerRootView   — required by react-native-gesture-handler
 *   2. QueryClientProvider      — TanStack Query cache
 *   3. ThemeProvider            — MMKV-backed dark/light/system theme with 200ms cross-fade
 *   4. InnerLayout              — Expo Router Stack + MMKV hydration
 *
 * Deep link scheme: snappose://pose/[id], snappose://category/[slug]  [Req 47.2]
 * Configured in app.config.ts: scheme: 'snappose'
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <InnerLayout />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
