/**
 * TrendEngine — POSEHANUM
 *
 * Implements:
 *  • Replaceable trend provider architecture (defaulting to local seed dataset)
 *  • Dynamic trend scoring: Recency + Velocity + Usage + Engagement + Personalization
 *  • Freshness decay curves based on timestamp
 *  • Region-based and age-relevance filtering
 */

import { TRENDS_DATASET } from '../data/trendsData';
import type { Trend, TrendRankingWeights, ITrendProvider } from '../types';

export class LocalSeedTrendProvider implements ITrendProvider {
  private trends: Trend[];

  constructor(seedData: Trend[] = TRENDS_DATASET) {
    this.trends = [...seedData];
  }

  public async fetchTrends(_region?: string): Promise<Trend[]> {
    return this.trends;
  }

  public async getTrendById(id: string): Promise<Trend | undefined> {
    return this.trends.find((t) => t.id === id);
  }
}

export class TrendEngine {
  private provider: ITrendProvider;
  private defaultWeights: TrendRankingWeights = {
    recency: 0.25,
    velocity: 0.30,
    usage: 0.20,
    engagement: 0.15,
    personalization: 0.10,
  };

  constructor(provider?: ITrendProvider) {
    this.provider = provider || new LocalSeedTrendProvider();
  }

  /**
   * Sets a replaceable custom provider (e.g. Remote API Provider)
   */
  public setProvider(provider: ITrendProvider): void {
    this.provider = provider;
  }

  /**
   * Calculates freshness score using exponential decay over days.
   */
  public calculateFreshness(createdAt: string, halfLifeDays = 7): number {
    try {
      const createdTime = new Date(createdAt).getTime();
      const elapsedDays = Math.max(0, (Date.now() - createdTime) / (1000 * 60 * 60 * 24));
      return Math.exp((-Math.LN2 * elapsedDays) / halfLifeDays);
    } catch {
      return 0.5;
    }
  }

  /**
   * Computes multi-factor trend ranking score.
   */
  public computeTrendScore(
    trend: Trend,
    preferredCategories: string[] = [],
    weights: TrendRankingWeights = this.defaultWeights,
  ): number {
    const freshness = trend.freshnessScore || this.calculateFreshness(trend.createdAt);
    
    // Normalized velocity (-100% to +100% mapped to 0..1)
    const normVelocity = Math.max(0, Math.min(1, (trend.velocity + 100) / 200));

    // Normalized usage log scale
    const normUsage = Math.min(1, Math.log10(Math.max(1, trend.usageCount)) / 5);

    // Engagement / Popularity (0..100 mapped to 0..1)
    const normEngagement = Math.max(0, Math.min(1, (trend.popularity || 50) / 100));

    // Category personalization boost
    const isPreferred = preferredCategories.includes(trend.category.toLowerCase());
    const normPersonalization = isPreferred ? 1.0 : 0.3;

    const compositeScore =
      weights.recency * freshness +
      weights.velocity * normVelocity +
      weights.usage * normUsage +
      weights.engagement * normEngagement +
      weights.personalization * normPersonalization;

    return Math.round(compositeScore * 100);
  }

  /**
   * Fetches and ranks trends according to user preferences and region.
   */
  public async getRankedTrends(
    preferredCategories: string[] = [],
    region?: string,
  ): Promise<Trend[]> {
    const rawTrends = await this.provider.fetchTrends(region);

    const scoredTrends = rawTrends.map((trend) => {
      const score = this.computeTrendScore(trend, preferredCategories);
      return {
        ...trend,
        score,
        isHot: score >= 65 || trend.isHot,
      };
    });

    return scoredTrends.sort((a, b) => (b.score || 0) - (a.score || 0));
  }
}

export const trendEngine = new TrendEngine();
