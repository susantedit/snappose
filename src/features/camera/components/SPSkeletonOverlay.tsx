/**
 * SPSkeletonOverlay — Skia skeleton lines + correction chip overlay.
 *
 * Renders MediaPipe 33-landmark skeleton over the camera preview.
 * Each segment is drawn as a 3 px rounded line coloured by its regional
 * score (green / orange / red). Colour transitions are smooth (200 ms).
 *
 * A correction chip appears at the top-centre when a GuidanceCue is
 * active and auto-dismisses after 2 seconds.
 *
 * [Req 11, 12]
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Canvas, Line, vec } from '@shopify/react-native-skia';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import type { NormalisedLandmarks, PoseScore, GuidanceCue } from '@/features/ai/types';
import { LM } from '@/features/ai/domain/PoseScoreCalculator';
import { Colors, BorderRadius, Spacing, Typography } from '@/constants/designTokens';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SEGMENT_STROKE_WIDTH = 3;
const CHIP_DISMISS_DELAY_MS = 2000;

// ---------------------------------------------------------------------------
// Skeleton segment definitions
// Each entry: [landmarkA, landmarkB, regionKey]
// regionKey maps to PoseScore.regional
// ---------------------------------------------------------------------------

type RegionKey = keyof PoseScore['regional'];

interface SegmentDef {
  a: number;
  b: number;
  region: RegionKey;
}

const SEGMENTS: SegmentDef[] = [
  // ── Shoulders ────────────────────────────────────────────────────────────
  { a: LM.LEFT_SHOULDER, b: LM.RIGHT_SHOULDER, region: 'shoulders' },
  { a: LM.LEFT_SHOULDER, b: LM.LEFT_HIP, region: 'shoulders' },
  { a: LM.RIGHT_SHOULDER, b: LM.RIGHT_HIP, region: 'shoulders' },

  // ── Arms ─────────────────────────────────────────────────────────────────
  { a: LM.LEFT_SHOULDER, b: LM.LEFT_ELBOW, region: 'arms' },
  { a: LM.LEFT_ELBOW, b: LM.LEFT_WRIST, region: 'arms' },
  { a: LM.RIGHT_SHOULDER, b: LM.RIGHT_ELBOW, region: 'arms' },
  { a: LM.RIGHT_ELBOW, b: LM.RIGHT_WRIST, region: 'arms' },

  // ── Hands ─────────────────────────────────────────────────────────────────
  { a: LM.LEFT_WRIST, b: LM.LEFT_INDEX, region: 'hands' },
  { a: LM.LEFT_WRIST, b: LM.LEFT_PINKY, region: 'hands' },
  { a: LM.LEFT_WRIST, b: LM.LEFT_THUMB, region: 'hands' },
  { a: LM.RIGHT_WRIST, b: LM.RIGHT_INDEX, region: 'hands' },
  { a: LM.RIGHT_WRIST, b: LM.RIGHT_PINKY, region: 'hands' },
  { a: LM.RIGHT_WRIST, b: LM.RIGHT_THUMB, region: 'hands' },

  // ── Torso ─────────────────────────────────────────────────────────────────
  { a: LM.LEFT_HIP, b: LM.RIGHT_HIP, region: 'torso' },

  // ── Legs ─────────────────────────────────────────────────────────────────
  { a: LM.LEFT_HIP, b: LM.LEFT_KNEE, region: 'legs' },
  { a: LM.LEFT_KNEE, b: LM.LEFT_ANKLE, region: 'legs' },
  { a: LM.RIGHT_HIP, b: LM.RIGHT_KNEE, region: 'legs' },
  { a: LM.RIGHT_KNEE, b: LM.RIGHT_ANKLE, region: 'legs' },

  // ── Feet ─────────────────────────────────────────────────────────────────
  { a: LM.LEFT_ANKLE, b: LM.LEFT_HEEL, region: 'feet' },
  { a: LM.LEFT_HEEL, b: LM.LEFT_FOOT_INDEX, region: 'feet' },
  { a: LM.RIGHT_ANKLE, b: LM.RIGHT_HEEL, region: 'feet' },
  { a: LM.RIGHT_HEEL, b: LM.RIGHT_FOOT_INDEX, region: 'feet' },

  // ── Head ─────────────────────────────────────────────────────────────────
  { a: LM.NOSE, b: LM.LEFT_EYE, region: 'head' },
  { a: LM.NOSE, b: LM.RIGHT_EYE, region: 'head' },
  { a: LM.LEFT_EAR, b: LM.LEFT_EYE_OUTER, region: 'head' },
  { a: LM.RIGHT_EAR, b: LM.RIGHT_EYE_OUTER, region: 'head' },
  { a: LM.LEFT_SHOULDER, b: LM.LEFT_EAR, region: 'head' },
  { a: LM.RIGHT_SHOULDER, b: LM.RIGHT_EAR, region: 'head' },
];

// ---------------------------------------------------------------------------
// Score → colour helpers
// ---------------------------------------------------------------------------

const VISIBILITY_THRESHOLD = 0.5;

/**
 * Map a regional score (0–100) to a segment colour.
 * ≥71 → green, 41–70 → orange, 0–40 → red. [Req 11.4]
 */
