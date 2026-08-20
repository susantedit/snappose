/**
 * HomeScreen — Editorial Photography, Cinematic Motion & Personalized AI Feed for Snap Pose.
 *
 * Features:
 *  • Dynamic "Recommended For You" carousel powered by On-Device Personalization Engine
 *  • Editorial Explanation Badges ("Because you love mountain poses", "Try something new")
 *  • Staggered Hero Entrance Sequence with Scroll Parallax
 *  • Smooth Category Slider with active pill indicator
 *  • Trending & Editor's Picks horizontal carousels
 *  • 2-Column masonry pose cards with tactile spring micro-interactions
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
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
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';
import { MotionEasings, useReducedMotion } from '@/constants/motion';
import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import { usePersonalizationStore } from '@/stores/personalizationStore';
import { SNAP_POSE_CATEGORIES, SNAP_POSE_DATASET } from '@/features/poses/data/posesData';
import { saveImageToGallery } from '@/utils/saveImage';
import type { ScoredRecommendation } from '@/features/personalization';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = Spacing.md;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

// ---------------------------------------------------------------------------
// Category Chip Component
// ---------------------------------------------------------------------------

interface CategoryChipProps {
  id: string;
  name: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function CategoryChip({ id, name, isSelected, onSelect }: CategoryChipProps) {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';

  const iconColor = isSelected ? '#FFFFFF' : isDark ? '#DDD' : Colors.textPrimary;

  return (
    <AnimatedPressable
      onPress={() => onSelect(id)}
      scaleTo={0.93}
      hapticFeedback="selection"
      accessibilityRole="button"
      accessibilityLabel={`Filter by category ${name}`}
      accessibilityState={{ selected: isSelected }}
      style={[
        styles.chip,
        isSelected
          ? {
              backgroundColor: Colors.olive,
              borderColor: Colors.darkAccent,
              elevation: 4,
              shadowColor: Colors.olive,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.35,
              shadowRadius: 6,
            }
          : {
              backgroundColor: isDark ? '#242424' : '#EFE9DC',
              borderColor: isDark ? '#383838' : '#DFD7C7',
            },
      ]}
    >
      <SPIcon name={id} size={15} color={iconColor} strokeWidth={2.2} />
      <Text
        style={[
          styles.chipLabel,
          {
            color: isSelected ? '#FFFFFF' : isDark ? '#DDD' : Colors.textPrimary,
            fontWeight: isSelected ? '700' : '500',
          },
        ]}
      >
        {name}
      </Text>
    </AnimatedPressable>
  );
}

// ---------------------------------------------------------------------------
// Main HomeScreen
// ---------------------------------------------------------------------------

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toastProps, showToast } = useToast();
  const reduceMotion = useReducedMotion();

  // Personalization Engine Store
  const {
    getRecommendedPoses,
    recordSignal,
    isPersonalizationEnabled,
    outfitPreference,
  } = usePersonalizationStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Parallax Scroll Tracking
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const heroParallaxStyle = useAnimatedStyle(() => {
    if (reduceMotion) return {};
    return {
      transform: [
        { translateY: scrollY.value * 0.15 },
        { scale: interpolate(scrollY.value, [-100, 0, 200], [1.12, 1.0, 0.95], 'clamp') },
      ],
    };
  });

  const heroTextParallaxStyle = useAnimatedStyle(() => {
    if (reduceMotion) return {};
    return {
      transform: [{ translateY: scrollY.value * 0.05 }],
      opacity: interpolate(scrollY.value, [0, 180], [1, 0.4], 'clamp'),
    };
  });

  // Filtered poses based on selected category
  const filteredPoses = useMemo(() => {
    if (selectedCategory === 'all') {
      return SNAP_POSE_DATASET;
    }
    return SNAP_POSE_DATASET.filter((p) => p.categoryId === selectedCategory);
  }, [selectedCategory]);

  // Compute Personalized Recommendations
  const personalizedRecommendations = useMemo<ScoredRecommendation[]>(() => {
    return getRecommendedPoses(
      SNAP_POSE_DATASET,
      {
        currentCategory: selectedCategory !== 'all' ? selectedCategory : undefined,
        outfitCategory: outfitPreference,
      },
      8,
    );
  }, [getRecommendedPoses, selectedCategory, outfitPreference]);

  const trendingPoses = useMemo(() => {
    return [
      ...SNAP_POSE_DATASET.filter((p) => p.tags.includes('trending') || p.id.includes('drive') || p.id === 'pose-tony-stark-tpose'),
      ...SNAP_POSE_DATASET,
    ].filter((p, index, self) => self.findIndex((s) => s.id === p.id) === index).slice(0, 14);
  }, []);

  const editorsPicks = useMemo(() => SNAP_POSE_DATASET.slice(14, 26), []);

  const handleDownloadHeroCover = useCallback(async () => {
    showToast({
      message: 'Saving cover photo to gallery...',
      variant: 'info',
    });
    const result = await saveImageToGallery(
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80',
      'snappose_hero_cover'
    );
    showToast({
      message: result.message,
      variant: result.success ? 'success' : 'error',
    });
  }, [showToast]);

  const handleOpenPose = useCallback(
    (id: string, isFromRec = false) => {
      recordSignal({
        type: isFromRec ? 'RECOMMENDATION_CLICKED' : 'POSE_OPENED',
        poseId: id,
      });
      router.push({
        pathname: '/pose/[id]',
        params: { id },
      });
    },
    [recordSignal],
  );

  const handleTryPose = useCallback(
    (id: string) => {
      recordSignal({
        type: 'POSE_USED',
        poseId: id,
      });
      router.push({
        pathname: '/(tabs)/camera',
        params: { poseId: id },
      });
    },
    [recordSignal],
  );

  const handleToggleFavorite = useCallback(
    (poseId: string) => {
      const pose = SNAP_POSE_DATASET.find((p) => p.id === poseId);
      if (pose) {
        const wasFav = isFavorite(poseId);
        toggleFavorite(pose);
        recordSignal({
          type: wasFav ? 'POSE_UNFAVORITED' : 'POSE_FAVORITED',
          poseId: pose.id,
          categoryId: pose.categoryId,
        });
        showToast({
          message: wasFav ? 'Removed from favorites' : 'Saved to favorites',
          variant: wasFav ? 'info' : 'success',
        });
      }
    },
    [isFavorite, toggleFavorite, recordSignal, showToast],
  );

  const isDark = theme.mode === 'dark';

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.sm,
            paddingBottom: insets.bottom + 90,
          },
        ]}
      >
        {/* ── 1. Top Header ────────────────────────────────────────────── */}
        <Animated.View
          entering={reduceMotion ? undefined : FadeIn.duration(400)}
          style={styles.header}
        >
          <View style={styles.headerTitleContainer}>
            <View style={styles.brandRow}>
              <View style={styles.logoBadge}>
                <SPIcon name="camera" size={17} color="#FFFFFF" strokeWidth={2.4} />
              </View>
              <Text
                style={[
                  styles.brandName,
                  { color: isDark ? '#FFF' : Colors.textPrimary },
                ]}
              >
                Snap Pose
              </Text>
            </View>
            <Text style={[styles.subtitle, { color: isDark ? '#AAA' : Colors.textSecondary }]}>
              Find your perfect pose.
            </Text>
          </View>

          {/* Quick Header Actions */}
          <View style={styles.headerActions}>
            <AnimatedPressable
              onPress={() => router.push('/gallery')}
              scaleTo={0.9}
              style={[
                styles.headerIconButton,
                { backgroundColor: isDark ? '#242424' : '#EFE9DC' },
              ]}
              accessibilityLabel="View photo gallery"
            >
              <SPIcon
                name="gallery"
                size={18}
                color={isDark ? '#FFF' : Colors.textPrimary}
                strokeWidth={2}
              />
            </AnimatedPressable>
            <AnimatedPressable
              onPress={() => router.push('/(tabs)/settings')}
              scaleTo={0.9}
              style={[
                styles.headerIconButton,
                { backgroundColor: isDark ? '#242424' : '#EFE9DC' },
              ]}
              accessibilityLabel="Open settings"
            >
              <SPIcon
                name="settings"
                size={18}
                color={isDark ? '#FFF' : Colors.textPrimary}
                strokeWidth={2}
              />
            </AnimatedPressable>
          </View>
        </Animated.View>

        {/* ── 2. Cinematic Hero Section with Scroll Parallax ───────────── */}
        <Animated.View
          entering={
            reduceMotion
              ? undefined
              : FadeInDown.duration(600).easing(MotionEasings.outStandard)
          }
          style={styles.heroCardContainer}
        >
          <View style={styles.heroCard}>
            {/* Parallax Background image */}
            <Animated.Image
              source={{
                uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80',
              }}
              style={[styles.heroBackground, heroParallaxStyle]}
              resizeMode="cover"
            />
            <View style={styles.heroGradientOverlay} />

            {/* Parallax Typography & Action CTAs */}
            <Animated.View style={[styles.heroContent, heroTextParallaxStyle]}>
              <Animated.View
                entering={
                  reduceMotion
                    ? undefined
                    : FadeInDown.duration(400).delay(150).springify()
                }
                style={styles.heroTag}
              >
                <SPIcon name="sparkles" size={11} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.heroTagText}>POSE IT. SNAP IT. SHARE IT.</Text>
              </Animated.View>

              <Animated.Text
                entering={
                  reduceMotion
                    ? undefined
                    : FadeInDown.duration(450).delay(250).springify()
                }
                style={styles.heroTitle}
              >
                Ready to pose?
              </Animated.Text>

              <Animated.Text
                entering={
                  reduceMotion
                    ? undefined
                    : FadeInDown.duration(450).delay(350).springify()
                }
                style={styles.heroSubtitle}
              >
                Discover poses that make every shot look effortless with on-device AI guidance.
              </Animated.Text>

              <View style={styles.heroButtonsRow}>
                <AnimatedPressable
                  onPress={() => setSelectedCategory('all')}
                  scaleTo={0.95}
                  hapticFeedback="medium"
                  style={styles.heroPrimaryButton}
                  accessibilityLabel="Explore Poses"
                >
                  <Text style={styles.heroPrimaryButtonText}>EXPLORE POSES →</Text>
                </AnimatedPressable>

                <AnimatedPressable
                  onPress={() => router.navigate('/(tabs)/camera')}
                  scaleTo={0.95}
                  hapticFeedback="medium"
                  style={styles.heroSecondaryButton}
                  accessibilityLabel="Open Camera"
                >
                  <SPIcon name="camera" size={15} color="#FFFFFF" strokeWidth={2.2} />
                  <Text style={styles.heroSecondaryButtonText}>OPEN CAMERA</Text>
                </AnimatedPressable>

                <AnimatedPressable
                  onPress={handleDownloadHeroCover}
                  scaleTo={0.95}
                  hapticFeedback="light"
                  style={styles.heroDownloadIconButton}
                  accessibilityLabel="Save cover photo to gallery"
                >
                  <SPIcon name="download" size={15} color="#FFFFFF" strokeWidth={2.2} />
                </AnimatedPressable>
              </View>
            </Animated.View>
          </View>
        </Animated.View>

        {/* ── 3. 🔥 TOP TRENDING POSES SECTION ──────────────────────── */}
        {selectedCategory === 'all' && (
          <Animated.View
            entering={reduceMotion ? undefined : FadeInDown.duration(450).delay(150)}
            style={[styles.horizontalSection, { marginTop: Spacing.md }]}
          >
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleWithIcon}>
                <SPIcon name="trending" size={20} color={Colors.error} strokeWidth={2.4} />
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: isDark ? '#FFF' : Colors.textPrimary },
                  ]}
                >
                  🔥 Trending Poses
                </Text>
              </View>
              <View style={styles.trendingBadgePill}>
                <Text style={styles.trendingBadgePillText}>HOT TODAY</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalCardScroll}
              decelerationRate="fast"
            >
              {trendingPoses.map((pose) => (
                <View key={`trend-${pose.id}`} style={{ width: 175, marginRight: 14 }}>
                  <SPPoseCard
                    id={pose.id}
                    name={pose.title}
                    category={pose.category ?? pose.categoryId}
                    imageUri={pose.imageUrl}
                    difficulty={pose.difficulty}
                    isFavorite={isFavorite(pose.id)}
                    width={175}
                    height={230}
                    onPress={(id) => handleOpenPose(id, false)}
                    onFavoritePress={handleToggleFavorite}
                    onCameraPress={handleTryPose}
                  />
                </View>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* ── 4. Category Filter Chips ─────────────────────────────────── */}
        <Animated.View
          entering={reduceMotion ? undefined : FadeInDown.duration(400).delay(200)}
          style={[styles.categoriesSection, { marginTop: Spacing.lg }]}
        >
          <View style={styles.sectionHeaderRow}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? '#FFF' : Colors.textPrimary },
              ]}
            >
              Categories
            </Text>
            <Pressable onPress={() => router.push('/(tabs)/search')}>
              <Text style={[styles.seeAllText, { color: Colors.olive }]}>
                Search all →
              </Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {SNAP_POSE_CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat.id}
                id={cat.id}
                name={cat.name}
                isSelected={selectedCategory === cat.id}
                onSelect={(id) => {
                  setSelectedCategory(id);
                  recordSignal({
                    type: 'CATEGORY_OPENED',
                    categoryId: id,
                  });
                }}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* ── 5. Personalized "Recommended For You" Feed ─────────────── */}
        {selectedCategory === 'all' && (
          <Animated.View
            entering={reduceMotion ? undefined : FadeInDown.duration(450).delay(220)}
            style={styles.horizontalSection}
          >
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleWithIcon}>
                <SPIcon name="ai" size={19} color={Colors.olive} strokeWidth={2.2} />
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: isDark ? '#FFF' : Colors.textPrimary },
                  ]}
                >
                  {isPersonalizationEnabled ? 'Recommended for You' : 'Popular Poses'}
                </Text>
              </View>
              {isPersonalizationEnabled && (
                <View style={styles.aiBadgePill}>
                  <Text style={styles.aiBadgePillText}>ON-DEVICE AI</Text>
                </View>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalCardScroll}
              decelerationRate="fast"
            >
              {personalizedRecommendations.map((rec) => (
                <View key={`rec-${rec.pose.id}`} style={{ width: 185, marginRight: 14 }}>
                  {/* Human-Readable Explanation Tag */}
                  <View style={styles.explanationBadge}>
                    <Text style={styles.explanationText} numberOfLines={1}>
                      {rec.explanation}
                    </Text>
                  </View>
                  <SPPoseCard
                    id={rec.pose.id}
                    name={rec.pose.title}
                    category={rec.pose.category ?? rec.pose.categoryId}
                    imageUri={rec.pose.imageUrl}
                    difficulty={rec.pose.difficulty}
                    isFavorite={isFavorite(rec.pose.id)}
                    width={185}
                    height={235}
                    onPress={(id) => handleOpenPose(id, true)}
                    onFavoritePress={handleToggleFavorite}
                    onCameraPress={handleTryPose}
                  />
                </View>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* ── 6. Main Poses Grid (Category filtered or Curated Collection) ── */}
        <View style={styles.posesSection}>
          <View style={styles.sectionHeaderRow}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? '#FFF' : Colors.textPrimary },
              ]}
            >
              {selectedCategory === 'all'
                ? 'Curated Collection'
                : `${SNAP_POSE_CATEGORIES.find((c) => c.id === selectedCategory)?.name ?? ''} Poses`}
            </Text>
            <Text style={[styles.poseCountBadge, { color: isDark ? '#AAA' : Colors.textSecondary }]}>
              {filteredPoses.length} {filteredPoses.length === 1 ? 'idea' : 'ideas'}
            </Text>
          </View>

          <View style={styles.posesGrid}>
            {filteredPoses.map((pose, index) => (
              <Animated.View
                key={pose.id}
                entering={
                  reduceMotion
                    ? undefined
                    : FadeInDown.duration(380)
                        .delay(Math.min(index * 40, 400))
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
                  isFavorite={isFavorite(pose.id)}
                  width={CARD_WIDTH}
                  height={CARD_WIDTH * 1.35}
                  onPress={(id) => handleOpenPose(id, false)}
                  onFavoritePress={handleToggleFavorite}
                  onCameraPress={handleTryPose}
                />
              </Animated.View>
            ))}
          </View>
        </View>

        {/* ── 7. Editor's Selection Section ────────────────────────────── */}
        {selectedCategory === 'all' && (
          <Animated.View
            entering={reduceMotion ? undefined : FadeInDown.duration(450).delay(300)}
            style={[styles.horizontalSection, { marginTop: Spacing.xl }]}
          >
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleWithIcon}>
                <SPIcon name="editors" size={19} color={Colors.warning} strokeWidth={2.2} />
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: isDark ? '#FFF' : Colors.textPrimary },
                  ]}
                >
                  Editor's Selection
                </Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalCardScroll}
            >
              {editorsPicks.map((pose) => (
                <View key={`edit-${pose.id}`} style={{ width: 175, marginRight: 14 }}>
                  <SPPoseCard
                    id={pose.id}
                    name={pose.title}
                    category={pose.category ?? pose.categoryId}
                    imageUri={pose.imageUrl}
                    difficulty={pose.difficulty}
                    isFavorite={isFavorite(pose.id)}
                    width={175}
                    height={230}
                    onPress={(id) => handleOpenPose(id, false)}
                    onFavoritePress={handleToggleFavorite}
                    onCameraPress={handleTryPose}
                  />
                </View>
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </Animated.ScrollView>

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  headerTitleContainer: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.olive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Hero Card
  heroCardContainer: {
    marginBottom: Spacing.lg,
  },
  heroCard: {
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    position: 'relative',
    height: 235,
    justifyContent: 'flex-end',
    backgroundColor: '#1E2019',
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  heroBackground: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 19, 14, 0.62)',
  },
  heroContent: {
    padding: Spacing.md,
    zIndex: 2,
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
  },
  heroTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: Spacing.sm,
    maxWidth: '92%',
  },
  heroButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroPrimaryButton: {
    backgroundColor: Colors.olive,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.olive,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  heroPrimaryButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroSecondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: BorderRadius.sm,
  },
  heroSecondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroDownloadIconButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    width: 34,
    height: 34,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Categories
  categoriesSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryScroll: {
    paddingVertical: 6,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipLabel: {
    fontSize: 12,
  },

  // Poses Section
  posesSection: {
    marginBottom: Spacing.xl,
  },
  poseCountBadge: {
    fontSize: 12,
    fontWeight: '500',
  },
  posesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    marginTop: Spacing.xs,
  },

  // Horizontal Carousels
  horizontalSection: {
    marginBottom: Spacing.md,
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trendingBadgePill: {
    backgroundColor: 'rgba(255, 75, 75, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  trendingBadgePillText: {
    color: Colors.error,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  aiBadgePill: {
    backgroundColor: 'rgba(101, 116, 74, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  aiBadgePillText: {
    color: Colors.olive,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  explanationBadge: {
    backgroundColor: 'rgba(101, 116, 74, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  explanationText: {
    color: Colors.olive,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  horizontalCardScroll: {
    paddingVertical: 6,
  },
});
