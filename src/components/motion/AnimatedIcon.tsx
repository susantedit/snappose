/**
 * AnimatedIcon — Micro-interaction primitive for icons with spring bounce and radial pulse.
 */

import React, { useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MotionSprings, useReducedMotion } from '@/constants/motion';

export interface AnimatedIconProps {
  trigger?: any;
  scaleFrom?: number;
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function AnimatedIcon({
  trigger,
  scaleFrom = 0.8,
  scaleTo = 1.35,
  style,
  children,
}: AnimatedIconProps) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (trigger !== undefined && !reduceMotion) {
      scale.value = withSequence(
        withTiming(scaleFrom, { duration: 80 }),
        withSpring(scaleTo, MotionSprings.bouncy),
        withSpring(1, MotionSprings.snappy),
      );
    }
  }, [trigger, reduceMotion, scale, scaleFrom, scaleTo]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}
