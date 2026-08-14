/**
 * LightingAnalyser — pure domain implementation.
 *
 * Analyses a camera frame's pixel data to produce a lighting score (0–100),
 * a condition classification, and actionable suggestions.
 *
 * Updates ≥ 5 times/sec at 30 FPS (every 6th frame). [Req 15.5]
 * [Req 15]
 */

import type {
  LightingScore,
  LightingCondition,
  LightingSuggestion,
  LightingAnalysisResult,
} from '../types';

// Re-export types for convenience — callers can import from here or from types.ts
export type { LightingScore, LightingCondition, LightingSuggestion, LightingAnalysisResult };

/**
 * @deprecated Use LightingAnalysisResult. Kept for backwards compatibility.
 */
export interface LightingResult {
  /** 0–100 overall lighting quality. */
  score: number;
  /** Dominant issue, or null when lighting is acceptable. */
  suggestion: LightingSuggestion;
  /** Whether lighting is acceptable (score ≥ 60). */
  acceptable: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ACCEPTABLE_THRESHOLD = 60;
const BACKLIGHT_RATIO_THRESHOLD = 0.35;
const LOW_BRIGHTNESS_THRESHOLD = 45;
const HIGH_BRIGHTNESS_THRESHOLD = 210;
const LOW_CONTRAST_THRESHOLD = 25;

// ---------------------------------------------------------------------------
// analyseFrame — main entry point
// ---------------------------------------------------------------------------

/**
 * Analyse a raw RGBA/grayscale pixel buffer.
 *
 * @param pixels - Flat Uint8Array of RGBA bytes (width × height × 4)
 * @param width  - Frame width in pixels
 * @param height - Frame height in pixels
 * @returns LightingAnalysisResult with score, condition, suggestion, and acceptable flag
 *
 * [Req 15.1, 15.2, 15.3, 15.5]
 */
export function analyseFrame(
  pixels: Uint8Array,
  width: number,
  height: number,
): LightingAnalysisResult {
  if (pixels.length === 0 || width === 0 || height === 0) {
    return { score: 50, condition: 'TOO_DARK', suggestion: null, acceptable: false };
  }

  const { brightness, contrast, backlightRatio } = computeMetrics(pixels, width, height);
  return scoreFromMetrics(brightness, contrast, backlightRatio);
}

/**
 * Analyse from pre-computed metrics (used when pixel analysis runs on JSI worklet).
 * Keeps scoring logic in pure TS domain layer.
 *
 * [Req 15.1, 15.2, 15.3]
 */
export function scoreFromMetrics(
  brightness: number,
  contrast: number,
  backlightRatio: number,
): LightingAnalysisResult {
  // ── Detect backlight ─────────────────────────────────────────────────────
  if (backlightRatio > BACKLIGHT_RATIO_THRESHOLD) {
    const score = Math.round(Math.max(10, 60 - backlightRatio * 100));
    return { score, condition: 'BACKLIT', suggestion: 'Avoid backlight.', acceptable: false };
  }

  // ── Detect low brightness ────────────────────────────────────────────────
  if (brightness < LOW_BRIGHTNESS_THRESHOLD) {
    const score = Math.round((brightness / LOW_BRIGHTNESS_THRESHOLD) * 50);
    const suggestion: LightingSuggestion =
      brightness < 20 ? 'Increase exposure.' : 'Face the window.';
    return { score, condition: 'TOO_DARK', suggestion, acceptable: false };
  }

  // ── Detect overexposure ──────────────────────────────────────────────────
  if (brightness > HIGH_BRIGHTNESS_THRESHOLD) {
    const overshoot = brightness - HIGH_BRIGHTNESS_THRESHOLD;
    const score = Math.round(Math.max(20, 80 - overshoot / 2));
    const acceptable = score >= ACCEPTABLE_THRESHOLD;
    return {
      score,
      condition: 'OVEREXPOSED',
      suggestion: 'Turn toward the light.',
      acceptable,
    };
  }

  // ── Detect low contrast ──────────────────────────────────────────────────
  if (contrast < LOW_CONTRAST_THRESHOLD) {
    const score = Math.round(50 + (contrast / LOW_CONTRAST_THRESHOLD) * 30);
    const acceptable = score >= ACCEPTABLE_THRESHOLD;
    return {
      score,
      condition: acceptable ? 'GOOD' : 'TOO_DARK',
      suggestion: acceptable ? null : 'Turn toward the light.',
      acceptable,
    };
  }

  // ── Ideal lighting ───────────────────────────────────────────────────────
  // Map brightness 45–210 → score 60–100
  const score = Math.round(
    60 + ((brightness - LOW_BRIGHTNESS_THRESHOLD) /
      (HIGH_BRIGHTNESS_THRESHOLD - LOW_BRIGHTNESS_THRESHOLD)) * 40,
  );
  const clamped = Math.max(0, Math.min(100, score));
  return { score: clamped, condition: 'GOOD', suggestion: null, acceptable: clamped >= ACCEPTABLE_THRESHOLD };
}

// ---------------------------------------------------------------------------
// Legacy wrapper — returns the old LightingResult shape
// ---------------------------------------------------------------------------

/**
 * @deprecated Use analyseFrame which returns LightingAnalysisResult.
 * Retained for backwards compatibility with existing callers.
 */
export function analyseFrameLegacy(
  pixels: Uint8Array,
  width: number,
  height: number,
): LightingResult {
  const result = analyseFrame(pixels, width, height);
  return { score: result.score, suggestion: result.suggestion, acceptable: result.acceptable };
}

// ---------------------------------------------------------------------------
// Pixel metric computation
// ---------------------------------------------------------------------------

interface FrameMetrics {
  /** Mean luminance 0–255. */
  brightness: number;
  /** Standard deviation of luminance (contrast proxy). */
  contrast: number;
  /** Fraction of pixels significantly brighter than mean (backlight proxy). */
  backlightRatio: number;
}

function computeMetrics(pixels: Uint8Array, width: number, height: number): FrameMetrics {
  // Sample every 8th pixel row and column for speed
  const step = 8;
  let lumSum = 0;
  let lumSumSq = 0;
  let count = 0;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const r = pixels[idx] ?? 128;
      const g = pixels[idx + 1] ?? 128;
      const b = pixels[idx + 2] ?? 128;
      // BT.709 luminance
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      lumSum += lum;
      lumSumSq += lum * lum;
      count++;
    }
  }

  if (count === 0) return { brightness: 128, contrast: 30, backlightRatio: 0 };

  const brightness = lumSum / count;
  const variance = lumSumSq / count - brightness * brightness;
  const contrast = Math.sqrt(Math.max(0, variance));

  // Backlight: fraction of sampled pixels that are very bright (lum > 200)
  // Re-pass for backlight ratio
  let brightPixels = 0;
  let totalSampled = 0;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const r = pixels[idx] ?? 128;
      const g = pixels[idx + 1] ?? 128;
      const b = pixels[idx + 2] ?? 128;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (lum > 200) brightPixels++;
      totalSampled++;
    }
  }
  const backlightRatio = totalSampled > 0 ? brightPixels / totalSampled : 0;

  return { brightness, contrast, backlightRatio };
}
