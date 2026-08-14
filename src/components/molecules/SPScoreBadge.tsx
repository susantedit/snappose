/**
 * SPScoreBadge — similarity score badge with guidance cue chip.
 * Port of SimilarityBadge.kt.
 * Shows 0–100 score, colour-coded per score bands, with optional guidance text.
 * [Req 11.4, Req 12.3, Req 32]
 */

import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/constants/theme';
import { BorderRadius, Colors, Typography } from '@/constants/designTokens';

// ---------------------------------------------------------------------------
// Score band helpers
// ---------------------------------------------------------------------------

export interface ScoreBand {
  color: string;
  label: string;
}

const SCORE_BANDS: Array<{ max: number; band: ScoreBand }> = [
  { max: 40, band: { color: Colors.scoreRed, label: 'Keep going' } },
  { max: 70, band: { color: Colors.scoreOrange, label: 'Getting closer' } },
  { max: 90, band: { color: Colors.scoreGreen, label: 'Looking good!' } },
  { max: 100, band: { color: Colors.scoreDarkGreen, label: 'Perfect!' } },
];

export function getScoreBand(score: number): ScoreBand {
  for (const entry of SCORE_BANDS) {
    if (score <= entry.max) return entry.band;
  }
  return SCORE_BANDS[SCORE_BANDS.length - 1].band;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SPScoreBadgeSize = 'sm' | 'md' | 'lg';

export interface SPScoreBadgeProps {
  /** Score value 0–100. */
  score: number;
  /** Optional guidance cue text (e.g. "Raise your arm"). */
  guidanceCue?: string;
  /** Size preset. Defaults to 'md'. */
  size?: SPScoreBadgeSize;
  /** When true, shows the label text below the score number. */
  showLabel?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

// ---------------------------------------------------------------------------
// Size presets
// ---------------------------------------------------------------------------

const SIZE_CONFIG: Record<SPScoreBadgeSize, { scoreFont: number; badgeSize: number; borderWidth: number }> = {
  sm: { scoreFont: 14, badgeSize: 44, borderWidth: 2 },
  md: { scoreFont: 18, badgeSize: 56, borderWidth: 2.5 },
  lg: { scoreFont: 24, badgeSize: 72, borderWidth: 3 },
};

// ---------------------------------------------------------------------------
// SPScoreBadge
// ---------------------------------------------------------------------------

export function SPScoreBadge({
  score,
  guidanceCue,
  size = 'md',
  showLabel = false,
  style,
  accessibilityLabel,
}: SPScoreBadgeProps) {
  const { theme } = useTheme();
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const band = getScoreBand(clampedScore);
  const config = SIZE_CONFIG[size];

  const badgeBg = theme.mode === 'dark' ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.90)';

  return (
    <View
      style={[styles.wrapper, style]}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? `Pose score: ${clampedScore} out of 100. ${band.label}`}
    >
      {/* Score circle */}
      <View
        style={[
          styles.circle,
          {
            width: config.badgeSize,
            height: config.badgeSize,
            borderRadius: config.badgeSize / 2,
            borderWidth: config.borderWidth,
            borderColor: band.color,
            backgroundColor: badgeBg,
          },
        ]}
      >
        <Text style={[styles.scoreText, { fontSize: config.scoreFont, color: band.color }]}>
          {clampedScore}
        </Text>
        {showLabel && (
          <Text style={[styles.labelText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {band.label}
          </Text>
        )}
      </View>

      {/* Guidance cue chip */}
      {guidanceCue != null && guidanceCue.length > 0 && (
        <View
          style={[
            styles.cueChip,
            {
              backgroundColor: badgeBg,
              borderColor: band.color,
            },
          ]}
          accessibilityLabel={`Guidance: ${guidanceCue}`}
        >
          <Text style={[styles.cueText, { color: band.color }]} numberOfLines={2}>
            {guidanceCue}
          </Text>
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 6,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  scoreText: {
    fontWeight: Typography.weights.bold as '700',
    lineHeight: undefined,
  },
  labelText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium as '500',
    marginTop: 1,
  },
  cueChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    maxWidth: 180,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  cueText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold as '600',
    textAlign: 'center',
    lineHeight: 16,
  },
});
