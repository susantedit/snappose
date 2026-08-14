import { Stack } from 'expo-router';

/**
 * Root layout — wraps all routes.
 * Providers (QueryClient, GestureHandler, ThemeProvider, MMKV hydration)
 * will be added in task 5.
 */
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="pose/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="category/[slug]" options={{ headerShown: false }} />
      <Stack.Screen name="gallery/index" options={{ headerShown: false }} />
      <Stack.Screen name="downloads/index" options={{ headerShown: false }} />
      <Stack.Screen name="capture-limit/index" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
