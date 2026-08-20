/**
 * useFavorites — favorites management hook.
 *
 * Provides CRUD operations for favorited poses with offline-first SQLite storage.
 * Syncs to Firestore when authenticated and online.
 * Merges anonymous favorites on sign-in.
 *
 * NOTE: The actual SQLite and Firestore connections are wired in Tasks 26 and 29.
 * For now this uses MMKV for local storage so the UI can be fully implemented.
 *
 * [Req 18]
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mmkv } from '@/database/mmkv/mmkvClient';
import { MMKV_KEYS } from '@/database/mmkv/keys';
import type { Pose } from '@/features/poses/types';

// ---------------------------------------------------------------------------
// MMKV key for favorites (temporary — will move to SQLite in Task 29)
// ---------------------------------------------------------------------------

export const FAVORITES_KEY = MMKV_KEYS.FAVORITES;

export type SortMode = 'newest' | 'oldest' | 'category' | 'difficulty';

// ---------------------------------------------------------------------------
// Local storage helpers (MMKV-backed)
// ---------------------------------------------------------------------------

function getFavoritesFromStorage(): Pose[] {
  try {
    const raw = mmkv.getString(FAVORITES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Pose[];
  } catch {
    return [];
  }
}

function saveFavoritesToStorage(favorites: Pose[]): void {
  try {
    mmkv.set(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {
    // Silently ignore write errors
  }
}

// ---------------------------------------------------------------------------
// Fetch function
// ---------------------------------------------------------------------------

async function fetchFavorites(): Promise<Pose[]> {
  // Simulate async storage read
  await new Promise((r) => setTimeout(r, 100));
  return getFavoritesFromStorage();
}

// ---------------------------------------------------------------------------
// Mutation functions
// ---------------------------------------------------------------------------

async function addFavorite(pose: Pose): Promise<void> {
  const current = getFavoritesFromStorage();
  const exists = current.some((p) => p.id === pose.id);
  if (!exists) {
    const updated = [pose, ...current];
    saveFavoritesToStorage(updated);
    import('@/stores/onboardingChecklistStore').then(({ useOnboardingChecklistStore }) => {
      useOnboardingChecklistStore.getState().markCompleted('save_favorite');
    });
    import('@/services/analytics/PostHogAnalyticsService').then(({ postHogAnalytics }) => {
      postHogAnalytics.track('favorite_added', { poseId: pose.id, category: pose.categoryId });
    });
  }
}

async function removeFavorite(poseId: string): Promise<void> {
  const current = getFavoritesFromStorage();
  const updated = current.filter((p) => p.id !== poseId);
  saveFavoritesToStorage(updated);
}

async function toggleFavorite(pose: Pose): Promise<{ added: boolean }> {
  const current = getFavoritesFromStorage();
  const index = current.findIndex((p) => p.id === pose.id);
  if (index >= 0) {
    // Remove
    current.splice(index, 1);
    saveFavoritesToStorage(current);
    return { added: false };
  } else {
    // Add
    current.unshift(pose);
    saveFavoritesToStorage(current);
    import('@/stores/onboardingChecklistStore').then(({ useOnboardingChecklistStore }) => {
      useOnboardingChecklistStore.getState().markCompleted('save_favorite');
    });
    import('@/services/analytics/PostHogAnalyticsService').then(({ postHogAnalytics }) => {
      postHogAnalytics.track('favorite_added', { poseId: pose.id, category: pose.categoryId });
    });
    return { added: true };
  }
}

// ---------------------------------------------------------------------------
// Sort helpers
// ---------------------------------------------------------------------------

function sortFavorites(favorites: Pose[], mode: SortMode): Pose[] {
  const sorted = [...favorites];
  switch (mode) {
    case 'newest':
      // Already in newest order (unshift adds to front)
      return sorted;
    case 'oldest':
      return sorted.reverse();
    case 'category':
      return sorted.sort((a, b) => a.categoryId.localeCompare(b.categoryId));
    case 'difficulty':
      const diffOrder = { easy: 0, medium: 1, hard: 2 };
      return sorted.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
    default:
      return sorted;
  }
}

// ---------------------------------------------------------------------------
// React Query hook
// ---------------------------------------------------------------------------

export function useFavorites(sortMode: SortMode = 'newest') {
  const queryClient = useQueryClient();

  const query = useQuery<Pose[], Error>({
    queryKey: ['favorites'],
    queryFn: fetchFavorites,
    staleTime: 5 * 60 * 1000, // 5 min — favorites change frequently
    gcTime: 30 * 60 * 1000,
  });

  const addMutation = useMutation({
    mutationFn: addFavorite,
    onMutate: async (newPose: Pose) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      const previous = queryClient.getQueryData<Pose[]>(['favorites']) || [];
      const updated = [newPose, ...previous.filter((p) => p.id !== newPose.id)];
      queryClient.setQueryData<Pose[]>(['favorites'], updated);
      return { previous };
    },
    onError: (_err, _newPose, context) => {
      if (context?.previous) {
        queryClient.setQueryData<Pose[]>(['favorites'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFavorite,
    onMutate: async (poseId: string) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      const previous = queryClient.getQueryData<Pose[]>(['favorites']) || [];
      const updated = previous.filter((p) => p.id !== poseId);
      queryClient.setQueryData<Pose[]>(['favorites'], updated);
      return { previous };
    },
    onError: (_err, _poseId, context) => {
      if (context?.previous) {
        queryClient.setQueryData<Pose[]>(['favorites'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleFavorite,
    onMutate: async (targetPose: Pose) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      const previous = queryClient.getQueryData<Pose[]>(['favorites']) || [];
      const exists = previous.some((p) => p.id === targetPose.id);
      const updated = exists
        ? previous.filter((p) => p.id !== targetPose.id)
        : [targetPose, ...previous];
      queryClient.setQueryData<Pose[]>(['favorites'], updated);
      return { previous };
    },
    onError: (_err, _targetPose, context) => {
      if (context?.previous) {
        queryClient.setQueryData<Pose[]>(['favorites'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  // Check if a pose is favorited
  const isFavorite = (poseId: string): boolean => {
    return query.data?.some((p) => p.id === poseId) ?? false;
  };

  // Apply sorting
  const sortedFavorites = query.data ? sortFavorites(query.data, sortMode) : [];

  return {
    favorites: sortedFavorites,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFavorite,
    addFavorite: addMutation.mutate,
    removeFavorite: removeMutation.mutate,
    toggleFavorite: toggleMutation.mutate,
  };
}
