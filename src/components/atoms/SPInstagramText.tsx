import React from 'react';
import { Text, View, TextProps, StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native';
import {
  InstagramFontStyle,
  StoryTextStyles,
} from '@/constants/instagramTypography';

export interface SPInstagramTextProps extends TextProps {
  variant?: InstagramFontStyle;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export const SPInstagramText: React.FC<SPInstagramTextProps> = ({
  variant = 'sans',
  style,
  containerStyle,
  children,
  ...textProps
}) => {
  const config = StoryTextStyles[variant] || StoryTextStyles.sans;

  if (config.containerStyle) {
    return (
      <View style={[styles.container, config.containerStyle, containerStyle]}>
        <Text {...textProps} style={[styles.baseText, config.textStyle, style]}>
          {children}
        </Text>
      </View>
    );
  }

  return (
    <Text {...textProps} style={[styles.baseText, config.textStyle, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  baseText: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
