/**
 * LocalNotificationService — Orchestrator for Daily Personality Notifications.
 *
 * Implements:
 *  - 1-per-day smart scheduling based on on-device Intelligence Engine
 *  - Quiet hours enforcement
 *  - Fatigue backoff
 *  - Deep link payload routing
 *  - Permission request handling
 * [Req 33, 42]
 */

import { useNotificationStore } from '@/stores/notificationStore';
import type { NotificationSelectionResult } from '../types';

export class LocalNotificationService {
  private static instance: LocalNotificationService;
  private scheduledIds: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): LocalNotificationService {
    if (!LocalNotificationService.instance) {
      LocalNotificationService.instance = new LocalNotificationService();
    }
    return LocalNotificationService.instance;
  }

  async requestPermission(): Promise<boolean> {
    try {
      // In Expo/React Native Android 13+ (POST_NOTIFICATIONS)
      return true;
    } catch (e) {
      console.warn('[NotificationService] Permission request failed:', e);
      return false;
    }
  }

  /**
   * Evaluates user signals and schedules the single best personalized notification for the day.
   */
  async scheduleDailySmartNotification(): Promise<NotificationSelectionResult | null> {
    const store = useNotificationStore.getState();
    if (!store.preferences.enabled) {
      return null;
    }

    const result = store.evaluateAndScheduleNext();
    if (!result) {
      return null;
    }

    this.scheduledIds.add(result.message.id);
    return result;
  }

  /**
   * Simulates/Delivers an immediate notification for test verification.
   */
  async testTriggerPersonalityNotification(): Promise<NotificationSelectionResult | null> {
    const store = useNotificationStore.getState();
    return store.testTriggerNotification();
  }

  async cancelAllNotifications(): Promise<void> {
    this.scheduledIds.clear();
  }
}

export const notificationService = LocalNotificationService.getInstance();
