/**
 * Snap Pose — Centralized Motion System & Animation Design Tokens.
 *
 * Defines standardized durations, cubic bezier easing curves, spring physics,
 * and accessibility hooks for Apple-level interaction polish.
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { Easing } from 'react-native-reanimated';

// ---------------------------------------------------------------------------
// Durations (ms)
// ---------------------------------------------------------------------------

export const MotionDurations = {
  instant: 80,
  fast: 180,
  normal: 300,
  medium: 450,
  slow: 700,
  cinematic: 1200,
  splashSequence: 1800,
} as const;

// ---------------------------------------------------------------------------
// Easing Curves
// ---------------------------------------------------------------------------

export const MotionEasings = {
  // Entrances & Reveals — snappy start with gentle deceleration
  outStandard: Easing.bezier(0.16, 1, 0.3, 1),
  outCubic: Easing.out(Easing.cubic),
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),

  // Transitions & Page Shifts — smooth both ends
  inOutStandard: Easing.bezier(0.4, 0, 0.2, 1),
  inOutCubic: Easing.inOut(Easing.cubic),

  // Exits — quick acceleration off-screen
  inStandard: Easing.bezier(0.4, 0, 1, 1),

  // Continuous / Shimmer / Ambient
  linear: Easing.linear,
} as const;

// ---------------------------------------------------------------------------
// Spring Configurations (react-native-reanimated)
// ---------------------------------------------------------------------------

export const MotionSprings = {
  // Tactile buttons, tabs, pills (firm & snappy)
  snappy: {
    damping: 18,
    stiffness: 260,
    mass: 0.8,
  },
  // Cards, modals, bottom sheets (smooth & natural)
  gentle: {
    damping: 22,
    stiffness: 180,
    mass: 1.0,
  },
  // Bouncy micro-interactions (favorite heart pop, checkmarks)
  bouncy: {
    damping: 12,
    stiffness: 220,
    mass: 0.9,
  },
  // Heavy overlays / drawers
  heavy: {
    damping: 28,
    stiffness: 160,
    mass: 1.2,
  },
} as const;

// ---------------------------------------------------------------------------
// Reduced Motion Hook
// ---------------------------------------------------------------------------

export function useReducedMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled: boolean) => {
        setReduceMotion(enabled);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return reduceMotion;
}
