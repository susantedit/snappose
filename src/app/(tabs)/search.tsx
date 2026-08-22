/**
 * SearchScreen — Real-time Search & Discovery with Cinematic Motion for Snap Pose.
 *
 * Features:
 *  • Tactile expandable Search Bar with focus highlight & clear button
 *  • Staggered Category Filter Chips
 *  • Recent Searches pill list with MMKV persistence
 *  • 2-Column Masonry Results Grid with smooth FadeInDown item entrance
 *  • Floating / Ambient Empty State illustration
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { mmkv } from '@/database/mmkv/mmkvClient';
import { SNAP_POSE_CATEGORIES, SNAP_POSE_DATASET } from '@/features/poses/data/posesData';
import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import type { Pose } from '@/features/poses/types';
import { aiDirectorService, type AiSearchResponse } from '@/services/ai/AiDirectorService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = Spacing.md;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;
const RECENT_SEARCHES_KEY = 'recentSearches';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toastProps, showToast } = useToast();
  const reduceMotion = useReducedMotion();

  const [query, setQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<AiSearchResponse | null>(null);

  // Dynamic AI Semantic Search on query change
  useEffect(() => {
    let isMounted = true;
    aiDirectorService.searchPoses(query).then((res) => {
      if (isMounted) {
        setAiResponse(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [query]);

  // Recent Searches from MMKV
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const raw = mmkv.getString(RECENT_SEARCHES_KEY);
      return raw ? JSON.parse(raw) : ['Street', 'Cafe', 'Portrait', 'Couple'];
    } catch {
      return ['Street', 'Cafe', 'Portrait', 'Couple'];
    }
  });

  const saveRecentSearch = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 10);
      try {
        mmkv.set(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      mmkv.delete(RECENT_SEARCHES_KEY);
    } catch {}
  }, []);

  // Filtered Pose Results powered by AI Semantic ranking
  const results = useMemo<Pose[]>(() => {
    let filtered: Pose[] = aiResponse ? aiResponse.results.map((r) => r.pose) : SNAP_POSE_DATASET;

    // Filter by Category if selected
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.categoryId === selectedCategory);
    }

    return filtered;
  }, [aiResponse, selectedCategory]);

  const handleOpenPose = useCallback((id: string) => {
    router.push({
      pathname: '/pose/[id]',
      params: { id },
    });
  }, []);

  const handleTryPose = useCallback((id: string) => {
    router.push({
      pathname: '/(tabs)/camera',
      params: { poseId: id },
    });
  }, []);

  const handleSelectRecent = useCallback(
    (term: string) => {
      setQuery(term);
      saveRecentSearch(term);
    },
    [saveRecentSearch],
  );

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
    [isFavorite, toggleFavorite, showToast],
  );

  const isDark = theme.mode === 'dark';

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.sm,
            paddingBottom: insets.bottom + 90,
          },
        ]}
      >
        {/* ── 1. Header ────────────────────────────────────────────── */}
        <Animated.View
          entering={reduceMotion ? undefined : FadeIn.duration(400)}
          style={styles.header}
        >
          <Text style={[styles.screenTitle, { color: isDark ? '#FFF' : Colors.textPrimary }]}>
            Find your pose
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#AAA' : Colors.textSecondary }]}>
            Search pose ideas, moods, lighting and styles
          </Text>
        </Animated.View>

        {/* ── 2. Search Input Bar ──────────────────────────────────── */}
        <Animated.View
          entering={reduceMotion ? undefined : FadeInDown.duration(400).delay(100)}
          style={[
            styles.searchBarContainer,
            {
              backgroundColor: isDark ? '#242424' : '#EFE9DC',
              borderColor: isFocused ? Colors.olive : isDark ? '#383838' : '#E0D8C8',
            },
          ]}
        >
          <SPIcon
            name="search"
            size={18}
            color={isFocused ? Colors.olive : isDark ? '#888' : '#777'}
            style={styles.searchIcon}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={() => saveRecentSearch(query)}
            placeholder="Search poses (e.g., cafe, selfie, street)..."
            placeholderTextColor={isDark ? '#777' : '#999'}
            returnKeyType="search"
            style={[
              styles.searchInput,
              { color: isDark ? '#FFFFFF' : Colors.textPrimary },
            ]}
          />
          {query.length > 0 && (
            <AnimatedPressable
              onPress={() => setQuery('')}
              scaleTo={0.85}
              style={styles.clearButton}
            >
              <SPIcon name="close" size={14} color="#FFF" strokeWidth={2.4} />
            </AnimatedPressable>
          )}
        </Animated.View>

        {/* ── 3. Category Filter Chips ─────────────────────────────── */}
        <Animated.View
          entering={reduceMotion ? undefined : FadeInDown.duration(400).delay(150)}
          style={styles.categoriesContainer}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {SNAP_POSE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const iconColor = isSelected ? '#FFFFFF' : isDark ? '#DDD' : Colors.textPrimary;

              return (
                <AnimatedPressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  scaleTo={0.92}
                  hapticFeedback="selection"
                  style={[
                    styles.chip,
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
                          backgroundColor: isDark ? '#242424' : '#EFE9DC',
                          borderColor: isDark ? '#383838' : '#DFD7C7',
                        },
                  ]}
                >
                  <SPIcon name={cat.id} size={14} color={iconColor} strokeWidth={2.2} />
                  <Text
                    style={[
                      styles.chipLabel,
                      {
                        color: isSelected ? '#FFFFFF' : isDark ? '#DDD' : Colors.textPrimary,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </AnimatedPressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* ── 4. AI Quick Prompts & Semantic Overview ─────────────── */}
        {query.length > 0 && aiResponse && (
          <Animated.View
            entering={reduceMotion ? undefined : FadeInDown.duration(400).delay(180)}
            style={[
              styles.aiDirectorCard,
              {
                backgroundColor: isDark ? '#1F221B' : '#E8ECE1',
                borderColor: isDark ? 'rgba(183, 255, 0, 0.3)' : 'rgba(92, 107, 72, 0.35)',
              },
            ]}
          >
            <View style={styles.aiDirectorHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <SPIcon name="sparkles" size={15} color={Colors.olive} />
                <Text style={[styles.aiDirectorTitle, { color: isDark ? '#C7D9B4' : '#3E4E2C' }]}>
                  AI DIRECTED SUGGESTIONS
                </Text>
              </View>
              {aiResponse.intent.detectedVibe && (
                <View style={styles.aiVibeBadge}>
                  <Text style={styles.aiVibeBadgeText}>{aiResponse.intent.detectedVibe.toUpperCase()}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.aiDirectorOverview, { color: isDark ? '#E5E5EA' : Colors.textPrimary }]}>
              {aiResponse.directorOverview}
            </Text>
          </Animated.View>
        )}

        {/* AI Quick Prompt Inspiration Shortcuts */}
        {query.length === 0 && (
          <View style={styles.aiPromptShortcutsWrap}>
            <Text style={[styles.aiPromptSectionTitle, { color: isDark ? '#A3B899' : '#4F5B38' }]}>
              ✨ AI PROMPT IDEAS
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.aiPromptScroll}>
              {[
                { label: '☕ Cozy Cafe Candid', query: 'cafe relaxed coffee candid' },
                { label: '🕶️ Power Suit Boss', query: 'tony stark confident suit' },
                { label: '🌅 Sunset Beach Couple', query: 'beach sunset romantic couple' },
                { label: '🏃 Dynamic Street Walk', query: 'street walking casual outfit' },
                { label: '💪 Gym Fitness Flex', query: 'gym workout athletic power' },
              ].map((p, idx) => (
                <AnimatedPressable
                  key={idx}
                  onPress={() => handleSelectRecent(p.query)}
                  scaleTo={0.92}
                  style={[
                    styles.aiPromptPill,
                    {
                      backgroundColor: isDark ? '#262922' : '#F0EADF',
                      borderColor: isDark ? '#3D4435' : '#DED5C5',
                    },
                  ]}
                >
                  <Text style={[styles.aiPromptPillText, { color: isDark ? '#DCE8D0' : Colors.textPrimary }]}>
                    {p.label}
                  </Text>
                </AnimatedPressable>
              ))}
            </ScrollView>
          </View>
        )}
        {recentSearches.length > 0 && query.length === 0 && (
          <Animated.View
            entering={reduceMotion ? undefined : FadeInDown.duration(400).delay(200)}
            style={styles.recentSection}
          >
            <View style={styles.recentHeader}>
              <View style={styles.recentTitleRow}>
                <SPIcon name="history" size={14} color={isDark ? '#AAA' : Colors.textSecondary} />
                <Text
                  style={[
                    styles.recentTitle,
                    { color: isDark ? '#AAA' : Colors.textSecondary },
                  ]}
                >
                  Recent Searches
                </Text>
              </View>
              <Pressable onPress={clearRecentSearches} hitSlop={8}>
                <Text style={[styles.clearAllText, { color: Colors.olive }]}>
                  Clear all
                </Text>
              </Pressable>
            </View>

            <View style={styles.recentTagsWrap}>
              {recentSearches.map((term, index) => (
                <AnimatedPressable
                  key={`recent-${index}`}
                  onPress={() => handleSelectRecent(term)}
                  scaleTo={0.92}
                  style={[
                    styles.recentTag,
                    {
                      backgroundColor: isDark ? '#262626' : '#EFE9DC',
                      borderColor: isDark ? '#383838' : '#DDD6C6',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.recentTagText,
                      { color: isDark ? '#DDD' : Colors.textPrimary },
                    ]}
                  >
                    {term}
                  </Text>
                </AnimatedPressable>
              ))}
            </View>
          </Animated.View>
        )}

        {/* ── 5. Results Grid / Empty State ─────────────────────────── */}
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Text
              style={[
                styles.resultsTitle,
                { color: isDark ? '#FFF' : Colors.textPrimary },
              ]}
            >
              {query ? `Results for "${query}"` : 'Discover Ideas'}
            </Text>
            <Text style={[styles.resultsCount, { color: isDark ? '#AAA' : Colors.textSecondary }]}>
              {results.length} {results.length === 1 ? 'pose' : 'poses'}
            </Text>
          </View>

          {results.length === 0 ? (
            <Animated.View
              entering={reduceMotion ? undefined : FadeIn.duration(400)}
              style={styles.emptyState}
            >
              <View
                style={[
                  styles.emptyIconCircle,
                  { backgroundColor: isDark ? '#242424' : '#EFE9DC' },
                ]}
              >
                <SPIcon name="search" size={32} color={isDark ? '#888' : '#777'} />
              </View>
              <Text
                style={[
                  styles.emptyTitle,
                  { color: isDark ? '#FFF' : Colors.textPrimary },
                ]}
              >
                No poses found
              </Text>
              <Text
                style={[
                  styles.emptySubtitle,
                  { color: isDark ? '#AAA' : Colors.textSecondary },
                ]}
              >
                Try searching for a different keyword like "street", "nature", or "portrait"
              </Text>
              <AnimatedPressable
                onPress={() => {
                  setQuery('');
                  setSelectedCategory('all');
                }}
                scaleTo={0.95}
                style={styles.emptyResetBtn}
              >
                <Text style={styles.emptyResetText}>View All Poses</Text>
              </AnimatedPressable>
            </Animated.View>
          ) : (
            <View style={styles.posesGrid}>
              {results.map((pose, index) => (
                <Animated.View
                  key={pose.id}
                  entering={
                    reduceMotion
                      ? undefined
                      : FadeInDown.duration(350)
                          .delay(Math.min(index * 35, 300))
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
                    onPress={handleOpenPose}
                    onFavoritePress={handleToggleFavorite}
                    onCameraPress={handleTryPose}
                  />
                </Animated.View>
              ))}
            </View>
          )}
        </View>
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

  // Search Bar
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: Spacing.md,
    gap: 8,
  },
  searchIcon: {
    marginRight: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    padding: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // AI Director Card
  aiDirectorCard: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    marginBottom: Spacing.md,
    gap: 6,
  },
  aiDirectorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiDirectorTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  aiVibeBadge: {
    backgroundColor: Colors.olive,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  aiVibeBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  aiDirectorOverview: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },

  // AI Prompt Shortcuts
  aiPromptShortcutsWrap: {
    marginBottom: Spacing.md,
    gap: 6,
  },
  aiPromptSectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  aiPromptScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  aiPromptPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  aiPromptPillText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Category Filter
  categoriesContainer: {
    marginBottom: Spacing.md,
  },
  categoryScroll: {
    paddingVertical: 4,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
  },
  chipLabel: {
    fontSize: 12,
  },

  // Recent Searches
  recentSection: {
    marginBottom: Spacing.lg,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  recentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recentTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recentTagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  recentTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  recentTagText: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Results Grid
  resultsSection: {
    marginBottom: Spacing.xl,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  posesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
  emptyResetBtn: {
    marginTop: 12,
    backgroundColor: Colors.olive,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  emptyResetText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
