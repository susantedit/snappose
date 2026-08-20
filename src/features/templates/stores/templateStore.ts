/**
 * templateStore — Zustand store for template state management.
 *
 * Persists via MMKV. Does NOT duplicate authStore, historyStore,
 * personalizationStore, or any existing store.
 *
 * Manages:
 *  - Saved/favorited template IDs
 *  - User-created templates and drafts
 *  - Recently used template IDs
 */

import { create } from 'zustand';
import { mmkv } from '@/database/mmkv/mmkvClient';
import type { Template } from '../types';

// ---------------------------------------------------------------------------
// MMKV keys (scoped to template store)
// ---------------------------------------------------------------------------

const KEYS = {
  SAVED_IDS: 'template_saved_ids',
  LIKED_IDS: 'template_liked_ids',
  USER_CREATED: 'template_user_created',
  DRAFTS: 'template_drafts',
  RECENT_IDS: 'template_recent_ids',
} as const;

// ---------------------------------------------------------------------------
// State interface
// ---------------------------------------------------------------------------

interface TemplateState {
  savedTemplateIds: string[];
  likedTemplateIds: string[];
  userCreatedTemplates: Template[];
  draftTemplates: Template[];
  recentlyUsedIds: string[];

  // Actions
  saveTemplate: (id: string) => void;
  unsaveTemplate: (id: string) => void;
  isSaved: (id: string) => boolean;

  likeTemplate: (id: string) => void;
  unlikeTemplate: (id: string) => void;
  isLiked: (id: string) => boolean;

  markUsed: (id: string) => void;

  saveUserCreatedTemplate: (template: Template) => void;
  saveDraft: (template: Template) => void;
  deleteDraft: (id: string) => void;
  deleteUserCreatedTemplate: (id: string) => void;

  clearAll: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadStringArray(key: string): string[] {
  try {
    const raw = mmkv.getString(key);
    if (raw) return JSON.parse(raw) as string[];
  } catch {}
  return [];
}

function loadTemplateArray(key: string): Template[] {
  try {
    const raw = mmkv.getString(key);
    if (raw) return JSON.parse(raw) as Template[];
  } catch {}
  return [];
}

function persistStringArray(key: string, arr: string[]): void {
  try {
    mmkv.set(key, JSON.stringify(arr));
  } catch {}
}

function persistTemplateArray(key: string, arr: Template[]): void {
  try {
    mmkv.set(key, JSON.stringify(arr));
  } catch {}
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useTemplateStore = create<TemplateState>((set, get) => ({
  savedTemplateIds: loadStringArray(KEYS.SAVED_IDS),
  likedTemplateIds: loadStringArray(KEYS.LIKED_IDS),
  userCreatedTemplates: loadTemplateArray(KEYS.USER_CREATED),
  draftTemplates: loadTemplateArray(KEYS.DRAFTS),
  recentlyUsedIds: loadStringArray(KEYS.RECENT_IDS),

  saveTemplate: (id) => {
    const { savedTemplateIds } = get();
    if (savedTemplateIds.includes(id)) return;
    const next = [id, ...savedTemplateIds].slice(0, 200);
    persistStringArray(KEYS.SAVED_IDS, next);
    set({ savedTemplateIds: next });
  },

  unsaveTemplate: (id) => {
    const next = get().savedTemplateIds.filter((s) => s !== id);
    persistStringArray(KEYS.SAVED_IDS, next);
    set({ savedTemplateIds: next });
  },

  isSaved: (id) => get().savedTemplateIds.includes(id),

  likeTemplate: (id) => {
    const { likedTemplateIds } = get();
    if (likedTemplateIds.includes(id)) return;
    const next = [id, ...likedTemplateIds].slice(0, 500);
    persistStringArray(KEYS.LIKED_IDS, next);
    set({ likedTemplateIds: next });
  },

  unlikeTemplate: (id) => {
    const next = get().likedTemplateIds.filter((s) => s !== id);
    persistStringArray(KEYS.LIKED_IDS, next);
    set({ likedTemplateIds: next });
  },

  isLiked: (id) => get().likedTemplateIds.includes(id),

  markUsed: (id) => {
    const { recentlyUsedIds } = get();
    const next = [id, ...recentlyUsedIds.filter((s) => s !== id)].slice(0, 50);
    persistStringArray(KEYS.RECENT_IDS, next);
    set({ recentlyUsedIds: next });
  },

  saveUserCreatedTemplate: (template) => {
    const { userCreatedTemplates } = get();
    const next = [
      template,
      ...userCreatedTemplates.filter((t) => t.id !== template.id),
    ].slice(0, 100);
    persistTemplateArray(KEYS.USER_CREATED, next);
    set({ userCreatedTemplates: next });
  },

  saveDraft: (template) => {
    const { draftTemplates } = get();
    const next = [
      template,
      ...draftTemplates.filter((t) => t.id !== template.id),
    ].slice(0, 50);
    persistTemplateArray(KEYS.DRAFTS, next);
    set({ draftTemplates: next });
  },

  deleteDraft: (id) => {
    const next = get().draftTemplates.filter((t) => t.id !== id);
    persistTemplateArray(KEYS.DRAFTS, next);
    set({ draftTemplates: next });
  },

  deleteUserCreatedTemplate: (id) => {
    const next = get().userCreatedTemplates.filter((t) => t.id !== id);
    persistTemplateArray(KEYS.USER_CREATED, next);
    set({ userCreatedTemplates: next });
  },

  clearAll: () => {
    [KEYS.SAVED_IDS, KEYS.LIKED_IDS, KEYS.USER_CREATED, KEYS.DRAFTS, KEYS.RECENT_IDS].forEach(
      (k) => { try { mmkv.delete(k); } catch {} }
    );
    set({
      savedTemplateIds: [],
      likedTemplateIds: [],
      userCreatedTemplates: [],
      draftTemplates: [],
      recentlyUsedIds: [],
    });
  },
}));
