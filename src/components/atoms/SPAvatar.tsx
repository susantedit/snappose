/**
 * SPAvatar — circular user avatar atom.
 * Shows initials or an image. [Req 32]
 */

import React from 'react';
import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Colors, Typography } from '@/constants/designTokens';

export type SPAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface SPAvatarProps {
  /** Image URI. If absent, shows initials. */
  uri?: string;
  /** Initials to display when no image. E.g. "SL". */
  initials?: string;
  /** Size preset. Defaults to 'md'. */
  size?: SPAvatarSize;
  /** Override background colour for initials avatar. */
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const SIZE_MAP: Record<SPAvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 72,
};

const FONT_MAP: Record<SPAvatarSize, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 20,
  xl: 26,
};

export function SPAvatar({
  uri,
  initials = '?',
  size = 'md',
  backgroundColor = Colors.olive,
  style,
  accessibilityLabel,
}: SPAvatarProps) {
  const dim = SIZE_MAP[size];
  const fontSize = FONT_MAP[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          backgroundColor: uri ? 'transparent' : backgroundColor,
        },
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
      accessible={accessibilityLabel != null}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={[StyleSheet.absoluteFill, { borderRadius: dim / 2 }]}
          resizeMode="cover"
          accessibilityLabel={accessibilityLabel}
        />
      ) : (
        <Text style={[styles.initials, { fontSize, lineHeight: dim }]}>
          {initials.slice(0, 2).toUpperCase()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Colors.textInverse,
    fontWeight: Typography.weights.semibold as '600',
    textAlign: 'center',
  },
});
