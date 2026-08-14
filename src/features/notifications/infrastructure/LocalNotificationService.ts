/**
 * Local Notification Service for scheduling reminders and announcements.
 * [Req 33, 42]
 */

import type { INotificationService, NotificationPayload } from '../domain/interfaces/NotificationService';

export class LocalNotificationService implements INotificationService {
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
      // In Expo with expo-notifications when configured:
      // const { status } = await Notifications.requestPermissionsAsync();
      // return status === 'granted';
      return true;
    } catch (e) {
      console.warn('[NotificationService] Permission request failed:', e);
      return false;
    }
  }

  async scheduleNotification(payload: NotificationPayload): Promise<string> {
    const id = payload.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.scheduledIds.add(id);
    return id;
  }

  async cancelNotification(notificationId: string): Promise<void> {
    this.scheduledIds.delete(notificationId);
  }

  async cancelAllNotifications(): Promise<void> {
    this.scheduledIds.clear();
  }

  async scheduleDailyPoseReminder(hour: number = 10, minute: number = 0): Promise<string> {
    return this.scheduleNotification({
      id: 'daily_pose_reminder',
      title: '📸 Ready for today’s photoshoot?',
      body: 'Explore fresh trending poses and elevate your photography skills with AI coaching!',
      type: 'daily_pose',
      triggerSeconds: hour * 3600 + minute * 60,
    });
  }

  async scheduleCaptureWindowResetReminder(resetInSeconds: number): Promise<string> {
    return this.scheduleNotification({
      id: 'capture_window_reset',
      title: '🎉 Photo Captures Refreshed!',
      body: 'Your 10-photo capture quota has reset. Time to take more amazing shots!',
      type: 'capture_window_reset',
      triggerSeconds: resetInSeconds,
    });
  }
}

export const notificationService = LocalNotificationService.getInstance();
