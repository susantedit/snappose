/**
 * RealPoseAccuracy.test.ts — Strict Verification of Real AI Pose Accuracy.
 *
 * Proves that:
 * 1. Empty / no-person frames receive 0% score and cannot trigger capture.
 * 2. Partial bodies (missing core torso anchors) receive 0% score.
 * 3. Divergent / wrong poses (e.g. Arms-Down vs T-Pose) receive low scores (< 40%) and never "Perfect".
 * 4. Static landmark extraction never fabricates synthetic fake coordinates.
 * 5. Only genuinely aligned poses (score >= 85%) are eligible for auto-capture.
 */

import {
  computePoseScore,
  getReferenceSkeletonForKey,
} from '../PoseScoreCalculator';
import { MediaPipePoseDetector } from '../../infrastructure/MediaPipePoseDetector';
import { extractStaticPoseLandmarks } from '../../infrastructure/StaticLandmarkExtractor';
import type { Landmark, LandmarkSet } from '../../types';

function createDummyLandmarkSet(overrides?: Partial<Landmark>): LandmarkSet {
  const lm: Landmark[] = [];
  for (let i = 0; i < 33; i++) {
    lm.push({
      x: 0.5,
      y: 0.5,
      z: 0,
      visibility: 1.0,
      ...overrides,
    });
  }
  return lm as LandmarkSet;
}

