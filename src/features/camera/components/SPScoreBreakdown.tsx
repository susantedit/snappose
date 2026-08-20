/**
 * SPScoreBreakdown — Post-Capture & Real-time Anatomical Region Score Breakdown Card.
 * Displays overall score, 7-region score metrics, and Director Mode advice breakdown.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';
import { Colors, Spacing, BorderRadius } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';
import type { RegionScores } from '@/features/ai/domain/types';

interface SPScoreBreakdownProps {
  overallScore: number;
  regionScores?: RegionScores;
  feedbackText?: string;
  onDismiss?: () => void;
}

function getScoreColor(score: number): string {
  if (score >= 85) return Colors.scoreDarkGreen;
  if (score >= 70) return Colors.scoreGreen;
  if (score >= 50) return Colors.scoreOrange;
  return Colors.scoreRed;
}

interface RegionBarProps {
  label: string;
  score: number;
  icon: string;
}

function RegionBar({ label, score, icon }: RegionBarProps) {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';
  const color = getScoreColor(score);

  return (
    <View style={styles.regionRow}>
      <View style={styles.regionIconWrap}>
        <SPIcon name={icon as any} size={14} color={isDark ? '#CCC' : '#555'} />
        <Text style={[styles.regionLabel, { color: theme.colors.textPrimary }]}>{label}</Text>
      </View>
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            {
              width: `${Math.min(100, Math.max(0, score))}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      <Text style={[styles.regionScoreText, { color }]}>{Math.round(score)}%</Text>
    </View>
  );
}

export function SPScoreBreakdown({
  overallScore,
  regionScores = {
    shoulders: 88,
    arms: 82,
    hands: 90,
    torso: 85,
    legs: 92,
    head: 95,
    feet: 80,
  },
  feedbackText = 'Great alignment! Keep shoulders relaxed and chin level.',
}: SPScoreBreakdownProps) {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';
  const scoreColor = getScoreColor(overallScore);

  return (
    <Animated.View
      entering={FadeInDown.duration(350)}
      style={[
        styles.card,
        {
          backgroundColor: isDark ? Colors.darkCardBackground : Colors.surface,
          borderColor: isDark ? Colors.borderDark : Colors.border,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Snap Score™ Analysis</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            AI Anatomical Precision Breakdown
          </Text>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: `${scoreColor}20` }]}>
          <Text style={[styles.scoreNumber, { color: scoreColor }]}>{overallScore}%</Text>
        </View>
      </View>

      {/* Region bars */}
      <View style={styles.barsContainer}>
        <RegionBar label="Head & Gaze" score={regionScores.head} icon="portrait" />
        <RegionBar label="Shoulders" score={regionScores.shoulders} icon="target" />
        <RegionBar label="Arms & Elbows" score={regionScores.arms} icon="ai" />
        <RegionBar label="Hands & Wrists" score={regionScores.hands} icon="lifestyle" />
        <RegionBar label="Torso & Hip" score={regionScores.torso} icon="portrait" />
        <RegionBar label="Legs & Stance" score={regionScores.legs} icon="standing" />
        <RegionBar label="Feet Position" score={regionScores.feet} icon="standing" />
      </View>

      {/* AI Coaching Tip */}
      <View
        style={[
          styles.tipContainer,
          {
            backgroundColor: isDark ? 'rgba(101,116,74,0.15)' : 'rgba(101,116,74,0.08)',
            borderColor: 'rgba(101,116,74,0.25)',
          },
        ]}
      >
        <SPIcon name="sparkles" size={16} color={Colors.olive} />
        <Text style={[styles.tipText, { color: theme.colors.textPrimary }]}>{feedbackText}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  scoreNumber: {
    fontSize: 18,
    fontWeight: '800',
  },
  barsContainer: {
    gap: 8,
    marginBottom: Spacing.md,
  },
  regionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  regionIconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 110,
  },
  regionLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(128,128,128,0.2)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  regionScoreText: {
    width: 36,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
});
