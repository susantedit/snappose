/**
 * Trend Engine Types — POSEHANUM
 *
 * Defines the complete architecture for replaceable, continuously ranked trends.
 */

export interface Trend {
  id: string;
  tag: string;
  title: string;
  name?: string;
  subtitle: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  popularity: number; // 0 - 100
  velocity: number; // Growth rate (-100% to +500%)
  growthPercentage: number;
  region?: string;
  ageRelevance?: 'all' | 'gen-z' | 'millennial' | 'creator';
  usageCount: number;
  templateCount: number;
  freshnessScore: number; // 0.0 - 1.0 based on decay curve
  featuredPoseIds: string[];
  featuredTemplateIds?: string[];
  isHot: boolean;
  score?: number; // Computed ranking score
}

export interface TrendRankingWeights {
  recency: number; // weight for freshness / createdAt
  velocity: number; // weight for growth speed
  usage: number; // weight for total volume
  engagement: number; // weight for saves/shares
  personalization: number; // weight for category affinity
}

export interface ITrendProvider {
  fetchTrends(region?: string): Promise<Trend[]>;
  getTrendById(id: string): Promise<Trend | undefined>;
}
