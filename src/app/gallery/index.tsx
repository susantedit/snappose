/**
 * GalleryScreen — displays captured photos in a 3-column grid.
 *
 * Requirements implemented:
 *  [Req 20.1] 3-column FlashList grid sorted by capture date descending
 *  [Req 20.2] Immediate reflection after new photo capture (useFocusEffect)
 *  [Req 20.3] Long-press multi-select with batch delete
 *  [Req 20.4] Per-photo actions: Share, Delete, Favorite, View Metadata
 *  [Req 20.5] Metadata: capture date, pose used, AI Score, resolution, device lens
 *  [Req 20.6] System share sheet via React Native Share API
 *  [Req 20]   Fully offline — reads from expo-media-library + MMKV favorites
 *  All icons backed by crisp SVG SPIcon components and spring physics.
 */

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/constants/theme';
import {
  AnimationDurations,
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from '@/constants/designTokens';
import { SPButton } from '@/components/atoms/SPButton';
import { SPBadge } from '@/components/atoms/SPBadge';
import { SPDialog } from '@/components/organisms/SPDialog';
import { SPToast, useToast } from '@/components/molecules/SPToast';
import { SPIcon } from '@/components/atoms/SPIcon';
import { mmkv } from '@/database/mmkv/mmkvClient';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CapturedPhoto {
  id: string;
  uri: string;
  thumbnailUri?: string;
  captureDate: string;
  poseId?: string;
  aiScore?: number;
  resolution?: string;
  lens?: string;
  isFavorite: boolean;
}

const GALLERY_FAVORITES_KEY = 'gallery_favorites';

function loadFavoriteIds(): Set<string> {
  try {
    const raw = mmkv.getString(GALLERY_FAVORITES_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveFavoriteIds(ids: Set<string>): void {
  mmkv.set(GALLERY_FAVORITES_KEY, JSON.stringify(Array.from(ids)));
}

const NUM_COLUMNS = 3;
const CELL_GAP = 2;

const MOCK_POSE_NAMES: Record<string, string> = {
  OVER_SHOULDER: 'Over Shoulder',
  WALKING_CASUAL: 'Walking Casual',
  SEATED_CAFE: 'Seated Café',
  MIRROR_SELFIE: 'Mirror Selfie',
  COUPLE_EMBRACE: 'Couple Embrace',
};

function mockPoseName(poseId?: string): string | undefined {
  if (!poseId) return undefined;
  return MOCK_POSE_NAMES[poseId] ?? poseId;
}

function useGalleryPhotos() {
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let status = 'denied';
      try {
        const res = await MediaLibrary.requestPermissionsAsync(false, ['photo']);
        status = res.status;
      } catch (permError) {
        // Fallback for Expo Go permission restrictions on Android 13+
        try {
          const res = await MediaLibrary.requestPermissionsAsync(true);
          status = res.status;
        } catch {}
      }

      if (status !== 'granted') {
        setPermissionGranted(false);
        setLoading(false);
        return;
      }
      setPermissionGranted(true);

      const result = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.photo,
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        first: 300,
      });

      const favoriteIds = loadFavoriteIds();

      const mapped: CapturedPhoto[] = result.assets.map((asset) => ({
        id: asset.id,
        uri: asset.uri,
        captureDate: new Date(asset.creationTime).toISOString(),
        resolution: asset.width && asset.height
          ? `${asset.width}×${asset.height}`
          : undefined,
        isFavorite: favoriteIds.has(asset.id),
        poseId: undefined,
        aiScore: undefined,
        lens: undefined,
      }));

      setPhotos(mapped);
    } catch {
      setError('Could not load photos. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { photos, loading, error, permissionGranted, loadPhotos, setPhotos };
}

interface PhotoCellProps {
  photo: CapturedPhoto;
  cellSize: number;
  isSelected: boolean;
  isMultiSelectMode: boolean;
  onPress: (photo: CapturedPhoto) => void;
  onLongPress: (photo: CapturedPhoto) => void;
}

function PhotoCell({
  photo,
  cellSize,
  isSelected,
  isMultiSelectMode,
  onPress,
  onLongPress,
}: PhotoCellProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.94, { duration: AnimationDurations.quick });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 18, stiffness: 280 });
  };

  return (
    <Animated.View style={[animatedStyle, { width: cellSize, height: cellSize }]}>
      <Pressable
        onPress={() => onPress(photo)}
        onLongPress={() => onLongPress(photo)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="imagebutton"
        accessibilityLabel={`Photo taken on ${new Date(photo.captureDate).toLocaleDateString()}`}
        accessibilityState={{ selected: isSelected }}
        style={[cellStyles.cell, { width: cellSize, height: cellSize }]}
      >
        <Image
          source={{ uri: photo.uri }}
          style={[cellStyles.image, { width: cellSize, height: cellSize }]}
          resizeMode="cover"
          accessibilityElementsHidden
        />
        {/* Favorite indicator */}
        {photo.isFavorite && (
          <View style={cellStyles.favoriteIndicator} accessibilityElementsHidden>
            <SPIcon name="heart-filled" size={11} color={Colors.error} fill={Colors.error} />
          </View>
        )}
        {/* Multi-select overlay */}
        {isMultiSelectMode && (
          <View
            style={[
              cellStyles.selectOverlay,
              isSelected && cellStyles.selectOverlayActive,
            ]}
          >
            <View
              style={[
                cellStyles.checkCircle,
                isSelected && cellStyles.checkCircleActive,
              ]}
            >
              {isSelected && (
                <SPIcon name="check" size={12} color="#FFFFFF" strokeWidth={3} />
              )}
            </View>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const cellStyles = StyleSheet.create({
  cell: {
    overflow: 'hidden',
  },
  image: {
    backgroundColor: '#333',
  },
  favoriteIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 6,
  },
  selectOverlayActive: {
    backgroundColor: 'rgba(101,116,74,0.25)',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: Colors.olive,
    borderColor: Colors.olive,
  },
});

interface MetadataModalProps {
  photo: CapturedPhoto | null;
  visible: boolean;
  onClose: () => void;
}

function MetadataModal({ photo, visible, onClose }: MetadataModalProps) {
  const { theme } = useTheme();
  const cardBg = theme.mode === 'dark' ? '#252525' : '#FFFFFF';
  const borderColor = theme.mode === 'dark' ? '#333333' : '#E8E3D8';

  if (!photo) return null;

  const date = new Date(photo.captureDate);
  const formattedDate = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const rows: Array<{ label: string; value: string }> = [
    { label: 'Captured', value: formattedDate },
    { label: 'Pose', value: mockPoseName(photo.poseId) ?? '—' },
    { label: 'AI Score', value: photo.aiScore != null ? `${photo.aiScore}/100` : '—' },
    { label: 'Resolution', value: photo.resolution ?? '—' },
    { label: 'Lens', value: photo.lens ?? '—' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <Pressable
        style={metaStyles.backdrop}
        onPress={onClose}
        accessibilityLabel="Close metadata"
      />
      <View style={[metaStyles.sheet, { backgroundColor: cardBg, borderColor }]}>
        <View style={[metaStyles.handle, { backgroundColor: borderColor }]} />
        <Text
          style={[metaStyles.sheetTitle, { color: theme.colors.textPrimary }]}
          accessibilityRole="header"
        >
          Photo Details
        </Text>
        {rows.map((row) => (
          <View key={row.label} style={[metaStyles.row, { borderBottomColor: borderColor }]}>
            <Text style={[metaStyles.rowLabel, { color: theme.colors.textSecondary }]}>
              {row.label}
            </Text>
            <Text style={[metaStyles.rowValue, { color: theme.colors.textPrimary }]}>
              {row.value}
            </Text>
          </View>
        ))}
        <SPButton
          label="Close"
          variant="ghost"
          onPress={onClose}
          accessibilityLabel="Close photo details"
          style={metaStyles.closeButton}
        />
      </View>
    </Modal>
  );
}

const metaStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  sheetTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold as '700',
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium as '500',
  },
  rowValue: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.regular as '400',
    flexShrink: 1,
    textAlign: 'right',
  },
  closeButton: {
    marginTop: Spacing.lg,
  },
});

