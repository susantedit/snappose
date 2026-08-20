/**
 * useCategories — categories data hook.
 *
 * Provides the full 23-category list with metadata (image, poseCount, isPremium).
 * Uses React Query with staleTime 7d (Req 26).
 *
 * NOTE: Real API/DB connections wired in Tasks 26 and 29.
 * Mock data matches the real Category shape for now.
 *
 * [Req 5.1, 5.2, 5.4]
 */

import { useQuery } from '@tanstack/react-query';
import type { Category } from '@/features/poses/types';

// ---------------------------------------------------------------------------
// Extended category type with search-screen extras
// ---------------------------------------------------------------------------

export interface CategoryWithMeta extends Category {
  /** Whether the category is premium-gated (a few are). */
  isPremium: boolean;
  /** Emoji representative of the category. */
  emoji: string;
}

// ---------------------------------------------------------------------------
// All 23 categories — seeded picsum URLs for real WebP photos [Req 5.1, 5.2]
// ---------------------------------------------------------------------------

export const ALL_CATEGORIES_DATA: CategoryWithMeta[] = [
  {
    id: 'beach',
    name: 'Beach',
    slug: 'beach',
    image: 'https://picsum.photos/seed/beach-sp/400/300',
    icon: '🏖',
    emoji: '🏖',
    color: '#64B5F6',
    totalPoses: 34,
    sortOrder: 1,
    isPremium: false,
  },
  {
    id: 'cafe',
    name: 'Cafe',
    slug: 'cafe',
    image: 'https://picsum.photos/seed/cafe-sp/400/300',
    icon: '☕',
    emoji: '☕',
    color: '#A1887F',
    totalPoses: 28,
    sortOrder: 2,
    isPremium: false,
  },
  {
    id: 'mountain',
    name: 'Mountain',
    slug: 'mountain',
    image: 'https://picsum.photos/seed/mountain-sp/400/300',
    icon: '⛰',
    emoji: '⛰',
    color: '#78909C',
    totalPoses: 31,
    sortOrder: 3,
    isPremium: false,
  },
  {
    id: 'nature',
    name: 'Nature',
    slug: 'nature',
    image: 'https://picsum.photos/seed/nature-sp/400/300',
    icon: '🌿',
    emoji: '🌿',
    color: '#66BB6A',
    totalPoses: 45,
    sortOrder: 4,
    isPremium: false,
  },
  {
    id: 'wedding',
    name: 'Wedding',
    slug: 'wedding',
    image: 'https://picsum.photos/seed/wedding-sp/400/300',
    icon: '💍',
    emoji: '💍',
    color: '#F8BBD9',
    totalPoses: 52,
    sortOrder: 5,
    isPremium: true,
  },
  {
    id: 'festival',
    name: 'Festival',
    slug: 'festival',
    image: 'https://picsum.photos/seed/festival-sp/400/300',
    icon: '🎉',
    emoji: '🎉',
    color: '#FF8A65',
    totalPoses: 29,
    sortOrder: 6,
    isPremium: false,
  },
  {
    id: 'friends',
    name: 'Friends',
    slug: 'friends',
    image: 'https://picsum.photos/seed/friends-sp/400/300',
    icon: '👫',
    emoji: '👫',
    color: '#4DB6AC',
    totalPoses: 38,
    sortOrder: 7,
    isPremium: false,
  },
  {
    id: 'couple',
    name: 'Couple',
    slug: 'couple',
    image: 'https://picsum.photos/seed/couple-sp/400/300',
    icon: '💑',
    emoji: '💑',
    color: '#F48FB1',
    totalPoses: 47,
    sortOrder: 8,
    isPremium: true,
  },
  {
    id: 'solo',
    name: 'Solo',
    slug: 'solo',
    image: 'https://picsum.photos/seed/solo-sp/400/300',
    icon: '🧍',
    emoji: '🧍',
    color: '#7986CB',
    totalPoses: 61,
    sortOrder: 9,
    isPremium: false,
  },
  {
    id: 'selfie',
    name: 'Selfie',
    slug: 'selfie',
    image: 'https://picsum.photos/seed/selfie-sp/400/300',
    icon: '🤳',
    emoji: '🤳',
    color: '#4DD0E1',
    totalPoses: 42,
    sortOrder: 10,
    isPremium: false,
  },
  {
    id: 'luxury',
    name: 'Luxury',
    slug: 'luxury',
    image: 'https://picsum.photos/seed/luxury-sp/400/300',
    icon: '💎',
    emoji: '💎',
    color: '#D6B76A',
    totalPoses: 24,
    sortOrder: 11,
    isPremium: true,
  },
  {
    id: 'car',
    name: 'Car',
    slug: 'car',
    image: 'https://picsum.photos/seed/car-sp/400/300',
    icon: '🚗',
    emoji: '🚗',
    color: '#546E7A',
    totalPoses: 19,
    sortOrder: 12,
    isPremium: false,
  },
  {
    id: 'bike',
    name: 'Bike',
    slug: 'bike',
    image: 'https://picsum.photos/seed/bike-sp/400/300',
    icon: '🚴',
    emoji: '🚴',
    color: '#8D6E63',
    totalPoses: 17,
    sortOrder: 13,
    isPremium: false,
  },
  {
    id: 'gym',
    name: 'Gym',
    slug: 'gym',
    image: 'https://picsum.photos/seed/gym-sp/400/300',
    icon: '🏋',
    emoji: '🏋',
    color: '#EF9A9A',
    totalPoses: 36,
    sortOrder: 14,
    isPremium: false,
  },
  {
    id: 'office',
    name: 'Office',
    slug: 'office',
    image: 'https://picsum.photos/seed/office-sp/400/300',
    icon: '💼',
    emoji: '💼',
    color: '#90A4AE',
    totalPoses: 22,
    sortOrder: 15,
    isPremium: false,
  },
  {
    id: 'traditional',
    name: 'Traditional',
    slug: 'traditional',
    image: 'https://picsum.photos/seed/traditional-sp/400/300',
    icon: '👘',
    emoji: '👘',
    color: '#CE93D8',
    totalPoses: 33,
    sortOrder: 16,
    isPremium: false,
  },
  {
    id: 'fashion',
    name: 'Fashion',
    slug: 'fashion',
    image: 'https://picsum.photos/seed/fashion-sp/400/300',
    icon: '👗',
    emoji: '👗',
    color: '#F06292',
    totalPoses: 58,
    sortOrder: 17,
    isPremium: true,
  },
  {
    id: 'camping',
    name: 'Camping',
    slug: 'camping',
    image: 'https://picsum.photos/seed/camping-sp/400/300',
    icon: '⛺',
    emoji: '⛺',
    color: '#A5D6A7',
    totalPoses: 21,
    sortOrder: 18,
    isPremium: false,
  },
  {
    id: 'forest',
    name: 'Forest',
    slug: 'forest',
    image: 'https://picsum.photos/seed/forest-sp/400/300',
    icon: '🌲',
    emoji: '🌲',
    color: '#388E3C',
    totalPoses: 26,
    sortOrder: 19,
    isPremium: false,
  },
  {
    id: 'snow',
    name: 'Snow',
    slug: 'snow',
    image: 'https://picsum.photos/seed/snow-sp/400/300',
    icon: '❄',
    emoji: '❄',
    color: '#B3E5FC',
    totalPoses: 18,
    sortOrder: 20,
    isPremium: false,
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    slug: 'golden-hour',
    image: 'https://picsum.photos/seed/golden-hour-sp/400/300',
    icon: '🌅',
    emoji: '🌅',
    color: '#FFCC80',
    totalPoses: 39,
    sortOrder: 21,
    isPremium: false,
  },
  {
    id: 'night',
    name: 'Night',
    slug: 'night',
    image: 'https://picsum.photos/seed/night-sp/400/300',
    icon: '🌙',
    emoji: '🌙',
    color: '#5C6BC0',
    totalPoses: 27,
    sortOrder: 22,
    isPremium: false,
  },
  {
    id: 'travel',
    name: 'Travel',
    slug: 'travel',
    image: 'https://picsum.photos/seed/travel-sp/400/300',
    icon: '✈',
    emoji: '✈',
    color: '#26C6DA',
    totalPoses: 55,
    sortOrder: 23,
    isPremium: false,
  },
  {
    id: 'meme',
    name: 'Meme Templates',
    slug: 'meme',
    image: 'https://drive.google.com/thumbnail?id=1mYLUXBtR9vaS6TVvlgzQDEwpGAWeOBaE&sz=w1000',
    icon: '✨',
    emoji: '✨',
    color: '#FF6B6B',
    totalPoses: 22,
    sortOrder: 24,
    isPremium: false,
  },
];

