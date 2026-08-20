/**
 * Domain-level type aliases and data classes for the AI pose scoring module.
 *
 * These types are ported from PoseMatcher.kt (Android) and form the contract
 * between the domain layer and everything that depends on pose scoring.
 *
 * Zero external dependencies — pure TypeScript, runs in Node and on-device.
 *
 * [Req 11, 47.3]
 */

// Re-export shared feature types that the domain layer owns conceptually.
export type {
  Landmark,
  PoseLandmarks,
  NormalisedLandmarks,
  PoseScore,
  GuidanceCue,
  CameraFrame,
  LandmarkSet,
  ParseError,
  ParseResult,
} from '../types';
export { isParseError } from '../types';

// ---------------------------------------------------------------------------
// KeyPoint — port of the Kotlin KeyPoint data class
// ---------------------------------------------------------------------------

/**
 * A single 2D body keypoint used by the pose scoring algorithm.
 * Corresponds to the Kotlin `data class KeyPoint(val x: Float, val y: Float,
 * val confidence: Float)` from PoseMatcher.kt.
 *
 * In MediaPipe coordinates: x and y are normalised to [0, 1] relative to the
 * image width and height respectively.
 */
export interface KeyPoint {
  /** Normalised horizontal position [0, 1]. */
  x: number;
  /** Normalised vertical position [0, 1]. */
  y: number;
  /** Landmark confidence/visibility score [0, 1]. */
  confidence: number;
}

// ---------------------------------------------------------------------------
// RegionScores — per-region score breakdown
// ---------------------------------------------------------------------------

/**
 * Per-region score breakdown for visual coaching skeleton colouring.
 * [Req 11.2, Req 12.2]
 */
export interface RegionScores {
  shoulders: number;   // weight 15%
  arms: number;        // weight 20%
  hands: number;       // weight 10%
  torso: number;       // weight 20%
  legs: number;        // weight 20%
  head: number;        // weight 10%
  feet: number;        // weight 5%
}

// ---------------------------------------------------------------------------
// PoseMatchResult — port of the Kotlin PoseMatchResult data class
// ---------------------------------------------------------------------------

/**
 * The result of a single pose-match evaluation.
 * Corresponds to the Kotlin `data class PoseMatchResult(
 *   val score: Int, val guidanceCue: String?, val isAutoCaptureReady: Boolean,
 *   val regionScores: RegionScores
 * )` from PoseMatcher.kt.
 */
export interface PoseMatchResult {
  /**
   * Overall pose similarity score, coerced to [15, 98] internally but
   * reported as a [0, 100] integer for consumers.
   * [Req 11.1]
   */
  score: number;

  /**
   * The single highest-priority real-time guidance cue to display to the user.
   * Null when the pose is aligned well enough for auto-capture.
   * [Req 12.3, Req 13.4]
   */
  guidanceCue: string | null;

  /**
   * Whether the current score meets the auto-capture threshold (≥ 94 by default).
   * [Req 17.1]
   */
  isAutoCaptureReady: boolean;

  /**
   * Per-region score breakdown for visual coaching skeleton colouring.
   * [Req 12.2]
   */
  regionScores: RegionScores;
}

// ---------------------------------------------------------------------------
// ReferencePoseKey — identifies one of the five built-in reference skeletons
// ---------------------------------------------------------------------------

/**
 * Keys for the five built-in reference pose skeletons.
 * Ported from the Kotlin enum in PoseMatcher.kt.
 */
export type ReferencePoseKey =
  | 'OVER_SHOULDER'
  | 'WALKING_CASUAL'
  | 'SEATED_CAFE'
  | 'MIRROR_SELFIE'
  | 'COUPLE_EMBRACE';

// ---------------------------------------------------------------------------
// Strict AI Detection Status Contract
// ---------------------------------------------------------------------------

export type AiDetectionStatus =
  | 'REAL_LANDMARKS'      // Full body tracked with high confidence (single subject)
  | 'NO_PERSON'           // No person detected in frame
  | 'LOW_CONFIDENCE'      // Partial body / key joints obscured
  | 'MULTIPLE_PEOPLE'     // Multiple people detected in frame (safety lockout)
  | 'PROCESSING'          // Frame buffer is being analyzed
  | 'FALLBACK_DISABLED'   // Fake/simulation fallback disabled; waiting for live stream
  | 'UNINITIALISED'       // Engine not yet initialized
  | 'FAILED';             // Inference error


