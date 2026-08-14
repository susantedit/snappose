/**
 * SPBadge — small pill/chip label atom.
 * Used for category chips, difficulty indicators, and status labels.
 * [Req 32]
 */

  


import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';
import { BorderRadius, Typography } from '@/constants/designTokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SPBadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface SPBadgeProps {
  /** Text displayed inside the badge. */
  label: string;
  /** Colour/semantic variant. Defaults to 'neutral'. */
  variant?: SPBadgeVariant;
  /** Optional solid dot rendered before the label. */
  dot?: boolean;
  /** Override background colour directly. */
  backgroundColor?: string;
  /** Override text colour directly. */
  textColor?: string;
  /** Additional container style. */
  style?: StyleProp<ViewStyle>;
  /** Additional label text style. */
  labelStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}

// ---------------------------------------------------------------------------
// Variant palette
// ---------------------------------------------------------------------------

const VARIANT_COLORS: Record<SPBadgeVariant, { bg: string; text: string }> = {
  primary: { bg: 'rgba(101,116,74,0.15)', text: '#4F5B38' },
  success: { bg: 'rgba(76,175,80,0.15)', text: '#2E7D32' },
  warning: { bg: 'rgba(255,179,0,0.18)', text: '#B07C00' },
  error: { bg: 'rgba(244,67,54,0.15)', text: '#C62828' },
  info: { bg: 'rgba(33,150,243,0.15)', text: '#0D47A1' },
  neutral: { bg: 'rgba(0,0,0,0.08)', text: '#555555' },
};

// ---------------------------------------------------------------------------
// SPBadge
// ---------------------------------------------------------------------------

export function SPBadge({
  label,
  variant = 'neutral',
  dot = false,
  backgroundColor,
  textColor,
  style,
  labelStyle,
  accessibilityLabel,
}: SPBadgeProps) {
  const colors = VARIANT_COLORS[variant];
  const bg = backgroundColor ?? colors.bg;
  const fg = textColor ?? colors.text;

  return (
    <View
      style={[styles.container, { backgroundColor: bg }, style]}
      accessibilityLabel={accessibilityLabel ?? label}
      accessible
    >
      {dot && (
        <View style={[styles.dot, { backgroundColor: fg }]} />
      )}
      <Text style={[styles.label, { color: fg }, labelStyle]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  label: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium as '500',
    letterSpacing: 0.2,
  },
});
