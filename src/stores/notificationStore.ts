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
  unreadCount: number;

  // Actions
  updatePreferences: (updates: Partial<NotificationPreferences>) => void;
  recordDelivery: (logData: Omit<NotificationDeliveryLog, 'id' | 'timestamp' | 'opened' | 'delivered' | 'read'>) => NotificationDeliveryLog;
  recordOpen: (logId: string) => void;
  markAsRead: (logId: string) => void;
  markAllAsRead: () => void;
  deleteLog: (logId: string) => void;
  clearAllLogs: () => void;
  snoozeNotification: (logId: string, minutes?: number) => void;
  resetNotificationHistory: () => void;
  evaluateAndScheduleNext: () => NotificationSelectionResult | null;
  testTriggerNotification: () => NotificationSelectionResult | null;
  getAnalyticsSummary: () => {
    totalDelivered: number;
    totalOpened: number;
    openRatePercentage: number;
    unreadCount: number;
    recentCategoryCount: Record<string, number>;
  };
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
  preferredFrequency: 'daily',
  preferredTone: 'all',
  soundEnabled: true,
  hapticsEnabled: true,
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
      const parsed: NotificationDeliveryLog[] = JSON.parse(raw);
      return parsed.map((h) => ({
        ...h,
        read: h.read ?? h.opened ?? false,
      }));
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

const initialHistory = loadHistory();

export const useNotificationStore = create<NotificationState>((set, get) => ({
  preferences: loadPreferences(),
  history: initialHistory,
  exhaustedMessageIds: loadExhausted(),
  lastScheduledResult: null,
  unreadCount: initialHistory.filter((h) => !h.read).length,

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
      read: false,
    };

    const nextHistory = [newLog, ...get().history].slice(0, 100);
    const nextExhausted = Array.from(new Set([newLog.messageId, ...get().exhaustedMessageIds])).slice(0, 150);

    mmkv.set(HISTORY_KEY, JSON.stringify(nextHistory));
    mmkv.set(EXHAUSTED_KEY, JSON.stringify(nextExhausted));

    set({
      history: nextHistory,
      exhaustedMessageIds: nextExhausted,
      unreadCount: nextHistory.filter((h) => !h.read).length,
    });
    return newLog;
  },

  recordOpen: (logId) => {
    const nextHistory = get().history.map((h) => (h.id === logId ? { ...h, opened: true, read: true } : h));
    mmkv.set(HISTORY_KEY, JSON.stringify(nextHistory));
    set({
      history: nextHistory,
      unreadCount: nextHistory.filter((h) => !h.read).length,
    });
  },

  markAsRead: (logId) => {
    const nextHistory = get().history.map((h) => (h.id === logId ? { ...h, read: true } : h));
    mmkv.set(HISTORY_KEY, JSON.stringify(nextHistory));
    set({
      history: nextHistory,
      unreadCount: nextHistory.filter((h) => !h.read).length,
    });
  },

  markAllAsRead: () => {
    const nextHistory = get().history.map((h) => ({ ...h, read: true }));
    mmkv.set(HISTORY_KEY, JSON.stringify(nextHistory));
    set({
      history: nextHistory,
      unreadCount: 0,
    });
  },

  deleteLog: (logId) => {
    const nextHistory = get().history.filter((h) => h.id !== logId);
    mmkv.set(HISTORY_KEY, JSON.stringify(nextHistory));
    set({
      history: nextHistory,
      unreadCount: nextHistory.filter((h) => !h.read).length,
    });
  },

  clearAllLogs: () => {
    mmkv.set(HISTORY_KEY, JSON.stringify([]));
    set({ history: [], unreadCount: 0 });
  },

  snoozeNotification: (logId, minutes = 60) => {
    const snoozedUntil = Date.now() + minutes * 60 * 1000;
    const nextHistory = get().history.map((h) => (h.id === logId ? { ...h, snoozedUntil } : h));
    mmkv.set(HISTORY_KEY, JSON.stringify(nextHistory));
    set({ history: nextHistory });
  },

  resetNotificationHistory: () => {
    mmkv.set(HISTORY_KEY, JSON.stringify([]));
    mmkv.set(EXHAUSTED_KEY, JSON.stringify([]));
    set({ history: [], exhaustedMessageIds: [], unreadCount: 0 });
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

  getAnalyticsSummary: () => {
    const { history } = get();
    const totalDelivered = history.length;
    const totalOpened = history.filter((h) => h.opened).length;
    const openRatePercentage = totalDelivered > 0 ? Math.round((totalOpened / totalDelivered) * 100) : 0;
    const unreadCount = history.filter((h) => !h.read).length;

    const recentCategoryCount: Record<string, number> = {};
    history.forEach((h) => {
      recentCategoryCount[h.category] = (recentCategoryCount[h.category] || 0) + 1;
    });

    return {
      totalDelivered,
      totalOpened,
      openRatePercentage,
      unreadCount,
      recentCategoryCount,
    };
  },
}));
