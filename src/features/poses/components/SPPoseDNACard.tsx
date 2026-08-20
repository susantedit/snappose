/**
 * SPPoseDNACard — Visual Pose DNA Profile Card.
 *
 * Displays a structured, beautiful breakdown of a pose's DNA:
 *  - Body orientation, head, hands, legs
 *  - Camera angle + distance + framing
 *  - Expression/energy, difficulty, lighting, motion level
 *
 * Animated entrance with staggered rows.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { PoseDNA, Difficulty } from '@/features/poses/types';
import { Colors, Spacing, BorderRadius } from '@/constants/designTokens';
import { useTheme } from '@/constants/theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SPPoseDNACardProps {
  poseDna: PoseDNA;
  poseName?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function difficultyColor(d: Difficulty): string {
  if (d === 'easy') return Colors.success;
  if (d === 'medium') return Colors.warning;
  return Colors.error;
}

function energyColor(e: PoseDNA['energy']): string {
  const map: Record<PoseDNA['energy'], string> = {
    relaxed: '#64B5F6',
    confident: Colors.olive,
    dynamic: Colors.gold,
    minimal: Colors.muted,
    intense: '#E57373',
  };
  return map[e] || Colors.olive;
}

function motionColor(m: PoseDNA['motionLevel']): string {
  if (m === 'static') return Colors.success;
  if (m === 'subtle motion') return Colors.warning;
  return Colors.error;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface DNARowProps {
  label: string;
  value: string;
  accent?: string;
  index: number;
}

function DNARow({ label, value, accent, index }: DNARowProps) {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 40).duration(300)}
      style={[
        styles.row,
        { borderBottomColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' },
      ]}
    >
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
        {label}
      </Text>
      <View style={[styles.valuePill, { backgroundColor: accent ? `${accent}18` : 'transparent' }]}>
        <Text style={[styles.value, { color: accent || theme.colors.textPrimary }]}>
          {value}
        </Text>
      </View>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function SPPoseDNACard({ poseDna, poseName }: SPPoseDNACardProps) {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';

  const rows: { label: string; value: string; accent?: string }[] = [
    { label: 'BODY', value: poseDna.body },
    { label: 'HEAD', value: poseDna.head },
    { label: 'HANDS', value: poseDna.hands },
    { label: 'LEGS', value: poseDna.legs },
    { label: 'CAMERA ANGLE', value: poseDna.camera },
    { label: 'FRAMING', value: poseDna.framing },
    { label: 'DISTANCE', value: poseDna.distance },
    { label: 'LIGHTING', value: poseDna.light },
    { label: 'ENVIRONMENT', value: poseDna.environment },
    {
      label: 'ENERGY',
      value: poseDna.energy,
      accent: energyColor(poseDna.energy),
    },
    {
      label: 'DIFFICULTY',
      value: poseDna.difficulty,
      accent: difficultyColor(poseDna.difficulty),
    },
    {
      label: 'MOTION',
      value: poseDna.motionLevel,
      accent: motionColor(poseDna.motionLevel),
    },
    { label: 'STYLE', value: poseDna.style },
  ];

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
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
        <View style={[styles.dnaLabel, { backgroundColor: Colors.olive }]}>
          <Text style={styles.dnaLabelText}>POSE DNA</Text>
        </View>
        {poseName && (
          <Text
            style={[styles.poseName, { color: theme.colors.textPrimary }]}
            numberOfLines={1}
          >
            {poseName}
          </Text>
        )}
      </View>

      {/* DNA Rows */}
      <View style={styles.rows}>
        {rows.map((row, i) => (
          <DNARow
            key={row.label}
            label={row.label}
            value={row.value}
            accent={row.accent}
            index={i}
          />
        ))}
      </View>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    overflow: 'hidden',
    marginVertical: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(101,116,74,0.15)',
    backgroundColor: 'rgba(101,116,74,0.06)',
  },
  dnaLabel: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dnaLabelText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  poseName: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  rows: {
    paddingHorizontal: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    flex: 1,
  },
  valuePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  value: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
