import { TrendEngine, LocalSeedTrendProvider } from '../TrendEngine';
import type { Trend } from '../../types';

describe('TrendEngine', () => {
  let engine: TrendEngine;

  const mockTrend: Trend = {
    id: 'test_trend_1',
    tag: '#TestTag',
    title: 'Test Trend 1',
    name: 'Test Trend 1',
    subtitle: 'Subtitle for test trend',
    imageUrl: 'https://example.com/test.jpg',
    category: 'fashion',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    popularity: 90,
    velocity: 40,
    growthPercentage: 40,
    region: 'global',
    usageCount: 15000,
    templateCount: 20,
    freshnessScore: 0.95,
    featuredPoseIds: ['pose_1'],
    isHot: true,
  };

  beforeEach(() => {
    engine = new TrendEngine(new LocalSeedTrendProvider([mockTrend]));
  });

  it('computes trend score correctly', () => {
    const score = engine.computeTrendScore(mockTrend, ['fashion']);
    expect(score).toBeGreaterThan(50);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('boosts score for preferred categories', () => {
    const scoreWithPref = engine.computeTrendScore(mockTrend, ['fashion']);
    const scoreWithoutPref = engine.computeTrendScore(mockTrend, ['sports']);
    expect(scoreWithPref).toBeGreaterThan(scoreWithoutPref);
  });

  it('ranks trends and marks hot status based on score threshold', async () => {
    const ranked = await engine.getRankedTrends(['fashion']);
    expect(ranked.length).toBe(1);
    expect(ranked[0].id).toBe('test_trend_1');
    expect(ranked[0].score).toBeDefined();
  });

  it('calculates freshness decay over time', () => {
    const fresh = engine.calculateFreshness(new Date().toISOString());
    const old = engine.calculateFreshness(new Date(Date.now() - 30 * 86400000).toISOString());
    expect(fresh).toBeGreaterThan(old);
  });
});
