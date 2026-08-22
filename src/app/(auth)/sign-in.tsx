/**
 * SignInScreen — POSEHANUM
 *
 * Premium dark sign-in screen with:
 *  - Email + password fields
 *  - Google Sign-In button
 *  - Anonymous / Guest continue
 *  - Link to Sign Up + Forgot Password
 *  - Error display
 *  - Subtle animated entrance
 */

import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Colors, Spacing, BorderRadius } from '@/constants/designTokens';
import { SPButton } from '@/components/atoms/SPButton';
import { SPIcon } from '@/components/atoms/SPIcon';
import { useAuthStore } from '@/stores/authStore';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'email-address' | 'default';
  autoCapitalize?: 'none' | 'words' | 'sentences';
}) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = secureTextEntry;

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.3)"
          secureTextEntry={isPassword && !showPass}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize={autoCapitalize ?? 'sentences'}
          autoCorrect={false}
        />
        {isPassword && (
          <Pressable
            onPress={() => setShowPass((p) => !p)}
            style={styles.eyeBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <SPIcon
              name={showPass ? 'eyeOff' : 'eye'}
              size={18}
              color="rgba(255,255,255,0.5)"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const { signInWithEmail, signInWithGoogle, signInAnonymously, isLoading, error, clearError } =
    useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSignIn = async () => {
    if (!email.trim() || !password) return;
    clearError();
    await signInWithEmail(email.trim(), password);
    router.replace('/(tabs)');
  };

  const handleGuestSignIn = async () => {
    clearError();
    await signInAnonymously();
    router.replace('/(tabs)');
  };

  const handleGoogleSignIn = async () => {
    clearError();
    await signInWithGoogle();
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.root, { paddingTop: insets.top }]}>
          <ScrollView
            contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Back */}
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <SPIcon name="back" size={22} color="rgba(255,255,255,0.7)" />
            </Pressable>

            {/* Branding */}
            <Animated.View entering={FadeInDown.duration(500)} style={styles.brandSection}>
              <View style={styles.brandPill}>
                <Text style={styles.brandText}>POSEHANUM</Text>
              </View>
              <Text style={styles.headline}>Welcome back</Text>
              <Text style={styles.subheadline}>
                Sign in to continue your photography journey
              </Text>
            </Animated.View>

            {/* Form */}
            <Animated.View
              entering={FadeInDown.delay(120).duration(500)}
              style={styles.form}
            >
              <InputField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <InputField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
              />

              {/* Error */}
              {error && (
                <Animated.View entering={FadeInDown} style={styles.errorBox}>
                  <SPIcon name="warning" size={14} color={Colors.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </Animated.View>
              )}

              {/* Forgot Password */}
              <Pressable
                onPress={() => router.push('/(auth)/forgot-password')}
                style={styles.forgotBtn}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>

              {/* Sign In */}
              <SPButton
                label={isLoading ? 'Signing in...' : 'Sign In'}
                variant="primary"
                size="lg"
                onPress={handleEmailSignIn}
                disabled={isLoading || !email || !password}
                accessibilityLabel="Sign in with email and password"
                style={styles.primaryBtn}
              />

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google */}
              <Pressable onPress={handleGoogleSignIn} style={styles.socialBtn} disabled={isLoading}>
                <Text style={styles.socialBtnText}>Continue with Google</Text>
              </Pressable>

              {/* Anonymous */}
              <Pressable onPress={handleGuestSignIn} style={styles.guestBtn} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="rgba(255,255,255,0.5)" size="small" />
                ) : (
                  <Text style={styles.guestBtnText}>Continue as Guest</Text>
                )}
              </Pressable>
            </Animated.View>

            {/* Sign Up link */}
            <Animated.View
              entering={FadeInUp.delay(300).duration(500)}
              style={styles.signUpRow}
            >
              <Text style={styles.signUpPrompt}>Don't have an account? </Text>
              <Pressable onPress={() => router.push('/(auth)/sign-up')}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </Pressable>
            </Animated.View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  brandSection: {
    marginBottom: Spacing.xl,
  },
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
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  subheadline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 20,
  },
  form: {
    gap: 0,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.8,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  inputRow: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: 15,
    color: '#FFFFFF',
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
  errorText: {
    fontSize: 12,
    color: Colors.error,
    flex: 1,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    marginBottom: Spacing.md,
  },
  forgotText: {
    fontSize: 13,
    color: Colors.olive,
    fontWeight: '600',
  },
  primaryBtn: {
    borderRadius: 28,
    marginBottom: Spacing.lg,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dividerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
  },
  socialBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  socialBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.dark,
  },
  guestBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  guestBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  signUpPrompt: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.olive,
  },
});
