/**
 * PersonalizationEngine — Privacy-First On-Device Pose Recommendation Engine.
 *
 * Implements weighted candidate scoring:
 *  Score = w_cat * C + w_type * T + w_angle * A + w_success * S + w_match * M + w_recent * R + w_ctx * X + w_nov * N
 *
 * Enforces 80% familiar / 20% exploration diversity split.
 * Provides Apple-grade human-readable explanations.
 */

import type { Pose } from '@/features/poses/types';
import type {
  RecommendationContext,
  RecommendationWeights,
  ScoredRecommendation,
  UserPreferenceProfile,
} from '../types';

export const DEFAULT_RECOMMENDATION_WEIGHTS: RecommendationWeights = {
  categoryWeight: 0.20,
  poseTypeWeight: 0.15,
  cameraAngleWeight: 0.10,
  historicalSuccess: 0.20,
  matchScore: 0.15,
  recentInterest: 0.10,
  contextScore: 0.05,
  novelty: 0.05,
};

export const MODEL_VERSION = 'v1';

export class PersonalizationEngine {
  private weights: RecommendationWeights;

  constructor(customWeights: Partial<RecommendationWeights> = {}) {
    this.weights = {
      ...DEFAULT_RECOMMENDATION_WEIGHTS,
      ...customWeights,
    };
  }

  /**
   * Score an individual candidate pose against the user preference profile and current context.
   */
  public scorePose(
    pose: Pose,
    profile: UserPreferenceProfile,
    context?: RecommendationContext,
    interactedPoseIds: Set<string> = new Set(),
  ): ScoredRecommendation {
    const categoryKey = (pose.categoryId || pose.category || 'all').toLowerCase();
    const catAffinity = profile.preferredCategories[categoryKey] ?? 0.5;

    // 1. Pose Type / Tag Affinity
    let typeAffinity = 0.5;
    const tags = pose.tags;
    if (tags && tags.length > 0) {
      let sum = 0;
      for (let i = 0; i < tags.length; i++) {
        sum += profile.preferredPoseTypes[tags[i].toLowerCase()] ?? 0.5;
      }
      typeAffinity = sum / tags.length;
    }

    // 2. Camera Angle Affinity
    const angleKey = (pose.cameraAngle || 'eye-level').toLowerCase();
    const angleAffinity = profile.preferredCameraAngles[angleKey] ?? 0.5;

    // 3. Historical Success Affinity (Difficulty match & past captures)
    const difficultyScore =
      pose.difficulty === 'easy' ? 0.3 : pose.difficulty === 'medium' ? 0.6 : 0.9;
    const diffMatch = 1.0 - Math.abs(profile.difficultyPreference - difficultyScore);
    const historicalSuccess = Math.max(0.1, Math.min(1.0, diffMatch));

    // 4. Match Score Expectation (Achievability)
    const expectedScore = profile.averageMatchScore / 100;
    const matchScoreWeight = Math.max(0.2, Math.min(1.0, expectedScore));

    // 5. Recent Interest Affinity (Session history & dwell)
    let recentInterest = 0.5;
    if (context?.sessionPoseIds && context.sessionPoseIds.includes(pose.id)) {
      recentInterest = 0.85;
    }

    // 6. Context Relevance (indoor/outdoor, time, outfit, orientation)
    let contextRelevance = 0.5;
    if (context) {
      let matches = 0;
      let totalChecks = 0;

      if (context.currentCategory) {
        totalChecks += 1;
        if (context.currentCategory.toLowerCase() === categoryKey) matches += 1;
      }

      if (context.isIndoor !== undefined) {
        totalChecks += 1;
        if (pose.indoor === context.isIndoor) matches += 1;
      }

      if (context.orientation && pose.orientation) {
        totalChecks += 1;
        if (pose.orientation === context.orientation) matches += 1;
      }

      if (context.outfitCategory && pose.tags) {
        totalChecks += 1;
        if (pose.tags.includes(context.outfitCategory.toLowerCase())) matches += 1;
      }

      if (totalChecks > 0) {
        contextRelevance = 0.3 + (matches / totalChecks) * 0.7;
      }
    }

    // 7. Novelty / Exploration Factor
    const isInteracted = interactedPoseIds.has(pose.id);
    const novelty = isInteracted ? 0.3 : 0.9;

    // Weighted Combined Total Score
    const totalScore =
      catAffinity * this.weights.categoryWeight +
      typeAffinity * this.weights.poseTypeWeight +
      angleAffinity * this.weights.cameraAngleWeight +
      historicalSuccess * this.weights.historicalSuccess +
      matchScoreWeight * this.weights.matchScore +
      recentInterest * this.weights.recentInterest +
      contextRelevance * this.weights.contextScore +
      novelty * this.weights.novelty;

    // Generate Human-Readable Reason
    const explanation = this.generateExplanation(
      pose,
      profile,
      catAffinity,
      typeAffinity,
      historicalSuccess,
      isInteracted,
    );

    return {
      pose,
      totalScore: Math.round(totalScore * 10000) / 10000,
      explanation,
      isExploration: !isInteracted && catAffinity < 0.6,
      scoreBreakdown: {
        category: Math.round(catAffinity * 100) / 100,
        poseType: Math.round(typeAffinity * 100) / 100,
        cameraAngle: Math.round(angleAffinity * 100) / 100,
        historicalSuccess: Math.round(historicalSuccess * 100) / 100,
        matchScore: Math.round(matchScoreWeight * 100) / 100,
        recentInterest: Math.round(recentInterest * 100) / 100,
        context: Math.round(contextRelevance * 100) / 100,
        novelty: Math.round(novelty * 100) / 100,
      },
    };
  }

