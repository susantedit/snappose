/**
 * Personalization & Machine Learning Engine Types for Snap Pose.
 *
 * Privacy-First, On-Device User Behavior and Preference Architecture.
 * [Req 4, 18, 30]
 */

import type { Pose } from '@/features/poses/types';

// ---------------------------------------------------------------------------
// User Interaction Signals
// ---------------------------------------------------------------------------

export type InteractionSignalType =
  | 'POSE_OPENED'
  | 'POSE_SKIPPED'
  | 'POSE_FAVORITED'
  | 'POSE_UNFAVORITED'
  | 'POSE_DOWNLOADED'
  | 'POSE_USED'
  | 'POSE_CAPTURED'
  | 'POSE_SHARED'
  | 'POSE_REPEATED'
  | 'POSE_PREVIEWED'
  | 'POSE_MATCH_SCORE'
  | 'POSE_CAPTURE_SUCCESS'
  | 'POSE_CAPTURE_FAILURE'
  | 'CATEGORY_OPENED'
  | 'CATEGORY_SKIPPED'
  | 'SEARCH_QUERY'
  | 'FILTER_USED'
  | 'CAMERA_OPENED'
  | 'CAMERA_CAPTURED'
  | 'VOICE_COACHING_USED'
  | 'AUTO_CAPTURE_USED'
  | 'EXPLICIT_LIKE'
  | 'EXPLICIT_DISLIKE'
  | 'FEEDBACK_MORE_LIKE_THIS'
  | 'FEEDBACK_DONT_RECOMMEND'
  | 'OUTFIT_SELECTED'
  | 'RECOMMENDATION_CLICKED'
  | 'RECOMMENDATION_ACCEPTED'
  | 'RECOMMENDATION_REJECTED';

export interface InteractionSignal {
  id: string;
  type: InteractionSignalType;
  poseId?: string;
  categoryId?: string;
  score?: number;
  dwellTimeMs?: number;
  tags?: string[];
  context?: RecommendationContext;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Dynamic User Preference Profile Vector
// ---------------------------------------------------------------------------

export type PoseStyle = 'natural' | 'aesthetic' | 'professional' | 'creative' | 'casual';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type OutfitCategory =
  | 'casual'
  | 'formal'
  | 'streetwear'
  | 'traditional'
  | 'sportswear'
  | 'summer'
  | 'winter';

export interface UserPreferenceProfile {
  /** Normalized category weights (0.0 to 1.0) */
  preferredCategories: Record<string, number>;

  /** Normalized pose type / posture weights (0.0 to 1.0) */
  preferredPoseTypes: Record<string, number>;

  /** Normalized camera angle weights (0.0 to 1.0) */
  preferredCameraAngles: Record<string, number>;

  /** Numerical difficulty preference (0.0 easy to 1.0 hard) */
  difficultyPreference: number;

  /** Historical average pose match score (0 to 100) */
  averageMatchScore: number;

  /** Primary preferred stylistic aesthetic */
  favoritePoseStyle: PoseStyle;

  /** Optional user-selected outfit preference */
  preferredOutfit?: OutfitCategory;

  /** Approximate skill level */
  experienceLevel: ExperienceLevel;

  /** Utilization rate of voice coach (0.0 to 1.0) */
  voiceCoachUsage: number;

  /** Utilization rate of hands-free auto-capture (0.0 to 1.0) */
  autoCaptureUsage: number;

  /** Total tracked interaction events */
  totalInteractions: number;

  /** Total photos successfully captured with pose guide */
  totalSuccessfulCaptures: number;

  /** ISO 8601 string of last profile vector recalculation */
  lastUpdated: string;

  /** Algorithm version for forward compatibility */
  modelVersion: string;
}

// ---------------------------------------------------------------------------
// Recommendation Context & Ranking
// ---------------------------------------------------------------------------

export interface RecommendationContext {
  /** Currently active or selected category */
  currentCategory?: string;

  /** Approximate time of day */
  timeOfDay?: 'morning' | 'afternoon' | 'golden_hour' | 'night';

  /** Indoor or outdoor shooting setting */
  isIndoor?: boolean;

  /** Approximate environment type (user-selected or coarse inferred) */
  environmentType?: 'city' | 'nature' | 'mountain' | 'beach' | 'cafe' | 'studio';

  /** Active outfit category */
  outfitCategory?: OutfitCategory;

  /** Camera screen orientation */
  orientation?: 'portrait' | 'landscape';

  /** IDs of poses viewed in the current active session */
  sessionPoseIds?: string[];
}

export interface RecommendationWeights {
  categoryWeight: number;
  poseTypeWeight: number;
  cameraAngleWeight: number;
  historicalSuccess: number;
  matchScore: number;
  recentInterest: number;
  contextScore: number;
  novelty: number;
}

export interface ScoredRecommendation {
  pose: Pose;
  totalScore: number;
  explanation: string;
  isExploration: boolean;
  scoreBreakdown: {
    category: number;
    poseType: number;
    cameraAngle: number;
    historicalSuccess: number;
    matchScore: number;
    recentInterest: number;
    context: number;
    novelty: number;
  };
}

export interface ExplicitFeedbackItem {
  poseId: string;
  action: 'like' | 'dislike' | 'more_like_this' | 'dont_recommend';
  timestamp: string;
}
