/**
 * usePoseDetail — data hook for the Pose Detail screen.
 * Resolves pose from SNAP_POSE_DATASET with full instructions, pro tips,
 * related poses, and persistent favorites.
 */

import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mmkv } from '@/database/mmkv/mmkvClient';
import type { Pose } from '@/features/poses/types';
import { SNAP_POSE_DATASET } from '../data/posesData';

const FAVORITES_KEY = 'favorites';

export interface PoseDetail extends Pose {
  lens: string;
  bodyDirections: string[];
  isDownloaded: boolean;
}

function getPoseFromDataset(id: string): PoseDetail {
  const found = SNAP_POSE_DATASET.find((p) => p.id === id);
  if (found) {
    return {
      ...found,
      lens: '50mm f/1.8',
      bodyDirections: found.instructions ?? [
        'Stand naturally with relaxed shoulders.',
        'Angle your body 30 degrees to the camera.',
        'Look slightly off-camera with a confident gaze.',
      ],
      isDownloaded: true,
    };
  }

  // Fallback if id not in initial dataset
  const fallback = SNAP_POSE_DATASET[0];
  return {
    ...fallback,
    id,
    lens: '35mm f/2.0',
    bodyDirections: fallback.instructions ?? [],
    isDownloaded: false,
  };
}

function getRelated(poseId: string): Pose[] {
  const current = SNAP_POSE_DATASET.find((p) => p.id === poseId);
  if (!current) return SNAP_POSE_DATASET.slice(0, 4);

  // Return poses from same category or complementary
  const sameCat = SNAP_POSE_DATASET.filter((p) => p.id !== poseId && p.categoryId === current.categoryId);
  if (sameCat.length >= 3) return sameCat.slice(0, 4);

  const others = SNAP_POSE_DATASET.filter((p) => p.id !== poseId && p.categoryId !== current.categoryId);
  return [...sameCat, ...others].slice(0, 4);
}

function getFavoritesSet(): Set<string> {
  try {
    const raw = mmkv.getString(FAVORITES_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Could be Pose[] or string[]
      if (parsed.length > 0 && typeof parsed[0] === 'object') {
        return new Set(parsed.map((p: any) => p.id));
      }
      return new Set(parsed);
    }
    return new Set();
  } catch {
    return new Set();
  }
}

function saveFavoritesSet(set: Set<string>): void {
  try {
    // Keep favorites in sync with full Pose objects for useFavorites hook
    const ids = [...set];
    const favPoses = ids.map((id) => SNAP_POSE_DATASET.find((p) => p.id === id) ?? getPoseFromDataset(id));
    mmkv.set(FAVORITES_KEY, JSON.stringify(favPoses));
  } catch {
    // Silently ignore
  }
}

export function isFavorited(poseId: string): boolean {
  return getFavoritesSet().has(poseId);
}

export interface UsePoseDetailResult {
  pose: PoseDetail | undefined;
  relatedPoses: Pose[];
  isLoading: boolean;
  isError: boolean;
  isFavorite: boolean;
  downloadProgress: number | null;
  isDownloaded: boolean;
  toggleFavorite: () => void;
  startDownload: () => void;
  retry: () => void;
}

export function usePoseDetail(poseId: string): UsePoseDetailResult {
  const [isFavorite, setIsFavorite] = useState(() => isFavorited(poseId));
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const {
    data: pose,
    isLoading,
    isError,
    refetch,
  } = useQuery<PoseDetail, Error>({
    queryKey: ['pose', poseId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 150));
      return getPoseFromDataset(poseId);
    },
    staleTime: 24 * 60 * 60 * 1000,
    enabled: !!poseId,
  });

  const { data: relatedPoses = [] } = useQuery<Pose[], Error>({
    queryKey: ['pose', poseId, 'related'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 100));
      return getRelated(poseId);
    },
    staleTime: 24 * 60 * 60 * 1000,
    enabled: !!poseId,
  });

  const resolvedIsDownloaded = isDownloaded || (pose?.isDownloaded ?? false);

  const toggleFavorite = useCallback(() => {
    const next = !isFavorite;
    setIsFavorite(next);
    const set = getFavoritesSet();
    if (next) {
      set.add(poseId);
    } else {
      set.delete(poseId);
    }
    saveFavoritesSet(set);
  }, [isFavorite, poseId]);

  const startDownload = useCallback(() => {
    if (resolvedIsDownloaded || downloadProgress !== null) return;
    setDownloadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 15;
      if (progress >= 100) {
        clearInterval(interval);
        setDownloadProgress(null);
        setIsDownloaded(true);
      } else {
        setDownloadProgress(Math.floor(progress));
      }
    }, 200);
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
