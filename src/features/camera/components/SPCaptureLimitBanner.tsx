/**
 * SPCaptureLimitBanner — progress arc on Camera screen.
 *
 * Shown when captureCount ≥ 8 (PRELOAD_AD_THRESHOLD).
 * Displays remaining captures and a compact progress bar.
 *
 * [Req 28 — new capture limit UI]
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/designTokens';
import {
  BASE_CAPTURE_LIMIT,
  type RateLimitCheck,
} from '../domain/CaptureRateLimit';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SPCaptureLimitBannerProps {
  rateLimitCheck: RateLimitCheck;
  onViewDetails: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SPCaptureLimitBanner({
  rateLimitCheck,
  onViewDetails,
}: SPCaptureLimitBannerProps) {
  const { captureCount, limit, usageFraction } = rateLimitCheck;
  const remaining = Math.max(0, limit - captureCount);
  const isNearLimit = usageFraction >= 0.8;

  const barColor = isNearLimit ? Colors.error : Colors.warning;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={styles.container}
    >
      <Pressable
        onPress={onViewDetails}
        style={styles.pressable}
        accessibilityRole="button"
        accessibilityLabel={`${remaining} captures remaining. Tap for details.`}
        accessibilityHint="Opens the capture limit screen"
      >
        {/* Label */}
        <Text style={styles.label}>
          {remaining === 0 ? '📷 Limit reached' : `📷 ${remaining} left`}
        </Text>

        {/* Progress bar */}
        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              {
                width: `${Math.min(100, usageFraction * 100)}%`,
                backgroundColor: barColor,
              },
            ]}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    zIndex: 50,
  },
  pressable: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    gap: 4,
  },
  label: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold as '600',
  },
  barTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
});
