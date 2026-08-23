import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from '@/constants/theme';
import { mmkv } from '@/database/mmkv/mmkvClient';
import { MMKV_KEYS } from '@/database/mmkv/keys';
import { useAuthStore } from '@/stores/authStore';
import { AnalyticsService } from '@/services/firebase/analytics';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 24 * 60 * 60 * 1000,
      gcTime: 7 * 24 * 60 * 60 * 1000,
      retry: 3,
    },
  },
});

import { initDatabase } from '@/database/sqlite/db';
import { SPOfflineBanner } from '@/components/molecules/SPOfflineBanner';
import { SPCookieConsentBanner } from '@/components/molecules/SPCookieConsentBanner';

import { useSegments, router } from 'expo-router';

function InnerLayout() {
  const { theme } = useTheme();
  const { user, isLoading, initialize } = useAuthStore();
  const segments = useSegments();

  // Wire Firebase Analytics user ID whenever auth state changes
  useEffect(() => {
    AnalyticsService.setUserId(user?.uid ?? null);
    if (user?.uid) {
      AnalyticsService.setUserProperty('is_anonymous', user.isAnonymous ? 'true' : 'false');
    }
  }, [user?.uid, user?.isAnonymous]);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, [initialize]);

  // Protected route auth guard
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const onboardingDone = mmkv.getBoolean(MMKV_KEYS.ONBOARDING_COMPLETED);
    // Auth "entry" screens an already-authenticated user should never sit on.
    // Deliberately EXCLUDES sign-up / complete-profile / verify-email so the
    // post-signup flow (sign-up → complete-profile) isn't interrupted by an
    // auto-redirect to the tabs the instant the new user is created.
    const AUTH_ENTRY = ['sign-in', 'onboarding', 'splash', 'index'];

    if (!user && !inAuthGroup) {
      router.replace(onboardingDone ? '/(auth)/sign-in' : '/(auth)/onboarding');
    } else if (user && inAuthGroup && AUTH_ENTRY.includes(segments[1] ?? '')) {
      // Handles the session-restore race: if the listener briefly reports no
      // user and we land on sign-in, bounce back to the app once restore lands.
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments]);

  useEffect(() => {
    const isFirst = mmkv.getBoolean(MMKV_KEYS.FIRST_LAUNCH);
    if (isFirst === undefined) {
      mmkv.set(MMKV_KEYS.FIRST_LAUNCH, true);
    }
    initDatabase().catch((err) => {
      console.warn('[RootLayout] SQLite init notice:', err);
    });
  }, []);

  // Root auth-loading gate: while the auth state is resolving, show a branded
  // loading view instead of mounting the tab navigator. This prevents the
  // "flash of tabs/login" for users who are already signed in.
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
        <Stack.Screen
          name="template/[id]"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="template-creator/index"
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="template/edit/[id]"
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="profile/index"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="journey/index"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="templates/index"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="notifications/index"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>

      <StatusBar style={theme.colors.statusBar} />
      <SPOfflineBanner />
      <SPCookieConsentBanner />
    </>
  );
}

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
