import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFavorites, toggleFavorite } from '@/services/api/favorites';
import { SQLiteFavoritesRepository } from '@/features/favorites/infrastructure/SQLiteFavoritesRepository';
import { enqueueMutation } from '@/stores/offlineQueueStore';

const sqliteFavs = new SQLiteFavoritesRepository();

export function useFavorites() {
  return useQuery<string[]>({
    queryKey: ['favorites'],
    queryFn: async () => {
      try {
        const remoteFavs = await fetchFavorites();
        const remoteIds = remoteFavs.map((f) => f.poseId);
        // Sync local SQLite
        for (const id of remoteIds) {
          await sqliteFavs.add(id);
        }
        return remoteIds;
      } catch (err) {
        const localFavs = await sqliteFavs.findAll();
        return localFavs.map((f) => f.poseId);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ poseId, isFavorite }: { poseId: string; isFavorite: boolean }) => {
      // Optimistically update SQLite immediately
      if (isFavorite) {
        await sqliteFavs.add(poseId);
      } else {
        await sqliteFavs.remove(poseId);
      }

      try {
        await toggleFavorite(poseId, isFavorite);
      } catch (err) {
        // Queue for background retry if network fails
        enqueueMutation('TOGGLE_FAVORITE', { poseId, isFavorite });
      }
    },
    onMutate: async ({ poseId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      const previousFavs = queryClient.getQueryData<string[]>(['favorites']) || [];

      let updatedFavs: string[];
      if (isFavorite) {
        updatedFavs = [...previousFavs, poseId];
      } else {
        updatedFavs = previousFavs.filter((id) => id !== poseId);
      }

      queryClient.setQueryData(['favorites'], updatedFavs);
      return { previousFavs };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousFavs) {
        queryClient.setQueryData(['favorites'], context.previousFavs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}
