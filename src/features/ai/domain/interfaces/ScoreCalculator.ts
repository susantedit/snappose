/**
 * Abstract ScoreCalculator interface.
 * Domain layer — zero external dependencies.
 * [Req 47.3]
 */

import type { NormalisedLandmarks, PoseScore } from '../../types';

export interface ScoreCalculator {
  /**
   * Compute a pose match score between user landmarks and reference landmarks.
   * Returns a PoseScore with total (0–100) and per-region breakdown.
   */
  compute(user: NormalisedLandmarks, reference: NormalisedLandmarks): PoseScore;
}
