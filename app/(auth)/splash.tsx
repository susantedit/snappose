/**
 * SplashScreen — Cinematic Brand Reveal for Snap Pose.
 *
 * Sequence:
 *  1. Background fades from deep black / warm cream.
 *  2. High-res Snap Pose logo badge appears subtly (scale 0.92 → 1.0, opacity 0 → 1).
 *  3. Soft light sweep passes across the mark.
 *  4. "SNAP POSE" editorial wordmark reveals.
 *  5. Tagline "POSE IT. SNAP IT. SHARE IT." fades in.
 *  6. Seamless transition into Onboarding or Main Tabs.
 */

import React, { useEffect } from 'react';
import {
  AccessibilityInfo,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { mmkv } from '@/database/mmkv/mmkvClient';
import { MMKV_KEYS } from '@/database/mmkv/keys';
import { Colors, Spacing } from '@/constants/designTokens';
import { MotionEasings } from '@/constants/motion';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function navigateAfterSplash(): void {
  const onboardingDone = mmkv.getBoolean(MMKV_KEYS.ONBOARDING_COMPLETED);
  if (onboardingDone === true) {
    router.replace('/(tabs)');
  } else {
    router.replace('/(auth)/onboarding');
  }
}

export default function SplashScreen() {
  const bgOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.92);
  const logoOpacity = useSharedValue(0);
  const shimmerPos = useSharedValue(-SCREEN_WIDTH);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(18);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(12);
  const exitScale = useSharedValue(1);

  useEffect(() => {
    let didNavigate = false;

    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (reduceMotion) {
        bgOpacity.value = 1;
        logoScale.value = 1;
        logoOpacity.value = 1;
        titleOpacity.value = 1;
        taglineOpacity.value = 1;
        setTimeout(() => {
          if (!didNavigate) {
            didNavigate = true;
            navigateAfterSplash();
          }
        }, 800);
        return;
      }

      // Step 1: Background fade
      bgOpacity.value = withTiming(1, { duration: 400 });

      // Step 2: Logo scale & opacity reveal
      logoOpacity.value = withDelay(
        200,
        withTiming(1, { duration: 600, easing: MotionEasings.outStandard }),
      );
      logoScale.value = withDelay(
        200,
        withTiming(1.0, { duration: 750, easing: MotionEasings.outStandard }),
      );

      // Step 3: Shimmer light sweep across logo
      shimmerPos.value = withDelay(
        600,
        withTiming(SCREEN_WIDTH, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      );

      // Step 4: Wordmark reveal
      titleOpacity.value = withDelay(
        700,
        withTiming(1, { duration: 450, easing: MotionEasings.outStandard }),
      );
      titleTranslateY.value = withDelay(
        700,
        withTiming(0, { duration: 450, easing: MotionEasings.outStandard }),
      );

      // Step 5: Tagline reveal
      taglineOpacity.value = withDelay(
        950,
        withTiming(1, { duration: 400, easing: MotionEasings.outStandard }),
      );
      taglineTranslateY.value = withDelay(
        950,
        withTiming(0, { duration: 400, easing: MotionEasings.outStandard }),
      );

      // Step 6: Gentle exit scale and navigate
      exitScale.value = withDelay(
        1700,
        withTiming(0.96, { duration: 350, easing: MotionEasings.inOutStandard }, (finished) => {
          if (finished && !didNavigate) {
            didNavigate = true;
            runOnJS(navigateAfterSplash)();
          }
        }),
      );
    });

    const safetyTimer = setTimeout(() => {
      if (!didNavigate) {
        didNavigate = true;
        navigateAfterSplash();
      }
    }, 2400);

    return () => clearTimeout(safetyTimer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value * exitScale.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerPos.value }],
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      <StatusBar style="dark" backgroundColor={Colors.cream} translucent />

      {/* Main Logo & Identity */}
      <Animated.View
        style={[styles.logoContainer, logoAnimatedStyle]}
        accessible={true}
        accessibilityRole="image"
        accessibilityLabel="Snap Pose logo"
      >
        <View style={styles.logoMarkWrapper}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          {/* Subtle light sweep reflection */}
          <Animated.View style={[styles.shimmerSweep, shimmerAnimatedStyle]} />
        </View>

        {/* Wordmark */}
        <Animated.View style={titleAnimatedStyle}>
          <Text style={styles.wordmark} allowFontScaling={false}>
            Snap Pose
          </Text>
        </Animated.View>

        {/* Editorial Tagline */}
        <Animated.View style={taglineAnimatedStyle}>
          <View style={styles.taglineBadge}>
            <Text
              style={styles.tagline}
              allowFontScaling={false}
              accessibilityLabel="Pose it. Snap it. Share it."
            >
              POSE IT. SNAP IT. SHARE IT.
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMarkWrapper: {
    width: 140,
    height: 140,
    borderRadius: 36,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
  logoImage: {
    width: 132,
    height: 132,
    borderRadius: 32,
  },
  shimmerSweep: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    transform: [{ skewX: '-25deg' }],
  },
  wordmark: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.dark,
    letterSpacing: -0.6,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  taglineBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(101, 116, 74, 0.12)',
    marginTop: Spacing.xxs,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.olive,
    letterSpacing: 2.2,
    textAlign: 'center',
  },
});
