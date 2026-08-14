import { Stack } from 'expo-router';

/**
 * Auth group layout — no bottom tab bar shown.
 *
 * Contains: splash and onboarding screens.
 * All screens in this group use a fade transition so the splash logo
 * fades cleanly before any navigation chrome appears.
 *
 * [Req 1.5] Splash has no interactive navigation elements.
 * [Req 1]   Splash → Onboarding (first launch) or Home (returning user).
 */
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="splash" options={{ animation: 'none' }} />
      <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
    </Stack>
  );
}
