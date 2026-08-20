/**
 * Pose3DStudioScreen — 3D Pose Studio & Perspective Inspector.
 *
 * Allows users to:
 *  - Rotate reference pose around Y & X axes with gesture pan
 *  - Zoom and inspect anatomical joint alignment from multiple camera angles
 *  - Compare with 2D reference photo
 *  - Launch directly into Camera Assist Mode
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { useTheme } from '@/constants/theme';
import {
  BorderRadius,
  Spacing,
  Typography,
} from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';
import { SPButton } from '@/components/atoms/SPButton';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';
import { SNAP_POSE_DATASET } from '@/features/poses/data/posesData';
import { useCustomPoseStore } from '@/stores/customPoseStore';
import { getPoseImageSource } from '@/utils/imageUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CAMERA_ANGLES = [
  { label: 'Front (0°)', rotY: 0, rotX: 0 },
  { label: '3/4 Turn (25°)', rotY: 25, rotX: 5 },
  { label: 'Profile (60°)', rotY: 60, rotX: 0 },
  { label: 'Low Angle', rotY: 15, rotX: -20 },
];

export default function Pose3DStudioScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { customPoses } = useCustomPoseStore();

  const [activeAngleIdx, setActiveAngleIdx] = useState(1);
  const [viewMode, setViewMode] = useState<'3d' | 'reference'>('3d');

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

  const pose = useMemo(() => {
    const standard = SNAP_POSE_DATASET.find((p) => p.id === id);
    if (standard) return standard;
    const custom = customPoses.find((p) => p.id === id);
    if (custom) {
      return {
        id: custom.id,
        title: custom.title,
        category: custom.category,
        imageUrl: custom.imageUri,
        difficulty: custom.difficulty,
        estimatedDistance: custom.estimatedDistance ?? 1.8,
        cameraAngle: custom.cameraAngle ?? 'Eye Level',
        lighting: custom.lighting ?? 'Natural',
        indoor: false,
        tags: ['custom'],
        views: 1,
        downloads: 0,
        favorites: 0,
        orientation: 'portrait' as const,
        createdAt: new Date(custom.createdAt).toISOString(),
        updatedAt: new Date(custom.createdAt).toISOString(),
        categoryId: 'custom',
        description: 'User-created custom pose reference.',
        overlayImage: '',
        thumbnailUrl: custom.imageUri,
      };
    }
    return SNAP_POSE_DATASET[0];
  }, [id, customPoses]);

  const rotationY = useSharedValue(25);
  const rotationX = useSharedValue(5);
  const scale = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      rotationY.value = e.translationX * 0.4 + 25;
      rotationX.value = -e.translationY * 0.3 + 5;
    })
    .onEnd(() => {
      // Retain position
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(0.75, Math.min(e.scale, 1.4));
    })
    .onEnd(() => {
      scale.value = withSpring(1);
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const modelAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 800 },
        { rotateY: `${rotationY.value}deg` },
        { rotateX: `${rotationX.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  const selectAngle = (idx: number) => {
    setActiveAngleIdx(idx);
    const angle = CAMERA_ANGLES[idx];
    rotationY.value = withSpring(angle.rotY);
    rotationX.value = withSpring(angle.rotX);
  };

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
          <SPIcon name="arrowLeft" size={24} color={theme.colors.textPrimary} />
        </AnimatedPressable>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>3D Pose Studio</Text>
        <AnimatedPressable
          onPress={() => setViewMode((prev) => (prev === '3d' ? 'reference' : '3d'))}
          style={[styles.modeToggle, { backgroundColor: `${theme.colors.olive}20`, borderColor: theme.colors.olive }]}
          accessibilityLabel="Toggle between 3D view and 2D reference"
        >
          <Text style={[styles.modeToggleText, { color: theme.colors.olive }]}>{viewMode === '3d' ? '2D REF' : '3D VIEW'}</Text>
        </AnimatedPressable>
      </View>

      {/* Main 3D Canvas Box */}
      <View style={styles.canvasContainer}>
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={[styles.canvasBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.olive }]}>
            {viewMode === '3d' ? (
              <Animated.View style={[styles.modelContainer, modelAnimatedStyle]}>
                <Image source={getPoseImageSource(pose.imageUrl)} style={styles.poseImage} resizeMode="cover" />

                {/* 3D Ring Floor Plate */}
                <View style={[styles.floorRing, { borderColor: `${theme.colors.oliveDark}60` }]} />
              </Animated.View>
            ) : (
              <Image source={getPoseImageSource(pose.imageUrl)} style={styles.flatReferenceImage} resizeMode="contain" />
            )}

            {/* Canvas HUD Overlay */}
            <View style={styles.canvasHud}>
              <View style={[styles.hudBadge, { borderColor: theme.colors.olive }]}>
                <SPIcon name="refresh" size={12} color={theme.colors.olive} />
                <Text style={[styles.hudBadgeText, { color: theme.colors.olive }]}>360° INSPECT</Text>
              </View>

              <Text style={styles.hudHint}>Drag to rotate • Pinch to zoom</Text>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>

      {/* Angle Selector Bar */}
      <View style={styles.controlsContainer}>
        <Text style={[styles.controlLabel, { color: theme.colors.textSecondary }]}>PRESET CAMERA PERSPECTIVES</Text>
        <View style={styles.anglesRow}>
          {CAMERA_ANGLES.map((ang, idx) => (
            <AnimatedPressable
              key={ang.label}
              onPress={() => selectAngle(idx)}
              style={[
                styles.angleButton,
                {
                  backgroundColor: activeAngleIdx === idx ? theme.colors.olive : theme.colors.surface,
                  borderColor: activeAngleIdx === idx ? theme.colors.olive : theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.angleButtonText,
                  { color: activeAngleIdx === idx ? '#FFFFFF' : theme.colors.textPrimary },
                ]}
              >
                {ang.label}
              </Text>
            </AnimatedPressable>
          ))}
        </View>

        {/* Pose Details Summary */}
        <View style={[styles.poseSummaryCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View>
            <Text style={[styles.poseTitleText, { color: theme.colors.textPrimary }]}>{pose.title}</Text>
            <Text style={[styles.poseSubtitleText, { color: theme.colors.textSecondary }]}>
              {pose.category} • {pose.cameraAngle} • {pose.estimatedDistance}m Distance
            </Text>
          </View>
        </View>

        {/* Use In Camera CTA */}
        <SPButton
          label="USE THIS POSE IN CAMERA"
          variant="primary"
          size="lg"
          onPress={() => {
            router.push({
              pathname: '/(tabs)/camera',
              params: { poseId: pose.id },
            });
          }}
          accessibilityLabel="Launch camera with this pose"
          style={styles.ctaButton}
        />
      </View>
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
  modeToggle: {
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.avatar,
    borderWidth: 1,
  },
  modeToggleText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
  },
  canvasContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasBox: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.card,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  modelContainer: {
    width: SCREEN_WIDTH * 0.65,
    height: SCREEN_WIDTH * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  poseImage: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.card,
  },
  flatReferenceImage: {
    width: '100%',
    height: '100%',
  },
  floorRing: {
    position: 'absolute',
    bottom: -20,
    width: SCREEN_WIDTH * 0.75,
    height: 60,
    borderRadius: 60,
    borderWidth: 1.5,
    transform: [{ rotateX: '75deg' }],
  },
  canvasHud: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hudBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(10, 14, 12, 0.85)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.avatar,
    borderWidth: 1,
  },
  hudBadgeText: {
    fontSize: Typography.sizes.caption - 2,
    fontWeight: Typography.weights.bold,
  },
  hudHint: {
    color: '#9CA3AF',
    fontSize: Typography.sizes.caption - 2,
    fontWeight: Typography.weights.medium,
    backgroundColor: 'rgba(10, 14, 12, 0.85)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.avatar,
  },
  controlsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  controlLabel: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
  },
  anglesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  angleButton: {
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  angleButtonText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
  },
  poseSummaryCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
  },
  poseTitleText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    textTransform: 'uppercase',
  },
  poseSubtitleText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium,
    marginTop: 2,
  },
  ctaButton: {
    marginTop: Spacing.xs,
    width: '100%',
  },
});
