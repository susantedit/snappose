import { Tabs } from 'expo-router';

/**
 * Main tab navigator — implemented in task 5.
 * Glassmorphism bottom nav (72px), Camera FAB centre tab.
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 72 },
        tabBarActiveTintColor: '#65744A',
        tabBarInactiveTintColor: '#181818',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="camera" options={{ title: 'Camera' }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favorites' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
