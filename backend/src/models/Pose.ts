import { Schema, model, Document } from 'mongoose';

export interface IPose extends Document {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  imageUrl: string;
  overlayImage: string;
  thumbnailUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  indoor: boolean;
  tags: string[];
  views: number;
  downloads: number;
  favorites: number;
  estimatedDistance: number;
  cameraAngle: string;
  lighting: string;
  orientation: 'portrait' | 'landscape';
  createdAt: Date;
  updatedAt: Date;
}

const PoseSchema = new Schema<IPose>(
  {
    id: { type: String, required: true, unique: true, index: true },
    categoryId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, required: true },
    overlayImage: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    indoor: { type: Boolean, default: true },
    tags: [{ type: String, index: true }],
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    estimatedDistance: { type: Number, default: 2.0 },
    cameraAngle: { type: String, default: 'Eye Level' },
    lighting: { type: String, default: 'Natural Soft Light' },
    orientation: { type: String, enum: ['portrait', 'landscape'], default: 'portrait' },
  },
  { timestamps: true }
);

export const PoseModel = model<IPose>('Pose', PoseSchema);
