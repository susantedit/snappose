/**
 * SPDialog — modal dialog with confirm/cancel actions.
 * Uses React Native Modal so it always renders above the camera preview.
 * Reanimated scale+fade entrance animation.
 * Min touch targets ≥ 48×48 dp. [Req 32]
 */

import React, { useCallback, useEffect } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';
import { AnimationDurations, BorderRadius, Colors, Spacing, Typography } from '@/constants/designTokens';
import { SPButton, type SPButtonVariant } from '@/components/atoms/SPButton';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SPDialogAction {
  /** Button label. */
  label: string;
  /** Variant style for the button. Defaults to 'primary'. */
  variant?: SPButtonVariant;
  /** Called when this action is tapped. */
  onPress: () => void;
  /** Whether to show loading spinner on this button. */
  loading?: boolean;
  /** Whether this action is destructive (renders in error red). */
  destructive?: boolean;
  accessibilityLabel?: string;
}

export interface SPDialogProps {
  /** Whether the dialog is visible. */
  visible: boolean;
  /** Dialog title. */
  title: string;
  /** Dialog body message. */
  message?: string;
  /** Optional icon/emoji rendered above the title. */
  icon?: string;
  /** Primary confirm action. */
  confirmAction?: SPDialogAction;
  /** Secondary cancel action. */
  cancelAction?: SPDialogAction;
  /** Additional actions rendered below the primary pair. */
  extraActions?: SPDialogAction[];
  /** Called when the backdrop is tapped (if dismissible). */
  onDismiss?: () => void;
  /** Whether tapping the backdrop dismisses the dialog. Defaults to true. */
  dismissible?: boolean;
  /** Additional container style. */
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// SPDialog
// ---------------------------------------------------------------------------

export function SPDialog({
  visible,
  title,
  message,
  icon,
  confirmAction,
  cancelAction,
  extraActions,
  onDismiss,
  dismissible = true,
  style,
}: SPDialogProps) {
  const { theme } = useTheme();

  // Entrance animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.88);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: AnimationDurations.medium });
      scale.value = withSpring(1, { damping: 20, stiffness: 300 });
    } else {
      opacity.value = withTiming(0, { duration: AnimationDurations.quick });
      scale.value = withTiming(0.88, { duration: AnimationDurations.quick });
    }
  }, [visible, opacity, scale]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const cardBg = theme.mode === 'dark' ? '#252525' : '#FFFFFF';
  const borderColor = theme.mode === 'dark' ? '#333333' : '#E8E3D8';

  const handleBackdropPress = useCallback(() => {
    if (dismissible) onDismiss?.();
  }, [dismissible, onDismiss]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      hardwareAccelerated
      accessibilityViewIsModal
      onRequestClose={() => dismissible && onDismiss?.()}
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleBackdropPress}
          accessibilityLabel="Close dialog"
          accessible={dismissible}
        />
      </Animated.View>

      {/* Dialog card */}
      <View style={styles.centreContainer} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor },
            cardStyle,
            style,
          ]}
          accessibilityRole="alert"
          accessibilityLabel={title}
        >
          {/* Icon */}
          {icon != null && (
            <Text style={styles.icon} accessibilityElementsHidden>
              {icon}
            </Text>
          )}

          {/* Title */}
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            {title}
          </Text>

          {/* Message */}
          {message != null && (
            <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
              {message}
            </Text>
          )}

          {/* Divider */}
          {(confirmAction != null || cancelAction != null) && (
            <View style={[styles.divider, { backgroundColor: borderColor }]} />
          )}

          {/* Actions */}
          <View style={styles.actions}>
            {cancelAction != null && (
              <SPButton
                label={cancelAction.label}
                variant={cancelAction.variant ?? 'ghost'}
                onPress={cancelAction.onPress}
                loading={cancelAction.loading}
                accessibilityLabel={cancelAction.accessibilityLabel ?? cancelAction.label}
                style={styles.actionButton}
              />
            )}
            {confirmAction != null && (
              <SPButton
                label={confirmAction.label}
                variant={confirmAction.variant ?? 'primary'}
                onPress={confirmAction.onPress}
                loading={confirmAction.loading}
                accessibilityLabel={confirmAction.accessibilityLabel ?? confirmAction.label}
                style={[
                  styles.actionButton,
                  confirmAction.destructive && { backgroundColor: Colors.error },
                ]}
              />
            )}
          </View>

          {/* Extra actions */}
          {extraActions != null && extraActions.length > 0 && (
            <View style={styles.extraActions}>
              {extraActions.map((action, idx) => (
                <SPButton
                  key={idx}
                  label={action.label}
                  variant={action.variant ?? 'ghost'}
                  onPress={action.onPress}
                  loading={action.loading}
                  accessibilityLabel={action.accessibilityLabel ?? action.label}
                  style={styles.fullWidthButton}
                />
              ))}
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  centreContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  icon: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold as '700',
    textAlign: 'center',
    lineHeight: 26,
  },
  message: {
    fontSize: Typography.sizes.body,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
  },
  extraActions: {
    gap: Spacing.xxs,
    marginTop: 4,
  },
  fullWidthButton: {
    width: '100%',
  },
});
