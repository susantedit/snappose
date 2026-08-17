/**
 * ShimmerSkeleton — Photographic subtle shimmer loading placeholder.
 */

import React, { useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { BorderRadius } from '@/constants/designTokens';
import { useTheme } from '@/constants/theme';
import { MotionEasings, useReducedMotion } from '@/constants/motion';

export interface ShimmerSkeletonProps {
  width?: number | `${number}%` | 'auto';
  height?: number | `${number}%`;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function ShimmerSkeleton({
  width = '100%',
  height = 20,
  borderRadius = BorderRadius.sm,
  style,
}: ShimmerSkeletonProps) {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';
  const reduceMotion = useReducedMotion();

  const opacity = useSharedValue(0.4);

  useEffect(() => {
    if (!reduceMotion) {
      opacity.value = withRepeat(
        withTiming(0.85, {
          duration: 900,
          easing: MotionEasings.inOutCubic,
        }),
        -1,
        true,
      );
    }
  }, [reduceMotion, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const baseBg = isDark ? '#2E2E2E' : '#E6E0D4';

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseBg,
        },
        style,
        animatedStyle,
      ]}
    />
  );
}
