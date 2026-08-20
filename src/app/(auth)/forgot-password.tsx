/**
 * ForgotPasswordScreen — POSEHANUM
 *
 * Minimal dark-mode password reset screen.
 */

import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Colors, Spacing, BorderRadius } from '@/constants/designTokens';
import { SPButton } from '@/components/atoms/SPButton';
import { SPIcon } from '@/components/atoms/SPIcon';
import { useAuthStore } from '@/stores/authStore';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const { sendPasswordReset, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) return;
    clearError();
    await sendPasswordReset(email.trim());
    if (!useAuthStore.getState().error) {
      setSent(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.root, { paddingTop: insets.top }]}>
          {/* Back */}
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <SPIcon name="back" size={22} color="rgba(255,255,255,0.7)" />
          </Pressable>

          <Animated.View
            entering={FadeInDown.duration(500)}
            style={styles.content}
          >
            {/* Branding */}
            <View style={styles.brandPill}>
              <Text style={styles.brandText}>POSEHANUM</Text>
            </View>
            <Text style={styles.headline}>
              {sent ? 'Check your inbox' : 'Reset password'}
            </Text>
            <Text style={styles.subheadline}>
              {sent
                ? `We sent a password reset link to ${email}. Check your email and follow the instructions.`
                : 'Enter your email address and we\'ll send you a link to reset your password.'}
            </Text>

            {!sent && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email address</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {error && (
                  <Animated.View entering={FadeInDown} style={styles.errorBox}>
                    <SPIcon name="warning" size={14} color={Colors.error} />
                    <Text style={styles.errorText}>{error}</Text>
                  </Animated.View>
                )}

                <SPButton
                  label={isLoading ? 'Sending...' : 'Send Reset Link'}
                  variant="primary"
                  size="lg"
                  onPress={handleSend}
                  disabled={isLoading || !email}
                  accessibilityLabel="Send Password Reset Link"
                  style={styles.primaryBtn}
                />
              </>
            )}

            {sent && (
              <SPButton
                label="Back to Sign In"
                variant="secondary"
                size="lg"
                onPress={() => router.replace('/(auth)/sign-in')}
                accessibilityLabel="Back to Sign In"
                style={styles.primaryBtn}
              />
            )}

            <Pressable
              onPress={() => router.push('/(auth)/sign-in')}
              style={styles.backToSignIn}
            >
              <Text style={styles.backToSignInText}>Back to Sign In</Text>
            </Pressable>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dark, paddingHorizontal: Spacing.lg },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  content: { flex: 1, paddingTop: Spacing.lg },
  brandPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(101,116,74,0.25)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(101,116,74,0.4)',
  },
  brandText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.olive,
    letterSpacing: 1.4,
  },
  headline: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subheadline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  inputGroup: { marginBottom: Spacing.md },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.8,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: 15,
    color: '#FFFFFF',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(244,67,54,0.12)',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  errorText: { fontSize: 12, color: Colors.error, flex: 1 },
  primaryBtn: { borderRadius: 28, marginBottom: Spacing.md },
  backToSignIn: { alignSelf: 'center', paddingVertical: 10 },
  backToSignInText: { fontSize: 14, color: Colors.olive, fontWeight: '600' },
});
