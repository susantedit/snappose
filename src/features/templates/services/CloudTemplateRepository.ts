/**
 * CloudTemplateRepository — POSEHANUM
 *
 * Implements cloud synchronization for user-created templates.
 * Local-first: changes are persisted to MMKV immediately.
 * Remote operations are attempted and results are returned accurately —
 * failures are reported as such rather than silently swallowed.
 *
 * BACKEND REQUIREMENT:
 * Set EXPO_PUBLIC_MONGODB_API_URL in .env to point to a running backend.
 * The backend requires MONGODB_URI in its own .env to connect to MongoDB Atlas.
 */

import { api } from '@/services/api/client';
import type { Template } from '../types';

export type CloudSyncStatus = 'synced' | 'offline' | 'error';

export interface CloudResult<T = void> {
  success: boolean;
  data?: T;
  status: CloudSyncStatus;
  error?: string;
}

export interface ICloudTemplateRepository {
  publishTemplate(template: Template): Promise<CloudResult<{ remoteId: string }>>;
  fetchPublishedTemplates(page?: number, limit?: number): Promise<CloudResult<Template[]>>;
  fetchTemplatesByCreator(creatorUid: string): Promise<CloudResult<Template[]>>;
  deleteTemplate(templateId: string, creatorUid: string): Promise<CloudResult>;
  likeTemplate(templateId: string, userUid: string): Promise<CloudResult>;
  useTemplate(templateId: string): Promise<CloudResult>;
  remixTemplate(templateId: string): Promise<CloudResult>;
  reportTemplate(templateId: string, reason: string, reporterUid?: string): Promise<CloudResult>;
}

function isNetworkError(err: unknown): boolean {
  const msg = (err as any)?.message?.toLowerCase() ?? '';
  return (
    msg.includes('network') ||
    msg.includes('econnrefused') ||
    msg.includes('timeout') ||
    msg.includes('failed to fetch') ||
    (err as any)?.code === 'ECONNREFUSED' ||
    (err as any)?.code === 'ENOTFOUND'
  );
}

export class CloudTemplateRepository implements ICloudTemplateRepository {
  public async publishTemplate(
    template: Template,
  ): Promise<CloudResult<{ remoteId: string }>> {
    try {
      const result = await api.post<{ template: Template }>('/templates', template);
      return {
        success: true,
        status: 'synced',
        data: { remoteId: result.template?.id || template.id },
      };
    } catch (err) {
      if (isNetworkError(err)) {
        return {
          success: false,
          status: 'offline',
          error: 'Backend unreachable. Template saved locally and will sync when connected.',
        };
      }
      return {
        success: false,
        status: 'error',
        error: (err as any)?.message ?? 'Failed to publish template.',
      };
    }
  }

  public async fetchPublishedTemplates(page = 1, limit = 20): Promise<CloudResult<Template[]>> {
    try {
      const result = await api.get<{ templates: Template[] }>('/templates', { page, limit });
      return {
        success: true,
        status: 'synced',
        data: result.templates || [],
      };
    } catch (err) {
      if (isNetworkError(err)) {
        return { success: false, status: 'offline', data: [], error: 'Offline — showing local templates.' };
      }
      return { success: false, status: 'error', data: [], error: (err as any)?.message };
    }
  }

  public async fetchTemplatesByCreator(creatorUid: string): Promise<CloudResult<Template[]>> {
    try {
      const result = await api.get<{ templates: Template[] }>('/templates', { creatorId: creatorUid });
      return { success: true, status: 'synced', data: result.templates || [] };
    } catch (err) {
      if (isNetworkError(err)) {
        return { success: false, status: 'offline', data: [], error: 'Offline — showing local templates.' };
      }
      return { success: false, status: 'error', data: [], error: (err as any)?.message };
    }
  }

  public async deleteTemplate(
    templateId: string,
    _creatorUid: string,
  ): Promise<CloudResult> {
    try {
      await api.delete(`/templates/${encodeURIComponent(templateId)}`);
      return { success: true, status: 'synced' };
    } catch (err) {
      if (isNetworkError(err)) {
        return { success: false, status: 'offline', error: 'Delete queued — will sync when connected.' };
      }
      return { success: false, status: 'error', error: (err as any)?.message };
    }
  }

  public async likeTemplate(templateId: string, _userUid: string): Promise<CloudResult> {
    try {
      await api.post(`/templates/${encodeURIComponent(templateId)}/like`);
      return { success: true, status: 'synced' };
    } catch (err) {
      if (isNetworkError(err)) {
        return { success: false, status: 'offline', error: 'Like queued for sync.' };
      }
      return { success: false, status: 'error', error: (err as any)?.message };
    }
  }

  public async useTemplate(templateId: string): Promise<CloudResult> {
    try {
      await api.post(`/templates/${encodeURIComponent(templateId)}/use`);
      return { success: true, status: 'synced' };
    } catch (err) {
      if (isNetworkError(err)) {
        return { success: false, status: 'offline', error: 'Use event queued for sync.' };
      }
      return { success: false, status: 'error', error: (err as any)?.message };
    }
  }

  public async remixTemplate(templateId: string): Promise<CloudResult> {
    try {
      await api.post(`/templates/${encodeURIComponent(templateId)}/remix`);
      return { success: true, status: 'synced' };
    } catch (err) {
      if (isNetworkError(err)) {
        return { success: false, status: 'offline', error: 'Remix event queued for sync.' };
      }
      return { success: false, status: 'error', error: (err as any)?.message };
    }
  }

  public async reportTemplate(
    templateId: string,
    reason: string,
    details?: string,
  ): Promise<CloudResult> {
    try {
      await api.post(`/templates/${encodeURIComponent(templateId)}/report`, { reason, details });
      return { success: true, status: 'synced' };
    } catch (err) {
      if (isNetworkError(err)) {
        return { success: false, status: 'offline', error: 'Report queued for sync.' };
      }
      return { success: false, status: 'error', error: (err as any)?.message };
    }
  }
}

export const cloudTemplateRepository = new CloudTemplateRepository();
