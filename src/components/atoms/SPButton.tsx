/**
 * SPButton — Primary / Secondary / Ghost variants.
 * Port of ButtonDefaults patterns from the Kotlin codebase.
 * Min-height 48 dp, touch target ≥ 48×48 dp. [Req 32]
 * Accessibility: accessibilityLabel, accessibilityHint, accessibilityRole.
 * Supports dark/light theme via ThemeContext.
 */

import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';
import { AnimationDurations, BorderRadius, Colors, Layout, Typography } from '@/constants/designTokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SPButtonVariant = 'primary' | 'secondary' | 'ghost';
export type SPButtonSize = 'sm' | 'md' | 'lg';

export interface SPButtonProps extends Omit<PressableProps, 'style'> {
  /** Display label shown inside the button. */
  label: string;
  /** Visual style variant. Defaults to 'primary'. */
  variant?: SPButtonVariant;
  /** Preset size. Defaults to 'md'. */
  size?: SPButtonSize;
  /** When true the button shows an ActivityIndicator and ignores presses. */
  loading?: boolean;
  /** When true renders the button in a disabled visual state. */
  disabled?: boolean;
  /** Optional icon rendered to the left of the label. */
  leftIcon?: React.ReactNode;
  /** Optional icon rendered to the right of the label. */
  rightIcon?: React.ReactNode;
  /** a11y — required description for screen readers. */
  accessibilityLabel: string;
  /** a11y — optional hint for screen readers. */
  accessibilityHint?: string;
  /** Additional style applied to the outer container. */
  style?: StyleProp<ViewStyle>;
  /** Additional style applied to the label text. */
  labelStyle?: StyleProp<TextStyle>;
}

// ---------------------------------------------------------------------------
// Animated wrapper
// ---------------------------------------------------------------------------

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ---------------------------------------------------------------------------
// SPButton
// ---------------------------------------------------------------------------

export function SPButton({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  accessibilityHint,
  style,
  labelStyle,
  onPress,
  ...rest
}: SPButtonProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.96, { duration: AnimationDurations.quick });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: AnimationDurations.quick });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // -- Variant colours --
  const variantStyles = getVariantStyles(variant, theme.mode);
  const sizeStyles = getSizeStyles(size);
  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      onPress={isDisabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[animatedStyle, styles.base, sizeStyles.container, variantStyles.container, isDisabled && styles.disabled, style]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyles.spinnerColor}
          accessibilityLabel="Loading"
        />
      ) : (
        <View style={styles.inner}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text
            style={[styles.label, sizeStyles.label, variantStyles.label, labelStyle]}
            numberOfLines={1}
          >
            {label}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </AnimatedPressable>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface VariantResult {
  container: ViewStyle;
  label: TextStyle;
  spinnerColor: string;
}

function getVariantStyles(variant: SPButtonVariant, mode: 'light' | 'dark'): VariantResult {
  switch (variant) {
    case 'primary':
      return {
        container: {
          backgroundColor: Colors.olive,
          borderWidth: 0,
        },
        label: { color: Colors.textInverse },
        spinnerColor: Colors.textInverse,
      };
    case 'secondary':
      return {
        container: {
          backgroundColor: mode === 'dark' ? Colors.surfaceDark : Colors.surface,
          borderWidth: 1.5,
          borderColor: Colors.olive,
        },
        label: { color: Colors.olive },
        spinnerColor: Colors.olive,
      };
    case 'ghost':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 0,
        },
        label: {
          color: mode === 'dark' ? Colors.textInverse : Colors.textPrimary,
        },
        spinnerColor: Colors.olive,
      };
  }
}

interface SizeResult {
  container: ViewStyle;
  label: TextStyle;
}

function getSizeStyles(size: SPButtonSize): SizeResult {
  switch (size) {
    case 'sm':
      return {
        container: { minHeight: Layout.minTouchTarget, paddingHorizontal: 16, paddingVertical: 8 },
        label: { fontSize: Typography.sizes.sm },
      };
    case 'md':
      return {
        container: { minHeight: 48, paddingHorizontal: 24, paddingVertical: 12 },
        label: { fontSize: Typography.sizes.md },
      };
    case 'lg':
      return {
        container: { minHeight: 60, paddingHorizontal: 32, paddingVertical: 16 },
        label: { fontSize: Typography.sizes.lg },
      };
  }
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    minWidth: Layout.minTouchTarget,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: Typography.weights.semibold as '600',
    letterSpacing: 0.3,
  },
  iconLeft: { marginRight: 8 },
  iconRight: { marginLeft: 8 },
  disabled: { opacity: 0.45 },
});
