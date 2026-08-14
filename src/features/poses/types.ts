/**
 * Poses feature types.
 * [Req 4, 5, 7]
 */

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Orientation = 'portrait' | 'landscape';

export interface Pose {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  imageUrl: string;
  overlayImage: string;
  thumbnailUrl: string;
  difficulty: Difficulty;
  indoor: boolean;
  tags: string[];
  views: number;
  downloads: number;
  favorites: number;
  estimatedDistance: number;
  cameraAngle: string;
  lighting: string;
  orientation: Orientation;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  icon: string;
  color: string;
  totalPoses: number;
  sortOrder: number;
}

export interface SearchQuery {
  keyword?: string;
  categoryId?: string;
  difficulty?: Difficulty;
  orientation?: Orientation;
  indoor?: boolean;
}

export interface PagedResult<T> {
  items: T[];
  cursor?: string;
  hasMore: boolean;
  total: number;
}
