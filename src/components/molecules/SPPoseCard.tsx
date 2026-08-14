/**
 * SPPoseCard — masonry pose card.
 * Port of ReferencePoseCard.kt.
 * Features: image, pose name, category pill, heart/favorite icon, camera shortcut button.
 * Min touch targets ≥ 48×48 dp. [Req 32]
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

export type PoseDifficulty = 'easy' | 'medium' | 'hard';

export interface SPPoseCardProps {
  /** Unique pose identifier. */
  id: string;
  /** Display name of the pose. */
  name: string;
  /** Category for the pill label. */
  category: string;
  /** Image URI — remote URL or local file path. */
  imageUri?: string;
  /** Difficulty level. */
  difficulty?: PoseDifficulty;
  /** Whether this pose is currently favorited. */
  isFavorite?: boolean;
  /** Whether this pose requires premium access. */
  isPremium?: boolean;
  /** Card width; used for aspect-ratio calculation. */
  width?: number;
  /** Card height override. */
  height?: number;
  /** Called when the card body is tapped. */
  onPress?: (id: string) => void;
  /** Called when the heart icon is tapped. */
  onFavoritePress?: (id: string) => void;
  /** Called when the camera shortcut is tapped. */
  onCameraPress?: (id: string) => void;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Difficulty badge config
// ---------------------------------------------------------------------------

const DIFFICULTY_BADGE: Record<PoseDifficulty, { label: string; variant: 'success' | 'warning' | 'error' }> = {
  easy: { label: 'Easy', variant: 'success' },
  medium: { label: 'Medium', variant: 'warning' },
  hard: { label: 'Hard', variant: 'error' },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ---------------------------------------------------------------------------
// SPPoseCard
// ---------------------------------------------------------------------------

export function SPPoseCard({
  id,
  name,
  category,
  imageUri,
  difficulty,
  isFavorite = false,
  isPremium = false,
  width,
  height,
  onPress,
  onFavoritePress,
  onCameraPress,
  style,
}: SPPoseCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.97, { duration: AnimationDurations.quick });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: AnimationDurations.quick });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const cardBg = theme.mode === 'dark' ? theme.colors.cardBackground : '#FFFFFF';
  const imageHeight = height ? height * 0.62 : 160;

  return (
    <AnimatedPressable
      onPress={() => onPress?.(id)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`${name} pose, ${category} category`}
      accessibilityHint="Double tap to view pose details"
      style={[animatedStyle, styles.card, { backgroundColor: cardBg, width }, style]}
    >
      {/* Image */}
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={`${name} reference pose image`}
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: theme.mode === 'dark' ? '#2A2A2A' : '#E8E3D8' }]}>
            <Text style={[styles.placeholderIcon, { color: theme.colors.textDisabled }]}>🖼</Text>
          </View>
        )}

        {/* Gradient overlay at bottom of image for legibility */}
        <View style={styles.imageOverlay} pointerEvents="none" />

        {/* Premium badge */}
        {isPremium && (
          <View style={styles.premiumBadge}>
            <SPBadge label="Premium" variant="warning" />
          </View>
        )}

        {/* Favorite button — top-right */}
        <Pressable
          onPress={() => onFavoritePress?.(id)}
          style={styles.favoriteButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          accessibilityHint="Double tap to toggle favorite"
          accessibilityState={{ selected: isFavorite }}
        >
          <Text style={[styles.heartIcon, { color: isFavorite ? Colors.error : '#FFFFFF' }]}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Name */}
        <Text
          style={[styles.name, { color: theme.colors.textPrimary }]}
          numberOfLines={2}
        >
          {name}
        </Text>

        {/* Pills row */}
        <View style={styles.pills}>
          <SPBadge label={category} variant="primary" />
          {difficulty && (
            <SPBadge
              label={DIFFICULTY_BADGE[difficulty].label}
              variant={DIFFICULTY_BADGE[difficulty].variant}
              style={styles.ml6}
            />
          )}
        </View>
      </View>

      {/* Camera shortcut — bottom-right FAB */}
      <Pressable
        onPress={() => onCameraPress?.(id)}
        style={[styles.cameraButton, { backgroundColor: Colors.olive }]}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel={`Use ${name} pose in camera`}
        accessibilityHint="Opens the camera with this pose overlay preloaded"
      >
        <Text style={styles.cameraIcon}>📷</Text>
      </Pressable>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 32,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
    // Simulate gradient via opacity layers (Skia canvas needed for true gradient)
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    fontSize: 16,
    lineHeight: 20,
  },
  content: {
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm + 4, // extra bottom for camera button clearance
    gap: 6,
  },
  name: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold as '600',
    lineHeight: 19,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  ml6: { marginLeft: 6 },
  cameraButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  cameraIcon: {
    fontSize: 16,
    lineHeight: 20,
  },
});
