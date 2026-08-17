/**
 * SPPoseOverlay — Skia-based transparent reference pose overlay.
 *
 * Renders a reference pose image on top of the live camera preview
 * with full gesture support:
 *   - Pan (drag to move)
 *   - Pinch (scale 25%–250%)
 *   - Two-finger rotate (−180° to +180°)
 *   - Double-tap (reset with 250 ms animation)
 *   - Long-press (lock / unlock)
 *
 * Also supports:
 *   - Opacity slider (0–100%, default 55%)
 *   - Horizontal mirror for front camera
 *   - Lock indicator badge when locked
 *
 * [Req 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8]
 */

import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, Image, Group, useImage } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import { SPIcon } from '@/components/atoms/SPIcon';
import type { OverlayTransform } from '@/features/camera/types';
import {
  applyPan,
  applyPinch,
  applyRotation,
  resetTransform,
  toggleLock,
} from '@/features/camera/domain/OverlayTransformEngine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SPPoseOverlayProps {
  /** URI of the reference pose PNG/image to overlay. Null renders nothing. */
  imageUri: string | null;
  /** Current gesture transform from the camera store. */
  transform: OverlayTransform;
  /** Callback to persist transform changes. */
  onTransformChange: (t: OverlayTransform) => void;
  /** When true the image is horizontally flipped (front-camera selfie mode). [Req 9.6, 9.7] */
  isMirrored: boolean;
  /**
   * Whether the overlay is currently locked.
   * When true, all gesture interactions are disabled. [Req 9.4]
   * If omitted, falls back to transform.locked.
   */
  isLocked?: boolean;
  /** Width of the container (camera preview) in pixels. Used for layout sizing. */
  containerWidth?: number;
  /** Height of the container (camera preview) in pixels. Used for layout sizing. */
  containerHeight?: number;
}

// ---------------------------------------------------------------------------
// Reset animation duration  [Req 9.5]
// ---------------------------------------------------------------------------

const RESET_DURATION_MS = 250;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Pose overlay rendered via Skia for < 16 ms/frame latency. [Req 9.8]
 */
