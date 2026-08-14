/**
 * SPCategoryCard — category browsing card.
 * 2-column grid card with photo, category name, and pose count.
 * Shared-element-compatible layout. [Req 5.2, Req 32]
 */

import React, { useCallback } from 'react';
import {
  Image,
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
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';
import { AnimationDurations, BorderRadius, Colors, Spacing, Typography } from '@/constants/designTokens';
import { SPBadge } from '@/components/atoms/SPBadge';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SPCategoryCardProps {
  /** Category slug identifier. */
  slug: string;
  /** Display name of the category. */
  name: string;
  /** Total number of poses in this category. */
  poseCount: number;
  /** Category cover image URI. */
  imageUri?: string;
  /** Accent colour for the category (from Firestore `color` field). */
  accentColor?: string;
  /** Whether this is a premium-only category. */
  isPremium?: boolean;
  /** Card width. */
  width?: number | `${number}%`;
  /** Card height. */
  height?: number;
  /** Called when the card is tapped. */
  onPress?: (slug: string) => void;
  style?: StyleProp<ViewStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ---------------------------------------------------------------------------
// SPCategoryCard
// ---------------------------------------------------------------------------

export function SPCategoryCard({
  slug,
  name,
  poseCount,
  imageUri,
  accentColor,
  isPremium = false,
  width = '100%',
  height = 160,
  onPress,
  style,
}: SPCategoryCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.96, { duration: AnimationDurations.quick });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: AnimationDurations.quick });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const poseCountLabel = `${poseCount} ${poseCount === 1 ? 'pose' : 'poses'}`;

  return (
    <AnimatedPressable
      onPress={() => onPress?.(slug)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`${name} category, ${poseCountLabel}${isPremium ? ', Premium' : ''}`}
      accessibilityHint="Double tap to browse poses in this category"
      style={[animatedStyle, styles.card, { width, height }, style]}
    >
      {/* Background image */}
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          accessibilityElementsHidden
        />
      ) : (
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: accentColor ?? (theme.mode === 'dark' ? '#2A2A2A' : '#E8E3D8') }]}
        />
      )}

      {/* Dark scrim for text readability */}
      <View style={styles.scrim} pointerEvents="none" />

      {/* Premium badge */}
      {isPremium && (
        <View style={styles.premiumBadge}>
          <SPBadge label="Premium" variant="warning" />
        </View>
      )}

      {/* Bottom content */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.count}>
          {poseCountLabel}
        </Text>
      </View>

      {/* Accent border at bottom */}
      {accentColor != null && (
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      )}
    </AnimatedPressable>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: '#1E1E1E',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  premiumBadge: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    paddingTop: Spacing.xl,
    // Subtle gradient-like fade via layered transparency
    backgroundColor: 'rgba(0,0,0,0.30)',
  },
  name: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold as '700',
    lineHeight: 22,
  },
  count: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium as '500',
    marginTop: 2,
  },
  accentBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
});
