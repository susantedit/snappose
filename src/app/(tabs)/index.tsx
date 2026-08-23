/**
 * HomeScreen / References Feed — Complete AI Photography Director Experience.
 *
 * Flow Structure:
 *  1. Editorial Header ("References" • "Find your next pose")
 *  2. Interactive Human T-Pose Studio Banner (SPTposeHero)
 *  3. Contextual Shot Builder (SPShotBuilder)
 *  4. Personalized "For Your Style" AI Discovery
 *  5. "My Signature Poses" Collection
 *  6. Category Filter Pills (All, Beach, Cafe, Nature, Trek, Selfie, etc.)
 *  7. "Try Something New" Exploration Section
 *  8. Asymmetric 2-Column Editorial Masonry Grid
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeInDown,
  useAnimatedScrollHandler,
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
import { useReducedMotion } from '@/constants/motion';
import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import { usePersonalizationStore } from '@/stores/personalizationStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { SNAP_POSE_CATEGORIES, SNAP_POSE_DATASET } from '@/features/poses/data/posesData';
import { prefetchPoseImages } from '@/utils/imageUtils';
import type { Pose } from '@/features/poses/types';

import { SPTposeHero } from '@/features/poses/components/SPTposeHero';
import { SPShotBuilder } from '@/features/poses/components/SPShotBuilder';
import { SPOnboardingChecklist } from '@/components/organisms/SPOnboardingChecklist';
import { SPCoupleVerificationModal } from '@/components/organisms/SPCoupleVerificationModal';
import { SPAiStudioCopilotModal } from '@/components/organisms/SPAiStudioCopilotModal';
import { PersonalizationEngine } from '@/features/personalization/domain/PersonalizationEngine';
import { PhotographyDNAService } from '@/features/personalization/PhotographyDNAService';

import { TEMPLATE_DATASET } from '@/features/templates/data/templateData';
import { Image } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HORIZONTAL_PADDING = 16;
const COLUMN_GAP = 14;
const COLUMN_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - COLUMN_GAP) / 2;

const engine = new PersonalizationEngine();
const dnaService = new PhotographyDNAService();

// ---------------------------------------------------------------------------
// Category Chip Component
// ---------------------------------------------------------------------------

interface CategoryChipProps {
  id: string;
  name: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const CategoryChip = React.memo(function CategoryChip({ id, name, isSelected, onSelect }: CategoryChipProps) {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';

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
              borderColor: Colors.olive,
            }
          : {
              backgroundColor: isDark ? '#222520' : '#EFE9DC',
              borderColor: isDark ? '#333630' : '#E3DBD0',
            },
      ]}
    >
      <Text
        style={[
          styles.chipLabel,
          {
            color: isSelected ? '#FFFFFF' : isDark ? '#E5E8E0' : '#2C3026',
            fontWeight: isSelected ? '700' : '500',
          },
        ]}
      >
        {name}
      </Text>
    </AnimatedPressable>
  );
});

// ---------------------------------------------------------------------------
// Main HomeScreen
// ---------------------------------------------------------------------------

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toastProps, showToast } = useToast();
  const reduceMotion = useReducedMotion();
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  // Personalization Engine Store — granular selectors so the Home screen only
  // re-renders when the specific slices it uses change (not on every signal).
  const getRecommendedPoses = usePersonalizationStore((s) => s.getRecommendedPoses);
  const recordSignal = usePersonalizationStore((s) => s.recordSignal);
  const isPersonalizationEnabled = usePersonalizationStore((s) => s.isPersonalizationEnabled);
  const outfitPreference = usePersonalizationStore((s) => s.outfitPreference);
  const profile = usePersonalizationStore((s) => s.profile);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [coupleModalPose, setCoupleModalPose] = useState<Pose | null>(null);
  const [showCopilotModal, setShowCopilotModal] = useState<boolean>(false);

  // Scroll tracking
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Filtered poses based on selected category
  const filteredPoses = useMemo(() => {
    if (selectedCategory === 'all') {
      return SNAP_POSE_DATASET;
    }
    return SNAP_POSE_DATASET.filter((p) => p.categoryId === selectedCategory);
  }, [selectedCategory]);

  // Personalized recommendations
  const personalizedRecommendations = useMemo(() => {
    if (!isPersonalizationEnabled || !profile || profile.totalInteractions === 0) return [];
    return getRecommendedPoses(
      SNAP_POSE_DATASET,
      {
        currentCategory: selectedCategory !== 'all' ? selectedCategory : undefined,
        outfitCategory: outfitPreference,
      },
      6,
    );
  }, [getRecommendedPoses, selectedCategory, outfitPreference, isPersonalizationEnabled, profile]);

  // "Try Something New" exploration candidate
  const trySomethingNewRec = useMemo(() => {
    return engine.getTrySomethingNewPose(SNAP_POSE_DATASET, profile);
  }, [profile]);

  // User's Signature Poses
  const signaturePoses = useMemo(() => {
    return dnaService.getSignaturePoses(SNAP_POSE_DATASET, profile);
  }, [profile]);

  // Split into left and right columns for true asymmetric masonry
  const { leftColumn, rightColumn } = useMemo(() => {
    const left: Array<{ pose: Pose; height: number; index: number }> = [];
    const right: Array<{ pose: Pose; height: number; index: number }> = [];

    const leftHeights = [
      COLUMN_WIDTH * 1.56,
      COLUMN_WIDTH * 1.32,
      COLUMN_WIDTH * 1.62,
      COLUMN_WIDTH * 1.40,
    ];
    const rightHeights = [
      COLUMN_WIDTH * 1.34,
      COLUMN_WIDTH * 1.60,
      COLUMN_WIDTH * 1.36,
      COLUMN_WIDTH * 1.52,
    ];

    filteredPoses.forEach((pose, idx) => {
      if (idx % 2 === 0) {
        const height = leftHeights[(idx / 2) % leftHeights.length];
        left.push({ pose, height, index: idx });
      } else {
        const height = rightHeights[Math.floor(idx / 2) % rightHeights.length];
        right.push({ pose, height, index: idx });
      }
    });

    return { leftColumn: left, rightColumn: right };
  }, [filteredPoses]);

  const navigateToPose = useCallback((id: string) => {
    recordSignal({
      type: 'POSE_OPENED',
      poseId: id,
    });
    import('@/stores/onboardingChecklistStore').then(({ useOnboardingChecklistStore }) => {
      useOnboardingChecklistStore.getState().markCompleted('explore_poses');
    });
    import('@/services/analytics/PostHogAnalyticsService').then(({ postHogAnalytics }) => {
      postHogAnalytics.track('pose_selected', { poseId: id });
    });
    router.push({
      pathname: '/pose/[id]',
      params: { id },
    });
  }, [recordSignal]);

  const handleOpenPose = useCallback(
    (id: string) => {
      const targetPose = SNAP_POSE_DATASET.find((p) => p.id === id);
      if (targetPose && (targetPose.categoryId?.toLowerCase().includes('couple') || targetPose.category?.toLowerCase().includes('couple') || targetPose.title.toLowerCase().includes('couple'))) {
        setCoupleModalPose(targetPose);
      } else {
        navigateToPose(id);
      }
    },
    [navigateToPose],
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

  // Prefetch top poses of the tapped category into the expo-image cache so the
  // grid repaints instantly when the filter changes.
  const handleCategorySelect = useCallback((catId: string) => {
    setSelectedCategory(catId);
    const targetPoses = catId === 'all'
      ? SNAP_POSE_DATASET.slice(0, 8)
      : SNAP_POSE_DATASET.filter((p) => p.categoryId === catId).slice(0, 8);
    prefetchPoseImages(targetPoses.map((p) => p.imageUrl), 600);
  }, []);

  const handleChipSelect = useCallback(
    (id: string) => {
      handleCategorySelect(id);
      recordSignal({ type: 'CATEGORY_OPENED', categoryId: id });
    },
    [handleCategorySelect, recordSignal],
  );

  const isDark = theme.mode === 'dark';

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#141612' : '#F6F1E7' }]}>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.sm,
            paddingBottom: insets.bottom + 96,
          },
        ]}
      >
        {/* ── 1. Editorial Header (Instant Paint for LCP) ───────────────── */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Text
              style={[
                styles.screenTitle,
                { color: isDark ? '#FFFFFF' : '#1C1E1A' },
              ]}
            >
              References
            </Text>
            <Text style={[styles.screenSubtitle, { color: isDark ? '#9EA495' : '#6E7465' }]}>
              Find the perfect pose for your next shot.
            </Text>
          </View>

          {/* Quick Header Actions */}
          <View style={styles.headerActions}>
            <AnimatedPressable
              onPress={() => router.push('/notifications')}
              scaleTo={0.9}
              style={[
                styles.headerIconButton,
                {
                  backgroundColor: isDark ? '#222520' : '#EFE9DC',
                  borderColor: isDark ? '#333630' : '#E3DBD0',
                  position: 'relative',
                },
              ]}
              accessibilityLabel="View Notifications"
            >
              <SPIcon
                name="bell"
                size={18}
                color={isDark ? '#FFF' : Colors.textPrimary}
                strokeWidth={2}
              />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    backgroundColor: '#EF4444',
                    width: 9,
                    height: 9,
                    borderRadius: 5,
                  }}
                />
              )}
            </AnimatedPressable>

            <AnimatedPressable
              onPress={() => router.push('/pose/upload')}
              scaleTo={0.9}
              style={[
                styles.headerIconButton,
                {
                  backgroundColor: isDark ? '#222520' : '#EFE9DC',
                  borderColor: isDark ? '#333630' : '#E3DBD0',
                },
              ]}
              accessibilityLabel="Upload custom pose"
            >
              <SPIcon
                name="image"
                size={18}
                color={isDark ? '#FFF' : Colors.textPrimary}
                strokeWidth={2}
              />
            </AnimatedPressable>
          </View>
        </View>

        {/* ── Prominent Search Field with AI Director Trigger ────────── */}
        <View style={styles.searchRowContainer}>
          <Pressable
            onPress={() => router.push('/(tabs)/search')}
            style={[
              styles.searchBar,
              {
                backgroundColor: isDark ? '#1C1F19' : '#EDE8DC',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#DFD8CA',
                flex: 1,
              },
            ]}
            accessibilityRole="search"
            accessibilityLabel="Search poses, styles, locations"
          >
            <SPIcon name="search" size={17} color={isDark ? '#8E9484' : '#756B63'} />
            <Text style={[styles.searchPlaceholder, { color: isDark ? '#8E9484' : '#756B63' }]}>
              Search poses, styles...
            </Text>
          </Pressable>

          <AnimatedPressable
            onPress={() => {
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              } catch {}
              setShowCopilotModal(true);
            }}
            scaleTo={0.92}
            style={styles.aiCopilotBtn}
            accessibilityLabel="Ask AI Photo Director"
          >
            <SPIcon name="sparkles" size={16} color="#000" strokeWidth={2.4} />
            <Text style={styles.aiCopilotBtnText}>AI Copilot</Text>
          </AnimatedPressable>
        </View>

        {/* ── Onboarding Quick Start Checklist ─────────────────────────── */}
        <SPOnboardingChecklist />

        {/* ── Category Filter Chips (Prominent Top Navigation) ───────────── */}
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#1C1E1A', marginBottom: 8 }]}>
            Explore Categories
          </Text>
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
                onSelect={handleChipSelect}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── 2. Interactive T-Pose Studio Hero ────────────────────────── */}
        <SPTposeHero
          onExplorePress={() => {
            scrollViewRef.current?.scrollTo({ y: 580, animated: true });
          }}
        />

        {/* ── 3. Contextual Shot Builder ───────────────────────────────── */}
        <SPShotBuilder />

        {/* ── 4. Personalized AI Discovery ("For Your Style") ─────────── */}
        {selectedCategory === 'all' && personalizedRecommendations.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#1C1E1A' }]}>
                For Your Style
              </Text>
              <View style={styles.aiPillBadge}>
                <Text style={styles.aiPillBadgeText}>AI CURATED</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {personalizedRecommendations.map((rec) => (
                <View key={`rec-${rec.pose.id}`} style={{ width: 155, marginRight: 12 }}>
                  <SPPoseCard
                    id={rec.pose.id}
                    name={rec.pose.title}
                    category={rec.pose.category ?? rec.pose.categoryId}
                    imageUri={rec.pose.imageUrl}
                    difficulty={rec.pose.difficulty}
                    isFavorite={isFavorite(rec.pose.id)}
                    width={155}
                    height={200}
                    variant="editorial"
                    onPress={handleOpenPose}
                    onFavoritePress={handleToggleFavorite}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── 5. Signature Poses ───────────────────────────────────────── */}
        {selectedCategory === 'all' && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#1C1E1A' }]}>
                My Signature Poses
              </Text>
              <Text style={[styles.sectionSub, { color: isDark ? '#D1D1D6' : '#6E7465' }]}>
                Based on your high scores
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {signaturePoses.map((pose) => (
                <View key={`sig-${pose.id}`} style={{ width: 150, marginRight: 12 }}>
                  <SPPoseCard
                    id={pose.id}
                    name={pose.title}
                    category={pose.category ?? pose.categoryId}
                    imageUri={pose.imageUrl}
                    difficulty={pose.difficulty}
                    isFavorite={isFavorite(pose.id)}
                    width={150}
                    height={195}
                    variant="editorial"
                    onPress={handleOpenPose}
                    onFavoritePress={handleToggleFavorite}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── ADDITIVE: Daily Challenge & Streak Banner ─────────────────── */}
        {selectedCategory === 'all' && (
          <View style={styles.sectionContainer}>
            <View style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <View style={styles.challengeBadge}>
                  <SPIcon name="flame" size={14} color="#FFF" />
                  <Text style={styles.challengeBadgeText}>DAILY CHALLENGE</Text>
                </View>
                <Text style={styles.xpRewardText}>+200 XP</Text>
              </View>
              <Text style={styles.challengeTitle}>Nail Today's Featured Frame</Text>
              <Text style={styles.challengeSub}>
                Achieve ≥85% match precision on the daily pose to level up your Director profile.
              </Text>
              <AnimatedPressable
                onPress={() => router.push('/(tabs)/camera')}
                style={styles.challengeBtn}
              >
                <Text style={styles.challengeBtnText}>Start Challenge →</Text>
              </AnimatedPressable>
            </View>
          </View>
        )}

        {/* ── ADDITIVE: 5-Shot Pose Journey Banner ──────────────────────── */}
        {selectedCategory === 'all' && (
          <View style={styles.sectionContainer}>
            <AnimatedPressable
              onPress={() => router.push('/journey')}
              style={styles.journeyBanner}
            >
              <View style={styles.journeyLeft}>
                <Text style={styles.journeyTag}>NEW FEATURE</Text>
                <Text style={styles.journeyTitle}>5-Shot Pose Journey</Text>
                <Text style={styles.journeySub}>Shoot an entire editorial story in 5 guided steps.</Text>
              </View>
              <View style={styles.journeyIconCircle}>
                <SPIcon name="play" size={20} color="#FFF" />
              </View>
            </AnimatedPressable>
          </View>
        )}

        {/* ── ADDITIVE: Creative Templates & Remix ──────────────────────── */}
        {selectedCategory === 'all' && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#1C1E1A' }]}>
                Creative Templates
              </Text>
              <AnimatedPressable onPress={() => router.push('/template-creator')}>
                <Text style={[styles.sectionSub, { color: Colors.olive }]}>
                  + Create New
                </Text>
              </AnimatedPressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {TEMPLATE_DATASET.slice(0, 6).map((tpl) => (
                <AnimatedPressable
                  key={tpl.id}
                  onPress={() => router.push({ pathname: '/template/[id]', params: { id: tpl.id } })}
                  style={styles.templateCard}
                >
                  <Image source={{ uri: tpl.imageUrl }} style={styles.templateImage} />
                  <View style={styles.templateOverlay} />
                  <View style={styles.templateMeta}>
                    <Text style={styles.templateCategory}>{tpl.category.toUpperCase()}</Text>
                    <Text style={styles.templateTitle} numberOfLines={2}>{tpl.title}</Text>
                    <Text style={styles.templateUses}>⚡ {tpl.uses.toLocaleString()} uses</Text>
                  </View>
                </AnimatedPressable>
              ))}
            </ScrollView>
          </View>
        )}



        {/* ── 7. Try Something New Callout ─────────────────────────────── */}
        {selectedCategory === 'all' && trySomethingNewRec && (
          <View style={styles.tryNewCard}>
            <View style={styles.tryNewHeader}>
              <SPIcon name="sparkles" size={16} color="#B7FF00" />
              <Text style={styles.tryNewTag}>TRY SOMETHING NEW</Text>
            </View>
            <Text style={styles.tryNewText}>{trySomethingNewRec.explanation}</Text>
            <AnimatedPressable
              onPress={() => handleOpenPose(trySomethingNewRec.pose.id)}
              style={styles.tryNewButton}
              scaleTo={0.95}
            >
              <Text style={styles.tryNewButtonText}>VIEW EXPLORATION POSE →</Text>
            </AnimatedPressable>
          </View>
        )}

        {/* ── 8. True Asymmetric 2-Column Masonry Grid ─────────────────── */}
        <View style={styles.masonryContainer}>
          {/* Left Column */}
          <View style={styles.column}>
            {leftColumn.map(({ pose, height, index }) => (
              <Animated.View
                key={pose.id}
                entering={
                  reduceMotion
                    ? undefined
                    : FadeInDown.duration(380)
                        .delay(Math.min(index * 30, 240))
                        .springify()
                }
                style={{ marginBottom: COLUMN_GAP }}
              >
                <SPPoseCard
                  id={pose.id}
                  name={pose.title}
                  category={pose.category ?? pose.categoryId}
                  imageUri={pose.imageUrl}
                  difficulty={pose.difficulty}
                  isFavorite={isFavorite(pose.id)}
                  width={COLUMN_WIDTH}
                  height={height}
                  variant="editorial"
                  onPress={handleOpenPose}
                  onFavoritePress={handleToggleFavorite}
                />
              </Animated.View>
            ))}
          </View>

          {/* Right Column */}
          <View style={styles.column}>
            {rightColumn.map(({ pose, height, index }) => (
              <Animated.View
                key={pose.id}
                entering={
                  reduceMotion
                    ? undefined
                    : FadeInDown.duration(380)
                        .delay(Math.min(index * 30, 240))
                        .springify()
                }
                style={{ marginBottom: COLUMN_GAP }}
              >
                <SPPoseCard
                  id={pose.id}
                  name={pose.title}
                  category={pose.category ?? pose.categoryId}
                  imageUri={pose.imageUrl}
                  difficulty={pose.difficulty}
                  isFavorite={isFavorite(pose.id)}
                  width={COLUMN_WIDTH}
                  height={height}
                  variant="editorial"
                  onPress={handleOpenPose}
                  onFavoritePress={handleToggleFavorite}
                />
              </Animated.View>
            ))}
          </View>
        </View>
      </Animated.ScrollView>

        <SPToast {...toastProps} />

        {/* Couple Verification & Roast Easter Egg Modal */}
        <SPCoupleVerificationModal
          visible={!!coupleModalPose}
          poseName={coupleModalPose?.title}
          onConfirmCouple={() => {
            if (coupleModalPose) {
              const id = coupleModalPose.id;
              setCoupleModalPose(null);
              navigateToPose(id);
            }
          }}
          onProceedAnyway={() => {
            if (coupleModalPose) {
              const id = coupleModalPose.id;
              setCoupleModalPose(null);
              navigateToPose(id);
            }
          }}
          onSelectSoloPoses={() => {
            setCoupleModalPose(null);
            setSelectedCategory('portrait');
            showToast({ message: 'Showing Solo Poses! 👤', variant: 'info' });
          }}
          onDismiss={() => setCoupleModalPose(null)}
        />

        {/* AI Studio Copilot Chat Assistant Modal */}
        <SPAiStudioCopilotModal
          visible={showCopilotModal}
          onClose={() => setShowCopilotModal(false)}
        />
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
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm + 2,
  },
  headerTitleContainer: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.6,
    ...Platform.select({
      ios: { fontFamily: 'Georgia' },
      android: { fontFamily: 'serif' },
      default: { fontFamily: 'serif' },
    }),
  },
  screenSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search Row
  searchRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
  },
  searchPlaceholder: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  aiCopilotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.olive,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 14,
    gap: 6,
    shadowColor: Colors.olive,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  aiCopilotBtnText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '800',
  },

  // Sections
  sectionContainer: {
    marginBottom: Spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  sectionSub: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  aiPillBadge: {
    backgroundColor: 'rgba(101, 116, 74, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(101, 116, 74, 0.4)',
  },
  aiPillBadgeText: {
    color: Colors.olive,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  horizontalScroll: {
    paddingVertical: 4,
  },

  // Categories
  categoriesSection: {
    marginBottom: Spacing.md,
  },
  categoryScroll: {
    paddingVertical: 6,
    gap: 10,
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLabel: {
    fontSize: 14,
    letterSpacing: 0.3,
  },

  // Try New Card
  tryNewCard: {
    backgroundColor: '#1E231B',
    padding: Spacing.md,
    borderRadius: 18,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(183, 255, 0, 0.25)',
  },
  tryNewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tryNewTag: {
    color: '#B7FF00',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  tryNewText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 10,
    lineHeight: 17,
  },
  tryNewButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tryNewButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Masonry Grid
  masonryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  column: {
    width: COLUMN_WIDTH,
  },

  // Daily Challenge
  challengeCard: {
    backgroundColor: '#20241A',
    borderRadius: BorderRadius.card,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(183,255,0,0.25)',
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  challengeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.olive,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  challengeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 1,
  },
  xpRewardText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.lime,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  challengeSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 16,
    marginBottom: 10,
  },
  challengeBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.lime,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  challengeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#181818',
  },

  // Journey Banner
  journeyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.forest,
    borderRadius: BorderRadius.card,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  journeyLeft: {
    flex: 1,
    paddingRight: 10,
  },
  journeyTag: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.lime,
    letterSpacing: 1,
    marginBottom: 2,
  },
  journeyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 2,
  },
  journeySub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 15,
  },
  journeyIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Templates
  templateCard: {
    width: 160,
    height: 210,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginRight: 12,
    position: 'relative',
    backgroundColor: '#222',
  },
  templateImage: {
    width: '100%',
    height: '100%',
  },
  templateOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  templateMeta: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  templateCategory: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.lime,
    letterSpacing: 1,
    marginBottom: 2,
  },
  templateTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
    lineHeight: 17,
    marginBottom: 4,
  },
  templateUses: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
});
