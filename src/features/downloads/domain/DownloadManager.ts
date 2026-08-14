import * as FileSystem from 'expo-file-system';
import { getDb } from '@/database/sqlite/db';
import type { Download, DownloadStatus } from '../types';

/**
 * DownloadManager handles pose pack ZIP bundle downloads using expo-file-system.
 * Features: storage check (>50MB), progress updates, resume support, and deletion.
 * [Req 19]
 */
export class DownloadManager {
  private activeResumables: Map<string, FileSystem.DownloadResumable> = new Map();

  async downloadPosePack(
    poseId: string,
    downloadUrl: string,
    onProgress?: (progress: number) => void
  ): Promise<Download> {
    // 1. Verify available free disk space (require >= 50 MB = 52,428,800 bytes)
    const freeStorage = await FileSystem.getFreeDiskStorageAsync();
    const MIN_REQUIRED_BYTES = 50 * 1024 * 1024;
    if (freeStorage < MIN_REQUIRED_BYTES) {
      throw new Error('Insufficient storage space. At least 50MB of free space is required.');
    }

    const targetDirectory = `${FileSystem.documentDirectory}pose_packs/${poseId}/`;
    await FileSystem.makeDirectoryAsync(targetDirectory, { intermediates: true });

    const localFilePath = `${targetDirectory}pack.zip`;

    // 2. Initialize download resumable
    const callback: FileSystem.DownloadProgressCallback = (downloadProgress) => {
      const progressRatio =
        downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      const percent = Math.min(100, Math.max(0, Math.round(progressRatio * 100)));
      if (onProgress) {
        onProgress(percent);
      }
    };

    const downloadResumable = FileSystem.createDownloadResumable(
      downloadUrl,
      localFilePath,
      {},
      callback
    );

    this.activeResumables.set(poseId, downloadResumable);

    try {
      const result = await downloadResumable.downloadAsync();
      this.activeResumables.delete(poseId);

      if (!result || result.status !== 200) {
        throw new Error(`Download failed with HTTP status ${result?.status ?? 'unknown'}`);
      }

      const fileInfo = await FileSystem.getInfoAsync(localFilePath);
      const sizeBytes = fileInfo.exists && 'size' in fileInfo ? fileInfo.size : 0;
      const downloadRecord: Download = {
        id: `dl_${poseId}`,
        poseId,
        status: 'completed',
        progress: 100,
        filePath: localFilePath,
        downloadedAt: new Date().toISOString(),
        version: 1,
        storageSize: sizeBytes,
      };

      // Save to SQLite
      await this.saveDownloadToDb(downloadRecord);

      return downloadRecord;
    } catch (err) {
      this.activeResumables.delete(poseId);
      throw err;
    }
  }

  async pauseDownload(poseId: string): Promise<void> {
    const resumable = this.activeResumables.get(poseId);
    if (resumable) {
      await resumable.pauseAsync();
    }
  }

  async resumeDownload(
    poseId: string,
    onProgress?: (progress: number) => void
  ): Promise<Download | null> {
    const resumable = this.activeResumables.get(poseId);
    if (resumable) {
      await resumable.resumeAsync();
      return null;
    }
    return null;
  }

  async deletePosePack(poseId: string): Promise<void> {
    const targetDirectory = `${FileSystem.documentDirectory}pose_packs/${poseId}/`;
    const info = await FileSystem.getInfoAsync(targetDirectory);
    if (info.exists) {
      await FileSystem.deleteAsync(targetDirectory, { idempotent: true });
    }

    const db = getDb();
    await db.runAsync('DELETE FROM downloads WHERE poseId = ?', [poseId]);
  }

  async getDownloadedPacks(): Promise<Download[]> {
    const db = getDb();
    const rows = await db.getAllAsync<{
      id: string;
      poseId: string;
      downloadedAt: string;
      filePath: string;
      sizeBytes: number;
    }>('SELECT id, poseId, downloadedAt, filePath, sizeBytes FROM downloads');

    return rows.map((r) => ({
      id: r.id,
      poseId: r.poseId,
      status: 'completed' as DownloadStatus,
      progress: 100,
      filePath: r.filePath,
      downloadedAt: r.downloadedAt,
      version: 1,
      storageSize: r.sizeBytes,
    }));
  }

  private async saveDownloadToDb(record: Download): Promise<void> {
    const db = getDb();
    await db.runAsync(
      `INSERT OR REPLACE INTO downloads (id, poseId, version, downloadedAt, filePath, sizeBytes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        record.id,
        record.poseId,
        record.version,
        record.downloadedAt || new Date().toISOString(),
        record.filePath || '',
        record.storageSize,
      ]
    );
  }
}
