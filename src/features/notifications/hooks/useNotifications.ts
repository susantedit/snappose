/**
 * useNotifications — React hook providing access to POSEVIA Notification Personality System.
 *
 * Exposes:
 *  - notification preferences (enabled, quietHours, personality challenges)
 *  - update preferences helper
 *  - trigger test notification (with real AI score/context)
 *  - delivery history and fatigue status
 *  - reset notification state
 */

import { useCallback } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';
import { LocalNotificationService } from '../infrastructure/LocalNotificationService';

export function useNotifications() {
  const {
    preferences,
    history,
    exhaustedMessageIds,
    lastScheduledResult,
    unreadCount,
    updatePreferences,
    recordDelivery,
    recordOpen,
    markAsRead,
    markAllAsRead,
    deleteLog,
    clearAllLogs,
    snoozeNotification,
    resetNotificationHistory,
    evaluateAndScheduleNext,
    testTriggerNotification,
    getAnalyticsSummary,
  } = useNotificationStore();

  const triggerTestNotification = useCallback(async () => {
    const service = LocalNotificationService.getInstance();
    return service.testTriggerPersonalityNotification();
  }, []);

  const setEnabled = useCallback(
    (enabled: boolean) => {
      updatePreferences({ enabled });
    },
    [updatePreferences],
  );

  const setQuietHours = useCallback(
    (quietHoursEnabled: boolean) => {
      updatePreferences({ quietHoursEnabled });
    },
    [updatePreferences],
  );

  return {
    preferences,
    history,
    exhaustedMessageIds,
    lastScheduledResult,
    unreadCount,
    updatePreferences,
    recordDelivery,
    recordOpen,
    markAsRead,
    markAllAsRead,
    deleteLog,
    clearAllLogs,
    snoozeNotification,
    resetNotificationHistory,
    evaluateAndScheduleNext,
    testTriggerNotification,
    triggerTestNotification,
    getAnalyticsSummary,
    setEnabled,
    setQuietHours,
  };
}
