/**
 * SPShotBuilder — Contextual Shot Builder & Instant Recipe Engine.
 *
 * Allows users to select Location + Vibe + Shot Type and immediately
 * generates a complete POSEHANUM Shot Recipe with target camera angle & directives.
 *
 * NOTE: Does NOT display simulated/fake percentage scores. Real match percentages
 * are only calculated on the live camera stream against detected landmarks.
 */

import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';
import { SNAP_POSE_DATASET } from '@/features/poses/data/posesData';

export type LocationOption = 'Beach' | 'Cafe' | 'Mountain' | 'City' | 'Nature';
export type VibeOption = 'Aesthetic' | 'Casual' | 'Confident' | 'Luxury' | 'Adventure';
export type ShotTypeOption = 'Portrait' | 'Full Body' | 'Selfie' | 'Couple' | 'Creator';

const LOCATIONS: LocationOption[] = ['Beach', 'Cafe', 'Mountain', 'City', 'Nature'];
const VIBES: VibeOption[] = ['Aesthetic', 'Casual', 'Confident', 'Luxury', 'Adventure'];
const SHOT_TYPES: ShotTypeOption[] = ['Portrait', 'Full Body', 'Selfie', 'Couple', 'Creator'];

export function SPShotBuilder() {
  const [location, setLocation] = useState<LocationOption>('Mountain');
  const [vibe, setVibe] = useState<VibeOption>('Casual');
  const [shotType, setShotType] = useState<ShotTypeOption>('Full Body');

  // Compute Instant Shot Recipe from real pose dataset metadata
  const shotRecipe = useMemo(() => {
    // Find best pose matching location/category
    const catId = location.toLowerCase();
    const matchedPose =
      SNAP_POSE_DATASET.find((p) => p.categoryId === catId || p.tags.includes(catId)) ||
      SNAP_POSE_DATASET[0];

    return {
      poseId: matchedPose.id,
      poseName: matchedPose.title,
      difficulty: matchedPose.difficulty.toUpperCase(),
      camera: matchedPose.cameraAngle || '1x • Chest height',
      distance: matchedPose.estimatedDistance ? `${matchedPose.estimatedDistance}m` : '1.8m',
      light: location === 'Cafe' ? 'Window light' : location === 'Beach' ? 'Golden hour' : 'Face toward light',
      body: 'Turn 20° to 3/4 angle',
      hands: 'One hand relaxed in pocket',
      expression: vibe === 'Confident' ? 'Direct eye contact' : 'Look slightly away',
      background: `${location} depth framing`,
    };
  }, [location, vibe, shotType]);

  const handleSelectLocation = (loc: LocationOption) => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setLocation(loc);
  };

  const handleSelectVibe = (v: VibeOption) => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setVibe(v);
  };

  const handleSelectShotType = (st: ShotTypeOption) => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setShotType(st);
  };

  const handleTryShot = () => {
    router.push({
      pathname: '/(tabs)/camera',
      params: { poseId: shotRecipe.poseId },
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <SPIcon name="sparkles" size={16} color={Colors.olive} />
          <Text style={styles.title}>SHOT BUILDER</Text>
        </View>
        <Text style={styles.subtitle}>Build your moment, get instant AI direction</Text>
      </View>

      {/* Selectors */}
      <View style={styles.selectorBlock}>
        {/* Location Selector */}
        <Text style={styles.label}>WHERE?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {LOCATIONS.map((loc) => (
            <Pressable
              key={loc}
              onPress={() => handleSelectLocation(loc)}
              style={[styles.pill, location === loc && styles.pillActive]}
            >
              <Text style={[styles.pillText, location === loc && styles.pillTextActive]}>{loc}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Vibe Selector */}
        <Text style={styles.label}>VIBE?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {VIBES.map((v) => (
            <Pressable
              key={v}
              onPress={() => handleSelectVibe(v)}
              style={[styles.pill, vibe === v && styles.pillActive]}
            >
              <Text style={[styles.pillText, vibe === v && styles.pillTextActive]}>{v}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Shot Type Selector */}
        <Text style={styles.label}>SHOT?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {SHOT_TYPES.map((st) => (
            <Pressable
              key={st}
              onPress={() => handleSelectShotType(st)}
              style={[styles.pill, shotType === st && styles.pillActive]}
            >
              <Text style={[styles.pillText, shotType === st && styles.pillTextActive]}>{st}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Generated Recipe Result Box */}
      <Animated.View entering={FadeInDown.duration(350)} style={styles.recipeBox}>
        <View style={styles.recipeHeader}>
          <View>
            <Text style={styles.recipeTag}>THE SHOT RECIPE</Text>
            <Text style={styles.recipePoseName}>{shotRecipe.poseName}</Text>
          </View>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyVal}>{shotRecipe.difficulty}</Text>
            <Text style={styles.difficultyLbl}>LEVEL</Text>
          </View>
        </View>

        {/* Grid of Directives */}
        <View style={styles.directivesGrid}>
          <View style={styles.directiveItem}>
            <Text style={styles.dirKey}>CAMERA</Text>
            <Text style={styles.dirVal}>{shotRecipe.camera}</Text>
          </View>
          <View style={styles.directiveItem}>
            <Text style={styles.dirKey}>DISTANCE</Text>
            <Text style={styles.dirVal}>{shotRecipe.distance}</Text>
          </View>
          <View style={styles.directiveItem}>
            <Text style={styles.dirKey}>LIGHTING</Text>
            <Text style={styles.dirVal}>{shotRecipe.light}</Text>
          </View>
          <View style={styles.directiveItem}>
            <Text style={styles.dirKey}>EXPRESSION</Text>
            <Text style={styles.dirVal}>{shotRecipe.expression}</Text>
          </View>
        </View>

        <AnimatedPressable onPress={handleTryShot} style={styles.tryButton} scaleTo={0.96}>
          <SPIcon name="camera" size={16} color="#FFFFFF" />
          <Text style={styles.tryButtonText}>TRY THIS SHOT IN CAMERA</Text>
        </AnimatedPressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1F19',
    borderRadius: 18,
    padding: 14,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardHeader: {
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  subtitle: {
    color: '#9EA495',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '400',
  },
  selectorBlock: {
    gap: 6,
    marginBottom: 14,
  },
  label: {
    color: Colors.olive,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  row: {
    gap: 6,
    paddingVertical: 2,
  },
  pill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pillActive: {
    backgroundColor: Colors.olive,
    borderColor: Colors.olive,
  },
  pillText: {
    color: '#CCCCCC',
    fontSize: 11,
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  recipeBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(101, 116, 74, 0.3)',
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recipeTag: {
    color: Colors.olive,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  recipePoseName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  difficultyBadge: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(101, 116, 74, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(101, 116, 74, 0.3)',
  },
  difficultyVal: {
    color: '#B7FF00',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  difficultyLbl: {
    color: '#A0A696',
    fontSize: 8,
    fontWeight: '700',
  },
  directivesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  directiveItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 6,
    borderRadius: 8,
  },
  dirKey: {
    color: '#8A9082',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dirVal: {
    color: '#E0E5D8',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  tryButton: {
    backgroundColor: Colors.olive,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
