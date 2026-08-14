import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/services/api/categories';
import type { Category } from '@/features/poses/types';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        return await fetchCategories();
      } catch (err) {
        return [];
      }
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}
