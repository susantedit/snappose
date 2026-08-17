/**
 * PoseHistoryScreen — "My Poses" & "My Attempts" History Manager.
 *
 * Features:
 *  - View past attempts with exact match scores (0–100%)
 *  - Filter by All, High Match (90%+), Custom Uploads, and Captures
 *  - Delete attempt records or clear entire history
 *  - Quick "Retry Pose in Camera" action
 */

import React, { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useTheme } from '@/constants/theme';
import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';
import { useHistoryStore, PoseAttempt } from '@/stores/historyStore';
import { useCustomPoseStore } from '@/stores/customPoseStore';

const TABS = [
  { id: 'all', label: 'All Attempts' },
  { id: 'top', label: '90%+ Match' },
  { id: 'custom', label: 'Custom Poses' },
];

export default function PoseHistoryScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { attempts, deleteAttempt, clearHistory } = useHistoryStore();
  const { customPoses, removeCustomPose } = useCustomPoseStore();

  const [activeTab, setActiveTab] = useState('all');

  const filteredAttempts = attempts.filter((a) => {
    if (activeTab === 'top') return a.score >= 90;
    return true;
  });

  const renderAttemptItem = ({ item }: { item: PoseAttempt }) => {
    const isTopScore = item.score >= 90;
    const scoreColor = isTopScore ? Colors.scoreDarkGreen : item.score >= 75 ? Colors.scoreGreen : Colors.scoreOrange;

    return (
      <Animated.View entering={FadeInDown.duration(300)} style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={[styles.poseTitle, { color: theme.colors.textPrimary }]}>{item.poseTitle}</Text>
            <Text style={[styles.poseMeta, { color: theme.colors.textSecondary }]}>
              {item.poseCategory} • {item.mode === 'photographer' ? 'Photographer Mode' : 'Subject Mode'} •{' '}
              {new Date(item.timestamp).toLocaleDateString()}
            </Text>
          </View>

          <View style={[styles.scoreBadge, { borderColor: scoreColor, backgroundColor: `${scoreColor}15` }]}>
            <Text style={[styles.scoreText, { color: scoreColor }]}>{item.score}%</Text>
          </View>
        </View>

        <View style={[styles.cardActions, { borderTopColor: theme.colors.divider }]}>
          <AnimatedPressable
            onPress={() => {
              router.push({
                pathname: '/(tabs)/camera',
                params: { poseId: item.poseId },
              });
            }}
            style={[styles.actionBtn, { backgroundColor: theme.colors.olive }]}
            accessibilityLabel="Retry this pose in camera"
          >
            <SPIcon name="camera" size={14} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>RETRY IN CAMERA</Text>
          </AnimatedPressable>

          <AnimatedPressable
            onPress={() => deleteAttempt(item.id)}
            style={styles.deleteBtn}
            accessibilityLabel="Delete attempt"
          >
            <SPIcon name="trash" size={18} color={theme.colors.textDisabled} />
          </AnimatedPressable>
        </View>
      </Animated.View>
    );
  };

  const renderCustomPoseItem = ({ item }: { item: any }) => (
    <Animated.View entering={FadeInDown.duration(300)} style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.olive }]}>
      <View style={styles.customCardContent}>
        <Image source={{ uri: item.imageUri }} style={styles.customThumb} resizeMode="cover" />
        <View style={styles.cardInfo}>
          <Text style={[styles.poseTitle, { color: theme.colors.textPrimary }]}>{item.title}</Text>
          <Text style={[styles.poseMeta, { color: theme.colors.textSecondary }]}>
            {item.category} • Custom Upload • 33 Landmarks
          </Text>
        </View>
      </View>

      <View style={[styles.cardActions, { borderTopColor: theme.colors.divider }]}>
        <AnimatedPressable
          onPress={() => {
            router.push({
              pathname: '/(tabs)/camera',
              params: { poseId: item.id },
            });
          }}
          style={[styles.actionBtn, { backgroundColor: theme.colors.olive }]}
        >
          <SPIcon name="camera" size={14} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>USE IN CAMERA</Text>
        </AnimatedPressable>

        <AnimatedPressable
          onPress={() => removeCustomPose(item.id)}
          style={styles.deleteBtn}
        >
          <SPIcon name="trash" size={18} color={theme.colors.textDisabled} />
        </AnimatedPressable>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <AnimatedPressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Go back"
        >
          <SPIcon name="arrowLeft" size={24} color={theme.colors.textPrimary} />
        </AnimatedPressable>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>My Poses & Attempts</Text>
        {attempts.length > 0 && (
          <AnimatedPressable
            onPress={clearHistory}
            style={styles.clearBtn}
            accessibilityLabel="Clear all history"
          >
            <Text style={[styles.clearBtnText, { color: Colors.error }]}>CLEAR</Text>
          </AnimatedPressable>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <AnimatedPressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[
                styles.tabPill,
                {
                  backgroundColor: isSelected ? theme.colors.olive : theme.colors.surface,
                  borderColor: isSelected ? theme.colors.olive : theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabPillText,
                  { color: isSelected ? '#FFFFFF' : theme.colors.textSecondary },
                ]}
              >
                {tab.label}
              </Text>
            </AnimatedPressable>
          );
        })}
      </View>

      {/* List */}
      {activeTab === 'custom' ? (
        <FlatList
          data={customPoses}
          keyExtractor={(item) => item.id}
          renderItem={renderCustomPoseItem}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 24 }]}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <SPIcon name="image" size={48} color={theme.colors.textDisabled} />
              <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>No Custom Poses Yet</Text>
              <Text style={[styles.emptyDesc, { color: theme.colors.textSecondary }]}>
                Upload photos from your gallery to extract landmarks and create custom pose templates.
              </Text>
              <AnimatedPressable
                onPress={() => router.push('/pose/upload')}
                style={[styles.uploadActionBtn, { backgroundColor: theme.colors.olive }]}
              >
                <Text style={styles.uploadActionText}>UPLOAD CUSTOM POSE</Text>
              </AnimatedPressable>
            </View>
          }
        />
      ) : (
        <FlatList
          data={filteredAttempts}
          keyExtractor={(item) => item.id}
          renderItem={renderAttemptItem}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 24 }]}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <SPIcon name="camera" size={48} color={theme.colors.textDisabled} />
              <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>No Attempts Recorded</Text>
              <Text style={[styles.emptyDesc, { color: theme.colors.textSecondary }]}>
                Strike a pose in the camera viewfinder! Every session and match score will be logged here.
              </Text>
            </View>
          }
        />
      )}
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
    paddingVertical: Spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  clearBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  clearBtnText: {
    fontSize: Typography.sizes.caption - 1,
    fontWeight: Typography.weights.bold,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  tabPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.avatar,
    borderWidth: 1,
  },
  tabPillText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    textTransform: 'uppercase',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    gap: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customCardContent: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  customThumb: {
    width: 60,
    height: 80,
    borderRadius: BorderRadius.md,
  },
  cardInfo: {
    flex: 1,
  },
  poseTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    textTransform: 'uppercase',
  },
  poseMeta: {
    fontSize: Typography.sizes.caption - 1,
    fontWeight: Typography.weights.medium,
    marginTop: 2,
  },
  scoreBadge: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.avatar,
    borderWidth: 1,
  },
  scoreText: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.bold,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.avatar,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.caption - 1,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },
  deleteBtn: {
    padding: Spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold,
    textTransform: 'uppercase',
    marginTop: Spacing.sm,
  },
  emptyDesc: {
    fontSize: Typography.sizes.caption,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  uploadActionBtn: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.avatar,
  },
  uploadActionText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
  },
});
