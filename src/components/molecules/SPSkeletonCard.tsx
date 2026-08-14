/**
 * SPSkeletonCard — shimmer placeholder for loading states.
 * Uses Reanimated v3 loop animation for the shimmer sweep effect.
 * Compatible with dark/light theme. [Req 32]
 */

import React, { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';
import { BorderRadius } from '@/constants/designTokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SPSkeletonCardVariant = 'pose' | 'category' | 'list' | 'compact';

export interface SPSkeletonCardProps {
  /** Layout variant. Defaults to 'pose'. */
  variant?: SPSkeletonCardVariant;
  /** Width of the card. Defaults to '100%'. */
  width?: number | `${number}%`;
  /** Height override. */
  height?: number;
  /** Additional container style. */
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Base shimmer line
// ---------------------------------------------------------------------------

interface ShimmerLineProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  shimmerProgress: Animated.SharedValue<number>;
  baseColor: string;
  highlightColor: string;
}

function ShimmerLine({
  width = '100%',
  height = 14,
  borderRadius = 6,
  style,
  shimmerProgress,
  baseColor,
  highlightColor,
}: ShimmerLineProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmerProgress.value, [0, 0.5, 1], [0, 1, 0]);
    return { opacity };
  });

  return (
    <View
      style={[
        { width, height, borderRadius, backgroundColor: baseColor, overflow: 'hidden' },
        style,
      ]}
    >
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: highlightColor }, animatedStyle]}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// SPSkeletonCard
// ---------------------------------------------------------------------------

export function SPSkeletonCard({
  variant = 'pose',
  width = '100%',
  height,
  style,
}: SPSkeletonCardProps) {
  const { theme } = useTheme();
  const shimmerProgress = useSharedValue(0);

  const baseColor = theme.mode === 'dark' ? '#2A2A2A' : '#E8E3D8';
  const highlightColor = theme.mode === 'dark' ? '#3A3A3A' : '#F6F1E7';

  useEffect(() => {
    shimmerProgress.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [shimmerProgress]);

  const sharedProps: Pick<ShimmerLineProps, 'shimmerProgress' | 'baseColor' | 'highlightColor'> = {
    shimmerProgress,
    baseColor,
    highlightColor,
  };

  if (variant === 'pose') {
    const cardHeight = height ?? 240;
    return (
      <View style={[styles.card, { width, backgroundColor: theme.mode === 'dark' ? '#1E1E1E' : '#FFFFFF' }, style]}>
        {/* Image placeholder */}
        <ShimmerLine height={cardHeight * 0.62} borderRadius={0} width="100%" {...sharedProps} />
        {/* Content */}
        <View style={styles.content}>
          <ShimmerLine width="70%" height={14} {...sharedProps} />
          <ShimmerLine width="45%" height={10} style={styles.mt8} {...sharedProps} />
          {/* Pills row */}
          <View style={styles.row}>
            <ShimmerLine width={64} height={22} borderRadius={BorderRadius.full} {...sharedProps} />
            <ShimmerLine width={48} height={22} borderRadius={BorderRadius.full} style={styles.ml8} {...sharedProps} />
          </View>
        </View>
      </View>
    );
  }

  if (variant === 'category') {
    const cardHeight = height ?? 160;
    return (
      <View style={[styles.card, { width, backgroundColor: theme.mode === 'dark' ? '#1E1E1E' : '#FFFFFF' }, style]}>
        <ShimmerLine height={cardHeight * 0.7} borderRadius={0} width="100%" {...sharedProps} />
        <View style={styles.content}>
          <ShimmerLine width="60%" height={14} {...sharedProps} />
          <ShimmerLine width="35%" height={10} style={styles.mt8} {...sharedProps} />
        </View>
      </View>
    );
  }

  if (variant === 'list') {
    return (
      <View style={[styles.listItem, { backgroundColor: theme.mode === 'dark' ? '#1E1E1E' : '#FFFFFF' }, style]}>
        <ShimmerLine width={64} height={64} borderRadius={BorderRadius.sm} {...sharedProps} />
        <View style={[styles.listContent]}>
          <ShimmerLine width="75%" height={14} {...sharedProps} />
          <ShimmerLine width="50%" height={10} style={styles.mt8} {...sharedProps} />
          <ShimmerLine width="35%" height={10} style={styles.mt8} {...sharedProps} />
        </View>
      </View>
    );
  }

  // compact
  return (
    <View style={[styles.compact, { width, backgroundColor: baseColor }, style]}>
      <ShimmerLine width="100%" height={height ?? 100} borderRadius={BorderRadius.md} {...sharedProps} />
    </View>
  );
}

// ---------------------------------------------------------------------------
// SPSkeletonList — renders N skeleton cards
// ---------------------------------------------------------------------------

export function SPSkeletonList({ count = 4, variant = 'pose' }: { count?: number; variant?: SPSkeletonCardVariant }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <SPSkeletonCard key={i} variant={variant} style={i > 0 ? { marginTop: 12 } : undefined} />
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  content: {
    padding: 12,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
  },
  ml8: { marginLeft: 8 },
  mt8: { marginTop: 8 },
  listItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  listContent: {
    flex: 1,
    gap: 4,
  },
  compact: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
});
