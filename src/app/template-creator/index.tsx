/**
 * Template Creator Screen — POSEHANUM
 *
 * Create or remix a template:
 *  - Reference image picker (gallery or URL)
 *  - Pose selector from existing SNAP_POSE_DATASET
 *  - Metadata: name, description, category, difficulty, vibe, tags
 *  - Publish or Save Draft
 *
 * When launched with remixFromId param, pre-fills from source template.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/constants/theme';
import { BorderRadius, Colors, Spacing } from '@/constants/designTokens';
import { SPButton } from '@/components/atoms/SPButton';
import { SPIcon } from '@/components/atoms/SPIcon';
import { SPToast, useToast } from '@/components/molecules/SPToast';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';

import { SNAP_POSE_DATASET } from '@/features/poses/data/posesData';
import { getTemplateById } from '@/features/templates/data/templateData';
import { useTemplateStore } from '@/features/templates/stores/templateStore';
import { useAuthStore } from '@/stores/authStore';
import type { Template, TemplateCategory, TemplateVibe } from '@/features/templates/types';
import type { Difficulty } from '@/features/poses/types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORIES: TemplateCategory[] = [
  'trending','couple','meme','beach','cafe','nature','trek','selfie','gym',
  'fashion','wedding','festival','travel','cinematic','editorial','street',
  'portrait','golden-hour','night','solo','group',
];

const VIBES: TemplateVibe[] = [
  'confident','relaxed','dramatic','playful','elegant','dynamic','minimal',
  'romantic','editorial','cinematic',
];

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

// ---------------------------------------------------------------------------
// Section header
// ---------------------------------------------------------------------------

function SectionLabel({ label }: { label: string }) {
  const { theme } = useTheme();
  return (
    <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
      {label}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// Chip picker
// ---------------------------------------------------------------------------

function ChipPicker<T extends string>({
  options,
  value,
  onSelect,
}: {
  options: T[];
  value: T;
  onSelect: (v: T) => void;
}) {
  const { theme } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <AnimatedPressable
            key={opt}
            onPress={() => onSelect(opt)}
            style={[
              styles.chip,
              {
                backgroundColor: active
                  ? Colors.olive
                  : theme.mode === 'dark'
                  ? Colors.borderDark
                  : Colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: active ? '#FFF' : theme.colors.textPrimary },
              ]}
            >
              {opt}
            </Text>
          </AnimatedPressable>
        );
      })}
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

export default function TemplateCreatorScreen() {
  const { remixFromId } = useLocalSearchParams<{ remixFromId?: string }>();
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';
  const insets = useSafeAreaInsets();
  const { toastProps, showToast } = useToast();
  const templateStore = useTemplateStore();
  const user = useAuthStore((s) => s.user);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedPoseId, setSelectedPoseId] = useState<string | undefined>();
  const [category, setCategory] = useState<TemplateCategory>('trending');
  const [vibe, setVibe] = useState<TemplateVibe>('confident');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [tagsInput, setTagsInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [posePickerOpen, setPosePickerOpen] = useState(false);

  // Pre-fill from remix source
  useEffect(() => {
    if (!remixFromId) return;
    const source = getTemplateById(remixFromId);
    if (!source) return;
    setTitle(`Remix of ${source.title}`);
    setDescription(source.description);
    setImageUri(source.imageUrl);
    setSelectedPoseId(source.poseId);
    setCategory(source.category);
    setVibe(source.vibe);
    setDifficulty(source.difficulty);
    setTagsInput(source.tags.join(', '));
  }, [remixFromId]);

  const handlePickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }, []);

  const buildTemplate = useCallback(
    (status: 'published' | 'draft'): Template => {
      const selectedPose = selectedPoseId
        ? SNAP_POSE_DATASET.find((p) => p.id === selectedPoseId)
        : undefined;
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const now = new Date().toISOString();

      return {
        id: `tpl-user-${Date.now()}`,
        title: title.trim() || 'Untitled Template',
        description: description.trim(),
        imageUrl: imageUri || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
        thumbnailUrl: imageUri || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        poseId: selectedPoseId,
        poseName: selectedPose?.title ?? 'Custom Pose',
        poseDna: selectedPose?.poseDna ?? {
          energy: 'confident',
          body: 'front',
          head: 'straight',
          hands: 'relaxed',
          legs: 'straight',
          camera: 'eye level',
          distance: '2m',
          framing: 'full body',
          light: 'face toward light',
          environment: 'outdoor',
          difficulty,
          style: vibe,
          motionLevel: 'static',
        },
        shotRecipe: {
          pose: selectedPose?.title ?? title,
          cameraAngle: selectedPose?.poseDna?.camera ?? 'Eye level',
          cameraDistance: selectedPose?.poseDna?.distance ?? '2m',
          lighting: selectedPose?.poseDna?.light ?? 'Natural light',
          expression: 'Natural',
          background: 'Choose your own',
          composition: 'Rule of thirds',
        },
        instructions: selectedPose?.instructions ?? [],
        tips: selectedPose?.tips ?? [],
        category,
        tags,
        difficulty,
        vibe,
        occasion: category,
        creator: {
          uid: user?.uid ?? 'local_user',
          username: user?.displayName ?? 'You',
          displayName: user?.displayName ?? 'You',
          avatarUrl: user?.photoURL ?? null,
          bio: '',
          isVerified: false,
          templateCount: templateStore.userCreatedTemplates.length + 1,
          followerCount: 0,
          totalUses: 0,
        },
        isUserCreated: true,
        textLayers: [],
        stickerLayers: [],
        views: 0,
        uses: 0,
        likes: 0,
        shares: 0,
        remixCount: 0,
        isFeatured: false,
        isNew: true,
        status,
        remixedFromId: remixFromId,
        createdAt: now,
        updatedAt: now,
      };
    },
    [title, description, imageUri, selectedPoseId, category, vibe, difficulty, tagsInput, user, templateStore, remixFromId]
  );

  const handlePublish = useCallback(async () => {
    if (!title.trim()) {
      showToast({ message: 'Please add a title', variant: 'error' });
      return;
    }
    setIsSaving(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const template = buildTemplate('published');
    templateStore.saveUserCreatedTemplate(template);
    import('@/stores/onboardingChecklistStore').then(({ useOnboardingChecklistStore }) => {
      useOnboardingChecklistStore.getState().markCompleted('create_template');
    });
    import('@/services/analytics/PostHogAnalyticsService').then(({ postHogAnalytics }) => {
      postHogAnalytics.track('template_created', { templateId: template.id, title: template.title });
    });
    setIsSaving(false);
    showToast({ message: 'Template published!', variant: 'success' });
    setTimeout(() => router.back(), 800);
  }, [title, buildTemplate, templateStore, showToast]);

  const handleSaveDraft = useCallback(async () => {
    const template = buildTemplate('draft');
    templateStore.saveDraft(template);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    showToast({ message: 'Draft saved', variant: 'info' });
    setTimeout(() => router.back(), 600);
  }, [buildTemplate, templateStore, showToast]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
          {/* Header */}
          <View
            style={[
              styles.header,
              {
                paddingTop: insets.top + 4,
                backgroundColor: theme.colors.background,
                borderBottomColor: isDark ? Colors.borderDark : Colors.border,
              },
            ]}
          >
            <Pressable onPress={() => router.back()} style={styles.headerBack}>
              <SPIcon name="back" size={20} color={theme.colors.textPrimary} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
              {remixFromId ? 'Remix Template' : 'Create Template'}
            </Text>
            <Pressable onPress={handleSaveDraft} style={styles.draftBtn}>
              <Text style={[styles.draftBtnText, { color: Colors.olive }]}>
                Draft
              </Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={{ padding: Spacing.md, paddingBottom: insets.bottom + 120 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Image Picker */}
            <Animated.View entering={FadeInDown.duration(350)}>
              <SectionLabel label="REFERENCE IMAGE" />
              <AnimatedPressable onPress={handlePickImage} style={styles.imagePicker}>
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imagePickerPlaceholder}>
                    <SPIcon name="camera" size={32} color={Colors.muted} />
                    <Text style={[styles.imagePickerText, { color: Colors.muted }]}>
                      Tap to add reference image
                    </Text>
                  </View>
                )}
                <View
                  style={[
                    styles.imagePickerOverlay,
                    { backgroundColor: imageUri ? 'rgba(0,0,0,0.25)' : 'transparent' },
                  ]}
                />
                {imageUri && (
                  <View style={styles.changeImageBtn}>
                    <SPIcon name="camera" size={14} color="#FFF" />
                    <Text style={styles.changeImageText}>Change</Text>
                  </View>
                )}
              </AnimatedPressable>
            </Animated.View>

            {/* Title */}
            <Animated.View entering={FadeInDown.delay(80).duration(350)}>
              <SectionLabel label="TEMPLATE TITLE" />
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.textPrimary,
                    backgroundColor: isDark ? Colors.darkCardBackground : Colors.surface,
                    borderColor: isDark ? Colors.borderDark : Colors.border,
                  },
                ]}
                placeholder="Give your template a name..."
                placeholderTextColor={Colors.muted}
                value={title}
                onChangeText={setTitle}
                maxLength={80}
              />
            </Animated.View>

            {/* Description */}
            <Animated.View entering={FadeInDown.delay(120).duration(350)}>
              <SectionLabel label="DESCRIPTION" />
              <TextInput
                style={[
                  styles.input,
                  styles.inputMultiline,
                  {
                    color: theme.colors.textPrimary,
                    backgroundColor: isDark ? Colors.darkCardBackground : Colors.surface,
                    borderColor: isDark ? Colors.borderDark : Colors.border,
                  },
                ]}
                placeholder="Describe the vibe, setting, and how to nail it..."
                placeholderTextColor={Colors.muted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                maxLength={300}
              />
            </Animated.View>

            {/* Category */}
            <Animated.View entering={FadeInDown.delay(160).duration(350)}>
              <SectionLabel label="CATEGORY" />
              <ChipPicker
                options={CATEGORIES}
                value={category}
                onSelect={setCategory}
              />
            </Animated.View>

            {/* Vibe */}
            <Animated.View entering={FadeInDown.delay(200).duration(350)}>
              <SectionLabel label="VIBE" />
              <ChipPicker options={VIBES} value={vibe} onSelect={setVibe} />
            </Animated.View>

            {/* Difficulty */}
            <Animated.View entering={FadeInDown.delay(240).duration(350)}>
              <SectionLabel label="DIFFICULTY" />
              <ChipPicker
                options={DIFFICULTIES}
                value={difficulty}
                onSelect={setDifficulty}
              />
            </Animated.View>

            {/* Tags */}
            <Animated.View entering={FadeInDown.delay(280).duration(350)}>
              <SectionLabel label="TAGS (comma separated)" />
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.textPrimary,
                    backgroundColor: isDark ? Colors.darkCardBackground : Colors.surface,
                    borderColor: isDark ? Colors.borderDark : Colors.border,
                  },
                ]}
                placeholder="beach, sunset, couple, romantic..."
                placeholderTextColor={Colors.muted}
                value={tagsInput}
                onChangeText={setTagsInput}
                maxLength={200}
              />
            </Animated.View>

            {/* Pose Selector */}
            <Animated.View entering={FadeInDown.delay(320).duration(350)}>
              <SectionLabel label="REFERENCE POSE (optional)" />
              <AnimatedPressable
                onPress={() => setPosePickerOpen(!posePickerOpen)}
                style={[
                  styles.poseSelector,
                  {
                    backgroundColor: isDark ? Colors.darkCardBackground : Colors.surface,
                    borderColor: isDark ? Colors.borderDark : Colors.border,
                  },
                ]}
              >
                <SPIcon name="portrait" size={16} color={Colors.olive} />
                <Text style={[styles.poseSelectorText, { color: theme.colors.textPrimary }]}>
                  {selectedPoseId
                    ? SNAP_POSE_DATASET.find((p) => p.id === selectedPoseId)?.title ??
                      'Selected'
                    : 'Select a reference pose...'}
                </Text>
                <SPIcon
                  name="arrowDown"
                  size={14}
                  color={Colors.muted}
                />
              </AnimatedPressable>

              {posePickerOpen && (
                <Animated.View
                  entering={FadeIn.duration(200)}
                  style={[
                    styles.poseList,
                    {
                      backgroundColor: isDark ? Colors.darkCardBackground : Colors.surface,
                      borderColor: isDark ? Colors.borderDark : Colors.border,
                    },
                  ]}
                >
                  <ScrollView style={{ maxHeight: 250 }} nestedScrollEnabled>
                    {SNAP_POSE_DATASET.slice(0, 30).map((pose) => (
                      <AnimatedPressable
                        key={pose.id}
                        onPress={() => {
                          setSelectedPoseId(pose.id);
                          setPosePickerOpen(false);
                        }}
                        style={[
                          styles.poseListItem,
                          {
                            backgroundColor:
                              selectedPoseId === pose.id
                                ? 'rgba(101,116,74,0.12)'
                                : 'transparent',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.poseListItemText,
                            {
                              color:
                                selectedPoseId === pose.id
                                  ? Colors.olive
                                  : theme.colors.textPrimary,
                              fontWeight:
                                selectedPoseId === pose.id ? '700' : '400',
                            },
                          ]}
                        >
                          {pose.title}
                        </Text>
                        <Text
                          style={[
                            styles.poseListItemSub,
                            { color: theme.colors.textSecondary },
                          ]}
                        >
                          {pose.categoryId}
                        </Text>
                      </AnimatedPressable>
                    ))}
                  </ScrollView>
                </Animated.View>
              )}
            </Animated.View>
          </ScrollView>

          {/* Sticky bottom */}
          <Animated.View
            entering={FadeIn.delay(400)}
            style={[
              styles.stickyBottom,
              {
                paddingBottom: insets.bottom + 12,
                backgroundColor: isDark
                  ? 'rgba(22,24,20,0.97)'
                  : 'rgba(246,241,231,0.97)',
                borderTopColor: isDark ? Colors.borderDark : Colors.border,
              },
            ]}
          >
            <SPButton
              label={isSaving ? 'Publishing...' : 'Publish Template'}
              variant="primary"
              size="lg"
              onPress={handlePublish}
              disabled={isSaving}
              accessibilityLabel="Publish Template"
              style={{ flex: 1, borderRadius: 22 }}
            />
          </Animated.View>

          <SPToast {...toastProps} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBack: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', flex: 1 },
  draftBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  draftBtnText: { fontSize: 14, fontWeight: '700' },
  scroll: { flex: 1 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: Spacing.md,
  },
  imagePicker: {
    width: '100%',
    height: 220,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imagePickerPlaceholder: { alignItems: 'center', gap: 8 },
  imagePickerText: { fontSize: 13, fontWeight: '500' },
  imagePickerOverlay: { ...StyleSheet.absoluteFillObject },
  changeImageBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  changeImageText: { fontSize: 11, color: '#FFF', fontWeight: '600' },
  input: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 4,
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  chipRow: { marginBottom: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  poseSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  poseSelectorText: { fontSize: 14, flex: 1 },
  poseList: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginTop: 4,
    overflow: 'hidden',
  },
  poseListItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  poseListItemText: { fontSize: 13 },
  poseListItemSub: { fontSize: 11, marginTop: 2 },
  stickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingTop: 12,
    borderTopWidth: 1,
  },
});
