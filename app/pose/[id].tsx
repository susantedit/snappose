/**
 * PoseDetailScreen — app/pose/[id].tsx
 *
 * Full-width 16:9 hero image with parallax scroll, pose metadata,
 * favorite/download/Use-This-Pose buttons, and related poses carousel.
 *
 * Deep-link: snappose://pose/[id]   [Req 47.2]
 * [Req 7.1, 7.2, 7.3, 7.4, 7.5, 35.7]
 */

import React, { useCallback } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/constants/theme';
import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from '@/constants/designTokens';
import { SPBadge } from '@/components/atoms/SPBadge';
import { SPButton } from '@/components/atoms/SPButton';
import { SPSkeletonCard } from '@/components/molecules/SPSkeletonCard';
import { SPPoseCard } from '@/components/molecules/SPPoseCard';
import { SPToast, useToast } from '@/components/molecules/SPToast';
import { usePoseDetail } from '@/features/poses/hooks/usePoseDetail';
import type { Pose } from '@/features/poses/types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = Math.round(SCREEN_WIDTH * (9 / 16));
const PARALLAX_FACTOR = 0.4;
const RELATED_CARD_WIDTH = 160;
const RELATED_CARD_HEIGHT = 220;

// ---------------------------------------------------------------------------
// Difficulty helpers
// ---------------------------------------------------------------------------

const DIFFICULTY_BADGE = {
  easy: { label: 'Easy', variant: 'success' as const },
  medium: { label: 'Medium', variant: 'warning' as const },
  hard: { label: 'Hard', variant: 'error' as const },
};

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function PoseDetailSkeleton({ bg }: { bg: string }) {
  return (
    <ScrollView style={{ backgroundColor: bg }} scrollEnabled={false}>
      {/* Hero placeholder */}
      <SPSkeletonCard variant="compact" width="100%" height={HERO_HEIGHT} style={{ borderRadius: 0 }} />
      <View style={styles.skeletonContent}>
        <SPSkeletonCard variant="compact" width="60%" height={28} style={styles.skeletonRow} />
        <SPSkeletonCard variant="compact" width="40%" height={18} style={styles.skeletonRow} />
        <View style={styles.skeletonPillRow}>
          <SPSkeletonCard variant="compact" width={72} height={26} style={{ borderRadius: BorderRadius.full }} />
          <SPSkeletonCard variant="compact" width={56} height={26} style={[{ borderRadius: BorderRadius.full }, styles.ml8]} />
          <SPSkeletonCard variant="compact" width={80} height={26} style={[{ borderRadius: BorderRadius.full }, styles.ml8]} />
        </View>
        <SPSkeletonCard variant="compact" width="100%" height={16} style={styles.skeletonRow} />
        <SPSkeletonCard variant="compact" width="85%" height={16} style={styles.skeletonRow} />
        <SPSkeletonCard variant="compact" width="70%" height={16} style={styles.skeletonRow} />
        <SPSkeletonCard variant="compact" width="100%" height={60} style={[styles.skeletonRow, { marginTop: Spacing.lg }]} />
      </View>
    </ScrollView>
  );
}


// ---------------------------------------------------------------------------
// Error state
// ---------------------------------------------------------------------------

