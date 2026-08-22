import { NotificationIntelligenceEngine } from '../domain/NotificationIntelligenceEngine';
import type {
  NotificationEngineContext,
  NotificationPersonalityMessage,
  NotificationPreferences,
} from '../types';

describe('NotificationIntelligenceEngine', () => {
  const mockPreferences: NotificationPreferences = {
    enabled: true,
    dailyReminders: true,
    poseChallenges: true,
    achievements: true,
    personalization: true,
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    preferredHour: 18,
    preferredMinute: 30,
    preferredFrequency: 'daily',
    preferredTone: 'all',
    soundEnabled: true,
    hapticsEnabled: true,
  };

  const createBaseContext = (overrides?: Partial<NotificationEngineContext>): NotificationEngineContext => {
    const fixedNow = new Date(2026, 7, 17, 18, 0, 0);
    const currentTime = overrides?.currentTime ?? fixedNow;
    return {
      lastActiveTimestamp: currentTime.getTime() - 3600 * 1000, // 1 hour ago
      totalAttempts: 5,
      bestScore: 78,
      favoriteCategories: ['street', 'portrait'],
      favoritePosesCount: 3,
      currentTime,
      recentDeliveredMessageIds: [],
      consecutiveIgnoredCount: 0,
      ...overrides,
    };
  };

  it('returns null when notifications are globally disabled', () => {
    const engine = new NotificationIntelligenceEngine();
    const result = engine.evaluateNextNotification(
      createBaseContext(),
      { ...mockPreferences, enabled: false },
    );
    expect(result).toBeNull();
  });

  it('selects comeback notifications when user has been inactive for 4 days', () => {
    const engine = new NotificationIntelligenceEngine();
    const base = createBaseContext();
    const fourDaysAgo = base.currentTime.getTime() - 4 * 24 * 3600 * 1000;
    const result = engine.evaluateNextNotification(
      createBaseContext({ lastActiveTimestamp: fourDaysAgo }),
      mockPreferences,
    );

    expect(result).not.toBeNull();
    expect(result?.message.category).toBe('COMEBACK');
    expect(result?.reason).toContain('inactivity');
  });

  it('selects high score achievement notifications when user achieved 95%', () => {
    const engine = new NotificationIntelligenceEngine();
    const result = engine.evaluateNextNotification(
      createBaseContext({ bestScore: 95, totalAttempts: 12 }),
      mockPreferences,
    );

    expect(result).not.toBeNull();
    expect(['HIGH_SCORE', 'MILESTONE']).toContain(result?.message.category);
  });

  it('boosts category-specific notifications matching user favorites (e.g. Trek)', () => {
    const customMessages: NotificationPersonalityMessage[] = [
      {
        id: 'trek-1',
        title: 'Trek Pose',
        body: 'Mountain ready',
        category: 'CATEGORY_BASED',
        targetCategories: ['trek'],
        deepLink: '/category/trek',
        tone: 'playful',
      },
      {
        id: 'mot-1',
        title: 'Daily Motivation',
        body: 'Generic motivation',
        category: 'DAILY_MOTIVATION',
        deepLink: '/(tabs)',
        tone: 'confident',
      },
    ];

    const engine = new NotificationIntelligenceEngine(customMessages);
    const result = engine.evaluateNextNotification(
      createBaseContext({ favoriteCategories: ['trek'] }),
      mockPreferences,
    );

    expect(result?.message.id).toBe('trek-1');
  });

  it('filters by tone preference when specific tone is requested', () => {
    const customMessages: NotificationPersonalityMessage[] = [
      {
        id: 'playful-1',
        title: 'Playful message',
        body: 'Playful body',
        category: 'DAILY_MOTIVATION',
        deepLink: '/(tabs)',
        tone: 'playful',
      },
      {
        id: 'teasing-1',
        title: 'Teasing message',
        body: 'Teasing body',
        category: 'DAILY_MOTIVATION',
        deepLink: '/(tabs)',
        tone: 'teasing',
      },
    ];

    const engine = new NotificationIntelligenceEngine(customMessages);
    const result = engine.evaluateNextNotification(
      createBaseContext(),
      { ...mockPreferences, preferredTone: 'teasing' },
    );

    expect(result?.message.id).toBe('teasing-1');
  });

  it('filters out recently delivered message IDs to prevent repetitive spam', () => {
    const customMessages: NotificationPersonalityMessage[] = [
      {
        id: 'msg-A',
        title: 'Message A',
        body: 'Body A',
        category: 'DAILY_MOTIVATION',
        deepLink: '/(tabs)',
        tone: 'playful',
      },
      {
        id: 'msg-B',
        title: 'Message B',
        body: 'Body B',
        category: 'DAILY_MOTIVATION',
        deepLink: '/(tabs)',
        tone: 'clever',
      },
    ];

    const engine = new NotificationIntelligenceEngine(customMessages);
    const result = engine.evaluateNextNotification(
      createBaseContext({ recentDeliveredMessageIds: ['msg-A'] }),
      mockPreferences,
    );

    expect(result?.message.id).toBe('msg-B');
  });

  it('enforces fatigue backoff when user consecutively ignored >= 3 notifications within 48h', () => {
    const engine = new NotificationIntelligenceEngine();
    const result = engine.evaluateNextNotification(
      createBaseContext({
        consecutiveIgnoredCount: 3,
        lastActiveTimestamp: Date.now() - 12 * 3600 * 1000, // 12 hours ago
      }),
      mockPreferences,
    );

    expect(result).toBeNull();
  });

  it('schedules notification outside quiet hours (22:00 – 08:00)', () => {
    const engine = new NotificationIntelligenceEngine();
    const result = engine.evaluateNextNotification(
      createBaseContext({
        currentTime: new Date(2026, 7, 17, 23, 0, 0), // 11:00 PM (inside quiet hours)
      }),
      {
        ...mockPreferences,
        preferredHour: 23, // wants 11 PM
      },
    );

    expect(result).not.toBeNull();
    const scheduledHour = result!.scheduledTime.getHours();
    // Must not be between 22 and 8
    expect(scheduledHour >= 8 && scheduledHour < 22).toBe(true);
  });
});
