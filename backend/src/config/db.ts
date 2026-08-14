import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/snap-pose';
  try {
    await mongoose.connect(uri);
    console.log('[Database] MongoDB Atlas connected successfully');
  } catch (err) {
    console.error('[Database] MongoDB connection failed:', err);
    // Don't crash process in development if DB is un-reachable
  }
}