function PoseDetailError({
  bg,
  textPrimary,
  textSecondary,
  onRetry,
}: {
  bg: string;
  textPrimary: string;
  textSecondary: string;
  onRetry: () => void;
}) {
  return (
    <View style={[styles.centred, { backgroundColor: bg }]}>
      <Text style={[styles.errorTitle, { color: textPrimary }]}>Something went wrong</Text>
      <Text style={[styles.stateText, { color: textSecondary }]}>
        We couldn't load this pose. Check your connection and try again.
      </Text>
      <SPButton
        label="Retry"
        variant="primary"
        size="md"
        onPress={onRetry}
        accessibilityLabel="Retry loading pose"
        style={styles.centreButton}
      />
      <Pressable
        style={styles.backLink}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={[styles.backLinkText, { color: Colors.olive }]}>← Go back</Text>
      </Pressable>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Not found state
// ---------------------------------------------------------------------------

function PoseNotFound({ bg, textPrimary, textSecondary }: { bg: string; textPrimary: string; textSecondary: string }) {
  return (
    <View style={[styles.centred, { backgroundColor: bg }]}>
      <Text style={[styles.errorTitle, { color: textPrimary }]}>Pose not found</Text>
      <Text style={[styles.stateText, { color: textSecondary }]}>
        This pose doesn't exist or has been removed.
      </Text>
      <SPButton
        label="Explore Categories"
        variant="primary"
        size="md"
        onPress={() => router.push('/(tabs)/search')}
        accessibilityLabel="Explore all categories"
        style={styles.centreButton}
      />
    </View>
  );
}


// ---------------------------------------------------------------------------
// Parallax hero image
// ---------------------------------------------------------------------------

interface ParallaxHeroProps {
  imageUri: string;
  scrollY: Animated.SharedValue<number>;
  title: string;
}

function ParallaxHero({ imageUri, scrollY, title }: ParallaxHeroProps) {
  const imageStyle = useAnimatedStyle(() => {
    // Image translates upward at PARALLAX_FACTOR speed as user scrolls down
    const translateY = interpolate(
      scrollY.value,
      [0, HERO_HEIGHT],
      [0, -HERO_HEIGHT * PARALLAX_FACTOR],
      'clamp',
    );
    return { transform: [{ translateY }] };
  });

  return (
    <View
      style={styles.heroContainer}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${title} hero image`}
    >
      {imageUri ? (
        <Animated.Image
          source={{ uri: imageUri }}
          style={[styles.heroImage, imageStyle]}
          resizeMode="cover"
          accessibilityLabel={`${title} reference pose`}
        />
      ) : (
        <View style={[styles.heroImage, styles.heroPlaceholder]}>
          <Text style={styles.heroPlaceholderIcon}>🖼</Text>
        </View>
      )}
    </View>
  );
}


// ---------------------------------------------------------------------------
// Back button overlay (floats over hero)
// ---------------------------------------------------------------------------

function BackButton({ insetTop }: { insetTop: number }) {
  return (
    <Pressable
      style={[styles.backButton, { top: insetTop + Spacing.xs }]}
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={8}
    >
      <Text style={styles.backButtonIcon}>←</Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Info row helper (label + value)
// ---------------------------------------------------------------------------

function InfoRow({
  icon,
  label,
  value,
  textPrimary,
  textSecondary,
}: {
  icon: string;
  label: string;
  value: string;
  textPrimary: string;
  textSecondary: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoTextBlock}>
        <Text style={[styles.infoLabel, { color: textSecondary }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: textPrimary }]}>{value}</Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Download button with progress
// ---------------------------------------------------------------------------

interface DownloadButtonProps {
  isDownloaded: boolean;
  downloadProgress: number | null;
  onPress: () => void;
}

function DownloadButton({ isDownloaded, downloadProgress, onPress }: DownloadButtonProps) {
  const isDownloading = downloadProgress !== null;

  let label = '⬇ Download';
  if (isDownloaded) label = '✓ Downloaded';
  else if (isDownloading) label = `Downloading ${downloadProgress}%`;

  return (
    <SPButton
      label={label}
      variant="secondary"
      size="md"
      loading={isDownloading}
      disabled={isDownloaded}
      onPress={onPress}
      accessibilityLabel={
        isDownloaded
          ? 'Pose pack already downloaded'
          : isDownloading
          ? `Downloading pose pack, ${downloadProgress}% complete`
          : 'Download pose pack for offline use'
      }
      style={styles.flex1}
    />
  );
}


// ---------------------------------------------------------------------------
// Related poses carousel
// ---------------------------------------------------------------------------

interface RelatedPosesCarouselProps {
  poses: Pose[];
  isLoading: boolean;
  isDark: boolean;
  textPrimary: string;
}

function RelatedPosesCarousel({ poses, isLoading, isDark, textPrimary }: RelatedPosesCarouselProps) {
  const handleRelatedPress = useCallback((id: string) => {
    router.push(`/pose/${id}`);
  }, []);

  const handleCameraPress = useCallback((id: string) => {
    router.push('/(tabs)/camera');
  }, []);

  return (
    <View style={styles.relatedSection}>
      <Text style={[styles.sectionTitle, { color: textPrimary }]}>Related Poses</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.relatedScrollContent}
        scrollEventThrottle={16}
        accessibilityLabel="Related poses carousel"
      >
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => (
              <SPSkeletonCard
                key={i}
                variant="pose"
                width={RELATED_CARD_WIDTH}
                height={RELATED_CARD_HEIGHT}
                style={i > 0 ? styles.relatedCardGap : undefined}
              />
            ))
          : poses.map((pose, index) => (
              <SPPoseCard
                key={pose.id}
                id={pose.id}
                name={pose.title}
                category={pose.categoryId}
                imageUri={pose.imageUrl}
                difficulty={pose.difficulty}
                width={RELATED_CARD_WIDTH}
                height={RELATED_CARD_HEIGHT}
                onPress={handleRelatedPress}
                onCameraPress={handleCameraPress}
                style={index > 0 ? styles.relatedCardGap : undefined}
              />
            ))}
      </ScrollView>
    </View>
  );
}


// ---------------------------------------------------------------------------
// Main PoseDetailScreen
// ---------------------------------------------------------------------------

export default function PoseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme.mode === 'dark';

  const { toastProps, showToast } = useToast();

  const {
    pose,
    relatedPoses,
    isLoading,
    isError,
    isFavorite,
    downloadProgress,
    isDownloaded,
    toggleFavorite,
    startDownload,
    retry,
  } = usePoseDetail(id ?? '');

  // Shared value for parallax scroll — driven manually via onScroll
  const scrollY = useSharedValue(0);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollY.value = event.nativeEvent.contentOffset.y;
    },
    [scrollY],
  );

  const handleFavoritePress = useCallback(() => {
    toggleFavorite();
    showToast({
      message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      variant: isFavorite ? 'info' : 'success',
    });
  }, [toggleFavorite, showToast, isFavorite]);

  const handleUsePose = useCallback(() => {
    // Navigate to camera with pose overlay pre-loaded ≤1s [Req 7.3]
    router.push('/(tabs)/camera');
  }, []);

  const handleDownload = useCallback(() => {
    startDownload();
    showToast({ message: 'Download started', variant: 'info' });
  }, [startDownload, showToast]);

  const { background, textPrimary, textSecondary, surface, divider } = theme.colors;

  // ── States ─────────────────────────────────────────────────────────────────

  if (!id) {
    return <PoseNotFound bg={background} textPrimary={textPrimary} textSecondary={textSecondary} />;
  }

  if (isLoading) {
    return <PoseDetailSkeleton bg={background} />;
  }

  if (isError || !pose) {
    return (
      <PoseDetailError
        bg={background}
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        onRetry={retry}
      />
    );
  }

  // ── Content ────────────────────────────────────────────────────────────────

  const diffBadge = DIFFICULTY_BADGE[pose.difficulty];
  const distanceLabel = `${pose.estimatedDistance}m`;

  return (
    <View style={[styles.root, { backgroundColor: background }]}>
      {/* Floating back button over hero */}
      <BackButton insetTop={insets.top} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.massive }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        accessibilityLabel={`Pose detail for ${pose.title}`}
      >
        {/* ── Hero Image with parallax [Req 7.1] ── */}
        <ParallaxHero imageUri={pose.imageUrl} scrollY={scrollY} title={pose.title} />

        {/* ── Metadata card ── */}
        <View style={[styles.contentCard, { backgroundColor: surface }]}>

          {/* Title + favorite button */}
          <View style={styles.titleRow}>
            <Text
              style={[styles.poseTitle, { color: textPrimary }]}
              accessibilityRole="header"
              numberOfLines={2}
            >
              {pose.title}
            </Text>
            <Pressable
              onPress={handleFavoritePress}
              style={styles.favoriteButton}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              accessibilityState={{ selected: isFavorite }}
            >
              <Text style={[styles.heartIcon, { color: isFavorite ? Colors.error : textSecondary }]}>
                {isFavorite ? '♥' : '♡'}
              </Text>
            </Pressable>
          </View>

          {/* Badges row: category, difficulty, indoor/outdoor [Req 7.1] */}
          <View style={styles.badgeRow}>
            <SPBadge
              label={pose.categoryId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              variant="primary"
            />
            <SPBadge
              label={diffBadge.label}
              variant={diffBadge.variant}
              style={styles.ml6}
            />
            <SPBadge
              label={pose.indoor ? '🏠 Indoor' : '🌳 Outdoor'}
              variant="neutral"
              style={styles.ml6}
            />
          </View>

          {/* Description */}
          <Text style={[styles.description, { color: textSecondary }]}>{pose.description}</Text>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: divider }]} />

          {/* Info grid: distance, angle, lens [Req 7.1] */}
          <View style={styles.infoGrid}>
            <InfoRow
              icon="📏"
              label="Distance"
              value={distanceLabel}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />
            <InfoRow
              icon="📷"
              label="Camera Angle"
              value={pose.cameraAngle}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />
            <InfoRow
              icon="🔭"
              label="Lens"
              value={pose.lens}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: divider }]} />

          {/* Lighting tips [Req 7.1] */}
          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionLabel, { color: textPrimary }]}>💡 Lighting Tips</Text>
            <Text style={[styles.sectionBody, { color: textSecondary }]}>{pose.lighting}</Text>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: divider }]} />

          {/* Body direction instructions [Req 7.1] */}
          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionLabel, { color: textPrimary }]}>🧍 Body Direction</Text>
            {pose.bodyDirections.map((instruction, index) => (
              <View key={index} style={styles.instructionRow}>
                <Text style={[styles.bulletDot, { color: Colors.olive }]}>•</Text>
                <Text style={[styles.instructionText, { color: textSecondary }]}>{instruction}</Text>
              </View>
            ))}
          </View>

        </View>

        {/* ── Action buttons [Req 7.2] ── */}
        <View style={styles.actionRow}>
          <DownloadButton
            isDownloaded={isDownloaded}
            downloadProgress={downloadProgress}
            onPress={handleDownload}
          />
          <View style={styles.ml8} />
          {/* "Use This Pose" — 60px, Olive Green [Req 7.2, 7.3] */}
          <SPButton
            label="Use This Pose"
            variant="primary"
            size="lg"
            onPress={handleUsePose}
            accessibilityLabel="Use this pose — opens camera with overlay"
            accessibilityHint="Opens the camera screen with this pose overlay preloaded"
            style={[styles.flex1, styles.usePoseButton]}
          />
        </View>

        {/* ── Related poses carousel [Req 7.1] ── */}
        <RelatedPosesCarousel
          poses={relatedPoses}
          isLoading={false}
          isDark={isDark}
          textPrimary={textPrimary}
        />
      </ScrollView>

      {/* Toast */}
      <SPToast {...toastProps} position="bottom" />
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  heroContainer: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    overflow: 'hidden',
    backgroundColor: '#E0DDD8',
  },
  heroImage: {
    width: SCREEN_WIDTH,
    // Taller than container so parallax has room to move
    height: HERO_HEIGHT + HERO_HEIGHT * PARALLAX_FACTOR,
    marginTop: -(HERO_HEIGHT * PARALLAX_FACTOR) / 2,
  },
  heroPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDD8CE',
  },
  heroPlaceholderIcon: {
    fontSize: 48,
  },

  // ── Back button ───────────────────────────────────────────────────────────
  backButton: {
    position: 'absolute',
    left: Spacing.md,
    zIndex: 100,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: Typography.weights.semibold,
    lineHeight: 24,
  },

  // ── Content card ─────────────────────────────────────────────────────────
  contentCard: {
    marginHorizontal: Spacing.md,
    marginTop: -BorderRadius.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },

  // ── Title row ────────────────────────────────────────────────────────────
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  poseTitle: {
    flex: 1,
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.3,
    lineHeight: 32,
    marginRight: Spacing.sm,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -4,
  },
  heartIcon: {
    fontSize: 28,
    lineHeight: 32,
  },

  // ── Badges ───────────────────────────────────────────────────────────────
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: 0,
  },
  ml6: { marginLeft: 6 },
  ml8: { marginLeft: 8 },

  // ── Description ──────────────────────────────────────────────────────────
  description: {
    fontSize: Typography.sizes.small,
    lineHeight: 22,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },

  // ── Divider ───────────────────────────────────────────────────────────────
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.md,
  },

  // ── Info grid ─────────────────────────────────────────────────────────────
  infoGrid: {
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoIcon: {
    fontSize: 18,
    width: 28,
    textAlign: 'center',
  },
  infoTextBlock: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  infoValue: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.semibold,
  },

  // ── Section blocks (lighting / body direction) ────────────────────────────
  sectionBlock: {
    gap: Spacing.xs,
  },
  sectionLabel: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.semibold,
    marginBottom: 4,
  },
  sectionBody: {
    fontSize: Typography.sizes.small,
    lineHeight: 22,
  },
  instructionRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: 4,
  },
  bulletDot: {
    fontSize: Typography.sizes.body,
    lineHeight: 22,
    marginTop: 1,
  },
  instructionText: {
    flex: 1,
    fontSize: Typography.sizes.small,
    lineHeight: 22,
  },

  // ── Action buttons ────────────────────────────────────────────────────────
  actionRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  flex1: { flex: 1 },
  usePoseButton: {
    height: 60,
  },

  // ── Related poses ─────────────────────────────────────────────────────────
  relatedSection: {
    marginTop: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    letterSpacing: -0.2,
  },
  relatedScrollContent: {
    paddingHorizontal: Spacing.md,
    paddingRight: Spacing.md + Spacing.sm,
  },
  relatedCardGap: {
    marginLeft: 10,
  },

  // ── Error / empty states ──────────────────────────────────────────────────
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  stateText: {
    fontSize: Typography.sizes.body,
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 24,
  },
  errorTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  centreButton: {
    marginTop: Spacing.lg,
    minWidth: 160,
  },
  backLink: {
    paddingVertical: Spacing.sm,
    minHeight: 48,
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  backLinkText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
  },

  // ── Skeleton ──────────────────────────────────────────────────────────────
  skeletonContent: {
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  skeletonRow: {
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  skeletonPillRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    alignItems: 'center',
  },
});
