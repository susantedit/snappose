/**
 * AnimatedPressable — Tactile press interaction primitive.
 * Compresses 1 → 0.96 with firm spring release and optional subtle haptic feedback.
 */

import React, { useCallback } from 'react';
import {
  Platform,
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MotionDurations, MotionSprings, useReducedMotion } from '@/constants/motion';

export interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  hapticFeedback?: 'light' | 'medium' | 'heavy' | 'selection' | 'none';
  children: React.ReactNode;
}

export function AnimatedPressable({
  style,
  scaleTo = 0.96,
  hapticFeedback = 'light',
  onPressIn,
  onPressOut,
  onPress,
  children,
  disabled,
  ...rest
}: AnimatedPressableProps) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      if (disabled) return;
      if (!reduceMotion) {
        scale.value = withTiming(scaleTo, { duration: MotionDurations.fast });
        opacity.value = withTiming(0.92, { duration: MotionDurations.fast });
      }

      if (hapticFeedback !== 'none' && Platform.OS !== 'web') {
        try {
          if (hapticFeedback === 'selection') Haptics.selectionAsync();
          else if (hapticFeedback === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          else if (hapticFeedback === 'heavy') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch {}
      }

      onPressIn?.(e);
    },
    [disabled, reduceMotion, scale, opacity, scaleTo, hapticFeedback, onPressIn],
  );

  const handlePressOut = useCallback(
    (e: GestureResponderEvent) => {
      if (disabled) return;
      if (!reduceMotion) {
        scale.value = withSpring(1, MotionSprings.snappy);
        opacity.value = withTiming(1, { duration: MotionDurations.fast });
      }
      onPressOut?.(e);
    },
    [disabled, reduceMotion, scale, opacity, onPressOut],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      {...rest}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
}
