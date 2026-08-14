/**
 * SPProgressRing — Skia-powered animated circular progress ring.
 * Colour bands: 0–40 Red, 41–70 Orange, 71–90 Green, 91–100 DarkGreen. [Req 11.4]
 * Smooth colour transitions between bands (200 ms). [Req 11.6]
 * Updates at 30 FPS. [Req 11.3]
 * [Req 32]
 */

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Canvas,
  Circle,
  Paint,
  Path,
  Skia,
  type SkPath,
} from '@shopify/react-native-skia';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { AnimationDurations, Colors } from '@/constants/designTokens';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SCORE_BANDS: Array<{ max: number; color: string }> = [
  { max: 40, color: Colors.scoreRed },
  { max: 70, color: Colors.scoreOrange },
  { max: 90, color: Colors.scoreGreen },
  { max: 100, color: Colors.scoreDarkGreen },
];

function getScoreColor(score: number): string {
  for (const band of SCORE_BANDS) {
    if (score <= band.max) return band.color;
  }
  return Colors.scoreDarkGreen;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SPProgressRingProps {
  /** Value 0–100. */
  score: number;
  /** Diameter in dp. Defaults to 96. */
  size?: number;
  /** Stroke thickness in dp. Defaults to 8. */
  strokeWidth?: number;
  /** Optional child content rendered in the ring centre. */
  children?: React.ReactNode;
  accessibilityLabel?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SPProgressRing({
  score,
  size = 96,
  strokeWidth = 8,
  children,
  accessibilityLabel,
}: SPProgressRingProps) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Animated progress value 0.0 → 1.0
  const animatedProgress = useSharedValue(clampedScore / 100);

  // Animated colour interpolation (stored as hex string index into bands)
  const colorIndex = useSharedValue(getBandIndex(clampedScore));

  useEffect(() => {
    animatedProgress.value = withTiming(clampedScore / 100, {
      duration: AnimationDurations.medium,
    });
    colorIndex.value = withTiming(getBandIndex(clampedScore), {
      duration: AnimationDurations.medium,
    });
  }, [clampedScore, animatedProgress, colorIndex]);

  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Derive the stroke-dash offset for the arc
  const strokeDashOffset = useDerivedValue(() => {
    return circumference * (1 - animatedProgress.value);
  });

  // Derive the ring colour from the animated band index (interpolate)
  const ringColor = useDerivedValue(() => {
    const idx = colorIndex.value;
    const lower = Math.floor(idx);
    const upper = Math.min(lower + 1, SCORE_BANDS.length - 1);
    const t = idx - lower;
    return interpolateColor(SCORE_BANDS[lower].color, SCORE_BANDS[upper].color, t);
  });

  // Create the arc path using Skia
  // We rotate the start point to 12 o'clock by starting at -90°
  const arcPath: SkPath = React.useMemo(() => {
    const path = Skia.Path.Make();
    path.addArc(
      { x: cx - radius, y: cy - radius, width: radius * 2, height: radius * 2 },
      -90,
      360
    );
    return path;
  }, [cx, cy, radius]);

  const a11yLabel = accessibilityLabel ?? `Pose score: ${clampedScore} out of 100`;

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      accessibilityRole="progressbar"
      accessibilityLabel={a11yLabel}
      accessibilityValue={{ min: 0, max: 100, now: clampedScore }}
    >
      <Canvas style={[styles.canvas, { width: size, height: size }]}>
        {/* Track (background ring) */}
        <Path
          path={arcPath}
          color="rgba(0,0,0,0.10)"
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
        />

        {/* Progress arc */}
        <AnimatedArc
          path={arcPath}
          circumference={circumference}
          strokeDashOffset={strokeDashOffset}
          ringColor={ringColor}
          strokeWidth={strokeWidth}
        />
      </Canvas>

      {children != null && (
        <View style={[styles.centreContent, { width: size, height: size }]}>
          {children}
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Animated arc — uses Skia paint driven by Reanimated shared values
// ---------------------------------------------------------------------------

interface AnimatedArcProps {
  path: SkPath;
  circumference: number;
  strokeDashOffset: Animated.SharedValue<number>;
  ringColor: Animated.SharedValue<string>;
  strokeWidth: number;
}

function AnimatedArc({ path, circumference, strokeDashOffset, ringColor, strokeWidth }: AnimatedArcProps) {
  // Derive paint properties reactively
  const paint = useDerivedValue(() => {
    const p = Skia.Paint();
    p.setStyle(1 /* Stroke */);
    p.setStrokeWidth(strokeWidth);
    p.setStrokeCap(1 /* Round */);
    p.setColor(Skia.Color(ringColor.value));
    // Dash effect: total length, then gap = circumference - progress
    const intervals = [circumference - strokeDashOffset.value, strokeDashOffset.value];
    const dashEffect = Skia.PathEffect.MakeDash(intervals, 0);
    if (dashEffect) p.setPathEffect(dashEffect);
    return p;
  });

  return <Path path={path} paint={paint} />;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getBandIndex(score: number): number {
  for (let i = 0; i < SCORE_BANDS.length; i++) {
    if (score <= SCORE_BANDS[i].max) return i;
  }
  return SCORE_BANDS.length - 1;
}

/** Linearly interpolate between two hex colours (#RRGGBB). */
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

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff];
}

function byteToHex(n: number): string {
  return n.toString(16).padStart(2, '0');
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  centreContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
