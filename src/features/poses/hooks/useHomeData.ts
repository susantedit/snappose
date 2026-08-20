/**
 * useHomeData — home screen data hook.
 * Provides trending, recommended, editor's picks, category filtered, and recently viewed poses.
 */

import { useQuery } from '@tanstack/react-query';
import { mmkv } from '@/database/mmkv/mmkvClient';
import type { Pose } from '@/features/poses/types';
import { SNAP_POSE_DATASET } from '../data/posesData';

export const RECENTLY_VIEWED_KEY = 'recentlyViewed';
const MAX_RECENTLY_VIEWED = 20;

export const MOCK_TRENDING: Pose[] = [
  ...SNAP_POSE_DATASET.filter((p) => p.tags.includes('trending') || p.id.includes('drive') || p.id === 'pose-tony-stark-tpose').slice(0, 12),
  ...SNAP_POSE_DATASET.slice(0, 12),
].filter((p, index, self) => self.findIndex((s) => s.id === p.id) === index).slice(0, 12);

export const MOCK_RECOMMENDED: Pose[] = SNAP_POSE_DATASET.slice(12, 24);
export const MOCK_EDITORS_PICKS: Pose[] = SNAP_POSE_DATASET.slice(24, 36);

async function fetchTrending(): Promise<Pose[]> {
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_TRENDING;
}

async function fetchRecommended(): Promise<Pose[]> {
  await new Promise((r) => setTimeout(r, 250));
  return MOCK_RECOMMENDED;
}

async function fetchEditorsPicks(): Promise<Pose[]> {
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_EDITORS_PICKS;
}

export function getAllPoses(): Pose[] {
  return SNAP_POSE_DATASET;
}

export function getRecentlyViewed(): Pose[] {
  try {
    const raw = mmkv.getString(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Pose[];
  } catch {
    return [];
  }
}

export function addToRecentlyViewed(pose: Pose): void {
  try {
    const current = getRecentlyViewed();
    const filtered = current.filter((p) => p.id !== pose.id);
    const updated = [pose, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
    mmkv.set(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch {
    // Silently ignore MMKV write errors
  }
}

export function useTrending() {
  return useQuery<Pose[], Error>({
    queryKey: ['poses', 'trending'],
    queryFn: fetchTrending,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
  });
}

export function useRecommended() {
  return useQuery<Pose[], Error>({
    queryKey: ['poses', 'recommended'],
    queryFn: fetchRecommended,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
  });
}

export function useEditorsPicks() {
  return useQuery<Pose[], Error>({
    queryKey: ['poses', 'editors-picks'],
    queryFn: fetchEditorsPicks,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
  });
}
