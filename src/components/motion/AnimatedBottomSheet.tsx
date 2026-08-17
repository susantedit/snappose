/**
 * AnimatedBottomSheet — Fluid modal bottom sheet with spring physics and backdrop fade.
 */

import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Spacing } from '@/constants/designTokens';
import { useTheme } from '@/constants/theme';
import { MotionDurations, useReducedMotion } from '@/constants/motion';

export interface AnimatedBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function AnimatedBottomSheet({
  visible,
  onClose,
  children,
  style,
}: AnimatedBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';
  const reduceMotion = useReducedMotion();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <Animated.View
        entering={reduceMotion ? undefined : FadeIn.duration(MotionDurations.fast)}
        exiting={reduceMotion ? undefined : FadeOut.duration(MotionDurations.fast)}
        style={styles.backdrop}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View
          entering={reduceMotion ? undefined : SlideInDown.duration(MotionDurations.medium).springify()}
          exiting={reduceMotion ? undefined : SlideOutDown.duration(MotionDurations.fast)}
          style={[
            styles.sheet,
            {
              backgroundColor: isDark ? '#222222' : '#FFFFFF',
              borderColor: isDark ? '#333333' : '#E8E3D8',
              paddingBottom: insets.bottom + Spacing.lg,
            },
            style,
          ]}
        >
          <View style={[styles.handle, { backgroundColor: isDark ? '#444' : '#DDD' }]} />
          {children}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.bottomSheet,
    borderTopRightRadius: BorderRadius.bottomSheet,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
});
