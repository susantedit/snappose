import { Platform, StyleSheet, View, Pressable } from 'react-native';
import { Tabs, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/constants/theme';
import { Colors, Layout } from '@/constants/designTokens';

// ---------------------------------------------------------------------------
// Camera FAB — centre tab rendered as a 72 px floating action button.
// [Req 4.5] Olive Green #65744A, 72 px diameter.
// ---------------------------------------------------------------------------

interface CameraFABProps {
  focused: boolean;
}

function CameraFAB({ focused }: CameraFABProps) {
  return (
    <View style={styles.fabContainer}>
      <View
        style={[
          styles.fab,
          {
            backgroundColor: Colors.olive,
            shadowColor: Colors.olive,
            borderWidth: focused ? 3 : 2,
            borderColor: focused ? Colors.oliveDark : 'rgba(255,255,255,0.35)',
          },
        ]}
        accessibilityElementsHidden
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Glassmorphism tab bar — semi-transparent frosted-glass bar.
// Height: 72 px + safe area bottom. [Req 47.2]
// Uses a translucent background to approximate the glassmorphism effect
// across both light and dark themes.
// ---------------------------------------------------------------------------

interface TabItem {
  name: 'index' | 'search' | 'camera' | 'favorites' | 'settings';
  label: string;
  isCamera?: boolean;
}

const TAB_ITEMS: TabItem[] = [
  { name: 'index', label: 'Home' },
  { name: 'search', label: 'Search' },
  { name: 'camera', label: 'Camera', isCamera: true },
  { name: 'favorites', label: 'Favorites' },
  { name: 'settings', label: 'Settings' },
];

interface GlassTabBarProps {
  state: { index: number };
  descriptors: Record<string, { options: Record<string, unknown> }>;
  navigation: {
    emit: (event: {
      type: string;
      target?: string;
      canPreventDefault?: boolean;
    }) => { defaultPrevented: boolean };
    dispatch: (action: object) => void;
  };
}

function GlassTabBar({ state, navigation }: GlassTabBarProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = Layout.bottomNavHeight + insets.bottom;

  const activeColor = Colors.olive;
  const inactiveColor =
    theme.mode === 'dark' ? 'rgba(255,255,255,0.45)' : 'rgba(24,24,24,0.38)';

  // Glassmorphism background: semi-transparent with strong tint
  const glassBackground =
    theme.mode === 'dark'
      ? 'rgba(24,24,24,0.82)'
      : 'rgba(246,241,231,0.88)';
  const glassBorder =
    theme.mode === 'dark'
      ? 'rgba(255,255,255,0.08)'
      : 'rgba(101,116,74,0.15)';

  return (
    <View
      style={[
        styles.tabBarWrapper,
        {
          height: tabBarHeight,
          backgroundColor: glassBackground,
          borderTopColor: glassBorder,
        },
      ]}
    >
      <View style={[styles.tabBarInner, { paddingBottom: insets.bottom }]}>
        {TAB_ITEMS.map((tab, tabIndex) => {
          const isFocused = state.index === tabIndex;
          const color = isFocused ? activeColor : inactiveColor;

          const onPress = () => {
            if (tab.isCamera) {
              router.navigate('/(tabs)/camera');
              return;
            }
            const event = navigation.emit({
              type: 'tabPress',
              target: tab.name,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.dispatch({
                type: 'JUMP_TO',
                payload: { name: tab.name },
              });
            }
          };

          if (tab.isCamera) {
            return (
              <Pressable
                key={tab.name}
                onPress={onPress}
                style={styles.cameraTabButton}
                accessibilityRole="button"
                accessibilityLabel="Open Camera"
                accessibilityState={{ selected: isFocused }}
              >
                <CameraFAB focused={isFocused} />
              </Pressable>
            );
          }

          return (
            <Pressable
              key={tab.name}
              onPress={onPress}
              style={styles.tabButton}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: isFocused }}
            >
              {/* Indicator dot — icon library added in Task 6 */}
              <View
                style={[
                  styles.iconIndicator,
                  {
                    backgroundColor: isFocused ? color : 'transparent',
                    borderColor: color,
                  },
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

/**
 * Main tab group layout.
 *
 * Bottom nav: glassmorphism, 72 px height, 5 tabs.
 * Centre tab is a 72 px Olive Green FAB for Camera. [Req 4.5]
 * Full icon set will be applied in Task 6 (SPBottomNav component).
 *
 * Deep link scheme configured in app.config.ts: scheme = 'snappose'
 * [Req 47.2]
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <GlassTabBar
          state={props.state}
          descriptors={props.descriptors as GlassTabBarProps['descriptors']}
          navigation={props.navigation}
        />
      )}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarAccessibilityLabel: 'Home tab' }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: 'Search', tabBarAccessibilityLabel: 'Search tab' }}
      />
      <Tabs.Screen
        name="camera"
        options={{ title: 'Camera', tabBarAccessibilityLabel: 'Open Camera' }}
      />
      <Tabs.Screen
        name="favorites"
        options={{ title: 'Favorites', tabBarAccessibilityLabel: 'Favorites tab' }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarAccessibilityLabel: 'Settings tab' }}
      />
    </Tabs>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    // Allow FAB to overflow upward
    overflow: 'visible',
  },
  tabBarInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: Layout.bottomNavHeight,
    minHeight: Layout.minTouchTarget,
  },
  cameraTabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: Layout.bottomNavHeight,
    // Overflow so FAB visually floats above the bar
    overflow: 'visible',
  },
  iconIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  fabContainer: {
    // Float the FAB 20 dp above the tab bar baseline
    marginTop: -20,
    alignItems: 'center',
    justifyContent: 'center',
    // Allow shadow to paint outside bounds
    overflow: 'visible',
  },
  fab: {
    width: Layout.fabSize,
    height: Layout.fabSize,
    borderRadius: Layout.fabSize / 2,
    elevation: 8,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
    }),
  },
});