// ---------------------------------------------------------------------------
// SQLite stub — returns empty; replaced in Task 29
// ---------------------------------------------------------------------------

async function fetchCategoriesFromSQLite(): Promise<CategoryWithMeta[]> {
  // Task 29 wires the real SQLite read.
  return [];
}

// ---------------------------------------------------------------------------
// API stub — returns mock data; replaced in Task 26
// ---------------------------------------------------------------------------

async function fetchCategoriesFromAPI(): Promise<CategoryWithMeta[]> {
  // Simulate network latency [Req 5.4]
  await new Promise((r) => setTimeout(r, 600));
  return ALL_CATEGORIES_DATA;
}

// ---------------------------------------------------------------------------
// Combined fetch — SQLite first, then API refresh [Req 5.4]
// ---------------------------------------------------------------------------

async function fetchCategories(): Promise<CategoryWithMeta[]> {
  const local = await fetchCategoriesFromSQLite();
  if (local.length > 0) return local;
  return fetchCategoriesFromAPI();
}

// ---------------------------------------------------------------------------
// React Query hook
// ---------------------------------------------------------------------------

export function useCategories() {
  return useQuery<CategoryWithMeta[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days — Req 26
    gcTime: 14 * 24 * 60 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    // Immediately return mock data as placeholderData so the screen is
    // never blank on the first render [Req 4.3, 35.7]
    placeholderData: ALL_CATEGORIES_DATA,
  });
}
