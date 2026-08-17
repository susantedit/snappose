/**
 * AnimatedText — Editorial text reveal primitive with staggered lines and masked upward glide.
 */

import React from 'react';
import { type StyleProp, type TextStyle, type ViewStyle, View } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useReducedMotion } from '@/constants/motion';

export interface AnimatedTextProps {
  delay?: number;
  direction?: 'up' | 'down';
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function AnimatedText({
  delay = 0,
  direction = 'up',
  style,
  containerStyle,
  children,
}: AnimatedTextProps) {
  const reduceMotion = useReducedMotion();

  const enteringAnim = reduceMotion
    ? undefined
    : direction === 'up'
    ? FadeInUp.duration(420).delay(delay).springify()
    : FadeInDown.duration(420).delay(delay).springify();

  return (
    <View style={containerStyle}>
      <Animated.Text entering={enteringAnim} style={style}>
        {children}
      </Animated.Text>
    </View>
  );
}
