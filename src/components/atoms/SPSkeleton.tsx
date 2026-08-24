/**
 * SPSkeleton — Reusable shimmer skeleton primitives.
 *
 * All animation runs on the UI thread via Reanimated shared values.
 * Zero JS-thread cost during shimmer. Respects prefers-reduce-motion.
 *
 * Exports:
 *   Skeleton        — base rectangular placeholder
 *   SkeletonText    — multi-line text placeholder
 *   SkeletonCircle  — circular avatar/icon placeholder
 *   SkeletonCard    — full pose card placeholder matching SPPoseCard
 *   SkeletonRow     — horizontal strip placeholder
 */

import React, { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';
import { BorderRadius } from '@/constants/designTokens';
import { useReducedMotion } from '@/constants/motion';

// ---------------------------------------------------------------------------
// Shimmer hook — runs on UI thread, zero JS-thread cost
// ---------------------------------------------------------------------------

function useShimmer() {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    progress.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
    return () => {
      progress.value = 0;
    };
  }, [reduceMotion, progress]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion
      ? 0.6
      : interpolate(progress.value, [0, 0.5, 1], [0.45, 0.75, 0.45]),
  }));

  return shimmerStyle;
}

// ---------------------------------------------------------------------------
// Base Skeleton rect
// ---------------------------------------------------------------------------

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';
  const shimmerStyle = useShimmer();

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: isDark ? '#2A2A2A' : '#E8E2D8',
        },
        shimmerStyle,
        style,
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Skeleton Text — multi-line
// ---------------------------------------------------------------------------

interface SkeletonTextProps {
  lines?: number;
  lineHeight?: number;
  gap?: number;
  lastLineWidth?: number | `${number}%`;
  style?: StyleProp<ViewStyle>;
}

export function SkeletonText({
  lines = 2,
  lineHeight = 14,
  gap = 8,
  lastLineWidth = '65%',
  style,
}: SkeletonTextProps) {
  return (
    <View style={[{ gap }, style]}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 && lines > 1 ? lastLineWidth : '100%'}
          height={lineHeight}
          borderRadius={6}
        />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Skeleton Circle — avatar / icon
// ---------------------------------------------------------------------------

interface SkeletonCircleProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function SkeletonCircle({ size = 40, style }: SkeletonCircleProps) {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius={size / 2}
      style={style}
    />
  );
}

// ---------------------------------------------------------------------------
// Skeleton Card — matches SPPoseCard layout
// ---------------------------------------------------------------------------

interface SkeletonCardProps {
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export function SkeletonCard({ width = 160, height = 220, style }: SkeletonCardProps) {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';

  return (
    <View
      style={[
        styles.card,
        { width, height, backgroundColor: isDark ? '#1E1E1E' : '#F0EAE0' },
        style,
      ]}
    >
      {/* Image placeholder */}
      <Skeleton
        width="100%"
        height={height * 0.72}
        borderRadius={0}
      />

      {/* Text content placeholder */}
      <View style={styles.cardContent}>
        <Skeleton width="80%" height={13} borderRadius={6} />
        <View style={{ height: 6 }} />
        <Skeleton width="50%" height={11} borderRadius={5} />
      </View>

      {/* Badge placeholder bottom-left */}
      <View style={styles.badgePlaceholder}>
        <Skeleton width={44} height={18} borderRadius={9} />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Skeleton Row — horizontal strip for carousels
// ---------------------------------------------------------------------------

interface SkeletonRowProps {
  count?: number;
  itemWidth?: number;
  itemHeight?: number;
  gap?: number;
  style?: StyleProp<ViewStyle>;
}

export function SkeletonRow({
  count = 4,
  itemWidth = 175,
  itemHeight = 230,
  gap = 12,
  style,
}: SkeletonRowProps) {
  return (
    <View style={[{ flexDirection: 'row', gap, paddingVertical: 6 }, style]}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} width={itemWidth} height={itemHeight} />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Skeleton Grid — 2-col masonry for main pose grid
// ---------------------------------------------------------------------------

interface SkeletonGridProps {
  count?: number;
  cardWidth: number;
  cardHeight: number;
  gap?: number;
  style?: StyleProp<ViewStyle>;
}

export function SkeletonGrid({
  count = 6,
  cardWidth,
  cardHeight,
  gap = 12,
  style,
}: SkeletonGridProps) {
  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap }, style]}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} width={cardWidth} height={cardHeight} />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 10,
  },
  badgePlaceholder: {
    position: 'absolute',
    bottom: 42,
    left: 10,
  },
});
