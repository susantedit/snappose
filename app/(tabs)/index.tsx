/**
 * HomeScreen — port of HomeScreen.kt
 *
 * Features:
 *  • Search bar with 200ms debounced input [Req 4.1, 6.1]
 *  • Horizontally scrollable category chip row — all 23 categories [Req 4.1]
 *  • BlurHash skeleton placeholders while loading [Req 4.2]
 *  • Never blank — always skeleton/shimmer [Req 4.3]
 *  • Offline banner + cached content when no connectivity [Req 4.4]
 *  • Floating circular camera FAB (72 px, Olive Green #65744A) [Req 4.5]
 *  • 60 FPS scroll using FlashList [Req 4.6]
 *  • React Query cache served from MMKV (staleTime 24 h) [Req 4.7]
 *  • Trending / Recommended / Recently Viewed / Editor's Picks sections [Req 4.1]
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/constants/theme';
import {
  AnimationDurations,
  BorderRadius,
  Colors,
  Elevation,
  Spacing,
  Typography,
} from '@/constants/designTokens';

import { SPPoseCard } from '@/components/molecules/SPPoseCard';
import { SPSkeletonCard } from '@/components/molecules/SPSkeletonCard';
import { SPSearchBar } from '@/components/molecules/SPSearchBar';
import { SPToast, useToast } from '@/components/molecules/SPToast';

import {
  useEditorsPicks,
  useRecommended,
  useTrending,
  getRecentlyViewed,
  addToRecentlyViewed,
} from '@/features/poses/hooks/useHomeData';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import type { Pose } from '@/features/poses/types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 10;
const HORIZONTAL_PADDING = Spacing.md;
const COLUMN_COUNT = 2;
const CARD_WIDTH =
  (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

const SECTION_SKELETON_COUNT = 4;
const FAB_SIZE = 72;

export const ALL_CATEGORIES = [
  { id: 'beach', name: 'Beach', emoji: '🏖' },
  { id: 'cafe', name: 'Cafe', emoji: '☕' },
  { id: 'mountain', name: 'Mountain', emoji: '⛰' },
  { id: 'nature', name: 'Nature', emoji: '🌿' },
  { id: 'wedding', name: 'Wedding', emoji: '💍' },
  { id: 'festival', name: 'Festival', emoji: '🎉' },
  { id: 'friends', name: 'Friends', emoji: '👫' },
  { id: 'couple', name: 'Couple', emoji: '💑' },
  { id: 'solo', name: 'Solo', emoji: '🧍' },
  { id: 'selfie', name: 'Selfie', emoji: '🤳' },
  { id: 'luxury', name: 'Luxury', emoji: '💎' },
  { id: 'car', name: 'Car', emoji: '🚗' },
  { id: 'bike', name: 'Bike', emoji: '🚴' },
  { id: 'gym', name: 'Gym', emoji: '🏋' },
  { id: 'office', name: 'Office', emoji: '💼' },
  { id: 'traditional', name: 'Traditional', emoji: '👘' },
  { id: 'fashion', name: 'Fashion', emoji: '👗' },
  { id: 'camping', name: 'Camping', emoji: '⛺' },
  { id: 'forest', name: 'Forest', emoji: '🌲' },
  { id: 'snow', name: 'Snow', emoji: '❄' },
  { id: 'golden-hour', name: 'Golden Hour', emoji: '🌅' },
  { id: 'night', name: 'Night', emoji: '🌙' },
  { id: 'travel', name: 'Travel', emoji: '✈' },
] as const;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Offline banner shown at top when connectivity lost */
function OfflineBanner() {
  return (
    <Animated.View entering={FadeIn.duration(AnimationDurations.medium)} style={styles.offlineBanner}>
      <Text style={styles.offlineIcon}>📡</Text>
      <Text style={styles.offlineText}>You're offline — showing cached content</Text>
    </Animated.View>
  );
}

/** Section header with optional "See all" link */
function SectionHeader({
  title,
  onSeeAll,
  isDark,
}: {
  title: string;
  onSeeAll?: () => void;
  isDark: boolean;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : Colors.textPrimary }]}>
        {title}
      </Text>
      {onSeeAll && (
        <Pressable
          onPress={onSeeAll}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`See all ${title}`}
        >
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      )}
    </View>
  );
}

/** Horizontal scrollable row of skeleton cards */
function HorizontalSkeletonRow() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalListContent}
      scrollEventThrottle={16}
    >
      {Array.from({ length: SECTION_SKELETON_COUNT }, (_, i) => (
        <SPSkeletonCard
          key={i}
          variant="pose"
          width={CARD_WIDTH}
          height={240}
          style={i > 0 ? { marginLeft: CARD_GAP } : undefined}
        />
      ))}
    </ScrollView>
  );
}

