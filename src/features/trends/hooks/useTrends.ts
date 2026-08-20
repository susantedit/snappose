/**
 * useTrends hook — returns ranked trends and hot tags powered by TrendEngine.
 */

import { useMemo } from 'react';
import { TRENDS_DATASET } from '../data/trendsData';
import { trendEngine } from '../services/TrendEngine';
import type { Trend } from '../types';

export function useTrends(preferredCategories: string[] = []) {
  const rankedTrends = useMemo(() => {
    return TRENDS_DATASET.map((trend) => ({
      ...trend,
      score: trendEngine.computeTrendScore(trend, preferredCategories),
    })).sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [preferredCategories]);

  const hotTrends = useMemo(() => rankedTrends.filter((t) => t.isHot || (t.score || 0) >= 65), [rankedTrends]);

  return {
    trends: rankedTrends,
    hotTrends,
    getTrendById: (id: string): Trend | undefined => rankedTrends.find((t) => t.id === id),
  };
}
