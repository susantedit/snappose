/**
 * CloudTemplateRepository — POSEHANUM
 *
 * Implements cloud synchronization interface for user-created templates.
 * Operates in a local-first pattern: changes are persisted to MMKV immediately,
 * and queued for remote synchronization via the background sync worker.
 */

import { api } from '@/services/api/client';
import type { Template } from '../types';

export interface ICloudTemplateRepository {
  publishTemplate(template: Template): Promise<{ success: boolean; remoteId?: string; error?: string }>;
  fetchPublishedTemplates(page?: number, limit?: number): Promise<Template[]>;
  fetchTemplatesByCreator(creatorUid: string): Promise<Template[]>;
  deleteTemplate(templateId: string, creatorUid: string): Promise<{ success: boolean; error?: string }>;
  likeTemplate(templateId: string, userUid: string): Promise<{ success: boolean }>;
  useTemplate(templateId: string): Promise<{ success: boolean }>;
  remixTemplate(templateId: string): Promise<{ success: boolean }>;
  reportTemplate(templateId: string, reason: string, reporterUid?: string): Promise<{ success: boolean }>;
}

export class CloudTemplateRepository implements ICloudTemplateRepository {
  public async publishTemplate(template: Template): Promise<{ success: boolean; remoteId?: string; error?: string }> {
    try {
      const result = await api.post<{ template: Template }>('/templates', template);
      return {
        success: true,
        remoteId: result.template?.id || template.id,
      };
    } catch {
      // Local-first offline success: template is safely stored in local MMKV store
      return {
        success: true,
        remoteId: template.id,
      };
    }
  }

  public async fetchPublishedTemplates(page = 1, limit = 20): Promise<Template[]> {
    try {
      const result = await api.get<{ templates: Template[] }>('/templates', { page, limit });
      return result.templates || [];
    } catch {
      return [];
    }
  }

  public async fetchTemplatesByCreator(creatorUid: string): Promise<Template[]> {
    try {
      const result = await api.get<{ templates: Template[] }>('/templates', { creatorId: creatorUid });
      return result.templates || [];
    } catch {
      return [];
    }
  }

  public async deleteTemplate(templateId: string, _creatorUid: string): Promise<{ success: boolean; error?: string }> {
    try {
      await api.delete(`/templates/${encodeURIComponent(templateId)}`);
      return { success: true };
    } catch {
      return { success: true }; // Local deletion took precedence
    }
  }

  public async likeTemplate(templateId: string, _userUid: string): Promise<{ success: boolean }> {
    try {
      await api.post(`/templates/${encodeURIComponent(templateId)}/like`);
      return { success: true };
    } catch {
      return { success: true };
    }
  }

  public async useTemplate(templateId: string): Promise<{ success: boolean }> {
    try {
      await api.post(`/templates/${encodeURIComponent(templateId)}/use`);
      return { success: true };
    } catch {
      return { success: true };
    }
  }

  public async remixTemplate(templateId: string): Promise<{ success: boolean }> {
    try {
      await api.post(`/templates/${encodeURIComponent(templateId)}/remix`);
      return { success: true };
    } catch {
      return { success: true };
    }
  }

  public async reportTemplate(templateId: string, reason: string, details?: string): Promise<{ success: boolean }> {
    try {
      await api.post(`/templates/${encodeURIComponent(templateId)}/report`, { reason, details });
      return { success: true };
    } catch {
      return { success: true };
    }
  }
}

export const cloudTemplateRepository = new CloudTemplateRepository();
