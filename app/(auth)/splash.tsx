import { useEffect } from 'react';
import { StyleSheet, View, Text, AccessibilityInfo } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { mmkv } from '@/database/mmkv/mmkvClient';
import { MMKV_KEYS } from '@/database/mmkv/keys';
import { Colors, AnimationDurations, Typography, Spacing } from '@/constants/designTokens';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Navigate without leaving a back-stack entry.  Runs on the JS thread. */
function navigateAfterSplash(): void {
  const onboardingDone = mmkv.getBoolean(MMKV_KEYS.ONBOARDING_COMPLETED);
  if (onboardingDone === true) {
    router.replace('/(tabs)');
  } else {
    router.replace('/(auth)/onboarding');
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Splash screen — [Req 1.1–1.6]
 *
 * • Displays Snap Pose logo mark + wordmark + tagline            [Req 1.1]
 * • Animates logo scale 0.8→1.0 and opacity 0→1 in ≤400 ms     [Req 1.4]
 * • No interactive elements                                       [Req 1.5]
 * • Reads MMKV `onboardingCompleted` and routes accordingly      [Req 1.6]
 * • Reduce Motion: skips animation but still routes after delay  [Req 28]
 */
export default function SplashScreen() {
  // Animated values — initial state: invisible + scaled down
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    let didNavigate = false;

    // Check Reduce Motion accessibility setting — if enabled, skip animation [Req 28]
    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (reduceMotion) {
        // Skip animation — jump straight to full visibility
        opacity.value = 1;
        scale.value = 1;
        // Still provide a brief branded pause before routing
        const timer = setTimeout(() => {
          if (!didNavigate) {
            didNavigate = true;
            navigateAfterSplash();
          }
        }, 600);
        return () => clearTimeout(timer);
      }

      // Normal path: animate in ≤400 ms, then route  [Req 1.4]
      const duration = AnimationDurations.splash; // 400 ms
      opacity.value = withTiming(1, {
        duration,
        easing: Easing.out(Easing.ease),
      });
      scale.value = withTiming(
        1,
        { duration, easing: Easing.out(Easing.ease) },
        (finished) => {
          if (finished) {
            // Animation complete — navigate [Req 1.6]
            runOnJS(navigateAfterSplash)();
          }
        },
      );
    });

    // Safety net: if animation callback never fires (e.g. component unmounts
    // mid-animation), do not leave the user stranded.  Total cold-start
    // transition budget is 2 s [Req 1.2], so 1.5 s covers the nominal 400 ms
    // animation + 1.1 s headroom for JS thread load.
    const safetyTimer = setTimeout(() => {
      if (!didNavigate) {
        didNavigate = true;
        navigateAfterSplash();
      }
    }, 1500);

    return () => clearTimeout(safetyTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // Animated styles
  // ---------------------------------------------------------------------------

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    // pointerEvents="none" on the root ensures no accidental interaction [Req 1.5]
    <View style={styles.container} pointerEvents="none">
      <StatusBar style="dark" backgroundColor={Colors.cream} />

      <Animated.View
        style={[styles.logoContainer, logoAnimatedStyle]}
        accessible={true}
        accessibilityRole="image"
        accessibilityLabel="Snap Pose logo"
      >
        {/* Logo mark — camera icon rendered as text (no image asset yet) */}
        <View style={styles.logoMark}>
          <Text style={styles.logoIcon} aria-hidden>📷</Text>
        </View>

        {/* Wordmark */}
        <Text style={styles.wordmark} allowFontScaling={false}>
          Snap Pose
        </Text>

        {/* Tagline */}
        <Text
          style={styles.tagline}
          allowFontScaling={false}
          accessibilityLabel="Pose it. Snap it. Share it."
        >
          Pose it. Snap it. Share it.
        </Text>
      </Animated.View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

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
  logoMark: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: Colors.olive,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    // Subtle shadow for depth
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  logoIcon: {
    fontSize: 48,
  },
  wordmark: {
    fontSize: Typography.sizes.h1,          // 36
    fontWeight: Typography.weights.bold,    // '700'
    color: Colors.dark,
    letterSpacing: -0.5,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: Typography.sizes.body,        // 16
    fontWeight: Typography.weights.medium,  // '500'
    color: Colors.olive,
    letterSpacing: 0.2,
    marginTop: Spacing.xxs,
  },
});
