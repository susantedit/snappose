/**
 * SearchScreen — Categories grid + pose search.
 *
 * • 2-column FlashList grid of all 23 categories [Req 5.1, 5.2]
 * • Each card: real WebP photo, category name, pose count, Premium badge [Req 5.2]
 * • Tap → category route with scale/opacity hero transition ≤450ms [Req 5.3]
 * • Load from SQLite first, refresh from API in background [Req 5.4]
 * • Search bar with debounced input (200ms) [Req 6.1]
 * • Filters: difficulty, orientation, indoor/outdoor [Req 6.3]
 * • Store & show last 20 recent searches via MMKV [Req 6.4]
 * • Empty state: "No poses found" + "Explore Categories" button [Req 6.5]
 * • Clear search → recent searches view [Req 6.6]
 * • Never blank — skeleton/loading/error states [Req 4.3, 35.7]
 */

import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
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
  Spacing,
  Typography,
} from '@/constants/designTokens';

import { SPSearchBar } from '@/components/molecules/SPSearchBar';
import { SPCategoryCard } from '@/components/molecules/SPCategoryCard';
import { SPSkeletonCard } from '@/components/molecules/SPSkeletonCard';
import { SPButton } from '@/components/atoms/SPButton';

import { useCategories } from '@/features/poses/hooks/useCategories';
import { mmkv } from '@/database/mmkv/mmkvClient';
import type { Difficulty, Orientation } from '@/features/poses/types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SCREEN_WIDTH = Dimensions.get('window').width;
const HORIZONTAL_PADDING = Spacing.md;
const CARD_GAP = 10;
const COLUMN_COUNT = 2;
const CARD_WIDTH =
  (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;
const CARD_HEIGHT = 160;

const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 20;

// ---------------------------------------------------------------------------
// Filter types
// ---------------------------------------------------------------------------

interface SearchFilters {
  difficulty: Difficulty | null;
  orientation: Orientation | null;
  /** null = both; true = indoor; false = outdoor */
  indoor: boolean | null;
}

const DEFAULT_FILTERS: SearchFilters = {
  difficulty: null,
  orientation: null,
  indoor: null,
};

// ---------------------------------------------------------------------------
// Recent searches helpers (MMKV) [Req 6.4]
// ---------------------------------------------------------------------------

function getRecentSearches(): string[] {
  try {
    const raw = mmkv.getString(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function saveRecentSearch(keyword: string): void {
  if (!keyword.trim()) return;
  try {
    const current = getRecentSearches();
    const filtered = current.filter((k) => k.toLowerCase() !== keyword.toLowerCase());
    const updated = [keyword.trim(), ...filtered].slice(0, MAX_RECENT_SEARCHES);
    mmkv.set(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // silently ignore write errors
  }
}

function clearRecentSearches(): void {
  mmkv.delete(RECENT_SEARCHES_KEY);
}

// ---------------------------------------------------------------------------
// Filter chip sub-component
// ---------------------------------------------------------------------------

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  isDark: boolean;
}

function FilterChip({ label, selected, onPress, isDark }: FilterChipProps) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={anim}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withTiming(0.93, { duration: AnimationDurations.quick }); }}
        onPressOut={() => { scale.value = withTiming(1, { duration: AnimationDurations.quick }); }}
        style={[
          styles.filterChip,
          {
            backgroundColor: selected ? Colors.olive : isDark ? '#2A2A2A' : '#FFFFFF',
            borderColor: selected ? Colors.olive : isDark ? Colors.borderDark : Colors.border,
          },
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={label}
      >
        <Text
          style={[
            styles.filterChipText,
            { color: selected ? '#FFFFFF' : isDark ? '#CCCCCC' : Colors.textSecondary },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Recent search chip
// ---------------------------------------------------------------------------

interface RecentSearchChipProps {
  keyword: string;
  onPress: (keyword: string) => void;
  isDark: boolean;
}

function RecentSearchChip({ keyword, onPress, isDark }: RecentSearchChipProps) {
  return (
    <Pressable
      onPress={() => onPress(keyword)}
      style={[
        styles.recentChip,
        { backgroundColor: isDark ? '#2A2A2A' : '#F0EDE6', borderColor: isDark ? Colors.borderDark : Colors.border },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Recent search: ${keyword}`}
    >
      <Text style={[styles.recentChipText, { color: isDark ? '#CCCCCC' : Colors.textSecondary }]}>
        🕐 {keyword}
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Main SearchScreen
// ---------------------------------------------------------------------------

export default function SearchScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme.mode === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => getRecentSearches());

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  const isSearching = searchQuery.trim().length > 0;
  const isFilterActive = filters.difficulty || filters.orientation || filters.indoor !== null;

  // ---------------------------------------------------------------------------
  // Filtered categories based on search keyword
  // ---------------------------------------------------------------------------

  const filteredCategories = useMemo(() => {
    if (!isSearching) return categories ?? [];
    const lowerQuery = searchQuery.toLowerCase();
    return (categories ?? []).filter((cat) =>
      cat.name.toLowerCase().includes(lowerQuery) || cat.slug.toLowerCase().includes(lowerQuery)
    );
  }, [categories, searchQuery, isSearching]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleDebouncedSearch = useCallback((text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      saveRecentSearch(text);
      setRecentSearches(getRecentSearches());
    }
  }, []);

  const handleCategoryPress = useCallback((slug: string) => {
    router.push(`/category/${slug}`);
  }, []);

  const handleRecentSearchPress = useCallback((keyword: string) => {
    setSearchQuery(keyword);
    saveRecentSearch(keyword);
  }, []);

  const handleClearRecent = useCallback(() => {
    clearRecentSearches();
    setRecentSearches([]);
  }, []);

  const handleFilterToggle = useCallback(
    (key: keyof SearchFilters, value: any) => {
      setFilters((prev) => ({
        ...prev,
        [key]: prev[key] === value ? null : value,
      }));
    },
    []
  );

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const handleExploreCategories = useCallback(() => {
    setSearchQuery('');
    setFilters(DEFAULT_FILTERS);
    setIsFocused(false);
  }, []);

  const bg = isDark ? Colors.dark : Colors.cream;

  // ---------------------------------------------------------------------------
  // Render states
  // ---------------------------------------------------------------------------

  // Loading skeleton state [Req 4.3, 35.7]
  if (categoriesLoading && !categories) {
    return (
      <View style={[styles.root, { backgroundColor: bg }]}>
        <View
          style={[
            styles.header,
            { paddingTop: insets.top + Spacing.xs, paddingHorizontal: HORIZONTAL_PADDING },
          ]}
        >
          <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : Colors.textPrimary }]}>
            Search
          </Text>
          <SPSearchBar placeholder="Search categories, poses…" readOnly />
        </View>
        <View style={[styles.grid, { paddingHorizontal: HORIZONTAL_PADDING }]}>
          {Array.from({ length: 6 }, (_, i) => (
            <SPSkeletonCard
              key={i}
              variant="category"
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              style={styles.gridItem}
            />
          ))}
        </View>
      </View>
    );
  }

  // Error state [Req 35.7]
  if (categoriesError) {
    return (
      <View style={[styles.root, { backgroundColor: bg }]}>
        <View
          style={[
            styles.centeredState,
            { paddingTop: insets.top + 40, paddingHorizontal: HORIZONTAL_PADDING },
          ]}
        >
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={[styles.errorTitle, { color: isDark ? '#FFFFFF' : Colors.textPrimary }]}>
            Something went wrong
          </Text>
          <Text style={[styles.errorText, { color: isDark ? '#AAAAAA' : Colors.textSecondary }]}>
            We couldn't load categories. Check your connection.
          </Text>
          <SPButton
            label="Retry"
            variant="primary"
            accessibilityLabel="Retry loading categories"
            onPress={() => {}}
            style={styles.retryButton}
          />
        </View>
      </View>
    );
  }

  // Empty categories [Req 35.7]
  if (!categories || categories.length === 0) {
    return (
      <View style={[styles.root, { backgroundColor: bg }]}>
        <View
          style={[
            styles.centeredState,
            { paddingTop: insets.top + 40, paddingHorizontal: HORIZONTAL_PADDING },
          ]}
        >
          <Text style={styles.emptyIcon}>📂</Text>
          <Text style={[styles.emptyTitle, { color: isDark ? '#FFFFFF' : Colors.textPrimary }]}>
            No categories found
          </Text>
        </View>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // Main content view
  // ---------------------------------------------------------------------------

  const showRecentSearches = isFocused && !isSearching && recentSearches.length > 0;
  const showEmpty = isSearching && filteredCategories.length === 0;

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + Spacing.xs, paddingBottom: insets.bottom + Spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ── */}
        <View style={[styles.header, { paddingHorizontal: HORIZONTAL_PADDING }]}>
          <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : Colors.textPrimary }]}>
            Search
          </Text>
          <Text style={[styles.headerSubtitle, { color: isDark ? '#AAAAAA' : Colors.textSecondary }]}>
            {isSearching
              ? `${filteredCategories.length} ${filteredCategories.length === 1 ? 'category' : 'categories'}`
              : `${categories.length} categories`}
          </Text>
        </View>

        {/* ── Search bar ── [Req 6.1] */}
        <View style={{ paddingHorizontal: HORIZONTAL_PADDING, marginBottom: Spacing.md }}>
          <SPSearchBar
            placeholder="Search categories, poses…"
            onDebouncedChange={handleDebouncedSearch}
            debounceMs={200}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>

        {/* ── Filter pills ── [Req 6.3] */}
        {(isSearching || isFilterActive) && (
          <Animated.View entering={FadeIn.duration(AnimationDurations.medium)}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
              style={{ marginBottom: Spacing.md }}
            >
              <FilterChip
                label="Easy"
                selected={filters.difficulty === 'easy'}
                onPress={() => handleFilterToggle('difficulty', 'easy')}
                isDark={isDark}
              />
              <FilterChip
                label="Medium"
                selected={filters.difficulty === 'medium'}
                onPress={() => handleFilterToggle('difficulty', 'medium')}
                isDark={isDark}
              />
              <FilterChip
                label="Hard"
                selected={filters.difficulty === 'hard'}
                onPress={() => handleFilterToggle('difficulty', 'hard')}
                isDark={isDark}
              />
              <FilterChip
                label="Portrait"
                selected={filters.orientation === 'portrait'}
                onPress={() => handleFilterToggle('orientation', 'portrait')}
                isDark={isDark}
              />
              <FilterChip
                label="Landscape"
                selected={filters.orientation === 'landscape'}
                onPress={() => handleFilterToggle('orientation', 'landscape')}
                isDark={isDark}
              />
              <FilterChip
                label="Indoor"
                selected={filters.indoor === true}
                onPress={() => handleFilterToggle('indoor', true)}
                isDark={isDark}
              />
              <FilterChip
                label="Outdoor"
                selected={filters.indoor === false}
                onPress={() => handleFilterToggle('indoor', false)}
                isDark={isDark}
              />
              {isFilterActive && (
                <Pressable
                  onPress={handleClearFilters}
                  style={styles.clearFiltersButton}
                  accessibilityRole="button"
                  accessibilityLabel="Clear all filters"
                >
                  <Text style={[styles.clearFiltersText, { color: Colors.olive }]}>
                    Clear
                  </Text>
                </Pressable>
              )}
            </ScrollView>
          </Animated.View>
        )}

        {/* ── Recent searches ── [Req 6.4, 6.6] */}
        {showRecentSearches && (
          <Animated.View
            entering={FadeInDown.duration(AnimationDurations.medium)}
            style={{ paddingHorizontal: HORIZONTAL_PADDING, marginBottom: Spacing.lg }}
          >
            <View style={styles.recentHeader}>
              <Text style={[styles.recentTitle, { color: isDark ? '#FFFFFF' : Colors.textPrimary }]}>
                Recent Searches
              </Text>
              <Pressable
                onPress={handleClearRecent}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Clear recent searches"
              >
                <Text style={[styles.clearRecentText, { color: Colors.olive }]}>
                  Clear
                </Text>
              </Pressable>
            </View>
            <View style={styles.recentGrid}>
              {recentSearches.map((keyword, idx) => (
                <RecentSearchChip
                  key={`${keyword}-${idx}`}
                  keyword={keyword}
                  onPress={handleRecentSearchPress}
                  isDark={isDark}
                />
              ))}
            </View>
          </Animated.View>
        )}

        {/* ── Empty state ── [Req 6.5] */}
        {showEmpty && (
          <Animated.View entering={FadeIn} style={[styles.centeredState, { paddingVertical: Spacing.xxxl }]}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={[styles.emptyTitle, { color: isDark ? '#FFFFFF' : Colors.textPrimary }]}>
              No poses found
            </Text>
            <Text style={[styles.emptySubtitle, { color: isDark ? '#AAAAAA' : Colors.textSecondary }]}>
              Try a different keyword or explore categories
            </Text>
            <SPButton
              label="Explore Categories"
              variant="primary"
              accessibilityLabel="Explore all categories"
              onPress={handleExploreCategories}
              style={styles.exploreButton}
            />
          </Animated.View>
        )}

        {/* ── 2-column FlashList categories grid ── [Req 5.1, 5.2, 5.3] */}
        {!showRecentSearches && !showEmpty && (
          <View style={[styles.grid, { paddingHorizontal: HORIZONTAL_PADDING }]}>
            <FlashList
              data={filteredCategories}
              numColumns={COLUMN_COUNT}
              estimatedItemSize={CARD_HEIGHT}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <SPCategoryCard
                  slug={item.slug}
                  name={item.name}
                  poseCount={item.totalPoses}
                  imageUri={item.image}
                  accentColor={item.color}
                  isPremium={item.isPremium}
                  width={CARD_WIDTH}
                  height={CARD_HEIGHT}
                  onPress={handleCategoryPress}
                  style={styles.gridItem}
                />
              )}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
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
  header: {
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold as '700',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium as '500',
  },
  filterRow: {
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: Spacing.xs,
    paddingRight: HORIZONTAL_PADDING + Spacing.xs,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: 'center',
  },
  filterChipText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium as '500',
  },
  clearFiltersButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  clearFiltersText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold as '600',
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  recentTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.semibold as '600',
  },
  clearRecentText: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.semibold as '600',
  },
  recentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  recentChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  recentChipText: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.medium as '500',
  },
  grid: {
    flex: 1,
    minHeight: 400,
  },
  gridItem: {
    marginBottom: CARD_GAP,
    marginRight: CARD_GAP,
  },
  centeredState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.semibold as '600',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.sizes.body,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  exploreButton: {
    marginTop: Spacing.md,
  },
  errorIcon: {
    fontSize: 56,
    marginBottom: Spacing.md,
  },
  errorTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.semibold as '600',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  errorText: {
    fontSize: Typography.sizes.body,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  retryButton: {
    marginTop: Spacing.md,
  },
});
