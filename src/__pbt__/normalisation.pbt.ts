/**
 * Property-Based Tests for LandmarkNormaliser
 * [Req 42, 38, 46]
 *
 * Properties tested:
 * 1. Scale invariance: normalise(scale(L, s)) === normalise(L) for all s > 0
 * 2. Translation invariance: normalise(translate(L, dx, dy)) === normalise(L)
 * 3. Confidence thresholding: sets with < 17 confident landmarks are rejected
 */

import fc from 'fast-check';
import {
  normaliseLandmarks,
  type NormaliseOutcome,
} from '../features/ai/domain/LandmarkNormaliser';
import { getReferenceSkeletonForKey } from '../features/ai/domain/PoseScoreCalculator';
import type { PoseLandmarks, Landmark } from '../features/ai/types';

describe('LandmarkNormaliser Property-Based Tests', () => {
  const baseValidSkeleton = getReferenceSkeletonForKey('OVER_SHOULDER') as PoseLandmarks;

  it('Property 1: Scale invariance — scaling input by factor s > 0 produces identical normalised coordinates within 1e-4 tolerance', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.1, max: 10.0, noNaN: true }),
        (scaleFactor) => {
          const scaledSkeleton = baseValidSkeleton.map((lm) => ({
            ...lm,
            x: lm.x * scaleFactor,
            y: lm.y * scaleFactor,
            z: lm.z * scaleFactor,
          })) as PoseLandmarks;

          const resBase = normaliseLandmarks(baseValidSkeleton);
          const resScaled = normaliseLandmarks(scaledSkeleton);

          if (!resBase.ok || !resScaled.ok) return false;

          return resBase.normalised.every((lm, i) => {
            const scaledLm = resScaled.normalised[i];
            return (
              Math.abs(lm.x - scaledLm.x) < 1e-4 &&
              Math.abs(lm.y - scaledLm.y) < 1e-4
            );
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Translation invariance — translating input by (dx, dy) produces identical normalised coordinates within 1e-4 tolerance', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -500, max: 500, noNaN: true }),
        fc.double({ min: -500, max: 500, noNaN: true }),
        (dx, dy) => {
          const translatedSkeleton = baseValidSkeleton.map((lm) => ({
            ...lm,
            x: lm.x + dx,
            y: lm.y + dy,
          })) as PoseLandmarks;

          const resBase = normaliseLandmarks(baseValidSkeleton);
          const resTranslated = normaliseLandmarks(translatedSkeleton);

          if (!resBase.ok || !resTranslated.ok) return false;

          return resBase.normalised.every((lm, i) => {
            const transLm = resTranslated.normalised[i];
            return (
              Math.abs(lm.x - transLm.x) < 1e-4 &&
              Math.abs(lm.y - transLm.y) < 1e-4
            );
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: Confidence thresholding — rejects inputs with fewer than 17 landmarks above 0.60 visibility', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 16 }),
        (confidentCount) => {
          const degradedSkeleton = baseValidSkeleton.map((lm, i) => ({
            ...lm,
            visibility: i < confidentCount ? 0.9 : 0.2,
          })) as PoseLandmarks;

          const result = normaliseLandmarks(degradedSkeleton);
          return !result.ok && result.reason === 'insufficient_landmarks';
        }
      ),
      { numRuns: 50 }
    );
  });
});
