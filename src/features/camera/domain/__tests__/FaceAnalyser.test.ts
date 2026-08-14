/**
 * Unit tests for FaceAnalyser.
 * [Req 16]
 */

import { analyseFace } from '../FaceAnalyser';
import type { NormalisedLandmarks, PoseLandmarks, Landmark } from '@/features/ai/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal 33-landmark array with sensible defaults. */
function makeLandmarks(overrides: Partial<Record<number, Partial<Landmark>>> = {}): NormalisedLandmarks {
  const defaults: Landmark = { x: 0.5, y: 0.5, z: 0, visibility: 0.9 };

  const lms = Array.from({ length: 33 }, (_, i) => ({
    ...defaults,
    ...(overrides[i] ?? {}),
  })) as PoseLandmarks;

  return { landmarks: lms, referenceScale: 1 };
}

/**
 * Build landmarks that represent a forward-facing subject with no smile.
 *
 * Landmark positions:
 *   Nose (0): centre, z≈0
 *   Left eye (2): slightly left of nose
 *   Right eye (5): slightly right of nose (symmetric)
 *   Mouth left (9): left corner at same y as mouth right
 *   Mouth right (10): right corner at same y as mouth left
 */
function makeForwardFaceNeutral(): NormalisedLandmarks {
  return makeLandmarks({
    0: { x: 0.50, y: 0.30, z: 0.02, visibility: 0.95 },  // Nose
    1: { x: 0.46, y: 0.28, z: 0.01, visibility: 0.90 },  // Left eye inner
    2: { x: 0.44, y: 0.28, z: 0.01, visibility: 0.90 },  // Left eye
    3: { x: 0.42, y: 0.28, z: 0.01, visibility: 0.90 },  // Left eye outer
    4: { x: 0.54, y: 0.28, z: 0.01, visibility: 0.90 },  // Right eye inner
    5: { x: 0.56, y: 0.28, z: 0.01, visibility: 0.90 },  // Right eye
    6: { x: 0.58, y: 0.28, z: 0.01, visibility: 0.90 },  // Right eye outer
    9: { x: 0.44, y: 0.36, z: 0, visibility: 0.90 },     // Mouth left (neutral)
    10: { x: 0.56, y: 0.36, z: 0, visibility: 0.90 },    // Mouth right (neutral)
  });
}

/**
 * Build landmarks representing a smiling subject:
 * Mouth corners elevated above the midpoint.
 */
function makeSmileFace(): NormalisedLandmarks {
  return makeLandmarks({
    0: { x: 0.50, y: 0.30, z: 0.02, visibility: 0.95 },  // Nose
    2: { x: 0.44, y: 0.28, z: 0.01, visibility: 0.90 },  // Left eye
    5: { x: 0.56, y: 0.28, z: 0.01, visibility: 0.90 },  // Right eye
    // Mouth: corners raised well above midpoint
    // midY = (0.30 + 0.30) / 2 = 0.30; width = 0.56 - 0.44 = 0.12
    // rise per corner = 0.30 - 0.27 = 0.03... use more pronounced smile
    // midY = (0.28 + 0.28) / 2 = 0.28; both at 0.24 → rise = 0.04; width = 0.12 → normRise = 0.33
    9: { x: 0.44, y: 0.24, z: 0, visibility: 0.90 },    // Mouth left (raised = smile)
    10: { x: 0.56, y: 0.24, z: 0, visibility: 0.90 },   // Mouth right (raised = smile)
  });
}

// ---------------------------------------------------------------------------
// Smile probability tests
// ---------------------------------------------------------------------------

describe('analyseFace — smile probability', () => {
  it('returns smileProbability = 0 for a neutral mouth', () => {
    const result = analyseFace(makeForwardFaceNeutral());
    expect(result.smileProbability).toBe(0);
  });

  it('returns smileProbability > 0 when mouth corners are elevated', () => {
    const result = analyseFace(makeSmileFace());
    expect(result.smileProbability).toBeGreaterThan(0);
  });

  it('returns smileProbability ≤ 1 always', () => {
    const result = analyseFace(makeSmileFace());
    expect(result.smileProbability).toBeLessThanOrEqual(1);
  });

  it('returns smileProbability = 0 when mouth landmarks have low visibility', () => {
    const lms = makeForwardFaceNeutral();
    // Force low visibility on mouth landmarks
    lms.landmarks[9] = { ...lms.landmarks[9], visibility: 0.1 };
    lms.landmarks[10] = { ...lms.landmarks[10], visibility: 0.1 };
    const result = analyseFace(lms);
    expect(result.smileProbability).toBe(0);
  });

  it('returns smileProbability = 0 when mouth width is zero', () => {
    const lms = makeLandmarks({
      9: { x: 0.5, y: 0.36, z: 0, visibility: 0.9 },
      10: { x: 0.5, y: 0.36, z: 0, visibility: 0.9 }, // same x → zero width
    });
    expect(analyseFace(lms).smileProbability).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Eye contact detection tests
// ---------------------------------------------------------------------------

describe('analyseFace — eye contact detection', () => {
  it('detects eye contact for symmetric forward-facing landmarks', () => {
    const result = analyseFace(makeForwardFaceNeutral());
    expect(result.eyeContactDetected).toBe(true);
  });

  it('does not detect eye contact when subject is turned to the side (high nose z)', () => {
    const lms = makeForwardFaceNeutral();
    // High z means turned away from camera
    lms.landmarks[0] = { ...lms.landmarks[0], z: 0.5 };
    expect(analyseFace(lms).eyeContactDetected).toBe(false);
  });

  it('does not detect eye contact when eyes are asymmetric (turned face)', () => {
    const lms = makeForwardFaceNeutral();
    // Left eye much closer to nose than right → subject turned right
    lms.landmarks[2] = { ...lms.landmarks[2], x: 0.49 }; // almost on nose
    // right eye still at 0.56
    expect(analyseFace(lms).eyeContactDetected).toBe(false);
  });

  it('returns false when nose landmark has low visibility', () => {
    const lms = makeForwardFaceNeutral();
    lms.landmarks[0] = { ...lms.landmarks[0], visibility: 0.1 };
    expect(analyseFace(lms).eyeContactDetected).toBe(false);
  });

  it('returns false when eye landmarks have low visibility', () => {
    const lms = makeForwardFaceNeutral();
    lms.landmarks[2] = { ...lms.landmarks[2], visibility: 0.1 };
    lms.landmarks[5] = { ...lms.landmarks[5], visibility: 0.1 };
    expect(analyseFace(lms).eyeContactDetected).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Result shape
// ---------------------------------------------------------------------------

describe('analyseFace — result shape', () => {
  it('always returns an object with smileProbability and eyeContactDetected', () => {
    const result = analyseFace(makeForwardFaceNeutral());
    expect(result).toHaveProperty('smileProbability');
    expect(result).toHaveProperty('eyeContactDetected');
    expect(typeof result.smileProbability).toBe('number');
    expect(typeof result.eyeContactDetected).toBe('boolean');
  });

  it('smileProbability is always in [0, 1]', () => {
    for (const face of [makeForwardFaceNeutral(), makeSmileFace()]) {
      const { smileProbability } = analyseFace(face);
      expect(smileProbability).toBeGreaterThanOrEqual(0);
      expect(smileProbability).toBeLessThanOrEqual(1);
    }
  });
});
