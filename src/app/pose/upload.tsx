/**
 * CustomPoseUploadScreen — User-Uploaded Custom Pose Reference Creation Flow.
 *
 * Flow:
 *  1. Select image from device gallery using native ImagePicker
 *  2. Real on-device 33-landmark analysis & skeleton extraction
 *  3. Visual preview with overlay skeleton & metadata editing
 *  4. Save custom pose with extracted landmarks to local persistent MMKV
 *  5. Direct transition to live Camera assist mode
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { useTheme } from '@/constants/theme';
import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';
import { SPButton } from '@/components/atoms/SPButton';
import { SPToast, useToast } from '@/components/molecules/SPToast';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';
import { useCustomPoseStore } from '@/stores/customPoseStore';
import { SNAP_POSE_CATEGORIES } from '@/features/poses/data/posesData';
import {
  extractStaticPoseLandmarks,
  type StaticPoseExtractionResult,
} from '@/features/ai/infrastructure/StaticLandmarkExtractor';
import { SPSkeletonOverlay } from '@/features/camera/components/SPSkeletonOverlay';
import { SPLoadingSkeleton } from '@/components/molecules/SPLoadingSkeleton';
import { FileUploadValidator } from '@/features/camera/utils/fileUploadValidator';

export default function CustomPoseUploadScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { addCustomPose } = useCustomPoseStore();
  const { toastProps, showToast } = useToast();

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBack();
      return true;
    });
    return () => sub.remove();
  }, [handleBack]);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('street');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractionResult, setExtractionResult] = useState<StaticPoseExtractionResult | null>(null);
  const [showSkeletonPreview, setShowSkeletonPreview] = useState(true);
  const [previewDimensions, setPreviewDimensions] = useState({ width: 320, height: 420 });

  const runRealPoseAnalysis = useCallback(
    async (uri: string, category: string, diff: 'easy' | 'medium' | 'hard') => {
      setIsAnalyzing(true);
      setExtractionResult(null);
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}

      try {
        // Real on-device MediaPipe 33-landmark extraction
        const result = await extractStaticPoseLandmarks(uri, {
          category,
          difficulty: diff,
        });

        setExtractionResult(result);
        setIsAnalyzing(false);

        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {}

        showToast({
          message: `33 Landmarks extracted (${Math.round(result.confidence * 100)}% confidence)`,
          variant: 'success',
        });
      } catch (err: any) {
        setIsAnalyzing(false);
        console.warn('[CustomPoseUpload] Landmark extraction failed:', err);
        showToast({
          message: err?.message || 'Could not extract landmarks from photo.',
          variant: 'error',
        });
      }
    },
    [showToast],
  );

  const handlePickFromGallery = useCallback(async () => {
    try {
      let permissionResult;
      try {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      } catch {
        permissionResult = { granted: true };
      }
      if (!permissionResult.granted) {
        showToast({
          message: 'Photo library permission is required to select a pose reference.',
          variant: 'error',
        });
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.9,
      });

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        const pickedAsset = pickerResult.assets[0];
        
        // Defensive validation against oversized files, bad MIME, path traversal
        const validation = FileUploadValidator.validateImageUpload(
          pickedAsset.uri,
          pickedAsset.fileSize,
          pickedAsset.width,
          pickedAsset.height,
          pickedAsset.mimeType,
        );

        if (!validation.isValid) {
          showToast({
            message: validation.error || 'Invalid photo format or dimensions.',
            variant: 'error',
          });
          return;
        }

        const pickedUri = pickedAsset.uri;
        setImageUri(pickedUri);
        if (!title) {
          setTitle(`Custom Pose #${Math.floor(1000 + Math.random() * 9000)}`);
        }
        runRealPoseAnalysis(pickedUri, selectedCategory, difficulty);
      }
    } catch (err) {
      console.warn('[CustomPoseUpload] Failed to pick photo:', err);
      showToast({
        message: 'Could not access gallery photo.',
        variant: 'error',
      });
    }
  }, [title, selectedCategory, difficulty, runRealPoseAnalysis, showToast]);

  const handleSaveAndUse = useCallback(() => {
    if (!imageUri) {
      showToast({
        message: 'Please select a photo reference first.',
        variant: 'error',
      });
      return;
    }

    const savedPose = addCustomPose({
      title: title.trim() || 'My Custom Pose',
      imageUri,
      category: selectedCategory,
      difficulty,
      landmarks: extractionResult?.normalised ?? undefined,
      estimatedDistance: extractionResult?.detectedPoseType === 'portrait' ? 1.2 : 1.8,
      cameraAngle: 'Eye Level',
      lighting: 'Natural Light',
      overlayTransform: {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        opacity: 55,
        mirrored: false,
        locked: false,
      },
    });

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    showToast({
      message: 'Custom pose created! Opening in camera...',
      variant: 'success',
    });

    setTimeout(() => {
      router.push({
        pathname: '/(tabs)/camera',
        params: { poseId: savedPose.id },
      });
    }, 350);
  }, [imageUri, title, selectedCategory, difficulty, extractionResult, addCustomPose, showToast]);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <AnimatedPressable
          onPress={handleBack}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <SPIcon name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </AnimatedPressable>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          Upload Custom Pose
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Gallery Pick Card */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.previewContainer}>
          {imageUri ? (
            <View
              style={[styles.imageWrapper, { borderColor: theme.colors.olive }]}
              onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                setPreviewDimensions({ width, height });
              }}
            >
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />

              {/* Real Skeleton Overlay Preview */}
              {extractionResult && showSkeletonPreview && (
                <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
                  <SPSkeletonOverlay
                    landmarks={extractionResult.normalised}
                    poseScore={{
                      total: 92,
                      regional: {
                        shoulders: 95,
                        arms: 90,
                        hands: 88,
                        torso: 96,
                        legs: 92,
                        head: 98,
                        feet: 85,
                      },
                    }}
                    containerWidth={previewDimensions.width}
                    containerHeight={previewDimensions.height}
                    guidanceCue={null}
                  />
                </View>
              )}

              {/* Holographic AR Skeleton Analysis Loader */}
              {isAnalyzing && (
                <View style={StyleSheet.absoluteFillObject}>
                  <SPLoadingSkeleton
                    mode="ar_overlay"
                    width={previewDimensions.width}
                    height={previewDimensions.height}
                    label="Extracting 33 Skeletal Landmarks..."
                  />
                </View>
              )}

              {/* Extraction Success Badge */}
              {extractionResult && !isAnalyzing && (
                <View style={[styles.detectedBadge, { borderColor: Colors.scoreGreen }]}>
                  <SPIcon name="checkmark-circle" size={16} color={Colors.scoreGreen} />
                  <Text style={[styles.detectedText, { color: Colors.scoreGreen }]}>
                    33 Landmarks Extracted ({extractionResult.detectedPoseType})
                  </Text>
                </View>
              )}

              {/* Action Buttons on Image */}
              <View style={styles.overlayControlsRow}>
                {extractionResult && (
                  <AnimatedPressable
                    onPress={() => setShowSkeletonPreview((v) => !v)}
                    style={[styles.miniGlassBtn, !showSkeletonPreview && { opacity: 0.6 }]}
                    accessibilityLabel="Toggle skeleton preview"
                  >
                    <SPIcon name={showSkeletonPreview ? 'eye' : 'eye-off'} size={16} color="#FFFFFF" />
                    <Text style={styles.miniGlassText}>Skeleton</Text>
                  </AnimatedPressable>
                )}

                <AnimatedPressable
                  onPress={handlePickFromGallery}
                  style={styles.miniGlassBtn}
                  accessibilityLabel="Choose a different photo"
                >
                  <SPIcon name="refresh" size={16} color="#FFFFFF" />
                  <Text style={styles.miniGlassText}>Change</Text>
                </AnimatedPressable>
              </View>
            </View>
          ) : (
            <AnimatedPressable
              onPress={handlePickFromGallery}
              style={[styles.dropZone, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
              accessibilityLabel="Select a photo from your gallery"
            >
              <View style={styles.dropZoneIcon}>
                <SPIcon name="image" size={40} color={theme.colors.olive} />
              </View>
              <Text style={[styles.dropZoneTitle, { color: theme.colors.textPrimary }]}>
                Choose Pose from Gallery
              </Text>
              <Text style={[styles.dropZoneSubtitle, { color: theme.colors.textSecondary }]}>
                Select any photo or reference from your gallery or saved images to extract the 33-landmark pose skeleton.
              </Text>
              <View style={[styles.selectButton, { backgroundColor: theme.colors.olive }]}>
                <Text style={styles.selectButtonText}>SELECT PHOTO</Text>
              </View>
            </AnimatedPressable>
          )}
        </Animated.View>

        {/* Metadata Editor */}
        {imageUri && (
          <Animated.View entering={FadeInUp.duration(400)} style={styles.formContainer}>
            {/* Title Input */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>POSE TITLE</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. My Favorite Rooftop Pose"
                placeholderTextColor={theme.colors.textDisabled}
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    color: theme.colors.textPrimary,
                  },
                ]}
              />
            </View>

            {/* Category Selector */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>CATEGORY</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {SNAP_POSE_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <AnimatedPressable
                      key={cat.id}
                      onPress={() => {
                        setSelectedCategory(cat.id);
                        if (imageUri) {
                          runRealPoseAnalysis(imageUri, cat.id, difficulty);
                        }
                      }}
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor: isSelected ? theme.colors.olive : theme.colors.surface,
                          borderColor: isSelected ? theme.colors.olive : theme.colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          {
                            color: isSelected ? '#FFFFFF' : theme.colors.textSecondary,
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
            </View>

            {/* Difficulty Level */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>DIFFICULTY</Text>
              <View style={styles.difficultyRow}>
                {(['easy', 'medium', 'hard'] as const).map((lvl) => {
                  const isSelected = difficulty === lvl;
                  return (
                    <AnimatedPressable
                      key={lvl}
                      onPress={() => {
                        setDifficulty(lvl);
                        if (imageUri) {
                          runRealPoseAnalysis(imageUri, selectedCategory, lvl);
                        }
                      }}
                      style={[
                        styles.difficultyChip,
                        {
                          backgroundColor: isSelected ? theme.colors.olive : theme.colors.surface,
                          borderColor: isSelected ? theme.colors.olive : theme.colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.difficultyText,
                          {
                            color: isSelected ? '#FFFFFF' : theme.colors.textSecondary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {lvl.toUpperCase()}
                      </Text>
                    </AnimatedPressable>
                  );
                })}
              </View>
            </View>

            {/* CTA Button */}
            <SPButton
              label="SAVE & USE IN CAMERA"
              variant="primary"
              size="lg"
              onPress={handleSaveAndUse}
              disabled={isAnalyzing}
              accessibilityLabel="Save custom pose and open in camera viewfinder"
              style={styles.saveButton}
            />
          </Animated.View>
        )}
      </ScrollView>

      <SPToast {...toastProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  previewContainer: {
    marginBottom: Spacing.lg,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 14, 12, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  analyzingText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detectedBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(10, 14, 12, 0.85)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.avatar,
    borderWidth: 1,
  },
  detectedText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    textTransform: 'uppercase',
  },
  overlayControlsRow: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  miniGlassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(10, 14, 12, 0.85)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.avatar,
    borderWidth: 1,
    borderColor: '#FFFFFF40',
  },
  miniGlassText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
  },
  dropZone: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: BorderRadius.card,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  dropZoneIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(101, 116, 74, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  dropZoneTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  dropZoneSubtitle: {
    fontSize: Typography.sizes.caption,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  selectButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs + 4,
    borderRadius: BorderRadius.avatar,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
  },
  formContainer: {
    gap: Spacing.md,
  },
  fieldGroup: {
    gap: Spacing.xs,
  },
  fieldLabel: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.sizes.body,
  },
  categoryScroll: {
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.avatar,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: Typography.sizes.caption,
    textTransform: 'uppercase',
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  difficultyChip: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  difficultyText: {
    fontSize: Typography.sizes.caption,
    letterSpacing: 1,
  },
  saveButton: {
    marginTop: Spacing.sm,
    width: '100%',
  },
});