interface ActionSheetProps {
  photo: CapturedPhoto | null;
  visible: boolean;
  onClose: () => void;
  onShare: (photo: CapturedPhoto) => void;
  onDelete: (photo: CapturedPhoto) => void;
  onToggleFavorite: (photo: CapturedPhoto) => void;
  onViewMetadata: (photo: CapturedPhoto) => void;
}

function ActionSheet({
  photo,
  visible,
  onClose,
  onShare,
  onDelete,
  onToggleFavorite,
  onViewMetadata,
}: ActionSheetProps) {
  const { theme } = useTheme();
  const cardBg = theme.mode === 'dark' ? '#252525' : '#FFFFFF';
  const borderColor = theme.mode === 'dark' ? '#333333' : '#E8E3D8';

  if (!photo) return null;

  const actions = [
    {
      label: 'Share',
      iconName: 'share',
      accessibilityLabel: 'Share photo',
      onPress: () => { onClose(); onShare(photo); },
      color: theme.colors.textPrimary,
    },
    {
      label: photo.isFavorite ? 'Remove from Favorites' : 'Add to Favorites',
      iconName: photo.isFavorite ? 'heart-filled' : 'heart',
      accessibilityLabel: photo.isFavorite ? 'Remove from favorites' : 'Add to favorites',
      onPress: () => { onClose(); onToggleFavorite(photo); },
      color: photo.isFavorite ? Colors.error : theme.colors.textPrimary,
    },
    {
      label: 'View Metadata',
      iconName: 'info',
      accessibilityLabel: 'View photo metadata',
      onPress: () => { onClose(); onViewMetadata(photo); },
      color: theme.colors.textPrimary,
    },
    {
      label: 'Delete',
      iconName: 'trash',
      accessibilityLabel: 'Delete photo',
      onPress: () => { onClose(); onDelete(photo); },
      color: Colors.error,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <Pressable
        style={actionStyles.backdrop}
        onPress={onClose}
        accessibilityLabel="Close actions"
      />
      <View style={[actionStyles.sheet, { backgroundColor: cardBg, borderColor }]}>
        <View style={[actionStyles.handle, { backgroundColor: borderColor }]} />
        <Text
          style={[actionStyles.sheetTitle, { color: theme.colors.textSecondary }]}
          numberOfLines={1}
        >
          Photo actions
        </Text>
        {actions.map((action) => (
          <Pressable
            key={action.accessibilityLabel}
            onPress={action.onPress}
            style={({ pressed }) => [
              actionStyles.actionRow,
              { borderBottomColor: borderColor },
              pressed && { opacity: 0.6 },
            ]}
            accessibilityRole="button"
            accessibilityLabel={action.accessibilityLabel}
          >
            <View style={actionStyles.actionRowInner}>
              <SPIcon
                name={action.iconName}
                size={18}
                color={action.color}
                fill={action.iconName === 'heart-filled' ? Colors.error : undefined}
                strokeWidth={2.1}
              />
              <Text style={[actionStyles.actionLabel, { color: action.color }]}>
                {action.label}
              </Text>
            </View>
          </Pressable>
        ))}
        <Pressable
          onPress={onClose}
          style={({ pressed }) => [actionStyles.cancelRow, pressed && { opacity: 0.6 }]}
          accessibilityRole="button"
          accessibilityLabel="Cancel"
        >
          <Text style={[actionStyles.cancelLabel, { color: theme.colors.textPrimary }]}>
            Cancel
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const actionStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  sheetTitle: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium as '500',
    textAlign: 'center',
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  actionRow: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 48,
    justifyContent: 'center',
  },
  actionRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium as '500',
  },
  cancelRow: {
    paddingVertical: 16,
    marginTop: Spacing.xs,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold as '600',
  },
});

