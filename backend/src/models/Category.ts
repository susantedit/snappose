import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
  id: string;
  name: string;
  slug: string;
  image: string;
  icon: string;
  color: string;
  totalPoses: number;
  sortOrder: number;
}

const CategorySchema = new Schema<ICategory>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    icon: { type: String, default: 'camera' },
    color: { type: String, default: '#65744A' },
    totalPoses: { type: Number, default: 0 },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CategoryModel = model<ICategory>('Category', CategorySchema);
