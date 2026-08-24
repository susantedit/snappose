/**
 * LocalNotificationService — Orchestrator for Daily Personality Notifications
 * and Device-Level System Popups (e.g. Capture Limit Warnings, Test Notifications).
 *
 * Implements:
 *  - Native OS-level popup notifications via expo-notifications
 *  - 1-per-day smart scheduling based on on-device Intelligence Engine
 *  - Quiet hours enforcement & fatigue backoff
 *  - Device-level capture limit notifications ("Your limit is gonna reach")
 * [Req 33, 42]
 *
 * Expo Go note: expo-notifications' remote-push support was removed from Expo Go
 * in SDK 53, and merely importing the module there triggers a console error from
 * its push-token auto-registration side-effect. Local notifications are also only
 * partially supported in Expo Go. So we LAZY-load the module and treat Expo Go /
 * web as "notifications unavailable" (graceful no-op). Full device-level pop-ups
 * work in a development build or production build — which is the supported path.
 */

import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { useNotificationStore } from '@/stores/notificationStore';
import { usePersonalizationStore } from '@/stores/personalizationStore';
import { useHistoryStore } from '@/stores/historyStore';
import { NotificationIntelligenceEngine } from '../domain/NotificationIntelligenceEngine';
import { SNAP_POSE_NOTIFICATION_MESSAGES } from '../data/notificationMessages';
import type { NotificationSelectionResult } from '../types';

type NotificationsModule = typeof import('expo-notifications');

// Expo Go reports 'storeClient'; dev/production builds report 'standalone'/'bare'.
const IS_EXPO_GO = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let _notifications: NotificationsModule | null = null;
let _handlerConfigured = false;
let _unavailable = false;

/**
 * Lazily resolves the expo-notifications module. Returns null on web, in Expo Go,
 * or if the native module can't be loaded — callers then no-op gracefully. The
 * foreground presentation handler is configured exactly once, on first load, so
 * the module's import side-effects never run in Expo Go.
 */
function getNotifications(): NotificationsModule | null {
  if (Platform.OS === 'web' || IS_EXPO_GO || _unavailable) return null;
  if (_notifications) return _notifications;
  try {
    _notifications = require('expo-notifications') as NotificationsModule;
    if (!_handlerConfigured) {
      // expo-notifications 0.31+ (SDK 54) replaced `shouldShowAlert` with
      // `shouldShowBanner` + `shouldShowList`; we set all three so a heads-up
      // banner shows in the foreground on every supported version.
      _notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          priority: _notifications!.AndroidNotificationPriority.HIGH,
        }),
      });
      _handlerConfigured = true;
    }
  } catch (e) {
    _unavailable = true;
    _notifications = null;
    console.warn('[NotificationService] expo-notifications unavailable:', e);
  }
  return _notifications;
}

export class LocalNotificationService {
  private static instance: LocalNotificationService;
  private scheduledIds: Set<string> = new Set();
  private channelReady = false;

  private constructor() {}

  public static getInstance(): LocalNotificationService {
    if (!LocalNotificationService.instance) {
      LocalNotificationService.instance = new LocalNotificationService();
    }
    return LocalNotificationService.instance;
  }

  /**
   * Whether real device-level notifications are supported in this runtime.
   * False in Expo Go / web; screens can use this to show guidance instead of
   * silently doing nothing.
   */
  isSupported(): boolean {
    return getNotifications() !== null;
  }

  /**
   * Ensures a high-importance Android notification channel exists so alerts
   * appear as heads-up pop-ups (like normal apps) rather than silent tray
   * entries. No-op on iOS/web and after the first successful creation.
   */
  private async ensureAndroidChannel(): Promise<void> {
    if (Platform.OS !== 'android' || this.channelReady) return;
    const N = getNotifications();
    if (!N) return;
    try {
      await N.setNotificationChannelAsync('default', {
        name: 'General',
        importance: N.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
        lockscreenVisibility: N.AndroidNotificationVisibility.PUBLIC,
      });
      this.channelReady = true;
    } catch (e) {
      console.warn('[NotificationService] Failed to create Android channel:', e);
    }
  }

