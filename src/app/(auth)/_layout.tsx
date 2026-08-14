import { Stack } from 'expo-router';

/**
 * Auth group layout — splash and onboarding.
 * No bottom tab bar is rendered here.
 */
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}
