/**
 * useHomeData — home screen data hook.
 *
 * Provides trending, recommended, editor's picks, and recently viewed sections.
 * Uses React Query for caching (stale time 24 h) with MMKV-backed persistence.
 * Recently viewed is read directly from MMKV key RECENTLY_VIEWED.
 *
 * NOTE: The actual API/DB connections are wired in Tasks 26 and 29.
 * For now this returns mock data matching the real Pose shape so the UI
 * can be fully implemented and tested independently.
 *
 * [Req 4.1, 4.2, 4.3, 4.7]
 */

import { useQuery } from '@tanstack/react-query';
import { mmkv } from '@/database/mmkv/mmkvClient';
import type { Pose } from '@/features/poses/types';

// ---------------------------------------------------------------------------
// MMKV key for recently viewed
// ---------------------------------------------------------------------------

export const RECENTLY_VIEWED_KEY = 'recentlyViewed';
const MAX_RECENTLY_VIEWED = 20;

// ---------------------------------------------------------------------------
// Mock pose factory
// ---------------------------------------------------------------------------

function makeMockPose(id: string, title: string, category: string, categoryId: string): Pose {
  return {
    id,
    categoryId,
    title,
    description: `A beautiful ${title.toLowerCase()} pose perfect for ${category.toLowerCase()} photography.`,
    imageUrl: `https://picsum.photos/seed/${id}/400/600`,
    overlayImage: '',
    thumbnailUrl: `https://picsum.photos/seed/${id}/200/300`,
    difficulty: (['easy', 'medium', 'hard'] as const)[Math.abs(id.charCodeAt(0) % 3)],
    indoor: id.charCodeAt(0) % 2 === 0,
    tags: [category.toLowerCase()],
    views: Math.floor(Math.abs(id.charCodeAt(0) * 47) % 5000) + 100,
    downloads: Math.floor(Math.abs(id.charCodeAt(0) * 13) % 1000) + 10,
    favorites: Math.floor(Math.abs(id.charCodeAt(0) * 7) % 500) + 5,
    estimatedDistance: 1.5,
    cameraAngle: 'eye-level',
    lighting: 'natural',
    orientation: 'portrait',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  };
}

// ---------------------------------------------------------------------------
// Mock data sets
// ---------------------------------------------------------------------------

export const MOCK_TRENDING: Pose[] = [
  makeMockPose('t1', 'Golden Hour Walk', 'Golden Hour', 'golden-hour'),
  makeMockPose('t2', 'Beach Stroll', 'Beach', 'beach'),
  makeMockPose('t3', 'Cafe Corner', 'Cafe', 'cafe'),
  makeMockPose('t4', 'Mountain Vista', 'Mountain', 'mountain'),
  makeMockPose('t5', 'Nature Walk', 'Nature', 'nature'),
  makeMockPose('t6', 'Wedding Elegance', 'Wedding', 'wedding'),
];

export const MOCK_RECOMMENDED: Pose[] = [
  makeMockPose('r1', 'Solo Selfie Classic', 'Selfie', 'selfie'),
  makeMockPose('r2', 'Couple Embrace', 'Couple', 'couple'),
  makeMockPose('r3', 'Festival Vibes', 'Festival', 'festival'),
  makeMockPose('r4', 'Forest Meditation', 'Forest', 'forest'),
  makeMockPose('r5', 'Gym Power', 'Gym', 'gym'),
  makeMockPose('r6', 'Luxury Hotel', 'Luxury', 'luxury'),
];

export const MOCK_EDITORS_PICKS: Pose[] = [
  makeMockPose('e1', 'Snow Angel', 'Snow', 'snow'),
  makeMockPose('e2', 'Night Neon', 'Night', 'night'),
  makeMockPose('e3', 'Travel Wanderer', 'Travel', 'travel'),
  makeMockPose('e4', 'Bike Adventure', 'Bike', 'bike'),
  makeMockPose('e5', 'Office Professional', 'Office', 'office'),
  makeMockPose('e6', 'Traditional Grace', 'Traditional', 'traditional'),
];

// ---------------------------------------------------------------------------
// Fetch stubs — will be replaced in Task 26 with real API calls
// ---------------------------------------------------------------------------

async function fetchTrending(): Promise<Pose[]> {
  // Simulate network latency (500–900ms)
  await new Promise((r) => setTimeout(r, 700));
  return MOCK_TRENDING;
}

async function fetchRecommended(): Promise<Pose[]> {
  await new Promise((r) => setTimeout(r, 600));
  return MOCK_RECOMMENDED;
}

async function fetchEditorsPicks(): Promise<Pose[]> {
  await new Promise((r) => setTimeout(r, 800));
  return MOCK_EDITORS_PICKS;
}

// ---------------------------------------------------------------------------
// Recently viewed helpers (MMKV)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// React Query hooks
// ---------------------------------------------------------------------------

export function useTrending() {
  return useQuery<Pose[], Error>({
    queryKey: ['poses', 'trending'],
    queryFn: fetchTrending,
    staleTime: 24 * 60 * 60 * 1000, // 24 h — Req 4.7
    gcTime: 48 * 60 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}

export function useRecommended() {
  return useQuery<Pose[], Error>({
    queryKey: ['poses', 'recommended'],
    queryFn: fetchRecommended,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}

export function useEditorsPicks() {
  return useQuery<Pose[], Error>({
    queryKey: ['poses', 'editors-picks'],
    queryFn: fetchEditorsPicks,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}
