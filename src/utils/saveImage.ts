/**
 * saveImage.ts — Image and cover photo download & gallery saving utility for Snap Pose.
 * Supports iOS, Android (via expo-media-library and expo-file-system) and Web.
 */

import { Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { getPoseImageUri } from './imageUtils';

export interface SaveImageResult {
  success: boolean;
  message: string;
}

export async function saveImageToGallery(
  rawImageUrl: string | number | null | undefined,
  filenamePrefix = 'snappose'
): Promise<SaveImageResult> {
  const uri = getPoseImageUri(rawImageUrl);
  if (!uri) {
    return { success: false, message: 'Invalid image URL' };
  }

  // ── Web Platform ──────────────────────────────────────────────────────────
  if (Platform.OS === 'web') {
    try {
      const gWindow = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
      const gDoc = gWindow?.document;
      if (gWindow && gDoc && typeof gWindow.fetch === 'function') {
        const response = await gWindow.fetch(uri);
        const blob = await response.blob();
        const blobUrl = gWindow.URL.createObjectURL(blob);
        const link = gDoc.createElement('a');
        link.href = blobUrl;
        link.download = `${filenamePrefix}_${Date.now()}.jpg`;
        gDoc.body.appendChild(link);
        link.click();
        gDoc.body.removeChild(link);
        gWindow.URL.revokeObjectURL(blobUrl);
        return { success: true, message: 'Image downloaded to your device!' };
      }
      if (gWindow?.open) {
        gWindow.open(uri, '_blank');
        return { success: true, message: 'Opened image in new tab' };
      }
      return { success: false, message: 'Web environment not available' };
    } catch {
      const gWindow = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
      if (gWindow?.open) {
        gWindow.open(uri, '_blank');
        return { success: true, message: 'Opened image in new tab' };
      }
      return { success: false, message: 'Failed to download image on web' };
    }
  }

  // ── Native (iOS & Android) ────────────────────────────────────────────────
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync(true);
    if (status !== 'granted') {
      return {
        success: false,
        message: 'Gallery permission is required to save photos. Please enable it in Settings.',
      };
    }

    const FS: any = FileSystem;
    const cacheDir = FS.cacheDirectory || '';
    const cleanPrefix = filenamePrefix.replace(/[^a-zA-Z0-9_-]/g, '_');
    const localUri = `${cacheDir}${cleanPrefix}_${Date.now()}.jpg`;

    // Download remote image to local file cache
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
      const downloadRes = await FS.downloadAsync(uri, localUri);
      if (!downloadRes || !downloadRes.uri) {
        return { success: false, message: 'Failed to download image file' };
      }

      const asset = await MediaLibrary.createAssetAsync(downloadRes.uri);
      try {
        const album = await MediaLibrary.getAlbumAsync('SnapPose');
        if (album == null) {
          await MediaLibrary.createAlbumAsync('SnapPose', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      } catch {
        // Album addition is best-effort; asset is already in main camera roll
      }

      return { success: true, message: 'Image saved to your gallery!' };
    } else {
      // Local asset uri
      await MediaLibrary.createAssetAsync(uri);
      return { success: true, message: 'Image saved to your gallery!' };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Could not save image to gallery',
    };
  }
}
