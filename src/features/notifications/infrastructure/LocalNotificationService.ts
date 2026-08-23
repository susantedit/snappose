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
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useNotificationStore } from '@/stores/notificationStore';
import type { NotificationSelectionResult } from '../types';

// Configure foreground notification presentation for direct device-level popups.
// expo-notifications 0.31 (SDK 54) replaced `shouldShowAlert` with
// `shouldShowBanner` + `shouldShowList`; we set all three so a heads-up banner
// shows in the foreground on every supported version.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

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
   * Ensures a high-importance Android notification channel exists so alerts
   * appear as heads-up pop-ups (like normal apps) rather than silent tray
   * entries. No-op on iOS/web and after the first successful creation.
   */
  private async ensureAndroidChannel(): Promise<void> {
    if (Platform.OS !== 'android' || this.channelReady) return;
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'General',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
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
      if (Platform.OS === 'web') return false;
      // Channel must exist before scheduling so pop-ups are heads-up.
      await this.ensureAndroidChannel();
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
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
      if (Platform.OS === 'web') {
        console.log(`[DeviceNotification Mock] ${title}: ${body}`);
        return 'web-mock-id';
      }

      const hasPerm = await this.requestPermission();
      if (!hasPerm) {
        console.warn('[NotificationService] Permission not granted for device notification');
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.MAX,
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
      'POSEHANUM Daily Direction',
      result.message.title,
      { notificationId: result.message.id }
    );

    return result;
  }

  /**
   * Delivers an immediate device-level test notification popup for user verification.
   */
  async testTriggerPersonalityNotification(): Promise<NotificationSelectionResult | null> {
    const store = useNotificationStore.getState();
    const result = store.testTriggerNotification();
    if (result?.message) {
      await this.triggerNativeDeviceNotification(
        'POSEHANUM Test Alert',
        result.message.title,
        { notificationId: result.message.id, test: true }
      );
    } else {
      await this.triggerNativeDeviceNotification(
        'POSEHANUM Test Alert',
        'Your test notification is working! Direct device-level popup active.',
        { test: true }
      );
    }
    return result;
  }

  /**
   * Sends a device-level system popup alert when user is approaching or hit capture limits.
   */
  async sendLimitWarningNotification(remainingCaptures: number, maxLimit: number): Promise<void> {
    const title = '⚡ POSEHANUM Limit Alert';
    const body = remainingCaptures <= 0
      ? `Your daily capture limit of ${maxLimit} has been reached! Upgrade or watch an ad for bonus captures.`
      : `Your limit is gonna reach! Only ${remainingCaptures} capture${remainingCaptures === 1 ? '' : 's'} remaining today.`;

    await this.triggerNativeDeviceNotification(title, body, {
      type: 'LIMIT_WARNING',
      remainingCaptures,
      maxLimit,
    });
  }

  async cancelAllNotifications(): Promise<void> {
    this.scheduledIds.clear();
    if (Platform.OS !== 'web') {
      try {
        await Notifications.cancelAllScheduledNotificationsAsync();
      } catch {}
    }
  }
}

export const notificationService = LocalNotificationService.getInstance();
