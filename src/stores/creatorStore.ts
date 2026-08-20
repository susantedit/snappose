/**
 * creatorStore — Zustand store for Creator profile management and local creator stats.
 */

import { create } from 'zustand';
import { mmkv } from '@/database/mmkv/mmkvClient';
import type { CreatorProfile } from '@/features/creator/types';

const STORAGE_KEY = 'snappose_creator_profile_v1';

interface CreatorState {
  profile: CreatorProfile;
  followedCreatorIds: string[];

  // Actions
  updateBio: (bio: string) => void;
  followCreator: (creatorId: string) => void;
  unfollowCreator: (creatorId: string) => void;
  isFollowing: (creatorId: string) => boolean;
}

function loadCreatorProfile(): CreatorProfile {
  try {
    const raw = mmkv.getString(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    uid: 'local_creator',
    handle: '@director',
    displayName: 'Creator Studio',
    avatarUrl: null,
    bio: 'Capturing moments, composing frames, directing stories.',
    isVerified: false,
    totalViews: 120,
    totalRemixes: 8,
    followerCount: 0,
    publishedTemplateIds: [],
  };
}

function persistCreatorProfile(profile: CreatorProfile) {
  try {
    mmkv.set(STORAGE_KEY, JSON.stringify(profile));
  } catch {}
}

export const useCreatorStore = create<CreatorState>((set, get) => ({
  profile: loadCreatorProfile(),
  followedCreatorIds: [],

  updateBio: (bio: string) => {
    const updated = { ...get().profile, bio };
    persistCreatorProfile(updated);
    set({ profile: updated });
  },

  followCreator: (creatorId: string) => {
    const { followedCreatorIds } = get();
    if (!followedCreatorIds.includes(creatorId)) {
      set({ followedCreatorIds: [...followedCreatorIds, creatorId] });
    }
  },

  unfollowCreator: (creatorId: string) => {
    set({ followedCreatorIds: get().followedCreatorIds.filter((id) => id !== creatorId) });
  },

  isFollowing: (creatorId: string) => {
    return get().followedCreatorIds.includes(creatorId);
  },
}));
