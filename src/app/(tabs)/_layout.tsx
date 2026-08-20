/**
 * Tabs Layout — Floating glassmorphic bottom navigation bar with POSEHANUM branding.
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
import { Colors, AnimationDurations } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';

interface TabItemConfig {
  name: 'camera' | 'index' | 'favorites' | 'settings' | 'search';
  label: string;
  icon: string;
  activeIcon: string;
}

const TAB_ITEMS: TabItemConfig[] = [
  { name: 'camera', label: 'Camera', icon: 'camera', activeIcon: 'camera' },
  { name: 'index', label: 'References', icon: 'grid', activeIcon: 'grid' },
  { name: 'favorites', label: 'My Shots', icon: 'gallery', activeIcon: 'gallery' },
  { name: 'settings', label: 'Profile', icon: 'portrait', activeIcon: 'portrait' },
];

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
    scale.value = withTiming(0.9, { duration: AnimationDurations.quick });
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
        <View
          style={[
            styles.tabIconWrap,
            isFocused && styles.tabIconWrapActive,
          ]}
        >
          <SPIcon
            name={iconName}
            size={18}
            color={isFocused ? '#FFFFFF' : color}
            strokeWidth={isFocused ? 2.4 : 1.8}
          />
        </View>
        <Text
          style={[
            styles.tabLabel,
            {
              color: isFocused ? activeColor : color,
              fontWeight: isFocused ? '700' : '500',
            },
          ]}
        >
          {item.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

import { useUiVisibilityStore } from '@/stores/uiVisibilityStore';

function FloatingGlassTabBar({ state, navigation }: any) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const isCapturing = useUiVisibilityStore((s) => s.isCapturing);

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    if (isCapturing) {
      translateY.value = withTiming(110, { duration: 250 });
      opacity.value = withTiming(0, { duration: 200 });
    } else {
      translateY.value = withSpring(0, { damping: 15, stiffness: 180 });
      opacity.value = withTiming(1, { duration: 250 });
    }
  }, [isCapturing, translateY, opacity]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const isDark = theme.mode === 'dark';
  const activeColor = Colors.olive;
  const inactiveColor = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(44, 48, 38, 0.58)';

  const glassBackground = isDark
    ? 'rgba(22, 24, 20, 0.88)'
    : 'rgba(246, 241, 231, 0.90)';
  const glassBorder = isDark
    ? 'rgba(255, 255, 255, 0.12)'
    : 'rgba(101, 116, 74, 0.22)';

  return (
    <Animated.View
      style={[
        styles.floatingContainer,
        {
          bottom: Math.max(insets.bottom, 12),
        },
        animatedContainerStyle,
      ]}
      pointerEvents={isCapturing ? 'none' : 'box-none'}
    >
      <View
        style={[
          styles.tabBarPill,
          {
            backgroundColor: glassBackground,
            borderColor: glassBorder,
          },
        ]}
      >
        {TAB_ITEMS.map((tab) => {
          const routeIndex = state.routes.findIndex((r: any) => r.name === tab.name);
          const isFocused = state.index === routeIndex;

          const onPress = () => {
            if (tab.name === 'camera') {
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
    </Animated.View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props: any) => <FloatingGlassTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'References', tabBarAccessibilityLabel: 'References tab' }}
      />
      <Tabs.Screen
        name="camera"
        options={{ title: 'Camera', tabBarAccessibilityLabel: 'Open Camera' }}
      />
      <Tabs.Screen
        name="favorites"
        options={{ title: 'My Shots', tabBarAccessibilityLabel: 'My Shots tab' }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Profile', tabBarAccessibilityLabel: 'Profile tab' }}
      />
      <Tabs.Screen
        name="search"
        options={{
          href: null,
          title: 'Search',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  tabBarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 420,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabIconWrap: {
    width: 32,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrapActive: {
    backgroundColor: Colors.olive,
  },
  tabLabel: {
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.2,
  },
});
