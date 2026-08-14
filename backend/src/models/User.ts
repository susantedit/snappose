import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  uid: string;
  email?: string;
  displayName?: string;
  isAnonymous: boolean;
  captureStats: {
    totalCaptures: number;
    windowStartTime: number; // ms timestamp
    windowCaptureCount: number;
    bonusCaptures: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    uid: { type: String, required: true, unique: true, index: true },
    email: { type: String },
    displayName: { type: String },
    isAnonymous: { type: Boolean, default: true },
    captureStats: {
      totalCaptures: { type: Number, default: 0 },
      windowStartTime: { type: Number, default: Date.now },
      windowCaptureCount: { type: Number, default: 0 },
      bonusCaptures: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>('User', UserSchema);
