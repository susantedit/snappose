/**
 * Accessibility utilities for Snap Pose.
 *
 * Provides:
 *  - useReduceMotion()                — hook that tracks the OS reduce-motion setting
 *  - useAccessibleAnimationDuration() — returns 0 ms (or a custom reduced value) when
 *                                       reduce motion is active, else the normal duration
 *  - minTouchTarget                   — 48×48 dp minimum touch-target constant
 *  - makeAccessible()                 — builds a props object with accessible, accessibilityLabel,
 *                                       accessibilityHint, and accessibilityRole
 *
 * [Req 28]
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Minimum touch-target dimensions required for WCAG 2.5.5 and Android a11y
 * guidelines (48 dp × 48 dp).  Spread into a View/Pressable style to enforce.
 *
 * @example
 * <Pressable style={[styles.icon, minTouchTarget]} … />
 */
export const minTouchTarget = {
  minWidth: 48,
  minHeight: 48,
} as const;

// ---------------------------------------------------------------------------
// useReduceMotion
// ---------------------------------------------------------------------------

/**
 * Returns `true` when the device's "Reduce Motion" accessibility setting is
 * enabled.  Subscribes to changes so the component re-renders automatically
 * whenever the user toggles the setting at the OS level.
 */
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Read the initial value
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => {
        // Fail gracefully — default to no reduction
        setReduceMotion(false);
      });

    // Subscribe to future changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );

    return () => subscription.remove();
  }, []);

  return reduceMotion;
}

// ---------------------------------------------------------------------------
// useAccessibleAnimationDuration
// ---------------------------------------------------------------------------

/**
 * Returns the appropriate animation duration based on the current reduce-motion
 * preference.
 *
 * @param normalMs   — The full animation duration used when reduce motion is OFF.
 * @param reducedMs  — The animation duration used when reduce motion is ON.
 *                     Defaults to `0` (instant / no animation).
 *
 * @example
 * const duration = useAccessibleAnimationDuration(AnimationDurations.long); // 350 or 0
 */
export function useAccessibleAnimationDuration(normalMs: number, reducedMs = 0): number {
  const reduceMotion = useReduceMotion();
  return reduceMotion ? reducedMs : normalMs;
}

// ---------------------------------------------------------------------------
// makeAccessible
// ---------------------------------------------------------------------------

export interface AccessibleProps {
  accessible: true;
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
}

/**
 * Builds a consistent accessibility props object for any interactive element.
 * Undefined values are omitted so they don't override component defaults.
 *
 * @param label — Human-readable label for screen readers (required).
 * @param hint  — Additional usage hint spoken by TalkBack after the label.
 * @param role  — ARIA-style role string (e.g. `'button'`, `'image'`, `'link'`).
 *
 * @example
 * <Pressable {...makeAccessible('Favorite', 'Double-tap to toggle favorite', 'button')} />
 */
export function makeAccessible(
  label: string,
  hint?: string,
  role?: string,
): AccessibleProps {
  const props: AccessibleProps = {
    accessible: true,
    accessibilityLabel: label,
  };

  if (hint !== undefined) {
    props.accessibilityHint = hint;
  }

  if (role !== undefined) {
    props.accessibilityRole = role;
  }

  return props;
}
