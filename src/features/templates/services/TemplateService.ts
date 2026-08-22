/**
 * TemplateService — Business logic & helper operations for Templates with Optimistic UI.
 * [Additive Feature Expansion]
 */

import type { Template, TemplateCategory, TemplateVibe } from '../types';
import { TEMPLATE_DATASET, getTemplateById } from '../data/templateData';
import { useTemplateStore } from '../stores/templateStore';
import { cloudTemplateRepository, type CloudResult } from './CloudTemplateRepository';

export class TemplateService {
  /**
   * Returns all templates merged with user-created templates from local store.
   */
  static getAllTemplates(): Template[] {
    const userTemplates = useTemplateStore.getState().userCreatedTemplates;
    return [...userTemplates, ...TEMPLATE_DATASET];
  }

  /**
   * Search templates by keyword in title, description, tags, or pose name.
   */
  static searchTemplates(query: string): Template[] {
    if (!query || !query.trim()) return this.getAllTemplates();
    const clean = query.trim().toLowerCase();
    return this.getAllTemplates().filter((t) => {
      return (
        t.title.toLowerCase().includes(clean) ||
        t.description.toLowerCase().includes(clean) ||
        t.tags.some((tag) => tag.toLowerCase().includes(clean)) ||
        t.category.toLowerCase().includes(clean) ||
        t.vibe.toLowerCase().includes(clean) ||
        t.poseName.toLowerCase().includes(clean)
      );
    });
  }

  /**
   * Filter templates by category and vibe.
   */
  static filterTemplates(category?: TemplateCategory | 'all', vibe?: TemplateVibe | 'all'): Template[] {
    let list = this.getAllTemplates();
    if (category && category !== 'all') {
      list = list.filter((t) => t.category === category);
    }
    if (vibe && vibe !== 'all') {
      list = list.filter((t) => t.vibe === vibe);
    }
    return list;
  }

  /**
   * Retrieve template by ID from built-in or user-created templates.
   */
  static findById(id: string): Template | undefined {
    const userTemplates = useTemplateStore.getState().userCreatedTemplates;
    const userMatch = userTemplates.find((t) => t.id === id);
    if (userMatch) return userMatch;
    return getTemplateById(id);
  }

  /**
   * Get trending templates sorted by remix and like counts.
   */
  static getTrendingTemplates(limit: number = 6): Template[] {
    return [...this.getAllTemplates()]
      .sort((a, b) => (b.uses + b.likes * 2 + b.remixCount * 3) - (a.uses + a.likes * 2 + a.remixCount * 3))
      .slice(0, limit);
  }

  /**
   * Optimistically like a template: updates local store immediately, then syncs to cloud.
   */
  static async toggleLikeTemplate(id: string, userUid: string): Promise<CloudResult> {
    const isCurrentlyLiked = useTemplateStore.getState().isLiked(id);
    if (isCurrentlyLiked) {
      useTemplateStore.getState().unlikeTemplate(id);
    } else {
      useTemplateStore.getState().likeTemplate(id);
    }

    try {
      return await cloudTemplateRepository.likeTemplate(id, userUid);
    } catch (err: any) {
      // Rollback on unexpected crash
      if (isCurrentlyLiked) {
        useTemplateStore.getState().likeTemplate(id);
      } else {
        useTemplateStore.getState().unlikeTemplate(id);
      }
      return { success: false, status: 'error', error: err?.message };
    }
  }

  /**
   * Optimistically record template usage.
   */
  static async recordTemplateUse(id: string): Promise<CloudResult> {
    useTemplateStore.getState().markUsed(id);
    return cloudTemplateRepository.useTemplate(id);
  }

  /**
   * Optimistically save user template locally first, then asynchronously publish to cloud.
   */
  static async publishTemplate(template: Template): Promise<CloudResult<{ remoteId: string }>> {
    useTemplateStore.getState().saveUserCreatedTemplate(template);
    return cloudTemplateRepository.publishTemplate(template);
  }
}
