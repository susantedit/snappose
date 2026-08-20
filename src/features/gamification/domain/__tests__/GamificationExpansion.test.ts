import { GamificationEngine } from '../GamificationEngine';

describe('GamificationEngine Achievements & Badges Expansion', () => {
  it('returns all required standard and expanded achievements', () => {
    const achievements = GamificationEngine.getStandardAchievements();
    const ids = achievements.map((a) => a.id);

    expect(ids).toContain('first_snap');
    expect(ids).toContain('daily_director_challenge');
    expect(ids).toContain('streak_7');
    expect(ids).toContain('streak_30');
    expect(ids).toContain('template_creator');
    expect(ids).toContain('remix_master');
    expect(ids).toContain('pose_explorer');
    expect(ids).toContain('signature_pose_master');
    expect(ids).toContain('trendsetter');
  });

  it('calculates XP progression correctly', () => {
    const level1 = GamificationEngine.getLevelFromXP(0);
    expect(level1).toBe(1);

    const level2 = GamificationEngine.getLevelFromXP(150);
    expect(level2).toBe(2);

    const progress = GamificationEngine.getXPProgressInLevel(150, 2);
    expect(progress.current).toBe(50);
    expect(progress.target).toBe(300);
  });

  it('generates consistent deterministic daily challenge for any date string', () => {
    const challenge1 = GamificationEngine.getDailyChallenge('2026-08-19');
    const challenge2 = GamificationEngine.getDailyChallenge('2026-08-19');
    expect(challenge1.id).toBe(challenge2.id);
    expect(challenge1.targetPoseId).toBe(challenge2.targetPoseId);
    expect(challenge1.xpReward).toBe(200);
  });
});
