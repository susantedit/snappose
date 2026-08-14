import {
  computePoseScore,
  getReferenceSkeletonForKey,
  REGION_WEIGHTS,
  LM,
  AUTO_CAPTURE_THRESHOLD,
} from '../PoseScoreCalculator';
import type { NormalisedLandmarks, Landmark } from '../../types';

describe('PoseScoreCalculator', () => {
  it('loads all 5 reference skeletons with 33 landmarks', () => {
    const keys = [
      'OVER_SHOULDER',
      'WALKING_CASUAL',
      'SEATED_CAFE',
      'MIRROR_SELFIE',
      'COUPLE_EMBRACE',
    ] as const;

    for (const key of keys) {
      const skeleton = getReferenceSkeletonForKey(key);
      expect(skeleton).toHaveLength(33);
      for (const lm of skeleton) {
        expect(typeof lm.x).toBe('number');
        expect(typeof lm.y).toBe('number');
        expect(typeof lm.visibility).toBe('number');
      }
    }
  });

  it('evaluates exact reference pose with score >= 94 and auto-capture ready', () => {
    const skeleton = getReferenceSkeletonForKey('OVER_SHOULDER');
    const result = computePoseScore(skeleton, 'OVER_SHOULDER');

    expect(result.overallScore).toBeGreaterThanOrEqual(94);
    expect(result.isAutoCaptureReady).toBe(true);
    expect(result.regionalScores.torso).toBeGreaterThanOrEqual(90);
    expect(result.regionalScores.shoulders).toBeGreaterThanOrEqual(90);
  });

  it('evaluates completely misaligned pose with low score and appropriate correction cue', () => {
    // Generate an inverted/misaligned skeleton
    const ref = getReferenceSkeletonForKey('OVER_SHOULDER');
    const inverted: NormalisedLandmarks = ref.map((lm) => ({
      ...lm,
      x: -lm.x,
      y: -lm.y,
    }));

    const result = computePoseScore(inverted, 'OVER_SHOULDER');
    expect(result.overallScore).toBeLessThan(70);
    expect(result.isAutoCaptureReady).toBe(false);
    expect(result.primaryGuidanceCue).toBeDefined();
  });

  it('region weights sum to exactly 100', () => {
    const sum = Object.values(REGION_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
  });

  it('clamps overall score within [15, 98]', () => {
    const ref = getReferenceSkeletonForKey('SEATED_CAFE');
    const perfectResult = computePoseScore(ref, 'SEATED_CAFE');
    expect(perfectResult.overallScore).toBeLessThanOrEqual(98);

    const terribleLandmarks: NormalisedLandmarks = Array(33).fill({
      x: 9999,
      y: 9999,
      z: 9999,
      visibility: 1,
    });
    const terribleResult = computePoseScore(terribleLandmarks, 'SEATED_CAFE');
    expect(terribleResult.overallScore).toBeGreaterThanOrEqual(15);
  });
});
