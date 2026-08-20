import type { NormalisedLandmarks } from '@/features/ai/types';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Orientation = 'portrait' | 'landscape';

export interface PoseDNA {
  energy: 'relaxed' | 'confident' | 'dynamic' | 'minimal' | 'intense';
  body: 'front' | '3/4' | 'side' | 'back' | 'seated' | 'leaning';
  head: 'straight' | 'slight turn' | 'tilt' | 'looking away' | 'looking down';
  hands: 'pockets' | 'relaxed' | 'gesture' | 'touch hair/face' | 'holding prop' | 'crossed';
  legs: 'straight' | 'crossed' | 'walking' | 'offset stance' | 'knee bend';
  camera: 'eye level' | 'chest height' | 'low angle' | 'high angle';
  distance: string;
  framing: 'full body' | 'medium shot' | 'close up' | 'environmental portrait';
  light: 'face toward light' | 'side light' | 'golden hour' | 'backlight' | 'window light';
  environment: string;
  difficulty: Difficulty;
  style: string;
  motionLevel: 'static' | 'subtle motion' | 'action';
}

export interface Pose {
  id: string;
  categoryId: string;
  category?: string;
  title: string;
  description: string;
  imageUrl: string;
  overlayImage: string;
  thumbnailUrl: string;
  difficulty: Difficulty;
  instructions?: string[];
  tips?: string[];
  indoor: boolean;
  tags: string[];
  views: number;
  downloads: number;
  favorites: number;
  estimatedDistance: number;
  cameraAngle: string;
  lighting: string;
  orientation: Orientation;
  landmarks?: NormalisedLandmarks;
  poseDna?: PoseDNA;
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
