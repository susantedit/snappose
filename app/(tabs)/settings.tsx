/**
 * SettingsScreen — Tactile Preferences, Profile Management & Auth for Snap Pose.
 *
 * Features:
 *  • Profile card — avatar initials, display name, email, provider badge
 *  • Edit Profile bottom sheet — editable display name
 *  • Sign Out with confirm dialog
 *  • Privacy-First AI Personalization Toggle
 *  • Outfit Style Preference Selection
 *  • Smooth Theme Mode selection (Light, Dark, System)
 *  • Camera & AI Pose Assist preferences
 *  • Storage & Cache management
 *  • Performance: removed staggered FadeInDown delays; useCallback for handlers
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/constants/theme';
import { BorderRadius, Colors, Spacing } from '@/constants/designTokens';
import { useSettingsStore } from '@/stores/settingsStore';
import { usePersonalizationStore } from '@/stores/personalizationStore';
import { useAuthStore } from '@/stores/authStore';
import { SPToast, useToast } from '@/components/molecules/SPToast';
import { SPIcon } from '@/components/atoms/SPIcon';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';
import { AnimatedBottomSheet } from '@/components/motion/AnimatedBottomSheet';
import { MotionSprings, useReducedMotion } from '@/constants/motion';
import { mmkv } from '@/database/mmkv/mmkvClient';
import { privacyDataService } from '@/features/privacy/infrastructure/PrivacyDataServiceImpl';
import type { OutfitCategory } from '@/features/personalization';

const HORIZONTAL_PADDING = Spacing.md;

const OUTFIT_OPTIONS: { id: OutfitCategory; name: string }[] = [
  { id: 'casual', name: 'Casual' },
  { id: 'streetwear', name: 'Streetwear' },
  { id: 'formal', name: 'Formal' },
  { id: 'summer', name: 'Summer' },
  { id: 'winter', name: 'Winter' },
  { id: 'sportswear', name: 'Sportswear' },
  { id: 'traditional', name: 'Traditional' },
];

// ---------------------------------------------------------------------------
// Tactile Animated Switch
// ---------------------------------------------------------------------------

interface TactileSwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
}

function TactileSwitch({ value, onValueChange }: TactileSwitchProps) {
  const reduceMotion = useReducedMotion();
  const thumbTranslate = useSharedValue(value ? 20 : 2);
  const thumbScale = useSharedValue(1);

  useEffect(() => {
    if (!reduceMotion) {
      thumbTranslate.value = withSpring(value ? 20 : 2, MotionSprings.snappy);
    } else {
      thumbTranslate.value = value ? 20 : 2;
    }
  }, [value, reduceMotion, thumbTranslate]);

  const handleToggle = useCallback(() => {
    if (Platform.OS !== 'web') {
      try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    }
    if (!reduceMotion) {
      thumbScale.value = withTiming(1.18, { duration: 90 }, () => {
        thumbScale.value = withSpring(1, MotionSprings.snappy);
      });
    }
    onValueChange(!value);
  }, [value, reduceMotion, onValueChange, thumbScale]);

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbTranslate.value }, { scale: thumbScale.value }],
  }));

  return (
    <Pressable
      onPress={handleToggle}
      hitSlop={8}
      style={[styles.switchTrack, { backgroundColor: value ? Colors.olive : '#777' }]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Animated.View style={[styles.switchThumb, animatedThumbStyle]} />
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Setting Row
// ---------------------------------------------------------------------------

interface SettingRowProps {
  label: string;
  subtitle?: string;
  value?: string;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
  onPress?: () => void;
  iconName?: string;
  danger?: boolean;
}

function SettingRow({
  label, subtitle, value, isSwitch, switchValue = false,
  onSwitchChange, onPress, iconName, danger,
}: SettingRowProps) {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';

  return (
    <AnimatedPressable
      onPress={isSwitch ? undefined : onPress}
      scaleTo={isSwitch ? 1 : 0.98}
      style={[styles.row, {
        backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
        borderColor: isDark ? '#2E2E2E' : '#ECE5D8',
      }]}
      accessibilityRole={isSwitch ? 'switch' : 'button'}
      accessibilityLabel={label}
    >
      <View style={styles.rowLeft}>
        {iconName && (
          <View style={[
            styles.iconCircle,
            danger && { backgroundColor: 'rgba(200,40,40,0.1)' },
          ]}>
            <SPIcon
              name={iconName}
              size={18}
              color={danger ? '#C82828' : Colors.olive}
              strokeWidth={2.2}
            />
          </View>
        )}
        <View style={styles.rowTexts}>
          <Text style={[
            styles.rowLabel,
            { color: danger ? '#C82828' : (isDark ? '#FFF' : Colors.textPrimary) },
          ]}>
            {label}
          </Text>
          {subtitle && (
            <Text style={[styles.rowSubtitle, { color: isDark ? '#888' : Colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.rowRight}>
        {isSwitch ? (
          <TactileSwitch value={switchValue} onValueChange={onSwitchChange ?? (() => {})} />
        ) : (
          <View style={styles.valueRow}>
            {value && <Text style={[styles.rowValue, { color: Colors.olive }]}>{value}</Text>}
            {!danger && (
              <SPIcon name="arrowRight" size={16} color={isDark ? '#666' : '#AAA'} strokeWidth={2} />
            )}
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
}

// ---------------------------------------------------------------------------
// Profile Card
// ---------------------------------------------------------------------------

function ProfileCard({ onEditPress }: { onEditPress: () => void }) {
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email
    ? user.email[0].toUpperCase()
    : 'G';

  const providerLabel =
    user?.provider === 'google' ? '● Google' :
    user?.provider === 'email' ? '● Email' : '● Guest';

  const providerColor =
    user?.provider === 'google' ? '#4285F4' :
    user?.provider === 'email' ? Colors.olive : '#AAA';

  return (
    <Animated.View
      entering={FadeIn.duration(350)}
      style={[styles.profileCard, {
        backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
        borderColor: isDark ? '#2E2E2E' : '#ECE5D8',
      }]}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: Colors.olive }]}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      {/* Info */}
      <View style={styles.profileInfo}>
        <Text style={[styles.profileName, { color: isDark ? '#FFF' : Colors.textPrimary }]} numberOfLines={1}>
          {user?.displayName || 'Guest Photographer'}
        </Text>
        {user?.email ? (
          <Text style={[styles.profileEmail, { color: isDark ? '#888' : Colors.textSecondary }]} numberOfLines={1}>
            {user.email}
          </Text>
        ) : null}
        <Text style={[styles.providerBadge, { color: providerColor }]}>{providerLabel}</Text>
      </View>

      {/* Edit button */}
      <AnimatedPressable
        onPress={onEditPress}
        scaleTo={0.92}
        style={styles.editButton}
        accessibilityRole="button"
        accessibilityLabel="Edit profile"
      >
        <SPIcon name="edit" size={16} color={Colors.olive} strokeWidth={2.2} />
      </AnimatedPressable>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, themeMode, setThemeMode } = useTheme();
  const { camera, updateCameraSettings } = useSettingsStore();
  const {
    isPersonalizationEnabled, setPersonalizationEnabled,
    resetProfile, outfitPreference, setOutfitPreference,
  } = usePersonalizationStore();
  const { user, signOut, updateProfile, isLoading: authLoading } = useAuthStore();
  const { toastProps, showToast } = useToast();
  const reduceMotion = useReducedMotion();
  const isDark = theme.mode === 'dark';

  // Local Toggles
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(() => mmkv.getBoolean('hapticsEnabled') ?? true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(() => mmkv.getBoolean('autoSavePhotos') ?? true);
  const [aiGuidanceEnabled, setAiGuidanceEnabled] = useState<boolean>(camera.voiceGuidanceEnabled ?? true);
  const [mirrorFrontCamera, setMirrorFrontCamera] = useState<boolean>(true);

  // Modals
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);
  const [showOutfitPicker, setShowOutfitPicker] = useState<boolean>(false);
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>('');

  const toggleHaptics = useCallback((val: boolean) => {
    setHapticsEnabled(val);
    mmkv.set('hapticsEnabled', val);
    showToast({ message: val ? 'Haptics enabled' : 'Haptics disabled', variant: 'info' });
  }, [showToast]);

  const toggleAutoSave = useCallback((val: boolean) => {
    setAutoSaveEnabled(val);
    mmkv.set('autoSavePhotos', val);
    showToast({ message: val ? 'Auto-save enabled' : 'Auto-save disabled', variant: 'info' });
  }, [showToast]);

  const toggleAiGuidance = useCallback((val: boolean) => {
    setAiGuidanceEnabled(val);
    updateCameraSettings({ voiceGuidanceEnabled: val });
    showToast({ message: val ? 'AI Guidance enabled' : 'AI Guidance disabled', variant: 'info' });
  }, [updateCameraSettings, showToast]);

  const togglePersonalization = useCallback((val: boolean) => {
    setPersonalizationEnabled(val);
    showToast({
      message: val ? 'Personalized recommendations enabled' : 'Personalization disabled',
      variant: 'info',
    });
  }, [setPersonalizationEnabled, showToast]);

  const handleResetRecommendations = useCallback(() => {
    Alert.alert(
      'Reset Recommendations',
      'This will delete your personalized preference profile and return to default discovery recommendations.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetProfile();
            showToast({ message: 'Recommendation history reset', variant: 'success' });
          },
        },
      ],
    );
  }, [resetProfile, showToast]);

  const cycleTheme = useCallback(() => {
    if (themeMode === 'system') setThemeMode('light');
    else if (themeMode === 'light') setThemeMode('dark');
    else setThemeMode('system');
  }, [themeMode, setThemeMode]);

  const handleClearCache = useCallback(() => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear temporary image cache? This will not delete saved favorites.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => showToast({ message: 'Cache cleared successfully', variant: 'success' }),
        },
      ],
    );
  }, [showToast]);

  const handleSignOut = useCallback(() => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/onboarding');
          },
        },
      ],
    );
  }, [signOut]);

  const handleExportData = useCallback(async () => {
    try {
      showToast({ message: 'Compiling your personal data bundle...', variant: 'info' });
      const bundle = await privacyDataService.exportUserData();
      const jsonStr = JSON.stringify(bundle, null, 2);
      await Share.share({
        title: 'Snap Pose - Personal Data Export',
        message: `Snap Pose User Data Export (GDPR compliant):\n\n${jsonStr}`,
      });
      showToast({ message: 'Data export ready to share/save!', variant: 'success' });
    } catch (e: any) {
      showToast({ message: 'Data export failed', variant: 'error' });
    }
  }, [showToast]);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Delete All Data & Account',
      'This will permanently delete all your saved favorites, offline packs, custom poses, on-device AI recommendation signals, and sign you out. This action is irreversible (GDPR Right to Erasure).',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              showToast({ message: 'Purging all personal data...', variant: 'info' });
              await privacyDataService.deleteAccountPermanent();
              showToast({ message: 'All personal data has been erased.', variant: 'success' });
              router.replace('/(auth)/onboarding');
            } catch (e: any) {
              showToast({ message: 'Error deleting data', variant: 'error' });
            }
          },
        },
      ],
    );
  }, [showToast]);

  const openEditProfile = useCallback(() => {
    setEditedName(user?.displayName || '');
    setShowEditProfile(true);
  }, [user?.displayName]);

  const handleSaveProfile = useCallback(async () => {
    const trimmed = editedName.trim();
    if (!trimmed) {
      showToast({ message: 'Name cannot be empty', variant: 'error' });
      return;
    }
    await updateProfile(trimmed);
    setShowEditProfile(false);
    showToast({ message: 'Profile updated!', variant: 'success' });
  }, [editedName, updateProfile, showToast]);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + Spacing.sm, paddingBottom: insets.bottom + 90 },
        ]}
        removeClippedSubviews
      >
        {/* ── Header ────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={[styles.screenTitle, { color: isDark ? '#FFF' : Colors.textPrimary }]}>
            Settings
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#AAA' : Colors.textSecondary }]}>
            Personalize camera and app preferences
          </Text>
        </View>

        {/* ── Profile Card ───────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#888' : '#777' }]}>
            MY PROFILE
          </Text>
          <ProfileCard onEditPress={openEditProfile} />
        </View>

        {/* ── AI Personalization & Privacy ───────────────────────── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#888' : '#777' }]}>
            AI PERSONALIZATION & PRIVACY
          </Text>
          <View style={styles.sectionCards}>
            <SettingRow
              iconName="ai"
              label="Personalized Recommendations"
              subtitle="Learns preferred poses & styles 100% on-device"
              isSwitch
              switchValue={isPersonalizationEnabled}
              onSwitchChange={togglePersonalization}
            />
            <SettingRow
              iconName="sparkles"
              label="Outfit Style Preference"
              subtitle="Tailors poses for your active outfit"
              value={outfitPreference ? outfitPreference.toUpperCase() : 'Not Set'}
              onPress={() => setShowOutfitPicker(true)}
            />
            <SettingRow
              iconName="refresh"
              label="Reset My Recommendations"
              subtitle="Wipe behavioral history and start fresh"
              onPress={handleResetRecommendations}
            />
          </View>
        </View>

        {/* ── Appearance ─────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#888' : '#777' }]}>
            APPEARANCE & THEME
          </Text>
          <View style={styles.sectionCards}>
            <SettingRow
              iconName="theme"
              label="App Theme"
              subtitle="Switch between light and dark palette"
              value={themeMode === 'system' ? 'System' : themeMode === 'dark' ? 'Dark' : 'Light'}
              onPress={cycleTheme}
            />
          </View>
        </View>

        {/* ── Camera & AI Guidance ───────────────────────────────── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#888' : '#777' }]}>
            CAMERA & POSE ASSIST
          </Text>
          <View style={styles.sectionCards}>
            <SettingRow
              iconName="ai"
              label="Real-time AI Guidance"
              subtitle="Live pose alignment score & prompts"
              isSwitch
              switchValue={aiGuidanceEnabled}
              onSwitchChange={toggleAiGuidance}
            />
            <SettingRow
              iconName="mirror"
              label="Mirror Front Camera"
              subtitle="Flip front selfie overlay orientation"
              isSwitch
              switchValue={mirrorFrontCamera}
              onSwitchChange={setMirrorFrontCamera}
            />
            <SettingRow
              iconName="haptics"
              label="Tactile Haptic Feedback"
              subtitle="Vibrations on camera snap and alignment"
              isSwitch
              switchValue={hapticsEnabled}
              onSwitchChange={toggleHaptics}
            />
            <SettingRow
              iconName="save"
              label="Auto-Save to Camera Roll"
              subtitle="Save photos automatically on capture"
              isSwitch
              switchValue={autoSaveEnabled}
              onSwitchChange={toggleAutoSave}
            />
          </View>
        </View>

        {/* ── Offline & Storage ──────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#888' : '#777' }]}>
            OFFLINE STORAGE & CACHE
          </Text>
          <View style={styles.sectionCards}>
            <SettingRow
              iconName="download"
              label="Downloaded Pose Packs"
              subtitle="Manage offline packs for zero-data use"
              onPress={() => router.push('/downloads')}
            />
            <SettingRow
              iconName="trash"
              label="Clear Image Cache"
              subtitle="Free up temporary thumbnail storage"
              onPress={handleClearCache}
            />
          </View>
        </View>

        {/* ── Support ────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#888' : '#777' }]}>
            SUPPORT & INFORMATION
          </Text>
          <View style={styles.sectionCards}>
            <SettingRow
              iconName="info"
              label="About Snap Pose"
              subtitle="Version 1.0.0 • On-Device AI Photography"
              onPress={() => setModalContent({
                title: 'About Snap Pose',
                body: 'Snap Pose is an Apple-grade, on-device AI photography assistant designed to help you capture stunning, natural poses effortlessly.\n\nPrivacy Guarantee:\n• 100% on-device AI personalization\n• Zero camera frames or biometric data ever uploaded\n• Works completely offline with full user control.',
              })}
            />
            <SettingRow
              iconName="help"
              label="Help & FAQ"
              subtitle="Frequently asked questions & tips"
              onPress={() => setModalContent({
                title: 'Help & FAQ',
                body: 'Q: How does Pose Personalization work?\nA: The app learns which styles, camera angles, and categories you enjoy most and tailors the home recommendations. All machine learning runs strictly on your phone.\n\nQ: Does it upload my photos?\nA: Never. All camera feeds and captured photos remain strictly on your device.',
              })}
            />
            <SettingRow
              iconName="feedback"
              label="Send Feedback"
              subtitle="Feature requests and bug reports"
              onPress={() => Alert.alert('Send Feedback', 'We would love to hear from you! Please email support@snappose.app', [{ text: 'OK' }])}
            />
          </View>
        </View>

        {/* ── Legal & Data Privacy (GDPR / CCPA) ───────────────── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#888' : '#777' }]}>
            LEGAL & DATA PRIVACY (GDPR)
          </Text>
          <View style={styles.sectionCards}>
            <SettingRow
              iconName="download"
              label="Export All My Data"
              subtitle="Download a JSON copy of all on-device data"
              onPress={handleExportData}
            />
            <SettingRow
              iconName="privacy"
              label="Privacy Policy"
              subtitle="How we protect your biometric & camera privacy"
              onPress={() => setModalContent({
                title: 'Privacy Policy',
                body: 'Privacy Policy for Snap Pose:\n\n1. Zero Biometric Upload: Camera frames and skeletal landmark detections are computed strictly on-device in real-time. No images, landmarks, or camera streams are transmitted to any remote servers.\n\n2. Personalization Signals: Pose preferences and styling tags are stored locally via on-device storage (MMKV) and never sold or shared with third parties.\n\n3. Photo Library: Photos captured with Snap Pose are saved directly to your local device gallery. We do not maintain any cloud copies of your captures.\n\n4. Your Rights (GDPR & CCPA): You have the full right to export all stored data, or permanently purge all app data at any time via Settings.',
              })}
            />
            <SettingRow
              iconName="terms"
              label="Terms of Service"
              subtitle="App usage rules and license terms"
              onPress={() => setModalContent({
                title: 'Terms of Service',
                body: 'Snap Pose Terms of Service:\n\n1. License: Snap Pose grants you a personal, non-exclusive license to use the app for photography guidance and creative posing.\n\n2. User Content: All photos captured remain 100% your own intellectual property.\n\n3. Safety: Please ensure physical safety when attempting active or athletic poses in outdoor or public locations.\n\n4. Disclaimer: Snap Pose is provided on an "as-is" basis for photography composition assistance.',
              })}
            />
            <SettingRow
              iconName="trash"
              label="Delete All Data & Account"
              subtitle="Permanently erase all data (Right to Erasure)"
              onPress={handleDeleteAccount}
              danger
            />
          </View>
        </View>

        {/* ── Account / Sign Out ────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#888' : '#777' }]}>
            ACCOUNT
          </Text>
          <View style={styles.sectionCards}>
            <SettingRow
              iconName="logout"
              label="Sign Out"
              subtitle={user?.isAnonymous ? 'Currently browsing as guest' : `Signed in as ${user?.email || user?.displayName || 'user'}`}
              onPress={handleSignOut}
              danger
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? '#666' : '#999' }]}>
            Snap Pose v1.0.0 • Privacy-First AI Photography Assistant
          </Text>
        </View>
      </ScrollView>

      {/* ── Info Modal ──────────────────────────────────────────── */}
      <AnimatedBottomSheet visible={modalContent !== null} onClose={() => setModalContent(null)}>
        {modalContent && (
          <View>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : Colors.textPrimary }]}>
              {modalContent.title}
            </Text>
            <ScrollView style={styles.modalScroll}>
              <Text style={[styles.modalBody, { color: isDark ? '#CCC' : Colors.textSecondary }]}>
                {modalContent.body}
              </Text>
            </ScrollView>
            <AnimatedPressable onPress={() => setModalContent(null)} scaleTo={0.96} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Done</Text>
            </AnimatedPressable>
          </View>
        )}
      </AnimatedBottomSheet>

      {/* ── Outfit Selector ─────────────────────────────────────── */}
      <AnimatedBottomSheet visible={showOutfitPicker} onClose={() => setShowOutfitPicker(false)}>
        <View>
          <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : Colors.textPrimary }]}>
            Select Outfit Style
          </Text>
          <Text style={[styles.modalSubtitle, { color: isDark ? '#AAA' : Colors.textSecondary }]}>
            Tailor recommended poses to what you are wearing today.
          </Text>
          <View style={styles.outfitGrid}>
            {OUTFIT_OPTIONS.map((opt) => {
              const isSelected = outfitPreference === opt.id;
              return (
                <AnimatedPressable
                  key={opt.id}
                  onPress={() => {
                    setOutfitPreference(isSelected ? undefined : opt.id);
                    setShowOutfitPicker(false);
                    showToast({
                      message: isSelected ? 'Outfit style cleared' : `Outfit set to ${opt.name}`,
                      variant: 'success',
                    });
                  }}
                  scaleTo={0.94}
                  style={[
                    styles.outfitChip,
                    isSelected && styles.outfitChipSelected,
                    { backgroundColor: isSelected ? Colors.olive : isDark ? '#2E2E2E' : '#EFE9DC' },
                  ]}
                >
                  <Text style={[styles.outfitChipText, { color: isSelected ? '#FFF' : isDark ? '#DDD' : Colors.textPrimary }]}>
                    {opt.name}
                  </Text>
                </AnimatedPressable>
              );
            })}
          </View>
        </View>
      </AnimatedBottomSheet>

      {/* ── Edit Profile Sheet ──────────────────────────────────── */}
      <AnimatedBottomSheet visible={showEditProfile} onClose={() => setShowEditProfile(false)}>
        <View>
          <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : Colors.textPrimary }]}>
            Edit Profile
          </Text>
          <Text style={[styles.modalSubtitle, { color: isDark ? '#AAA' : Colors.textSecondary }]}>
            Update how your name appears in the app.
          </Text>

          <Text style={[styles.inputLabel, { color: isDark ? '#CCC' : Colors.textSecondary }]}>
            Display Name
          </Text>
          <TextInput
            style={[styles.profileInput, {
              backgroundColor: isDark ? '#1E1E1E' : '#F5F0E8',
              color: isDark ? '#FFF' : Colors.dark,
              borderColor: isDark ? '#333' : '#DDD',
            }]}
            value={editedName}
            onChangeText={setEditedName}
            placeholder="Your display name"
            placeholderTextColor={isDark ? '#666' : '#AAA'}
            autoCapitalize="words"
            maxLength={40}
            returnKeyType="done"
            onSubmitEditing={handleSaveProfile}
            autoFocus
          />

          {user?.email && (
            <View style={styles.emailInfoRow}>
              <SPIcon name="mail" size={14} color={isDark ? '#666' : '#AAA'} strokeWidth={2} />
              <Text style={[styles.emailInfoText, { color: isDark ? '#666' : '#AAA' }]}>
                {user.email}
              </Text>
            </View>
          )}

          <AnimatedPressable
            onPress={handleSaveProfile}
            scaleTo={0.97}
            style={[styles.modalCloseButton, { marginTop: Spacing.md }]}
          >
            {authLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.modalCloseText}>Save Changes</Text>
            )}
          </AnimatedPressable>

          <AnimatedPressable
            onPress={() => setShowEditProfile(false)}
            scaleTo={0.97}
            style={styles.cancelButton}
          >
            <Text style={[styles.cancelText, { color: isDark ? '#888' : Colors.textSecondary }]}>
              Cancel
            </Text>
          </AnimatedPressable>
        </View>
      </AnimatedBottomSheet>

      <SPToast {...toastProps} />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { paddingHorizontal: HORIZONTAL_PADDING },
  header: { marginBottom: Spacing.md },
  screenTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 },
  subtitle: { fontSize: 14, fontWeight: '500' },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: Spacing.xs + 2, marginLeft: 4 },
  sectionCards: { borderRadius: BorderRadius.card, overflow: 'hidden', borderWidth: 1, borderColor: 'transparent', gap: 1 },

  // Profile Card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontSize: 16, fontWeight: '700' },
  profileEmail: { fontSize: 13 },
  providerBadge: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(101, 116, 74, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Setting Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  iconCircle: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(101, 116, 74, 0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  rowTexts: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: '600' },
  rowSubtitle: { fontSize: 12, marginTop: 2 },
  rowRight: { flexDirection: 'row', alignItems: 'center' },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValue: { fontSize: 13, fontWeight: '700' },

  // Switch
  switchTrack: { width: 46, height: 28, borderRadius: 14, justifyContent: 'center' },
  switchThumb: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFFFFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 3, elevation: 3,
  },

  footer: { alignItems: 'center', paddingVertical: Spacing.lg },
  footerText: { fontSize: 12, fontWeight: '500' },

  // Modal
  modalTitle: { fontSize: 22, fontWeight: '800', marginBottom: Spacing.xs },
  modalSubtitle: { fontSize: 13, marginBottom: Spacing.md },
  modalScroll: { marginVertical: Spacing.sm, maxHeight: 320 },
  modalBody: { fontSize: 14, lineHeight: 22 },
  modalCloseButton: {
    backgroundColor: Colors.olive,
    paddingVertical: 13,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  modalCloseText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  cancelButton: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  cancelText: { fontSize: 14, fontWeight: '600' },

  // Outfit
  outfitGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: Spacing.sm },
  outfitChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, borderWidth: 1, borderColor: 'transparent' },
  outfitChipSelected: { borderColor: Colors.darkAccent },
  outfitChipText: { fontSize: 13, fontWeight: '700' },

  // Edit Profile
  inputLabel: { fontSize: 12, fontWeight: '600', letterSpacing: 0.4, marginBottom: 6 },
  profileInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 13,
    fontSize: 15,
    marginBottom: Spacing.sm,
  },
  emailInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  emailInfoText: { fontSize: 12 },
});
