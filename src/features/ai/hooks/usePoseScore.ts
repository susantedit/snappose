/**
 * usePoseScore — React hook calculating live pose similarity score and guidance cues.
 */

import { useMemo } from 'react';
import {
  computePoseScore,
  getReferenceSkeletonForKey,
} from '../domain/PoseScoreCalculator';
import type { ReferencePoseKey } from '../domain/types';
import type { NormalisedLandmarks, PoseScore, GuidanceCue } from '../types';

export function usePoseScore(
  userLandmarks: NormalisedLandmarks | null,
  referencePoseKey: ReferencePoseKey = 'WALKING_CASUAL',
  customReferenceLandmarks?: NormalisedLandmarks | null,
) {
  const reference = useMemo(() => {
    if (customReferenceLandmarks) return customReferenceLandmarks;
    return getReferenceSkeletonForKey(referencePoseKey);
  }, [referencePoseKey, customReferenceLandmarks]);

  const scoreResult = useMemo<{
    score: PoseScore;
    cue: GuidanceCue | null;
  }>(() => {
    if (!userLandmarks) {
      return {
        score: {
          total: 0,
          regional: {
            shoulders: 0,
            arms: 0,
            hands: 0,
            torso: 0,
            legs: 0,
            head: 0,
            feet: 0,
          },
        },
        cue: 'Adjusting',
      };
    }

    const calculated = computePoseScore(userLandmarks, reference);
    return {
      score: calculated,
      cue: calculated.total >= 90 ? 'Perfect!' : calculated.total >= 70 ? 'Hold still.' : 'Straighten Up',
    };
  }, [userLandmarks, reference]);

  return {
    score: scoreResult.score,
    cue: scoreResult.cue,
    isMatchGood: scoreResult.score.total >= 75,
    isMatchPerfect: scoreResult.score.total >= 94,
  };
}
