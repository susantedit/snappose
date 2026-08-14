/**
 * Downloads feature types.
 * [Req 19]
 */

export type DownloadStatus = 'idle' | 'downloading' | 'paused' | 'completed' | 'error';

export interface Download {
  id: string;
  poseId: string;
  status: DownloadStatus;
  progress: number;
  filePath?: string;
  downloadedAt?: string;
  version: number;
  storageSize: number;
  sha256?: string;
}