function regionalScoreToColor(regionalScore: number): string {
  if (regionalScore >= 71) return Colors.scoreGreen;
  if (regionalScore >= 41) return Colors.scoreOrange;
  return Colors.scoreRed;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SPSkeletonOverlayProps {
  /** Normalised 0–1 landmarks from MediaPipe; null when AI is not running. */
  landmarks: NormalisedLandmarks | null;
  /** Current pose score with regional breakdown; null when unavailable. */
  poseScore: PoseScore | null;
  /** Active guidance cue; null when no correction needed. */
  guidanceCue: GuidanceCue | null;
  /** Width of the overlay container in dp (matches camera preview width). */
  containerWidth: number;
  /** Height of the overlay container in dp (matches camera preview height). */
  containerHeight: number;
}

// ---------------------------------------------------------------------------
// Correction chip
// ---------------------------------------------------------------------------

interface CorrectionChipProps {
  cue: GuidanceCue;
}

/**
 * Appears at the top-centre with FadeIn, then auto-dismisses after
 * CHIP_DISMISS_DELAY_MS via FadeOut. [Req 12]
 */
function CorrectionChip({ cue }: CorrectionChipProps) {
  const [visible, setVisible] = React.useState(true);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset visibility and timer whenever the cue changes
  useEffect(() => {
    setVisible(true);
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    dismissTimer.current = setTimeout(() => {
      setVisible(false);
    }, CHIP_DISMISS_DELAY_MS);
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [cue]);

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={styles.chip}
      accessibilityRole="text"
      accessibilityLabel={`Coaching tip: ${cue}`}
    >
      <Text style={styles.chipText}>{cue}</Text>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * SPSkeletonOverlay draws the full MediaPipe skeleton with per-segment
 * regional score colouring and an auto-dismissing correction chip.
 */
export function SPSkeletonOverlay({
  landmarks,
  poseScore,
  guidanceCue,
  containerWidth,
  containerHeight,
}: SPSkeletonOverlayProps) {
  // Nothing to render without landmarks
  if (!landmarks || containerWidth <= 0 || containerHeight <= 0) {
    return (
      <View
        style={[styles.overlay, { width: containerWidth, height: containerHeight }]}
        pointerEvents="none"
      >
        {guidanceCue !== null && guidanceCue !== undefined && (
          <CorrectionChip cue={guidanceCue} />
        )}
      </View>
    );
  }

  const lms = landmarks.landmarks;

  return (
    <View
      style={[styles.overlay, { width: containerWidth, height: containerHeight }]}
      pointerEvents="none"
    >
      {/* Skeleton canvas */}
      <Canvas style={{ width: containerWidth, height: containerHeight }}>
        {SEGMENTS.map((seg, idx) => {
          const lmA = lms[seg.a];
          const lmB = lms[seg.b];

          // Skip segments with low-confidence landmarks
          if (
            lmA.visibility < VISIBILITY_THRESHOLD ||
            lmB.visibility < VISIBILITY_THRESHOLD
          ) {
            return null;
          }

          const x1 = lmA.x * containerWidth;
          const y1 = lmA.y * containerHeight;
          const x2 = lmB.x * containerWidth;
          const y2 = lmB.y * containerHeight;

          // Regional score (default 50 when poseScore unavailable)
          const regionScore = poseScore?.regional[seg.region] ?? 50;
          const segColor = regionalScoreToColor(regionScore);

          return (
            <Line
              key={idx}
              p1={vec(x1, y1)}
              p2={vec(x2, y2)}
              color={segColor}
              strokeWidth={SEGMENT_STROKE_WIDTH}
              style="stroke"
              strokeCap="round"
            />
          );
        })}
      </Canvas>

      {/* Correction chip — positioned at top-centre */}
      {guidanceCue !== null && guidanceCue !== undefined && (
        <CorrectionChip cue={guidanceCue} />
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  chip: {
    position: 'absolute',
    top: Spacing.md,
    alignSelf: 'center',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  chipText: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    color: '#FFFFFF',
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.semibold as '600',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    textAlign: 'center',
  },
});