/** Horizontal pose card row */
function HorizontalPoseRow({
  poses,
  onPosePress,
  onFavoritePress,
  onCameraPress,
}: {
  poses: Pose[];
  onPosePress: (id: string) => void;
  onFavoritePress: (id: string) => void;
  onCameraPress: (id: string) => void;
}) {
  return (
    <FlashList
      data={poses}
      horizontal
      estimatedItemSize={CARD_WIDTH}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalListContent}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <SPPoseCard
          id={item.id}
          name={item.title}
          category={item.categoryId}
          imageUri={item.imageUrl}
          difficulty={item.difficulty}
          width={CARD_WIDTH}
          height={240}
          onPress={onPosePress}
          onFavoritePress={onFavoritePress}
          onCameraPress={onCameraPress}
          style={index > 0 ? { marginLeft: CARD_GAP } : undefined}
        />
      )}
    />
  );
}

/** Masonry 2-column pose grid section */
function PoseGrid({
  poses,
  onPosePress,
  onFavoritePress,
  onCameraPress,
}: {
  poses: Pose[];
  onPosePress: (id: string) => void;
  onFavoritePress: (id: string) => void;
  onCameraPress: (id: string) => void;
}) {
  // Split into two columns manually for masonry-style layout
  const left: Pose[] = [];
  const right: Pose[] = [];
  poses.forEach((p, i) => {
    if (i % 2 === 0) left.push(p);
    else right.push(p);
  });

  const renderColumn = (items: Pose[]) =>
    items.map((item) => (
      <SPPoseCard
        key={item.id}
        id={item.id}
        name={item.title}
        category={item.categoryId}
        imageUri={item.imageUrl}
        difficulty={item.difficulty}
        width={CARD_WIDTH}
        onPress={onPosePress}
        onFavoritePress={onFavoritePress}
        onCameraPress={onCameraPress}
        style={styles.gridCard}
      />
    ));

  return (
    <View style={[styles.gridContainer, { paddingHorizontal: HORIZONTAL_PADDING }]}>
      <View style={styles.gridColumn}>{renderColumn(left)}</View>
      <View style={[styles.gridColumn, { marginLeft: CARD_GAP }]}>{renderColumn(right)}</View>
    </View>
  );
}

/** Skeleton masonry grid for loading state */
function SkeletonGrid({ count = 4 }: { count?: number }) {
  const left = Array.from({ length: Math.ceil(count / 2) }, (_, i) => i * 2);
  const right = Array.from({ length: Math.floor(count / 2) }, (_, i) => i * 2 + 1);

  return (
    <View style={[styles.gridContainer, { paddingHorizontal: HORIZONTAL_PADDING }]}>
      <View style={styles.gridColumn}>
        {left.map((i) => (
          <SPSkeletonCard key={i} variant="pose" width={CARD_WIDTH} style={styles.gridCard} />
        ))}
      </View>
      <View style={[styles.gridColumn, { marginLeft: CARD_GAP }]}>
        {right.map((i) => (
          <SPSkeletonCard key={i} variant="pose" width={CARD_WIDTH} style={styles.gridCard} />
        ))}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Category chip
// ---------------------------------------------------------------------------

interface CategoryChipProps {
  id: string;
  name: string;
  emoji: string;
  selected: boolean;
  onPress: (id: string) => void;
  isDark: boolean;
}

function CategoryChip({ id, name, emoji, selected, onPress, isDark }: CategoryChipProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.94, { duration: AnimationDurations.quick });
  };
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: AnimationDurations.quick });
  };

  const bgColor = selected
    ? Colors.olive
    : isDark
    ? '#2A2A2A'
    : '#FFFFFF';
  const textColor = selected ? '#FFFFFF' : isDark ? '#CCCCCC' : Colors.textSecondary;
  const borderColor = selected ? Colors.olive : isDark ? Colors.borderDark : Colors.border;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={() => onPress(id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.chip, { backgroundColor: bgColor, borderColor }]}
        accessibilityRole="button"
        accessibilityLabel={`${name} category`}
        accessibilityState={{ selected }}
      >
        <Text style={styles.chipEmoji}>{emoji}</Text>
        <Text style={[styles.chipText, { color: textColor }]}>{name}</Text>
      </Pressable>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Floating Action Button
// ---------------------------------------------------------------------------

function CameraFAB({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[styles.fabContainer, animatedStyle]}
      entering={FadeInDown.delay(300).duration(AnimationDurations.medium)}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.9, { duration: AnimationDurations.quick });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: AnimationDurations.quick });
        }}
        style={styles.fab}
        accessibilityRole="button"
        accessibilityLabel="Open camera"
        accessibilityHint="Opens the camera to capture a pose"
      >
        <Text style={styles.fabIcon}>📷</Text>
      </Pressable>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Main HomeScreen
