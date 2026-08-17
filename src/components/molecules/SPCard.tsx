/**
 * SPCard — glassmorphism card container.
 * Port of GlassCard.kt.
 * Semi-transparent surface with gradient border, blur-compatible.
 * NativeWind styled, dark/light compatible. [Req 32]
 */

import React from 'react';
import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type PressableProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';
import { AnimationDurations, BorderRadius } from '@/constants/designTokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SPCardProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  /** Variant to differentiate surfaces. */
  variant?: 'default' | 'glass' | 'elevated';
  /** Padding preset. Defaults to 'md' (16 dp). */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Corner radius override. */
  borderRadius?: number;
  /** Override the card background colour. */
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  /** Whether the card is interactive (adds Pressable press animation). */
  pressable?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PADDING_MAP = {
  none: 0,
  sm: 8,
  md: 16,
  lg: 24,
} as const;

// ---------------------------------------------------------------------------
// SPCard
// ---------------------------------------------------------------------------

export function SPCard({
  children,
  variant = 'default',
  padding = 'md',
  borderRadius,
  backgroundColor,
  style,
  pressable = false,
  accessibilityLabel,
  accessibilityHint,
  onPress,
  ...rest
}: SPCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (pressable) {
      scale.value = withTiming(0.97, { duration: AnimationDurations.quick });
    }
  };
  const handlePressOut = () => {
    if (pressable) {
      scale.value = withTiming(1, { duration: AnimationDurations.quick });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const resolvedRadius = borderRadius ?? BorderRadius.md;
  const resolvedPadding = PADDING_MAP[padding];
  const resolvedBackground = backgroundColor ?? getBackground(variant, theme.mode);
  const resolvedBorderColor = getBorderColor(variant, theme.mode);

  const cardStyle: ViewStyle = {
    borderRadius: resolvedRadius,
    padding: resolvedPadding,
    backgroundColor: resolvedBackground,
    borderWidth: variant === 'glass' ? StyleSheet.hairlineWidth * 2 : variant === 'elevated' ? 0 : StyleSheet.hairlineWidth,
    borderColor: resolvedBorderColor,
    ...getShadow(variant, theme.mode),
  };

  if (pressable || onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        style={[animatedStyle, cardStyle, style]}
        {...rest}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <Animated.View
      style={[animatedStyle, cardStyle, style]}
      accessibilityLabel={accessibilityLabel}
      accessible={accessibilityLabel != null}
    >
      {children}
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getBackground(variant: SPCardProps['variant'], mode: 'light' | 'dark'): string {
  switch (variant) {
    case 'glass':
      return mode === 'dark' ? 'rgba(30,30,30,0.78)' : 'rgba(246,241,231,0.82)';
    case 'elevated':
      return mode === 'dark' ? '#252525' : '#FFFFFF';
    default:
      return mode === 'dark' ? '#1E1E1E' : '#FFFFFF';
  }
}

function getBorderColor(variant: SPCardProps['variant'], mode: 'light' | 'dark'): string {
  switch (variant) {
    case 'glass':
      return mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(101,116,74,0.18)';
    default:
      return mode === 'dark' ? '#333333' : '#E8E3D8';
  }
}

function getShadow(variant: SPCardProps['variant'], mode: 'light' | 'dark'): ViewStyle {
  if (variant === 'elevated') {
    return {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: mode === 'dark' ? 0.35 : 0.12,
      shadowRadius: 8,
      elevation: 4,
    };
  }
  if (variant === 'glass') {
    return {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: mode === 'dark' ? 0.25 : 0.08,
      shadowRadius: 4,
      elevation: 2,
    };
  }
  return {};
}
