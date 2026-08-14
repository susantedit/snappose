/**
 * Onboarding screen — 3-page pager with swipe gestures, parallax/fade/slide
 * transitions, page-dot indicators, Skip button, and "Start Exploring" CTA.
 *
 * [Req 2.1] — Shown on first launch only; never again unless reset.
 * [Req 2.2] — Writes `onboardingCompleted: true` to MMKV on finish/skip.
 * [Req 2.3] — 3 pages, swipe-to-advance, page-dot indicators, Skip button.
 * [Req 2.4] — Skip on pages 1–2 navigates to Home and marks complete.
 * [Req 2.5] — "Start Exploring" CTA on final page.
 * [Req 2.6] — Parallax + fade + slide transitions, each ≤350 ms.
 * [Req 2.7] — Reduce Motion: fade-only, suppress parallax.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { mmkv } from '@/database/mmkv/mmkvClient';
import { MMKV_KEYS } from '@/database/mmkv/keys';
import { useTheme } from '@/constants/theme';
import {
  AnimationDurations,
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from '@/constants/designTokens';
import { SPButton } from '@/components/atoms/SPButton';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PAGE_COUNT = 3;
/** Parallax depth: background moves at 30% of the scroll speed. */
const PARALLAX_FACTOR = 0.3;
/** Minimum horizontal swipe distance to trigger a page change. */
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

// ---------------------------------------------------------------------------
// Page content
// ---------------------------------------------------------------------------

interface PageData {
  icon: string;
  title: string;
  subtitle: string;
  backgroundColor: string;
}

const PAGES: PageData[] = [
  {
    icon: '🤖',
    title: 'AI-Powered Pose Matching',
    subtitle:
      'Our on-device AI detects 33 body landmarks in real time and scores how closely you match any reference pose — no internet needed.',
    backgroundColor: Colors.cream,
  },
  {
    icon: '📸',
    title: 'Automatic Capture',
    subtitle:
      'When your pose score hits the sweet spot, the app counts down and snaps the perfect shot hands-free — no more fumbling with timers.',
    backgroundColor: '#EEF0E8',
  },
  {
    icon: '⬇️',
    title: 'Download & Use Offline',
    subtitle:
      'Download pose packs once and use them anywhere — on the mountain, at the beach, or wherever the shot takes you.',
    backgroundColor: '#E8ECE0',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Mark onboarding done in MMKV and replace the back-stack with Home. */
function completeOnboarding(): void {
  mmkv.set(MMKV_KEYS.ONBOARDING_COMPLETED, true);
  router.replace('/(tabs)');
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Single onboarding page content (icon, title, body). */
function OnboardingPage({
  page,
  index,
  scrollX,
  reduceMotion,
}: {
  page: PageData;
  index: number;
  scrollX: Animated.SharedValue<number>;
  reduceMotion: boolean;
}) {
  // Parallax: icon/content shifts at PARALLAX_FACTOR as the pager scrolls
  const parallaxStyle = useAnimatedStyle(() => {
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

    return { transform: [{ translateX }] };
  });

  // Fade: page fades in/out as it enters/leaves view
  const fadeStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP,
    );

    return { opacity };
  });

  return (
    <View
      style={[styles.page, { width: SCREEN_WIDTH }]}
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel={`Page ${index + 1} of ${PAGE_COUNT}: ${page.title}`}
    >
      <Animated.View style={[styles.pageContent, fadeStyle, parallaxStyle]}>
        {/* Illustration placeholder */}
        <View
          style={styles.illustrationContainer}
          accessibilityElementsHidden={true}
          importantForAccessibility="no-hide-descendants"
        >
          <Text style={styles.illustrationIcon}>{page.icon}</Text>
        </View>

        <Text style={styles.pageTitle} accessibilityRole="header">
          {page.title}
        </Text>

        <Text style={styles.pageSubtitle}>{page.subtitle}</Text>
      </Animated.View>
    </View>
  );
}

/** Dot indicator row showing current page position. */
function DotIndicator({
  scrollX,
  count,
}: {
  scrollX: Animated.SharedValue<number>;
  count: number;
}) {
  return (
    <View
      style={styles.dotRow}
      accessibilityRole="none"
      accessibilityLabel={`Page indicator`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <AnimatedDot key={i} index={i} scrollX={scrollX} />
      ))}
    </View>
  );
}

