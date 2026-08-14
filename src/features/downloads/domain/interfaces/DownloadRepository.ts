import type { Download } from '../../types';

/**
 * Abstract data access interface — DownloadRepository.
 * [Req 47]
 */
export interface DownloadRepository {
  findAll(): Promise<Download[]>;
  findByPoseId(poseId: string): Promise<Download | null>;
  save(download: Download): Promise<void>;
  remove(poseId: string): Promise<void>;
}