export function SPPoseOverlay({
  imageUri,
  transform,
  onTransformChange,
  isMirrored,
  isLocked,
  containerWidth,
  containerHeight,
}: SPPoseOverlayProps) {
  // Use explicit isLocked prop if provided, otherwise fall back to transform.locked
  const locked = isLocked !== undefined ? isLocked : transform.locked;

  // containerWidth/containerHeight reserved for future layout-aware positioning
  void containerWidth;
  void containerHeight;
  // Load image with Skia — null if URI is null or image not loaded yet
  const skiaImage = useImage(imageUri ?? '');

  // ── Shared values for smooth gesture-driven animation ─────────────────────
  const translateX = useSharedValue(transform.x);
  const translateY = useSharedValue(transform.y);
  const scale = useSharedValue(transform.scale);
  const rotation = useSharedValue(transform.rotation);
  const opacity = useSharedValue(transform.opacity / 100);

  // ── Sync shared values when transform prop changes externally ─────────────
  useEffect(() => {
    translateX.value = transform.x;
    translateY.value = transform.y;
    scale.value = transform.scale;
    rotation.value = transform.rotation;
    opacity.value = transform.opacity / 100;
  }, [
    transform.x,
    transform.y,
    transform.scale,
    transform.rotation,
    transform.opacity,
    translateX,
    translateY,
    scale,
    rotation,
    opacity,
  ]);

  // ── Gesture origin trackers (used for incremental delta gestures) ─────────
  const panStartX = useSharedValue(0);
  const panStartY = useSharedValue(0);
  const pinchStartScale = useSharedValue(1);
  const rotationStart = useSharedValue(0);

  // ── Commit transform to the store (JS thread callback) ───────────────────
  const commitTransform = useCallback(
    (t: OverlayTransform) => {
      onTransformChange(t);
    },
    [onTransformChange],
  );

  // ── Pan gesture ──────────────────────────────────────────────────────────
  const panGesture = Gesture.Pan()
    .enabled(!locked)
    .onStart(() => {
      'worklet';
      panStartX.value = translateX.value;
      panStartY.value = translateY.value;
    })
    .onUpdate((e) => {
      'worklet';
      translateX.value = panStartX.value + e.translationX;
      translateY.value = panStartY.value + e.translationY;
    })
    .onEnd(() => {
      'worklet';
      const updated = applyPan(
        { ...transform, x: panStartX.value, y: panStartY.value },
        translateX.value - panStartX.value,
        translateY.value - panStartY.value,
      );
      runOnJS(commitTransform)(updated);
    });

  // ── Pinch gesture ─────────────────────────────────────────────────────────
  const pinchGesture = Gesture.Pinch()
    .enabled(!locked)
    .onStart(() => {
      'worklet';
      pinchStartScale.value = scale.value;
    })
    .onUpdate((e) => {
      'worklet';
      const clamped = Math.max(0.25, Math.min(2.5, pinchStartScale.value * e.scale));
      scale.value = clamped;
    })
    .onEnd(() => {
      'worklet';
      const scaleFactor = scale.value / transform.scale;
      const updated = applyPinch(transform, scaleFactor);
      runOnJS(commitTransform)(updated);
    });

  // ── Rotation gesture ──────────────────────────────────────────────────────
  const rotationGesture = Gesture.Rotation()
    .enabled(!locked)
    .onStart(() => {
      'worklet';
      rotationStart.value = rotation.value;
    })
    .onUpdate((e) => {
      'worklet';
      const newRot = Math.max(
        -Math.PI,
        Math.min(Math.PI, rotationStart.value + e.rotation),
      );
      rotation.value = newRot;
    })
    .onEnd(() => {
      'worklet';
      const delta = rotation.value - transform.rotation;
      const updated = applyRotation(transform, delta);
      runOnJS(commitTransform)(updated);
    });

  // ── Double-tap — reset with 250ms animation [Req 9.5] ────────────────────
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(250)
    .onEnd(() => {
      'worklet';
      const defaults = resetTransform();
      translateX.value = withTiming(defaults.x, { duration: RESET_DURATION_MS });
      translateY.value = withTiming(defaults.y, { duration: RESET_DURATION_MS });
      scale.value = withTiming(defaults.scale, { duration: RESET_DURATION_MS });
      rotation.value = withTiming(defaults.rotation, { duration: RESET_DURATION_MS });
      opacity.value = withTiming(defaults.opacity / 100, { duration: RESET_DURATION_MS });
      runOnJS(commitTransform)(defaults);
    });

  // ── Long-press — toggle lock [Req 9.4] ───────────────────────────────────
  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onEnd(() => {
      'worklet';
      const updated = toggleLock(transform);
      runOnJS(commitTransform)(updated);
    });

  // ── Compose gestures ──────────────────────────────────────────────────────
  // Pan + pinch + rotation run simultaneously.
  // Double-tap and long-press are race competitors with the others.
  const simultaneousManipulation = Gesture.Simultaneous(
    panGesture,
    pinchGesture,
    rotationGesture,
  );

  const composedGesture = Gesture.Race(
    doubleTapGesture,
    longPressGesture,
    simultaneousManipulation,
  );

  // ── Animated container style (wraps the Skia Canvas) ─────────────────────
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotation.value}rad` },
        // Mirror for front camera [Req 9.6, 9.7]
        { scaleX: isMirrored ? -1 : 1 },
      ],
      opacity: opacity.value,
    };
  });

  // ── Nothing to render when no image ──────────────────────────────────────
  if (!imageUri) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
          {skiaImage ? (
            <Canvas style={StyleSheet.absoluteFill} accessibilityElementsHidden>
              <Group>
                <Image
                  image={skiaImage}
                  x={0}
                  y={0}
                  width={skiaImage.width()}
                  height={skiaImage.height()}
                  fit="contain"
                />
              </Group>
            </Canvas>
          ) : null}
        </Animated.View>
      </GestureDetector>

      {/* Lock indicator badge [Req 9.4] */}
      {locked && (
        <View
          style={styles.lockBadge}
          accessibilityLabel="Overlay is locked"
          accessibilityRole="image"
          pointerEvents="none"
        >
          <SPIcon name="lock" size={16} color="#FFFFFF" strokeWidth={2.4} />
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  lockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 30,
  },
  lockIcon: {
    fontSize: 18,
  },
});
