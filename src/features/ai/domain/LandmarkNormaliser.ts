/**
 * LandmarkNormaliser — pure domain implementation.
 *
 * Normalises raw MediaPipe landmark coordinates to a body-centred,
 * scale-independent coordinate system.
 *
 * Normalisation pipeline [Req 42]:
 *  1. Translate: hip-midpoint → origin (0, 0)
 *  2. Scale:     divide all coords by shoulder-to-hip distance (reference scale)
 *  3. Rotate:    align torso vertical axis with y-axis (remove lean)
 *  4. Aspect:    compensate for non-square camera frames
 *
 * Property-based test invariants [Req 42]:
 *  - Scale invariance: normalise(scale(L, s)) === normalise(L) for all s > 0
 *  - Translation invariance: normalise(translate(L, dx, dy)) === normalise(L)
 *  - Rotation equivariance: score variation ≤ 3 pts for |θ| ≤ 10° torso rotation
 *
 * Zero external dependencies — runs identically in Node (tests) and on-device.
 */

import { LM } from './PoseScoreCalculator';
import type { Landmark, NormalisedLandmarks, PoseLandmarks } from '../types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Minimum landmarks above confidence threshold to accept a set. [Req 10.4] */
const MIN_CONFIDENT_LANDMARKS = 17;
const CONFIDENCE_THRESHOLD = 0.60;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type NormalisedResultLandmarks = PoseLandmarks & {
  landmarks: PoseLandmarks;
  referenceScale: number;
};

export interface NormaliseResult {
  ok: true;
  normalised: NormalisedResultLandmarks;
}

export interface NormaliseError {
  ok: false;
  reason: 'insufficient_landmarks' | 'degenerate_scale';
}

export type NormaliseOutcome = NormaliseResult | NormaliseError;

/**
 * Normalise a raw MediaPipe PoseLandmarks set.
 *
 * Returns NormaliseError when:
 *  - Fewer than 17/33 landmarks have visibility ≥ 0.60 [Req 10.4]
 *  - The reference scale (shoulder-to-hip distance) is near-zero
 */
export function normaliseLandmarks(
  rawInput: PoseLandmarks | NormalisedLandmarks,
  aspectRatio = 1.0,
): NormaliseOutcome {
  const raw = (Array.isArray(rawInput) ? rawInput : rawInput.landmarks) as PoseLandmarks;
  // ── Confidence gate ──────────────────────────────────────────────────────
  const confidentCount = raw.filter((lm) => lm.visibility >= CONFIDENCE_THRESHOLD).length;
  if (confidentCount < MIN_CONFIDENT_LANDMARKS) {
    return { ok: false, reason: 'insufficient_landmarks' };
  }

  // ── Step 1: Compute reference points ────────────────────────────────────
  const leftShoulder = raw[LM.LEFT_SHOULDER];
  const rightShoulder = raw[LM.RIGHT_SHOULDER];
  const leftHip = raw[LM.LEFT_HIP];
  const rightHip = raw[LM.RIGHT_HIP];

  const hipMidX = (leftHip.x + rightHip.x) / 2;
  const hipMidY = (leftHip.y + rightHip.y) / 2;
  const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
  const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;

  // Reference scale = shoulder-to-hip distance (body-height proxy)
  const dx = shoulderMidX - hipMidX;
  const dy = shoulderMidY - hipMidY;
  const referenceScale = Math.sqrt(dx * dx + dy * dy);

  if (referenceScale < 1e-6) {
    return { ok: false, reason: 'degenerate_scale' };
  }

  // Torso angle (angle of spine vector from vertical)
  const torsoAngle = Math.atan2(dx, -dy); // atan2(horizontal, -vertical)

  // ── Step 2-4: Translate → Scale → Rotate → Aspect ───────────────────────
  const normalisedArr = raw.map((lm): Landmark => {
    // 1. Translate to hip-midpoint origin
    let x = lm.x - hipMidX;
    let y = lm.y - hipMidY;

    // 2. Scale by reference distance
    x /= referenceScale;
    y /= referenceScale;

    // 3. Rotate to remove torso lean
    const cosT = Math.cos(-torsoAngle);
    const sinT = Math.sin(-torsoAngle);
    const rx = x * cosT - y * sinT;
    const ry = x * sinT + y * cosT;
    x = rx;
    y = ry;

    // 4. Aspect-ratio compensation (stretch x if frame is portrait)
    x *= aspectRatio;

    return { x, y, z: lm.z / referenceScale, visibility: lm.visibility };
  });

  const normalised = normalisedArr as unknown as NormalisedResultLandmarks;
  normalised.landmarks = normalisedArr as unknown as PoseLandmarks;
  normalised.referenceScale = referenceScale;

  return {
    ok: true,
    normalised,
  };
}

/**
 * Denormalise (reverse) a NormalisedLandmarks set back to raw frame coordinates.
 * Used for round-trip property tests. [Req 11 — normalisation round-trip]
 */
export function denormaliseLandmarks(
  norm: NormalisedLandmarks,
  hipMidX: number,
  hipMidY: number,
  torsoAngle: number,
  aspectRatio = 1.0,
): PoseLandmarks {
  const { landmarks, referenceScale } = norm;

  return landmarks.map((lm): Landmark => {
    // Reverse aspect ratio
    let x = lm.x / aspectRatio;
    let y = lm.y;

    // Reverse rotation
    const cosT = Math.cos(torsoAngle);
    const sinT = Math.sin(torsoAngle);
    const rx = x * cosT - y * sinT;
    const ry = x * sinT + y * cosT;
    x = rx;
    y = ry;

    // Reverse scale
    x *= referenceScale;
    y *= referenceScale;

    // Reverse translation
    x += hipMidX;
    y += hipMidY;

    return { x, y, z: lm.z * referenceScale, visibility: lm.visibility };
  }) as PoseLandmarks;
}

// ---------------------------------------------------------------------------
// Convenience helpers for PBT (property-based tests)
// ---------------------------------------------------------------------------

/** Apply uniform scale to all (x, y) coords. Used in PBT scale invariance tests. */
export function scaleLandmarks(raw: PoseLandmarks, s: number): PoseLandmarks {
  return raw.map((lm) => ({ ...lm, x: lm.x * s, y: lm.y * s })) as PoseLandmarks;
}

/** Apply uniform translation to all (x, y) coords. Used in PBT translation invariance tests. */
export function translateLandmarks(raw: PoseLandmarks, dx: number, dy: number): PoseLandmarks {
  return raw.map((lm) => ({ ...lm, x: lm.x + dx, y: lm.y + dy })) as PoseLandmarks;
}

/** Rotate all (x, y) coords by angle θ around origin. Used in PBT rotation equivariance tests. */
export function rotateLandmarks(raw: PoseLandmarks, theta: number): PoseLandmarks {
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  return raw.map((lm) => ({
    ...lm,
    x: lm.x * cosT - lm.y * sinT,
    y: lm.x * sinT + lm.y * cosT,
  })) as PoseLandmarks;
}
