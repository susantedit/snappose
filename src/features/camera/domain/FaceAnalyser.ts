/**
 * FaceAnalyser — pure domain implementation.
 *
 * Detects smile probability and eye-contact from MediaPipe face/pose landmarks.
 *
 * MediaPipe Pose Landmarker provides 33 body landmarks, including facial
 * landmarks (nose, eyes, ears, mouth). This module uses those landmarks
 * for smile and eye-contact heuristics without requiring a separate face mesh.
 *
 * Smile detection algorithm [Req 16.1]:
 *   Uses mouth corner landmarks (left/right mouth corners) relative to the
 *   midpoint of the upper and lower lip centre. When mouth corners are elevated
 *   above the lip midpoint, this indicates a smile.
 *
 * Eye-contact detection [Req 16.3]:
 *   Checks nose/eye landmark z-depth symmetry and x-axis alignment.
 *   When the subject faces the camera directly:
 *     - left/right eye landmarks are roughly symmetric around nose x
 *     - nose z-depth is close to 0 (not turned in depth)
 *
 * Landmark indices (MediaPipe Pose — 33 landmarks):
 *   0  = Nose
 *   1  = Left eye (inner)    2  = Left eye    3  = Left eye (outer)
 *   4  = Right eye (inner)   5  = Right eye   6  = Right eye (outer)
 *   7  = Left ear            8  = Right ear
 *   9  = Mouth left          10 = Mouth right
 *
 * Zero external dependencies — pure TypeScript, testable in Node.
 * [Req 16, 47.3]
 */

import type { NormalisedLandmarks } from '@/features/ai/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FaceAnalysisResult {
  /**
   * Estimated smile probability in [0, 1].
   * 0.0 = neutral/frown, 1.0 = strong smile.
   * [Req 16.1]
   */
  smileProbability: number;

  /**
   * Whether the subject's eyes appear to be oriented toward the camera.
   * [Req 16.3]
   */
  eyeContactDetected: boolean;
}

// ---------------------------------------------------------------------------
// MediaPipe landmark indices used for face analysis
// ---------------------------------------------------------------------------

const LM = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
} as const;

// ---------------------------------------------------------------------------
// Thresholds
// ---------------------------------------------------------------------------

/** Minimum landmark visibility required for face analysis. */
const MIN_VISIBILITY = 0.50;

/**
 * Eye x-symmetry tolerance: how asymmetric eyes can be before we consider
 * the subject to be turning away. Expressed as a fraction of the nose-to-ear
 * distance. Values below this threshold indicate forward-facing.
 */
const EYE_SYMMETRY_TOLERANCE = 0.15;

/**
 * Maximum absolute nose z-value (normalised) for "facing forward".
 * In MediaPipe normalised coords, |z| < this value means near-frontal.
 */
const NOSE_Z_FRONTAL_THRESHOLD = 0.15;

/**
 * How far above the mouth-midpoint the corners must be (as fraction of
 * mouth width) to register as a smile. Negative values = corners below midpoint.
 */
const SMILE_CORNER_RISE_THRESHOLD = 0.05;

// ---------------------------------------------------------------------------
// analyseFace — main entry point
// ---------------------------------------------------------------------------

/**
 * Analyse facial landmarks to estimate smile probability and eye contact.
 *
 * @param normalisedLandmarks - Normalised MediaPipe pose landmarks (33 points).
 * @returns FaceAnalysisResult
 *
 * [Req 16.1, 16.3]
 */
export function analyseFace(normalisedLandmarks: NormalisedLandmarks): FaceAnalysisResult {
  const lms = normalisedLandmarks.landmarks;

  return {
    smileProbability: _computeSmileProbability(lms),
    eyeContactDetected: _computeEyeContact(lms),
  };
}

// ---------------------------------------------------------------------------
// Smile probability
// ---------------------------------------------------------------------------

/**
 * Compute smile probability from mouth corner elevations.
 *
 * Strategy:
 *   1. Get mouth left (index 9) and mouth right (index 10) landmarks.
 *   2. Compute midpoint y-coordinate between the two.
 *   3. A "corner rise" occurs when both corners are above the midpoint.
 *   4. Map the rise magnitude to [0, 1] probability.
 *
 * Returns 0 when mouth landmarks are not confidently visible.
 */
function _computeSmileProbability(lms: NormalisedLandmarks['landmarks']): number {
  const mouthLeft = lms[LM.MOUTH_LEFT];
  const mouthRight = lms[LM.MOUTH_RIGHT];

  if (!_isVisible(mouthLeft) || !_isVisible(mouthRight)) {
    return 0;
  }

  // Mouth midpoint y (in normalised coords, smaller y = higher on screen)
  const midY = (mouthLeft.y + mouthRight.y) / 2;

  // Mouth width for normalisation
  const mouthWidth = Math.abs(mouthRight.x - mouthLeft.x);
  if (mouthWidth < 1e-6) return 0;

  // Rise: how much each corner is above the midpoint (negative y = higher up)
  const leftRise = midY - mouthLeft.y;
  const rightRise = midY - mouthRight.y;

  // Both corners must rise for a smile
  const minRise = Math.min(leftRise, rightRise);

  // Normalise rise by mouth width
  const normalisedRise = minRise / mouthWidth;

  if (normalisedRise < SMILE_CORNER_RISE_THRESHOLD) {
    return 0;
  }

  // Map normalised rise to [0, 1]:
  // 0.05 → ~0.0, 0.5 → ~1.0 (generous upper bound for a wide smile)
  const probability = Math.min(1, (normalisedRise - SMILE_CORNER_RISE_THRESHOLD) / 0.45);
  return Math.max(0, probability);
}

// ---------------------------------------------------------------------------
// Eye contact detection
// ---------------------------------------------------------------------------

/**
 * Detect whether the subject is looking toward the camera.
 *
 * Heuristic (two checks, both must pass):
 *  1. Eye symmetry: |leftEye.x − nose.x| ≈ |rightEye.x − nose.x|
 *     (eyes are roughly equidistant from nose → facing forward)
 *  2. Nose z-depth: |nose.z| < threshold
 *     (nose not heavily skewed in depth → not profile view)
 *
 * [Req 16.3]
 */
function _computeEyeContact(lms: NormalisedLandmarks['landmarks']): boolean {
  const nose = lms[LM.NOSE];
  const leftEye = lms[LM.LEFT_EYE];
  const rightEye = lms[LM.RIGHT_EYE];

  if (!_isVisible(nose) || !_isVisible(leftEye) || !_isVisible(rightEye)) {
    return false;
  }

  // Check 1: Eye x-symmetry around nose
  const leftOffset = Math.abs(leftEye.x - nose.x);
  const rightOffset = Math.abs(rightEye.x - nose.x);
  const meanOffset = (leftOffset + rightOffset) / 2;

  if (meanOffset < 1e-6) {
    // Degenerate case — landmarks on top of each other
    return false;
  }

  const asymmetry = Math.abs(leftOffset - rightOffset) / meanOffset;
  const isSymmetric = asymmetry < EYE_SYMMETRY_TOLERANCE;

  // Check 2: Nose z-depth (frontal vs profile)
  const isFrontal = Math.abs(nose.z) < NOSE_Z_FRONTAL_THRESHOLD;

  return isSymmetric && isFrontal;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function _isVisible(lm: { visibility: number }): boolean {
  return lm.visibility >= MIN_VISIBILITY;
}
