/**
 * Camera feature types.
 * [Req 8, 9, 14, 15, 16]
 */

export interface OverlayTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  mirrored: boolean;
}

// ---------------------------------------------------------------------------
// Distance estimation [Req 14]
// ---------------------------------------------------------------------------

/**
 * Subject-to-camera distance state.
 * Displayed as a coloured indicator on the Camera screen.
 *   'too_close' → Red
 *   'good'       → Green
 *   'too_far'    → Red
 * [Req 14.2]
 */
export type DistanceState = 'too_close' | 'good' | 'too_far';

// ---------------------------------------------------------------------------
// Lighting analysis [Req 15]
// ---------------------------------------------------------------------------

/**
 * Lighting quality score — integer 0–100.
 * 0 = very dark or heavily backlit, 100 = optimal.
 * [Req 15.3]
 */
export type LightingScore = number;

/**
 * High-level lighting condition classification.
 * Used to drive suggestion copy and indicator colour.
 * [Req 15]
 */
export type LightingCondition = 'GOOD' | 'TOO_DARK' | 'BACKLIT' | 'OVEREXPOSED';

/**
 * Actionable lighting suggestion shown to the user.
 * Null when condition is GOOD.
 * [Req 15.2]
 */
export type LightingSuggestion =
  | 'Turn toward the light.'
  | 'Avoid backlight.'
  | 'Increase exposure.'
  | 'Face the window.'
  | null;

/**
 * Full lighting analysis result produced by LightingAnalyser.
 * [Req 15]
 */
export interface LightingAnalysisResult {
  /** Overall lighting quality 0–100. */
  score: LightingScore;
  /** High-level condition classification. */
  condition: LightingCondition;
  /** Actionable suggestion, or null when lighting is acceptable. */
  suggestion: LightingSuggestion;
  /** True when score ≥ 60 (lighting is acceptable for capture). */
  acceptable: boolean;
}

/** @deprecated Use LightingAnalysisResult. Kept for backwards compatibility. */
export interface LightingAnalysis {
  score: number;
  suggestions: string[];
}

// ---------------------------------------------------------------------------
// Face analysis [Req 16]
// ---------------------------------------------------------------------------

/**
 * Smile and eye-contact analysis result produced by FaceAnalyser.
 * [Req 16.1, 16.3]
 */
export interface FaceAnalysisResult {
  /**
   * Smile probability in [0, 1].
   * 0.0 = neutral/frown, 1.0 = strong smile.
   */
  smileProbability: number;
  /** Whether the subject appears to be looking toward the camera. */
  eyeContactDetected: boolean;
}

// ---------------------------------------------------------------------------
// Camera controls
// ---------------------------------------------------------------------------

export type FlashMode = 'auto' | 'on' | 'off';

export type GridType = 'thirds' | 'golden' | 'none';

export type TimerDuration = 3 | 5 | 10 | null;
