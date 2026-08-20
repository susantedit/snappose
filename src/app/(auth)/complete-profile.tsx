/**
 * CompleteProfileScreen — POSEHANUM
 *
 * Post-registration profile completion step:
 *  - Username (@handle)
 *  - Bio
 *  - Preferred photography styles / interests
 *  - Age gate / 13+ compliance declaration
 */

import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing, BorderRadius } from '@/constants/designTokens';
import { SPButton } from '@/components/atoms/SPButton';
import { SPIcon } from '@/components/atoms/SPIcon';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';
import { useAuthStore } from '@/stores/authStore';
import { useCreatorStore } from '@/stores/creatorStore';
import { usePersonalizationStore } from '@/stores/personalizationStore';

const PHOTO_STYLES = [
  { id: 'portrait', label: '📸 Portrait' },
  { id: 'street', label: '🌆 Street' },
  { id: 'fashion', label: '👗 Fashion' },
  { id: 'cafe', label: '☕ Cafe & Food' },
  { id: 'couple', label: '💑 Couples' },
  { id: 'nature', label: '🌿 Nature & Travel' },
  { id: 'cinematic', label: '🎬 Cinematic' },
  { id: 'fitness', label: '💪 Gym & Fitness' },
];

export default function CompleteProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { updateBio } = useCreatorStore();
  const { recordSignal } = usePersonalizationStore();

  const [username, setUsername] = useState(() =>
    user?.displayName ? user.displayName.toLowerCase().replace(/\s+/g, '_') : 'director'
  );
  const [bio, setBio] = useState('Passionate about composition and storytelling frames.');
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['portrait', 'street']);
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleStyle = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    if (!username.trim()) {
      setError('Please choose a username.');
      return;
    }
    if (!isAgeConfirmed) {
      setError('You must confirm you are at least 13 years of age.');
      return;
    }

    updateBio(bio.trim());

    // Record preference signals for personalized feed
    selectedStyles.forEach((catId) => {
      recordSignal({
        type: 'CATEGORY_OPENED',
        categoryId: catId,
      });
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.root, { paddingTop: insets.top + Spacing.sm }]}>
          <ScrollView
            contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
              <View style={styles.badgePill}>
                <Text style={styles.badgeText}>STEP 2 OF 2</Text>
              </View>
              <Text style={styles.title}>Complete your profile</Text>
              <Text style={styles.subtitle}>
                Set up your Director handle and tell us what you love shooting.
              </Text>
            </Animated.View>

            {/* Username Input */}
            <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.inputGroup}>
              <Text style={styles.label}>DIRECTOR USERNAME</Text>
              <View style={styles.usernameRow}>
                <Text style={styles.atSymbol}>@</Text>
                <TextInput
                  value={username}
                  onChangeText={(val) => {
                    setUsername(val.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                    setError(null);
                  }}
                  placeholder="your_handle"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  style={styles.usernameInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={30}
                />
              </View>
            </Animated.View>

            {/* Bio Input */}
            <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.inputGroup}>
              <Text style={styles.label}>BIO (OPTIONAL)</Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="What's your visual aesthetic?"
                placeholderTextColor="rgba(255,255,255,0.3)"
                style={[styles.input, styles.bioInput]}
                multiline
                numberOfLines={3}
                maxLength={160}
              />
            </Animated.View>

            {/* Photography Style Interests */}
            <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.inputGroup}>
              <Text style={styles.label}>SELECT YOUR FAVORITE STYLES</Text>
              <View style={styles.stylesGrid}>
                {PHOTO_STYLES.map((st) => {
                  const active = selectedStyles.includes(st.id);
                  return (
                    <AnimatedPressable
                      key={st.id}
                      onPress={() => toggleStyle(st.id)}
                      style={[
                        styles.styleChip,
                        active && styles.styleChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.styleChipText,
                          active && styles.styleChipTextActive,
                        ]}
                      >
                        {st.label}
                      </Text>
                    </AnimatedPressable>
                  );
                })}
              </View>
            </Animated.View>

            {/* Age Gate Checkbox */}
            <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.ageGateRow}>
              <Pressable
                onPress={() => setIsAgeConfirmed((c) => !c)}
                style={[
                  styles.checkbox,
                  isAgeConfirmed && styles.checkboxActive,
                ]}
              >
                {isAgeConfirmed && (
                  <SPIcon name="check" size={12} color="#000" strokeWidth={3} />
                )}
              </Pressable>
              <Text style={styles.ageGateText}>
                I confirm that I am at least 13 years of age and agree to community standards.
              </Text>
            </Animated.View>

            {error && (
              <Animated.View entering={FadeInDown} style={styles.errorBox}>
                <SPIcon name="warning" size={14} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </Animated.View>
            )}

            {/* Finish CTA */}
            <SPButton
              label="Enter POSEHANUM Studio →"
              variant="primary"
              size="lg"
              onPress={handleFinish}
              accessibilityLabel="Finish profile setup and enter POSEHANUM Studio"
              style={styles.finishBtn}
            />
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark,
    paddingHorizontal: Spacing.lg,
  },
  scroll: {
    flexGrow: 1,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  badgePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(183,255,0,0.15)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(183,255,0,0.3)',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.lime,
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    marginBottom: 8,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: Spacing.md,
  },
  atSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.lime,
    marginRight: 4,
  },
  usernameInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#FFF',
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: Spacing.md,
    color: '#FFF',
    fontSize: 14,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  stylesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  styleChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  styleChipActive: {
    backgroundColor: Colors.olive,
    borderColor: Colors.lime,
  },
  styleChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  styleChipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  ageGateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.xl,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.lime,
    borderColor: Colors.lime,
  },
  ageGateText: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 16,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(244,67,54,0.12)',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    flex: 1,
  },
  finishBtn: {
    borderRadius: 26,
    marginTop: Spacing.sm,
  },
});
