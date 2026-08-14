/**
 * SPDivider — horizontal or vertical visual separator atom. [Req 32]
 */

import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/constants/theme';

export interface SPDividerProps {
  /** Orientation. Defaults to 'horizontal'. */
  orientation?: 'horizontal' | 'vertical';
  /** Thickness in dp. Defaults to hairline. */
  thickness?: number;
  /** Color override. Defaults to theme border colour. */
  color?: string;
  /** Margin around the divider. */
  margin?: number;
  style?: StyleProp<ViewStyle>;
}

export function SPDivider({
  orientation = 'horizontal',
  thickness = StyleSheet.hairlineWidth,
  color,
  margin = 0,
  style,
}: SPDividerProps) {
  const { theme } = useTheme();
  const resolvedColor = color ?? theme.colors.border;

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          {
            width: thickness,
            backgroundColor: resolvedColor,
            marginHorizontal: margin,
            alignSelf: 'stretch',
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        {
          height: thickness,
          backgroundColor: resolvedColor,
          marginVertical: margin,
          alignSelf: 'stretch',
        },
        style,
      ]}
    />
  );
}
