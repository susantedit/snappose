/**
 * OnboardingScreen — Editorial Magazine Photography Onboarding with Auth.
 *
 * Pages 1–2: Feature showcase with parallax.
 * Page 3: Auth step — Continue with Google / Guest / Email.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  Extrapolation,
  FadeIn,
  FadeInDown,
  FadeOut,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { mmkv } from '@/database/mmkv/mmkvClient';
import { MMKV_KEYS } from '@/database/mmkv/keys';
import { useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useTheme } from '@/constants/theme';
import { Colors, Spacing, Typography } from '@/constants/designTokens';
import { SPButton } from '@/components/atoms/SPButton';
import { SPIcon } from '@/components/atoms/SPIcon';
import { MotionDurations, MotionEasings } from '@/constants/motion';
import { useAuthStore } from '@/stores/authStore';
import { notificationService } from '@/features/notifications/infrastructure/LocalNotificationService';
import { Modal } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PAGE_COUNT = 3;
const PARALLAX_FACTOR = 0.35;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.22;

interface PageData {
  icon: string;
  tag: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  backgroundColor: string;
}

const PAGES: PageData[] = [
  {
    icon: 'sparkles',
    tag: 'EDITORIAL POSE ASSIST',
    title: 'Never Ask\n"How Do I Pose?"\nEver Again',
    subtitle:
      'Match curated silhouettes directly over your camera preview. Professional angles, effortless posture.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80',
    backgroundColor: '#FAF7F2',
  },
  {
    icon: 'ai',
    tag: 'ON-DEVICE INTELLIGENCE',
    title: 'Real-Time\nAI Alignment &\nSmart Framing',
    subtitle:
      'Subtle audio and visual cues guide your chin, shoulders, and posture — 100% on-device, zero cloud uploads.',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80',
    backgroundColor: '#F3EFE6',
  },
  {
    icon: 'download',
    tag: 'ZERO-DATA OFFLINE',
    title: 'Capture\nAnywhere,\nAnytime Offline',
    subtitle:
      'Save curated packs offline and strike confident, professional poses wherever your travels take you — from city cafes to mountain summits.',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80',
    backgroundColor: '#E8ECE0',
  },
];

function completeOnboarding(): void {
  mmkv.set(MMKV_KEYS.ONBOARDING_COMPLETED, true);
  notificationService.scheduleDefaultNotificationsOnInstall().catch(() => {});
  router.replace('/(tabs)');
}

// ---------------------------------------------------------------------------
// Parallax Page (pages 0 & 1 only — page 2 is auth)
// ---------------------------------------------------------------------------

function OnboardingPage({
  page,
  index,
  scrollX,
  reduceMotion,
}: {
  page: PageData;
  index: number;
  scrollX: SharedValue<number>;
  reduceMotion: boolean;
}) {
  const imageParallaxStyle = useAnimatedStyle(() => {
    if (reduceMotion) return {};
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];
    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [-SCREEN_WIDTH * PARALLAX_FACTOR, 0, SCREEN_WIDTH * PARALLAX_FACTOR],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(scrollX.value, inputRange, [0.92, 1, 0.92], Extrapolation.CLAMP);
    return { transform: [{ translateX }, { scale }] };
  });

  const textFadeStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 0.6) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 0.6) * SCREEN_WIDTH,
    ];
    const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP);
    const translateY = interpolate(scrollX.value, inputRange, [24, 0, -24], Extrapolation.CLAMP);
    return { opacity, transform: [{ translateY }] };
  });

  return (
    <View
      style={[styles.page, { width: SCREEN_WIDTH }]}
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel={`Page ${index + 1} of ${PAGE_COUNT}: ${page.title}`}
    >
      <View style={styles.photoFrame}>
        <Animated.Image
          source={{ uri: page.imageUrl }}
          style={[styles.pageImage, imageParallaxStyle]}
          resizeMode="cover"
        />
        <View style={styles.photoGradientOverlay} />
        <View style={styles.floatingTag}>
          <SPIcon name={page.icon} size={14} color="#FFF" strokeWidth={2.4} />
          <Text style={styles.floatingTagText}>{page.tag}</Text>
        </View>
      </View>
      <Animated.View style={[styles.pageContent, textFadeStyle]}>
        <Text style={styles.pageTitle} accessibilityRole="header">
          {page.title}
        </Text>
        <Text style={styles.pageSubtitle}>{page.subtitle}</Text>
      </Animated.View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Auth Page (last page)
// ---------------------------------------------------------------------------

function AuthPage({ scrollX }: { scrollX: SharedValue<number> }) {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';
  const { signInWithGoogle, signInAnonymously, signInWithEmail, signUp, isLoading, error, clearError } =
    useAuthStore();

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false);

  const fadeStyle = useAnimatedStyle(() => {
    const inputRange = [
      (PAGE_COUNT - 1 - 0.6) * SCREEN_WIDTH,
      (PAGE_COUNT - 1) * SCREEN_WIDTH,
    ];
    const opacity = interpolate(scrollX.value, inputRange, [0, 1], Extrapolation.CLAMP);
    const translateY = interpolate(scrollX.value, inputRange, [28, 0], Extrapolation.CLAMP);
    return { opacity, transform: [{ translateY }] };
  });

  const handleGrantPermissions = async () => {
    setIsRequestingPermissions(true);
    try {
      if (!cameraPermission?.granted) {
        await requestCameraPermission();
      }
      if (!mediaPermission?.granted) {
        await requestMediaPermission();
      }
      await notificationService.requestPermission();
      await notificationService.scheduleDefaultNotificationsOnInstall();
    } catch {}
    setIsRequestingPermissions(false);
    setShowPermissionModal(false);
    completeOnboarding();
  };

  const handleGoogle = useCallback(async () => {
    clearError();
    await signInWithGoogle();
    const err = useAuthStore.getState().error;
    if (!err) setShowPermissionModal(true);
  }, [signInWithGoogle, clearError]);

  const handleGuest = useCallback(async () => {
    clearError();
    await signInAnonymously();
    const err = useAuthStore.getState().error;
    if (!err) setShowPermissionModal(true);
  }, [signInAnonymously, clearError]);

  const handleEmailAuth = useCallback(async () => {
    clearError();
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter email and password.');
      return;
    }
    if (isSignUp) {
      await signUp(email.trim(), password, displayName.trim() || undefined);
    } else {
      await signInWithEmail(email.trim(), password);
    }
    // If no error was thrown, navigate to permissions
    const currentError = useAuthStore.getState().error;
    if (!currentError) {
      setShowPermissionModal(true);
    }
  }, [email, password, displayName, isSignUp, signInWithEmail, signUp, clearError]);

  return (
    <View style={[styles.page, { width: SCREEN_WIDTH }]}>
      <Animated.View style={[styles.authContainer, fadeStyle]}>
        {/* Headline */}
        <View style={styles.authHeader}>
          <View style={styles.authBadge}>
            <SPIcon name="camera" size={16} color={Colors.olive} strokeWidth={2.2} />
          </View>
          <Text style={[styles.authTitle, { color: isDark ? '#FFF' : Colors.dark }]}>
            Start Posing
          </Text>
          <Text style={[styles.authSubtitle, { color: isDark ? '#AAA' : Colors.textSecondary }]}>
            Create an account to save favorites and sync across devices — or explore as a guest.
          </Text>
        </View>

        {/* Error */}
        {error ? (
          <Animated.View entering={FadeIn.duration(200)} style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        ) : null}

        {/* Loading */}
        {isLoading && (
          <ActivityIndicator
            size="small"
            color={Colors.olive}
            style={{ marginBottom: Spacing.sm }}
          />
        )}

        {!showEmailForm ? (
          <Animated.View entering={FadeIn.duration(250)} style={styles.authButtons}>
            {/* Google */}
            <Pressable
              id="btn-google-signin"
              style={[styles.googleButton, { opacity: isLoading ? 0.6 : 1 }]}
              onPress={handleGoogle}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
            >
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: isDark ? '#333' : '#DDD' }]} />
              <Text style={[styles.dividerText, { color: isDark ? '#666' : '#AAA' }]}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: isDark ? '#333' : '#DDD' }]} />
            </View>

            {/* Email */}
            <SPButton
              label="Continue with Email"
              variant="secondary"
              size="lg"
              onPress={() => setShowEmailForm(true)}
              style={styles.authActionButton}
              disabled={isLoading}
            />

            {/* Guest */}
            <Pressable
              id="btn-guest-signin"
              style={[styles.guestLink, { opacity: isLoading ? 0.5 : 1 }]}
              onPress={handleGuest}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Continue as Guest"
            >
              <Text style={[styles.guestLinkText, { color: isDark ? '#888' : Colors.textSecondary }]}>
                Continue as Guest (limited features)
              </Text>
            </Pressable>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.duration(280)} exiting={FadeOut.duration(150)} style={styles.authButtons}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <Text style={[styles.emailFormTitle, { color: isDark ? '#FFF' : Colors.dark }]}>
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Text>

              {isSignUp && (
                <TextInput
                  style={[styles.input, {
                    backgroundColor: isDark ? '#1E1E1E' : '#F5F0E8',
                    color: isDark ? '#FFF' : Colors.dark,
                    borderColor: isDark ? '#333' : '#DDD',
                  }]}
                  placeholder="Display Name (optional)"
                  placeholderTextColor={isDark ? '#666' : '#AAA'}
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              )}

              <TextInput
                style={[styles.input, {
                  backgroundColor: isDark ? '#1E1E1E' : '#F5F0E8',
                  color: isDark ? '#FFF' : Colors.dark,
                  borderColor: isDark ? '#333' : '#DDD',
                }]}
                placeholder="Email"
                placeholderTextColor={isDark ? '#666' : '#AAA'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
              <TextInput
                style={[styles.input, {
                  backgroundColor: isDark ? '#1E1E1E' : '#F5F0E8',
                  color: isDark ? '#FFF' : Colors.dark,
                  borderColor: isDark ? '#333' : '#DDD',
                }]}
                placeholder="Password"
                placeholderTextColor={isDark ? '#666' : '#AAA'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleEmailAuth}
              />

              <SPButton
                label={isSignUp ? 'Create Account' : 'Sign In'}
                variant="primary"
                size="lg"
                onPress={handleEmailAuth}
                style={styles.authActionButton}
                disabled={isLoading}
              />

              <View style={styles.switchRow}>
                <Pressable onPress={() => setIsSignUp(!isSignUp)}>
                  <Text style={[styles.switchText, { color: Colors.olive }]}>
                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                  </Text>
                </Pressable>
              </View>

              <Pressable onPress={() => { setShowEmailForm(false); clearError(); }} style={styles.backLink}>
                <Text style={[styles.backLinkText, { color: isDark ? '#888' : Colors.textSecondary }]}>
                  ← Back
                </Text>
              </Pressable>
            </KeyboardAvoidingView>
          </Animated.View>
        )}
      </Animated.View>

      {/* ── Upfront Permission Onboarding Modal ────────────────────── */}
      <Modal
        visible={showPermissionModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setShowPermissionModal(false);
          completeOnboarding();
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.permissionDialog, { backgroundColor: isDark ? '#1C1F19' : '#FFFFFF' }]}>
            <View style={styles.permissionBadgeIcon}>
              <SPIcon name="sparkles" size={26} color="#FFF" />
            </View>
            <Text style={[styles.permissionDialogTitle, { color: isDark ? '#FFF' : Colors.dark }]}>
              Enable Permissions
            </Text>
            <Text style={[styles.permissionDialogSubtitle, { color: isDark ? '#AAA' : Colors.textSecondary }]}>
              Snap Pose needs camera and photo access to guide poses and save your shots.
            </Text>

            <View style={styles.permList}>
              <View style={styles.permItem}>
                <View style={styles.permIconBox}>
                  <SPIcon name="camera" size={18} color={Colors.olive} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.permName, { color: isDark ? '#FFF' : Colors.dark }]}>Camera Access</Text>
                  <Text style={[styles.permDesc, { color: isDark ? '#999' : '#777' }]}>To overlay silhouette guides and snap matched photos</Text>
                </View>
              </View>

              <View style={styles.permItem}>
                <View style={styles.permIconBox}>
                  <SPIcon name="gallery" size={18} color={Colors.olive} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.permName, { color: isDark ? '#FFF' : Colors.dark }]}>Photo Library</Text>
                  <Text style={[styles.permDesc, { color: isDark ? '#999' : '#777' }]}>To save your captured portraits and aesthetic shoots</Text>
                </View>
              </View>

              <View style={styles.permItem}>
                <View style={styles.permIconBox}>
                  <SPIcon name="notifications" size={18} color={Colors.olive} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.permName, { color: isDark ? '#FFF' : Colors.dark }]}>Inspirations & Alerts</Text>
                  <Text style={[styles.permDesc, { color: isDark ? '#999' : '#777' }]}>Daily Golden Hour tips and trending pose challenges</Text>
                </View>
              </View>
            </View>

            <SPButton
              label={isRequestingPermissions ? 'Configuring...' : 'Allow & Continue'}
              variant="primary"
              size="lg"
              onPress={handleGrantPermissions}
              disabled={isRequestingPermissions}
              style={{ width: '100%', marginBottom: 8 }}
            />

            <Pressable onPress={() => { setShowPermissionModal(false); completeOnboarding(); }} style={{ paddingVertical: 6 }}>
              <Text style={[styles.skipText, { color: isDark ? '#777' : '#999' }]}>Maybe Later</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Dot Indicator
