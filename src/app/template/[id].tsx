/**
 * Template Detail Screen — POSEHANUM
 *
 * Full-screen template view featuring:
 *  - Hero image with gradient overlay
 *  - Pose DNA card
 *  - Shot Recipe card
 *  - Creator info
 *  - Action buttons: Use Template, Remix, Save, Share, Favorite
 *  - Instructions & Tips
 *  - Related templates
 */

import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/constants/theme';
import { BorderRadius, Colors, Spacing } from '@/constants/designTokens';
import { SPButton } from '@/components/atoms/SPButton';
import { SPIcon } from '@/components/atoms/SPIcon';
import { SPBadge } from '@/components/atoms/SPBadge';
import { SPToast, useToast } from '@/components/molecules/SPToast';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';

import { getTemplateById, TEMPLATE_DATASET } from '@/features/templates/data/templateData';
import { useTemplateStore } from '@/features/templates/stores/templateStore';
import { SPPoseDNACard } from '@/features/poses/components/SPPoseDNACard';
import { SPReportModal } from '@/features/moderation/components/SPReportModal';
import type { Template } from '@/features/templates/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = Math.min(420, Dimensions.get('window').height * 0.45);

// ---------------------------------------------------------------------------
// Shot Recipe Card
// ---------------------------------------------------------------------------

