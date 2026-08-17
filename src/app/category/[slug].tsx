/**
 * CategoryScreen — app/category/[slug].tsx
 *
 * Full category browsing screen with hero banner, 2-column pose grid,
 * difficulty badges, favorite toggles, and Try Pose actions.
 * All icons rendered via crisp SVG SPIcon with spring micro-interactions.
 */

import React, { useCallback, useMemo } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/constants/theme';
import {
  BorderRadius,
  Colors,
  Spacing,
} from '@/constants/designTokens';
import { SPPoseCard } from '@/components/molecules/SPPoseCard';
import { SPToast, useToast } from '@/components/molecules/SPToast';
import { SPIcon } from '@/components/atoms/SPIcon';
import { SNAP_POSE_CATEGORIES, SNAP_POSE_DATASET } from '@/features/poses/data/posesData';
import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import type { Pose } from '@/features/poses/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = Spacing.md;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

export default function CategoryScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toastProps, showToast } = useToast();

  const category = useMemo(() => {
    return (
      SNAP_POSE_CATEGORIES.find(
        (c) => c.slug === slug || c.id === slug || c.name.toLowerCase() === slug?.toLowerCase()
      ) ?? SNAP_POSE_CATEGORIES[1]
    );
  }, [slug]);

  const poses = useMemo<Pose[]>(() => {
    if (!category || category.id === 'all') return SNAP_POSE_DATASET;
    return SNAP_POSE_DATASET.filter((p) => p.categoryId === category.id || p.category?.toLowerCase() === category.slug);
  }, [category]);

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
      const pose = SNAP_POSE_DATASET.find((p) => p.id === poseId);
      if (pose) {
        const wasFav = isFavorite(poseId);
        toggleFavorite(pose);
        showToast({
          message: wasFav ? 'Removed from favorites' : 'Saved to favorites',
          variant: wasFav ? 'info' : 'success',
        });
      }
    },
    [isFavorite, toggleFavorite, showToast]
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.sm,
            paddingBottom: insets.bottom + 60,
          },
        ]}
      >
        {/* Top Navigation Row */}
        <View style={styles.topNav}>
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.backButton,
              { backgroundColor: isDark ? '#242424' : '#EAE4D8' },
            ]}
          >
            <SPIcon name="arrowLeft" size={18} color={isDark ? '#FFF' : Colors.textPrimary} strokeWidth={2.4} />
          </Pressable>
          <View style={styles.headingRow}>
            <SPIcon name={category.icon ?? 'sparkles'} size={18} color={Colors.olive} strokeWidth={2.2} />
            <Text style={[styles.categoryHeading, { color: isDark ? '#FFF' : Colors.textPrimary }]}>
              {category.name}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Category Hero Banner */}
        <Animated.View entering={FadeIn.duration(350)} style={styles.heroCard}>
          <Image source={{ uri: category.image }} style={styles.heroImg} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{category.name} Photography</Text>
            <Text style={styles.heroCount}>{poses.length} curated pose inspirations</Text>
          </View>
        </Animated.View>

        {/* Poses Grid */}
        <View style={styles.posesGrid}>
          {poses.map((pose, index) => (
            <Animated.View
              key={pose.id}
              entering={FadeInDown.duration(300).delay(index * 30)}
              style={{ width: CARD_WIDTH }}
            >
              <SPPoseCard
                id={pose.id}
                name={pose.title}
                category={pose.category ?? pose.categoryId}
                imageUri={pose.imageUrl}
                difficulty={pose.difficulty}
                isFavorite={isFavorite(pose.id)}
                width={CARD_WIDTH}
                height={CARD_WIDTH * 1.35}
                onPress={handleOpenPose}
                onFavoritePress={handleToggleFavorite}
                onCameraPress={handleTryPose}
              />
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <SPToast {...toastProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryHeading: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  heroCard: {
    width: '100%',
    height: 160,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  heroImg: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  heroContent: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  heroCount: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  posesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    justifyContent: 'space-between',
  },
});
