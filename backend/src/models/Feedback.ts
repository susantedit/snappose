import { Schema, model, Document } from 'mongoose';

export interface IFeedback extends Document {
  userId: string;
  type: string;
  message: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    userId: { type: String, required: true },
    type: { type: String, default: 'feedback' },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const FeedbackModel = model<IFeedback>('Feedback', FeedbackSchema);
