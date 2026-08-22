import mongoose, { Document, Schema } from 'mongoose';

export type TemplateVisibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
export type ModerationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REMOVED';

export interface ITemplate extends Document {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail: string;
  previewMedia?: string;
  poseId?: string;
  poseDNA?: Record<string, unknown>;
  shotRecipe?: Record<string, unknown>;
  layers?: Array<Record<string, unknown>>;
  textElements?: Array<Record<string, unknown>>;
  stickers?: Array<Record<string, unknown>>;
  background?: Record<string, unknown>;
  cameraAngle?: string;
  distance?: string;
  lighting?: string;
  expression?: string;
  difficulty?: string;
  trendScore: number;
  likes: number;
  uses: number;
  remixes: number;
  status: string;
  reportCount?: number;
  moderationStatus: ModerationStatus;
  visibility: TemplateVisibility;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    id: { type: String, required: true, unique: true, index: true },
    creatorId: { type: String, required: true, index: true },
    creatorName: { type: String, required: true },
    creatorAvatar: { type: String },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, required: true, index: true },
    tags: [{ type: String, index: true }],
    thumbnail: { type: String, required: true },
    previewMedia: { type: String },
    poseId: { type: String, index: true },
    poseDNA: { type: Schema.Types.Mixed },
    shotRecipe: { type: Schema.Types.Mixed },
    layers: [{ type: Schema.Types.Mixed }],
    textElements: [{ type: Schema.Types.Mixed }],
    stickers: [{ type: Schema.Types.Mixed }],
    background: { type: Schema.Types.Mixed },
    cameraAngle: { type: String, default: 'Eye level' },
    distance: { type: String, default: '2m' },
    lighting: { type: String, default: 'Natural' },
    expression: { type: String, default: 'Natural' },
    difficulty: { type: String, default: 'easy' },
    trendScore: { type: Number, default: 50, index: true },
    likes: { type: Number, default: 0, index: true },
    uses: { type: Number, default: 0, index: true },
    remixes: { type: Number, default: 0, index: true },
    status: { type: String, default: 'published', index: true },
    reportCount: { type: Number, default: 0 },
    moderationStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'REMOVED'],
      default: 'APPROVED',
      index: true,
    },
    visibility: {
      type: String,
      enum: ['PUBLIC', 'PRIVATE', 'UNLISTED'],
      default: 'PUBLIC',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Template = mongoose.model<ITemplate>('Template', TemplateSchema);
export default Template;
