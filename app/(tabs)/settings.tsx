/**
 * Settings Screen — all settings sections in single scrollable view.
 * Sections: General, Appearance, Camera, Downloads, Notifications, Privacy, Developer, About
 * [Req 23]
 */

import React, { useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useTheme, type ThemeMode } from '@/constants/theme';
import { useSettingsStore } from '@/stores/settingsStore';
import { SPText } from '@/components/atoms/SPText';
import { SPButton } from '@/components/atoms/SPButton';
import { SPDivider } from '@/components/atoms/SPDivider';
import { SPBadge } from '@/components/atoms/SPBadge';
import { SPDialog } from '@/components/organisms/SPDialog';
import { useToast, SPToast } from '@/components/molecules/SPToast';
import { Colors, Spacing, BorderRadius } from '@/constants/designTokens';
import { mmkv } from '@/database/mmkv/mmkvClient';
import { MMKV_KEYS } from '@/database/mmkv/keys';

export default function SettingsScreen() {
  const { theme, themeMode, setThemeMode } = useTheme();
  const settingsStore = useSettingsStore();
  const { toastProps, showToast } = useToast();

  // Dialog states
  const [deleteDownloadsDialog, setDeleteDownloadsDialog] = useState(false);
  const [resetOnboardingDialog, setResetOnboardingDialog] = useState(false);
  const [accountDeletionDialog, setAccountDeletionDialog] = useState(false);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleResetOnboarding = () => {
    mmkv.set(MMKV_KEYS.ONBOARDING_COMPLETED, false);
    setResetOnboardingDialog(false);
    showToast({ message: 'Onboarding reset. Restart the app to see it again.', variant: 'success' });
  };

  const handleDeleteAllDownloads = () => {
    // TODO: wire to actual download manager when implemented
    setDeleteDownloadsDialog(false);
    showToast({ message: 'All downloads deleted', variant: 'success' });
  };

  const handleRequestAccountDeletion = () => {
    // TODO: POST /feedback with type=account_deletion when backend is ready
    setAccountDeletionDialog(false);
    showToast({
      message: 'Account deletion request submitted',
      description: 'We will process your request within 30 days.',
      variant: 'info',
    });
  };

  const openURL = (url: string, label: string) => {
    Linking.openURL(url).catch(() => {
      showToast({ message: `Unable to open ${label}`, variant: 'error' });
    });
  };

  // ---------------------------------------------------------------------------
  // Section: General
  // ---------------------------------------------------------------------------

  function renderGeneralSection() {
    return (
      <View style={styles.section}>
        <SPText variant="heading3" style={styles.sectionTitle}>
          General
        </SPText>

        <SettingRow
          label="Language"
          value="English"
          onPress={() => showToast({ message: 'Multi-language coming soon', variant: 'info' })}
          accessibilityLabel="Language selector"
        />

        <SPDivider margin={Spacing.xs} />

        <SettingRow
          label="Reset Onboarding"
          subtitle="Show the intro screens again on next launch"
          onPress={() => setResetOnboardingDialog(true)}
          accessibilityLabel="Reset onboarding"
        />
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // Section: Appearance
  // ---------------------------------------------------------------------------

  function renderAppearanceSection() {
    return (
      <View style={styles.section}>
        <SPText variant="heading3" style={styles.sectionTitle}>
          Appearance
        </SPText>

        <View style={styles.themeRow}>
          <SPText variant="bodyMedium">Theme</SPText>
          <View style={styles.themeButtons}>
            <ThemeButton mode="light" active={themeMode === 'light'} onPress={() => setThemeMode('light')} />
            <ThemeButton mode="dark" active={themeMode === 'dark'} onPress={() => setThemeMode('dark')} />
            <ThemeButton mode="system" active={themeMode === 'system'} onPress={() => setThemeMode('system')} />
          </View>
        </View>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // Section: Camera
  // ---------------------------------------------------------------------------

  function renderCameraSection() {
    const { camera, updateCameraSettings } = settingsStore;

    return (
      <View style={styles.section}>
        <SPText variant="heading3" style={styles.sectionTitle}>
          Camera
        </SPText>

        {/* Grid type */}
        <View style={styles.pickerRow}>
          <SPText variant="bodyMedium">Grid</SPText>
          <View style={styles.chipRow}>
            <Chip
              label="None"
              active={camera.gridType === 'none'}
              onPress={() => updateCameraSettings({ gridType: 'none' })}
            />
            <Chip
              label="Thirds"
              active={camera.gridType === 'thirds'}
              onPress={() => updateCameraSettings({ gridType: 'thirds' })}
            />
            <Chip
              label="Golden"
              active={camera.gridType === 'golden'}
              onPress={() => updateCameraSettings({ gridType: 'golden' })}
            />
          </View>
        </View>

        <SPDivider margin={Spacing.xs} />

        {/* Flash mode */}
        <View style={styles.pickerRow}>
          <SPText variant="bodyMedium">Flash</SPText>
          <View style={styles.chipRow}>
            <Chip
              label="Auto"
              active={camera.flashMode === 'auto'}
              onPress={() => updateCameraSettings({ flashMode: 'auto' })}
            />
            <Chip
              label="On"
              active={camera.flashMode === 'on'}
              onPress={() => updateCameraSettings({ flashMode: 'on' })}
            />
            <Chip
              label="Off"
              active={camera.flashMode === 'off'}
              onPress={() => updateCameraSettings({ flashMode: 'off' })}
            />
          </View>
        </View>

        <SPDivider margin={Spacing.xs} />

        {/* Overlay opacity slider */}
        <View style={styles.sliderRow}>
          <SPText variant="bodyMedium">Overlay Opacity</SPText>
          <SPText variant="caption" color={theme.colors.textSecondary}>
            {camera.overlayOpacity}%
          </SPText>
        </View>
        <SliderControl
          value={camera.overlayOpacity}
          min={0}
          max={100}
          step={5}
          onChange={(val) => updateCameraSettings({ overlayOpacity: val })}
          accessibilityLabel="Overlay opacity slider"
        />

        <SPDivider margin={Spacing.xs} />

        {/* Auto-capture threshold slider (Req 17.6) */}
        <View style={styles.sliderRow}>
          <SPText variant="bodyMedium">Auto-Capture Threshold</SPText>
          <SPText variant="caption" color={theme.colors.textSecondary}>
            {camera.autoCaptureThreshold}%
          </SPText>
        </View>
        <SliderControl
          value={camera.autoCaptureThreshold}
          min={80}
          max={99}
          step={1}
          onChange={(val) => updateCameraSettings({ autoCaptureThreshold: val })}
          accessibilityLabel="Auto-capture threshold slider"
        />

        <SPDivider margin={Spacing.xs} />

        {/* Voice guidance toggle */}
        <ToggleRow
          label="Voice Guidance"
          value={camera.voiceGuidanceEnabled}
          onValueChange={(val) => updateCameraSettings({ voiceGuidanceEnabled: val })}
          accessibilityLabel="Voice guidance toggle"
        />

        <SPDivider margin={Spacing.xs} />

        {/* Smile detection toggle */}
        <ToggleRow
          label="Smile Detection"
          value={camera.smileDetectionEnabled}
          onValueChange={(val) => updateCameraSettings({ smileDetectionEnabled: val })}
          accessibilityLabel="Smile detection toggle"
        />
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // Section: Downloads
  // ---------------------------------------------------------------------------

  function renderDownloadsSection() {
    // TODO: get real storage data from download manager
    const storageUsedMB = 0;

    return (
      <View style={styles.section}>
        <SPText variant="heading3" style={styles.sectionTitle}>
          Downloads
        </SPText>

        <View style={styles.infoRow}>
          <SPText variant="body">Storage Used</SPText>
          <SPText variant="bodyMedium" color={theme.colors.textSecondary}>
            {storageUsedMB} MB
          </SPText>
        </View>

        <SPDivider margin={Spacing.xs} />

        <SPButton
          label="Delete All Downloads"
          variant="ghost"
          size="md"
          onPress={() => setDeleteDownloadsDialog(true)}
          accessibilityLabel="Delete all downloads"
          labelStyle={{ color: Colors.error }}
        />
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // Section: Notifications
  // ---------------------------------------------------------------------------

  function renderNotificationsSection() {
    const { notifications, updateNotifications } = settingsStore;

    return (
      <View style={styles.section}>
        <SPText variant="heading3" style={styles.sectionTitle}>
          Notifications
        </SPText>

        <ToggleRow
          label="Notifications"
          subtitle="Master toggle for all notifications"
          value={notifications.masterEnabled}
          onValueChange={(val) => updateNotifications({ masterEnabled: val })}
          accessibilityLabel="Master notification toggle"
        />

        {notifications.masterEnabled && (
          <>
            <SPDivider margin={Spacing.xs} />
            <ToggleRow
              label="Daily Pose Suggestion"
              value={notifications.dailyPose}
              onValueChange={(val) => updateNotifications({ dailyPose: val })}
              accessibilityLabel="Daily pose notification toggle"
            />

            <SPDivider margin={Spacing.xs} />
            <ToggleRow
              label="Download Complete"
              value={notifications.downloadComplete}
              onValueChange={(val) => updateNotifications({ downloadComplete: val })}
              accessibilityLabel="Download complete notification toggle"
            />

            <SPDivider margin={Spacing.xs} />
            <ToggleRow
              label="Capture Window Reset"
              value={notifications.windowReset}
              onValueChange={(val) => updateNotifications({ windowReset: val })}
              accessibilityLabel="Window reset notification toggle"
            />
          </>
        )}
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // Section: Privacy
  // ---------------------------------------------------------------------------

  function renderPrivacySection() {
    return (
      <View style={styles.section}>
        <SPText variant="heading3" style={styles.sectionTitle}>
          Privacy
        </SPText>

        <View style={styles.infoRow}>
          <SPText variant="body">Camera Permission</SPText>
          <SPBadge label="Granted" variant="success" />
        </View>

        <SPDivider margin={Spacing.xs} />

        <View style={styles.infoRow}>
          <SPText variant="body">Photos Permission</SPText>
          <SPBadge label="Granted" variant="success" />
        </View>

        <SPDivider margin={Spacing.xs} />

        <SettingRow
          label="Privacy Policy"
          onPress={() => openURL('https://snappose.app/privacy', 'Privacy Policy')}
          accessibilityLabel="Open privacy policy"
        />

        <SPDivider margin={Spacing.xs} />

        <SettingRow
          label="Terms & Conditions"
          onPress={() => openURL('https://snappose.app/terms', 'Terms & Conditions')}
          accessibilityLabel="Open terms and conditions"
        />

        <SPDivider margin={Spacing.xs} />

        <SPButton
          label="Request Account Deletion"
          variant="ghost"
          size="md"
          onPress={() => setAccountDeletionDialog(true)}
          accessibilityLabel="Request account deletion"
          labelStyle={{ color: Colors.error }}
        />
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // Section: Developer (Susant Luitel links)
  // ---------------------------------------------------------------------------

  function renderDeveloperSection() {
    const socials = [
      { label: 'GitHub', url: 'https://github.com/susantlr', icon: '💻' },
      { label: 'YouTube', url: 'https://youtube.com/@susantluitel', icon: '🎥' },
      { label: 'LinkedIn', url: 'https://linkedin.com/in/susantluitel', icon: '💼' },
      { label: 'Instagram', url: 'https://instagram.com/susantluitel', icon: '📷' },
      { label: 'Facebook', url: 'https://facebook.com/susantluitel', icon: '👤' },
      { label: 'Pinterest', url: 'https://pinterest.com/susantluitel', icon: '📌' },
      { label: 'TikTok', url: 'https://tiktok.com/@susantluitel', icon: '🎵' },
      { label: 'X (Twitter)', url: 'https://x.com/susantluitel', icon: '✖️' },
      { label: 'WhatsApp', url: 'https://wa.me/+9779841XXXXXX', icon: '💬' },
      { label: 'Email', url: 'mailto:susant@snappose.app', icon: '✉️' },
    ];

    return (
      <View style={styles.section}>
        <SPText variant="heading3" style={styles.sectionTitle}>
          Developer
        </SPText>

        <SPText variant="caption" color={theme.colors.textSecondary} style={{ marginBottom: Spacing.sm }}>
          Connect with Susant Luitel
        </SPText>

        {socials.map((social, idx) => (
          <React.Fragment key={social.label}>
            <SettingRow
              label={social.label}
              leftIcon={social.icon}
              onPress={() => openURL(social.url, social.label)}
              accessibilityLabel={`Open ${social.label}`}
            />
            {idx < socials.length - 1 && <SPDivider margin={Spacing.xs} />}
          </React.Fragment>
        ))}
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // Section: About
  // ---------------------------------------------------------------------------

  function renderAboutSection() {
    const appVersion = Constants.expoConfig?.version ?? '1.0.0';
    const buildNumber = (Constants.expoConfig?.android?.versionCode ?? 1).toString();

    return (
      <View style={styles.section}>
        <SPText variant="heading3" style={styles.sectionTitle}>
          About
        </SPText>

        <View style={styles.infoRow}>
          <SPText variant="body">App Version</SPText>
          <SPText variant="bodyMedium" color={theme.colors.textSecondary}>
            {appVersion}
          </SPText>
        </View>

        <SPDivider margin={Spacing.xs} />

        <View style={styles.infoRow}>
          <SPText variant="body">Build Number</SPText>
          <SPText variant="bodyMedium" color={theme.colors.textSecondary}>
            {buildNumber}
          </SPText>
        </View>

        <SPDivider margin={Spacing.xs} />

        <SPText variant="caption" color={theme.colors.textSecondary} style={{ textAlign: 'center', marginTop: Spacing.sm }}>
          © {new Date().getFullYear()} Snap Pose. All rights reserved.
        </SPText>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <SPText variant="heading1">Settings</SPText>
        </View>

        {renderGeneralSection()}
        {renderAppearanceSection()}
        {renderCameraSection()}
        {renderDownloadsSection()}
        {renderNotificationsSection()}
        {renderPrivacySection()}
        {renderDeveloperSection()}
        {renderAboutSection()}

        {/* Bottom padding */}
        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>

      {/* Dialogs */}
      <SPDialog
        visible={deleteDownloadsDialog}
        title="Delete All Downloads?"
        message="This will remove all downloaded pose packs. You can re-download them anytime."
        icon="🗑️"
        confirmAction={{
          label: 'Delete',
          onPress: handleDeleteAllDownloads,
          destructive: true,
          accessibilityLabel: 'Confirm delete all downloads',
        }}
        cancelAction={{
          label: 'Cancel',
          onPress: () => setDeleteDownloadsDialog(false),
          accessibilityLabel: 'Cancel delete',
        }}
      />

      <SPDialog
        visible={resetOnboardingDialog}
        title="Reset Onboarding?"
        message="The intro screens will show again the next time you launch the app."
        icon="🔄"
        confirmAction={{
          label: 'Reset',
          onPress: handleResetOnboarding,
          accessibilityLabel: 'Confirm reset onboarding',
        }}
        cancelAction={{
          label: 'Cancel',
          onPress: () => setResetOnboardingDialog(false),
          accessibilityLabel: 'Cancel reset',
        }}
      />

      <SPDialog
        visible={accountDeletionDialog}
        title="Request Account Deletion?"
        message="We will process your request within 30 days. All your data will be permanently deleted."
        icon="⚠️"
        confirmAction={{
          label: 'Submit Request',
          onPress: handleRequestAccountDeletion,
          destructive: true,
          accessibilityLabel: 'Confirm account deletion request',
        }}
        cancelAction={{
          label: 'Cancel',
          onPress: () => setAccountDeletionDialog(false),
          accessibilityLabel: 'Cancel deletion request',
        }}
      />

      <SPToast {...toastProps} />
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Helper Components
// ---------------------------------------------------------------------------

interface SettingRowProps {
  label: string;
  subtitle?: string;
  value?: string;
  leftIcon?: string;
  onPress: () => void;
  accessibilityLabel: string;
}

function SettingRow({ label, subtitle, value, leftIcon, onPress, accessibilityLabel }: SettingRowProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingRow,
        pressed && { opacity: 0.6 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {leftIcon && <Text style={styles.rowIcon}>{leftIcon}</Text>}
      <View style={styles.rowContent}>
        <SPText variant="body">{label}</SPText>
        {subtitle && (
          <SPText variant="caption" color={theme.colors.textSecondary} style={{ marginTop: 2 }}>
            {subtitle}
          </SPText>
        )}
      </View>
      {value && (
        <SPText variant="body" color={theme.colors.textSecondary}>
          {value}
        </SPText>
      )}
      <SPText variant="body" color={theme.colors.textSecondary}>
        ›
      </SPText>
    </Pressable>
  );
}

interface ToggleRowProps {
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
}

function ToggleRow({ label, subtitle, value, onValueChange, accessibilityLabel }: ToggleRowProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.toggleRow} accessible accessibilityLabel={accessibilityLabel} accessibilityRole="switch">
      <View style={styles.rowContent}>
        <SPText variant="body">{label}</SPText>
        {subtitle && (
          <SPText variant="caption" color={theme.colors.textSecondary} style={{ marginTop: 2 }}>
            {subtitle}
          </SPText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#ccc', true: Colors.olive }}
        thumbColor="#fff"
        accessibilityLabel={accessibilityLabel}
      />
    </View>
  );
}

interface ThemeButtonProps {
  mode: ThemeMode;
  active: boolean;
  onPress: () => void;
}

function ThemeButton({ mode, active, onPress }: ThemeButtonProps) {
  const { theme } = useTheme();
  const label = mode === 'light' ? '☀️' : mode === 'dark' ? '🌙' : '⚙️';
  const text = mode.charAt(0).toUpperCase() + mode.slice(1);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.themeButton,
        {
          backgroundColor: active ? Colors.olive : theme.colors.surface,
          borderColor: active ? Colors.olive : theme.colors.border,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${text} theme`}
      accessibilityState={{ selected: active }}
    >
      <Text style={styles.themeIcon}>{label}</Text>
      <SPText
        variant="caption"
        color={active ? Colors.textInverse : theme.colors.textPrimary}
        style={{ fontSize: 11 }}
      >
        {text}
      </SPText>
    </Pressable>
  );
}

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function Chip({ label, active, onPress }: ChipProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? Colors.olive : theme.colors.surface,
          borderColor: active ? Colors.olive : theme.colors.border,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
    >
      <SPText
        variant="caption"
        color={active ? Colors.textInverse : theme.colors.textPrimary}
      >
        {label}
      </SPText>
    </Pressable>
  );
}

interface SliderControlProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  accessibilityLabel: string;
}

function SliderControl({ value, min, max, step, onChange, accessibilityLabel }: SliderControlProps) {
  const { theme } = useTheme();
  const percent = ((value - min) / (max - min)) * 100;

  const decrease = () => {
    const next = Math.max(min, value - step);
    onChange(next);
  };

  const increase = () => {
    const next = Math.min(max, value + step);
    onChange(next);
  };

  return (
    <View
      style={styles.sliderContainer}
      accessible
      accessibilityLabel={`${accessibilityLabel}, current value ${value}`}
      accessibilityRole="adjustable"
      accessibilityValue={{ min, max, now: value }}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'increment') increase();
        else if (event.nativeEvent.actionName === 'decrement') decrease();
      }}
    >
      <View style={styles.sliderInnerRow}>
        {/* Minus button */}
        <Pressable
          onPress={decrease}
          style={[styles.sliderStepBtn, { borderColor: theme.colors.border }]}
          accessibilityLabel="Decrease"
          accessibilityRole="button"
        >
          <Text style={[styles.sliderStepText, { color: theme.colors.textPrimary }]}>−</Text>
        </Pressable>

        {/* Track */}
        <View style={styles.sliderTrackWrapper}>
          <View style={[styles.sliderTrack, { backgroundColor: theme.colors.border }]}>
            <View
              style={[
                styles.sliderActiveTrack,
                { width: `${percent}%`, backgroundColor: Colors.olive },
              ]}
            />
          </View>
        </View>

        {/* Plus button */}
        <Pressable
          onPress={increase}
          style={[styles.sliderStepBtn, { borderColor: theme.colors.border }]}
          accessibilityLabel="Increase"
          accessibilityRole="button"
        >
          <Text style={[styles.sliderStepText, { color: theme.colors.textPrimary }]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    paddingVertical: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingVertical: Spacing.xs,
  },
  rowIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  rowContent: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingVertical: Spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingVertical: Spacing.xs,
  },
  themeRow: {
    gap: Spacing.md,
  },
  themeButtons: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  themeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    gap: 4,
  },
  themeIcon: {
    fontSize: 18,
  },
  pickerRow: {
    gap: Spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  sliderContainer: {
    gap: Spacing.xs,
  },
  sliderInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sliderStepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderStepText: {
    fontSize: 20,
    fontWeight: '500',
  },
  sliderTrackWrapper: {
    flex: 1,
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderActiveTrack: {
    height: 6,
    borderRadius: 3,
  },
});