// ---------------------------------------------------------------------------

export default function HomeScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme.mode === 'dark';
  const isOnline = useOnlineStatus();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { toastProps, showToast } = useToast();

  const {
    data: trendingPoses,
    isLoading: trendingLoading,
    isError: trendingError,
  } = useTrending();

  const {
    data: recommendedPoses,
    isLoading: recommendedLoading,
    isError: recommendedError,
  } = useRecommended();

  const {
    data: editorsPicks,
    isLoading: editorsLoading,
    isError: editorsError,
  } = useEditorsPicks();

  // Recently viewed — read from MMKV
  const recentlyViewed = useMemo(() => getRecentlyViewed(), []);

  // Filtered poses for search
  const filteredPoses = useMemo<Pose[]>(() => {
    const allPoses = [
      ...(trendingPoses ?? []),
      ...(recommendedPoses ?? []),
      ...(editorsPicks ?? []),
    ];
    const unique = allPoses.filter(
      (pose, index, self) => self.findIndex((p) => p.id === pose.id) === index,
    );

    if (!searchQuery.trim() && !selectedCategory) return [];

    return unique.filter((pose) => {
      const matchesSearch =
        !searchQuery.trim() ||
        pose.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pose.categoryId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !selectedCategory || pose.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, trendingPoses, recommendedPoses, editorsPicks]);

  const isSearching = searchQuery.trim().length > 0 || selectedCategory !== null;
  const isAnyLoading = trendingLoading || recommendedLoading || editorsLoading;

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handlePosePress = useCallback(
    (id: string) => {
      // Track recently viewed
      const allPoses = [
        ...(trendingPoses ?? []),
        ...(recommendedPoses ?? []),
        ...(editorsPicks ?? []),
      ];
      const pose = allPoses.find((p) => p.id === id);
      if (pose) addToRecentlyViewed(pose);
      router.push(`/pose/${id}`);
    },
    [trendingPoses, recommendedPoses, editorsPicks],
  );

  const handleFavoritePress = useCallback(
    (id: string) => {
      showToast({ message: 'Added to favorites', variant: 'success', description: undefined });
    },
    [showToast],
  );

  const handleCameraPress = useCallback((id: string) => {
    router.push('/(tabs)/camera');
  }, []);

  const handleCategoryPress = useCallback((id: string) => {
    setSelectedCategory((prev) => (prev === id ? null : id));
    if (searchQuery.trim() === '') {
      router.push(`/category/${id}`);
    }
  }, [searchQuery]);

  const handleSearchDebounced = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleOpenCamera = useCallback(() => {
    router.push('/(tabs)/camera');
  }, []);

  const bg = isDark ? Colors.dark : Colors.cream;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      {/* Offline banner */}
      {!isOnline && <OfflineBanner />}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + Spacing.xs, paddingBottom: insets.bottom + FAB_SIZE + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* ── Header ── */}
        <View style={[styles.header, { paddingHorizontal: HORIZONTAL_PADDING }]}>
          <View>
            <Text style={[styles.greeting, { color: isDark ? '#AAAAAA' : Colors.textSecondary }]}>
              Good day 👋
            </Text>
            <Text style={[styles.appTitle, { color: isDark ? '#FFFFFF' : Colors.textPrimary }]}>
              Snap Pose
            </Text>
          </View>
        </View>

        {/* ── Search bar ── */}
        <View style={{ paddingHorizontal: HORIZONTAL_PADDING, marginBottom: Spacing.md }}>
          <SPSearchBar
            placeholder="Search poses, categories…"
            onDebouncedChange={handleSearchDebounced}
            debounceMs={200}
          />
        </View>

        {/* ── Category chips ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
          scrollEventThrottle={16}
          style={{ marginBottom: Spacing.lg }}
        >
          {ALL_CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              id={cat.id}
              name={cat.name}
              emoji={cat.emoji}
              selected={selectedCategory === cat.id}
              onPress={handleCategoryPress}
              isDark={isDark}
            />
          ))}
        </ScrollView>

        {/* ── Search results ── */}
        {isSearching && (
          <View>
            <SectionHeader
              title={
                filteredPoses.length > 0
                  ? `Results (${filteredPoses.length})`
                  : 'No results found'
              }
              isDark={isDark}
            />
            {isAnyLoading ? (
              <SkeletonGrid count={4} />
            ) : filteredPoses.length > 0 ? (
              <PoseGrid
                poses={filteredPoses}
                onPosePress={handlePosePress}
                onFavoritePress={handleFavoritePress}
                onCameraPress={handleCameraPress}
              />
            ) : (
              <Animated.View entering={FadeIn} style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={[styles.emptyTitle, { color: isDark ? '#FFFFFF' : Colors.textPrimary }]}>
                  No poses found
                </Text>
                <Text style={[styles.emptySubtitle, { color: isDark ? '#AAAAAA' : Colors.textSecondary }]}>
                  Try a different keyword or explore categories
                </Text>
              </Animated.View>
            )}
          </View>
        )}

        {/* ── Default feed (non-search) ── */}
        {!isSearching && (
          <>
            {/* Trending section */}
            <SectionHeader
              title="🔥 Trending"
              onSeeAll={() => router.push('/category/trending' as any)}
              isDark={isDark}
            />
            {trendingLoading ? (
              <HorizontalSkeletonRow />
            ) : trendingError ? (
              <SectionError message="Couldn't load trending poses" isDark={isDark} />
            ) : (
              <HorizontalPoseRow
                poses={trendingPoses ?? []}
                onPosePress={handlePosePress}
                onFavoritePress={handleFavoritePress}
                onCameraPress={handleCameraPress}
              />
            )}

            {/* Recommended section */}
            <View style={{ marginTop: Spacing.xl }}>
              <SectionHeader
                title="✨ Recommended"
                onSeeAll={() => router.push('/category/recommended' as any)}
                isDark={isDark}
              />
              {recommendedLoading ? (
                <HorizontalSkeletonRow />
              ) : recommendedError ? (
                <SectionError message="Couldn't load recommendations" isDark={isDark} />
              ) : (
                <HorizontalPoseRow
                  poses={recommendedPoses ?? []}
                  onPosePress={handlePosePress}
                  onFavoritePress={handleFavoritePress}
                  onCameraPress={handleCameraPress}
                />
              )}
            </View>

            {/* Recently Viewed section */}
            {recentlyViewed.length > 0 && (
              <View style={{ marginTop: Spacing.xl }}>
                <SectionHeader title="🕐 Recently Viewed" isDark={isDark} />
                <HorizontalPoseRow
                  poses={recentlyViewed}
                  onPosePress={handlePosePress}
                  onFavoritePress={handleFavoritePress}
                  onCameraPress={handleCameraPress}
                />
              </View>
            )}

            {/* Editor's Picks section */}
            <View style={{ marginTop: Spacing.xl, marginBottom: Spacing.sm }}>
              <SectionHeader
                title="🎨 Editor's Picks"
                onSeeAll={() => router.push('/category/editors-picks' as any)}
                isDark={isDark}
              />
              {editorsLoading ? (
                <SkeletonGrid count={4} />
              ) : editorsError ? (
                <SectionError message="Couldn't load editor's picks" isDark={isDark} />
              ) : (
                <PoseGrid
                  poses={editorsPicks ?? []}
                  onPosePress={handlePosePress}
                  onFavoritePress={handleFavoritePress}
                  onCameraPress={handleCameraPress}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* ── Floating Camera FAB ── */}
      <CameraFAB onPress={handleOpenCamera} />

      {/* ── Toast ── */}
      <SPToast {...toastProps} position="bottom" />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Section error state
// ---------------------------------------------------------------------------

function SectionError({ message, isDark }: { message: string; isDark: boolean }) {
  return (
    <View style={styles.sectionError}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={[styles.errorText, { color: isDark ? '#AAAAAA' : Colors.textSecondary }]}>
        {message}
      </Text>
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
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
    zIndex: 100,
  },
  offlineIcon: {
    fontSize: 14,
  },
  offlineText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium as '500',
    color: '#1A1200',
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  greeting: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.regular as '400',
    marginBottom: 2,
  },
  appTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold as '700',
    letterSpacing: -0.5,
  },
  categoryRow: {
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: Spacing.xs,
    paddingRight: HORIZONTAL_PADDING + Spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: 5,
    minHeight: 36,
  },
  chipEmoji: {
    fontSize: 14,
    lineHeight: 18,
  },
  chipText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium as '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold as '700',
    letterSpacing: -0.2,
  },
  seeAll: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.semibold as '600',
    color: Colors.olive,
  },
  horizontalListContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingRight: HORIZONTAL_PADDING + CARD_GAP,
  },
  gridContainer: {
    flexDirection: 'row',
  },
  gridColumn: {
    flex: 1,
  },
  gridCard: {
    marginBottom: CARD_GAP,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.semibold as '600',
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.small,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionError: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  errorIcon: {
    fontSize: 18,
  },
  errorText: {
    fontSize: Typography.sizes.small,
  },
  // FAB
  fabContainer: {
    position: 'absolute',
    bottom: Spacing.xxl,
    right: Spacing.lg,
    zIndex: 200,
    elevation: Elevation.fab,
    shadowColor: Colors.olive,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: Colors.olive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    fontSize: 28,
    lineHeight: 34,
  },
});
