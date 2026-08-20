/**
 * SPReportModal — POSEHANUM
 *
 * User Content Moderation & Reporting Modal:
 *  - Categorized reporting reasons (Inappropriate content, Copyright violation, Harassment, Misleading pose, Other)
 *  - Optional details text input
 *  - Submits report to local moderation store & optional backend queue
 */

import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/constants/theme';
import { Colors, Spacing, BorderRadius } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';
import { SPButton } from '@/components/atoms/SPButton';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';

const REPORT_REASONS = [
  'Inappropriate or explicit content',
  'Copyright or intellectual property violation',
  'Dangerous or harmful physical pose',
  'Harassment or hate speech',
  'Misleading or poor quality metadata',
  'Other violation',
];

interface SPReportModalProps {
  visible: boolean;
  targetId: string;
  targetType: 'template' | 'creator' | 'comment';
  targetTitle?: string;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}

export function SPReportModal({
  visible,
  targetId: _targetId,
  targetType,
  targetTitle,
  onClose,
  onSubmit,
}: SPReportModalProps) {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';
  const insets = useSafeAreaInsets();

  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSubmit(selectedReason, details);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDetails('');
      onClose();
    }, 1500);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: isDark ? '#1F201B' : '#FFF',
              paddingBottom: insets.bottom + Spacing.lg,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              Report {targetType.charAt(0).toUpperCase() + targetType.slice(1)}
            </Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <SPIcon name="close" size={20} color={theme.colors.textPrimary} />
            </Pressable>
          </View>

          {submitted ? (
            <Animated.View entering={FadeInDown} style={styles.successState}>
              <SPIcon name="check" size={36} color={Colors.lime} />
              <Text style={[styles.successTitle, { color: theme.colors.textPrimary }]}>
                Report Submitted
              </Text>
              <Text style={[styles.successSub, { color: theme.colors.textSecondary }]}>
                Thank you for keeping the POSEHANUM community safe. Our moderation team will review this item promptly.
              </Text>
            </Animated.View>
          ) : (
            <View>
              {targetTitle && (
                <Text
                  style={[styles.itemRef, { color: theme.colors.textSecondary }]}
                  numberOfLines={1}
                >
                  Target: {targetTitle}
                </Text>
              )}

              <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
                SELECT A REASON
              </Text>

              {REPORT_REASONS.map((r) => {
                const active = selectedReason === r;
                return (
                  <AnimatedPressable
                    key={r}
                    onPress={() => setSelectedReason(r)}
                    style={[
                      styles.reasonRow,
                      {
                        backgroundColor: active
                          ? 'rgba(183,255,0,0.1)'
                          : 'transparent',
                        borderColor: active ? Colors.lime : isDark ? Colors.borderDark : Colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.radioDot,
                        active && { backgroundColor: Colors.lime, borderColor: Colors.lime },
                      ]}
                    />
                    <Text
                      style={[
                        styles.reasonText,
                        { color: active ? theme.colors.textPrimary : theme.colors.textSecondary },
                      ]}
                    >
                      {r}
                    </Text>
                  </AnimatedPressable>
                );
              })}

              <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary, marginTop: Spacing.sm }]}>
                ADDITIONAL DETAILS (OPTIONAL)
              </Text>
              <TextInput
                value={details}
                onChangeText={setDetails}
                placeholder="Provide any context to help our moderators..."
                placeholderTextColor={theme.colors.textSecondary}
                multiline
                numberOfLines={3}
                style={[
                  styles.detailsInput,
                  {
                    color: theme.colors.textPrimary,
                    borderColor: isDark ? Colors.borderDark : Colors.border,
                  },
                ]}
              />

              <SPButton
                label="Submit Report"
                variant="primary"
                size="lg"
                onPress={handleSubmit}
                accessibilityLabel="Submit content report"
                style={{ marginTop: Spacing.md }}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.card,
    borderTopRightRadius: BorderRadius.card,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: { fontSize: 17, fontWeight: '800' },
  closeBtn: { padding: 4 },
  itemRef: { fontSize: 12, marginBottom: Spacing.sm },
  sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8, marginBottom: 8 },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 6,
    gap: 10,
  },
  radioDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(128,128,128,0.5)',
  },
  reasonText: { fontSize: 13, fontWeight: '600', flex: 1 },
  detailsInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    fontSize: 13,
    height: 70,
    textAlignVertical: 'top',
  },
  successState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  successTitle: { fontSize: 18, fontWeight: '800', marginTop: 12, marginBottom: 6 },
  successSub: { fontSize: 13, textAlign: 'center', lineHeight: 18, paddingHorizontal: 20 },
});