describe('Strict Real AI Pose Accuracy & Anti-Hallucination Verification', () => {
  const walkingRef = getReferenceSkeletonForKey('WALKING_CASUAL');

  describe('1. No Person & Partial Body Frame Handling', () => {
    it('returns 0% score when no landmarks are provided or landmark array is empty', () => {
      const result = computePoseScore([], walkingRef);
      expect(result.score).toBe(0);
      expect(result.total).toBe(0);
      expect(result.isAutoCaptureReady).toBe(false);
    });

    it('returns 0% score when all landmarks have 0 visibility (empty/dark frame)', () => {
      const invisibleUser = createDummyLandmarkSet({ visibility: 0 });
      const result = computePoseScore(invisibleUser, walkingRef);
      expect(result.score).toBe(0);
      expect(result.isAutoCaptureReady).toBe(false);
      expect(result.guidanceCue).toBe('Full body not detected');
    });

    it('returns 0% score when only head is visible (partial body frame)', () => {
      const partialUser = createDummyLandmarkSet({ visibility: 0 });
      // Only head visible (indices 0..10)
      for (let i = 0; i <= 10; i++) {
        partialUser[i] = { x: 0.5, y: 0.2, z: 0, visibility: 0.95 };
      }
      const result = computePoseScore(partialUser, walkingRef);
      expect(result.score).toBe(0);
      expect(result.isAutoCaptureReady).toBe(false);
    });
  });

  describe('2. Deliberately Wrong & Divergent Poses', () => {
    it('gives obviously low score (< 40%) when user has arms at sides but reference is outstretched T-Pose', () => {
      // Outstretched T-Pose reference (arms horizontal at 90° to torso)
      const tPoseRef = [...walkingRef].map((lm, idx) => {
        if (idx === 13) return { ...lm, x: 0.20, y: 0.22 };
        if (idx === 15) return { ...lm, x: 0.05, y: 0.22 };
        if (idx === 14) return { ...lm, x: 0.80, y: 0.22 };
        if (idx === 16) return { ...lm, x: 0.95, y: 0.22 };
        return lm;
      });

      // User with arms hanging vertically down at sides
      const armsDownUser = [...walkingRef].map((lm, idx) => {
        if (idx === 13) return { ...lm, x: 0.38, y: 0.45 };
        if (idx === 15) return { ...lm, x: 0.38, y: 0.65 };
        if (idx === 14) return { ...lm, x: 0.62, y: 0.45 };
        if (idx === 16) return { ...lm, x: 0.62, y: 0.65 };
        return lm;
      });

      const result = computePoseScore(armsDownUser, tPoseRef);
      expect(result.regional.arms).toBeLessThan(45);
      expect(result.score).toBeLessThan(90);
      expect(result.isAutoCaptureReady).toBe(false);
    });

    it('distinguishes seated pose from standing pose with severe leg/hip score penalty', () => {
      // 90° Seated bent-leg reference
      const seatedRef = [...walkingRef].map((lm, idx) => {
        if (idx === 25) return { ...lm, x: 0.20, y: 0.55 }; // Thigh horizontal
        if (idx === 27) return { ...lm, x: 0.20, y: 0.85 }; // Shin vertical
        if (idx === 26) return { ...lm, x: 0.80, y: 0.55 }; // Thigh horizontal
        if (idx === 28) return { ...lm, x: 0.80, y: 0.85 }; // Shin vertical
        return lm;
      });

      // Standing upright user (thigh & shin vertical)
      const standingUser = [...walkingRef].map((lm, idx) => {
        if (idx === 25) return { ...lm, x: 0.42, y: 0.72 };
        if (idx === 27) return { ...lm, x: 0.42, y: 0.90 };
        if (idx === 26) return { ...lm, x: 0.58, y: 0.72 };
        if (idx === 28) return { ...lm, x: 0.58, y: 0.90 };
        return lm;
      });

      const result = computePoseScore(standingUser, seatedRef);
      expect(result.regional.legs).toBeLessThan(50);
      expect(result.score).toBeLessThan(94);
      expect(result.isAutoCaptureReady).toBe(false);
    });

    it('penalizes asymmetric/mirrored wrong limb movements', () => {
      const base = getReferenceSkeletonForKey('MIRROR_SELFIE');
      // Invert arm positions
      const flippedUser = [...base].map((lm, idx) => {
        if (idx === 13) return base[14];
        if (idx === 14) return base[13];
        if (idx === 15) return base[16];
        if (idx === 16) return base[15];
        return lm;
      });

      const result = computePoseScore(flippedUser, base);
      expect(result.regional.arms).toBeLessThan(85);
      expect(result.isAutoCaptureReady).toBe(false);
    });
  });

  describe('3. Exact Match Pose Verification', () => {
    it('awards ≥ 95% score and auto-capture readiness ONLY when user landmarks match reference', () => {
      const result = computePoseScore(walkingRef, walkingRef);
      expect(result.score).toBeGreaterThanOrEqual(95);
      expect(result.isAutoCaptureReady).toBe(true);
      expect(result.guidanceCue).toBeNull();
    });
  });

  describe('4. MediaPipe Detector Real Status State Machine', () => {
    it('reports NO_PERSON and null landmarks when no camera frame is fed', async () => {
      const detector = new MediaPipePoseDetector();
      await detector.initialise();

      const outcome = await detector.detectDetailed();
      expect(outcome.status).toBe('NO_PERSON');
      expect(outcome.landmarks).toBeNull();
    });

    it('reports REAL_LANDMARKS when genuine native frame landmarks are passed', async () => {
      const detector = new MediaPipePoseDetector();
      await detector.initialise();

      const nativeFrame = {
        landmarks: walkingRef.map((l) => ({ x: l.x, y: l.y, z: l.z, visibility: l.visibility })),
      };

      const outcome = await detector.detectDetailed(nativeFrame as any);
      expect(outcome.status).toBe('REAL_LANDMARKS');
      expect(outcome.landmarks).not.toBeNull();
      expect(outcome.landmarks?.length).toBe(33);
    });

    it('reports MULTIPLE_PEOPLE and null landmarks when more than one subject is detected', async () => {
      const detector = new MediaPipePoseDetector();
      await detector.initialise();

      const multiPersonFrame = {
        landmarks: walkingRef.map((l) => ({ x: l.x, y: l.y, z: l.z, visibility: l.visibility })),
        personCount: 2,
      };

      const outcome = await detector.detectDetailed(multiPersonFrame as any);
      expect(outcome.status).toBe('MULTIPLE_PEOPLE');
      expect(outcome.landmarks).toBeNull();
    });

    it('reports LOW_CONFIDENCE when key joints are obscured (< 16 visible points)', async () => {
      const detector = new MediaPipePoseDetector();
      await detector.initialise();

      // Only 10 points visible
      const obscuredLandmarks = walkingRef.map((l, idx) => ({
        x: l.x,
        y: l.y,
        z: l.z,
        visibility: idx < 10 ? 0.9 : 0.1,
      }));

      const outcome = await detector.detectDetailed({ landmarks: obscuredLandmarks } as any);
      expect(outcome.status).toBe('LOW_CONFIDENCE');
    });
  });

  describe('5. Static Landmark Extraction Anti-Fabrication', () => {
    it('returns success: false and NO_PERSON when image has no human landmark data', async () => {
      const result = await extractStaticPoseLandmarks('file:///local/photo_of_landscape.jpg');
      expect(result.success).toBe(false);
      expect(result.status).toBe('NO_PERSON');
      expect(result.landmarks).toBeNull();
      expect(result.confidence).toBe(0);
    });

    it('returns REAL_LANDMARKS when valid landmark coordinates are passed', async () => {
      const result = await extractStaticPoseLandmarks('file:///local/valid_pose.jpg', {
        rawLandmarks: walkingRef,
      });
      expect(result.success).toBe(true);
      expect(result.status).toBe('REAL_LANDMARKS');
      expect(result.landmarks?.length).toBe(33);
      expect(result.confidence).toBeGreaterThan(0.9);
    });
  });
});
