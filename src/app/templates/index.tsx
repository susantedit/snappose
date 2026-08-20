/**
 * TemplatesDiscoveryScreen — POSEHANUM
 *
 * Dedicated Template Platform Discovery Hub:
 *  - 20 Search & Category Filters (Trending, New, Popular, Couple, Street, Fashion, Travel, Night, Fitness, etc.)
 *  - Live search across template titles, recipes, and vibes
 *  - Rich template cards with difficulty, Pose DNA metrics, creator attribution, and usage stats
 *  - Direct entry to Template Creator & Canvas Studio
 */

import React, { useState, useMemo } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/constants/theme';
import { Colors, Spacing, BorderRadius } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';

import { TEMPLATE_DATASET } from '@/features/templates/data/templateData';
import { useTemplateStore } from '@/features/templates/stores/templateStore';
import type { Template } from '@/features/templates/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.md * 2 - 12) / 2;

const CATEGORIES = [
  'All',
  '🔥 Trending',
  '✨ New',
  '👑 Popular',
  '💑 Couple',
  '🌆 Street',
  '👗 Fashion',
  '🏖 Travel',
  '🌙 Night',
  '🎉 Party',
  '💪 Fitness',
  '😂 Fun',
  '🎬 Cinematic',
  '🎨 Creative',
  '👥 Friends',
  '🎓 Graduation',
  '💍 Wedding',
  '📸 Portrait',
  '📱 Social Media',
];

