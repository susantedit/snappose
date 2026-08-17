/**
 * AnimatedCard — Card component with staggered entrance reveal and tactile press.
 */

import React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AnimatedPressable } from './AnimatedPressable';
import { useReducedMotion } from '@/constants/motion';

export interface AnimatedCardProps {
  delay?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  activeScale?: number;
}

export function AnimatedCard({
  delay = 0,
  onPress,
  style,
  children,
  activeScale = 0.97,
}: AnimatedCardProps) {
  const reduceMotion = useReducedMotion();

  if (onPress) {
    return (
      <Animated.View
        entering={reduceMotion ? undefined : FadeInDown.duration(380).delay(delay).springify()}
      >
        <AnimatedPressable scaleTo={activeScale} onPress={onPress} style={style}>
          {children}
        </AnimatedPressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInDown.duration(380).delay(delay).springify()}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
