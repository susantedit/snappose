/**
 * NotificationIntelligenceEngine — Smart Personality Scoring & Scheduling Engine.
 *
 * Evaluates user signals, category affinities, inactivity, time-of-day,
 * fatigue backoff, and quiet hours to select the single best notification
 * from the 150+ personality content scenarios.
 *
 * Privacy-first, 100% on-device.
 */

import { SNAP_POSE_NOTIFICATION_MESSAGES } from '../data/notificationMessages';
import type {
  NotificationEngineContext,
  NotificationPersonalityMessage,
  NotificationPreferences,
  NotificationSelectionResult,
  TimeWindow,
} from '../types';

export class NotificationIntelligenceEngine {
  private messages: NotificationPersonalityMessage[];

  constructor(customMessages?: NotificationPersonalityMessage[]) {
    this.messages = customMessages || SNAP_POSE_NOTIFICATION_MESSAGES;
  }

  /**
   * Evaluates context and selects the single highest-scoring personalized notification.
   */
  evaluateNextNotification(
    context: NotificationEngineContext,
    preferences: NotificationPreferences,
  ): NotificationSelectionResult | null {
    if (!preferences.enabled) {
      return null;
    }

    // Fatigue backoff check: If user has consecutively ignored >= 3 notifications,
    // enforce every-other-day delivery
    if (context.consecutiveIgnoredCount >= 3) {
      const hoursSinceLastActive = (context.currentTime.getTime() - context.lastActiveTimestamp) / (1000 * 3600);
      if (hoursSinceLastActive < 48) {
        return null;
      }
    }

    const currentHour = context.currentTime.getHours();
    const currentDay = context.currentTime.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const currentTimeWindow = this._getTimeWindow(currentHour);
    const inactivityDays = Math.floor(
      (context.currentTime.getTime() - context.lastActiveTimestamp) / (1000 * 3600 * 24),
    );

    // 1. Filter eligible messages according to preferences & constraints
    let eligible = this.messages.filter((msg) => {
      // Category preferences toggle filters
      if (msg.category === 'DAILY_MOTIVATION' && !preferences.dailyReminders) return false;
      if (msg.category === 'POSE_CHALLENGE' && !preferences.poseChallenges) return false;
      if (msg.category === 'HIGH_SCORE' && !preferences.achievements) return false;
      if (msg.category === 'MILESTONE' && !preferences.achievements) return false;
      if (msg.category === 'CATEGORY_BASED' && !preferences.personalization) return false;

      // Inactivity constraints for Comeback
      if (msg.category === 'COMEBACK') {
        const minDays = msg.minInactivityDays ?? 2;
        if (inactivityDays < minDays) return false;
      }

      // Score range constraints (Low, Medium, High, Perfect)
      if (msg.minScore !== undefined) {
        const scoreToCheck = context.lastAttemptScore ?? context.bestScore;
        if (scoreToCheck < msg.minScore) return false;
      }
      if (msg.maxScore !== undefined) {
        const scoreToCheck = context.lastAttemptScore ?? context.bestScore;
        if (scoreToCheck > msg.maxScore) return false;
      }

      // Streak constraints
      if (msg.minStreakDays !== undefined) {
        const currentStreak = context.streakDays ?? 0;
        if (currentStreak < msg.minStreakDays) return false;
      }

      // Repeated failed attempts constraints
      if (msg.minRepeatedAttempts !== undefined) {
        const failedCount = context.recentFailedAttemptsCount ?? 0;
        if (failedCount < msg.minRepeatedAttempts) return false;
      }

      // Days of week filter
      if (msg.daysOfWeek && !msg.daysOfWeek.includes(currentDay)) {
        return false;
      }

      // Time window filter
      if (msg.timeWindow && msg.timeWindow !== 'any' && msg.timeWindow !== currentTimeWindow) {
        return false;
      }

      // Tone preference filter
      if (preferences.preferredTone && preferences.preferredTone !== 'all') {
        if (msg.tone !== preferences.preferredTone) {
          return false;
        }
      }

      return true;
    });

    if (eligible.length === 0) {
      // Fallback to basic daily motivation
      eligible = this.messages.filter((m) => m.category === 'DAILY_MOTIVATION');
    }

    // 2. Filter out recently delivered messages (Pool Exhaustion prevention)
    let freshCandidates = eligible.filter(
      (msg) => !context.recentDeliveredMessageIds.includes(msg.id),
    );

    // If pool is exhausted, reset candidate pool to all eligible
    if (freshCandidates.length === 0) {
      freshCandidates = eligible;
    }

    // 3. Score candidates based on user relevance
    const scoredCandidates = freshCandidates.map((msg) => {
      let score = 50; // Base score

      // Category affinity boost
      if (msg.targetCategories && preferences.personalization) {
        const hasFavoriteCategory = msg.targetCategories.some((cat) =>
          context.favoriteCategories.includes(cat.toLowerCase()),
        );
        if (hasFavoriteCategory) {
          score += 35;
        }
      }

      // Inactivity urgency boost for comeback
      if (msg.category === 'COMEBACK') {
        score += 25 + Math.min(50, inactivityDays * 10);
      }

      // High score relevance boost
      if (msg.category === 'HIGH_SCORE' && context.bestScore >= 90) {
        score += 40;
      }

      // Special events (Friday / Weekend) boost
      if (msg.category === 'SPECIAL_EVENT') {
        score += 20;
      }

      // Time of day relevance boost
      if (msg.timeWindow === currentTimeWindow) {
        score += 15;
      }

      return {
        message: msg,
        score,
        reason: this._generateReason(msg, context),
      };
    });

    // Sort descending by score
    scoredCandidates.sort((a, b) => b.score - a.score);

    const topCandidate = scoredCandidates[0];
    if (!topCandidate) return null;

    // Calculate optimal trigger time adhering to quiet hours
    const scheduledTime = this._computeOptimalScheduleTime(
      context.currentTime,
      preferences,
    );

    return {
      message: topCandidate.message,
      scheduledTime,
      reason: topCandidate.reason,
      score: topCandidate.score,
    };
  }

