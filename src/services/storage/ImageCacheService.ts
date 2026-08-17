/**
 * ImageCacheService — Offline Image Caching & Local File System Manager.
 *
 * Implements:
 *  - On-disk thumbnail caching in cacheDirectory / poses/
 *  - Cache eviction & size calculation
 *  - Offline local file resolution
 * [Req 41, 46]
 */

import * as FileSystem from 'expo-file-system/legacy';

const CACHE_DIR = `${FileSystem.cacheDirectory}snappose_img_cache/`;

export class ImageCacheService {
  private static instance: ImageCacheService;

  private constructor() {
    this._ensureDir();
  }

  public static getInstance(): ImageCacheService {
    if (!ImageCacheService.instance) {
      ImageCacheService.instance = new ImageCacheService();
    }
    return ImageCacheService.instance;
  }

  private async _ensureDir(): Promise<void> {
    try {
      const info = await FileSystem.getInfoAsync(CACHE_DIR);
      if (!info.exists) {
        await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
      }
    } catch {}
  }

  /**
   * Retrieves a cached local file URI or downloads and caches the remote image.
   */
  async getLocalImageUri(remoteUrl: string): Promise<string> {
    if (!remoteUrl || remoteUrl.startsWith('file://') || remoteUrl.startsWith('data:')) {
      return remoteUrl;
    }

    try {
      await this._ensureDir();
      const filename = remoteUrl.split('/').pop()?.split('?')[0] || `img_${Date.now()}.jpg`;
      const localUri = `${CACHE_DIR}${filename}`;

      const info = await FileSystem.getInfoAsync(localUri);
      if (info.exists) {
        return localUri;
      }

      // Download and cache
      const downloadResult = await FileSystem.downloadAsync(remoteUrl, localUri);
      return downloadResult.uri;
    } catch (e) {
      // Fallback to remote URL if offline or download fails
      return remoteUrl;
    }
  }

  /**
   * Clears the entire local image cache to free device storage.
   */
  async clearCache(): Promise<void> {
    try {
      const info = await FileSystem.getInfoAsync(CACHE_DIR);
      if (info.exists) {
        await FileSystem.deleteAsync(CACHE_DIR, { idempotent: true });
      }
      await this._ensureDir();
    } catch (e) {
      console.warn('[ImageCacheService] Failed to clear cache:', e);
    }
  }
}

export const imageCacheService = ImageCacheService.getInstance();
