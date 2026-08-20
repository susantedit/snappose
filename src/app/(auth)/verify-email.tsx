/**
 * VerifyEmailScreen — POSEHANUM
 *
 * Screen informing the user to check their email for verification,
 * with a resend button and link to continue once verified.
 */

import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing, BorderRadius } from '@/constants/designTokens';
import { SPButton } from '@/components/atoms/SPButton';
import { SPIcon } from '@/components/atoms/SPIcon';
import { useAuthStore } from '@/stores/authStore';

export default function VerifyEmailScreen() {
  const insets = useSafeAreaInsets();
  const { user, sendEmailVerification, isLoading } = useAuthStore();
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  const handleResend = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await sendEmailVerification();
    setSentMessage('Verification email resent! Check your inbox and spam folder.');
  };

  const handleContinue = () => {
    router.replace('/(auth)/complete-profile');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + Spacing.lg, paddingBottom: insets.bottom + Spacing.lg }]}>
      <StatusBar style="light" />

      {/* Back button */}
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <SPIcon name="back" size={22} color="rgba(255,255,255,0.7)" />
      </Pressable>

      <Animated.View entering={FadeInDown.duration(500)} style={styles.content}>
        <View style={styles.iconCircle}>
          <SPIcon name="mail" size={36} color={Colors.lime} />
        </View>

        <Text style={styles.headline}>Verify your email</Text>
        <Text style={styles.subheadline}>
          We've sent a verification link to:
        </Text>
        <Text style={styles.emailBadge}>{user?.email || 'your email'}</Text>

        <Text style={styles.instructions}>
          Please tap the link in that email to confirm your account and unlock full creator features.
        </Text>

        {sentMessage && (
          <Animated.View entering={FadeInDown} style={styles.infoBox}>
            <SPIcon name="check" size={14} color={Colors.lime} />
            <Text style={styles.infoText}>{sentMessage}</Text>
          </Animated.View>
        )}

        <View style={styles.btnGroup}>
          <SPButton
            label="I've Verified — Continue"
            variant="primary"
            size="lg"
            onPress={handleContinue}
            accessibilityLabel="Continue after email verification"
            style={styles.primaryBtn}
          />

          <SPButton
            label={isLoading ? 'Resending...' : 'Resend Verification Email'}
            variant="secondary"
            size="lg"
            onPress={handleResend}
            disabled={isLoading}
            accessibilityLabel="Resend verification email"
            style={styles.secondaryBtn}
          />
        </View>

        <Pressable onPress={() => router.replace('/(tabs)')} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark,
    paddingHorizontal: Spacing.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing.xxl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(183,255,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(183,255,0,0.3)',
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subheadline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: 4,
  },
  emailBadge: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.lime,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(183,255,0,0.1)',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(183,255,0,0.25)',
  },
  infoText: {
    fontSize: 12,
    color: Colors.lime,
    flex: 1,
  },
  btnGroup: {
    width: '100%',
    gap: 12,
    marginBottom: Spacing.lg,
  },
  primaryBtn: {
    borderRadius: 24,
  },
  secondaryBtn: {
    borderRadius: 24,
  },
  skipBtn: {
    padding: Spacing.sm,
  },
  skipText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
  },
});