  /**
   * Request system notification permissions on Android/iOS.
   */
  async requestPermission(): Promise<boolean> {
    try {
      const N = getNotifications();
      if (!N) return false;
      // Channel must exist before scheduling so pop-ups are heads-up.
      await this.ensureAndroidChannel();
      const { status: existingStatus } = await N.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await N.requestPermissionsAsync();
        finalStatus = status;
      }
      return finalStatus === 'granted';
    } catch (e) {
      console.warn('[NotificationService] Permission request failed:', e);
      return false;
    }
  }

  /**
   * Triggers a direct native OS-level popup notification immediately.
   */
  async triggerNativeDeviceNotification(
    title: string,
    body: string,
    data: Record<string, any> = {}
  ): Promise<string | null> {
    try {
      const N = getNotifications();
      if (!N) {
        // Expo Go / web: no native delivery. Log so testing still shows intent.
        console.log(`[DeviceNotification unavailable in this runtime] ${title}: ${body}`);
        return null;
      }

      const hasPerm = await this.requestPermission();
      if (!hasPerm) {
        console.warn('[NotificationService] Permission not granted for device notification');
      }

      const notificationId = await N.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
          priority: N.AndroidNotificationPriority.MAX,
          vibrate: [0, 250, 250, 250],
        },
        trigger: null, // Deliver immediately as system popup
      });

      return notificationId;
    } catch (err) {
      console.warn('[NotificationService] Failed to trigger device notification:', err);
      return null;
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
    await this.triggerNativeDeviceNotification(
      'Snap Pose',
      result.message.title,
      { notificationId: result.message.id }
    );

    return result;
  }

  /**
   * Delivers a test notification popup — only called when user explicitly taps
   * "Test Notification" in settings. Never called automatically.
   */
  async testTriggerPersonalityNotification(): Promise<NotificationSelectionResult | null> {
    const store = useNotificationStore.getState();
    const result = store.testTriggerNotification();
    if (result?.message) {
      await this.triggerNativeDeviceNotification(
        'Snap Pose',
        result.message.title,
        { notificationId: result.message.id, test: true }
      );
    } else {
      await this.triggerNativeDeviceNotification(
        'Snap Pose',
        'Notifications are working! You will receive pose inspiration here.',
        { test: true }
      );
    }
    return result;
  }

  /**
   * Limit warning notification — intentionally suppressed from auto-firing.
   * Only trigger this explicitly from a user-initiated UI action (e.g. a "Notify me" button).
   * Auto-firing on every capture creates notification fatigue and unexpected popups.
   *
   * Call `notificationService.sendLimitWarningNotification()` only from user intent.
   */
  async sendLimitWarningNotification(_remainingCaptures: number, _maxLimit: number): Promise<void> {
    // No-op: notification suppressed. Use the explicit in-app SPCaptureLimitModal instead.
    return;
  }

  /**
   * Schedules initial welcome and 11 distinct daily recurring personality inspiration
   * notifications dynamically selected from the 100+ SNAP_POSE_NOTIFICATION_MESSAGES library,
   * rotating without repeating recently delivered messages.
   */
  async scheduleDefaultNotificationsOnInstall(): Promise<void> {
    try {
      const N = getNotifications();
      if (!N) return;

      const hasPerm = await this.requestPermission();
      if (!hasPerm) return;

      // Cancel any old scheduled notifications to prevent duplicates
      await N.cancelAllScheduledNotificationsAsync();

      const notifStore = useNotificationStore.getState();
      const profile = usePersonalizationStore.getState().profile;
      const historyAttempts = useHistoryStore.getState().attempts;

      const engine = new NotificationIntelligenceEngine(SNAP_POSE_NOTIFICATION_MESSAGES);

      // 1. Initial Welcome Personality Notification (10 seconds post-install)
      const motivations = SNAP_POSE_NOTIFICATION_MESSAGES.filter(
        (m) => m.category === 'DAILY_MOTIVATION' || m.id.startsWith('mot-'),
      );
      const welcomeMsg = motivations[0] || {
        title: 'Your camera roll called 📸',
        body: 'It said you’ve been standing like 🧍 for too long. Let’s fix that.',
        deepLink: '/(tabs)',
      };

      await N.scheduleNotificationAsync({
        content: {
          title: welcomeMsg.title,
          body: welcomeMsg.body,
          data: { deepLink: welcomeMsg.deepLink || '/(tabs)' },
          sound: 'default',
          priority: N.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          seconds: 10,
        } as any,
      });

      // 2. 24/7 Round-the-Clock 20-Minute Interval Recurring Slots (All 24 Hours, 72 Slots/Day)
      const TWENTY_FOUR_HOUR_SLOTS: Array<{ hour: number; minute: number }> = [];
      for (let hour = 0; hour < 24; hour++) {
        for (let min = 0; min < 60; min += 20) {
          TWENTY_FOUR_HOUR_SLOTS.push({ hour, minute: min });
        }
      }

      const scheduledItems = engine.evaluateDailySchedule(
        {
          currentTime: new Date(),
          lastActiveTimestamp: notifStore.history[0]?.timestamp ?? Date.now(),
          favoriteCategories: Object.keys(profile.preferredCategories || {}),
          favoritePosesCount: 0,
          totalAttempts: historyAttempts.length,
          recentDeliveredMessageIds: notifStore.exhaustedMessageIds,
          consecutiveIgnoredCount: 0,
          bestScore: historyAttempts.length > 0 ? Math.max(...historyAttempts.map((a) => a.score)) : 80,
          streakDays: 1,
        },
        notifStore.preferences,
        TWENTY_FOUR_HOUR_SLOTS,
      );

      for (const item of scheduledItems) {
        await N.scheduleNotificationAsync({
          content: {
            title: item.message.title,
            body: item.message.body,
            data: { deepLink: item.message.deepLink || '/(tabs)', notificationId: item.message.id },
            sound: 'default',
            priority: N.AndroidNotificationPriority.DEFAULT,
          },
          trigger: {
            hour: item.hour,
            minute: item.minute,
            repeats: true,
          } as any,
        });

        // Record in store to prevent repeating the same message for at least a month
        notifStore.recordDelivery({
          messageId: item.message.id,
          title: item.message.title,
          body: item.message.body,
          category: item.message.category,
          deepLink: item.message.deepLink || '/(tabs)',
        });
      }
    } catch (e) {
      console.warn('[NotificationService] scheduleDefaultNotificationsOnInstall error:', e);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    this.scheduledIds.clear();
    const N = getNotifications();
    if (!N) return;
    try {
      await N.cancelAllScheduledNotificationsAsync();
    } catch {}
  }
}

export const notificationService = LocalNotificationService.getInstance();
