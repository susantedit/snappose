import { normaliseLandmarks } from '../LandmarkNormaliser';
import { getReferenceSkeletonForKey } from '../PoseScoreCalculator';
import type { PoseLandmarks } from '../../types';

describe('LandmarkNormaliser', () => {
  const baseValidSkeleton = getReferenceSkeletonForKey('MIRROR_SELFIE') as PoseLandmarks;

  it('successfully normalises valid 33-landmark skeleton', () => {
    const outcome = normaliseLandmarks(baseValidSkeleton);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.normalised).toHaveLength(33);
      // Hip midpoint should be centered near origin (0, 0)
      const leftHip = outcome.normalised[23];
      const rightHip = outcome.normalised[24];
      const hipMidX = (leftHip.x + rightHip.x) / 2;
      const hipMidY = (leftHip.y + rightHip.y) / 2;
      expect(Math.abs(hipMidX)).toBeLessThan(1e-4);
      expect(Math.abs(hipMidY)).toBeLessThan(1e-4);
    }
  });

  it('rejects landmarks with fewer than 17 confident points (< 0.60 visibility)', () => {
    const occludedSkeleton = baseValidSkeleton.map((lm, index) => ({
      ...lm,
      visibility: index < 10 ? 0.9 : 0.1, // only 10 points above 0.60
    })) as PoseLandmarks;

    const outcome = normaliseLandmarks(occludedSkeleton);
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.reason).toBe('insufficient_landmarks');
    }
  });

  it('rejects degenerate skeleton with zero shoulder-to-hip distance', () => {
    const collapsedSkeleton = baseValidSkeleton.map((lm) => ({
      ...lm,
      x: 0,
      y: 0,
      visibility: 1.0,
    })) as PoseLandmarks;

    const outcome = normaliseLandmarks(collapsedSkeleton);
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.reason).toBe('degenerate_scale');
    }
  });
});
