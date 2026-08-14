/**
 * SPToast — dismissible toast notification.
 * Variants: success / warning / error / info.
 * Slide-in animation with Reanimated v3.
 * Auto-dismisses after `duration` ms (default 3500).
 * [Req 32]
 */

import React, { useCallback, useEffect, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimationDurations, BorderRadius, Colors, Spacing } from '@/constants/designTokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SPToastVariant = 'success' | 'warning' | 'error' | 'info';
export type SPToastPosition = 'top' | 'bottom';

export interface SPToastProps {
  /** Whether the toast is currently visible. */
  visible: boolean;
  /** Text message to display. */
  message: string;
  /** Optional secondary detail text. */
  description?: string;
  /** Semantic colour variant. Defaults to 'info'. */
  variant?: SPToastVariant;
  /** Screen edge to anchor the toast. Defaults to 'bottom'. */
  position?: SPToastPosition;
  /** Auto-dismiss delay in ms. 0 = no auto-dismiss. Defaults to 3500. */
  duration?: number;
  /** Called when toast finishes dismissing. */
  onDismiss?: () => void;
  /** Additional container style. */
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Variant configuration
// ---------------------------------------------------------------------------

const VARIANT_CONFIG: Record<SPToastVariant, { icon: string; bg: string; border: string; text: string }> = {
  success: { icon: '✓', bg: '#1B5E20', border: Colors.scoreGreen, text: '#FFFFFF' },
  warning: { icon: '⚠', bg: '#4A3300', border: Colors.warning, text: '#FFD54F' },
  error: { icon: '✕', bg: '#7F0000', border: Colors.error, text: '#FFFFFF' },
  info: { icon: 'ℹ', bg: '#0D2A4A', border: Colors.info, text: '#FFFFFF' },
};

// ---------------------------------------------------------------------------
// SPToast
// ---------------------------------------------------------------------------

export function SPToast({
  visible,
  message,
  description,
  variant = 'info',
  position = 'bottom',
  duration = 3500,
  onDismiss,
  style,
}: SPToastProps) {
  const insets = useSafeAreaInsets();
  const config = VARIANT_CONFIG[variant];

  // Shared value: 0 = hidden (off-screen), 1 = fully visible
  const progress = useSharedValue(0);
  const autoDismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    progress.value = withTiming(0, { duration: AnimationDurations.medium }, (finished) => {
      if (finished && onDismiss) runOnJS(onDismiss)();
    });
  }, [progress, onDismiss]);

  useEffect(() => {
    if (visible) {
      progress.value = withTiming(1, { duration: AnimationDurations.medium });

      if (duration > 0) {
        autoDismissTimerRef.current = setTimeout(() => {
          dismiss();
        }, duration);
      }
    } else {
      if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
      progress.value = withTiming(0, { duration: AnimationDurations.medium });
    }

    return () => {
      if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
    };
  }, [visible, duration, dismiss, progress]);

  const SLIDE_DISTANCE = 80;

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = position === 'bottom'
      ? SLIDE_DISTANCE * (1 - progress.value)
      : -SLIDE_DISTANCE * (1 - progress.value);
    return {
      opacity: progress.value,
      transform: [{ translateY }],
      pointerEvents: progress.value > 0 ? 'auto' : 'none',
    };
  });

  const positionStyle: ViewStyle = position === 'bottom'
    ? { bottom: insets.bottom + Spacing.lg }
    : { top: insets.top + Spacing.lg };

  return (
    <Animated.View
      style={[styles.wrapper, positionStyle, animatedStyle]}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
    >
      <View
        style={[
          styles.container,
          { backgroundColor: config.bg, borderColor: config.border },
          style,
        ]}
      >
        {/* Icon */}
        <View style={[styles.iconWrapper, { borderColor: config.border }]}>
          <Text style={[styles.icon, { color: config.text }]}>{config.icon}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text
            style={[styles.message, { color: config.text }]}
            numberOfLines={2}
            accessibilityLabel={message}
          >
            {message}
          </Text>
          {description != null && (
            <Text
              style={[styles.description, { color: config.text }]}
              numberOfLines={2}
            >
              {description}
            </Text>
          )}
        </View>

        {/* Dismiss button */}
        <Pressable
          onPress={dismiss}
          style={styles.closeButton}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Dismiss notification"
        >
          <Text style={[styles.closeIcon, { color: config.text }]}>✕</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 9000,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: {
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  description: {
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
    lineHeight: 16,
  },
  closeButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  closeIcon: {
    fontSize: 13,
    fontWeight: '600',
  },
});

// ---------------------------------------------------------------------------
// useToast hook — convenience hook for imperative toast control
// ---------------------------------------------------------------------------

export interface ToastState {
  visible: boolean;
  message: string;
  description?: string;
  variant: SPToastVariant;
}

/**
 * Convenience hook for imperative toast usage.
 *
 * @example
 * const { toastProps, showToast } = useToast();
 * // later:
 * showToast({ message: 'Saved!', variant: 'success' });
 * // in JSX:
 * <SPToast {...toastProps} onDismiss={() => toastProps.onDismiss?.()} />
 */
export function useToast() {
  const [state, setState] = React.useState<ToastState>({
    visible: false,
    message: '',
    variant: 'info',
  });

  const showToast = useCallback(
    (opts: Omit<ToastState, 'visible'>) => {
      setState({ ...opts, visible: true });
    },
    [],
  );

  const hideToast = useCallback(() => {
    setState((prev) => ({ ...prev, visible: false }));
  }, []);

  return { toastProps: { ...state, onDismiss: hideToast }, showToast, hideToast };
}
