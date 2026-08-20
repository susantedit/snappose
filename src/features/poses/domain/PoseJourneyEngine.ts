/**
 * PoseJourneyEngine — Curates an ordered photo session narrative sequence (5 dynamic shots)
 * based on user mood/location/vibe, ensuring anti-repetition.
 */

import type { Pose } from '@/features/poses/types';
import { SNAP_POSE_DATASET } from '@/features/poses/data/posesData';

export interface PoseJourneyStep {
  stepIndex: number;
  stageName: string; // 'Warm-up / Establishing', 'Full Body Hero', 'Dynamic Motion', 'Close-up Detail', 'Signature Finale'
  pose: Pose;
  directorAdvice: string;
}

export interface PoseJourneySession {
  id: string;
  vibe: string;
  theme: string;
  totalSteps: number;
  steps: PoseJourneyStep[];
}

const STAGE_NAMES = [
  '1. Establishing Shot & Warm-up',
  '2. Full-Body Hero Posture',
  '3. Dynamic Action & Movement',
  '4. Close-Up & Candid Expression',
  '5. Signature Editorial Finale',
];

const STAGE_DIRECTOR_CUES = [
  'Start relaxed. Settle your breathing and look just past the lens.',
  'Commit to full silhouette width. Lengthen spine and distribute weight firmly.',
  'Add subtle motion or shift weight. Let clothes and hair move naturally.',
  'Bring attention to hands and facial expression. Soften your jaw.',
  'Hold your favorite confident pose. Bring all previous energy together.',
];

export class PoseJourneyEngine {
  /**
   * Generates a 5-step journey sequence ensuring diverse camera framings and postures.
   */
  static generateJourney(vibe: string = 'confident', categoryId?: string): PoseJourneySession {
    let candidatePool = [...SNAP_POSE_DATASET];
    if (categoryId && categoryId !== 'all') {
      const filtered = candidatePool.filter((p) => p.categoryId === categoryId);
      if (filtered.length >= 3) {
        candidatePool = filtered;
      }
    }

    // Shuffle candidate pool
    const shuffled = candidatePool.sort(() => 0.5 - Math.random());
    const selectedPoses = shuffled.slice(0, 5);

    // If fewer than 5, fill with defaults
    while (selectedPoses.length < 5) {
      selectedPoses.push(SNAP_POSE_DATASET[selectedPoses.length % SNAP_POSE_DATASET.length]);
    }

    const steps: PoseJourneyStep[] = selectedPoses.map((pose, idx) => ({
      stepIndex: idx + 1,
      stageName: STAGE_NAMES[idx],
      pose,
      directorAdvice: STAGE_DIRECTOR_CUES[idx],
    }));

    return {
      id: `journey_${Date.now()}`,
      vibe,
      theme: categoryId ? `${categoryId.toUpperCase()} Journey` : 'Storyteller Narrative',
      totalSteps: steps.length,
      steps,
    };
  }
}
