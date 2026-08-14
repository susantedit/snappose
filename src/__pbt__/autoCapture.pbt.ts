/**
 * Property-Based Tests for AutoCaptureEngine & gate evaluation
 * [Req 17, 38, 46]
 *
 * Properties tested:
 * 1. Gate conjunction invariant: evaluates to true iff ALL required gates pass
 * 2. Threshold boundary: score < threshold fails, score >= threshold passes
 * 3. Countdown cancellation: dropping any gate during countdown cancels immediately to idle
 */

import fc from 'fast-check';
import {
  evaluateGates,
  AutoCaptureEngine,
  type AutoCaptureGates,
  type AutoCaptureConfig,
} from '../features/ai/domain/AutoCaptureEngine';

const arbGates = fc.record({
  poseScore: fc.integer({ min: 0, max: 100 }),
  faceDetected: fc.boolean(),
  eyesVisible: fc.boolean(),
  cameraStable: fc.boolean(),
  lightingScore: fc.integer({ min: 0, max: 100 }),
  smileDetected: fc.boolean(),
});

const arbConfig = fc.record({
  threshold: fc.integer({ min: 80, max: 99 }),
  smileRequired: fc.boolean(),
});

describe('AutoCapture Property-Based Tests', () => {
  it('Property 1: Gate conjunction invariant — evaluates to true iff ALL required conditions are satisfied', () => {
    fc.assert(
      fc.property(arbGates, arbConfig, (gates, config) => {
        const result = evaluateGates(gates, config);

        const expected =
          gates.poseScore >= config.threshold &&
          gates.faceDetected === true &&
          gates.eyesVisible === true &&
          gates.cameraStable === true &&
          gates.lightingScore >= 50 &&
          (!config.smileRequired || gates.smileDetected === true);

        return result === expected;
      }),
      { numRuns: 200 }
    );
  });

  it('Property 2: Threshold boundary invariant — score at threshold passes, threshold - 1 fails', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 80, max: 99 }),
        fc.boolean(),
        (threshold, smileRequired) => {
          const passingGates: AutoCaptureGates = {
            poseScore: threshold,
            faceDetected: true,
            eyesVisible: true,
            cameraStable: true,
            lightingScore: 50,
            smileDetected: true,
          };

          const failingGates: AutoCaptureGates = {
            ...passingGates,
            poseScore: threshold - 1,
          };

          const config: AutoCaptureConfig = { threshold, smileRequired };

          return (
            evaluateGates(passingGates, config) === true &&
            evaluateGates(failingGates, config) === false
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: Countdown cancellation — any gate failure during counting returns state to idle', () => {
    fc.assert(
      fc.property(arbConfig, (config) => {
        const engine = new AutoCaptureEngine(config);

        const validGates: AutoCaptureGates = {
          poseScore: config.threshold,
          faceDetected: true,
          eyesVisible: true,
          cameraStable: true,
          lightingScore: 60,
          smileDetected: true,
        };

        // Tick valid gates -> starts counting
        const state1 = engine.tick(validGates);
        if (state1.phase !== 'counting') return false;

        // Now break stability
        const brokenGates: AutoCaptureGates = {
          ...validGates,
          cameraStable: false,
        };

        const state2 = engine.tick(brokenGates);
        return state2.phase === 'idle';
      }),
      { numRuns: 100 }
    );
  });
});