function ShotRecipeCard({ recipe }: { recipe: Template['shotRecipe'] }) {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';

  const items = [
    { icon: 'portrait', label: 'Pose', value: recipe.pose },
    { icon: 'camera', label: 'Camera Angle', value: recipe.cameraAngle },
    { icon: 'target', label: 'Distance', value: recipe.cameraDistance },
    { icon: 'lifestyle', label: 'Lighting', value: recipe.lighting },
    { icon: 'ai', label: 'Expression', value: recipe.expression },
    { icon: 'gallery', label: 'Background', value: recipe.background },
    { icon: 'grid', label: 'Composition', value: recipe.composition },
    ...(recipe.lensSuggestion
      ? [{ icon: 'aperture', label: 'Lens', value: recipe.lensSuggestion }]
      : []),
    ...(recipe.timingTip
      ? [{ icon: 'clock', label: 'Timing', value: recipe.timingTip }]
      : []),
  ];

  return (
    <Animated.View
      entering={FadeInDown.delay(200).duration(400)}
      style={[
        styles.recipeCard,
        {
          backgroundColor: isDark ? Colors.darkCardBackground : Colors.surface,
          borderColor: isDark ? Colors.borderDark : Colors.border,
        },
      ]}
    >
      <View style={styles.recipeHeader}>
        <View style={[styles.recipeTag, { backgroundColor: Colors.gold }]}>
          <Text style={styles.recipeTagText}>SHOT RECIPE</Text>
        </View>
      </View>
      {items.map((item, i) => (
        <View
          key={item.label}
          style={[
            styles.recipeRow,
            {
              borderBottomColor: isDark
                ? 'rgba(255,255,255,0.06)'
                : 'rgba(0,0,0,0.05)',
              borderBottomWidth: i < items.length - 1 ? StyleSheet.hairlineWidth : 0,
            },
          ]}
        >
          <SPIcon
            name={item.icon as any}
            size={14}
            color={Colors.olive}
            strokeWidth={2}
          />
          <Text style={[styles.recipeLabel, { color: theme.colors.textSecondary }]}>
            {item.label}
          </Text>
          <Text
            style={[styles.recipeValue, { color: theme.colors.textPrimary }]}
            numberOfLines={2}
          >
            {item.value}
          </Text>
        </View>
      ))}
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Instructions list
// ---------------------------------------------------------------------------

function InstructionsList({ items, label }: { items: string[]; label: string }) {
  const { theme } = useTheme();
  return (
    <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.listSection}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>{label}</Text>
      {items.map((item, i) => (
        <View key={i} style={styles.listItem}>
          <View style={[styles.listBullet, { backgroundColor: Colors.olive }]}>
            <Text style={styles.listBulletText}>{i + 1}</Text>
          </View>
          <Text style={[styles.listText, { color: theme.colors.textSecondary }]}>
            {item}
          </Text>
        </View>
      ))}
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

export default function TemplateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';
  const insets = useSafeAreaInsets();
  const { toastProps, showToast } = useToast();

  const templateStore = useTemplateStore();
  const template = getTemplateById(id ?? '');

  const [saved, setSaved] = useState(() =>
    id ? templateStore.isSaved(id) : false
  );
  const [liked, setLiked] = useState(() =>
    id ? templateStore.isLiked(id) : false
  );

  const handleUseTemplate = useCallback(() => {
    if (!template) return;
    templateStore.markUsed(template.id);
    // Navigate to camera with template context
    router.push({
      pathname: '/(tabs)/camera',
      params: { templateId: template.id, poseId: template.poseId ?? '' },
    });
  }, [template, templateStore]);

  const handleSave = useCallback(async () => {
    if (!id) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (saved) {
      templateStore.unsaveTemplate(id);
      setSaved(false);
      showToast({ message: 'Removed from saved', variant: 'info' });
    } else {
      templateStore.saveTemplate(id);
      setSaved(true);
      showToast({ message: 'Template saved!', variant: 'success' });
    }
  }, [id, saved, templateStore, showToast]);

  const handleLike = useCallback(async () => {
    if (!id) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (liked) {
      templateStore.unlikeTemplate(id);
      setLiked(false);
    } else {
      templateStore.likeTemplate(id);
      setLiked(true);
      showToast({ message: 'Liked!', variant: 'success' });
    }
  }, [id, liked, templateStore, showToast]);

  const [showReportModal, setShowReportModal] = useState(false);

  const handleShare = useCallback(async () => {
    if (!template) return;
    try {
      await Share.share({
        title: template.title,
        message: `Check out this pose template: "${template.title}" on POSEHANUM\n\n${template.description}`,
      });
    } catch {}
  }, [template]);

  const handleRemix = useCallback(() => {
    if (!template) return;
    router.push({
      pathname: '/template-creator',
      params: { remixFromId: template.id },
    });
  }, [template]);

  if (!template) {
    return (
      <View
        style={[
          styles.errorContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={{ color: theme.colors.textPrimary }}>Template not found.</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: Colors.olive }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const relatedTemplates = TEMPLATE_DATASET.filter(
    (t) => t.id !== template.id && t.category === template.category
  ).slice(0, 4);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      {/* Floating back button */}
      <View style={[styles.topBar, { paddingTop: insets.top + 4 }]}>
        <AnimatedPressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: 'rgba(0,0,0,0.45)' }]}
        >
          <SPIcon name="back" size={20} color="#FFF" strokeWidth={2.2} />
        </AnimatedPressable>

        <View style={styles.topActions}>
          <AnimatedPressable
            onPress={handleLike}
            style={[
              styles.iconBtn,
              {
                backgroundColor: liked
                  ? 'rgba(229,57,53,0.85)'
                  : 'rgba(0,0,0,0.45)',
              },
            ]}
          >
            <SPIcon
              name="heart"
              size={18}
              color={liked ? '#FFF' : '#FFF'}
              strokeWidth={2}
            />
          </AnimatedPressable>
          <AnimatedPressable
            onPress={handleShare}
            style={[styles.iconBtn, { backgroundColor: 'rgba(0,0,0,0.45)' }]}
          >
            <SPIcon name="share" size={18} color="#FFF" strokeWidth={2} />
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => setShowReportModal(true)}
            style={[styles.iconBtn, { backgroundColor: 'rgba(0,0,0,0.45)' }]}
          >
            <SPIcon name="sliders" size={16} color="#FFF" strokeWidth={2} />
          </AnimatedPressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={[styles.hero, { height: HERO_HEIGHT }]}>
          <Image
            source={{ uri: template.imageUrl }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          <View style={styles.heroGradient} />

          {/* Badges */}
          <View style={styles.heroBadges}>
            {template.isFeatured && (
              <SPBadge label="FEATURED" variant="primary" />
            )}
            {template.isNew && <SPBadge label="NEW" variant="success" />}
          </View>

          {/* Hero text */}
          <View style={styles.heroContent}>
            <Text style={styles.heroCategory}>
              {template.category.toUpperCase()}
            </Text>
            <Text style={styles.heroTitle}>{template.title}</Text>
            <View style={styles.heroStats}>
              <View style={styles.statItem}>
                <SPIcon name="eye" size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.statText}>
                  {template.views.toLocaleString()}
                </Text>
              </View>
              <View style={styles.statItem}>
                <SPIcon name="heart" size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.statText}>
                  {template.likes.toLocaleString()}
                </Text>
              </View>
              <View style={styles.statItem}>
                <SPIcon name="refresh" size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.statText}>
                  {template.remixCount.toLocaleString()} remixes
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Description */}
          <Animated.Text
            entering={FadeInDown.duration(350)}
            style={[styles.description, { color: theme.colors.textSecondary }]}
          >
            {template.description}
          </Animated.Text>

          {/* Tags */}
          <Animated.View
            entering={FadeInDown.delay(80).duration(350)}
            style={styles.tags}
          >
            {template.tags.map((tag) => (
              <View
                key={tag}
                style={[
                  styles.tag,
                  {
                    backgroundColor: isDark
                      ? 'rgba(101,116,74,0.2)'
                      : 'rgba(101,116,74,0.12)',
                  },
                ]}
              >
                <Text style={[styles.tagText, { color: Colors.olive }]}>
                  #{tag}
                </Text>
              </View>
            ))}
          </Animated.View>

          {/* Pose DNA */}
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Pose DNA
          </Text>
          <SPPoseDNACard poseDna={template.poseDna} poseName={template.poseName} />

          {/* Shot Recipe */}
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.textPrimary, marginTop: Spacing.lg },
            ]}
          >
            Shot Recipe
          </Text>
          <ShotRecipeCard recipe={template.shotRecipe} />

          {/* Instructions */}
          {template.instructions.length > 0 && (
            <InstructionsList
              items={template.instructions}
              label="How to nail this shot"
            />
          )}

          {/* Tips */}
          {template.tips.length > 0 && (
            <InstructionsList items={template.tips} label="Pro Tips" />
          )}

          {/* Creator */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(400)}
            style={[
              styles.creatorCard,
              {
                backgroundColor: isDark
                  ? Colors.darkCardBackground
                  : Colors.surface,
                borderColor: isDark ? Colors.borderDark : Colors.border,
              },
            ]}
          >
            <View style={styles.creatorAvatar}>
              <SPIcon name="portrait" size={20} color={Colors.olive} />
            </View>
            <View style={styles.creatorInfo}>
              <Text style={[styles.creatorName, { color: theme.colors.textPrimary }]}>
                {template.creator.displayName}
              </Text>
              {template.creator.isVerified && (
                <Text style={styles.verifiedBadge}>✓ Verified</Text>
              )}
              <Text
                style={[
                  styles.creatorBio,
                  { color: theme.colors.textSecondary },
                ]}
                numberOfLines={2}
              >
                {template.creator.bio}
              </Text>
            </View>
          </Animated.View>

          {/* Related Templates */}
          {relatedTemplates.length > 0 && (
            <Animated.View
              entering={FadeInDown.delay(500).duration(400)}
              style={styles.relatedSection}
            >
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                More {template.category} templates
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {relatedTemplates.map((t) => (
                  <AnimatedPressable
                    key={t.id}
                    onPress={() =>
                      router.push({ pathname: '/template/[id]', params: { id: t.id } })
                    }
                    style={styles.relatedCard}
                  >
                    <Image
                      source={{ uri: t.thumbnailUrl }}
                      style={styles.relatedImage}
                      resizeMode="cover"
                    />
                    <View style={styles.relatedOverlay} />
                    <Text style={styles.relatedTitle} numberOfLines={2}>
                      {t.title}
                    </Text>
                  </AnimatedPressable>
                ))}
              </ScrollView>
            </Animated.View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <Animated.View
        entering={FadeIn.delay(300)}
        style={[
          styles.stickyActions,
          {
            paddingBottom: insets.bottom + 12,
            backgroundColor: isDark
              ? 'rgba(22,24,20,0.97)'
              : 'rgba(246,241,231,0.97)',
            borderTopColor: isDark ? Colors.borderDark : Colors.border,
          },
        ]}
      >
        <AnimatedPressable
          onPress={handleSave}
          style={[
            styles.saveBtn,
            {
              backgroundColor: saved
                ? Colors.olive
                : isDark
                ? Colors.borderDark
                : Colors.border,
            },
          ]}
        >
          <SPIcon
            name="download"
            size={18}
            color={saved ? '#FFF' : theme.colors.textPrimary}
            strokeWidth={2}
          />
        </AnimatedPressable>

        <AnimatedPressable onPress={handleRemix} style={styles.remixBtn}>
          <SPIcon name="refresh" size={16} color={Colors.olive} strokeWidth={2} />
          <Text style={[styles.remixBtnText, { color: Colors.olive }]}>
            Remix
          </Text>
        </AnimatedPressable>

        <SPButton
          label="Use Template →"
          variant="primary"
          size="md"
          onPress={handleUseTemplate}
          accessibilityLabel="Use Template"
          style={styles.useBtn}
        />
      </Animated.View>

      <SPReportModal
        visible={showReportModal}
        targetId={template.id}
        targetType="template"
        targetTitle={template.title}
        onClose={() => setShowReportModal(false)}
        onSubmit={(reason, _details) => {
          showToast({ message: `Report submitted: ${reason}`, variant: 'info' });
        }}
      />

      <SPToast {...toastProps} />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: { flex: 1 },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  hero: {
    width: SCREEN_WIDTH,
    position: 'relative',
    overflow: 'hidden',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    backgroundImage: undefined,
  },
  heroBadges: {
    position: 'absolute',
    top: 100,
    left: Spacing.md,
    flexDirection: 'row',
    gap: 6,
  },
  heroContent: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.md,
    right: Spacing.md,
  },
  heroCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 8,
    lineHeight: 32,
  },
  heroStats: { flexDirection: 'row', gap: 14 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  content: { padding: Spacing.md },
  description: { fontSize: 14, lineHeight: 22, marginBottom: Spacing.sm },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.lg,
  },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  tagText: { fontSize: 11, fontWeight: '600' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: Spacing.sm,
    letterSpacing: -0.2,
  },
  recipeCard: {
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  recipeHeader: {
    flexDirection: 'row',
    padding: Spacing.sm,
    paddingLeft: Spacing.md,
    backgroundColor: 'rgba(201,154,69,0.08)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(201,154,69,0.2)',
  },
  recipeTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  recipeTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  recipeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 9,
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  recipeLabel: { fontSize: 11, fontWeight: '700', width: 90, marginTop: 1 },
  recipeValue: { fontSize: 12, fontWeight: '500', flex: 1, lineHeight: 18 },
  listSection: { marginVertical: Spacing.md },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  listBullet: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  listBulletText: { fontSize: 11, fontWeight: '800', color: '#FFF' },
  listText: { fontSize: 13, lineHeight: 20, flex: 1 },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginVertical: Spacing.md,
  },
  creatorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(101,116,74,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorInfo: { flex: 1 },
  creatorName: { fontSize: 14, fontWeight: '700' },
  verifiedBadge: { fontSize: 11, color: Colors.olive, fontWeight: '600' },
  creatorBio: { fontSize: 12, marginTop: 2, lineHeight: 17 },
  relatedSection: { marginTop: Spacing.lg },
  relatedCard: {
    width: 150,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    position: 'relative',
  },
  relatedImage: { width: '100%', height: '100%' },
  relatedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  relatedTitle: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
    lineHeight: 16,
  },
  stickyActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  saveBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remixBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: Colors.olive,
  },
  remixBtnText: { fontSize: 13, fontWeight: '700' },
  useBtn: { flex: 1, borderRadius: 22 },
});