function AnimatedDot({
  index,
  scrollX,
}: {
  index: number;
  scrollX: Animated.SharedValue<number>;
}) {
  const animStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const width = interpolate(
      scrollX.value,
      inputRange,
      [8, 24, 8],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.4, 1, 0.4],
      Extrapolation.CLAMP,
    );

    return { width, opacity };
  });

  return (
    <Animated.View
      style={[styles.dot, animStyle]}
      accessibilityElementsHidden={true}
    />
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

/**
 * OnboardingScreen — [Req 2]
 */
export default function OnboardingScreen() {
  const { theme } = useTheme();

  // Shared values
  /** Continuous scroll position in px (0 = page 0, SCREEN_WIDTH = page 1, …) */
  const scrollX = useSharedValue(0);
  /** Current integer page index, mirrored into React state for render decisions. */
  const currentPageRef = useRef(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Detect Reduce Motion setting [Req 2.7]
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled);
    });

    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled: boolean) => {
        setReduceMotion(enabled);
      },
    );

    return () => sub.remove();
  }, []);

  // ---------------------------------------------------------------------------
  // Navigation helpers
  // ---------------------------------------------------------------------------

  /** Animate to the target page index. */
  const goToPage = useCallback(
    (page: number) => {
      const clampedPage = Math.max(0, Math.min(page, PAGE_COUNT - 1));
      const duration = reduceMotion
        ? AnimationDurations.quick          // fade-only is much quicker
        : AnimationDurations.long;          // ≤350 ms  [Req 2.6]

      scrollX.value = withTiming(
        clampedPage * SCREEN_WIDTH,
        { duration, easing: Easing.out(Easing.cubic) },
        (finished) => {
          if (finished) {
            runOnJS(setCurrentPage)(clampedPage);
          }
        },
      );
      currentPageRef.current = clampedPage;
      setCurrentPage(clampedPage);
    },
    [reduceMotion, scrollX],
  );

  // ---------------------------------------------------------------------------
  // Swipe gesture  [Req 2.3]
  // ---------------------------------------------------------------------------

  const panStartX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-20, 20])
    .onBegin(() => {
      panStartX.value = scrollX.value;
    })
    .onUpdate((event) => {
      // Drag the pager content in real time, clamped to valid range
      const nextX = panStartX.value - event.translationX;
      const clamped = Math.max(0, Math.min(nextX, (PAGE_COUNT - 1) * SCREEN_WIDTH));
      scrollX.value = clamped;
    })
    .onEnd((event) => {
      const velocityThreshold = 500;
      const page = currentPageRef.current;

      if (
        event.velocityX < -velocityThreshold ||
        event.translationX < -SWIPE_THRESHOLD
      ) {
        // Swiped left → next page
        const next = Math.min(page + 1, PAGE_COUNT - 1);
        runOnJS(goToPage)(next);
      } else if (
        event.velocityX > velocityThreshold ||
        event.translationX > SWIPE_THRESHOLD
      ) {
        // Swiped right → previous page
        const prev = Math.max(page - 1, 0);
        runOnJS(goToPage)(prev);
      } else {
        // Snap back to current page
        runOnJS(goToPage)(page);
      }
    });

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const isLastPage = currentPage === PAGE_COUNT - 1;
  const showSkip = !isLastPage;

  // Pager container slides to track scrollX
  const pagerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -scrollX.value }],
  }));

  return (
    <View style={[styles.root, { backgroundColor: PAGES[currentPage]?.backgroundColor ?? Colors.cream }]}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />

      {/* ── Skip button  [Req 2.3, 2.4] ── */}
      <View style={styles.headerRow}>
        {showSkip ? (
          <Pressable
            style={styles.skipButton}
            onPress={completeOnboarding}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            accessibilityHint="Skips the introduction and takes you straight to the app"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>
              Skip
            </Text>
          </Pressable>
        ) : (
          /* Invisible spacer so header row height stays constant */
          <View style={styles.skipButton} />
        )}
      </View>

      {/* ── Pager ── */}
      <GestureDetector gesture={panGesture}>
        <View style={styles.pagerViewport} accessibilityRole="adjustable">
          <Animated.View style={[styles.pagerStrip, pagerStyle]}>
            {PAGES.map((page, index) => (
              <OnboardingPage
                key={index}
                page={page}
                index={index}
                scrollX={scrollX}
                reduceMotion={reduceMotion}
              />
            ))}
          </Animated.View>
        </View>
      </GestureDetector>

      {/* ── Bottom controls ── */}
      <View style={styles.footer}>
        {/* Dot indicator  [Req 2.3] */}
        <DotIndicator scrollX={scrollX} count={PAGE_COUNT} />

        {/* CTA button — "Next" on pages 0–1, "Start Exploring" on page 2 */}
        <View style={styles.ctaContainer}>
          {isLastPage ? (
            /* "Start Exploring"  [Req 2.5] */
            <SPButton
              label="Start Exploring"
              variant="primary"
              size="lg"
              accessibilityLabel="Start Exploring"
              accessibilityHint="Completes onboarding and opens the app"
              onPress={completeOnboarding}
              style={styles.ctaButton}
            />
          ) : (
            /* "Next" navigation aid for users who prefer tapping over swiping */
            <SPButton
              label="Next"
              variant="secondary"
              size="lg"
              accessibilityLabel={`Go to page ${currentPage + 2} of ${PAGE_COUNT}`}
              accessibilityHint="Advances to the next onboarding page"
              onPress={() => goToPage(currentPage + 1)}
              style={styles.ctaButton}
            />
          )}
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  // ── Header ──
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'android' ? Spacing.xxxl : Spacing.xxl,
    paddingBottom: Spacing.sm,
    minHeight: 60,
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
    fontWeight: Typography.weights.medium,
  },

  // ── Pager ──
  pagerViewport: {
    flex: 1,
    overflow: 'hidden',
  },
  pagerStrip: {
    flexDirection: 'row',
    // Width is PAGE_COUNT * SCREEN_WIDTH so all pages lay out side by side
    width: SCREEN_WIDTH * PAGE_COUNT,
    flex: 1,
  },

  // ── Page ──
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
  },

  // Illustration
  illustrationContainer: {
    width: 160,
    height: 160,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.olive + '1A', // 10% opacity tint
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
    // Subtle shadow
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  illustrationIcon: {
    fontSize: 72,
  },

  // Text
  pageTitle: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: Typography.sizes.h2 * 1.2,
  },
  pageSubtitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.sizes.body * 1.6,
  },

  // ── Footer ──
  footer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Platform.OS === 'android' ? Spacing.xxxl : Spacing.xxl,
    gap: Spacing.xl,
  },

  // Dots
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    height: 24,
  },
  dot: {
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.olive,
  },

  // CTA
  ctaContainer: {
    width: '100%',
  },
  ctaButton: {
    width: '100%',
  },
});
