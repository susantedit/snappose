/**
 * DistanceEstimator — pure domain implementation.
 *
 * Estimates subject-to-camera distance using the shoulder width ratio
 * relative to frame width and body bounding box height.
 *
 * Three output states: 'too_close' | 'good' | 'too_far' [Req 14.2]
 *
 * Algorithm:
 *   shoulderWidthRatio = |rightShoulder.x − leftShoulder.x| / frameWidth
 *
 *   - shoulderWidthRatio > TOO_CLOSE_RATIO  → too_close
 *   - shoulderWidthRatio < TOO_FAR_RATIO    → too_far
 *   - otherwise                             → good
 *
 * Thresholds calibrated so that the subject fills roughly 25–55% of
 * the frame width at "good" distance for a typical portrait shoot.
 *
 * Zero external dependencies — pure TypeScript, runs in Node.
 * [Req 14, 47.3]
 */

import type { DistanceState } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Normalised (0–1) landmark position. */
export interface NormalisedPoint {
  /** Normalised horizontal position [0, 1] relative to frame width. */
  x: number;
  /** Normalised vertical position [0, 1] relative to frame height. */
  y: number;
  /** Landmark confidence/visibility [0, 1]. */
  visibility?: number;
}

export interface DistanceInput {
  /** Left shoulder landmark (MediaPipe index 11). */
  leftShoulder: NormalisedPoint;
  /** Right shoulder landmark (MediaPipe index 12). */
  rightShoulder: NormalisedPoint;
  /**
   * Normalised height of the body bounding box [0, 1].
   * Optional — used as a secondary signal when shoulder visibility is low.
   */
  bodyBoundingBoxHeight?: number;
}

// ---------------------------------------------------------------------------
// Thresholds
// ---------------------------------------------------------------------------

/**
 * Shoulder width ratio (as fraction of frame width) above which the
 * subject is considered too close.
 *
 * > 0.55 → subject is very close; shoulders span more than half the frame.
 */
const TOO_CLOSE_RATIO = 0.55;

/**
 * Shoulder width ratio below which the subject is considered too far.
 *
 * < 0.15 → subject is tiny; shoulders are less than 15% of frame width.
 */
const TOO_FAR_RATIO = 0.15;

/**
 * Minimum confidence required for a shoulder landmark to be used.
 * Falls back to bounding-box heuristic below this threshold.
 */
const MIN_CONFIDENCE = 0.60;

/**
 * Body bounding-box height ratio thresholds (secondary signal).
 * Used when shoulder landmark confidence is insufficient.
 */
const BBOX_TOO_CLOSE_RATIO = 0.80;
const BBOX_TOO_FAR_RATIO = 0.25;

// ---------------------------------------------------------------------------
// estimateDistance
// ---------------------------------------------------------------------------

/**
 * Estimate the subject's distance from the camera.
 *
 * Returns 'too_close', 'good', or 'too_far' based on shoulder width
 * relative to frame width. Falls back to body bounding-box height
 * when shoulder confidence is below the threshold.
 *
 * @param input - Shoulder landmarks and optional bounding box data.
 * @returns DistanceState
 *
 * [Req 14.1, 14.2, 14.3, 14.4]
 */
export function estimateDistance(input: DistanceInput): DistanceState {
  const { leftShoulder, rightShoulder, bodyBoundingBoxHeight } = input;

  const leftConf = leftShoulder.visibility ?? 1;
  const rightConf = rightShoulder.visibility ?? 1;
  const shouldersConfident = leftConf >= MIN_CONFIDENCE && rightConf >= MIN_CONFIDENCE;

  if (shouldersConfident) {
    return _estimateFromShoulders(leftShoulder.x, rightShoulder.x);
  }

  // Fallback: bounding box height
  if (bodyBoundingBoxHeight !== undefined && bodyBoundingBoxHeight > 0) {
    return _estimateFromBoundingBox(bodyBoundingBoxHeight);
  }

  // Insufficient data — default to 'good' to avoid false negatives
  return 'good';
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function _estimateFromShoulders(leftX: number, rightX: number): DistanceState {
  const widthRatio = Math.abs(rightX - leftX);

  if (widthRatio > TOO_CLOSE_RATIO) return 'too_close';
  if (widthRatio < TOO_FAR_RATIO) return 'too_far';
  return 'good';
}

function _estimateFromBoundingBox(bboxHeight: number): DistanceState {
  if (bboxHeight > BBOX_TOO_CLOSE_RATIO) return 'too_close';
  if (bboxHeight < BBOX_TOO_FAR_RATIO) return 'too_far';
  return 'good';
}

// ---------------------------------------------------------------------------
// Re-export DistanceState for convenience
// ---------------------------------------------------------------------------
export type { DistanceState };
