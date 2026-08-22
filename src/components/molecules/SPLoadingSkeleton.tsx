/**
 * SPLoadingSkeleton — Pulsating Holographic AR Human Skeleton Loader Component.
 *
 * Renders an animated MediaPipe 33-landmark humanoid skeleton with:
 *  - Pulsating neon joint nodes (Head, Shoulders, Elbows, Wrists, Torso, Hips, Knees, Ankles)
 *  - Glowing skeletal connection lines with a breathing pulse
 *  - Animated laser scan line sweeping vertically over the skeleton
 *  - Supports modes: 'ar_overlay' | 'card' | 'full_screen'
 */

import React, { useEffect } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Svg, Line as SvgLine } from 'react-native-svg';
import { useTheme } from '@/constants/theme';
import { BorderRadius, Colors, Spacing } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';

export interface SPLoadingSkeletonProps {
  /** Display mode. Defaults to 'ar_overlay'. */
  mode?: 'ar_overlay' | 'card' | 'full_screen';
  /** Width override. */
  width?: number | `${number}%`;
  /** Height override. */
  height?: number;
  /** Custom status loading text. */
  label?: string;
  /** Custom container style. */
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Landmark Coordinates for Humanoid Silhouette (Normalized 0..1 scale)
// ---------------------------------------------------------------------------
const SKELETON_JOINTS = [
  { id: 'head', x: 0.5, y: 0.12, r: 12 },
  { id: 'neck', x: 0.5, y: 0.22, r: 5 },
  { id: 'l_shoulder', x: 0.35, y: 0.26, r: 6 },
  { id: 'r_shoulder', x: 0.65, y: 0.26, r: 6 },
  { id: 'l_elbow', x: 0.26, y: 0.42, r: 5 },
  { id: 'r_elbow', x: 0.74, y: 0.42, r: 5 },
  { id: 'l_wrist', x: 0.2, y: 0.56, r: 5 },
  { id: 'r_wrist', x: 0.8, y: 0.56, r: 5 },
  { id: 'l_hip', x: 0.4, y: 0.54, r: 6 },
  { id: 'r_hip', x: 0.6, y: 0.54, r: 6 },
  { id: 'l_knee', x: 0.38, y: 0.72, r: 5 },
  { id: 'r_knee', x: 0.62, y: 0.72, r: 5 },
  { id: 'l_ankle', x: 0.36, y: 0.9, r: 5 },
  { id: 'r_ankle', x: 0.64, y: 0.9, r: 5 },
];

const SKELETON_BONES = [
  { from: 'head', to: 'neck' },
  { from: 'neck', to: 'l_shoulder' },
  { from: 'neck', to: 'r_shoulder' },
  { from: 'l_shoulder', to: 'l_elbow' },
  { from: 'l_elbow', to: 'l_wrist' },
  { from: 'r_shoulder', to: 'r_elbow' },
  { from: 'r_elbow', to: 'r_wrist' },
  { from: 'l_shoulder', to: 'l_hip' },
  { from: 'r_shoulder', to: 'r_hip' },
  { from: 'l_hip', to: 'r_hip' },
  { from: 'l_hip', to: 'l_knee' },
  { from: 'l_knee', to: 'l_ankle' },
  { from: 'r_hip', to: 'r_knee' },
  { from: 'r_knee', to: 'r_ankle' },
];

export function SPLoadingSkeleton({
  mode = 'ar_overlay',
  width = '100%',
  height = 320,
  label = 'Extracting 33 Skeletal Landmarks...',
  style,
}: SPLoadingSkeletonProps) {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';

  const pulse = useSharedValue(0);
  const scanLine = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    scanLine.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [pulse, scanLine]);

  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(pulse.value, [0.4, 1], [0.5, 1]),
      transform: [{ scale: interpolate(pulse.value, [0.4, 1], [0.96, 1.04]) }],
    };
  });

  const animatedLaserStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(scanLine.value, [0, 1], [0, typeof height === 'number' ? height : 300]),
        },
      ],
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height: mode === 'full_screen' ? '100%' : height,
          backgroundColor:
            mode === 'ar_overlay'
              ? '#000000B3'
              : isDark
              ? '#1E1E1E'
              : '#F8F5EE',
          borderColor: isDark ? '#2E2E2E' : '#ECE5D8',
        },
        style,
      ]}
    >
      {/* Holographic Skeleton Graphics */}
      <Animated.View style={[styles.skeletonFrame, animatedPulseStyle]}>
        {/* Render Bone Connection Lines */}
        <Svg style={StyleSheet.absoluteFillObject} viewBox="0 0 200 240">
          {SKELETON_BONES.map((b, idx) => {
            const jointA = SKELETON_JOINTS.find((j) => j.id === b.from);
            const jointB = SKELETON_JOINTS.find((j) => j.id === b.to);
            if (!jointA || !jointB) return null;

            return (
              <SvgLine
                key={idx}
                x1={jointA.x * 200}
                y1={jointA.y * 240}
                x2={jointB.x * 200}
                y2={jointB.y * 240}
                stroke="#10B981"
                strokeWidth={3.5}
                strokeLinecap="round"
                opacity={0.85}
              />
            );
          })}
        </Svg>

        {/* Render Joint Nodes */}
        {SKELETON_JOINTS.map((j) => (
          <View
            key={j.id}
            style={[
              styles.jointDot,
              {
                left: `${j.x * 100}%`,
                top: `${j.y * 100}%`,
                width: j.r,
                height: j.r,
                borderRadius: j.r / 2,
              },
            ]}
          />
        ))}

        {/* Outer Halo on Head */}
        <View style={styles.headHalo} />
      </Animated.View>

      {/* Vertical Scanning Laser Line */}
      <Animated.View style={[styles.laserLine, animatedLaserStyle]} />

      {/* Status Overlay Badge & Text */}
      <View style={styles.labelContainer}>
        <View style={styles.iconCircle}>
          <SPIcon name="ai" size={18} color={Colors.olive} />
        </View>
        <Text style={[styles.labelStatusText, { color: mode === 'ar_overlay' ? '#FFFFFF' : isDark ? '#FFF' : Colors.textPrimary }]}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
  },
  skeletonFrame: {
    width: 200,
    height: 240,
    position: 'relative',
  },
  jointDot: {
    position: 'absolute',
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
  headHalo: {
    position: 'absolute',
    left: '50%',
    top: '12%',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10B981',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  laserLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 2,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 6,
  },
  labelContainer: {
    position: 'absolute',
    bottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: '#000000A0',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.olive + '33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelStatusText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
