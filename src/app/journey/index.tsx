/**
 * Pose Journey Screen — /journey/index
 * Interactive photo session workflow generator.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/constants/theme';
import { Colors, Spacing, BorderRadius } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';
import { SPButton } from '@/components/atoms/SPButton';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';
import { PoseJourneyEngine, type PoseJourneySession } from '@/features/poses/domain/PoseJourneyEngine';

const VIBE_OPTIONS = [
  { id: 'confident', label: 'Confident Editorial', icon: 'sparkles' },
  { id: 'relaxed', label: 'Casual & Relaxed', icon: 'lifestyle' },
  { id: 'cinematic', label: 'Cinematic Drama', icon: 'play' },
  { id: 'romantic', label: 'Romantic & Soft', icon: 'heart' },
];

export default function PoseJourneyScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme.mode === 'dark';

  const [selectedVibe, setSelectedVibe] = useState('confident');
  const [session, setSession] = useState<PoseJourneySession>(() =>
    PoseJourneyEngine.generateJourney('confident')
  );

  const handleVibeChange = (vibeId: string) => {
    setSelectedVibe(vibeId);
    setSession(PoseJourneyEngine.generateJourney(vibeId));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleStartSession = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Start camera with first pose of journey
    const firstPose = session.steps[0]?.pose;
    router.push({
      pathname: '/(tabs)/camera',
      params: { poseId: firstPose?.id || '' },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <SPIcon name="back" size={20} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Pose Journey Narrative</Text>
        <Pressable
          onPress={() => setSession(PoseJourneyEngine.generateJourney(selectedVibe))}
          style={styles.refreshBtn}
        >
          <SPIcon name="refresh" size={18} color={Colors.olive} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro banner */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.heroCard}>
          <Text style={styles.heroBadge}>DIRECTOR MODE</Text>
          <Text style={styles.heroHeading}>5-Shot Editorial Story</Text>
          <Text style={styles.heroSub}>
            A complete photoshoot sequence curated to give you maximum variety in one session.
          </Text>
        </Animated.View>

        {/* Vibe Selector */}
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Choose Photoshoot Vibe</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vibeRow}>
          {VIBE_OPTIONS.map((vibe) => {
            const isSelected = vibe.id === selectedVibe;
            return (
              <AnimatedPressable
                key={vibe.id}
                onPress={() => handleVibeChange(vibe.id)}
                style={[
                  styles.vibePill,
                  {
                    backgroundColor: isSelected
                      ? Colors.olive
                      : isDark
                      ? Colors.darkCardBackground
                      : Colors.surface,
                    borderColor: isSelected ? Colors.olive : isDark ? Colors.borderDark : Colors.border,
                  },
                ]}
              >
                <SPIcon
                  name={vibe.icon as any}
                  size={14}
                  color={isSelected ? '#FFF' : theme.colors.textPrimary}
                />
                <Text
                  style={[
                    styles.vibeText,
                    { color: isSelected ? '#FFF' : theme.colors.textPrimary },
                  ]}
                >
                  {vibe.label}
                </Text>
              </AnimatedPressable>
            );
          })}
        </ScrollView>

        {/* Journey Steps List */}
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, marginTop: Spacing.lg }]}>
          Sequence Roadmap
        </Text>

        <View style={styles.stepsList}>
          {session.steps.map((step, idx) => (
            <Animated.View
              key={step.pose.id + idx}
              entering={FadeInDown.delay(idx * 80).duration(400)}
              style={[
                styles.stepCard,
                {
                  backgroundColor: isDark ? Colors.darkCardBackground : Colors.surface,
                  borderColor: isDark ? Colors.borderDark : Colors.border,
                },
              ]}
            >
              <Image source={{ uri: step.pose.imageUrl }} style={styles.stepImage} />
              <View style={styles.stepInfo}>
                <Text style={styles.stepStage}>{step.stageName}</Text>
                <Text style={[styles.stepTitle, { color: theme.colors.textPrimary }]}>
                  {step.pose.title}
                </Text>
                <Text style={[styles.stepAdvice, { color: theme.colors.textSecondary }]}>
                  💡 {step.directorAdvice}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* Floating CTA */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: insets.bottom + 12,
            backgroundColor: isDark ? 'rgba(24,24,24,0.95)' : 'rgba(255,255,255,0.95)',
            borderTopColor: isDark ? Colors.borderDark : Colors.border,
          },
        ]}
      >
        <SPButton
          label="Start 5-Shot Journey →"
          variant="primary"
          size="lg"
          onPress={handleStartSession}
          accessibilityLabel="Start 5-shot pose journey"
          style={{ flex: 1, borderRadius: 24 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.md,
  },
  heroCard: {
    backgroundColor: Colors.forest,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  heroBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.lime,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  heroHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  vibeRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  vibePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  vibeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepsList: {
    gap: 10,
  },
  stepCard: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 8,
    gap: 12,
  },
  stepImage: {
    width: 70,
    height: 90,
    borderRadius: BorderRadius.md,
  },
  stepInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  stepStage: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.olive,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  stepAdvice: {
    fontSize: 11,
    lineHeight: 15,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.md,
    paddingTop: 12,
    borderTopWidth: 1,
  },
});
