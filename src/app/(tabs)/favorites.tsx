/**
 * FavoritesScreen — Saved Poses Collection with Motion & Polish for Snap Pose.
 *
 * Features:
 *  • 2-Column masonry grid of favorited poses with smooth FadeInDown item entrance
 *  • Tactile Sort pills with crisp SVG icons: Newest, Oldest, Category, Difficulty
 *  • Instant un-favorite / favorite action with toast feedback & haptics
 *  • Camera assist shortcut on cards
 *  • Elegant empty state with pulsing SVG heart icon & "Discover Poses" CTA
 */

import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/constants/theme';
import {
  Colors,
  Spacing,
} from '@/constants/designTokens';
import { SPPoseCard } from '@/components/molecules/SPPoseCard';
import { SPToast, useToast } from '@/components/molecules/SPToast';
import { SPIcon } from '@/components/atoms/SPIcon';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';
import { useReducedMotion } from '@/constants/motion';
import { useFavorites, type SortMode } from '@/features/favorites/hooks/useFavorites';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = Spacing.md;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

interface SortOption {
  key: SortMode;
  label: string;
  icon: string;
}

const SORT_OPTIONS: SortOption[] = [
  { key: 'newest', label: 'Newest', icon: 'newest' },
  { key: 'oldest', label: 'Oldest', icon: 'oldest' },
  { key: 'category', label: 'Category', icon: 'category' },
  { key: 'difficulty', label: 'Difficulty', icon: 'difficulty' },
];

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const reduceMotion = useReducedMotion();

  const { favorites, toggleFavorite } = useFavorites(sortMode);
  const { toastProps, showToast } = useToast();

  const isDark = theme.mode === 'dark';

  const handleOpenPose = useCallback((id: string) => {
    router.push({
      pathname: '/pose/[id]',
      params: { id },
    });
  }, []);

  const handleTryPose = useCallback((id: string) => {
    router.navigate({
      pathname: '/(tabs)/camera',
      params: { poseId: id },
    });
  }, []);

  const handleToggleFavorite = useCallback(
    (poseId: string) => {
      const pose = favorites.find((p) => p.id === poseId);
      if (pose) {
        toggleFavorite(pose);
        showToast({
          message: 'Removed from favorites',
          variant: 'info',
        });
      }
    },
    [favorites, toggleFavorite, showToast],
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.sm,
            paddingBottom: insets.bottom + 90,
          },
        ]}
      >
        {/* ── Header ──────────────────────────────────────────────── */}
        <Animated.View
          entering={reduceMotion ? undefined : FadeIn.duration(400)}
          style={styles.header}
        >
          <Text style={[styles.screenTitle, { color: isDark ? '#FFF' : Colors.textPrimary }]}>
            Favorites
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#AAA' : Colors.textSecondary }]}>
            Your curated collection of pose ideas
          </Text>
        </Animated.View>

        {/* ── Sort Pills (Only when favorites exist) ────────────────── */}
        {favorites.length > 0 && (
          <Animated.View
            entering={reduceMotion ? undefined : FadeInDown.duration(400).delay(100)}
            style={styles.sortRowContainer}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sortScroll}
            >
              {SORT_OPTIONS.map((opt) => {
                const isSelected = sortMode === opt.key;
                const iconColor = isSelected
                  ? '#FFF'
                  : isDark
                  ? '#DDD'
                  : Colors.textPrimary;

                return (
                  <AnimatedPressable
                    key={opt.key}
                    onPress={() => setSortMode(opt.key)}
                    scaleTo={0.92}
                    hapticFeedback="selection"
                    style={[
                      styles.sortPill,
                      isSelected
                        ? {
                            backgroundColor: Colors.olive,
                            borderColor: Colors.darkAccent,
                            elevation: 3,
                            shadowColor: Colors.olive,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.35,
                            shadowRadius: 4,
                          }
                        : {
                            backgroundColor: isDark ? '#242424' : '#EAE4D8',
                            borderColor: isDark ? '#383838' : '#DFD7C7',
                          },
                    ]}
                  >
                    <SPIcon name={opt.icon} size={14} color={iconColor} strokeWidth={2.2} />
                    <Text
                      style={[
                        styles.sortLabel,
                        {
                          color: iconColor,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </AnimatedPressable>
                );
              })}
            </ScrollView>
          </Animated.View>
        )}

        {/* ── Main Favorites Grid / Empty State ────────────────────── */}
        {favorites.length === 0 ? (
          /* Empty State */
          <Animated.View
            entering={reduceMotion ? undefined : FadeIn.duration(400)}
            style={styles.emptyStateContainer}
          >
            <View style={styles.emptyHeartCircle}>
              <SPIcon
                name="heart-filled"
                size={34}
                color={Colors.error}
                fill={Colors.error}
              />
            </View>
            <Text style={[styles.emptyTitle, { color: isDark ? '#FFF' : Colors.textPrimary }]}>
              No favorites saved yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: isDark ? '#AAA' : Colors.textSecondary }]}>
              Tap the heart icon on any pose card to build your personal collection
            </Text>
            <AnimatedPressable
              onPress={() => router.push('/(tabs)')}
              scaleTo={0.95}
              style={styles.emptyExploreButton}
            >
              <Text style={styles.emptyExploreButtonText}>Discover Poses →</Text>
            </AnimatedPressable>
          </Animated.View>
        ) : (
          <View style={styles.posesGrid}>
            {favorites.map((pose, index) => (
              <Animated.View
                key={pose.id}
                entering={
                  reduceMotion
                    ? undefined
                    : FadeInDown.duration(350)
                        .delay(Math.min(index * 40, 300))
                        .springify()
                }
                style={{ width: CARD_WIDTH }}
              >
                <SPPoseCard
                  id={pose.id}
                  name={pose.title}
                  category={pose.category ?? pose.categoryId}
                  imageUri={pose.imageUrl}
                  difficulty={pose.difficulty}
                  isFavorite={true}
                  width={CARD_WIDTH}
                  height={CARD_WIDTH * 1.35}
                  onPress={handleOpenPose}
                  onFavoritePress={handleToggleFavorite}
                  onCameraPress={handleTryPose}
                />
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>

      <SPToast {...toastProps} />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },

  // Header
  header: {
    marginBottom: Spacing.md,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },

  // Sort Row
  sortRowContainer: {
    marginBottom: Spacing.md,
  },
  sortScroll: {
    paddingVertical: 4,
    gap: 8,
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
  },
  sortLabel: {
    fontSize: 12,
  },

  // Grid
  posesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    marginTop: Spacing.xs,
  },

  // Empty State
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    gap: 8,
  },
  emptyHeartCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  emptyExploreButton: {
    marginTop: 14,
    backgroundColor: Colors.olive,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 16,
    shadowColor: Colors.olive,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  emptyExploreButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
