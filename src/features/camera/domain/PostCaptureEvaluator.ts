/**
 * PostCaptureEvaluator — POSEHANUM
 *
 * Evaluates pose accuracy on captured photos against target reference skeletons.
 * Provides granular regional breakdowns (Head, Shoulders, Arms, Torso, Legs)
 * and generates actionable corrective feedback when accuracy is suboptimal.
 */

import type { LandmarkSet } from '@/features/ai/types';
import type { Pose } from '@/features/poses/types';
import { computePoseScore, getReferenceSkeletonForKey } from '@/features/ai/domain/PoseScoreCalculator';

export type PoseAccuracyTier = 'EXCELLENT' | 'GOOD' | 'NEEDS_ADJUSTMENT' | 'POOR';

export interface RegionalAccuracy {
  region: string;
  score: number;
  isMatched: boolean;
  statusText: string;
}

export interface PostCaptureEvaluationResult {
  totalScore: number;
  tier: PoseAccuracyTier;
  tierLabel: string;
  isMatched: boolean;
  regionalBreakdown: RegionalAccuracy[];
  positiveHighlights: string[];
  correctiveTips: string[];
  summaryMessage: string;
}

export class PostCaptureEvaluator {
  /**
   * Evaluates captured landmarks against target pose reference.
   */
  public evaluate(
    capturedLandmarks: LandmarkSet | null,
    targetPose: Pose,
  ): PostCaptureEvaluationResult {
    if (!capturedLandmarks) {
      return {
        totalScore: 0,
        tier: 'POOR',
        tierLabel: 'NO PERSON DETECTED',
        isMatched: false,
        regionalBreakdown: [],
        positiveHighlights: [],
        correctiveTips: ['Ensure full body is clearly visible in frame', 'Step inside the silhouette'],
        summaryMessage: 'Pose could not be verified — no person detected in captured frame.',
      };
    }

    const refSkeleton = targetPose.landmarks ?? getReferenceSkeletonForKey('WALKING_CASUAL');
    const scoreResult = computePoseScore(capturedLandmarks as any, refSkeleton);
    const totalScore = scoreResult.total;

    const tier: PoseAccuracyTier =
      totalScore >= 90
        ? 'EXCELLENT'
        : totalScore >= 80
          ? 'GOOD'
          : totalScore >= 60
            ? 'NEEDS_ADJUSTMENT'
            : 'POOR';

    const tierLabel =
      tier === 'EXCELLENT'
        ? 'POSE MATCHED (EXCELLENT)'
        : tier === 'GOOD'
          ? 'GOOD ALIGNMENT'
          : tier === 'NEEDS_ADJUSTMENT'
            ? 'NEEDS ADJUSTMENT'
            : 'INACCURATE POSE';

    const r = scoreResult.regionalScores || {
      shoulders: 70,
      arms: 70,
      hands: 70,
      torso: 70,
      legs: 70,
      head: 70,
      feet: 70,
    };

    const regionalBreakdown: RegionalAccuracy[] = [
      {
        region: 'Head & Gaze',
        score: r.head,
        isMatched: r.head >= 80,
        statusText: r.head >= 80 ? '✓ Aligned' : 'Adjust chin/head angle',
      },
      {
        region: 'Shoulders',
        score: r.shoulders,
        isMatched: r.shoulders >= 80,
        statusText: r.shoulders >= 80 ? '✓ Square to camera' : 'Rotate shoulders to match',
      },
      {
        region: 'Arms & Elbows',
        score: r.arms,
        isMatched: r.arms >= 80,
        statusText: r.arms >= 80 ? '✓ Angle matched' : 'Check elbow elevation',
      },
      {
        region: 'Hands & Wrists',
        score: r.hands,
        isMatched: r.hands >= 80,
        statusText: r.hands >= 80 ? '✓ Placed correctly' : 'Adjust hand position',
      },
      {
        region: 'Torso & Posture',
        score: r.torso,
        isMatched: r.torso >= 80,
        statusText: r.torso >= 80 ? '✓ Center spine aligned' : 'Straighten torso',
      },
      {
        region: 'Legs & Stance',
        score: r.legs,
        isMatched: r.legs >= 80,
        statusText: r.legs >= 80 ? '✓ Stance balanced' : 'Adjust foot spacing/knee bend',
      },
    ];

    const positiveHighlights: string[] = [];
    const correctiveTips: string[] = [];

    regionalBreakdown.forEach((item) => {
      if (item.isMatched) {
        positiveHighlights.push(`${item.region} (${item.score}%) matched reference`);
      } else {
        correctiveTips.push(`• ${item.region}: ${item.statusText}`);
      }
    });

    if (totalScore >= 85) {
      positiveHighlights.push('✓ Overall body composition locked');
    }

    const isMatched = totalScore >= 80;
    const summaryMessage = isMatched
      ? `Great capture! Your pose achieved ${totalScore}% alignment with "${targetPose.title}".`
      : `Alignment was ${totalScore}%. Review the regional breakdown below to perfect your next shot.`;

    return {
      totalScore,
      tier,
      tierLabel,
      isMatched,
      regionalBreakdown,
      positiveHighlights,
      correctiveTips: correctiveTips.length > 0 ? correctiveTips : ['Hold steady for even sharper focus'],
      summaryMessage,
    };
  }
}

export const postCaptureEvaluator = new PostCaptureEvaluator();
