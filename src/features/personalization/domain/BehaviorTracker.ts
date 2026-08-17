/**
 * BehaviorTracker — Privacy-First Behavioral Learning & Preference Profile Evolution.
 *
 * Implements exponential moving average (EMA) weight updates on user interaction signals.
 * Clamps all affinity dimensions strictly to [0.0, 1.0].
 */

import type { Pose } from '@/features/poses/types';
import type {
  InteractionSignal,
  InteractionSignalType,
  UserPreferenceProfile,
} from '../types';

export class BehaviorTracker {
  /**
   * Learning rates (alphas) for different interaction signals.
   */
  private static readonly SIGNAL_WEIGHT_DELTAS: Record<InteractionSignalType, number> = {
    POSE_FAVORITED: 0.16,
    POSE_CAPTURED: 0.18,
    POSE_SHARED: 0.20,
    POSE_REPEATED: 0.15,
    EXPLICIT_LIKE: 0.22,
    FEEDBACK_MORE_LIKE_THIS: 0.20,

    POSE_OPENED: 0.05,
    POSE_DOWNLOADED: 0.10,
    POSE_USED: 0.08,
    POSE_PREVIEWED: 0.04,
    POSE_CAPTURE_SUCCESS: 0.16,
    RECOMMENDATION_ACCEPTED: 0.12,
    RECOMMENDATION_CLICKED: 0.06,

    CATEGORY_OPENED: 0.06,
    SEARCH_QUERY: 0.05,
    FILTER_USED: 0.04,
    CAMERA_OPENED: 0.03,
    CAMERA_CAPTURED: 0.08,
    VOICE_COACHING_USED: 0.05,
    AUTO_CAPTURE_USED: 0.05,
    OUTFIT_SELECTED: 0.08,

    POSE_SKIPPED: -0.04, // Soft damping to prevent accidental over-penalizing
    POSE_CAPTURE_FAILURE: -0.05,
    CATEGORY_SKIPPED: -0.03,
    RECOMMENDATION_REJECTED: -0.08,
    EXPLICIT_DISLIKE: -0.25,
    FEEDBACK_DONT_RECOMMEND: -0.35,

    POSE_MATCH_SCORE: 0.0, // Handled separately
    POSE_UNFAVORITED: -0.12,
  };

  /**
   * Update a user profile vector given an incoming interaction signal and target pose metadata.
   */
  public static updateProfileWithSignal(
    currentProfile: UserPreferenceProfile,
    signal: InteractionSignal,
    pose?: Pose,
  ): UserPreferenceProfile {
    const delta = this.SIGNAL_WEIGHT_DELTAS[signal.type] ?? 0.0;
    const updatedCategories = { ...currentProfile.preferredCategories };
    const updatedPoseTypes = { ...currentProfile.preferredPoseTypes };
    const updatedCameraAngles = { ...currentProfile.preferredCameraAngles };

    // 1. Update Category Affinity
    const categoryKey = (signal.categoryId || pose?.categoryId || pose?.category || '').toLowerCase();
    if (categoryKey) {
      const currentCatScore = updatedCategories[categoryKey] ?? 0.5;
      updatedCategories[categoryKey] = this.clamp(currentCatScore + delta);
    }

    // 2. Update Pose Type / Tag Affinities
    const tags = signal.tags || pose?.tags || [];
    for (const tag of tags) {
      const tagKey = tag.toLowerCase();
      const currentTagScore = updatedPoseTypes[tagKey] ?? 0.5;
      updatedPoseTypes[tagKey] = this.clamp(currentTagScore + delta * 0.85);
    }

    // 3. Update Camera Angle Affinity
    if (pose?.cameraAngle) {
      const angleKey = pose.cameraAngle.toLowerCase();
      const currentAngleScore = updatedCameraAngles[angleKey] ?? 0.5;
      updatedCameraAngles[angleKey] = this.clamp(currentAngleScore + delta * 0.75);
    }

    // 4. Update Match Score Running Average
    let averageMatchScore = currentProfile.averageMatchScore;
    if (signal.score !== undefined && signal.score > 0) {
      // EMA smoothing factor: alpha = 0.15
      averageMatchScore = Number(
        (currentProfile.averageMatchScore * 0.85 + signal.score * 0.15).toFixed(1),
      );
    }

    // 5. Update Successful Captures Count
    let totalSuccessfulCaptures = currentProfile.totalSuccessfulCaptures;
    if (signal.type === 'POSE_CAPTURED' || signal.type === 'POSE_CAPTURE_SUCCESS') {
      totalSuccessfulCaptures += 1;
    }

    // 6. Update Difficulty & Experience Level Preference
    let difficultyPreference = currentProfile.difficultyPreference;
    if (averageMatchScore >= 85) {
      difficultyPreference = this.clamp(difficultyPreference + 0.02);
    } else if (averageMatchScore < 60) {
      difficultyPreference = this.clamp(difficultyPreference - 0.02);
    }

    const experienceLevel =
      averageMatchScore >= 85
        ? 'advanced'
        : averageMatchScore >= 70
        ? 'intermediate'
        : 'beginner';

    return {
      ...currentProfile,
      preferredCategories: updatedCategories,
      preferredPoseTypes: updatedPoseTypes,
      preferredCameraAngles: updatedCameraAngles,
      difficultyPreference: Number(difficultyPreference.toFixed(3)),
      averageMatchScore,
      experienceLevel,
      totalInteractions: currentProfile.totalInteractions + 1,
      totalSuccessfulCaptures,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Clamps a value strictly between 0.0 and 1.0 with 3 decimal precision.
   */
  private static clamp(value: number): number {
    const clamped = Math.max(0.0, Math.min(1.0, value));
    return Number(clamped.toFixed(3));
  }
}
