/**
 * SignUpScreen — POSEHANUM
 *
 * Full-featured registration with:
 *  - Full Name, Username (@handle), Email, Password, Confirm Password
 *  - Dynamic password strength meter
 *  - Terms of Service & Privacy Policy links
 *  - Transition to Verify Email / Complete Profile
 */

import React, { useState, useMemo } from 'react';
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
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing, BorderRadius } from '@/constants/designTokens';
import { SPButton } from '@/components/atoms/SPButton';
import { SPIcon } from '@/components/atoms/SPIcon';
import { useAuthStore } from '@/stores/authStore';

function getPasswordStrength(pass: string): { label: string; score: number; color: string } {
  if (!pass) return { label: '', score: 0, color: 'transparent' };
  let score = 0;
  if (pass.length >= 8) score += 1;
  if (pass.length >= 12) score += 1;
  if (/[A-Z]/.test(pass)) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 1) return { label: 'Weak', score: 1, color: Colors.error };
  if (score <= 2) return { label: 'Fair', score: 2, color: Colors.gold };
  if (score <= 3) return { label: 'Good', score: 3, color: Colors.olive };
  return { label: 'Strong', score: 4, color: Colors.lime };
}

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const { signUp, isLoading, error, clearError } = useAuthStore();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const handleSignUp = async () => {
    setLocalError(null);
    clearError();

    if (!displayName.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }
    if (!username.trim()) {
      setLocalError('Please choose a username.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setLocalError('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signUp(email.trim(), password, displayName.trim());
    // The store swallows auth errors into `error`; only advance on real success.
    if (useAuthStore.getState().user) {
      router.replace('/(auth)/complete-profile');
    }
  };

  const displayedError = localError || error;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.root, { paddingTop: insets.top }]}>
          <ScrollView
            contentContainerStyle={[
              styles.scroll,
              { paddingBottom: insets.bottom + 40 },
            ]}
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
                <Text style={styles.brandText}>POSEHANUM STUDIO</Text>
              </View>
              <Text style={styles.headline}>Create account</Text>
              <Text style={styles.subheadline}>
                Join the AI photography platform and master every pose.
              </Text>
            </Animated.View>

            {/* Form */}
            <Animated.View
              entering={FadeInDown.delay(100).duration(500)}
              style={styles.form}
            >
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Jane Smith"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              {/* Username */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Username</Text>
                <View style={styles.usernameRow}>
                  <Text style={styles.atSymbol}>@</Text>
                  <TextInput
                    style={styles.usernameInput}
                    value={username}
                    onChangeText={(v) => setUsername(v.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="director_handle"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
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

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Min. 8 characters"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    secureTextEntry={!showPass}
                    autoCapitalize="none"
                  />
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
                </View>

                {/* Password Strength Meter */}
                {password.length > 0 && (
                  <View style={styles.strengthContainer}>
                    <View style={styles.strengthBars}>
                      {[1, 2, 3, 4].map((step) => (
                        <View
                          key={step}
                          style={[
                            styles.strengthBar,
                            {
                              backgroundColor:
                                step <= strength.score ? strength.color : 'rgba(255,255,255,0.1)',
                            },
                          ]}
                        />
                      ))}
                    </View>
                    <Text style={[styles.strengthLabel, { color: strength.color }]}>
                      {strength.label}
                    </Text>
                  </View>
                )}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  value={confirm}
                  onChangeText={setConfirm}
                  placeholder="Repeat password"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              {/* Error Box */}
              {displayedError && (
                <Animated.View entering={FadeInDown} style={styles.errorBox}>
                  <SPIcon name="warning" size={14} color={Colors.error} />
                  <Text style={styles.errorText}>{displayedError}</Text>
                </Animated.View>
              )}

              {/* Terms Checkbox */}
              <Pressable
                onPress={() => setTermsAccepted((t) => !t)}
                style={styles.termsRow}
              >
                <View
                  style={[
                    styles.checkbox,
                    termsAccepted && { backgroundColor: Colors.lime, borderColor: Colors.lime },
                  ]}
                >
                  {termsAccepted && (
                    <SPIcon name="check" size={12} color="#000" strokeWidth={3} />
                  )}
                </View>
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text
                    style={styles.termsLink}
                    onPress={() => router.push('/(auth)/terms')}
                  >
                    Terms of Service
                  </Text>
                  {' '}and{' '}
                  <Text
                    style={styles.termsLink}
                    onPress={() => router.push('/(auth)/privacy')}
                  >
                    Privacy Policy
                  </Text>
                </Text>
              </Pressable>

              {/* Submit CTA */}
              <SPButton
                label={isLoading ? 'Creating account...' : 'Create Account'}
                variant="primary"
                size="lg"
                onPress={handleSignUp}
                disabled={isLoading}
                accessibilityLabel="Create account"
                style={styles.primaryBtn}
              />
            </Animated.View>

            {/* Sign In link */}
            <Animated.View
              entering={FadeInUp.delay(300).duration(500)}
              style={styles.signInRow}
            >
              <Text style={styles.signInPrompt}>Already have an account? </Text>
              <Pressable onPress={() => router.push('/(auth)/sign-in')}>
                <Text style={styles.signInLink}>Sign In</Text>
              </Pressable>
            </Animated.View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dark },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  brandSection: { marginBottom: Spacing.lg },
  brandPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(183,255,0,0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(183,255,0,0.3)',
  },
  brandText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.lime,
    letterSpacing: 1.4,
  },
  headline: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  subheadline: { fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 18 },
  form: { gap: 0 },
  inputGroup: { marginBottom: Spacing.md },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.8,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.card,
    paddingHorizontal: Spacing.md,
  },
  atSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.lime,
    marginRight: 4,
  },
  usernameInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: 14,
    color: '#FFFFFF',
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
    marginRight: 10,
  },
  strengthBar: {
    height: 3,
    flex: 1,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: Spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  termsText: { fontSize: 12, color: 'rgba(255,255,255,0.6)', flex: 1, lineHeight: 18 },
  termsLink: { color: Colors.lime, fontWeight: '700' },
  primaryBtn: { borderRadius: 26, marginBottom: Spacing.md },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  signInPrompt: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  signInLink: { fontSize: 13, fontWeight: '700', color: Colors.lime },
});
