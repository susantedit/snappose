import { Schema, model, Document } from 'mongoose';

export interface IFavorite extends Document {
  userId: string;
  poseId: string;
  createdAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    userId: { type: String, required: true, index: true },
    poseId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

FavoriteSchema.index({ userId: 1, poseId: 1 }, { unique: true });

export const FavoriteModel = model<IFavorite>('Favorite', FavoriteSchema);
