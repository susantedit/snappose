/**
 * SPBottomNav — glassmorphism bottom navigation bar.
 * Port of BottomNav.kt.
 * Features: 5 tabs, centre Camera FAB (Olive Green), glassmorphism blur,
 * dark/light compatible, accessibility labels on all tabs.
 * Height: 72 dp + safe area inset. [Req 32, Req 47.2]
 * All icons rendered via crisp SVG SPIcon with spring physics.
 */

import React, { useCallback } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/constants/theme';
import { AnimationDurations, Colors, Layout, Typography } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------

export type SPBottomNavTab = 'home' | 'search' | 'camera' | 'favorites' | 'settings';

export interface SPBottomNavTabConfig {
  id: SPBottomNavTab;
  label: string;
  iconName: string;
  activeIconName?: string;
  isCamera?: boolean;
  accessibilityLabel: string;
  accessibilityHint: string;
}

const DEFAULT_TABS: SPBottomNavTabConfig[] = [
  {
    id: 'home',
    label: 'Home',
    iconName: 'home',
    accessibilityLabel: 'Home',
    accessibilityHint: 'Navigate to Home screen',
  },
  {
    id: 'search',
    label: 'Search',
    iconName: 'search',
    accessibilityLabel: 'Search',
    accessibilityHint: 'Navigate to Search screen',
  },
  {
    id: 'camera',
    label: 'Camera',
    iconName: 'camera',
    isCamera: true,
    accessibilityLabel: 'Open Camera',
    accessibilityHint: 'Open the camera to match a pose',
  },
  {
    id: 'favorites',
    label: 'Favorites',
    iconName: 'heart',
    activeIconName: 'heart-filled',
    accessibilityLabel: 'Favorites',
    accessibilityHint: 'Navigate to Favorites screen',
  },
  {
    id: 'settings',
    label: 'Settings',
    iconName: 'settings',
    accessibilityLabel: 'Settings',
    accessibilityHint: 'Navigate to Settings screen',
  },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SPBottomNavProps {
  /** Currently active tab. */
  activeTab: SPBottomNavTab;
  /** Called when a tab is pressed. */
  onTabPress: (tab: SPBottomNavTab) => void;
  /** Override tab configuration. */
  tabs?: SPBottomNavTabConfig[];
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Individual tab button (non-camera)
// ---------------------------------------------------------------------------

interface TabButtonProps {
  config: SPBottomNavTabConfig;
  isActive: boolean;
  activeColor: string;
  inactiveColor: string;
  onPress: () => void;
}

function TabButton({ config, isActive, activeColor, inactiveColor, onPress }: TabButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.85, { duration: AnimationDurations.quick });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 18, stiffness: 280 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const color = isActive ? activeColor : inactiveColor;
  const icon = isActive && config.activeIconName ? config.activeIconName : config.iconName;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabButton}
      accessibilityRole="tab"
      accessibilityLabel={config.accessibilityLabel}
      accessibilityHint={config.accessibilityHint}
      accessibilityState={{ selected: isActive }}
    >
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        <SPIcon
          name={icon}
          size={21}
          color={color}
          fill={icon === 'heart-filled' ? Colors.olive : undefined}
          strokeWidth={isActive ? 2.4 : 1.9}
        />
        <Text
          style={[
            styles.tabLabel,
            {
              color,
              fontWeight: isActive ? '700' : '500',
            },
          ]}
          numberOfLines={1}
        >
          {config.label}
        </Text>
        {/* Active indicator dot */}
        {isActive && (
          <View style={[styles.activeDot, { backgroundColor: color }]} />
        )}
      </Animated.View>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Camera FAB tab
// ---------------------------------------------------------------------------

interface CameraFABTabProps {
  config: SPBottomNavTabConfig;
  isActive: boolean;
  onPress: () => void;
}

function CameraFABTab({ config, isActive, onPress }: CameraFABTabProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.92, { duration: AnimationDurations.quick });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 18, stiffness: 280 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.cameraTabButton}
      accessibilityRole="button"
      accessibilityLabel={config.accessibilityLabel}
      accessibilityHint={config.accessibilityHint}
      accessibilityState={{ selected: isActive }}
    >
      <Animated.View
        style={[
          styles.fab,
          {
            backgroundColor: Colors.olive,
            borderWidth: isActive ? 3 : 2,
            borderColor: isActive ? Colors.oliveDark : 'rgba(255,255,255,0.35)',
          },
          animatedStyle,
        ]}
      >
        <SPIcon name="camera" size={24} color="#FFFFFF" strokeWidth={2.2} />
      </Animated.View>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// SPBottomNav
// ---------------------------------------------------------------------------

export function SPBottomNav({
  activeTab,
  onTabPress,
  tabs = DEFAULT_TABS,
  style,
}: SPBottomNavProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const tabBarHeight = Layout.bottomNavHeight + insets.bottom;

  // Glassmorphism surface colours
  const glassBackground = theme.mode === 'dark'
    ? 'rgba(24,24,24,0.88)'
    : 'rgba(246,241,231,0.90)';
  const glassBorder = theme.mode === 'dark'
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(101,116,74,0.18)';

  const activeColor = Colors.olive;
  const inactiveColor = theme.mode === 'dark'
    ? 'rgba(255,255,255,0.42)'
    : 'rgba(24,24,24,0.36)';

  return (
    <View
      style={[
        styles.wrapper,
        {
          height: tabBarHeight,
          backgroundColor: glassBackground,
          borderTopColor: glassBorder,
        },
        style,
      ]}
    >
      <View style={[styles.inner, { paddingBottom: insets.bottom }]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const handlePress = () => onTabPress(tab.id);

          if (tab.isCamera) {
            return (
              <CameraFABTab
                key={tab.id}
                config={tab}
                isActive={isActive}
                onPress={handlePress}
              />
            );
          }

          return (
            <TabButton
              key={tab.id}
              config={tab}
              isActive={isActive}
              activeColor={activeColor}
              inactiveColor={inactiveColor}
              onPress={handlePress}
            />
          );
        })}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
    overflow: 'visible',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  inner: {
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
    minWidth: Layout.minTouchTarget,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: Typography.sizes.caption,
    lineHeight: 14,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 1,
  },
  cameraTabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: Layout.bottomNavHeight,
    overflow: 'visible',
    minWidth: Layout.minTouchTarget,
  },
  fab: {
    width: Layout.fabSize,
    height: Layout.fabSize,
    borderRadius: Layout.fabSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
    ...Platform.select({
      android: { elevation: 8 },
      ios: {
        shadowColor: Colors.olive,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
    }),
  },
});
