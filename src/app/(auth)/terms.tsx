/**
 * TermsScreen — POSEHANUM Terms of Service
 */

import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Colors, Spacing } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';

export default function TermsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + Spacing.sm }]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <SPIcon name="back" size={20} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last Updated: August 2026</Text>

        <Text style={styles.sectionHeading}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By downloading, installing, accessing, or using POSEHANUM ("the App"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the App.
        </Text>

        <Text style={styles.sectionHeading}>2. Nature of the Service</Text>
        <Text style={styles.paragraph}>
          POSEHANUM is an AI-powered photography composition platform. All real-time pose similarity scoring, skeletal tracking, and Director Mode cues run on-device. Photos captured are saved to your device library.
        </Text>

        <Text style={styles.sectionHeading}>3. Community Guidelines & Creator Content</Text>
        <Text style={styles.paragraph}>
          When creating, publishing, or remixing templates, you agree not to submit content that is unlawful, defamatory, obscene, harassing, hateful, or invasive of another's privacy. Non-consensual biometric manipulation, deepfakes, and identity misrepresentation are strictly prohibited.
        </Text>

        <Text style={styles.sectionHeading}>4. User Accounts & Security</Text>
        <Text style={styles.paragraph}>
          You are responsible for maintaining the confidentiality of your account credentials. You may permanently delete your account and all associated local and cloud data at any time in Profile Settings.
        </Text>

        <Text style={styles.sectionHeading}>5. Disclaimers & Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          POSEHANUM is provided "as is". We make no warranties regarding uninterrupted or error-free camera performance across all Android and iOS hardware configurations.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
  },
  scroll: {
    paddingTop: Spacing.md,
  },
  lastUpdated: {
    fontSize: 12,
    color: Colors.lime,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
    marginTop: Spacing.md,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: Spacing.sm,
  },
});
