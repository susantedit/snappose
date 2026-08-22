/**
 * SPOfflineBanner — Non-blocking notification banner for offline network state.
 *
 * Displays a subtle status bar when device has no internet connection.
 * Shows: "Offline — changes will sync when you're back online."
 * Never blocks touches or user interaction.
 *
 * [Part 6]
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPIcon } from '@/components/atoms/SPIcon';
import { Colors } from '@/constants/designTokens';
import { useNetworkState } from '@/hooks/useOnlineStatus';

export function SPOfflineBanner() {
  const insets = useSafeAreaInsets();
  const networkState = useNetworkState();

  if (networkState === 'ONLINE') {
    return null;
  }

  const isConnecting = networkState === 'CONNECTING';

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      exiting={FadeOutUp.duration(250)}
      style={[
        styles.banner,
        { paddingTop: Math.max(insets.top, 8) + 2 },
        isConnecting ? styles.connectingBanner : styles.offlineBanner,
      ]}
      pointerEvents="none"
    >
      <View style={styles.content}>
        <SPIcon
          name={isConnecting ? 'sparkles' : 'alert'}
          size={12}
          color={isConnecting ? '#0A0E0C' : '#FFFFFF'}
        />
        <Text style={[styles.text, isConnecting && styles.connectingText]}>
          {isConnecting
            ? 'Reconnecting to network...'
            : "Offline — changes will sync when you're back online."}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingBottom: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineBanner: {
    backgroundColor: 'rgba(30, 35, 27, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 138, 0, 0.3)',
  },
  connectingBanner: {
    backgroundColor: Colors.lime,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(183, 255, 0, 0.5)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    color: '#E0E5D8',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  connectingText: {
    color: '#0A0E0C',
    fontWeight: '700',
  },
});
