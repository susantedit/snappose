/**
 * SPCookieConsentBanner — GDPR / Privacy Analytics & Cookie Consent Banner.
 *
 * Appears floating at the bottom of the screen when analytics consent is undecided.
 * Allows user to "Accept All" or "Essential Only" before PostHog or analytics tracking starts.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/constants/theme';
import { Colors, Spacing, BorderRadius } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';
import { postHogAnalytics } from '@/services/analytics/PostHogAnalyticsService';

export function SPCookieConsentBanner() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';

  const [visible, setVisible] = useState(() => {
    return postHogAnalytics.getConsentStatus() === 'UNDECIDED';
  });

  if (!visible) return null;

  const handleAccept = () => {
    postHogAnalytics.setConsent(true);
    setVisible(false);
  };

  const handleDecline = () => {
    postHogAnalytics.setConsent(false);
    setVisible(false);
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      exiting={FadeOutDown.duration(200)}
      style={[
        styles.container,
        {
          bottom: insets.bottom + 16,
          backgroundColor: isDark ? '#1C1F18' : '#FFFFFF',
          borderColor: isDark ? '#2D3326' : '#E6DFD3',
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <SPIcon name="shield" size={16} color={Colors.olive} />
        </View>
        <View style={styles.textWrap}>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1C1E1A' }]}>
            Privacy & Product Analytics
          </Text>
          <Text style={[styles.description, { color: isDark ? '#9EA495' : '#6E7465' }]}>
            We use privacy-friendly product analytics to understand app performance and optimize your pose coaching experience.
          </Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          onPress={handleDecline}
          style={[
            styles.btnDecline,
            {
              backgroundColor: isDark ? '#262A22' : '#F0EBE1',
              borderColor: isDark ? '#33382D' : '#E0D8CC',
            },
          ]}
        >
          <Text style={[styles.btnDeclineText, { color: isDark ? '#CCC' : '#555' }]}>
            Essential Only
          </Text>
        </Pressable>

        <Pressable onPress={handleAccept} style={styles.btnAccept}>
          <Text style={styles.btnAcceptText}>Accept All</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: BorderRadius.card,
    padding: Spacing.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 9999,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: Spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(101, 116, 74, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  description: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  btnDecline: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  btnDeclineText: {
    fontSize: 12,
    fontWeight: '500',
  },
  btnAccept: {
    backgroundColor: Colors.olive,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  btnAcceptText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
