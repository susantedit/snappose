/**
 * NotificationsScreen — Advanced Notification Center & Intelligence Hub for Snap Pose (POSEHANUM).
 *
 * Features:
 *  • Interactive Category Filter Bar (All, Unread, Motivation, Challenges, High Score, Comeback)
 *  • Notification Engagement & Analytics Dashboard Card
 *  • Rich Notification Log Cards with deep link routing, relative time formatting & status badges
 *  • Quick Actions: Mark as read, Snooze 1hr, Delete notification, Mark all read
 *  • Live Interactive Push Simulator Sheet (select tone, trigger custom AI notification)
 *  • Tactile Haptics & Smooth Reanimated spring transitions
 */

import React, { useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  Layout,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/constants/theme';
import { BorderRadius, Colors, Spacing } from '@/constants/designTokens';
import { useNotificationStore } from '@/stores/notificationStore';
import { SPIcon } from '@/components/atoms/SPIcon';
import { SPToast, useToast } from '@/components/molecules/SPToast';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';
import { AnimatedBottomSheet } from '@/components/motion/AnimatedBottomSheet';
import { useReducedMotion } from '@/constants/motion';
import { SNAP_POSE_NOTIFICATION_MESSAGES } from '@/features/notifications/data/notificationMessages';
import type {
  NotificationCategoryFamily,
  NotificationDeliveryLog,
  NotificationToneFilter,
} from '@/features/notifications/types';

type FilterCategory = 'ALL' | 'UNREAD' | NotificationCategoryFamily;

const CATEGORY_LABELS: Record<FilterCategory, string> = {
  ALL: 'All',
  UNREAD: 'Unread',
  DAILY_MOTIVATION: 'Motivation',
  POSE_CHALLENGE: 'Challenges',
  HIGH_SCORE: 'High Score',
  LOW_SCORE: 'Roasts & Low',
  MEDIUM_SCORE: 'Getting Warmer',
  PERFECT_SCORE: 'Perfect 100%',
  NO_PERSON: 'Empty Frame',
  REPEATED_FAILED: 'Retakes',
  STREAK: 'Streaks',
  COMEBACK: 'Comeback',
  CATEGORY_BASED: 'Categories',
  TIME_AWARE: 'Time Aware',
  SPECIAL_EVENT: 'Special Events',
  MILESTONE: 'Milestones',
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  DAILY_MOTIVATION: { bg: '#FEF3C7', text: '#D97706', icon: 'sparkles' },
  POSE_CHALLENGE: { bg: '#EDE9FE', text: '#7C3AED', icon: 'target' },
  HIGH_SCORE: { bg: '#D1FAE5', text: '#059669', icon: 'trophy' },
  COMEBACK: { bg: '#DBEAFE', text: '#2563EB', icon: 'refresh' },
  CATEGORY_BASED: { bg: '#FCE7F3', text: '#DB2777', icon: 'ai' },
  SPECIAL_EVENT: { bg: '#FEE2E2', text: '#DC2626', icon: 'calendar' },
  MILESTONE: { bg: '#E0E7FF', text: '#4F46E5', icon: 'award' },
};

function formatTimeAgo(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return 'Yesterday';
  return `${diffDay}d ago`;
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';
  const reduceMotion = useReducedMotion();
  const { toastProps, showToast } = useToast();

  const history = useNotificationStore((s) => s.history);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const preferences = useNotificationStore((s) => s.preferences);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const deleteLog = useNotificationStore((s) => s.deleteLog);
  const clearAllLogs = useNotificationStore((s) => s.clearAllLogs);
  const snoozeNotif = useNotificationStore((s) => s.snoozeNotification);
  const recordOpen = useNotificationStore((s) => s.recordOpen);
  const recordDelivery = useNotificationStore((s) => s.recordDelivery);
  const testTrigger = useNotificationStore((s) => s.testTriggerNotification);
  const getAnalyticsSummary = useNotificationStore((s) => s.getAnalyticsSummary);

  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const [showSimulatorSheet, setShowSimulatorSheet] = useState<boolean>(false);
  const [simTone, setSimTone] = useState<NotificationToneFilter>('playful');

  const analytics = useMemo(() => getAnalyticsSummary(), [history, getAnalyticsSummary]);

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      // Check snooze
      if (item.snoozedUntil && item.snoozedUntil > Date.now()) return false;
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'UNREAD') return !item.read;
      return item.category === activeFilter;
    });
  }, [history, activeFilter]);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
  };

  const handleOpenNotification = (log: NotificationDeliveryLog) => {
    triggerHaptic();
    recordOpen(log.id);

    if (log.deepLink) {
      try {
        router.push(log.deepLink as any);
      } catch {
        router.push('/(tabs)/camera');
      }
    }
  };

  const handleSnooze = (logId: string) => {
    triggerHaptic();
    snoozeNotif(logId, 60); // Snooze for 1 hour
    showToast({ message: 'Notification snoozed for 1 hour', variant: 'info' });
  };

  const handleDelete = (logId: string) => {
    triggerHaptic();
    deleteLog(logId);
    showToast({ message: 'Notification removed', variant: 'info' });
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to remove all notification history records?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearAllLogs();
            showToast({ message: 'All notification history cleared', variant: 'info' });
          },
        },
      ],
    );
  };

  const handleSimulateCustomPush = () => {
    triggerHaptic();
    const candidatePool = SNAP_POSE_NOTIFICATION_MESSAGES.filter(
      (m) => simTone === 'all' || m.tone === simTone,
    );
    const chosen = candidatePool[Math.floor(Math.random() * candidatePool.length)];

    if (chosen) {
      recordDelivery({
        messageId: chosen.id,
        title: chosen.title,
        body: chosen.body,
        category: chosen.category,
        deepLink: chosen.deepLink,
      });
      setShowSimulatorSheet(false);
      showToast({
        message: `[${chosen.title}] ${chosen.body}`,
        variant: 'success',
      });
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Animated.View
        entering={reduceMotion ? undefined : FadeIn.duration(300)}
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing.xs,
            borderBottomColor: isDark ? '#2E2E2E' : '#ECE5D8',
          },
        ]}
      >
        <AnimatedPressable onPress={() => router.back()} style={styles.backBtn}>
          <SPIcon name="arrowLeft" size={22} color={isDark ? '#FFF' : Colors.textPrimary} />
        </AnimatedPressable>

        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : Colors.textPrimary }]}>
            Notification Center
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        <View style={styles.headerRightActions}>
          <AnimatedPressable onPress={() => setShowSimulatorSheet(true)} style={styles.iconActionBtn}>
            <SPIcon name="sparkles" size={18} color={Colors.olive} />
          </AnimatedPressable>
          {unreadCount > 0 && (
            <AnimatedPressable onPress={markAllAsRead} style={styles.iconActionBtn}>
              <SPIcon name="check" size={18} color={Colors.olive} />
            </AnimatedPressable>
          )}
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        {/* Analytics & Engine Insights Card */}
        <Animated.View
          entering={reduceMotion ? undefined : FadeInDown.duration(400).delay(50)}
          style={[
            styles.analyticsCard,
            {
              backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
              borderColor: isDark ? '#2E2E2E' : '#ECE5D8',
            },
          ]}
        >
          <View style={styles.analyticsHeader}>
            <View style={styles.analyticsTitleRow}>
              <View style={styles.analyticsDot} />
              <Text style={[styles.analyticsTitle, { color: isDark ? '#FFF' : Colors.textPrimary }]}>
                Intelligence Engine Status
              </Text>
            </View>
            <Text style={[styles.analyticsSub, { color: Colors.olive }]}>
              {preferences.enabled ? 'ACTIVE • ON-DEVICE' : 'DISABLED'}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: isDark ? '#FFF' : Colors.textPrimary }]}>
                {analytics.totalDelivered}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? '#AAA' : Colors.textSecondary }]}>
                Delivered
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: isDark ? '#FFF' : Colors.textPrimary }]}>
                {analytics.openRatePercentage}%
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? '#AAA' : Colors.textSecondary }]}>
                Open Rate
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: isDark ? '#FFF' : Colors.textPrimary }]}>
                {preferences.quietHoursEnabled ? '10PM-8AM' : 'Off'}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? '#AAA' : Colors.textSecondary }]}>
                Quiet Hours
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Filter Pills Horizontal Scroll */}
        <Animated.View
          entering={reduceMotion ? undefined : FadeInDown.duration(400).delay(100)}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {(['ALL', 'UNREAD', 'DAILY_MOTIVATION', 'POSE_CHALLENGE', 'HIGH_SCORE', 'COMEBACK'] as FilterCategory[]).map(
              (cat) => {
                const isActive = activeFilter === cat;
                return (
                  <AnimatedPressable
                    key={cat}
                    onPress={() => {
                      triggerHaptic();
                      setActiveFilter(cat);
                    }}
                    style={[
                      styles.filterPill,
                      {
                        backgroundColor: isActive
                          ? Colors.olive
                          : isDark
                          ? '#1E1E1E'
                          : '#FFFFFF',
                        borderColor: isActive
                          ? Colors.olive
                          : isDark
                          ? '#2E2E2E'
                          : '#ECE5D8',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        {
                          color: isActive
                            ? '#FFFFFF'
                            : isDark
                            ? '#CCC'
                            : Colors.textPrimary,
                        },
                      ]}
                    >
                      {CATEGORY_LABELS[cat]}
                    </Text>
                  </AnimatedPressable>
                );
              },
            )}
          </ScrollView>
        </Animated.View>

        {/* Notification List Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionHeaderTitle, { color: isDark ? '#A3B899' : '#4F5B38' }]}>
              NOTIFICATIONS ({filteredHistory.length})
            </Text>
            {filteredHistory.length > 0 && (
              <Pressable onPress={handleClearAll}>
                <Text style={[styles.clearAllText, { color: Colors.olive }]}>Clear History</Text>
              </Pressable>
            )}
          </View>

          {filteredHistory.length === 0 ? (
            <Animated.View
              entering={reduceMotion ? undefined : FadeIn.duration(300)}
              style={[
                styles.emptyCard,
                {
                  backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                  borderColor: isDark ? '#2E2E2E' : '#ECE5D8',
                },
              ]}
            >
              <View style={styles.emptyIconCircle}>
                <SPIcon name="bell" size={28} color={Colors.olive} />
              </View>
              <Text style={[styles.emptyTitle, { color: isDark ? '#FFF' : Colors.textPrimary }]}>
                No Notifications Found
              </Text>
              <Text style={[styles.emptySubtitle, { color: isDark ? '#AAA' : Colors.textSecondary }]}>
                {activeFilter === 'UNREAD'
                  ? 'All notifications have been read!'
                  : 'You have no delivered notifications in this category.'}
              </Text>
              <AnimatedPressable
                onPress={() => {
                  testTrigger();
                  showToast({ message: 'Triggered AI notification test!', variant: 'success' });
                }}
                scaleTo={0.96}
                style={styles.testBtn}
              >
                <Text style={styles.testBtnText}>Trigger Test Notification</Text>
              </AnimatedPressable>
            </Animated.View>
          ) : (
            filteredHistory.map((item, idx) => {
              const themeTag = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.DAILY_MOTIVATION;

              return (
                <Animated.View
                  key={item.id}
                  entering={
                    reduceMotion
                      ? undefined
                      : FadeInDown.duration(350).delay(Math.min(idx * 40, 300))
                  }
                  layout={Layout.springify()}
                  style={[
                    styles.notifCard,
                    {
                      backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                      borderColor: isDark ? '#2E2E2E' : '#ECE5D8',
                      opacity: item.read ? 0.78 : 1,
                    },
                  ]}
                >
                  <View style={styles.cardMain}>
                    <View style={styles.cardHeaderRow}>
                      <View style={[styles.categoryBadge, { backgroundColor: themeTag.bg }]}>
                        <Text style={[styles.categoryBadgeText, { color: themeTag.text }]}>
                          {CATEGORY_LABELS[item.category] || item.category}
                        </Text>
                      </View>
                      <View style={styles.timeAgoRow}>
                        {!item.read && <View style={styles.unreadDot} />}
                        <Text style={[styles.timeAgoText, { color: isDark ? '#888' : '#888' }]}>
                          {formatTimeAgo(item.timestamp)}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.notifTitle, { color: isDark ? '#FFF' : Colors.textPrimary }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.notifBody, { color: isDark ? '#CCC' : Colors.textSecondary }]}>
                      {item.body}
                    </Text>

                    {/* Action Bar */}
                    <View style={styles.cardFooterRow}>
                      <AnimatedPressable
                        onPress={() => handleOpenNotification(item)}
                        style={styles.actionBtnPrimary}
                      >
                        <Text style={styles.actionBtnPrimaryText}>Open & View</Text>
                        <SPIcon name="arrowRight" size={14} color="#FFF" />
                      </AnimatedPressable>

                      <View style={styles.cardQuickIcons}>
                        {!item.read && (
                          <Pressable onPress={() => markAsRead(item.id)} style={styles.quickIconBtn}>
                            <SPIcon name="check" size={16} color={isDark ? '#AAA' : '#666'} />
                          </Pressable>
                        )}
                        <Pressable onPress={() => handleSnooze(item.id)} style={styles.quickIconBtn}>
                          <SPIcon name="clock" size={16} color={isDark ? '#AAA' : '#666'} />
                        </Pressable>
                        <Pressable onPress={() => handleDelete(item.id)} style={styles.quickIconBtn}>
                          <SPIcon name="trash" size={16} color={isDark ? '#AAA' : '#666'} />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Animated.View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Interactive Simulator Sheet */}
      <AnimatedBottomSheet
        visible={showSimulatorSheet}
        onClose={() => setShowSimulatorSheet(false)}
      >
        <View style={styles.sheetContainer}>
          <Text style={[styles.sheetTitle, { color: isDark ? '#FFF' : Colors.textPrimary }]}>
            AI Notification Simulator
          </Text>
          <Text style={[styles.sheetSub, { color: isDark ? '#AAA' : Colors.textSecondary }]}>
            Select a tone personality to preview how POSEHANUM crafts context-aware notifications.
          </Text>

          <Text style={[styles.sheetSectionLabel, { color: isDark ? '#A3B899' : '#4F5B38' }]}>
            SELECT TONE PERSONALITY
          </Text>

          <View style={styles.tonePillGrid}>
            {(
              [
                'roasted',
                'funny',
                'crispy',
                'savage',
                'confident',
                'hype',
                'coaching',
                'achievement',
                'playful',
                'positive',
              ] as NotificationToneFilter[]
            ).map((tone) => {
              const TONE_EMOJIS: Record<string, string> = {
                roasted: '🔥 Roasted',
                funny: '😭 Funny',
                crispy: '📸 Crispy',
                savage: '💀 Savage',
                confident: '🗿 Confident',
                hype: '👑 Hype',
                coaching: '🎯 Coaching',
                achievement: '🏆 Achievement',
                playful: '😈 Playful',
                positive: '❤️ Positive',
              };

              return (
                <Pressable
                  key={tone}
                  onPress={() => {
                    triggerHaptic();
                    setSimTone(tone);
                  }}
                  style={[
                    styles.tonePill,
                    {
                      backgroundColor: simTone === tone ? Colors.olive : isDark ? '#2E2E2E' : '#F4EFE6',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tonePillText,
                      { color: simTone === tone ? '#FFF' : isDark ? '#EEE' : Colors.textPrimary },
                    ]}
                  >
                    {TONE_EMOJIS[tone] || tone.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <AnimatedPressable
            onPress={handleSimulateCustomPush}
            scaleTo={0.97}
            style={styles.sheetSimulateBtn}
          >
            <SPIcon name="sparkles" size={18} color="#FFF" />
            <Text style={styles.sheetSimulateBtnText}>Send Live Notification Preview</Text>
          </AnimatedPressable>
        </View>
      </AnimatedBottomSheet>

      <SPToast {...toastProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  iconActionBtn: {
    padding: Spacing.xs,
  },
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  analyticsCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  analyticsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  analyticsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  analyticsTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  analyticsSub: {
    fontSize: 11,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: Spacing.xs,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#88888833',
  },
  filterScroll: {
    gap: Spacing.xs,
    paddingVertical: 4,
  },
  filterPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sectionContainer: {
    gap: Spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: Spacing.sm,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.olive + '1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  testBtn: {
    backgroundColor: Colors.olive,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.md,
  },
  testBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  notifCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
  },
  cardMain: {
    gap: 6,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timeAgoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  timeAgoText: {
    fontSize: 11,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  notifBody: {
    fontSize: 13,
    lineHeight: 18,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.olive,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  actionBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardQuickIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  quickIconBtn: {
    padding: 6,
  },
  sheetContainer: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sheetSub: {
    fontSize: 13,
    lineHeight: 18,
  },
  sheetSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  tonePillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  tonePill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.md,
  },
  tonePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sheetSimulateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.olive,
    paddingVertical: Spacing.sm + 4,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  sheetSimulateBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
