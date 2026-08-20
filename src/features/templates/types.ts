/**
 * Template System Types — POSEHANUM
 *
 * Extends the existing Pose + PoseDNA architecture with a full
 * template model supporting remix, creator attribution, shot recipe,
 * and editorial metadata.
 */

import type { PoseDNA, Difficulty } from '@/features/poses/types';

// ---------------------------------------------------------------------------
// Creator
// ---------------------------------------------------------------------------

export interface Creator {
  uid: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string;
  isVerified: boolean;
  templateCount: number;
  followerCount: number;
  totalUses: number;
}

// ---------------------------------------------------------------------------
// Shot Recipe
// ---------------------------------------------------------------------------

export interface ShotRecipe {
  pose: string;
  cameraAngle: string;
  cameraDistance: string;
  lighting: string;
  expression: string;
  background: string;
  composition: string;
  lensSuggestion?: string;
  timingTip?: string;
}

// ---------------------------------------------------------------------------
// Template Text/Sticker Layer
// ---------------------------------------------------------------------------

export interface TextLayer {
  id: string;
  text: string;
  fontSize: number;
  fontWeight: '400' | '600' | '700' | '800';
  color: string;
  alignment: 'left' | 'center' | 'right';
  opacity: number;
  rotation: number;
  x: number;
  y: number;
  shadow?: boolean;
  outline?: boolean;
}

export interface StickerLayer {
  id: string;
  emoji: string;
  size: number;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
}

// ---------------------------------------------------------------------------
// Template
// ---------------------------------------------------------------------------

export type TemplateCategory =
  | 'trending'
  | 'couple'
  | 'meme'
  | 'beach'
  | 'cafe'
  | 'nature'
  | 'trek'
  | 'selfie'
  | 'gym'
  | 'fashion'
  | 'wedding'
  | 'festival'
  | 'travel'
  | 'cinematic'
  | 'editorial'
  | 'street'
  | 'portrait'
  | 'golden-hour'
  | 'night'
  | 'solo'
  | 'group';

export type TemplateVibe =
  | 'confident'
  | 'relaxed'
  | 'dramatic'
  | 'playful'
  | 'elegant'
  | 'dynamic'
  | 'minimal'
  | 'romantic'
  | 'editorial'
  | 'cinematic';

export type TemplateStatus = 'draft' | 'published' | 'archived';

export interface Template {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;

  // Pose & camera
  poseId?: string;
  poseName: string;
  poseDna: PoseDNA;
  shotRecipe: ShotRecipe;
  instructions: string[];
  tips: string[];

  // Metadata
  category: TemplateCategory;
  tags: string[];
  difficulty: Difficulty;
  vibe: TemplateVibe;
  occasion: string;
  location?: string;

  // Creator
  creator: Creator;
  isUserCreated: boolean;

  // Editorial layers
  textLayers: TextLayer[];
  stickerLayers: StickerLayer[];
  backgroundColor?: string;
  backgroundGradient?: [string, string];

  // Stats
  views: number;
  uses: number;
  likes: number;
  shares: number;
  remixCount: number;
  isFeatured: boolean;
  isNew: boolean;

  // State
  status: TemplateStatus;
  remixedFromId?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Template actions
// ---------------------------------------------------------------------------

export type TemplateAction =
  | 'use'
  | 'remix'
  | 'save'
  | 'favorite'
  | 'share'
  | 'copy'
  | 'create_variation'
  | 'edit'
  | 'report'
  | 'hide'
  | 'follow_creator'
  | 'delete';

// ---------------------------------------------------------------------------
// Template Store State
// ---------------------------------------------------------------------------

export interface TemplateStoreState {
  savedTemplateIds: string[];
  likedTemplateIds: string[];
  userCreatedTemplates: Template[];
  draftTemplates: Template[];
  recentlyUsedIds: string[];
}

// ---------------------------------------------------------------------------
// Template Editor State
// ---------------------------------------------------------------------------

export interface TemplateEditorState {
  template: Partial<Template>;
  textLayers: TextLayer[];
  stickerLayers: StickerLayer[];
  undoStack: TemplateEditorSnapshot[];
  redoStack: TemplateEditorSnapshot[];
  isDirty: boolean;
}

export interface TemplateEditorSnapshot {
  textLayers: TextLayer[];
  stickerLayers: StickerLayer[];
  timestamp: number;
}