  /**
   * Rank a dataset of poses using an 80% exploitation / 20% exploration diversity balance.
   */
  public rankPoses(
    poses: Pose[],
    profile: UserPreferenceProfile,
    context?: RecommendationContext,
    limit: number = 10,
    interactedPoseIds: Set<string> = new Set(),
  ): ScoredRecommendation[] {
    if (!poses || poses.length === 0) return [];

    // Score all candidate poses in a fast loop
    const n = poses.length;
    const scoredList = new Array<ScoredRecommendation>(n);
    for (let i = 0; i < n; i++) {
      scoredList[i] = this.scorePose(poses[i], profile, context, interactedPoseIds);
    }

    // Sort by total score descending
    scoredList.sort((a, b) => b.totalScore - a.totalScore);

    // If limit is small or dataset is small, return top
    if (poses.length <= limit) {
      return scoredList.slice(0, limit);
    }

    const exploitCount = Math.max(1, Math.round(limit * 0.8));
    const exploreCount = limit - exploitCount;

    // Top exploitation items
    const exploitationPicks = scoredList.slice(0, exploitCount);
    const chosenIds = new Set(exploitationPicks.map((s) => s.pose.id));

    // Diverse exploration items from novel/discovery candidates
    const explorationPicks: ScoredRecommendation[] = [];
    for (let i = scoredList.length - 1; i >= 0 && explorationPicks.length < exploreCount; i--) {
      const item = scoredList[i];
      if (!chosenIds.has(item.pose.id)) {
        explorationPicks.push({
          ...item,
          isExploration: true,
          explanation: 'Try something new',
        });
      }
    }

    // Combine and return
    return [...exploitationPicks, ...explorationPicks];
  }

  /**
   * Generate simple, editorial explanation text for why this pose is recommended.
   */
  private generateExplanation(
    pose: Pose,
    profile: UserPreferenceProfile,
    catAffinity: number,
    typeAffinity: number,
    historicalSuccess: number,
    isInteracted: boolean,
  ): string {
    const categoryName = pose.category ?? pose.categoryId;

    if (catAffinity >= 0.75) {
      return `Because you love ${categoryName.toLowerCase()} poses`;
    }

    if (profile.averageMatchScore >= 85 && historicalSuccess >= 0.7) {
      return `You matched ${Math.round(profile.averageMatchScore)}% with this style`;
    }

    if (typeAffinity >= 0.7 && pose.tags && pose.tags[0]) {
      return `Similar to your favorite ${pose.tags[0]} poses`;
    }

    if (!isInteracted) {
      return 'Trending in your style';
    }

    return 'Recommended for your composition';
  }

  /**
   * "Try Something New" — Deliberately selects a pose outside the user's normal preference habits.
   */
  public getTrySomethingNewPose(
    poses: Pose[],
    profile: UserPreferenceProfile,
  ): ScoredRecommendation | null {
    if (!poses || poses.length === 0) return null;

    // Find candidate poses with lower category/type affinity but high quality
    const scoredList = poses.map((p) => this.scorePose(p, profile));
    const explorationCandidates = scoredList.filter(
      (item) => item.scoreBreakdown.category < 0.65 || item.scoreBreakdown.poseType < 0.65,
    );

    if (explorationCandidates.length === 0) {
      return scoredList[Math.floor(Math.random() * scoredList.length)];
    }

    const picked = explorationCandidates[Math.floor(Math.random() * explorationCandidates.length)];
    const mainFavCategory = Object.entries(profile.preferredCategories)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'standing';

    return {
      ...picked,
      isExploration: true,
      explanation: `You usually choose ${mainFavCategory} poses. Try this ${picked.pose.title}!`,
    };
  }
}
