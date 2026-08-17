/**
 * SPCaptureLimitModal — blocks capture at limit.
 *
 * Shows "Watch ad for 5 more captures" CTA and countdown to window reset.
 * All icons rendered via crisp SVG SPIcon components.
 * [Req 28 — new capture limit UI]
 */

import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  AnimationDurations,
} from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';
import {
  formatTimeUntilReset,
  type RateLimitCheck,
} from '../domain/CaptureRateLimit';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SPCaptureLimitModalProps {
  visible: boolean;
  rateLimitCheck: RateLimitCheck;
  onWatchAd: () => void;
  onDismiss: () => void;
  isAdLoading?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SPCaptureLimitModal({
  visible,
  rateLimitCheck,
  onWatchAd,
  onDismiss,
  isAdLoading = false,
}: SPCaptureLimitModalProps) {
  const { msUntilReset } = rateLimitCheck;
  const [timeLeft, setTimeLeft] = useState(() => formatTimeUntilReset(msUntilReset));

  // Countdown timer
  useEffect(() => {
    if (!visible) return;
    const startTime = Date.now();
    setTimeLeft(formatTimeUntilReset(msUntilReset));
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, msUntilReset - elapsed);
      setTimeLeft(formatTimeUntilReset(remaining));
    }, 1000);
    return () => clearInterval(interval);
  }, [visible, msUntilReset]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
      accessibilityViewIsModal
    >
      <Animated.View
        entering={FadeIn.duration(AnimationDurations.medium)}
        exiting={FadeOut.duration(AnimationDurations.medium)}
        style={styles.backdrop}
      >
        <Animated.View
          entering={SlideInDown.duration(AnimationDurations.medium)}
          exiting={SlideOutDown.duration(AnimationDurations.medium)}
          style={styles.sheet}
        >
          {/* Icon */}
          <View style={styles.iconCircle}>
            <SPIcon name="camera" size={36} color={Colors.olive} strokeWidth={2} />
          </View>

          {/* Title */}
          <Text style={styles.title} accessibilityRole="header">
            Daily Limit Reached
          </Text>

          {/* Description */}
          <Text style={styles.description}>
            You've used all 10 free captures in this 6-hour window.
            Watch a short ad to unlock 5 more right now.
          </Text>

          {/* Countdown */}
          <View style={styles.countdownBox}>
            <Text style={styles.countdownLabel}>Window resets in</Text>
            <Text
              style={styles.countdownTime}
              accessibilityLabel={`Resets in ${timeLeft}`}
            >
              {timeLeft}
            </Text>
          </View>

          {/* Watch Ad CTA */}
          <Pressable
            style={[styles.adButton, isAdLoading && styles.adButtonDisabled]}
            onPress={onWatchAd}
            disabled={isAdLoading}
            accessibilityRole="button"
            accessibilityLabel="Watch an ad to get 5 more captures"
            accessibilityState={{ disabled: isAdLoading }}
          >
            <View style={styles.adRow}>
              <SPIcon name="sparkles" size={18} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.adButtonText}>
                {isAdLoading ? 'Loading ad…' : 'Watch Ad for 5 More Captures'}
              </Text>
            </View>
          </Pressable>

          {/* Dismiss */}
          <Pressable
            style={styles.dismissButton}
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
          >
            <Text style={styles.dismissText}>Not now</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: BorderRadius.bottomSheet,
    borderTopRightRadius: BorderRadius.bottomSheet,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.colossal,
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(101, 116, 74, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold as '700',
    textAlign: 'center',
  },
  description: {
    color: '#AAAAAA',
    fontSize: Typography.sizes.small,
    textAlign: 'center',
    lineHeight: 22,
  },
  countdownBox: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    gap: 4,
    width: '100%',
  },
  countdownLabel: {
    color: '#888888',
    fontSize: Typography.sizes.caption,
  },
  countdownTime: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold as '700',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  adButton: {
    backgroundColor: Colors.olive,
    borderRadius: BorderRadius.button,
    paddingVertical: Spacing.md,
    width: '100%',
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  adButtonDisabled: {
    opacity: 0.5,
  },
  adRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold as '600',
  },
  dismissButton: {
    paddingVertical: Spacing.xs,
    minHeight: 48,
    justifyContent: 'center',
  },
  dismissText: {
    color: '#888888',
    fontSize: Typography.sizes.small,
  },
});
