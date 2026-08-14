/**
 * Pure domain implementation — OverlayTransformEngine.
 *
 * Handles all gesture mathematics for the pose overlay:
 *   - Pan (move)
 *   - Pinch (scale, clamped to [0.25, 2.5])
 *   - Two-finger rotate (clamped to [-π, +π])
 *   - Reset to defaults
 *   - Lock/unlock toggle
 *
 * ZERO imports — this module is a pure TypeScript function set
 * that can run in any environment including Jest in Node.js.
 *
 * [Req 9.2, 9.3, 9.4, 9.5]
 */

import type { OverlayTransform } from '@/features/camera/types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Minimum scale factor (25%). [Req 9.2] */
export const MIN_SCALE = 0.25;

/** Maximum scale factor (250%). [Req 9.2] */
export const MAX_SCALE = 2.5;

/** Minimum rotation in radians (−180°). [Req 9.2] */
export const MIN_ROTATION = -Math.PI;

/** Maximum rotation in radians (+180°). [Req 9.2] */
export const MAX_ROTATION = Math.PI;

// ---------------------------------------------------------------------------
// Default transform [Req 9.3]
// ---------------------------------------------------------------------------

/**
 * Default overlay transform — centered, full scale, 55% opacity, unlocked.
 * [Req 9.3]
 */
export const DEFAULT_OVERLAY_TRANSFORM: OverlayTransform = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
  opacity: 55,
  locked: false,
  mirrored: false,
} as const;

// ---------------------------------------------------------------------------
// Pure transform functions
// ---------------------------------------------------------------------------

/**
 * Apply a pan (drag) delta to the transform.
 * Returns a new OverlayTransform with x/y updated.
 * Has no effect when `t.locked` is true.
 *
 * @param t   - Current transform
 * @param dx  - Horizontal delta in pixels
 * @param dy  - Vertical delta in pixels
 * [Req 9.2]
 */
export function applyPan(
  t: OverlayTransform,
  dx: number,
  dy: number,
): OverlayTransform {
  if (t.locked) return t;
  return { ...t, x: t.x + dx, y: t.y + dy };
}

/**
 * Apply a pinch scale factor to the transform.
 * The resulting scale is clamped to [MIN_SCALE, MAX_SCALE].
 * Has no effect when `t.locked` is true.
 *
 * @param t            - Current transform
 * @param scaleFactor  - Multiplicative scale factor from the pinch gesture
 *                       (e.g. 1.1 to grow by 10%, 0.9 to shrink)
 * [Req 9.2]
 */
export function applyPinch(
  t: OverlayTransform,
  scaleFactor: number,
): OverlayTransform {
  if (t.locked) return t;
  const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, t.scale * scaleFactor));
  return { ...t, scale: newScale };
}

/**
 * Apply a rotation delta (in radians) to the transform.
 * The resulting rotation is clamped to [MIN_ROTATION, MAX_ROTATION].
 * Has no effect when `t.locked` is true.
 *
 * @param t           - Current transform
 * @param angleDelta  - Rotation delta in radians
 * [Req 9.2]
 */
export function applyRotation(
  t: OverlayTransform,
  angleDelta: number,
): OverlayTransform {
  if (t.locked) return t;
  const newRotation = Math.max(
    MIN_ROTATION,
    Math.min(MAX_ROTATION, t.rotation + angleDelta),
  );
  return { ...t, rotation: newRotation };
}

/**
 * Reset the transform to the default centered position and scale.
 * Returns a fresh copy of DEFAULT_OVERLAY_TRANSFORM — never the same reference.
 * [Req 9.5]
 */
export function resetTransform(): OverlayTransform {
  return { ...DEFAULT_OVERLAY_TRANSFORM };
}

/**
 * Toggle the locked state of the overlay.
 * Returns a new transform with `locked` flipped.
 * [Req 9.4]
 */
export function toggleLock(t: OverlayTransform): OverlayTransform {
  return { ...t, locked: !t.locked };
}

/**
 * Set opacity on the transform, clamped to [0, 100].
 * [Req 9.3]
 */
export function applyOpacity(
  t: OverlayTransform,
  opacity: number,
): OverlayTransform {
  return { ...t, opacity: Math.max(0, Math.min(100, opacity)) };
}

/**
 * Set the mirrored flag on the transform.
 * Used automatically when the user switches to front camera.
 * [Req 9.6, 9.7]
 */
export function applyMirror(
  t: OverlayTransform,
  mirrored: boolean,
): OverlayTransform {
  return { ...t, mirrored };
}
