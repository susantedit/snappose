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
    const N = getNotifications();
    if (!N) return;
    try {
      await N.cancelAllScheduledNotificationsAsync();
    } catch {}
  }
}

export const notificationService = LocalNotificationService.getInstance();
