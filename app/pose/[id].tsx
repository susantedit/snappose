/**
 * PoseDetailScreen — Editorial Detail View with Cinematic Motion & Explicit AI Feedback for Snap Pose.
 *
 * Features:
 *  • Hero Image Zoom reveal (1.08 → 1.0) on entrance with Parallax
 *  • Content Card Slide-Up (translateY 40 → 0)
 *  • Explicit AI Personalization Feedback ("More like this", "Not for me")
 *  • Sequential Step-by-Step Instruction reveals with numbered badge pop
 *  • Floating Tactile CTA Action Bar
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeInUp,
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
import { SPBadge } from '@/components/atoms/SPBadge';
import { SPToast, useToast } from '@/components/molecules/SPToast';
import { SPIcon } from '@/components/atoms/SPIcon';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';
import { MotionEasings, useReducedMotion } from '@/constants/motion';
import { SNAP_POSE_DATASET } from '@/features/poses/data/posesData';
import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import { usePersonalizationStore } from '@/stores/personalizationStore';
import { saveImageToGallery } from '@/utils/saveImage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_IMAGE_HEIGHT = SCREEN_WIDTH * 1.15;

export default function PoseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { recordSignal, recordExplicitFeedback, explicitFeedback } = usePersonalizationStore();
  const { toastProps, showToast } = useToast();
  const reduceMotion = useReducedMotion();

  const [activeInstructionIndex, setActiveInstructionIndex] = useState<number | null>(null);

  const pose = useMemo(() => {
    return SNAP_POSE_DATASET.find((p) => p.id === id) ?? SNAP_POSE_DATASET[0];
  }, [id]);

  // Track POSE_OPENED signal on mount
  useEffect(() => {
    if (pose) {
      recordSignal(
        {
          type: 'POSE_OPENED',
          poseId: pose.id,
          categoryId: pose.categoryId,
          tags: pose.tags,
        },
        pose,
      );
    }
  }, [pose, recordSignal]);

  const currentFeedback = useMemo(() => {
    return explicitFeedback.find((f) => f.poseId === pose?.id)?.action;
  }, [explicitFeedback, pose]);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const heroImageStyle = useAnimatedStyle(() => {
    if (reduceMotion) return {};
    return {
      transform: [{ translateY: scrollY.value * 0.35 }],
    };
  });

  const handleToggleFav = useCallback(() => {
    if (pose) {
      const wasFav = isFavorite(pose.id);
      toggleFavorite(pose);
      recordSignal(
        {
          type: wasFav ? 'POSE_UNFAVORITED' : 'POSE_FAVORITED',
          poseId: pose.id,
          categoryId: pose.categoryId,
          tags: pose.tags,
        },
        pose,
      );
      showToast({
        message: wasFav ? 'Removed from favorites' : 'Saved to favorites',
        variant: wasFav ? 'info' : 'success',
      });
    }
  }, [pose, isFavorite, toggleFavorite, recordSignal, showToast]);

  const handleShare = useCallback(async () => {
    if (!pose) return;
    recordSignal({
      type: 'POSE_SHARED',
      poseId: pose.id,
      categoryId: pose.categoryId,
    });
    try {
      await Share.share({
        title: pose.title,
        message: `Check out the "${pose.title}" pose on Snap Pose! Perfect for ${pose.category ?? pose.categoryId} photography.`,
        url: pose.imageUrl,
      });
    } catch {}
  }, [pose, recordSignal]);

  const handleTryPoseInCamera = useCallback(() => {
    if (!pose) return;
    recordSignal({
      type: 'POSE_USED',
      poseId: pose.id,
      categoryId: pose.categoryId,
    });
    router.push({
      pathname: '/(tabs)/camera',
      params: { poseId: pose.id },
    });
  }, [pose, recordSignal]);

  const handleGiveFeedback = useCallback(
    (action: 'more_like_this' | 'dont_recommend') => {
      if (!pose) return;
      recordExplicitFeedback(pose.id, action);
      showToast({
        message:
          action === 'more_like_this'
            ? 'We will recommend more poses like this!'
            : 'Got it, we will show fewer poses like this',
        variant: action === 'more_like_this' ? 'success' : 'info',
      });
    },
    [pose, recordExplicitFeedback, showToast],
  );

  const handleSaveImage = useCallback(async () => {
    if (!pose) return;
    showToast({
      message: 'Saving image to gallery...',
      variant: 'info',
    });
    const result = await saveImageToGallery(pose.imageUrl, `snappose_${pose.categoryId}_${pose.id}`);
    showToast({
      message: result.message,
      variant: result.success ? 'success' : 'error',
    });
  }, [pose, showToast]);

  const isDark = theme.mode === 'dark';
  const favorited = pose ? isFavorite(pose.id) : false;

  if (!pose) {
    return (
      <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.textPrimary, padding: 24 }}>Pose not found</Text>
      </View>
    );
  }

  const instructionsList = pose.instructions ?? [
    'Stand upright with your shoulders naturally relaxed.',
    'Shift 70% of your weight onto your back leg.',
    'Turn your torso 45 degrees towards the main light source.',
    'Gently rest one hand on your hip or inside your pocket.',
    'Tilt your chin slightly downward and make soft eye contact with the camera.',
  ];

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      {/* Top Floating Navigation Header */}
      <View
        style={[
          styles.floatingHeader,
          {
            paddingTop: insets.top + Spacing.xs,
          },
        ]}
      >
        <AnimatedPressable
          onPress={() => router.back()}
          scaleTo={0.88}
          style={styles.headerButtonCircle}
          accessibilityLabel="Back"
        >
          <SPIcon name="arrowLeft" size={20} color="#FFFFFF" strokeWidth={2.4} />
        </AnimatedPressable>

        <View style={styles.headerRightActions}>
          <AnimatedPressable
            onPress={handleSaveImage}
            scaleTo={0.88}
            style={styles.headerButtonCircle}
            accessibilityLabel="Save image to gallery"
          >
            <SPIcon name="download" size={18} color="#FFFFFF" strokeWidth={2.2} />
          </AnimatedPressable>

          <AnimatedPressable
            onPress={handleShare}
            scaleTo={0.88}
            style={styles.headerButtonCircle}
            accessibilityLabel="Share Pose"
          >
            <SPIcon name="share" size={18} color="#FFFFFF" strokeWidth={2.2} />
          </AnimatedPressable>

          <AnimatedPressable
            onPress={handleToggleFav}
            scaleTo={0.88}
            hapticFeedback="medium"
            style={styles.headerButtonCircle}
            accessibilityLabel={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <SPIcon
              name={favorited ? 'heart-filled' : 'heart'}
              size={19}
              color={favorited ? Colors.error : '#FFFFFF'}
              fill={favorited ? Colors.error : 'none'}
              strokeWidth={2.2}
            />
          </AnimatedPressable>
        </View>
      </View>

      {/* Main Scroll Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
      >
        {/* ── 1. Hero Image with Zoom Reveal & Parallax ─────────────── */}
        <View style={styles.heroContainer}>
          <Animated.Image
            source={{ uri: pose.imageUrl }}
            style={[styles.heroImage, heroImageStyle]}
            resizeMode="cover"
          />
          <View style={styles.heroGradientOverlay} />
        </View>

        {/* ── 2. Editorial Content Card (Slide Up) ──────────────────── */}
        <Animated.View
          entering={
            reduceMotion
              ? undefined
              : FadeInUp.duration(500).easing(MotionEasings.outStandard)
          }
          style={[
            styles.contentCard,
            {
              backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
              borderColor: isDark ? '#2C2C2E' : '#ECE5D8',
            },
          ]}
        >
          {/* Category & Difficulty Badges */}
          <View style={styles.badgesRow}>
            <SPBadge
              label={pose.category ?? pose.categoryId}
              variant="neutral"
            />
            <SPBadge
              label={pose.difficulty.toUpperCase()}
              variant={
                pose.difficulty === 'easy'
                  ? 'success'
                  : pose.difficulty === 'medium'
                  ? 'warning'
                  : 'error'
              }
            />
          </View>

          {/* Title & Description */}
          <Text
            style={[
              styles.poseTitle,
              { color: isDark ? '#FFFFFF' : Colors.textPrimary },
            ]}
          >
            {pose.title}
          </Text>

          {pose.description && (
            <Text
              style={[
                styles.poseDescription,
                { color: isDark ? '#AAAAAA' : Colors.textSecondary },
              ]}
            >
              {pose.description}
            </Text>
          )}

          {/* ── Explicit Recommendation Tuning Controls ────────────── */}
          <View style={styles.feedbackRow}>
            <Text style={[styles.feedbackTitle, { color: isDark ? '#888' : '#777' }]}>
              RECOMMENDATION FEEDBACK
            </Text>
            <View style={styles.feedbackButtons}>
              <AnimatedPressable
                onPress={() => handleGiveFeedback('more_like_this')}
                scaleTo={0.92}
                hapticFeedback="light"
                style={[
                  styles.feedbackBtn,
                  currentFeedback === 'more_like_this' && styles.feedbackBtnActive,
                ]}
              >
                <SPIcon name="heart-filled" size={13} color={currentFeedback === 'more_like_this' ? '#FFF' : Colors.olive} fill={currentFeedback === 'more_like_this' ? '#FFF' : Colors.olive} />
                <Text
                  style={[
                    styles.feedbackBtnText,
                    currentFeedback === 'more_like_this' && { color: '#FFF' },
                  ]}
                >
                  More like this
                </Text>
              </AnimatedPressable>

              <AnimatedPressable
                onPress={() => handleGiveFeedback('dont_recommend')}
                scaleTo={0.92}
                hapticFeedback="light"
                style={[
                  styles.feedbackBtn,
                  currentFeedback === 'dont_recommend' && styles.feedbackBtnActive,
                ]}
              >
                <SPIcon name="close" size={12} color={currentFeedback === 'dont_recommend' ? '#FFF' : '#888'} strokeWidth={2.4} />
                <Text
                  style={[
                    styles.feedbackBtnText,
                    currentFeedback === 'dont_recommend' && { color: '#FFF' },
                  ]}
                >
                  Not for me
                </Text>
              </AnimatedPressable>
            </View>
          </View>

          {/* ── 3. Step-by-Step Instructions Sequence ──────────────── */}
          <View style={styles.instructionsSection}>
            <View style={styles.sectionTitleRow}>
              <SPIcon name="sparkles" size={16} color={Colors.olive} strokeWidth={2.4} />
              <Text
                style={[
                  styles.sectionTitle,
                  { color: isDark ? '#FFFFFF' : Colors.textPrimary },
                ]}
              >
                HOW TO STRIKE THIS POSE
              </Text>
            </View>

            <View style={styles.instructionsList}>
              {instructionsList.map((instruction, index) => {
                const isSelected = activeInstructionIndex === index;

                return (
                  <AnimatedPressable
                    key={`step-${index}`}
                    onPress={() =>
                      setActiveInstructionIndex(isSelected ? null : index)
                    }
                    scaleTo={0.98}
                    style={[
                      styles.instructionItem,
                      {
                        backgroundColor: isSelected
                          ? isDark
                            ? 'rgba(101, 116, 74, 0.25)'
                            : 'rgba(101, 116, 74, 0.12)'
                          : isDark
                          ? '#262628'
                          : '#F8F6F0',
                        borderColor: isSelected
                          ? Colors.olive
                          : isDark
                          ? '#38383A'
                          : '#EBE4D5',
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.stepBadge,
                        {
                          backgroundColor: isSelected
                            ? Colors.olive
                            : isDark
                            ? '#3A3A3C'
                            : '#DFD8C8',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.stepBadgeNum,
                          { color: isSelected ? '#FFFFFF' : isDark ? '#FFF' : '#333' },
                        ]}
                      >
                        {index + 1}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.instructionText,
                        {
                          color: isDark ? '#DDDDDD' : Colors.textPrimary,
                          fontWeight: isSelected ? '600' : '400',
                        },
                      ]}
                    >
                      {instruction}
                    </Text>
                  </AnimatedPressable>
                );
              })}
            </View>
          </View>
        </Animated.View>
      </Animated.ScrollView>

      {/* ── 4. Floating Tactile "Try This Pose" CTA Bar ───────────── */}
      <Animated.View
        entering={
          reduceMotion
            ? undefined
            : FadeInDown.duration(450).delay(200).springify()
        }
        style={[
          styles.bottomCtaBar,
          {
            paddingBottom: insets.bottom + Spacing.sm,
            backgroundColor: isDark ? 'rgba(28, 28, 30, 0.94)' : 'rgba(255, 255, 255, 0.94)',
            borderTopColor: isDark ? '#333336' : '#ECE4D4',
          },
        ]}
      >
        <View style={styles.ctaRow}>
          <AnimatedPressable
            onPress={handleSaveImage}
            scaleTo={0.93}
            hapticFeedback="light"
            style={[
              styles.secondarySaveButton,
              {
                backgroundColor: isDark ? '#28282A' : '#EFEAE0',
                borderColor: isDark ? '#3C3C40' : '#DED6C6',
              },
            ]}
            accessibilityLabel="Save pose image to gallery"
          >
            <SPIcon name="download" size={19} color={isDark ? '#FFFFFF' : Colors.textPrimary} strokeWidth={2.2} />
          </AnimatedPressable>

          <AnimatedPressable
            onPress={handleTryPoseInCamera}
            scaleTo={0.96}
            hapticFeedback="medium"
            style={styles.ctaButton}
            accessibilityLabel="Try this pose in camera"
          >
            <SPIcon name="camera" size={20} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.ctaButtonText}>TRY THIS POSE</Text>
          </AnimatedPressable>
        </View>
      </Animated.View>

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
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  headerButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroContainer: {
    width: SCREEN_WIDTH,
    height: HERO_IMAGE_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  contentCard: {
    marginTop: -32,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.sm,
  },
  poseTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: Spacing.xs,
  },
  poseDescription: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
    marginBottom: Spacing.md,
  },

  // Feedback Row
  feedbackRow: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 16,
    padding: 12,
    marginBottom: Spacing.md,
    gap: 8,
  },
  feedbackTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  feedbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  feedbackBtnActive: {
    backgroundColor: Colors.olive,
    borderColor: Colors.darkAccent,
  },
  feedbackBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  // Instructions
  instructionsSection: {
    marginTop: Spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  instructionsList: {
    gap: 10,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeNum: {
    fontSize: 12,
    fontWeight: '800',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  bottomCtaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 1,
    zIndex: 30,
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  secondarySaveButton: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  ctaButton: {
    flex: 1,
    backgroundColor: Colors.olive,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: BorderRadius.button,
    gap: 10,
    shadowColor: Colors.olive,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
