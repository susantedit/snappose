/**
 * SPTposeHero — Interactive Tony Stark / Power T-Pose Studio Banner.
 *
 * Features:
 *  • Displays the exact Robert Downey Jr. Tony Stark T-Pose image
 *  • Interactive anatomical touch nodes (Head 🕶️, Shoulders, Arms 👐, Palms Up, Torso, Stance)
 *  • Body region interactive guidance modal / pill
 *  • Signature copy: "YOUR BODY. YOUR CAMERA. OUR DIRECTION."
 *  • Direct CTAs: "TRY THIS POSE 🚀" & "EXPLORE POSES"
 */

import React, { useCallback, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';

export type BodyRegion = 'HEAD' | 'SHOULDERS' | 'ARMS' | 'HANDS' | 'TORSO' | 'LEGS';

const TONY_STARK_IMAGE = require('../../../../assets/images/tony_stark_tpose.png');

const BODY_GUIDANCE: Record<BodyRegion, { label: string; tip: string; icon: string }> = {
  HEAD: {
    label: 'Head & Sunglasses',
    tip: 'Tilt chin up 10°, gaze confident directly forward over sunglasses.',
    icon: 'target',
  },
  SHOULDERS: {
    label: 'Power Shoulders',
    tip: 'Roll shoulders back, chest wide open facing the horizon.',
    icon: 'target',
  },
  ARMS: {
    label: 'Outstretched Arms',
    tip: 'Extend both arms fully horizontal 180° straight out to the sides.',
    icon: 'target',
  },
  HANDS: {
    label: 'Palms Up',
    tip: 'Turn palms facing upward, relaxed open hands (Jericho presentation pose).',
    icon: 'target',
  },
  TORSO: {
    label: 'Suit & Torso',
    tip: 'Upright centered posture, jacket unbuttoned or fitted waist.',
    icon: 'target',
  },
  LEGS: {
    label: 'Boss Stance',
    tip: 'Feet shoulder-width apart, grounded firmly on rocks or desert ground.',
    icon: 'target',
  },
};

const CONCEPT_TAGS = [
  'POWER T-POSE',
  'TONY STARK',
  'MOUNTAIN',
  'BOSS',
  'CONFIDENT',
  'EDITORIAL',
];

export interface SPTposeHeroProps {
  onExplorePress?: () => void;
}

export function SPTposeHero({ onExplorePress }: SPTposeHeroProps) {
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>('ARMS');

  const figureScale = useSharedValue(1);

  const handleRegionPress = useCallback((region: BodyRegion) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    figureScale.value = withSequence(
      withTiming(0.96, { duration: 80 }),
      withSpring(1, { damping: 12 }),
    );
    setSelectedRegion(region);
  }, [figureScale]);

  const animatedFigureStyle = useAnimatedStyle(() => ({
    transform: [{ scale: figureScale.value }],
  }));

  const handleTryPowerPose = () => {
    router.push({
      pathname: '/(tabs)/camera',
      params: { poseId: 'pose-tony-stark-tpose' },
    });
  };

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.heroCard}>
      {/* Background Visual Image Card — Robert Downey Jr Tony Stark Image */}
      <Image
        source={TONY_STARK_IMAGE}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.gradientOverlay} pointerEvents="none" />

      {/* Concept Tags Ribbon with Social Proof Uses Badge */}
      <View style={styles.conceptRibbon}>
        <View style={styles.usesRibbonPill}>
          <SPIcon name="flame" size={12} color="#FF8A00" />
          <Text style={styles.usesRibbonText}>42.8k+ Captured</Text>
        </View>
        {CONCEPT_TAGS.slice(0, 4).map((tag) => (
          <View key={tag} style={[styles.conceptPill, tag === 'POWER T-POSE' && styles.conceptPillActive]}>
            <Text style={[styles.conceptText, tag === 'POWER T-POSE' && styles.conceptTextActive]}>
              {tag}
            </Text>
          </View>
        ))}
      </View>

      {/* Main Interactive Studio Arena — Iconic Tony Stark Arms-Outstretched Overlay */}
      <View style={styles.arena}>
        <Animated.View style={[styles.figureContainer, animatedFigureStyle]}>
          <View style={styles.tposeFrame}>
            {/* Visual Arm Spread Line Indicator */}
            <View style={styles.horizontalArmSpreadLine} />
            <View style={styles.verticalSpineLine} />

            {/* Anatomical Touch Nodes */}
            <Pressable
              onPress={() => handleRegionPress('HEAD')}
              style={[styles.node, styles.nodeHead, selectedRegion === 'HEAD' && styles.nodeActive]}
            >
              <Text style={styles.nodeLabel}>HEAD 🕶️</Text>
            </Pressable>

            <Pressable
              onPress={() => handleRegionPress('SHOULDERS')}
              style={[styles.node, styles.nodeShoulders, selectedRegion === 'SHOULDERS' && styles.nodeActive]}
            >
              <Text style={styles.nodeLabel}>SHOULDERS</Text>
            </Pressable>

            <Pressable
              onPress={() => handleRegionPress('ARMS')}
              style={[styles.node, styles.nodeArmsLeft, selectedRegion === 'ARMS' && styles.nodeActive]}
            >
              <Text style={styles.nodeLabel}>ARMS 👐</Text>
            </Pressable>

            <Pressable
              onPress={() => handleRegionPress('HANDS')}
              style={[styles.node, styles.nodeHandsRight, selectedRegion === 'HANDS' && styles.nodeActive]}
            >
              <Text style={styles.nodeLabel}>PALMS UP</Text>
            </Pressable>

            <Pressable
              onPress={() => handleRegionPress('TORSO')}
              style={[styles.node, styles.nodeTorso, selectedRegion === 'TORSO' && styles.nodeActive]}
            >
              <Text style={styles.nodeLabel}>TORSO</Text>
            </Pressable>

            <Pressable
              onPress={() => handleRegionPress('LEGS')}
              style={[styles.node, styles.nodeLegs, selectedRegion === 'LEGS' && styles.nodeActive]}
            >
              <Text style={styles.nodeLabel}>STANCE</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Dynamic Anatomical Guidance Box */}
        {selectedRegion && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.guidanceBox}>
            <View style={styles.guidanceHeader}>
              <SPIcon name="sparkles" size={14} color={Colors.olive} />
              <Text style={styles.guidanceTitle}>
                {BODY_GUIDANCE[selectedRegion].label}
              </Text>
            </View>
            <Text style={styles.guidanceTip}>
              {BODY_GUIDANCE[selectedRegion].tip}
            </Text>
          </Animated.View>
        )}
      </View>

      {/* Main Hero Copy */}
      <View style={styles.copyContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>FEATURED • TONY STARK POWER T-POSE</Text>
        </View>
        <Text style={styles.heroTitle}>YOUR BODY. YOUR CAMERA. OUR DIRECTION.</Text>
        <Text style={styles.heroSubtext}>
          Outstretch arms, palms up. POSEHANUM directs your power shot.
        </Text>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <AnimatedPressable
            onPress={handleTryPowerPose}
            style={styles.primaryButton}
            scaleTo={0.95}
          >
            <SPIcon name="sparkles" size={16} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>TRY THIS POSE 🚀</Text>
          </AnimatedPressable>

          <AnimatedPressable
            onPress={onExplorePress}
            style={styles.secondaryButton}
            scaleTo={0.95}
          >
            <Text style={styles.secondaryButtonText}>EXPLORE POSES ↓</Text>
          </AnimatedPressable>
        </View>
      </View>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 24,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: '#1E211A',
    minHeight: 320,
    justifyContent: 'space-between',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 20, 15, 0.38)',
  },
  conceptRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
    zIndex: 2,
  },
  usesRibbonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 138, 0, 0.28)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 138, 0, 0.5)',
  },
  usesRibbonText: {
    color: '#FFB74D',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  conceptPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  conceptPillActive: {
    backgroundColor: Colors.olive,
    borderColor: Colors.olive,
  },
  conceptText: {
    color: '#D2D9C5',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  conceptTextActive: {
    color: '#FFFFFF',
  },
  arena: {
    alignItems: 'center',
    marginVertical: 6,
    zIndex: 2,
  },
  figureContainer: {
    width: '100%',
    height: 145,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tposeFrame: {
    width: 240,
    height: 135,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalArmSpreadLine: {
    position: 'absolute',
    top: 36,
    width: 230,
    height: 3,
    backgroundColor: 'rgba(183, 255, 0, 0.85)',
    borderRadius: 2,
  },
  verticalSpineLine: {
    position: 'absolute',
    width: 3,
    height: 115,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 2,
  },
  node: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  nodeActive: {
    backgroundColor: Colors.olive,
    borderColor: '#B7FF00',
    transform: [{ scale: 1.1 }],
  },
  nodeLabel: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  nodeHead: { top: 0 },
  nodeShoulders: { top: 30, left: 15 },
  nodeArmsLeft: { top: 26, left: -5 },
  nodeHandsRight: { top: 26, right: -5 },
  nodeTorso: { top: 62, left: 85 },
  nodeLegs: { bottom: 0 },

  guidanceBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 14,
    padding: 10,
    width: '100%',
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(101, 116, 74, 0.6)',
  },
  guidanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  guidanceTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  guidanceTip: {
    color: '#E0E5D8',
    fontSize: 11,
    lineHeight: 15,
  },

  copyContainer: {
    marginTop: 8,
    zIndex: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(101, 116, 74, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  heroSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    marginBottom: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.olive,
    paddingVertical: 10,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