// ---------------------------------------------------------------------------

function AnimatedDot({ index, scrollX }: { index: number; scrollX: SharedValue<number> }) {
  const animStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];
    const width = interpolate(scrollX.value, inputRange, [8, 28, 8], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.35, 1, 0.35], Extrapolation.CLAMP);
    return { width, opacity };
  });

  return (
    <Animated.View style={[styles.dot, animStyle]} accessibilityElementsHidden={true} />
  );
}

function DotIndicator({ scrollX, count }: { scrollX: SharedValue<number>; count: number }) {
  return (
    <View style={styles.dotRow} accessibilityRole="none" accessibilityLabel="Page indicator">
      {Array.from({ length: count }).map((_, i) => (
        <AnimatedDot key={i} index={i} scrollX={scrollX} />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

export default function OnboardingScreen() {
  const { theme } = useTheme();

  const scrollX = useSharedValue(0);
  const currentPageRef = useRef(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled: boolean) => {
      setReduceMotion(enabled);
    });
    return () => sub.remove();
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      const clampedPage = Math.max(0, Math.min(page, PAGE_COUNT - 1));
      const duration = reduceMotion ? MotionDurations.fast : MotionDurations.medium;
      scrollX.value = withTiming(
        clampedPage * SCREEN_WIDTH,
        { duration, easing: MotionEasings.outStandard },
        (finished) => {
          if (finished) runOnJS(setCurrentPage)(clampedPage);
        },
      );
      currentPageRef.current = clampedPage;
      setCurrentPage(clampedPage);
    },
    [reduceMotion, scrollX],
  );

  const panStartX = useSharedValue(0);
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-20, 20])
    .onBegin(() => { panStartX.value = scrollX.value; })
    .onUpdate((event) => {
      const nextX = panStartX.value - event.translationX;
      scrollX.value = Math.max(0, Math.min(nextX, (PAGE_COUNT - 1) * SCREEN_WIDTH));
    })
    .onEnd((event) => {
      const velocityThreshold = 450;
      const page = currentPageRef.current;
      if (event.velocityX < -velocityThreshold || event.translationX < -SWIPE_THRESHOLD) {
        runOnJS(goToPage)(Math.min(page + 1, PAGE_COUNT - 1));
      } else if (event.velocityX > velocityThreshold || event.translationX > SWIPE_THRESHOLD) {
        runOnJS(goToPage)(Math.max(page - 1, 0));
      } else {
        runOnJS(goToPage)(page);
      }
    });

  const isLastPage = currentPage === PAGE_COUNT - 1;
  const showSkip = !isLastPage;

  const pagerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -scrollX.value }],
  }));

  return (
    <View
      style={[styles.root, { backgroundColor: PAGES[currentPage]?.backgroundColor ?? Colors.cream }]}
    >
      <StatusBar style="dark" backgroundColor="transparent" translucent />

      {/* Top Header Bar */}
      <View style={styles.headerRow}>
        <View style={styles.brandBadge}>
          <Text style={styles.brandBadgeText}>SNAP POSE</Text>
        </View>
        {showSkip ? (
          <Pressable
            style={styles.skipButton}
            onPress={completeOnboarding}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>Skip</Text>
          </Pressable>
        ) : (
          <View style={styles.skipButton} />
        )}
      </View>

      {/* Carousel */}
      <GestureDetector gesture={panGesture}>
        <View style={styles.pagerViewport} accessibilityRole="adjustable">
          <Animated.View style={[styles.pagerStrip, pagerStyle]}>
            {PAGES.map((page, index) =>
              index === PAGE_COUNT - 1 ? (
                <AuthPage key={index} scrollX={scrollX} />
              ) : (
                <OnboardingPage
                  key={index}
                  page={page}
                  index={index}
                  scrollX={scrollX}
                  reduceMotion={reduceMotion}
                />
              ),
            )}
          </Animated.View>
        </View>
      </GestureDetector>

      {/* Footer */}
      <View style={styles.footer}>
        <DotIndicator scrollX={scrollX} count={PAGE_COUNT} />
        {!isLastPage && (
          <View style={styles.ctaContainer}>
            <SPButton
              label="Continue"
              variant="secondary"
              size="lg"
              accessibilityLabel={`Go to page ${currentPage + 2} of ${PAGE_COUNT}`}
              onPress={() => goToPage(currentPage + 1)}
              style={styles.ctaButton}
            />
          </View>
        )}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.OS === 'android' ? Spacing.xxxl : Spacing.xxl,
    paddingBottom: Spacing.xs,
    minHeight: 64,
  },
  brandBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(101, 116, 74, 0.12)',
  },
  brandBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.olive,
    letterSpacing: 1.2,
  },
  skipButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    fontSize: Typography.sizes.body,
    fontWeight: '600',
  },
  pagerViewport: { flex: 1, overflow: 'hidden' },
  pagerStrip: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * PAGE_COUNT,
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  photoFrame: {
    width: SCREEN_WIDTH - Spacing.xl * 2,
    height: Math.min(360, SCREEN_HEIGHT * 0.42),
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: Spacing.xl,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  pageImage: { width: '100%', height: '100%' },
  photoGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  floatingTag: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(23, 24, 19, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  floatingTagText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  pageContent: { alignItems: 'center', paddingHorizontal: Spacing.md },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Platform.OS === 'android' ? Spacing.xxxl : Spacing.xxl,
    gap: Spacing.lg,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 24,
  },
  dot: { height: 8, borderRadius: 4, backgroundColor: Colors.olive },
  ctaContainer: { width: '100%' },
  ctaButton: { width: '100%', borderRadius: 18 },

  // ── Auth Page ──────────────────────────────────────────────────────────
  authContainer: {
    width: '100%',
    paddingHorizontal: Spacing.sm,
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  authBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(101, 116, 74, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorBox: {
    backgroundColor: 'rgba(200,40,40,0.1)',
    borderRadius: 10,
    padding: 10,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(200,40,40,0.25)',
  },
  errorText: {
    color: '#C82828',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
  },
  authButtons: { gap: Spacing.sm },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E0DDD6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4285F4',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-condensed' : undefined,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.dark,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: Spacing.xs,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13, fontWeight: '600' },
  authActionButton: { borderRadius: 16 },
  guestLink: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  guestLinkText: { fontSize: 13, fontWeight: '500' },

  // ── Email Form ─────────────────────────────────────────────────────────
  emailFormTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 13,
    fontSize: 15,
    marginBottom: Spacing.sm,
  },
  switchRow: { alignItems: 'center', marginTop: Spacing.xs },
  switchText: { fontSize: 13, fontWeight: '600' },
  backLink: { alignItems: 'center', paddingTop: Spacing.sm },
  backLinkText: { fontSize: 13, fontWeight: '500' },

  // ── Permission Modal ───────────────────────────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  permissionDialog: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    padding: Spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  permissionBadgeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.olive,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  permissionDialogTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  permissionDialogSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  permList: {
    width: '100%',
    gap: 12,
    marginBottom: Spacing.xl,
  },
  permItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  permIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(101, 116, 74, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permName: {
    fontSize: 14,
    fontWeight: '700',
  },
  permDesc: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 1,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
