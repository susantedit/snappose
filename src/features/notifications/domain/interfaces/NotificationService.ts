import type { NotificationType } from '../../types';

export interface NotificationPayload {
  id?: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  type: NotificationType;
  triggerSeconds?: number;
}

export interface INotificationService {
  requestPermission(): Promise<boolean>;
  scheduleNotification(payload: NotificationPayload): Promise<string>;
  cancelNotification(notificationId: string): Promise<void>;
  cancelAllNotifications(): Promise<void>;
  scheduleDailyPoseReminder(hour?: number, minute?: number): Promise<string>;
  scheduleCaptureWindowResetReminder(resetInSeconds: number): Promise<string>;
}
