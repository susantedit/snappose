/**
 * CaptureLimitScreen — explains free 10-photo/6hr limit, rewarded ad unlock,
 * and shows a live countdown to window reset.
 *
 * All icons rendered via crisp SVG SPIcon components with smooth micro-interactions.
 * [Req 28 — new capture limit UI]
 */

import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/constants/theme';
import {
  AnimationDurations,
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';
import {
  checkCaptureAllowed,
  formatTimeUntilReset,
  grantBonusCaptures,
  BASE_CAPTURE_LIMIT,
  BONUS_PER_AD,
  type RateLimitCheck,
} from '@/features/camera/domain/CaptureRateLimit';
import { AdMobAdapter } from '@/features/ads/infrastructure/AdMobAdapter';

export default function CaptureLimitScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme.mode === 'dark';
  const bg = isDark ? Colors.dark : Colors.cream;

  const [check, setCheck] = useState<RateLimitCheck>(() => checkCaptureAllowed());
  const [timeLeft, setTimeLeft] = useState(() => formatTimeUntilReset(check.msUntilReset));
  const [loadingAd, setLoadingAd] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const fresh = checkCaptureAllowed();
      setCheck(fresh);
      setTimeLeft(formatTimeUntilReset(fresh.msUntilReset));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWatchAd = async () => {
    if (loadingAd) return;
    setLoadingAd(true);
    try {
      const adUnitId = process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID || '';
      const ad = await AdMobAdapter.getInstance().loadRewardedAd(adUnitId);
      const earned = await ad.show();
      if (earned) {
        grantBonusCaptures();
        setCheck(checkCaptureAllowed());
      }
    } catch {
      grantBonusCaptures();
      setCheck(checkCaptureAllowed());
    } finally {
      setLoadingAd(false);
    }
  };

  const remaining = Math.max(0, check.limit - check.captureCount);
  const isLimitReached = !check.allowed;

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <View style={styles.backRow}>
            <SPIcon name="arrowLeft" size={18} color={Colors.olive} strokeWidth={2.4} />
            <Text style={[styles.backText, { color: Colors.olive }]}>Back</Text>
          </View>
        </Pressable>

        {/* Icon */}
        <Animated.View
          entering={FadeInDown.delay(50).duration(AnimationDurations.medium)}
          style={styles.iconContainer}
        >
          <View style={styles.iconCircle}>
            <SPIcon name="camera" size={44} color={Colors.olive} strokeWidth={2} />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.delay(100).duration(AnimationDurations.medium)}>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : Colors.textPrimary }]}>
            {isLimitReached ? 'Daily Limit Reached' : 'Capture Limit'}
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#AAAAAA' : Colors.textSecondary }]}>
            POSEHANUM is 100% free — supported by ads.
          </Text>
        </Animated.View>

        {/* Stats card */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(AnimationDurations.medium)}
          style={[styles.statsCard, { backgroundColor: isDark ? '#252525' : '#FFFFFF' }]}
        >
          <StatRow
            label="Free captures per window"
            value={`${BASE_CAPTURE_LIMIT}`}
            isDark={isDark}
          />
          <StatRow label="Window duration" value="6 hours" isDark={isDark} />
          <StatRow
            label="Captures used"
            value={`${check.captureCount} / ${check.limit}`}
            highlight={isLimitReached}
            isDark={isDark}
          />
          {check.bonusCaptures > 0 && (
            <StatRow
              label="Bonus captures"
              value={`+${check.bonusCaptures}`}
              isDark={isDark}
            />
          )}
          <StatRow
            label="Remaining"
            value={isLimitReached ? '0' : `${remaining}`}
            highlight={remaining === 0}
            isDark={isDark}
          />
        </Animated.View>

        {/* Countdown */}
        {isLimitReached && (
          <Animated.View
            entering={FadeInDown.delay(200).duration(AnimationDurations.medium)}
            style={[styles.countdownCard, { backgroundColor: isDark ? '#252525' : '#FFFFFF' }]}
          >
            <Text style={[styles.countdownLabel, { color: isDark ? '#AAAAAA' : Colors.textSecondary }]}>
              Window resets in
            </Text>
            <Text
              style={styles.countdownValue}
              accessibilityLabel={`Resets in ${timeLeft}`}
            >
              {timeLeft}
            </Text>
          </Animated.View>
        )}

        {/* CTA: Watch Ad */}
        <Animated.View
          entering={FadeInDown.delay(250).duration(AnimationDurations.medium)}
          style={styles.ctaSection}
        >
          <Text style={[styles.ctaTitle, { color: isDark ? '#FFFFFF' : Colors.textPrimary }]}>
            Need more captures now?
          </Text>
          <Text style={[styles.ctaDesc, { color: isDark ? '#AAAAAA' : Colors.textSecondary }]}>
            Watch a short ad to unlock {BONUS_PER_AD} bonus captures instantly.
          </Text>
          <Pressable
            style={[styles.watchAdButton, loadingAd && { opacity: 0.6 }]}
            onPress={handleWatchAd}
            disabled={loadingAd}
            accessibilityRole="button"
            accessibilityLabel={`Watch an ad to unlock ${BONUS_PER_AD} more captures`}
            accessibilityState={{ disabled: loadingAd }}
          >
            <View style={styles.watchAdRow}>
              <SPIcon name="sparkles" size={18} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.watchAdText}>
                {loadingAd ? 'Loading Ad…' : `Watch Ad for ${BONUS_PER_AD} More Captures`}
              </Text>
            </View>
          </Pressable>
        </Animated.View>

        {/* How it works */}
        <Animated.View entering={FadeInDown.delay(300).duration(AnimationDurations.medium)}>
          <Text style={[styles.howTitle, { color: isDark ? '#FFFFFF' : Colors.textPrimary }]}>
            How it works
          </Text>
          <InfoRow iconName="timer" text="Take up to 10 free photos every 6 hours" isDark={isDark} />
          <InfoRow iconName="sparkles" text="Watch an ad to unlock 5 bonus captures" isDark={isDark} />
          <InfoRow iconName="refresh" text="Counter resets automatically after 6 hours" isDark={isDark} />
          <InfoRow iconName="heart-filled" iconColor={Colors.error} text="POSEHANUM is always free — no subscriptions" isDark={isDark} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatRow({
  label,
  value,
  highlight = false,
  isDark,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  isDark: boolean;
}) {
  return (
    <View style={styles.statRow}>
      <Text style={[styles.statLabel, { color: isDark ? '#AAAAAA' : Colors.textSecondary }]}>
        {label}
      </Text>
      <Text
        style={[
          styles.statValue,
          { color: highlight ? Colors.error : isDark ? '#FFFFFF' : Colors.textPrimary },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function InfoRow({ iconName, iconColor, text, isDark }: { iconName: string; iconColor?: string; text: string; isDark: boolean }) {
  return (
    <View style={styles.infoRow}>
      <SPIcon
        name={iconName}
        size={18}
        color={iconColor ?? Colors.olive}
        fill={iconName === 'heart-filled' ? Colors.error : undefined}
        strokeWidth={2}
      />
      <Text style={[styles.infoText, { color: isDark ? '#CCCCCC' : Colors.textSecondary }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    minHeight: 48,
    justifyContent: 'center',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold as '600',
  },
  iconContainer: { alignItems: 'center' },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(101, 116, 74, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold as '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.sizes.small,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: { fontSize: Typography.sizes.small },
  statValue: { fontSize: Typography.sizes.small, fontWeight: Typography.weights.semibold as '600' },
  countdownCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  countdownLabel: { fontSize: Typography.sizes.caption },
  countdownValue: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold as '700',
    color: Colors.olive,
    letterSpacing: 3,
    fontVariant: ['tabular-nums'],
  },
  ctaSection: { gap: Spacing.sm },
  ctaTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.semibold as '600',
  },
  ctaDesc: { fontSize: Typography.sizes.small, lineHeight: 20 },
  watchAdButton: {
    backgroundColor: Colors.olive,
    borderRadius: BorderRadius.button,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  watchAdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  watchAdText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold as '600',
  },
  howTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.semibold as '600',
    marginBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  infoText: { flex: 1, fontSize: Typography.sizes.small, lineHeight: 22 },
});
