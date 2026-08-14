/**
 * usePoseDetail — data hook for the Pose Detail screen.
 *
 * Returns the pose, related poses, favorite state, and download state.
 * All data comes from mock data for now; real API wired in Tasks 26 & 29.
 *
 * Favorite optimistic update pattern:
 *   1. Toggle local SQLite state immediately (stub for Task 29)
 *   2. Sync to MongoDB in background (stub for Task 25)
 *
 * Download state stub — real DownloadManager wired in Task 33.
 *
 * [Req 7.1, 7.4, 7.5]
 */

import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mmkv } from '@/database/mmkv/mmkvClient';
import type { Pose } from '@/features/poses/types';

// ---------------------------------------------------------------------------
// MMKV keys for local favorites state
// ---------------------------------------------------------------------------

const FAVORITES_KEY = 'favorites';

// ---------------------------------------------------------------------------
// Extended Pose type with lens field
// ---------------------------------------------------------------------------

export interface PoseDetail extends Pose {
  /** Recommended lens (e.g., "50mm", "24–70mm"). */
  lens: string;
  /** Body direction instructions. */
  bodyDirections: string[];
  /** Whether the pose pack has been downloaded. */
  isDownloaded: boolean;
}

// ---------------------------------------------------------------------------
// Mock detail factory
// ---------------------------------------------------------------------------

function makeMockPoseDetail(id: string): PoseDetail {
  const idChar = id.charCodeAt(id.length - 1);

  const difficulties = ['easy', 'medium', 'hard'] as const;
  const angles = ['eye-level', 'low angle', 'high angle', 'dutch angle'];
  const lenses = ['50mm', '35mm', '24mm', '85mm', '24–70mm f/2.8'];
  const lightings = [
    'Natural window light from the left',
    'Golden hour soft backlighting',
    'Overcast diffused daylight',
    'Ring light or soft box from front',
    'Side-lit for dramatic shadows',
  ];
  const categories = [
    { id: 'beach', name: 'Beach' },
    { id: 'cafe', name: 'Cafe' },
    { id: 'mountain', name: 'Mountain' },
    { id: 'nature', name: 'Nature' },
    { id: 'wedding', name: 'Wedding' },
    { id: 'festival', name: 'Festival' },
    { id: 'solo', name: 'Solo' },
    { id: 'couple', name: 'Couple' },
    { id: 'selfie', name: 'Selfie' },
    { id: 'golden-hour', name: 'Golden Hour' },
  ];
  const categoryIndex = Math.abs(idChar % categories.length);
  const category = categories[categoryIndex];

  const bodyDirectionsPool = [
    [
      'Stand with feet shoulder-width apart',
      'Turn your body 45° away from the camera',
      'Look back over your shoulder toward the lens',
      'Keep your shoulders relaxed and down',
      'Let your arms hang naturally at your sides',
    ],
    [
      'Sit naturally with your back straight',
      'Cross your legs at the ankle, not the knee',
      'Rest one hand lightly on your thigh',
      'Angle your chin slightly down toward the camera',
      'Relax your facial muscles and smile softly',
    ],
    [
      'Stand tall with your weight on your back foot',
      'Extend your front leg slightly forward',
      'Place one hand on your hip',
      'Keep your chin parallel to the ground',
      'Direct your gaze just past the camera lens',
    ],
  ];
  const bodyDirections = bodyDirectionsPool[Math.abs(idChar % bodyDirectionsPool.length)];

  const titles = [
    'Golden Hour Walk',
    'Beach Stroll',
    'Cafe Corner',
    'Mountain Vista',
    'Nature Walk',
    'Wedding Elegance',
    'Solo Wanderer',
    'Couple Embrace',
    'Selfie Classic',
    'Festival Vibes',
  ];

  return {
    id,
    categoryId: category.id,
    title: titles[Math.abs(idChar % titles.length)],
    description: `A beautiful pose that captures the essence of ${category.name.toLowerCase()} photography. Perfect for both beginners and experienced photographers.`,
    imageUrl: `https://picsum.photos/seed/${id}/800/450`,
    overlayImage: `https://picsum.photos/seed/${id}-overlay/800/450`,
    thumbnailUrl: `https://picsum.photos/seed/${id}/400/225`,
    difficulty: difficulties[Math.abs(idChar % 3)],
    indoor: idChar % 2 === 0,
    tags: [category.name.toLowerCase(), 'portrait', 'lifestyle'],
    views: (idChar * 47 + 100) % 5000,
    downloads: (idChar * 13 + 10) % 1000,
    favorites: (idChar * 7 + 5) % 500,
    estimatedDistance: [1.5, 2.0, 2.5, 3.0][Math.abs(idChar % 4)],
    cameraAngle: angles[Math.abs(idChar % angles.length)],
    lens: lenses[Math.abs(idChar % lenses.length)],
    lighting: lightings[Math.abs(idChar % lightings.length)],
    orientation: idChar % 3 === 0 ? 'landscape' : 'portrait',
    bodyDirections,
    isDownloaded: idChar % 4 === 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  };
}

