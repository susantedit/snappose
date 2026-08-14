/**
 * SPIcon — icon atom backed by a simple SVG/Unicode-based approach.
 * Uses text-based symbols for broad compatibility without a heavy icon library.
 * Minimum touch target 48×48 dp when wrapped in a Pressable. [Req 32]
 */

import React from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/constants/theme';

// ---------------------------------------------------------------------------
// Icon catalogue — extend as needed
// ---------------------------------------------------------------------------

export const ICON_MAP: Record<string, string> = {
  home: '⌂',
  search: '⌕',
  camera: '⬛',
  heart: '♡',
  'heart-filled': '♥',
  settings: '⚙',
  favorites: '★',
  'favorites-outline': '☆',
  close: '✕',
  check: '✓',
  warning: '⚠',
  info: 'ℹ',
  error: '✗',
  download: '↓',
  share: '↑',
  lock: '🔒',
  unlock: '🔓',
  arrow_left: '←',
  arrow_right: '→',
  arrow_up: '↑',
  arrow_down: '↓',
  plus: '+',
  minus: '−',
  dots: '•••',
  eye: '👁',
  star: '★',
  flash: '⚡',
  grid: '⊞',
  image: '🖼',
  trash: '🗑',
  edit: '✎',
  filter: '⧩',
  mic: '🎤',
  speaker: '🔊',
  timer: '⏱',
  flip: '⇄',
  gallery: '🖼',
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SPIconProps {
  name: keyof typeof ICON_MAP | string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

// ---------------------------------------------------------------------------
// SPIcon
// ---------------------------------------------------------------------------

export function SPIcon({ name, size = 24, color, style, accessibilityLabel }: SPIconProps) {
  const { theme } = useTheme();
  const resolvedColor = color ?? theme.colors.textPrimary;
  const symbol = ICON_MAP[name] ?? name;

  return (
    <View
      style={style}
      accessibilityLabel={accessibilityLabel}
      accessible={accessibilityLabel != null}
    >
      <Text
        style={{ fontSize: size * 0.75, color: resolvedColor, lineHeight: size }}
        allowFontScaling={false}
      >
        {symbol}
      </Text>
    </View>
  );
}
