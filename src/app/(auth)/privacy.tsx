/**
 * PrivacyScreen — POSEHANUM Privacy Policy
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

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + Spacing.sm }]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <SPIcon name="back" size={20} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last Updated: August 2026</Text>

        <Text style={styles.sectionHeading}>1. Zero Biometric Upload Guarantee</Text>
        <Text style={styles.paragraph}>
          POSEHANUM strictly performs all real-time skeletal detection and pose similarity calculations locally on your device. Camera video frames, facial landmarks, and 33-point body vectors are never transmitted to our servers or third-party cloud AI vendors.
        </Text>

        <Text style={styles.sectionHeading}>2. Photo Storage & Device Library</Text>
        <Text style={styles.paragraph}>
          Photos captured using POSEHANUM are saved directly to your device's native photo library. We do not store, copy, or retain private photos on cloud servers unless you explicitly choose to publish a reference template.
        </Text>

        <Text style={styles.sectionHeading}>3. Personal Data Export & Account Deletion</Text>
        <Text style={styles.paragraph}>
          In accordance with GDPR and CCPA, you have full ownership of your data. You may download a complete JSON export bundle of your history and preferences, or permanently delete your account and all data at any time via the Profile screen.
        </Text>

        <Text style={styles.sectionHeading}>4. Analytics & Diagnostics</Text>
        <Text style={styles.paragraph}>
          We collect anonymized interaction counts and crash stack traces to improve app performance. You can disable personalization learning and analytics collection at any time in App Settings.
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
