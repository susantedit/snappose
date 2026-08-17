/**
 * Tabs Layout — Glassmorphism bottom navigation bar with elevated Olive Camera FAB.
 * Features ultra-crisp SVG icons, active glow indicators, and Reanimated spring physics.
 */

import React from 'react';
import { Platform, StyleSheet, View, Text, Pressable } from 'react-native';
import { Tabs, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';
import { Colors, Layout, Typography, AnimationDurations } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';

interface TabItemConfig {
  name: 'index' | 'search' | 'camera' | 'favorites' | 'settings';
  label: string;
  icon: string;
  activeIcon: string;
  isCamera?: boolean;
}

const TAB_ITEMS: TabItemConfig[] = [
  { name: 'index', label: 'Home', icon: 'home', activeIcon: 'home' },
  { name: 'search', label: 'Search', icon: 'search', activeIcon: 'search' },
  { name: 'camera', label: 'Camera', icon: 'camera', activeIcon: 'camera', isCamera: true },
  { name: 'favorites', label: 'Favorites', icon: 'heart', activeIcon: 'heart-filled' },
  { name: 'settings', label: 'Settings', icon: 'settings', activeIcon: 'settings' },
];

function CameraFAB({ focused }: { focused: boolean }) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.06 : 1, { damping: 12, stiffness: 220 });
  }, [focused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.fabContainer}>
      <Animated.View
        style={[
          styles.fab,
          {
            backgroundColor: Colors.olive,
            shadowColor: Colors.olive,
            borderWidth: focused ? 3 : 2,
            borderColor: focused ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
          },
          animatedStyle,
        ]}
      >
        <SPIcon name="camera" size={26} color="#FFFFFF" strokeWidth={2.2} />
      </Animated.View>
    </View>
  );
}

interface TabButtonProps {
  item: TabItemConfig;
  isFocused: boolean;
  activeColor: string;
  inactiveColor: string;
  onPress: () => void;
}

function TabButton({ item, isFocused, activeColor, inactiveColor, onPress }: TabButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(0.88, { duration: AnimationDurations.quick });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 14, stiffness: 240 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const color = isFocused ? activeColor : inactiveColor;
  const iconName = isFocused ? item.activeIcon : item.icon;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabButton}
      accessibilityRole="tab"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: isFocused }}
    >
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        <View style={styles.tabIconContainer}>
          <SPIcon
            name={iconName}
            size={20}
            color={color}
            fill={item.name === 'favorites' && isFocused ? Colors.error : undefined}
            strokeWidth={isFocused ? 2.4 : 1.9}
          />
        </View>
        <Text
          style={[
            styles.tabLabel,
            {
              color,
              fontWeight: isFocused ? '700' : '500',
            },
          ]}
        >
          {item.label}
        </Text>
        {isFocused && <View style={[styles.activePill, { backgroundColor: activeColor }]} />}
      </Animated.View>
    </Pressable>
  );
}

function GlassTabBar({ state, navigation }: any) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = Layout.bottomNavHeight + insets.bottom;

  const activeColor = Colors.olive;
  const inactiveColor =
    theme.mode === 'dark' ? 'rgba(255,255,255,0.45)' : 'rgba(40,40,40,0.5)';

  const glassBackground =
    theme.mode === 'dark'
      ? 'rgba(24,24,24,0.92)'
      : 'rgba(246,241,231,0.94)';
  const glassBorder =
    theme.mode === 'dark'
      ? 'rgba(255,255,255,0.08)'
      : 'rgba(101,116,74,0.2)';

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
              navigation.navigate(tab.name);
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
            <TabButton
              key={tab.name}
              item={tab}
              isFocused={isFocused}
              activeColor={activeColor}
              inactiveColor={inactiveColor}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <GlassTabBar
          state={props.state}
          descriptors={props.descriptors}
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

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    overflow: 'visible',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
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
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabIconContainer: {
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: Typography.sizes.caption,
    lineHeight: 14,
  },
  activePill: {
    width: 14,
    height: 3,
    borderRadius: 2,
    marginTop: 2,
  },
  cameraTabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: Layout.bottomNavHeight,
    overflow: 'visible',
  },
  fabContainer: {
    marginTop: -22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  fab: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 14px rgba(101, 116, 74, 0.45)',
      },
    }),
  },
});
