/**
 * Property-Based Tests for PoseScoreCalculator
 * [Req 11, 38, 46]
 *
 * Properties tested:
 * 1. Score range [0, 100] invariant (coerced within 15–98)
 * 2. Identity match produces score >= 94
 * 3. Regional weights sum to exactly 100%
 * 4. Monotonicity of score relative to perturbation
 */

import fc from 'fast-check';
import {
  computePoseScore,
  REGION_WEIGHTS,
  getReferenceSkeletonForKey,
  AUTO_CAPTURE_THRESHOLD,
} from '../features/ai/domain/PoseScoreCalculator';
import type { NormalisedLandmarks, Landmark } from '../features/ai/types';

// Arbitrary Landmark generator: normalized coords within [-2, 2]
const arbLandmark = fc.record({
  x: fc.double({ min: -2, max: 2, noNaN: true }),
  y: fc.double({ min: -2, max: 2, noNaN: true }),
  z: fc.double({ min: -2, max: 2, noNaN: true }),
  visibility: fc.double({ min: 0.6, max: 1.0, noNaN: true }),
});

// Arbitrary 33-landmark set generator
const arb33Landmarks = fc.array(arbLandmark, { minLength: 33, maxLength: 33 }) as fc.Arbitrary<NormalisedLandmarks>;

describe('PoseScoreCalculator Property-Based Tests', () => {
  it('Property 1: Regional weights must sum to exactly 100', () => {
    const totalWeight = Object.values(REGION_WEIGHTS).reduce((sum, w) => sum + w, 0);
    expect(totalWeight).toBe(100);
  });

  it('Property 2: Output score must always be bounded in [15, 98] for arbitrary inputs', () => {
    fc.assert(
      fc.property(arb33Landmarks, (landmarks) => {
        const result = computePoseScore(landmarks, 'OVER_SHOULDER');
        return result.overallScore >= 15 && result.overallScore <= 98;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 3: Identity match of a reference skeleton produces high score (>= 94)', () => {
    const referenceKeys = [
      'OVER_SHOULDER',
      'WALKING_CASUAL',
      'SEATED_CAFE',
      'MIRROR_SELFIE',
      'COUPLE_EMBRACE',
    ] as const;

    for (const key of referenceKeys) {
      const refSkeleton = getReferenceSkeletonForKey(key);
      const result = computePoseScore(refSkeleton, key);
      expect(result.overallScore).toBeGreaterThanOrEqual(94);
      expect(result.isAutoCaptureReady).toBe(true);
    }
  });

  it('Property 4: Small perturbations on reference skeleton produce higher scores than large random distortions', () => {
    const refSkeleton = getReferenceSkeletonForKey('WALKING_CASUAL');

    fc.assert(
      fc.property(
        fc.double({ min: 0.001, max: 0.02, noNaN: true }),
        fc.double({ min: 0.5, max: 1.5, noNaN: true }),
        (smallNoise, largeNoise) => {
          const smallJittered: NormalisedLandmarks = refSkeleton.map((lm) => ({
            ...lm,
            x: lm.x + (Math.random() - 0.5) * smallNoise,
            y: lm.y + (Math.random() - 0.5) * smallNoise,
          }));

          const largeJittered: NormalisedLandmarks = refSkeleton.map((lm) => ({
            ...lm,
            x: lm.x + (Math.random() - 0.5) * largeNoise,
            y: lm.y + (Math.random() - 0.5) * largeNoise,
          }));

          const scoreSmall = computePoseScore(smallJittered, 'WALKING_CASUAL').overallScore;
          const scoreLarge = computePoseScore(largeJittered, 'WALKING_CASUAL').overallScore;

          return scoreSmall >= scoreLarge;
        }
      ),
      { numRuns: 50 }
    );
  });
});
