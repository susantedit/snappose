/**
 * SPPermissionCard — shown when a required permission is denied.
 *
 * Displays an icon, title, description, and an "Open Settings" button
 * that calls Linking.openSettings().
 *
 * Never crashes or renders a blank screen. [Req 8.8, 35.2]
 *
 * Accessibility: all elements have accessibilityLabel / accessibilityHint.
 */

import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SPButton } from '@/components/atoms/SPButton';
import { SPIcon } from '@/components/atoms/SPIcon';
import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from '@/constants/designTokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SPPermissionCardProps {
  /** Icon name (from ICON_MAP). Defaults to 'camera'. */
  iconName?: string;
  /** Card title. Defaults to "Camera Access Required". */
  title?: string;
  /** Explanatory description shown below the title. */
  description?: string;
  /** Label for the action button. Defaults to "Open Settings". */
  actionLabel?: string;
  /** Callback when action is pressed. Defaults to Linking.openSettings(). */
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SPPermissionCard({
  iconName = 'camera',
  title = 'Camera Access Required',
  description = 'POSEHANUM needs camera access to show the live preview and help you recreate poses. Please grant camera permission in Settings.',
  actionLabel = 'Open Settings',
  onAction,
  style,
}: SPPermissionCardProps) {
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      Linking.openSettings().catch(() => {
        // openSettings can fail on some emulators — fail silently
      });
    }
  };

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="alert"
      accessibilityLabel={title}
    >
      {/* Icon */}
      <View style={styles.iconContainer} accessibilityElementsHidden>
        <SPIcon name={iconName} size={48} color={Colors.olive} />
      </View>

      {/* Title */}
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>

      {/* Description */}
      <Text style={styles.description}>{description}</Text>

      {/* Open Settings button */}
      <SPButton
        label={actionLabel}
        variant="primary"
        size="lg"
        accessibilityLabel={actionLabel}
        accessibilityHint="Opens the device Settings so you can grant camera permission"
        onPress={handleAction}
        style={styles.button}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceDark,
    borderRadius: BorderRadius.card,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(101,116,74,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.textInverse,
    textAlign: 'center',
  },
  description: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.regular,
    color: '#AAAAAA',
    textAlign: 'center',
    lineHeight: Typography.sizes.body * 1.5,
  },
  button: {
    marginTop: Spacing.sm,
    alignSelf: 'stretch',
  },
});
