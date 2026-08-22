/**
 * SPCoupleVerificationModal — Hilarious & Interactive Couple Check Modal.
 *
 * Asks users if they are in a couple before opening couple poses.
 * If yes -> proceeds smoothly.
 * If single -> displays funny, friendly roast quotes with options to
 * switch to Solo Poses or proceed anyway ("Practicing for the future! 🚀").
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';
import { BorderRadius, Spacing } from '@/constants/designTokens';
import { SPButton } from '@/components/atoms/SPButton';
import { SPIcon } from '@/components/atoms/SPIcon';

const ROAST_QUOTES = [
  "Bro, you're single... who are you hugging, the air? 💨",
  "Single and trying couple poses? Your shadow isn't gonna hold your hand! 🧍",
  "Third wheeling with yourself? Get a date first or try our Solo Poses! 😂",
  "Bold move trying a couple pose solo! Body pillow partner not included. 🛌",
  "Error 404: Partner not found. Switch to Solo Poses or go hit up Tinder! 📲",
  "Posing solo in a couple frame? Even the AI camera is looking at you like 🤨",
];

export interface SPCoupleVerificationModalProps {
  visible: boolean;
  poseName?: string;
  onConfirmCouple: () => void;
  onProceedAnyway: () => void;
  onSelectSoloPoses: () => void;
  onDismiss: () => void;
}

export function SPCoupleVerificationModal({
  visible,
  poseName,
  onConfirmCouple,
  onProceedAnyway,
  onSelectSoloPoses,
  onDismiss,
}: SPCoupleVerificationModalProps) {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';

  const [mode, setMode] = useState<'question' | 'roast'>('question');
  const [roastIndex, setRoastIndex] = useState(0);

  // Reset to question mode on new show
  useEffect(() => {
    if (visible) {
      setMode('question');
      setRoastIndex(Math.floor(Math.random() * ROAST_QUOTES.length));
    }
  }, [visible]);

  const currentRoast = useMemo(() => ROAST_QUOTES[roastIndex], [roastIndex]);

  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 18, stiffness: 220 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withTiming(0.9, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible, scale, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <Modal transparent visible animationType="none" onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? '#1C1F19' : '#FFFFFF',
              borderColor: isDark ? 'rgba(183, 255, 0, 0.25)' : '#E6DFD3',
            },
            animStyle,
          ]}
          onStartShouldSetResponder={() => true}
        >
          {mode === 'question' ? (
            /* ── State 1: Are You a Couple Question ────────────────────── */
            <View style={styles.contentContainer}>
              <View style={styles.emojiBadge}>
                <Text style={{ fontSize: 36 }}>👩‍❤️‍👨</Text>
              </View>

              <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1C1E1A' }]}>
                Are you a couple?
              </Text>

              <Text style={[styles.subtitle, { color: isDark ? '#B0B8A6' : '#6E7465' }]}>
                {poseName ? `"${poseName}"` : 'This pose'} is designed for 2 people! Are you posing with your partner today?
              </Text>

              <View style={styles.buttonStack}>
                <SPButton
                  label="Yes, we're a couple! 💕"
                  variant="primary"
                  size="lg"
                  onPress={onConfirmCouple}
                  accessibilityLabel="Confirm posing as a couple"
                />

                <SPButton
                  label="No, I'm single 😅"
                  variant="secondary"
                  size="lg"
                  onPress={() => setMode('roast')}
                  accessibilityLabel="Indicate single status"
                />
              </View>
            </View>
          ) : (
            /* ── State 2: Funny Single Roast Card ──────────────────────── */
            <View style={styles.contentContainer}>
              <View style={styles.roastBadgeHeader}>
                <SPIcon name="flame" size={14} color="#FF5252" />
                <Text style={styles.roastBadgeText}>SINGLE AWARENESS ROAST 🔥</Text>
              </View>

              <View style={[styles.quoteCard, { backgroundColor: isDark ? '#252920' : '#F6F3EC' }]}>
                <Text style={{ fontSize: 32, textAlign: 'center', marginBottom: 6 }}>🤣</Text>
                <Text style={[styles.quoteText, { color: isDark ? '#FFF' : '#222' }]}>
                  "{currentRoast}"
                </Text>
              </View>

              <View style={styles.buttonStack}>
                <SPButton
                  label="Show Me Solo Poses 👤"
                  variant="primary"
                  size="lg"
                  onPress={onSelectSoloPoses}
                  accessibilityLabel="Switch to solo poses"
                />

                <SPButton
                  label="I'm practicing for the future! 🚀"
                  variant="secondary"
                  size="md"
                  onPress={onProceedAnyway}
                  accessibilityLabel="Proceed to couple pose anyway"
                />
              </View>
            </View>
          )}
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    padding: Spacing.lg,
    borderWidth: 1.5,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  contentContainer: {
    alignItems: 'center',
  },
  emojiBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(183, 255, 0, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  buttonStack: {
    width: '100%',
    gap: 10,
    marginTop: 6,
  },
  roastBadgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  roastBadgeText: {
    color: '#FF5252',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  quoteCard: {
    width: '100%',
    padding: 16,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.3)',
    marginBottom: Spacing.md,
  },
  quoteText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },
});
