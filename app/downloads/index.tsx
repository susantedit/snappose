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
import { useTheme } from '@/constants/theme';
import { Spacing, Typography, BorderRadius, Colors } from '@/constants/designTokens';
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backLink}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
        >
          <Text style={[styles.backLinkText, { color: theme.colors.olive }]}>← Back</Text>
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
          <Text style={styles.emptyIcon}>📦</Text>
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
                  Size: {formatBytes(item.storageSize)} • Downloaded: {new Date(item.downloadedAt).toLocaleDateString()}
                </Text>
              </View>
              <Pressable
                style={styles.deleteButton}
                accessibilityRole="button"
                accessibilityLabel="Delete downloaded pack"
                onPress={() => handleDelete(item.poseId)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
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
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  screenTitle: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
  },
  storageBadge: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.medium,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: Spacing.sm,
  },
  stateText: {
    fontSize: Typography.sizes.body,
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 22,
    maxWidth: 300,
  },
  errorTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  button: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.button,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.textInverse,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
  },
  backLink: {
    paddingVertical: Spacing.xs,
    minHeight: 44,
    justifyContent: 'center',
  },
  backLinkText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
  },
  listContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
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
    elevation: 1,
  },
  packInfo: {
    flex: 1,
    gap: 4,
  },
  packTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
  },
  packMeta: {
    fontSize: Typography.sizes.caption,
  },
  deleteButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.medium,
  },
});