export default function TemplatesDiscoveryScreen() {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';
  const insets = useSafeAreaInsets();

  const templateStore = useTemplateStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Combine built-in seed dataset with user-created templates
  const allTemplates: Template[] = useMemo(() => {
    return [...templateStore.userCreatedTemplates, ...TEMPLATE_DATASET];
  }, [templateStore.userCreatedTemplates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((t) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesCategory = t.category.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q) ?? false;
        const matchesPose = t.poseName?.toLowerCase().includes(q) ?? false;
        if (!matchesTitle && !matchesCategory && !matchesDesc && !matchesPose) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory === 'All') return true;
      if (selectedCategory === '🔥 Trending') return t.isFeatured || (t.uses || 0) > 500;
      if (selectedCategory === '✨ New') return t.isNew;
      if (selectedCategory === '👑 Popular') return (t.uses || 0) > 100;

      const cleanCat = selectedCategory.replace(/^[^\w\s]+/, '').trim().toLowerCase();
      return t.category.toLowerCase().includes(cleanCat);
    });
  }, [allTemplates, selectedCategory, searchQuery]);

  const handleSelectCategory = (cat: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(cat);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <SPIcon name="back" size={20} color={theme.colors.textPrimary} />
          </Pressable>
          <View style={styles.brandPill}>
            <Text style={styles.brandPillText}>POSEHANUM TEMPLATES</Text>
          </View>
          <Pressable
            onPress={() => router.push('/template-creator')}
            style={styles.createBtn}
          >
            <SPIcon name="sparkles" size={16} color={Colors.lime} />
            <Text style={styles.createBtnText}>+ Create</Text>
          </Pressable>
        </View>

        {/* Search Input */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: isDark ? Colors.darkCardBackground : Colors.surface,
              borderColor: isDark ? Colors.borderDark : Colors.border,
            },
          ]}
        >
          <SPIcon name="search" size={16} color={theme.colors.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search poses, shot recipes, vibes..."
            placeholderTextColor={theme.colors.textSecondary}
            style={[styles.searchInput, { color: theme.colors.textPrimary }]}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <SPIcon name="close" size={16} color={theme.colors.textSecondary} />
            </Pressable>
          )}
        </View>

        {/* Category Horizontal Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <AnimatedPressable
                key={cat}
                onPress={() => handleSelectCategory(cat)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: active
                      ? Colors.lime
                      : isDark
                      ? Colors.darkCardBackground
                      : Colors.surface,
                    borderColor: active
                      ? Colors.lime
                      : isDark
                      ? Colors.borderDark
                      : Colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: active ? '#181818' : theme.colors.textPrimary,
                      fontWeight: active ? '800' : '600',
                    },
                  ]}
                >
                  {cat}
                </Text>
              </AnimatedPressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Templates Grid */}
      <ScrollView
        contentContainerStyle={[
          styles.gridContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredTemplates.length === 0 ? (
          <View style={styles.emptyState}>
            <SPIcon name="search" size={40} color={Colors.muted} />
            <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
              No templates found
            </Text>
            <Text style={[styles.emptySub, { color: theme.colors.textSecondary }]}>
              Try searching with different keywords or switch categories.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredTemplates.map((t, index) => (
              <Animated.View
                key={t.id}
                entering={FadeInDown.delay((index % 8) * 50).duration(300)}
                style={styles.cardWrapper}
              >
                <AnimatedPressable
                  onPress={() =>
                    router.push({ pathname: '/template/[id]', params: { id: t.id } })
                  }
                  style={[
                    styles.card,
                    {
                      backgroundColor: isDark
                        ? Colors.darkCardBackground
                        : Colors.surface,
                      borderColor: isDark ? Colors.borderDark : Colors.border,
                    },
                  ]}
                >
                  {/* Thumbnail Image */}
                  <View style={styles.imageBox}>
                    <Image
                      source={{ uri: t.thumbnailUrl || t.imageUrl }}
                      style={StyleSheet.absoluteFill}
                      resizeMode="cover"
                    />
                    <View style={styles.imageOverlay} />

                    {/* Category pill */}
                    <View style={styles.catBadge}>
                      <Text style={styles.catBadgeText}>
                        {t.category.toUpperCase()}
                      </Text>
                    </View>

                    {/* Difficulty Pill */}
                    <View style={styles.diffBadge}>
                      <Text style={styles.diffBadgeText}>
                        {t.poseDna?.difficulty || 'MODERATE'}
                      </Text>
                    </View>

                    {/* Stats bar */}
                    <View style={styles.statRow}>
                      <View style={styles.statPill}>
                        <SPIcon name="camera" size={10} color="#FFF" />
                        <Text style={styles.statPillText}>{t.uses}</Text>
                      </View>
                      <View style={styles.statPill}>
                        <SPIcon name="heart" size={10} color="#FFF" />
                        <Text style={styles.statPillText}>{t.likes}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Info Box */}
                  <View style={styles.cardInfo}>
                    <Text
                      style={[styles.cardTitle, { color: theme.colors.textPrimary }]}
                      numberOfLines={1}
                    >
                      {t.title}
                    </Text>
                    <Text
                      style={[styles.creatorName, { color: theme.colors.textSecondary }]}
                      numberOfLines={1}
                    >
                      by {t.creator.displayName}
                    </Text>

                    {/* Shot Recipe Snippet */}
                    <View style={styles.recipeSnippet}>
                      <SPIcon name="target" size={10} color={Colors.olive} />
                      <Text
                        style={[
                          styles.recipeSnippetText,
                          { color: theme.colors.textSecondary },
                        ]}
                        numberOfLines={1}
                      >
                        {t.shotRecipe.cameraAngle} • {t.shotRecipe.cameraDistance}
                      </Text>
                    </View>
                  </View>
                </AnimatedPressable>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandPill: {
    backgroundColor: 'rgba(183,255,0,0.15)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  brandPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.lime,
    letterSpacing: 1,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.olive,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  createBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    gap: 8,
    marginBottom: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  categoryScroll: {
    gap: 6,
    paddingVertical: 4,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 11,
  },
  gridContent: {
    padding: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: Spacing.md,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  card: {
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageBox: {
    width: '100%',
    height: 190,
    position: 'relative',
    backgroundColor: '#1E1E1E',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  catBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  catBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.8,
  },
  diffBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.olive,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  diffBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFF',
  },
  statRow: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    gap: 6,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFF',
  },
  cardInfo: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  creatorName: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 6,
  },
  recipeSnippet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recipeSnippetText: {
    fontSize: 9,
    fontWeight: '500',
  },
});