  /**
   * Evaluates and returns a diverse set of distinct, unexhausted messages from the 100+
   * repository mapped across daytime slots, preventing repetitive notifications.
   */
  evaluateDailySchedule(
    context: NotificationEngineContext,
    preferences: NotificationPreferences,
    slots: Array<{ hour: number; minute: number }>,
  ): Array<{ hour: number; minute: number; message: NotificationPersonalityMessage }> {
    if (!preferences.enabled) return [];

    const usedIds = new Set<string>(context.recentDeliveredMessageIds);
    const selectedResults: Array<{ hour: number; minute: number; message: NotificationPersonalityMessage }> = [];

    for (const slot of slots) {
      const slotTimeWindow = this._getTimeWindow(slot.hour);

      // Find candidates matching time window or general category that haven't been selected yet
      let candidates = this.messages.filter((m) => {
        if (usedIds.has(m.id)) return false;
        if (m.category === 'COMEBACK' && (context.lastActiveTimestamp ? (Date.now() - context.lastActiveTimestamp) < 48 * 3600 * 1000 : true)) {
          return false; // only use COMEBACK if inactive
        }
        if (m.timeWindow && m.timeWindow !== 'any' && m.timeWindow !== slotTimeWindow) {
          return false;
        }
        return true;
      });

      // If no candidates for exact slot, relax time window filter
      if (candidates.length === 0) {
        candidates = this.messages.filter((m) => !usedIds.has(m.id));
      }

      // If all 150+ messages have been exhausted, reset usedIds to cycle pool
      if (candidates.length === 0) {
        usedIds.clear();
        candidates = this.messages;
      }

      // Pick the best scored candidate for this slot
      const scored = candidates.map((m) => {
        let score = Math.random() * 20; // gentle random jitter to keep daily rotation fresh
        if (m.timeWindow === slotTimeWindow) score += 30;
        if (slot.hour >= 17 && slot.hour <= 19 && (m.id.includes('gold') || m.category === 'SPECIAL_EVENT')) score += 40;
        if (slot.hour >= 8 && slot.hour <= 10 && m.category === 'DAILY_MOTIVATION') score += 25;
        if (m.targetCategories?.some((c) => context.favoriteCategories.includes(c.toLowerCase()))) score += 30;
        return { message: m, score };
      });

      scored.sort((a, b) => b.score - a.score);
      const chosen = scored[0]?.message || this.messages[0];

      usedIds.add(chosen.id);
      selectedResults.push({
        hour: slot.hour,
        minute: slot.minute,
        message: chosen,
      });
    }

    return selectedResults;
  }

  // ---------------------------------------------------------------------------
  // Helper Methods
  // ---------------------------------------------------------------------------

  private _getTimeWindow(hour: number): TimeWindow {
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  private _computeOptimalScheduleTime(
    now: Date,
    preferences: NotificationPreferences,
  ): Date {
    const scheduled = new Date(now);
    scheduled.setHours(preferences.preferredHour, preferences.preferredMinute, 0, 0);

    // If preferred time has passed today, schedule for tomorrow
    if (scheduled.getTime() <= now.getTime()) {
      scheduled.setDate(scheduled.getDate() + 1);
    }

    // Check Quiet Hours (e.g. 22:00 to 08:00)
    if (preferences.quietHoursEnabled) {
      const [startHour] = preferences.quietHoursStart.split(':').map(Number);
      const [endHour] = preferences.quietHoursEnd.split(':').map(Number);

      const hour = scheduled.getHours();
      const isQuietTime =
        startHour > endHour
          ? hour >= startHour || hour < endHour // spans midnight (e.g. 22 to 8)
          : hour >= startHour && hour < endHour;

      if (isQuietTime) {
        // Shift time to 30 mins after quiet hours end
        scheduled.setHours(endHour, 30, 0, 0);
      }
    }

    return scheduled;
  }

  private _generateReason(
    msg: NotificationPersonalityMessage,
    context: NotificationEngineContext,
  ): string {
    switch (msg.category) {
      case 'COMEBACK':
        return 'Re-engagement based on recent inactivity';
      case 'HIGH_SCORE':
        return `Personalized challenge for your ${context.bestScore}% best match score`;
      case 'CATEGORY_BASED':
        return `Matched to your preferred categories (${context.favoriteCategories.slice(0, 2).join(', ')})`;
      case 'SPECIAL_EVENT':
        return 'Contextual timing for weekend and golden hour';
      default:
        return 'Daily curated photography inspiration';
    }
  }
}
