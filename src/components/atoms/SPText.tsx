/**
 * SPText — typography atom with variant support.
 * Supports dark/light theme via ThemeContext. [Req 32]
 */

import React from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { useTheme } from '@/constants/theme';
import { Typography } from '@/constants/designTokens';

export type SPTextVariant =
  | 'heading1'    // 32, bold
  | 'heading2'    // 24, semibold
  | 'heading3'    // 20, semibold
  | 'body'        // 16, regular
  | 'bodyMedium'  // 16, medium
  | 'caption'     // 14, regular
  | 'label'       // 12, medium
  | 'micro';      // 12, regular

export interface SPTextProps {
  variant?: SPTextVariant;
  children: React.ReactNode;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  accessibilityLabel?: string;
}

const VARIANT_STYLES: Record<SPTextVariant, TextStyle> = {
  heading1: { fontSize: Typography.sizes.xxl, fontWeight: Typography.weights.bold as '700', letterSpacing: -0.5 },
  heading2: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.semibold as '600', letterSpacing: -0.3 },
  heading3: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.semibold as '600' },
  body: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.regular as '400' },
  bodyMedium: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.medium as '500' },
  caption: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.regular as '400' },
  label: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.medium as '500', letterSpacing: 0.2 },
  micro: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.regular as '400' },
};

export function SPText({
  variant = 'body',
  children,
  color,
  style,
  numberOfLines,
  accessibilityLabel,
}: SPTextProps) {
  const { theme } = useTheme();
  const resolvedColor = color ?? theme.colors.textPrimary;

  return (
    <Text
      style={[VARIANT_STYLES[variant], { color: resolvedColor }, style]}
      numberOfLines={numberOfLines}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </Text>
  );
}
