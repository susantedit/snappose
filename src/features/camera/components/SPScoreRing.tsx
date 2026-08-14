/**
 * SPScoreRing — camera-overlay pose score ring.
 *
 * Animated circular progress ring displayed on the camera screen.
 * Colour bands: 0–40 Red, 41–70 Orange, 71–90 Green, 91–100 DarkGreen. [Req 11.4]
 * Smooth 200 ms colour transition between bands. [Req 11.6]
 * Updates at 30 FPS (≤33 ms arc delta per frame). [Req 11.3]
 * Freezes at last value when AI is paused. [Req 11]
 *
 * [Req 11, 12]
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, Path, Skia, type SkPath } from '@shopify/react-native-skia';
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { AnimationDurations, Colors } from '@/constants/designTokens';

// ---------------------------------------------------------------------------
// Score band configuration [Req 11.4]
// ---------------------------------------------------------------------------

const SCORE_BANDS: Array<{ max: number; color: string }> = [
  { max: 40, color: Colors.scoreRed },       // 0–40   Red
  { max: 70, color: Colors.scoreOrange },    // 41–70  Orange
  { max: 90, color: Colors.scoreGreen },     // 71–90  Green
  { max: 100, color: Colors.scoreDarkGreen },// 91–100 Dark Green
];

/** 200 ms colour-transition duration [Req 11.6] */
const COLOUR_TRANSITION_MS = 200;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getBandIndex(score: number): number {
  for (let i = 0; i < SCORE_BANDS.length; i++) {
    if (score <= SCORE_BANDS[i].max) return i;
  }
  return SCORE_BANDS.length - 1;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff];
}

function byteToHex(n: number): string {
  return n.toString(16).padStart(2, '0');
}

function interpolateColor(a: string, b: string, t: number): string {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `#${byteToHex(r)}${byteToHex(g)}${byteToHex(bl)}`;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SPScoreRingProps {
  /** Pose similarity score 0–100. */
  score: number;
  /** Ring diameter in dp. Defaults to 96. */
  size?: number;
  /** Ring stroke width in dp. Defaults to 8. */
  strokeWidth?: number;
  /**
   * When true the ring freezes at the last score value and does not
   * animate further. [Req 11]
   */
  isAiPaused?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * SPScoreRing renders a Skia circular arc that fills proportionally to
 * `score` and transitions colours between the four defined bands.
 */
export function SPScoreRing({
  score,
  size = 96,
  strokeWidth = 8,
  isAiPaused = false,
}: SPScoreRingProps) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Track whether AI was paused to freeze at last value
  const frozenScore = useRef(clampedScore);
  if (!isAiPaused) {
    frozenScore.current = clampedScore;
  }
  const effectiveScore = frozenScore.current;

  // Shared values for animation
  const animatedProgress = useSharedValue(effectiveScore / 100);
  const colorIndex = useSharedValue(getBandIndex(effectiveScore));

  useEffect(() => {
    if (isAiPaused) return; // freeze — no animation updates
    animatedProgress.value = withTiming(effectiveScore / 100, {
      duration: AnimationDurations.medium, // 220 ms ≈ 30 FPS arc delta ≤33 ms
    });
    colorIndex.value = withTiming(getBandIndex(effectiveScore), {
      duration: COLOUR_TRANSITION_MS,
    });
  }, [effectiveScore, isAiPaused, animatedProgress, colorIndex]);

  // Geometry
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Static arc path (full circle, dash effect drives visible length)
  const arcPath: SkPath = React.useMemo(() => {
    const path = Skia.Path.Make();
    path.addArc(
      { x: cx - radius, y: cy - radius, width: radius * 2, height: radius * 2 },
      -90,   // start at 12 o'clock
      360,
    );
    return path;
  }, [cx, cy, radius]);

  // Stroke-dash offset drives the visible arc length
  const strokeDashOffset = useDerivedValue(() => {
    return circumference * (1 - animatedProgress.value);
  });

  // Colour interpolated between bands
  const ringColor = useDerivedValue(() => {
    const idx = colorIndex.value;
    const lower = Math.floor(idx);
    const upper = Math.min(lower + 1, SCORE_BANDS.length - 1);
    const t = idx - lower;
    return interpolateColor(SCORE_BANDS[lower].color, SCORE_BANDS[upper].color, t);
  });

  // Paint derived from animated colour + dash effect
  const paint = useDerivedValue(() => {
    const p = Skia.Paint();
    p.setStyle(1 /* Stroke */);
    p.setStrokeWidth(strokeWidth);
    p.setStrokeCap(1 /* Round */);
    p.setColor(Skia.Color(ringColor.value));
    const intervals = [
      circumference - strokeDashOffset.value,
      strokeDashOffset.value,
    ];
    const dashEffect = Skia.PathEffect.MakeDash(intervals, 0);
    if (dashEffect) p.setPathEffect(dashEffect);
    return p;
  });

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      accessibilityRole="progressbar"
      accessibilityLabel={`Pose score: ${effectiveScore} out of 100`}
      accessibilityValue={{ min: 0, max: 100, now: effectiveScore }}
    >
      <Canvas style={{ width: size, height: size }}>
        {/* Track ring */}
        <Path
          path={arcPath}
          color="rgba(255,255,255,0.15)"
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
        />
        {/* Animated score arc */}
        <Path path={arcPath} paint={paint} />
      </Canvas>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