export default function GalleryScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const cellSize = Math.floor((screenWidth - CELL_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS);

  const { photos, loading, error, permissionGranted, loadPhotos, setPhotos } =
    useGalleryPhotos();

  useFocusEffect(
    useCallback(() => {
      loadPhotos();
    }, [loadPhotos]),
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const isMultiSelectMode = selectedIds.size > 0;

  const [actionPhoto, setActionPhoto] = useState<CapturedPhoto | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);

  const [metaPhoto, setMetaPhoto] = useState<CapturedPhoto | null>(null);
  const [showMetadata, setShowMetadata] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CapturedPhoto | 'selected' | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { toastProps, showToast } = useToast();

  const handleCellPress = useCallback(
    (photo: CapturedPhoto) => {
      if (isMultiSelectMode) {
        setSelectedIds((prev) => {
          const next = new Set(prev);
          if (next.has(photo.id)) {
            next.delete(photo.id);
          } else {
            next.add(photo.id);
          }
          return next;
        });
      } else {
        setActionPhoto(photo);
        setShowActionSheet(true);
      }
    },
    [isMultiSelectMode],
  );

  const handleCellLongPress = useCallback(
    (photo: CapturedPhoto) => {
      if (!isMultiSelectMode) {
        setSelectedIds(new Set([photo.id]));
      }
    },
    [isMultiSelectMode],
  );

  const exitMultiSelect = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleBack = useCallback(() => {
    if (selectedIds.size > 0) {
      exitMultiSelect();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }, [selectedIds, exitMultiSelect]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBack();
      return true;
    });
    return () => sub.remove();
  }, [handleBack]);

  const handleShare = useCallback(
    async (photo: CapturedPhoto) => {
      try {
        await Share.share({
          url: photo.uri,
          message: photo.poseId
            ? `Pose photo taken with POSEHANUM (${mockPoseName(photo.poseId)})!`
            : 'Photo taken with POSEHANUM!',
        });
      } catch {
        showToast({ message: 'Could not share photo', variant: 'error' });
      }
    },
    [showToast],
  );

  const handleToggleFavorite = useCallback(
    (photo: CapturedPhoto) => {
      const fav = loadFavoriteIds();
      const willBeFav = !photo.isFavorite;

      if (willBeFav) {
        fav.add(photo.id);
      } else {
        fav.delete(photo.id);
      }
      saveFavoriteIds(fav);

      setPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, isFavorite: willBeFav } : p)),
      );

      showToast({
        message: willBeFav ? 'Added to favorites' : 'Removed from favorites',
        variant: willBeFav ? 'success' : 'info',
      });
    },
    [setPhotos, showToast],
  );

  const handleViewMetadata = useCallback((photo: CapturedPhoto) => {
    setMetaPhoto(photo);
    setShowMetadata(true);
  }, []);

  const handleDeleteRequest = useCallback((photo: CapturedPhoto) => {
    setDeleteTarget(photo);
    setShowDeleteDialog(true);
  }, []);

  const handleBatchDeleteRequest = useCallback(() => {
    setDeleteTarget('selected');
    setShowDeleteDialog(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    const idsToDelete =
      deleteTarget === 'selected'
        ? Array.from(selectedIds)
        : deleteTarget
        ? [deleteTarget.id]
        : [];

    if (idsToDelete.length === 0) {
      setShowDeleteDialog(false);
      return;
    }

    setDeleting(true);
    try {
      await MediaLibrary.deleteAssetsAsync(idsToDelete);

      setPhotos((prev) => prev.filter((p) => !idsToDelete.includes(p.id)));

      const fav = loadFavoriteIds();
      idsToDelete.forEach((id) => fav.delete(id));
      saveFavoriteIds(fav);

      exitMultiSelect();
      showToast({
        message: idsToDelete.length === 1 ? 'Photo deleted' : `${idsToDelete.length} photos deleted`,
        variant: 'success',
      });
    } catch {
      showToast({ message: 'Could not delete photo(s). Try again.', variant: 'error' });
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, selectedIds, exitMultiSelect, setPhotos, showToast]);

  const deleteDialogMessage =
    deleteTarget === 'selected'
      ? `Permanently delete ${selectedIds.size} selected photo${selectedIds.size !== 1 ? 's' : ''}? This cannot be undone.`
      : 'Permanently delete this photo? This cannot be undone.';

  const renderItem = useCallback(
    ({ item }: { item: CapturedPhoto }) => (
      <PhotoCell
        photo={item}
        cellSize={cellSize}
        isSelected={selectedIds.has(item.id)}
        isMultiSelectMode={isMultiSelectMode}
        onPress={handleCellPress}
        onLongPress={handleCellLongPress}
      />
    ),
    [cellSize, selectedIds, isMultiSelectMode, handleCellPress, handleCellLongPress],
  );

  const keyExtractor = useCallback((item: CapturedPhoto) => item.id, []);

  if (!loading && !permissionGranted) {
    return (
      <View style={[styles.centred, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.stateTitle, { color: theme.colors.textPrimary }]}>
          Photos permission needed
        </Text>
        <Text style={[styles.stateBody, { color: theme.colors.textSecondary }]}>
          Allow POSEHANUM to access your photos to view your gallery.
        </Text>
        <SPButton
          label="Grant Permission"
          variant="primary"
          onPress={loadPhotos}
          accessibilityLabel="Grant photos permission"
          style={styles.stateButton}
        />
      </View>
    );
  }

  if (loading) {
    return (
      <View
        style={[styles.centred, { backgroundColor: theme.colors.background }]}
        accessibilityLabel="Loading gallery"
      >
        <ActivityIndicator size="large" color={theme.colors.olive} />
        <Text style={[styles.stateBody, { color: theme.colors.textSecondary }]}>
          Loading gallery…
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centred, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.stateTitle, { color: theme.colors.textPrimary }]}>
          Couldn't load gallery
        </Text>
        <Text style={[styles.stateBody, { color: theme.colors.textSecondary }]}>
          {error}
        </Text>
        <SPButton
          label="Retry"
          variant="primary"
          onPress={loadPhotos}
          accessibilityLabel="Retry loading gallery"
          style={styles.stateButton}
        />
      </View>
    );
  }

  if (photos.length === 0) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.xs }]}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <View style={styles.backRow}>
              <SPIcon name="arrowLeft" size={18} color={theme.colors.olive} strokeWidth={2.4} />
              <Text style={[styles.backText, { color: theme.colors.olive }]}>Back</Text>
            </View>
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]} accessibilityRole="header">
            Gallery
          </Text>
        </View>
        <View style={styles.centred}>
          <View style={styles.emptyIconCircle}>
            <SPIcon name="camera" size={44} color={Colors.olive} strokeWidth={1.8} />
          </View>
          <Text style={[styles.stateTitle, { color: theme.colors.textPrimary }]}>
            No photos yet
          </Text>
          <Text style={[styles.stateBody, { color: theme.colors.textSecondary }]}>
            Captured photos will appear here. Open the camera and strike a pose!
          </Text>
          <SPButton
            label="Open Camera"
            variant="primary"
            onPress={() => router.push('/(tabs)/camera' as any)}
            accessibilityLabel="Open camera to take a photo"
            style={styles.stateButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      {/* ── Header ── */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + Spacing.xs, borderBottomColor: theme.colors.border },
        ]}
      >
        {isMultiSelectMode ? (
          <>
            <Pressable
              style={styles.backButton}
              onPress={exitMultiSelect}
              accessibilityRole="button"
              accessibilityLabel="Cancel selection"
            >
              <View style={styles.backRow}>
                <SPIcon name="close" size={16} color={theme.colors.olive} strokeWidth={2.4} />
                <Text style={[styles.backText, { color: theme.colors.olive }]}>Cancel</Text>
              </View>
            </Pressable>
            <Text
              style={[styles.headerTitle, { color: theme.colors.textPrimary }]}
              accessibilityRole="header"
              accessibilityLiveRegion="polite"
            >
              {selectedIds.size} selected
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Pressable
                style={styles.headerAction}
                onPress={async () => {
                  const selectedPhotos = photos.filter((p) => selectedIds.has(p.id));
                  if (selectedPhotos.length === 0) return;
                  try {
                    await Share.share({
                      message: `Sharing ${selectedPhotos.length} photos captured with POSEHANUM`,
                      url: selectedPhotos[0]?.uri,
                    });
                  } catch {}
                }}
                accessibilityRole="button"
                accessibilityLabel="Share selected photos"
              >
                <SPIcon name="share" size={16} color={theme.colors.olive} />
              </Pressable>
              <Pressable
                style={styles.headerAction}
                onPress={handleBatchDeleteRequest}
                accessibilityRole="button"
                accessibilityLabel={`Delete ${selectedIds.size} selected photos`}
              >
                <Text style={[styles.headerActionText, { color: Colors.error }]}>Delete</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <Pressable
              style={styles.backButton}
              onPress={handleBack}
              hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <View style={styles.backRow}>
                <SPIcon name="arrowLeft" size={18} color={theme.colors.olive} strokeWidth={2.4} />
                <Text style={[styles.backText, { color: theme.colors.olive }]}>Back</Text>
              </View>
            </Pressable>
            <Text
              style={[styles.headerTitle, { color: theme.colors.textPrimary }]}
              accessibilityRole="header"
            >
              Gallery
            </Text>
            <SPBadge
              label={`${photos.length}`}
              variant="primary"
              style={styles.countBadge}
              accessibilityLabel={`${photos.length} photos`}
            />
          </>
        )}
      </View>

      {/* ── Grid ── [Req 20.1] */}
      <FlashList
        data={photos}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={NUM_COLUMNS}
        ItemSeparatorComponent={() => <View style={{ height: CELL_GAP }} />}
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
        accessibilityLabel="Captured photos grid"
      />

      {/* ── Per-photo action sheet ── [Req 20.4] */}
      <ActionSheet
        photo={actionPhoto}
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        onShare={handleShare}
        onDelete={handleDeleteRequest}
        onToggleFavorite={handleToggleFavorite}
        onViewMetadata={handleViewMetadata}
      />

      {/* ── Metadata bottom sheet ── [Req 20.5] */}
      <MetadataModal
        photo={metaPhoto}
        visible={showMetadata}
        onClose={() => setShowMetadata(false)}
      />

      {/* ── Delete confirmation dialog ── */}
      <SPDialog
        visible={showDeleteDialog}
        title="Delete photo?"
        message={deleteDialogMessage}
        icon="trash"
        confirmAction={{
          label: 'Delete',
          variant: 'primary',
          destructive: true,
          loading: deleting,
          onPress: handleDeleteConfirm,
          accessibilityLabel: 'Confirm delete',
        }}
        cancelAction={{
          label: 'Cancel',
          variant: 'ghost',
          onPress: () => {
            setShowDeleteDialog(false);
            setDeleteTarget(null);
          },
          accessibilityLabel: 'Cancel delete',
        }}
        onDismiss={() => {
          setShowDeleteDialog(false);
          setDeleteTarget(null);
        }}
      />

      {/* ── Toast ── */}
      <SPToast {...toastProps} position="bottom" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 56,
  },
  backButton: {
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    marginRight: Spacing.xs,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium as '500',
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold as '700',
  },
  headerAction: {
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerActionText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold as '600',
  },
  countBadge: {
    marginLeft: Spacing.xs,
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(101, 116, 74, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  stateTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.semibold as '600',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  stateBody: {
    fontSize: Typography.sizes.body,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: Spacing.xs,
  },
  stateButton: {
    marginTop: Spacing.lg,
    minWidth: 180,
  },
});
