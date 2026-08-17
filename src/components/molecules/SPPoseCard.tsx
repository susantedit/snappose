/**
 * SPPoseCard — Tactile editorial masonry pose card.
 *
 * Features:
 *  • Tactile compress (1 → 0.96 → 1) with Reanimated spring physics
 *  • Subtle image zoom (1 → 1.04) on press
 *  • Signature favorite spring micro-interaction (1 → 1.35 → 0.95 → 1) with radial pulse ring
 *  • Haptic-feel feedback & accessibility hints
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
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/constants/theme';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/designTokens';
import { SPBadge } from '@/components/atoms/SPBadge';
import { SPIcon } from '@/components/atoms/SPIcon';
import { MotionDurations, MotionSprings, useReducedMotion } from '@/constants/motion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PoseDifficulty = 'easy' | 'medium' | 'hard';

export interface SPPoseCardProps {
  id: string;
  name: string;
  category: string;
  imageUri?: string;
  difficulty?: PoseDifficulty;
  isFavorite?: boolean;
  isPremium?: boolean;
  width?: number;
  height?: number;
  onPress?: (id: string) => void;
  onFavoritePress?: (id: string) => void;
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
// SPPoseCard Component
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
  const reduceMotion = useReducedMotion();

  const scale = useSharedValue(1);
  const imageScale = useSharedValue(1);
  const heartScale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);

  const handlePressIn = useCallback(() => {
    if (!reduceMotion) {
      scale.value = withTiming(0.965, { duration: MotionDurations.fast });
      imageScale.value = withTiming(1.04, { duration: MotionDurations.normal });
    }
  }, [reduceMotion, scale, imageScale]);

  const handlePressOut = useCallback(() => {
    if (!reduceMotion) {
      scale.value = withSpring(1, MotionSprings.snappy);
      imageScale.value = withTiming(1, { duration: MotionDurations.normal });
    }
  }, [reduceMotion, scale, imageScale]);

  const handleHeartPress = useCallback(() => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }

    if (!reduceMotion) {
      heartScale.value = withSequence(
        withTiming(0.85, { duration: 60 }),
        withSpring(1.35, MotionSprings.bouncy),
        withSpring(1, MotionSprings.snappy),
      );
      pulseScale.value = 1;
      pulseOpacity.value = 0.8;
      pulseScale.value = withTiming(1.8, { duration: 350 });
      pulseOpacity.value = withTiming(0, { duration: 350 });
    }

    onFavoritePress?.(id);
  }, [id, onFavoritePress, reduceMotion, heartScale, pulseScale, pulseOpacity]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const cardBg = theme.mode === 'dark' ? theme.colors.cardBackground : '#FFFFFF';
  const imageHeight = height ? height * 0.62 : 164;

  return (
    <AnimatedPressable
      onPress={() => onPress?.(id)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`${name} pose, ${category} category`}
      accessibilityHint="Double tap to view pose details"
      style={[styles.card, { backgroundColor: cardBg, width }, style, animatedCardStyle]}
    >
      {/* Image Container with Zoom Reveal */}
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        {imageUri ? (
          <Animated.Image
            source={{ uri: imageUri }}
            style={[styles.image, animatedImageStyle]}
            resizeMode="cover"
            accessibilityLabel={`${name} reference pose image`}
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: theme.mode === 'dark' ? '#2A2A2A' : '#E8E3D8' }]}>
            <SPIcon name="image" size={32} color={theme.colors.textDisabled} />
          </View>
        )}

        {/* Gradient shadow overlay */}
        <View style={styles.imageOverlay} pointerEvents="none" />

        {/* Premium badge */}
        {isPremium && (
          <View style={styles.premiumBadge}>
            <SPBadge label="Premium" variant="warning" />
          </View>
        )}

        {/* Favorite button with signature spring pulse */}
        <View style={styles.favoriteButtonContainer}>
          {/* Radial pulse ring */}
          <Animated.View style={[styles.pulseRing, pulseAnimatedStyle]} />

          <Animated.View style={heartAnimatedStyle}>
            <Pressable
              onPress={handleHeartPress}
              style={styles.favoriteButton}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              accessibilityHint="Double tap to toggle favorite"
              accessibilityState={{ selected: isFavorite }}
            >
              <SPIcon
                name={isFavorite ? 'heart-filled' : 'heart'}
                size={18}
                color={isFavorite ? Colors.error : '#FFFFFF'}
                fill={isFavorite ? Colors.error : 'none'}
                strokeWidth={2.2}
              />
            </Pressable>
          </Animated.View>
        </View>
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

      {/* Camera shortcut — bottom-right tactile FAB */}
      <Pressable
        onPress={() => onCameraPress?.(id)}
        style={[styles.cameraButton, { backgroundColor: Colors.olive }]}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel={`Use ${name} pose in camera`}
        accessibilityHint="Opens the camera with this pose overlay preloaded"
      >
        <SPIcon name="camera" size={17} color="#FFFFFF" strokeWidth={2.2} />
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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
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
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(239, 68, 68, 0.4)',
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm + 4,
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
});
