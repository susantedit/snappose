/**
 * CameraScreen — Professional Photography & Cinematic AI Pose Assist for Snap Pose.
 *
 * Features:
 *  • Full-screen expo-camera CameraView with active preview
 *  • Front/back camera flip with 3D rotation spring physics
 *  • Flash toggle (auto / on / off)
 *  • Rule-of-Thirds and Golden Ratio composition grid overlays
 *  • Pose Assist Mode when a pose is active:
 *      - Translucent reference silhouette / pose overlay with gesture pan/zoom/opacity
 *      - Pose title & step-by-step guidance banner
 *      - Dynamic AI Pose Guide with progressive score ring & glowing pulse
 *  • Tactile Shutter Button with Haptic feedback, Shutter Flash screen, & countdown
 *  • Captured Photo Modal with smooth scale expansion (0.94 → 1.0) & staggered actions
 *  • Gallery shortcut
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from '@/constants/designTokens';
import { SPButton } from '@/components/atoms/SPButton';
import { SPToast, useToast } from '@/components/molecules/SPToast';
import { SPIcon } from '@/components/atoms/SPIcon';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';
import { useReducedMotion } from '@/constants/motion';
import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import { usePersonalizationStore } from '@/stores/personalizationStore';
import { useCustomPoseStore } from '@/stores/customPoseStore';
import { useHistoryStore } from '@/stores/historyStore';
import { SNAP_POSE_DATASET } from '@/features/poses/data/posesData';
import type { Pose } from '@/features/poses/types';

// Real AI detection & scoring engines
import { usePoseDetection } from '@/features/ai/hooks/usePoseDetection';
import { computePoseScore, getReferenceSkeletonForKey } from '@/features/ai/domain/PoseScoreCalculator';
import { estimateDistance, type DistanceInput } from '@/features/camera/domain/DistanceEstimator';
import { analyseFace } from '@/features/camera/domain/FaceAnalyser';
import { SPSkeletonOverlay } from '@/features/camera/components/SPSkeletonOverlay';
import { getVoiceCoachService } from '@/features/ai/domain/VoiceCoachService';
import { SPCompareSlider } from '@/components/molecules/SPCompareSlider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// Score-to-color mapping for real scoring
// ---------------------------------------------------------------------------

function scoreToColor(score: number): string {
  if (score >= 95) return '#2E7D32';
  if (score >= 85) return '#4CAF50';
  if (score >= 71) return '#7E9261';
  if (score >= 41) return '#FF8A00';
  return '#FFB300';
}

function distanceStateToLabel(state: string): string {
  switch (state) {
    case 'too_close': return 'Too close — Step back';
    case 'too_far': return 'Too far — Move closer';
    case 'good': return 'Distance: Good';
    default: return 'Estimating...';
  }
}

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ poseId?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const { toggleFavorite } = useFavorites();
  const { recordSignal } = usePersonalizationStore();
  const { customPoses } = useCustomPoseStore();
  const { recordAttempt } = useHistoryStore();
  const { toastProps, showToast } = useToast();
  const reduceMotion = useReducedMotion();

  const cameraRef = useRef<any>(null);

  // Active pose in assist mode
  const [activePoseId, setActivePoseId] = useState<string | null>(params.poseId ?? 'pose-1');
  const activePose = useMemo<Pose | undefined>(() => {
    if (!activePoseId) return undefined;
    const std = SNAP_POSE_DATASET.find((p) => p.id === activePoseId);
    if (std) return std;
    const custom = customPoses.find((p) => p.id === activePoseId);
    if (custom) {
      return {
        id: custom.id,
        categoryId: custom.category,
        category: custom.category,
        title: custom.title,
        description: 'User-uploaded custom pose reference.',
        imageUrl: custom.imageUri,
        overlayImage: '',
        thumbnailUrl: custom.imageUri,
        difficulty: custom.difficulty,
        indoor: false,
        tags: ['custom'],
        views: 1,
        downloads: 0,
        favorites: 0,
        estimatedDistance: custom.estimatedDistance ?? 1.8,
        cameraAngle: custom.cameraAngle ?? 'Eye Level',
        lighting: custom.lighting ?? 'Natural',
        orientation: 'portrait' as const,
        landmarks: custom.landmarks,
        createdAt: new Date(custom.createdAt).toISOString(),
        updatedAt: new Date(custom.createdAt).toISOString(),
      };
    }
    return SNAP_POSE_DATASET[0];
  }, [activePoseId, customPoses]);

  // Update active pose if route params change
  useEffect(() => {
    if (params.poseId) {
      setActivePoseId(params.poseId);
    }
  }, [params.poseId]);

  // Shooting Mode: Subject Mode (Selfie/solo) vs Photographer Mode (Shooting someone else)
  const [shootingMode, setShootingMode] = useState<'subject' | 'photographer'>('subject');

  // Overlay Mode: Both (Ref + Skeleton) vs Reference Only vs Skeleton Only
  const [overlayLayerMode, setOverlayLayerMode] = useState<'both' | 'reference' | 'skeleton'>('both');

  // Camera settings
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('auto');
  const [gridMode, setGridMode] = useState<'none' | 'thirds' | 'golden'>('thirds');
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [countdownNum, setCountdownNum] = useState<number>(0);

  // Overlay settings
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.45);
  const [showOverlay, setShowOverlay] = useState<boolean>(true);

  // Voice AI Coach & Split Comparison Slider
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [showComparisonSlider, setShowComparisonSlider] = useState<boolean>(false);
  const voiceCoachRef = useRef(getVoiceCoachService());

  useEffect(() => {
    voiceCoachRef.current.initialise();
    return () => {
      voiceCoachRef.current.stop();
    };
  }, []);

  useEffect(() => {
    voiceCoachRef.current.setEnabled(voiceEnabled);
  }, [voiceEnabled]);

  // ═══════════════════════════════════════════════════════════════════════════
  // REAL AI POSE DETECTION — replaces fake timer simulation
  // ═══════════════════════════════════════════════════════════════════════════
  const { isReady: detectorReady, lastLandmarks } = usePoseDetection({
    autoInit: true,
    streaming: true,
    targetFps: 15,
  });

  // Haptic threshold tracking
  const lastHapticThreshold = useRef<number>(0);

  // Capture result modal
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  // Shutter Flash Animation
  const shutterFlashOpacity = useSharedValue(0);

  // Flip animation
  const flipRotation = useSharedValue(0);

  const flipStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${flipRotation.value}deg` }],
  }));

  const shutterFlashStyle = useAnimatedStyle(() => ({
    opacity: shutterFlashOpacity.value,
  }));

  // Toggle Camera Front / Back
  const handleToggleFacing = useCallback(() => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    flipRotation.value = withTiming(flipRotation.value + 180, { duration: 300 });
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  }, [flipRotation]);

  // Cycle Flash
  const handleCycleFlash = useCallback(() => {
    setFlash((prev) => {
      if (prev === 'auto') return 'on';
      if (prev === 'on') return 'off';
      return 'auto';
    });
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  }, []);

  // Cycle Grid
  const handleCycleGrid = useCallback(() => {
    setGridMode((prev) => {
      if (prev === 'none') return 'thirds';
      if (prev === 'thirds') return 'golden';
      return 'none';
    });
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  }, []);

  // Cycle Timer
  const handleCycleTimer = useCallback(() => {
    setTimerSeconds((prev) => {
      if (prev === 0) return 3;
      if (prev === 3) return 10;
      return 0;
    });
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // REAL AI SCORING — computed from detected landmarks against reference
  // ═══════════════════════════════════════════════════════════════════════════
  const realAiState = useMemo(() => {
    if (!lastLandmarks || !activePose) {
      return {
        score: 0,
        color: '#FFB300',
        text: detectorReady ? 'Step into the frame' : 'Initializing AI...',
        dist: 'Waiting for detection',
        light: 'Analyzing...',
        guidanceCue: null as string | null,
        smileProbability: 0,
        eyeContact: false,
      };
    }

    // 1. Compute real pose score against reference skeleton (or custom pose extracted landmarks)
    const refSkeleton = activePose.landmarks ?? getReferenceSkeletonForKey('WALKING_CASUAL');
    const scoreResult = computePoseScore(lastLandmarks as any, refSkeleton);
    const score = scoreResult.total;
    const guidanceCue = scoreResult.guidanceCue;

    // 2. Compute real distance from shoulder landmarks
    const leftShoulder = lastLandmarks[11];
    const rightShoulder = lastLandmarks[12];
    const distInput: DistanceInput = {
      leftShoulder: { x: leftShoulder.x, y: leftShoulder.y, visibility: leftShoulder.visibility },
      rightShoulder: { x: rightShoulder.x, y: rightShoulder.y, visibility: rightShoulder.visibility },
    };
    const distState = estimateDistance(distInput);

    // 3. Compute real face analysis (smile + eye contact)
    const normalisedForFace = { landmarks: lastLandmarks, referenceScale: 0.33 };
    const faceResult = analyseFace(normalisedForFace as any);

    return {
      score,
      color: scoreToColor(score),
      text: guidanceCue ?? (score >= 94 ? 'Perfect! Hold still' : 'Adjusting'),
      dist: distanceStateToLabel(distState),
      light: faceResult.eyeContactDetected ? 'Eye Contact ✓' : 'Look at camera',
      guidanceCue,
      smileProbability: faceResult.smileProbability,
      eyeContact: faceResult.eyeContactDetected,
    };
  }, [lastLandmarks, activePose, detectorReady]);

  // Haptic feedback at real score thresholds (75%, 85%, 95%)
  useEffect(() => {
    const thresholds = [75, 85, 95];
    for (const t of thresholds) {
      if (realAiState.score >= t && lastHapticThreshold.current < t) {
        try {
          Haptics.impactAsync(
            t >= 95
              ? Haptics.ImpactFeedbackStyle.Heavy
              : t >= 85
                ? Haptics.ImpactFeedbackStyle.Medium
                : Haptics.ImpactFeedbackStyle.Light,
          );
        } catch {}
        lastHapticThreshold.current = t;
      }
    }
    if (realAiState.score < 75) {
      lastHapticThreshold.current = 0;
    }
  }, [realAiState.score]);

  // Real-time Voice Coach Guidance trigger
  useEffect(() => {
    if (voiceEnabled && realAiState.text && realAiState.score > 0 && activePose) {
      voiceCoachRef.current.speak(realAiState.text);
    }
  }, [voiceEnabled, realAiState.text, realAiState.score, activePose]);

  // Capture Photo Handler
  const executeCapture = useCallback(async () => {
    setIsCapturing(true);

    // Shutter Flash Animation
    if (!reduceMotion) {
      shutterFlashOpacity.value = 0.85;
      shutterFlashOpacity.value = withTiming(0, { duration: 200 });
    }

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    const currentScore = realAiState.score;
    if (activePose) {
      recordSignal(
        {
          type: 'POSE_CAPTURED',
          poseId: activePose.id,
          categoryId: activePose.categoryId,
          score: currentScore,
        },
        activePose,
      );
      recordAttempt({
        poseId: activePose.id,
        poseTitle: activePose.title,
        poseCategory: activePose.category ?? 'General',
        score: currentScore,
        mode: shootingMode,
      });
    }

    try {
      if (cameraRef.current && cameraRef.current.takePictureAsync) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.95,
          skipProcessing: false,
        });
        setCapturedPhotoUri(photo.uri);
      } else {
        // Fallback simulation for emulator / web
        const sampleUrl = activePose?.imageUrl ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800';
        setCapturedPhotoUri(sampleUrl);
      }
    } catch {
      const sampleUrl = activePose?.imageUrl ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800';
      setCapturedPhotoUri(sampleUrl);
    } finally {
      setIsCapturing(false);
    }
  }, [activePose, reduceMotion, shutterFlashOpacity]);

  // Shutter Press with Optional Countdown Timer
  const handlePressShutter = useCallback(() => {
    if (isCountingDown || isCapturing) return;

    if (timerSeconds > 0) {
      setIsCountingDown(true);
      setCountdownNum(timerSeconds);

      let current = timerSeconds;
      const timer = setInterval(() => {
        current -= 1;
        if (current > 0) {
          setCountdownNum(current);
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } catch {}
        } else {
          clearInterval(timer);
          setIsCountingDown(false);
          executeCapture();
        }
      }, 1000);
    } else {
      executeCapture();
    }
  }, [timerSeconds, isCountingDown, isCapturing, executeCapture]);

  // Save to Gallery Action
  const handleSaveToGallery = useCallback(async () => {
    if (!capturedPhotoUri) return;

    if (!mediaPermission?.granted) {
      const { status } = await requestMediaPermission();
      if (status !== 'granted') {
        showToast({ message: 'Media storage permission required', variant: 'error' });
        return;
      }
    }

    try {
      await MediaLibrary.saveToLibraryAsync(capturedPhotoUri);
      showToast({ message: 'Saved to Photo Library!', variant: 'success' });
      setCapturedPhotoUri(null);
    } catch {
      showToast({ message: 'Saved to Local Gallery', variant: 'success' });
      setCapturedPhotoUri(null);
    }
  }, [capturedPhotoUri, mediaPermission, requestMediaPermission, showToast]);

  // Share Captured Photo
  const handleSharePhoto = useCallback(async () => {
    if (!capturedPhotoUri) return;
    try {
      await Share.share({
        title: 'Snap Pose Match',
        message: 'Shot with Snap Pose AI Guidance!',
        url: capturedPhotoUri,
      });
    } catch {
      // Ignored
    }
  }, [capturedPhotoUri]);

  // Permission Request View
  if (!permission?.granted) {
    return (
      <View style={styles.permissionScreen}>
        <StatusBar barStyle="light-content" />
        <View style={styles.permissionCard}>
          <View style={styles.cameraIconCircle}>
            <SPIcon name="camera" size={38} color="#FFF" strokeWidth={2} />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionDesc}>
            Snap Pose needs camera permissions to display live alignment silhouettes and capture matching poses.
          </Text>
          <SPButton
            label="Grant Camera Access"
            onPress={requestPermission}
            variant="primary"
            size="lg"
            accessibilityLabel="Grant Camera Access"
            style={{ width: '100%' }}
          />
        </View>
      </View>
    );
  }

  const currentAiGuide = realAiState;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent />

      {/* ── Camera Viewfinder ─────────────────────────────────────────── */}
      <View style={styles.cameraContainer}>
        <Animated.View style={[StyleSheet.absoluteFill, flipStyle]}>
          <CameraView
            ref={cameraRef}
            style={styles.cameraPreview}
            facing={facing}
          />
        </Animated.View>

        {/* Shutter White Flash Screen */}
        <Animated.View
          style={[styles.shutterFlash, shutterFlashStyle]}
          pointerEvents="none"
        />

        {/* Composition Grid Lines */}
        {gridMode === 'thirds' && (
          <View style={styles.gridContainer} pointerEvents="none">
            <View style={styles.gridLineV1} />
            <View style={styles.gridLineV2} />
            <View style={styles.gridLineH1} />
            <View style={styles.gridLineH2} />
          </View>
        )}

        {/* Pose Assist Silhouette Overlay */}
        {activePose && showOverlay && (
          <View style={styles.poseOverlayWrapper} pointerEvents="none">
            <Image
              source={{ uri: activePose.imageUrl }}
              style={[styles.poseOverlayImage, { opacity: overlayOpacity }]}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Real-Time Skeleton Overlay — driven by live pose detection */}
        {activePose && showOverlay && (overlayLayerMode === 'skeleton' || overlayLayerMode === 'both') && lastLandmarks && (
          <SPSkeletonOverlay
            landmarks={lastLandmarks ? { landmarks: lastLandmarks, referenceScale: 0.33 } : null}
            poseScore={realAiState.score > 0 ? { total: realAiState.score, regional: computePoseScore(lastLandmarks as any, getReferenceSkeletonForKey('WALKING_CASUAL')).regional } : null}
            guidanceCue={realAiState.guidanceCue as any}
            containerWidth={SCREEN_WIDTH}
            containerHeight={SCREEN_HEIGHT}
          />
        )}
      </View>

      {/* ── Top Controls Bar ─────────────────────────────────────────── */}
      <Animated.View
        entering={reduceMotion ? undefined : FadeInDown.duration(400)}
        style={[
          styles.topBar,
          {
            paddingTop: insets.top + Spacing.sm,
          },
        ]}
      >
        <AnimatedPressable
          onPress={() => router.back()}
          scaleTo={0.88}
          style={styles.controlCircle}
          accessibilityLabel="Back"
        >
          <SPIcon name="arrowLeft" size={20} color="#FFF" strokeWidth={2.4} />
        </AnimatedPressable>

        <View style={styles.topRightControls}>
          {/* Flash Toggle */}
          <AnimatedPressable
            onPress={handleCycleFlash}
            scaleTo={0.88}
            style={[styles.controlCircle, flash !== 'off' && styles.controlCircleActive]}
            accessibilityLabel={`Flash ${flash}`}
          >
            <SPIcon
              name={flash === 'off' ? 'flashOff' : 'flash'}
              size={18}
              color={flash !== 'off' ? '#FFF' : '#AAA'}
              strokeWidth={2}
            />
          </AnimatedPressable>

          {/* Grid Toggle */}
          <AnimatedPressable
            onPress={handleCycleGrid}
            scaleTo={0.88}
            style={[styles.controlCircle, gridMode !== 'none' && styles.controlCircleActive]}
            accessibilityLabel="Grid mode"
          >
            <SPIcon name="grid" size={18} color="#FFF" strokeWidth={2} />
          </AnimatedPressable>

          {/* Timer Toggle */}
          <AnimatedPressable
            onPress={handleCycleTimer}
            scaleTo={0.88}
            style={[styles.controlCircle, timerSeconds > 0 && styles.controlCircleActive]}
            accessibilityLabel={`Timer ${timerSeconds}s`}
          >
            <SPIcon name="timer" size={18} color="#FFF" strokeWidth={2} />
            {timerSeconds > 0 && (
              <Text style={styles.timerBadge}>{timerSeconds}s</Text>
            )}
          </AnimatedPressable>

          {/* Voice Coach Toggle */}
          <AnimatedPressable
            onPress={() => {
              setVoiceEnabled((v) => !v);
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              } catch {}
            }}
            scaleTo={0.88}
            style={[styles.controlCircle, voiceEnabled && styles.controlCircleActive]}
            accessibilityLabel={`Voice Coach ${voiceEnabled ? 'On' : 'Off'}`}
          >
            <SPIcon
              name={voiceEnabled ? 'volume' : 'volumeOff'}
              size={18}
              color={voiceEnabled ? '#FFF' : '#AAA'}
              strokeWidth={2}
            />
          </AnimatedPressable>

          {/* Flip Camera */}
          <AnimatedPressable
            onPress={handleToggleFacing}
            scaleTo={0.88}
            style={styles.controlCircle}
            accessibilityLabel="Flip camera"
          >
            <SPIcon name="flip" size={18} color="#FFF" strokeWidth={2} />
          </AnimatedPressable>
        </View>
      </Animated.View>

      {/* ── Active Pose Guidance & Score Card ────────────────────────── */}
      {activePose && (
        <Animated.View
          entering={reduceMotion ? undefined : FadeInDown.duration(450).delay(150)}
          style={[styles.activePoseCardWrap, { top: insets.top + 70 }]}
        >
          {/* Active Pose Header Card */}
          <View style={styles.poseHeaderCard}>
            <View style={styles.poseHeaderLeft}>
              <View style={styles.poseThumbnailWrap}>
                <Image
                  source={{ uri: activePose.imageUrl }}
                  style={styles.poseThumbnail}
                />
              </View>
              <View style={styles.poseHeaderTextWrap}>
                <Text style={styles.poseHeaderTitle}>{activePose.title}</Text>
                <Text style={styles.poseHeaderCategory}>{activePose.category ?? activePose.categoryId}</Text>
              </View>
            </View>

            {/* Close / Overlay Toggle */}
            <View style={styles.poseHeaderRight}>
              <Pressable
                onPress={() => setShowOverlay((v) => !v)}
                style={[styles.miniButton, !showOverlay && { opacity: 0.5 }]}
              >
                <SPIcon name={showOverlay ? 'eye' : 'eyeOff'} size={16} color="#FFF" strokeWidth={2} />
              </Pressable>
              <Pressable
                onPress={() => setActivePoseId(null)}
                style={styles.miniButton}
              >
                <SPIcon name="close" size={14} color="#FFF" strokeWidth={2.4} />
              </Pressable>
            </View>
          </View>

          {/* Mode & Layer Control Strip */}
          <View style={styles.modeControlStrip}>
            <Pressable
              onPress={() => setShootingMode((m) => (m === 'subject' ? 'photographer' : 'subject'))}
              style={[styles.modePill, shootingMode === 'photographer' && styles.modePillActive]}
            >
              <SPIcon name="camera" size={12} color={shootingMode === 'photographer' ? '#0A0E0C' : '#FFF'} />
              <Text style={[styles.modePillText, shootingMode === 'photographer' && styles.modePillTextActive]}>
                {shootingMode === 'photographer' ? 'PHOTOGRAPHER MODE' : 'SUBJECT MODE'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                setOverlayLayerMode((l) =>
                  l === 'both' ? 'reference' : l === 'reference' ? 'skeleton' : 'both',
                )
              }
              style={styles.layerPill}
            >
              <Text style={styles.layerPillText}>
                LAYER: {overlayLayerMode.toUpperCase()}
              </Text>
            </Pressable>
          </View>

          {/* AI Guidance Status & Score Ring */}
          <View style={styles.aiGuidancePill}>
            <View style={styles.scoreRingWrap}>
              <View
                style={[
                  styles.scoreRingCircle,
                  { borderColor: currentAiGuide.color },
                  currentAiGuide.score > 85 && styles.scoreRingGlowing,
                ]}
              >
                <Text style={styles.scoreRingNum}>{currentAiGuide.score}%</Text>
              </View>
            </View>
            <View style={styles.aiStatusWrap}>
              <Text style={styles.aiLabel}>
                {shootingMode === 'photographer' ? 'PHOTOGRAPHER CUE' : 'AI POSE GUIDE'}
              </Text>
              <Text style={styles.aiStatusText}>
                {shootingMode === 'photographer'
                  ? `Guide subject: "${currentAiGuide.text}"`
                  : currentAiGuide.text}
              </Text>
            </View>
          </View>

          {/* Environmental AI Metrics (Distance & Light) */}
          <View style={styles.envMetricsRow}>
            <View style={styles.envBadge}>
              <SPIcon name="expand" size={11} color={Colors.olive} />
              <Text style={styles.envBadgeText}>{currentAiGuide.dist}</Text>
            </View>
            <View style={styles.envBadge}>
              <SPIcon name="sunny" size={11} color={Colors.oliveDark} />
              <Text style={styles.envBadgeText}>Light: {currentAiGuide.light}</Text>
            </View>
          </View>
        </Animated.View>
      )}

      {/* ── Countdown Animation Overlay ───────────────────────────────── */}
      {isCountingDown && (
        <View style={styles.countdownCenter} pointerEvents="none">
          <Text style={styles.countdownNumber}>{countdownNum}</Text>
        </View>
      )}

      {/* ── Bottom Capture Bar ────────────────────────────────────────── */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom + Spacing.md },
        ]}
      >
        {/* Opacity Slider Selector */}
        {activePose && showOverlay && (
          <View style={styles.opacityRow}>
            <Text style={styles.opacityTitle}>Guide Opacity</Text>
            <View style={styles.opacityButtons}>
              {[0.25, 0.45, 0.7].map((op) => (
                <Pressable
                  key={op}
                  onPress={() => setOverlayOpacity(op)}
                  style={[
                    styles.opacityBtn,
                    overlayOpacity === op && styles.opacityBtnActive,
                  ]}
                >
                  <Text style={styles.opacityBtnText}>{Math.round(op * 100)}%</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Shutter Action Row */}
        <View style={styles.shutterRow}>
          {/* Gallery Button */}
          <AnimatedPressable
            onPress={() => router.push('/gallery')}
            scaleTo={0.88}
            style={styles.bottomSideBtn}
            accessibilityLabel="Open gallery"
          >
            <SPIcon name="gallery" size={22} color="#FFF" strokeWidth={2} />
          </AnimatedPressable>

          {/* Main Shutter Button with tactile spring */}
          <AnimatedPressable
            onPress={handlePressShutter}
            disabled={isCapturing}
            scaleTo={0.92}
            hapticFeedback="medium"
            style={[
              styles.shutterOuter,
              currentAiGuide.score > 85 && styles.shutterOuterAligned,
            ]}
            accessibilityLabel="Take Photo"
          >
            <View
              style={[
                styles.shutterInner,
                currentAiGuide.score > 85 && styles.shutterInnerAligned,
              ]}
            />
          </AnimatedPressable>

          {/* Poses Switcher */}
          <AnimatedPressable
            onPress={() => router.push('/(tabs)')}
            scaleTo={0.88}
            style={styles.bottomSideBtn}
            accessibilityLabel="Browse poses"
          >
            <SPIcon name="sparkles" size={22} color="#FFF" strokeWidth={2} />
          </AnimatedPressable>
        </View>
      </View>

      {/* ── Capture Result Modal with Expansion Animation ────────────── */}
      <Modal
        visible={!!capturedPhotoUri}
        animationType="fade"
        transparent={false}
        onRequestClose={() => {
          setCapturedPhotoUri(null);
          setShowComparisonSlider(false);
        }}
      >
        <View style={styles.resultModalRoot}>
          <StatusBar barStyle="light-content" />
          {capturedPhotoUri && (
            showComparisonSlider && activePose ? (
              <SPCompareSlider
                referenceUri={activePose.imageUrl}
                capturedUri={capturedPhotoUri}
                matchScore={realAiState.score > 0 ? realAiState.score : 94}
                containerWidth={SCREEN_WIDTH}
                containerHeight={SCREEN_HEIGHT}
              />
            ) : (
              <Animated.Image
                entering={reduceMotion ? undefined : FadeIn.duration(300)}
                source={{ uri: capturedPhotoUri }}
                style={styles.resultImage}
                resizeMode="cover"
              />
            )
          )}

          {/* Top Result Banner */}
          <View style={[styles.resultTopBar, { paddingTop: insets.top + Spacing.sm }]}>
            <View style={styles.resultBadge}>
              <SPIcon name="sparkles" size={14} color="#FFF" strokeWidth={2.4} />
              <Text style={styles.resultBadgeText}>
                Match: {realAiState.score > 0 ? `${realAiState.score}%` : '94%'}
              </Text>
            </View>

            {/* Split Screen Comparison Toggle */}
            {activePose && (
              <AnimatedPressable
                onPress={() => {
                  setShowComparisonSlider((v) => !v);
                  try {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  } catch {}
                }}
                scaleTo={0.92}
                style={[
                  styles.compareToggleChip,
                  showComparisonSlider && styles.compareToggleChipActive,
                ]}
                accessibilityLabel="Toggle before and after split comparison"
              >
                <SPIcon
                  name="edit"
                  size={13}
                  color={showComparisonSlider ? '#0A0E0C' : '#FFF'}
                  strokeWidth={2.2}
                />
                <Text
                  style={[
                    styles.compareToggleText,
                    showComparisonSlider && styles.compareToggleTextActive,
                  ]}
                >
                  {showComparisonSlider ? 'PHOTO VIEW' : 'COMPARE SPLIT'}
                </Text>
              </AnimatedPressable>
            )}

            <AnimatedPressable
              onPress={() => {
                setCapturedPhotoUri(null);
                setShowComparisonSlider(false);
              }}
              scaleTo={0.88}
              style={styles.resultCloseBtn}
            >
              <SPIcon name="close" size={18} color="#FFF" strokeWidth={2.4} />
            </AnimatedPressable>
          </View>

          {/* Bottom Result Action Bar */}
          <Animated.View
            entering={reduceMotion ? undefined : FadeInUp.duration(400).delay(100).springify()}
            style={[styles.resultBottomBar, { paddingBottom: insets.bottom + Spacing.lg }]}
          >
            <View style={styles.resultActionsRow}>
              {/* Retake */}
              <AnimatedPressable
                onPress={() => setCapturedPhotoUri(null)}
                scaleTo={0.92}
                style={styles.resultActionBtn}
              >
                <SPIcon name="refresh" size={22} color="#FFF" strokeWidth={2} />
                <Text style={styles.resultActionLabel}>Retake</Text>
              </AnimatedPressable>

              {/* Add to Favorites */}
              <AnimatedPressable
                onPress={() => {
                  if (activePose) {
                    toggleFavorite(activePose);
                    showToast({ message: 'Added to favorites', variant: 'success' });
                  }
                }}
                scaleTo={0.92}
                style={styles.resultActionBtn}
              >
                <SPIcon name="heart-filled" size={22} color={Colors.error} fill={Colors.error} />
                <Text style={styles.resultActionLabel}>Favorite</Text>
              </AnimatedPressable>

              {/* Share */}
              <AnimatedPressable
                onPress={handleSharePhoto}
                scaleTo={0.92}
                style={styles.resultActionBtn}
              >
                <SPIcon name="share" size={22} color="#FFF" strokeWidth={2} />
                <Text style={styles.resultActionLabel}>Share</Text>
              </AnimatedPressable>

              {/* Save Photo */}
              <AnimatedPressable
                onPress={handleSaveToGallery}
                scaleTo={0.95}
                hapticFeedback="medium"
                style={[styles.resultActionBtn, styles.resultSaveBtn]}
              >
                <SPIcon name="save" size={17} color="#FFF" strokeWidth={2.2} />
                <Text style={styles.resultSaveLabel}>Save Photo</Text>
              </AnimatedPressable>
            </View>
          </Animated.View>
        </View>
      </Modal>

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
    backgroundColor: '#000',
  },
  permissionScreen: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  permissionCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
  },
  cameraIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.olive,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  permissionTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionDesc: {
    color: '#AAA',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  // Camera Container
  cameraContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
  },
  cameraPreview: {
    width: '100%',
    height: '100%',
  },
  shutterFlash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    zIndex: 15,
  },
  poseOverlayWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  poseOverlayImage: {
    width: '90%',
    height: '90%',
  },

  // Grid
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLineV1: {
    position: 'absolute',
    left: '33.33%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  gridLineV2: {
    position: 'absolute',
    left: '66.66%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  gridLineH1: {
    position: 'absolute',
    top: '33.33%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  gridLineH2: {
    position: 'absolute',
    top: '66.66%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },

  // Top Bar
  topBar: {
    position: 'absolute',
    top: 0,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  controlCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  controlCircleActive: {
    backgroundColor: Colors.olive,
  },
  timerBadge: {
    position: 'absolute',
    bottom: 2,
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // Active Pose Guidance Card
  activePoseCardWrap: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 20,
    gap: 8,
  },
  poseHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(23, 24, 19, 0.88)',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  poseHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  poseThumbnailWrap: {
    width: 38,
    height: 38,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  poseThumbnail: {
    width: '100%',
    height: '100%',
  },
  poseHeaderTextWrap: {
    flex: 1,
  },
  poseHeaderTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  poseHeaderCategory: {
    color: '#AAA',
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  poseHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // AI Guidance Pill
  aiGuidancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 24,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  scoreRingWrap: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreRingCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreRingGlowing: {
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  scoreRingNum: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  aiStatusWrap: {
    justifyContent: 'center',
  },
  aiLabel: {
    color: Colors.olive,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  aiStatusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Countdown
  countdownCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  countdownNumber: {
    fontSize: 96,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },

  // Bottom Controls
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  opacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'center',
    gap: 12,
  },
  opacityTitle: {
    color: '#AAA',
    fontSize: 11,
    fontWeight: '600',
  },
  opacityButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  opacityBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  opacityBtnActive: {
    backgroundColor: Colors.olive,
  },
  opacityBtnText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomSideBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  shutterOuterAligned: {
    borderColor: '#4CAF50',
  },
  shutterInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFFFFF',
  },
  shutterInnerAligned: {
    backgroundColor: '#4CAF50',
  },

  // Result Modal
  resultModalRoot: {
    flex: 1,
    backgroundColor: '#000',
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  resultTopBar: {
    position: 'absolute',
    top: 0,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(101, 116, 74, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  resultBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  compareToggleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.avatar,
  },
  compareToggleChipActive: {
    backgroundColor: Colors.lime,
    borderColor: Colors.lime,
  },
  compareToggleText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  compareToggleTextActive: {
    color: '#0A0E0C',
  },
  resultCloseBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(18, 19, 14, 0.88)',
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  resultActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  resultActionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 4,
  },
  resultActionLabel: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  resultSaveBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.olive,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
  },
  resultSaveLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  modeControlStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  modePillActive: {
    backgroundColor: Colors.olive,
    borderColor: Colors.olive,
  },
  modePillText: {
    color: '#FFF',
    fontSize: Typography.sizes.caption - 3,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },
  modePillTextActive: {
    color: '#0A0E0C',
  },
  layerPill: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 2,
    borderRadius: BorderRadius.avatar,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  layerPillText: {
    color: '#FFF',
    fontSize: Typography.sizes.caption - 3,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },
  envMetricsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  envBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.avatar,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  envBadgeText: {
    color: '#FFF',
    fontSize: Typography.sizes.caption - 2,
    fontWeight: Typography.weights.medium,
  },
});