function makeMockRelated(poseId: string, count = 6): Pose[] {
  return Array.from({ length: count }, (_, i) => {
    const relId = `${poseId}-rel${i + 1}`;
    const detail = makeMockPoseDetail(relId);
    return detail;
  });
}

// ---------------------------------------------------------------------------
// Fetch stubs
// ---------------------------------------------------------------------------

async function fetchPoseDetail(id: string): Promise<PoseDetail> {
  await new Promise((r) => setTimeout(r, 600));
  return makeMockPoseDetail(id);
}

async function fetchRelatedPoses(poseId: string): Promise<Pose[]> {
  await new Promise((r) => setTimeout(r, 400));
  return makeMockRelated(poseId);
}

// ---------------------------------------------------------------------------
// Local favorites helpers (SQLite stub — Task 29 wires real DB)
// ---------------------------------------------------------------------------

function getFavoritesSet(): Set<string> {
  try {
    const raw = mmkv.getString(FAVORITES_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveFavoritesSet(set: Set<string>): void {
  try {
    mmkv.set(FAVORITES_KEY, JSON.stringify([...set]));
  } catch {
    // Silently ignore
  }
}

export function isFavorited(poseId: string): boolean {
  return getFavoritesSet().has(poseId);
}

// ---------------------------------------------------------------------------
// usePoseDetail hook
// ---------------------------------------------------------------------------

export interface UsePoseDetailResult {
  pose: PoseDetail | undefined;
  relatedPoses: Pose[];
  isLoading: boolean;
  isError: boolean;
  isFavorite: boolean;
  downloadProgress: number | null; // null = not downloading, 0–100 = progress
  isDownloaded: boolean;
  toggleFavorite: () => void;
  startDownload: () => void;
  retry: () => void;
}

export function usePoseDetail(poseId: string): UsePoseDetailResult {
  // Favorite state — optimistic local update
  const [isFavorite, setIsFavorite] = useState(() => isFavorited(poseId));

  // Download state stub (real DownloadManager in Task 33)
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const {
    data: pose,
    isLoading,
    isError,
    refetch,
  } = useQuery<PoseDetail, Error>({
    queryKey: ['pose', poseId],
    queryFn: () => fetchPoseDetail(poseId),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
    retry: 2,
    enabled: !!poseId,
  });

  const { data: relatedPoses = [] } = useQuery<Pose[], Error>({
    queryKey: ['pose', poseId, 'related'],
    queryFn: () => fetchRelatedPoses(poseId),
    staleTime: 24 * 60 * 60 * 1000,
    enabled: !!poseId && !isLoading,
  });

  // Set initial downloaded state from pose data once loaded
  const resolvedIsDownloaded = isDownloaded || (pose?.isDownloaded ?? false);

  // ---------------------------------------------------------------------------
  // Optimistic favorite toggle [Req 7.4]
  // ---------------------------------------------------------------------------
  const toggleFavorite = useCallback(() => {
    const next = !isFavorite;
    // 1. Optimistic local update
    setIsFavorite(next);
    const set = getFavoritesSet();
    if (next) {
      set.add(poseId);
    } else {
      set.delete(poseId);
    }
    saveFavoritesSet(set);

    // 2. Background MongoDB sync stub (Task 25 wires real API)
    // In production: offlineQueueStore.enqueue({ type: 'FAVORITE_TOGGLE', poseId, value: next })
  }, [isFavorite, poseId]);

  // ---------------------------------------------------------------------------
  // Download stub [Req 7.5]
  // ---------------------------------------------------------------------------
  const startDownload = useCallback(() => {
    if (resolvedIsDownloaded || downloadProgress !== null) return;

    setDownloadProgress(0);
    // Stub: simulate progress increments (real DownloadManager in Task 33)
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setDownloadProgress(null);
        setIsDownloaded(true);
      } else {
        setDownloadProgress(Math.floor(progress));
      }
    }, 300);
  }, [resolvedIsDownloaded, downloadProgress]);

  const retry = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    pose,
    relatedPoses,
    isLoading,
    isError,
    isFavorite,
    downloadProgress,
    isDownloaded: resolvedIsDownloaded,
    toggleFavorite,
    startDownload,
    retry,
  };
}
