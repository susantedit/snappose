/**
 * OnboardingScreen — Editorial Magazine Photography Onboarding.
 *
 * Features:
 *  • Multi-plane parallax image translation with subtle zoom
 *  • Fluid swipe physics and gesture velocity interpolation
 *  • Staggered typography entrance per page
 *  • Animated pill page indicator
 *  • Tactile button micro-interactions
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
  type SharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { mmkv } from '@/database/mmkv/mmkvClient';
import { MMKV_KEYS } from '@/database/mmkv/keys';
import { useTheme } from '@/constants/theme';
import {
  Colors,
  Spacing,
  Typography,
} from '@/constants/designTokens';
import { SPButton } from '@/components/atoms/SPButton';
import { SPIcon } from '@/components/atoms/SPIcon';
import { MotionDurations, MotionEasings } from '@/constants/motion';

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
    icon: 'ai',
    tag: 'AI POSE MATCHING',
    title: 'Match Any Pose in Real Time',
    subtitle:
      'On-device AI analyzes 33 body landmarks instantly, giving you real-time visual alignment cues without needing an internet connection.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80',
    backgroundColor: Colors.cream,
  },
  {
    icon: 'camera',
    tag: 'HANDS-FREE SHUTTER',
    title: 'Perfect Alignment, Auto Captured',
    subtitle:
      'Hold your pose — when your alignment score hits the sweet spot, Snap Pose counts down and captures your shot automatically.',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80',
    backgroundColor: '#EEF0E8',
  },
  {
    icon: 'download',
    tag: 'FULL OFFLINE FREEDOM',
    title: 'Download & Pose Anywhere',
    subtitle:
      'Save curated packs offline and strike confident, professional poses wherever your travels take you — from city cafes to mountain summits.',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80',
    backgroundColor: '#E8ECE0',
  },
];

function completeOnboarding(): void {
  mmkv.set(MMKV_KEYS.ONBOARDING_COMPLETED, true);
  router.replace('/(tabs)');
}

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

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.92, 1, 0.92],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateX }, { scale }],
    };
  });

  const textFadeStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 0.6) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 0.6) * SCREEN_WIDTH,
    ];

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [24, 0, -24],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <View
      style={[styles.page, { width: SCREEN_WIDTH }]}
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel={`Page ${index + 1} of ${PAGE_COUNT}: ${page.title}`}
    >
      {/* Editorial Photo Frame with Parallax */}
      <View style={styles.photoFrame}>
        <Animated.Image
          source={{ uri: page.imageUrl }}
          style={[styles.pageImage, imageParallaxStyle]}
          resizeMode="cover"
        />
        <View style={styles.photoGradientOverlay} />

        {/* Floating Category Tag Badge */}
        <View style={styles.floatingTag}>
          <SPIcon name={page.icon} size={14} color="#FFF" strokeWidth={2.4} />
          <Text style={styles.floatingTagText}>{page.tag}</Text>
        </View>
      </View>

      {/* Editorial Text Content */}
      <Animated.View style={[styles.pageContent, textFadeStyle]}>
        <Text style={styles.pageTitle} accessibilityRole="header">
          {page.title}
        </Text>
        <Text style={styles.pageSubtitle}>{page.subtitle}</Text>
      </Animated.View>
    </View>
  );
}

function DotIndicator({
  scrollX,
  count,
}: {
  scrollX: SharedValue<number>;
  count: number;
}) {
  return (
    <View
      style={styles.dotRow}
      accessibilityRole="none"
      accessibilityLabel="Page indicator"
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
  scrollX: SharedValue<number>;
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
      [8, 28, 8],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.35, 1, 0.35],
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

    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled: boolean) => {
        setReduceMotion(enabled);
      },
    );

    return () => sub.remove();
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      const clampedPage = Math.max(0, Math.min(page, PAGE_COUNT - 1));
      const duration = reduceMotion
        ? MotionDurations.fast
        : MotionDurations.medium;

      scrollX.value = withTiming(
        clampedPage * SCREEN_WIDTH,
        { duration, easing: MotionEasings.outStandard },
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

  const panStartX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-20, 20])
    .onBegin(() => {
      panStartX.value = scrollX.value;
    })
    .onUpdate((event) => {
      const nextX = panStartX.value - event.translationX;
      const clamped = Math.max(0, Math.min(nextX, (PAGE_COUNT - 1) * SCREEN_WIDTH));
      scrollX.value = clamped;
    })
    .onEnd((event) => {
      const velocityThreshold = 450;
      const page = currentPageRef.current;

      if (
        event.velocityX < -velocityThreshold ||
        event.translationX < -SWIPE_THRESHOLD
      ) {
        const next = Math.min(page + 1, PAGE_COUNT - 1);
        runOnJS(goToPage)(next);
      } else if (
        event.velocityX > velocityThreshold ||
        event.translationX > SWIPE_THRESHOLD
      ) {
        const prev = Math.max(page - 1, 0);
        runOnJS(goToPage)(prev);
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
    <View style={[styles.root, { backgroundColor: PAGES[currentPage]?.backgroundColor ?? Colors.cream }]}>
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
            accessibilityHint="Skips the introduction and takes you straight to the app"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>
              Skip
            </Text>
          </Pressable>
        ) : (
          <View style={styles.skipButton} />
        )}
      </View>

      {/* Main Viewport Carousel */}
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

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <DotIndicator scrollX={scrollX} count={PAGE_COUNT} />

        <View style={styles.ctaContainer}>
          {isLastPage ? (
            <SPButton
              label="Start Exploring Poses →"
              variant="primary"
              size="lg"
              accessibilityLabel="Start Exploring"
              accessibilityHint="Completes onboarding and opens the app"
              onPress={completeOnboarding}
              style={styles.ctaButton}
            />
          ) : (
            <SPButton
              label="Continue"
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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
  pagerViewport: {
    flex: 1,
    overflow: 'hidden',
  },
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
  pageImage: {
    width: '100%',
    height: '100%',
  },
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
  pageContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
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
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.olive,
  },
  ctaContainer: {
    width: '100%',
  },
  ctaButton: {
    width: '100%',
    borderRadius: 18,
  },
});
