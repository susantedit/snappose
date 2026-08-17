import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/constants/theme';
import { Spacing, Typography, BorderRadius, Colors } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';
import { DownloadManager } from '@/features/downloads/domain/DownloadManager';
import type { Download } from '@/features/downloads/types';

/**
 * Format bytes to readable KB/MB string
 */
function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function DownloadsScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const downloadManager = new DownloadManager();

  const loadDownloads = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const items = await downloadManager.getDownloadedPacks();
      setDownloads(items);
    } catch (err) {
      console.error('[DownloadsScreen] Failed to load downloaded packs:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDownloads();
  }, [loadDownloads]);

  const handleDelete = (poseId: string) => {
    Alert.alert(
      'Delete Download',
      'Are you sure you want to remove this offline pose pack from your device?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await downloadManager.deletePosePack(poseId);
              setDownloads((prev) => prev.filter((d) => d.poseId !== poseId));
            } catch (err) {
              console.error('[DownloadsScreen] Delete failed:', err);
            }
          },
        },
      ]
    );
  };

  const totalStorage = downloads.reduce((acc, curr) => acc + (curr.storageSize || 0), 0);

  if (isLoading) {
    return (
      <View
        style={[styles.centred, { backgroundColor: theme.colors.background }]}
        accessibilityLabel="Loading downloads"
      >
        <ActivityIndicator size="large" color={theme.colors.olive} />
        <Text style={[styles.stateText, { color: theme.colors.textSecondary }]}>
          Loading downloads…
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centred, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorTitle, { color: theme.colors.textPrimary }]}>
          Couldn't load downloads
        </Text>
        <Text style={[styles.stateText, { color: theme.colors.textSecondary }]}>
          There was a problem reading your offline downloads.
        </Text>
        <Pressable
          style={[styles.button, { backgroundColor: theme.colors.olive }]}
          accessibilityRole="button"
          onPress={loadDownloads}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top + Spacing.xs }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backLink}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
        >
          <View style={styles.backRow}>
            <SPIcon name="arrowLeft" size={18} color={theme.colors.olive} strokeWidth={2.4} />
            <Text style={[styles.backLinkText, { color: theme.colors.olive }]}>Back</Text>
          </View>
        </Pressable>
        <View style={styles.titleRow}>
          <Text style={[styles.screenTitle, { color: theme.colors.textPrimary }]} accessibilityRole="header">
            Downloads
          </Text>
          {downloads.length > 0 && (
            <Text style={[styles.storageBadge, { color: theme.colors.textSecondary }]}>
              {formatBytes(totalStorage)}
            </Text>
          )}
        </View>
      </View>

      {/* Content */}
      {downloads.length === 0 ? (
        <View style={styles.centred}>
          <View style={styles.emptyIconCircle}>
            <SPIcon name="download" size={44} color={Colors.olive} strokeWidth={2} />
          </View>
          <Text style={[styles.errorTitle, { color: theme.colors.textPrimary }]}>
            No downloaded packs
          </Text>
          <Text style={[styles.stateText, { color: theme.colors.textSecondary }]}>
            Download pose packs to use them fully offline, even without an internet connection.
          </Text>
          <Pressable
            style={[styles.button, { backgroundColor: theme.colors.olive }]}
            accessibilityRole="button"
            accessibilityLabel="Browse poses to download"
            onPress={() => router.push('/(tabs)/search')}
          >
            <Text style={styles.buttonText}>Browse Poses</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={downloads}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={[styles.packCard, { backgroundColor: theme.mode === 'dark' ? '#242424' : '#FFFFFF' }]}>
              <View style={styles.packInfo}>
                <Text style={[styles.packTitle, { color: theme.colors.textPrimary }]}>
                  Pose Pack #{item.poseId}
                </Text>
                <Text style={[styles.packMeta, { color: theme.colors.textSecondary }]}>
                  Size: {formatBytes(item.storageSize)} • Downloaded: {item.downloadedAt ? new Date(item.downloadedAt).toLocaleDateString() : 'Recently'}
                </Text>
              </View>
              <Pressable
                style={styles.deleteButton}
                accessibilityRole="button"
                accessibilityLabel="Delete downloaded pack"
                onPress={() => handleDelete(item.poseId)}
              >
                <SPIcon name="trash" size={16} color={Colors.error} strokeWidth={2} />
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  backLink: {
    marginBottom: Spacing.xs,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backLinkText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold as '600',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenTitle: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold as '700',
  },
  storageBadge: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.medium as '500',
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(101, 116, 74, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  errorTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.semibold as '600',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  stateText: {
    fontSize: Typography.sizes.body,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  button: {
    borderRadius: BorderRadius.button,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold as '600',
  },
  listContent: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  packCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  packInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  packTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold as '600',
    marginBottom: 2,
  },
  packMeta: {
    fontSize: Typography.sizes.small,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
});
