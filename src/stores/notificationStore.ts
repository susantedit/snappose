/**
 * NotificationStore — Local Zustand Store for Snap Pose Daily Personality Notifications.
 * Persists preferences, delivery history, exhaustion tracking, and quiet hours to MMKV.
 */

import { create } from 'zustand';
import { mmkv } from '@/database/mmkv/mmkvClient';
import type {
  NotificationDeliveryLog,
  NotificationEngineContext,
  NotificationPreferences,
  NotificationSelectionResult,
} from '@/features/notifications/types';
import { NotificationIntelligenceEngine } from '@/features/notifications/domain/NotificationIntelligenceEngine';
import { usePersonalizationStore } from '@/stores/personalizationStore';
import { useHistoryStore } from '@/stores/historyStore';

interface NotificationState {
  preferences: NotificationPreferences;
  history: NotificationDeliveryLog[];
  exhaustedMessageIds: string[];
  lastScheduledResult: NotificationSelectionResult | null;

  // Actions
  updatePreferences: (updates: Partial<NotificationPreferences>) => void;
  recordDelivery: (logData: Omit<NotificationDeliveryLog, 'id' | 'timestamp' | 'opened' | 'delivered'>) => NotificationDeliveryLog;
  recordOpen: (logId: string) => void;
  resetNotificationHistory: () => void;
  evaluateAndScheduleNext: () => NotificationSelectionResult | null;
  testTriggerNotification: () => NotificationSelectionResult | null;
}

const PREFERENCES_KEY = 'snappose_notif_preferences_v1';
const HISTORY_KEY = 'snappose_notif_history_v1';
const EXHAUSTED_KEY = 'snappose_notif_exhausted_v1';

const DEFAULT_PREFERENCES: NotificationPreferences = {
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
};

function loadPreferences(): NotificationPreferences {
  try {
    const raw = mmkv.getString(PREFERENCES_KEY);
    if (raw) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    }
  } catch {}
  return DEFAULT_PREFERENCES;
}

function loadHistory(): NotificationDeliveryLog[] {
  try {
    const raw = mmkv.getString(HISTORY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

function loadExhausted(): string[] {
  try {
    const raw = mmkv.getString(EXHAUSTED_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

const engine = new NotificationIntelligenceEngine();

export const useNotificationStore = create<NotificationState>((set, get) => ({
  preferences: loadPreferences(),
  history: loadHistory(),
  exhaustedMessageIds: loadExhausted(),
  lastScheduledResult: null,

  updatePreferences: (updates) => {
    const updated = { ...get().preferences, ...updates };
    mmkv.set(PREFERENCES_KEY, JSON.stringify(updated));
    set({ preferences: updated });
  },

  recordDelivery: (logData) => {
    const newLog: NotificationDeliveryLog = {
      ...logData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      delivered: true,
      opened: false,
    };

    const nextHistory = [newLog, ...get().history].slice(0, 100);
    const nextExhausted = Array.from(new Set([newLog.messageId, ...get().exhaustedMessageIds])).slice(0, 150);

    mmkv.set(HISTORY_KEY, JSON.stringify(nextHistory));
    mmkv.set(EXHAUSTED_KEY, JSON.stringify(nextExhausted));

    set({ history: nextHistory, exhaustedMessageIds: nextExhausted });
    return newLog;
  },

  recordOpen: (logId) => {
    const nextHistory = get().history.map((h) => (h.id === logId ? { ...h, opened: true } : h));
    mmkv.set(HISTORY_KEY, JSON.stringify(nextHistory));
    set({ history: nextHistory });
  },

  resetNotificationHistory: () => {
    mmkv.set(HISTORY_KEY, JSON.stringify([]));
    mmkv.set(EXHAUSTED_KEY, JSON.stringify([]));
    set({ history: [], exhaustedMessageIds: [] });
  },

  evaluateAndScheduleNext: () => {
    const { preferences, exhaustedMessageIds, history } = get();
    const profile = usePersonalizationStore.getState().profile;
    const attempts = useHistoryStore.getState().attempts;

    // Derive top favorite categories from personalization profile
    const sortedCategories = Object.entries(profile?.preferredCategories || {})
      .sort(([, a], [, b]) => b - a)
      .map(([cat]) => cat);

    // Calculate best score across history
    const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : profile?.averageMatchScore || 0;

    // Consecutive ignored count
    let consecutiveIgnored = 0;
    for (const item of history) {
      if (item.delivered && !item.opened) {
        consecutiveIgnored++;
      } else {
        break;
      }
    }

    const context: NotificationEngineContext = {
      lastActiveTimestamp: Date.now() - 3600 * 1000,
      totalAttempts: attempts.length,
      bestScore,
      favoriteCategories: sortedCategories.length > 0 ? sortedCategories : ['street', 'cafe', 'portrait'],
      favoritePosesCount: attempts.filter((a) => a.isFavorite).length,
      currentTime: new Date(),
      recentDeliveredMessageIds: exhaustedMessageIds,
      consecutiveIgnoredCount: consecutiveIgnored,
    };

    const result = engine.evaluateNextNotification(context, preferences);
    set({ lastScheduledResult: result });
    return result;
  },

  testTriggerNotification: () => {
    const { evaluateAndScheduleNext, recordDelivery } = get();
    const result = evaluateAndScheduleNext();
    if (result) {
      recordDelivery({
        messageId: result.message.id,
        title: result.message.title,
        body: result.message.body,
        category: result.message.category,
        deepLink: result.message.deepLink,
      });
    }
    return result;
  },
}));
