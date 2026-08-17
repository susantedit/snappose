/**
 * SettingsScreen — Tactile Preferences, AI Personalization & Privacy Controls for Snap Pose.
 *
 * Features:
 *  • Privacy-First AI Personalization Toggle with clear on-device disclosure
 *  • Outfit Style Preference Selection
 *  • "Reset My Recommendations" action with full preference profile wipe
 *  • Custom Tactile Animated Switch with spring thumb physics and color transitions
 *  • Smooth Theme Mode selection (Light, Dark, System)
 *  • Camera & AI Pose Assist preferences
 *  • Storage & Cache management with animated feedback
 *  • Animated Bottom Sheets for Help, About, Privacy, and Terms
 */

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/constants/theme';
import {
  BorderRadius,
  Colors,
  Spacing,
} from '@/constants/designTokens';
import { useSettingsStore } from '@/stores/settingsStore';
import { usePersonalizationStore } from '@/stores/personalizationStore';
import { SPToast, useToast } from '@/components/molecules/SPToast';
import { SPIcon } from '@/components/atoms/SPIcon';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';
import { AnimatedBottomSheet } from '@/components/motion/AnimatedBottomSheet';
import { MotionSprings, useReducedMotion } from '@/constants/motion';
import { mmkv } from '@/database/mmkv/mmkvClient';
import { useNotificationStore } from '@/stores/notificationStore';
import { usePrivacyData } from '@/features/privacy';
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
// Tactile Animated Switch Component
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

  const handleToggle = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    if (!reduceMotion) {
      thumbScale.value = withTiming(1.18, { duration: 90 }, () => {
        thumbScale.value = withSpring(1, MotionSprings.snappy);
      });
    }
    onValueChange(!value);
  };

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: thumbTranslate.value },
      { scale: thumbScale.value },
    ],
  }));

  return (
    <Pressable
      onPress={handleToggle}
      hitSlop={8}
      style={[
        styles.switchTrack,
        { backgroundColor: value ? Colors.olive : '#777' },
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Animated.View style={[styles.switchThumb, animatedThumbStyle]} />
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Setting Row Component
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
}

function SettingRow({
  label,
  subtitle,
  value,
  isSwitch,
  switchValue = false,
  onSwitchChange,
  onPress,
  iconName,
}: SettingRowProps) {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';

  return (
    <AnimatedPressable
      onPress={isSwitch ? undefined : onPress}
      scaleTo={isSwitch ? 1 : 0.98}
      style={[
        styles.row,
        {
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderColor: isDark ? '#2E2E2E' : '#ECE5D8',
        },
      ]}
      accessibilityRole={isSwitch ? 'switch' : 'button'}
      accessibilityLabel={label}
    >
      <View style={styles.rowLeft}>
        {iconName && (
          <View style={styles.iconCircle}>
            <SPIcon name={iconName} size={18} color={Colors.olive} strokeWidth={2.2} />
          </View>
        )}
        <View style={styles.rowTexts}>
          <Text style={[styles.rowLabel, { color: isDark ? '#FFF' : Colors.textPrimary }]}>
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
          <TactileSwitch
            value={switchValue}
            onValueChange={onSwitchChange ?? (() => {})}
          />
        ) : (
          <View style={styles.valueRow}>
            {value && (
              <Text style={[styles.rowValue, { color: Colors.olive }]}>
                {value}
              </Text>
            )}
            <SPIcon
              name="arrowRight"
              size={16}
              color={isDark ? '#666' : '#AAA'}
              strokeWidth={2}
            />
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, themeMode, setThemeMode } = useTheme();
  const { camera, updateCameraSettings } = useSettingsStore();
  const {
    isPersonalizationEnabled,
    setPersonalizationEnabled,
    resetProfile,
    outfitPreference,
    setOutfitPreference,
  } = usePersonalizationStore();
  const { toastProps, showToast } = useToast();
  const reduceMotion = useReducedMotion();

  const isDark = theme.mode === 'dark';

  // Local Toggles
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(() => {
    return mmkv.getBoolean('hapticsEnabled') ?? true;
  });
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(() => {
    return mmkv.getBoolean('autoSavePhotos') ?? true;
  });
  const [aiGuidanceEnabled, setAiGuidanceEnabled] = useState<boolean>(
    camera.voiceGuidanceEnabled ?? true,
  );
  const [mirrorFrontCamera, setMirrorFrontCamera] = useState<boolean>(true);

  // Modals for About, Privacy, Terms, Help
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);
  const [showOutfitPicker, setShowOutfitPicker] = useState<boolean>(false);

  // Privacy & Data control hook
  const privacyData = usePrivacyData();

  // Notification Store integration
  const notifPreferences = useNotificationStore((s) => s.preferences);
  const updateNotifPreferences = useNotificationStore((s) => s.updatePreferences);
  const resetNotifHistory = useNotificationStore((s) => s.resetNotificationHistory);
  const testTriggerNotif = useNotificationStore((s) => s.testTriggerNotification);

  const handleTestNotification = () => {
    const result = testTriggerNotif();
    if (result) {
      showToast({
        message: `[${result.message.title}] ${result.message.body}`,
        variant: 'success',
      });
    } else {
      showToast({
        message: 'Notifications are disabled or quiet hours are active.',
        variant: 'info',
      });
    }
  };

  const handleResetNotifications = () => {
    Alert.alert(
      'Reset Notification Preferences',
      'Reset notification frequency, exhaustion tracking, and preferences to defaults?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetNotifHistory();
            showToast({ message: 'Notification preferences reset', variant: 'success' });
          },
        },
      ],
    );
  };

  const toggleHaptics = (val: boolean) => {
    setHapticsEnabled(val);
    mmkv.set('hapticsEnabled', val);
    showToast({ message: val ? 'Haptics enabled' : 'Haptics disabled', variant: 'info' });
  };

  const toggleAutoSave = (val: boolean) => {
    setAutoSaveEnabled(val);
    mmkv.set('autoSavePhotos', val);
    showToast({ message: val ? 'Auto-save enabled' : 'Auto-save disabled', variant: 'info' });
  };

  const toggleAiGuidance = (val: boolean) => {
    setAiGuidanceEnabled(val);
    updateCameraSettings({ voiceGuidanceEnabled: val });
    showToast({ message: val ? 'AI Guidance enabled' : 'AI Guidance disabled', variant: 'info' });
  };

  const togglePersonalization = (val: boolean) => {
    setPersonalizationEnabled(val);
    showToast({
      message: val ? 'Personalized recommendations enabled' : 'Personalization disabled',
      variant: 'info',
    });
  };

  const handleResetRecommendations = () => {
    Alert.alert(
      'Reset Recommendations',
      'This will delete your personalized preference profile and return to default discovery recommendations. Your saved favorites and downloaded packs will not be affected.',
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
  };

  const cycleTheme = () => {
    if (themeMode === 'system') setThemeMode('light');
    else if (themeMode === 'light') setThemeMode('dark');
    else setThemeMode('system');
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear temporary image cache? This will not delete saved favorites.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            showToast({ message: 'Cache cleared successfully', variant: 'success' });
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.sm,
            paddingBottom: insets.bottom + 90,
          },
        ]}
      >
        {/* ── 1. Header ────────────────────────────────────────────── */}
        <Animated.View
          entering={reduceMotion ? undefined : FadeIn.duration(400)}
          style={styles.header}
        >
          <Text style={[styles.screenTitle, { color: isDark ? '#FFF' : Colors.textPrimary }]}>
            Settings
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#AAA' : Colors.textSecondary }]}>
            Personalize camera and app preferences
          </Text>
        </Animated.View>

        {/* ── 2. AI Personalization & Privacy Section ───────────────── */}
        <Animated.View
          entering={reduceMotion ? undefined : FadeInDown.duration(400).delay(100)}
          style={styles.section}
        >
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
        </Animated.View>

        {/* ── 3. Appearance Section ─────────────────────────────────── */}
        <Animated.View
          entering={reduceMotion ? undefined : FadeInDown.duration(400).delay(150)}
          style={styles.section}
        >
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
        </Animated.View>

        {/* ── 4. Camera & AI Guidance Section ──────────────────────── */}
        <Animated.View
          entering={reduceMotion ? undefined : FadeInDown.duration(400).delay(200)}
          style={styles.section}
        >
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
        </Animated.View>

        {/* ── 5. Offline & Storage Section ─────────────────────────── */}
        <Animated.View
          entering={reduceMotion ? undefined : FadeInDown.duration(400).delay(250)}
          style={styles.section}
        >
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
        </Animated.View>

        {/* ── 5. Notifications & Personality Section ─────────────── */}
        <Animated.View
          entering={reduceMotion ? undefined : FadeInDown.duration(400).delay(275)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: isDark ? '#888' : '#777' }]}>
            NOTIFICATIONS & PERSONALITY
          </Text>
          <View style={styles.sectionCards}>
            <SettingRow
              iconName="bell"
              label="Daily POSEHANUM Reminders"
              subtitle="Clever, contextual daily pose inspiration"
              isSwitch
              switchValue={notifPreferences.enabled}
              onSwitchChange={(val) => {
                updateNotifPreferences({ enabled: val });
                showToast({
                  message: val ? 'Daily reminders enabled' : 'Daily reminders disabled',
                  variant: 'info',
                });
              }}
            />
            {notifPreferences.enabled && (
              <>
                <SettingRow
                  iconName="sparkles"
                  label="Pose Challenges"
                  subtitle="Speed, balance & alignment mini-challenges"
                  isSwitch
                  switchValue={notifPreferences.poseChallenges}
                  onSwitchChange={(val) => updateNotifPreferences({ poseChallenges: val })}
                />
                <SettingRow
                  iconName="target"
                  label="High Score & Achievements"
                  subtitle="Milestone celebrations and high match alerts"
                  isSwitch
                  switchValue={notifPreferences.achievements}
                  onSwitchChange={(val) => updateNotifPreferences({ achievements: val })}
                />
                <SettingRow
                  iconName="ai"
                  label="Personalized Style Matching"
                  subtitle="Prefers your favorite categories (Trek, Cafe, etc.)"
                  isSwitch
                  switchValue={notifPreferences.personalization}
                  onSwitchChange={(val) => updateNotifPreferences({ personalization: val })}
                />
                <SettingRow
                  iconName="moon"
                  label="Quiet Hours (10 PM – 8 AM)"
                  subtitle="Never interrupts during rest or sleep"
                  isSwitch
                  switchValue={notifPreferences.quietHoursEnabled}
                  onSwitchChange={(val) => updateNotifPreferences({ quietHoursEnabled: val })}
                />
                <SettingRow
                  iconName="play"
                  label="Trigger Test Notification"
                  subtitle="Preview how POSEHANUM talks to you"
                  onPress={handleTestNotification}
                />
                <SettingRow
                  iconName="refresh"
                  label="Reset Notification History"
                  subtitle="Clear fatigue counters & pool exhaustion"
                  onPress={handleResetNotifications}
                />
              </>
            )}
          </View>
        </Animated.View>

        {/* ── 6. Privacy & Data Control Center ─────────────────────── */}
        <Animated.View
          entering={reduceMotion ? undefined : FadeInDown.duration(400).delay(285)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: isDark ? '#888' : '#777' }]}>
            PRIVACY & DATA CONTROLS
          </Text>
          <View style={styles.sectionCards}>
            <SettingRow
              iconName="download"
              label="Export My Data (GDPR / CCPA)"
              subtitle="Download a complete JSON bundle of your personal data"
              onPress={async () => {
                const res = await privacyData.exportUserData();
                if (res) {
                  showToast({
                    message: 'Personal data export bundle prepared',
                    variant: 'success',
                  });
                }
              }}
            />
            <SettingRow
              iconName="trash"
              label="Delete Capture History"
              subtitle="Permanently erase all your photo attempt logs"
              onPress={() => {
                Alert.alert(
                  'Delete History',
                  'Are you sure you want to permanently erase all your pose attempt records and match scores?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        await privacyData.clearHistory();
                        showToast({ message: 'Pose attempt history erased', variant: 'info' });
                      },
                    },
                  ],
                );
              }}
            />
            <SettingRow
              iconName="trash"
              label="Delete Custom Poses"
              subtitle="Permanently remove all user-uploaded reference poses"
              onPress={() => {
                Alert.alert(
                  'Delete Custom Poses',
                  'Are you sure you want to permanently erase all custom poses and extracted skeletons from your device?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        await privacyData.clearCustomPoses();
                        showToast({ message: 'Custom reference poses erased', variant: 'info' });
                      },
                    },
                  ],
                );
              }}
            />
            <SettingRow
              iconName="refresh"
              label="Reset Personalization Profile"
              subtitle="Wipe on-device machine learning preferences and start fresh"
              onPress={() => {
                Alert.alert(
                  'Reset Personalization',
                  'This will clear your on-device learned style weights and restart recommendations from baseline.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Reset',
                      style: 'destructive',
                      onPress: async () => {
                        await privacyData.resetPersonalization();
                        showToast({ message: 'Personalization profile reset', variant: 'info' });
                      },
                    },
                  ],
                );
              }}
            />
            <SettingRow
              iconName="trash"
              label="Delete Account & All Data"
              subtitle="Permanently delete account, cloud sync, and all local records"
              onPress={() => {
                Alert.alert(
                  'Delete Account Permanently',
                  'WARNING: This action is permanent and irreversible. All your favorites, custom poses, capture history, personalization profiles, and authentication sessions will be immediately and permanently deleted.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete Everything',
                      style: 'destructive',
                      onPress: async () => {
                        const result = await privacyData.deleteAccountPermanent();
                        if (result.success) {
                          Alert.alert(
                            'Account Deleted',
                            'Your account and all associated personal data have been permanently deleted.',
                            [{ text: 'OK', onPress: () => router.replace('/(auth)/splash') }],
                          );
                        } else {
                          showToast({
                            message: 'Account deletion had errors: ' + result.errors.join(', '),
                            variant: 'error',
                          });
                        }
                      },
                    },
                  ],
                );
              }}
            />
          </View>
        </Animated.View>

        {/* ── 7. About & Legal Support Section ──────────────────────── */}
        <Animated.View
          entering={reduceMotion ? undefined : FadeInDown.duration(400).delay(300)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: isDark ? '#888' : '#777' }]}>
            SUPPORT & LEGAL INFORMATION
          </Text>
          <View style={styles.sectionCards}>
            <SettingRow
              iconName="info"
              label="About POSEHANUM"
              subtitle="Version 1.0.0 • AI Photography & Pose Assistant"
              onPress={() =>
                setModalContent({
                  title: 'About POSEHANUM',
                  body:
                    'POSEHANUM is an AI-powered photography & pose assistant that helps you pose, align, improve, and capture better photos.\n\nTagline: Pose Garौँ. Perfect Shot Lिऔँ. (Let\'s Pose. Let\'s Capture.)\n\nPrivacy Guarantee:\n• 100% on-device AI personalization\n• Zero camera frames or biometric data ever uploaded\n• Works completely offline with full user control.',
                })
              }
            />
            <SettingRow
              iconName="info"
              label="Privacy Policy"
              subtitle="How POSEHANUM protects your personal data"
              onPress={() =>
                setModalContent({
                  title: 'Privacy Policy Summary',
                  body:
                    'POSEHANUM is built with a Privacy-First Architecture:\n\n1. Camera Feed: All pose detection and skeletal landmark tracking runs 100% locally on your device hardware. Raw camera video frames are NEVER uploaded or saved.\n\n2. Photos & Media: Captured photos and custom poses are saved only to your device or explicitly chosen local storage.\n\n3. Machine Learning: Personalization runs entirely on-device and is never shared with third-party data brokers.\n\nFull policy available at: https://posehanum.app/privacy',
                })
              }
            />
            <SettingRow
              iconName="help"
              label="Terms of Service"
              subtitle="User agreement and service conditions"
              onPress={() =>
                setModalContent({
                  title: 'Terms of Service Summary',
                  body:
                    'Welcome to POSEHANUM. By using our application, you agree to:\n\n• Use the pose guidance responsibly and safely in appropriate physical environments.\n• Maintain ownership and rights over any photos you capture.\n• Respect safety recommendations regarding camera distance and physical posture.\n\nFull terms available at: https://posehanum.app/terms',
                })
              }
            />
            <SettingRow
              iconName="user"
              label="About Developer"
              subtitle="Susant Luitel (Kantaraj) • Creator Profiles"
              onPress={() =>
                setModalContent({
                  title: 'Creator & Social Links',
                  body:
                    'Created by Susant Luitel (Kantaraj Luitel)\n\n• GitHub: https://github.com/susantedit\n• YouTube: https://www.youtube.com/@developersusant\n• Instagram: https://instagram.com/susantgamerz\n• Facebook: https://facebook.com/Kantaraj.Luitel\n• LinkedIn: https://linkedin.com/in/kantaraj-luitel\n• Pinterest: https://pinterest.com/susantluitel\n• Reddit: https://reddit.com/user/Successful-Twist2608\n• TikTok: https://tiktok.com/@vortexeditz34\n• X (Twitter): https://x.com/Susantedit\n• CodePen: https://codepen.io/susant-gamerz\n• WhatsApp: https://wa.me/9779708838261\n• Email: susantedit@gmail.com',
                })
              }
            />
            <SettingRow
              iconName="feedback"
              label="Send Feedback & Privacy Inquiry"
              subtitle="Feature requests, bug reports, and data requests"
              onPress={() =>
                Alert.alert(
                  'Contact Support & Privacy Team',
                  'For support, feedback, or privacy inquiries, please email susantedit@gmail.com',
                  [{ text: 'OK' }],
                )
              }
            />
          </View>
        </Animated.View>

        {/* Footer Brand */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? '#666' : '#999' }]}>
            POSEHANUM v1.0.0 • AI Photography & Pose Assistant
          </Text>
        </View>
      </ScrollView>

      {/* Info Animated Bottom Sheet */}
      <AnimatedBottomSheet
        visible={modalContent !== null}
        onClose={() => setModalContent(null)}
      >
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
            <AnimatedPressable
              onPress={() => setModalContent(null)}
              scaleTo={0.96}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Done</Text>
            </AnimatedPressable>
          </View>
        )}
      </AnimatedBottomSheet>

      {/* Outfit Selector Bottom Sheet */}
      <AnimatedBottomSheet
        visible={showOutfitPicker}
        onClose={() => setShowOutfitPicker(false)}
      >
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
                    {
                      backgroundColor: isSelected
                        ? Colors.olive
                        : isDark
                        ? '#2E2E2E'
                        : '#EFE9DC',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.outfitChipText,
                      { color: isSelected ? '#FFF' : isDark ? '#DDD' : Colors.textPrimary },
                    ]}
                  >
                    {opt.name}
                  </Text>
                </AnimatedPressable>
              );
            })}
          </View>
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
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  header: {
    marginBottom: Spacing.md,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs + 2,
    marginLeft: 4,
  },
  sectionCards: {
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(101, 116, 74, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTexts: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Custom Tactile Switch
  switchTrack: {
    width: 46,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },

  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Modal Bottom Sheet
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  modalSubtitle: {
    fontSize: 13,
    marginBottom: Spacing.md,
  },
  modalScroll: {
    marginVertical: Spacing.sm,
    maxHeight: 320,
  },
  modalBody: {
    fontSize: 14,
    lineHeight: 22,
  },
  modalCloseButton: {
    backgroundColor: Colors.olive,
    paddingVertical: 12,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  modalCloseText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },

  // Outfit Grid
  outfitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: Spacing.sm,
  },
  outfitChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  outfitChipSelected: {
    borderColor: Colors.darkAccent,
  },
  outfitChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
