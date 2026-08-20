/**
 * SPOnboardingChecklist — Getting Started Checklist Widget.
 *
 * Guides new users to their first 5 "aha moments":
 *  1. Explore Pose References
 *  2. Try AI Director in Camera
 *  3. Capture First AI-Verified Photo
 *  4. Design Creative Template
 *  5. Save a Signature Pose
 *
 * Features:
 *  - Dynamic progress bar with fraction counter (e.g., "3/5 Completed")
 *  - Tappable steps that deep-link directly to the required feature screen
 *  - Visual checkmarks and strikethrough text for completed milestones
 *  - Collapsible header & dismiss button
 *  - Persistent across app sessions
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/constants/theme';
import { Colors, Spacing, BorderRadius } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';
import {
  useOnboardingChecklistStore,
  ONBOARDING_STEP_DEFS,
  type OnboardingStepId,
} from '@/stores/onboardingChecklistStore';

export function SPOnboardingChecklist() {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';

  const {
    steps,
    isCollapsed,
    isDismissed,
    toggleCollapsed,
    dismiss,
    getCompletedCount,
    getTotalCount,
    isAllCompleted,
  } = useOnboardingChecklistStore();

  if (isDismissed) return null;

  const completedCount = getCompletedCount();
  const totalCount = getTotalCount();
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const allDone = isAllCompleted();

  const handleStepPress = (_stepId: OnboardingStepId, route: string) => {
    router.push(route as any);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1C1F19' : '#FFFFFF',
          borderColor: isDark ? '#2D3326' : '#E6DFD3',
        },
      ]}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleWrap}>
          <View style={styles.badgeWrap}>
            <SPIcon name="sparkles" size={14} color={Colors.lime} />
            <Text style={styles.badgeText}>GETTING STARTED</Text>
          </View>
          <Text style={[styles.mainTitle, { color: isDark ? '#FFFFFF' : '#1C1E1A' }]}>
            {allDone ? '🎉 All Milestones Complete!' : 'Your Quick Start Checklist'}
          </Text>
        </View>

        <View style={styles.headerActionWrap}>
          <Pressable
            onPress={toggleCollapsed}
            style={styles.iconBtn}
            hitSlop={8}
            accessibilityLabel={isCollapsed ? 'Expand checklist' : 'Collapse checklist'}
          >
            <SPIcon
              name={isCollapsed ? 'chevronDown' : 'chevronUp'}
              size={18}
              color={isDark ? '#CCC' : '#666'}
            />
          </Pressable>
          <Pressable
            onPress={dismiss}
            style={styles.iconBtn}
            hitSlop={8}
            accessibilityLabel="Dismiss checklist"
          >
            <SPIcon name="x" size={16} color={isDark ? '#888' : '#999'} />
          </Pressable>
        </View>
      </View>

      {/* ── Progress Bar & Counter ───────────────────────────────────────── */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabelRow}>
          <Text style={[styles.progressText, { color: isDark ? '#B3B8AB' : '#6E7465' }]}>
            {completedCount} of {totalCount} completed
          </Text>
          <Text style={styles.percentText}>{progressPercent}%</Text>
        </View>

        <View style={[styles.progressTrack, { backgroundColor: isDark ? '#2B3024' : '#EAE3D6' }]}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      {/* ── Step Items (When expanded) ──────────────────────────────────── */}
      {!isCollapsed && (
        <View style={styles.stepsList}>
          {ONBOARDING_STEP_DEFS.map((step, idx) => {
            const isCompleted = steps[step.id];

            return (
              <Pressable
                key={step.id}
                onPress={() => handleStepPress(step.id, step.route)}
                style={({ pressed }) => [
                  styles.stepRow,
                  {
                    backgroundColor: isCompleted
                      ? isDark
                        ? 'rgba(101, 116, 74, 0.12)'
                        : 'rgba(101, 116, 74, 0.06)'
                      : isDark
                        ? '#22261E'
                        : '#FAF6EF',
                    borderColor: isCompleted
                      ? isDark
                        ? 'rgba(183, 255, 0, 0.25)'
                        : 'rgba(101, 116, 74, 0.2)'
                      : isDark
                        ? '#2D3326'
                        : '#EFEAE0',
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                {/* Status Checkbox */}
                <View
                  style={[
                    styles.checkbox,
                    isCompleted
                      ? { backgroundColor: Colors.olive, borderColor: Colors.olive }
                      : { backgroundColor: 'transparent', borderColor: isDark ? '#555' : '#BBB' },
                  ]}
                >
                  {isCompleted && <SPIcon name="check" size={12} color="#FFF" />}
                </View>

                {/* Content */}
                <View style={styles.stepContent}>
                  <Text
                    style={[
                      styles.stepTitle,
                      {
                        color: isCompleted
                          ? isDark
                            ? '#888F7E'
                            : '#8F9487'
                          : isDark
                            ? '#FFFFFF'
                            : '#1C1E1A',
                        textDecorationLine: isCompleted ? 'line-through' : 'none',
                      },
                    ]}
                  >
                    {idx + 1}. {step.title}
                  </Text>
                  <Text
                    style={[
                      styles.stepDesc,
                      {
                        color: isDark ? '#9EA495' : '#73796A',
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {step.description}
                  </Text>
                </View>

                {/* Arrow */}
                <SPIcon
                  name="chevronRight"
                  size={16}
                  color={isCompleted ? (isDark ? '#555' : '#AAA') : Colors.olive}
                />
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.card,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  headerTitleWrap: {
    flex: 1,
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E2419',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.lime,
    letterSpacing: 0.8,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  headerActionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 10,
  },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSection: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
  percentText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.olive,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.olive,
    borderRadius: 3,
  },
  stepsList: {
    gap: 8,
    marginTop: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  stepContent: {
    flex: 1,
    paddingRight: 6,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15,
  },
});
