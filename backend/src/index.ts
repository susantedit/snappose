import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import posesRouter from './routes/poses';
import categoriesRouter from './routes/categories';
import favoritesRouter from './routes/favorites';
import capturesRouter from './routes/captures';
import configRouter from './routes/config';
import feedbackRouter from './routes/feedback';
import { success } from './utils/response';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security & Optimization Middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Health Check
app.get('/health', (_req, res) => {
  res.json(success({ status: 'ok', service: 'snap-pose-backend', timestamp: new Date().toISOString() }));
});

// API Routes
app.use('/api/poses', posesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/captures', capturesRouter);
app.use('/api/app-config', configRouter);
app.use('/api/feedback', feedbackRouter);

// Initialize DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Snap Pose Backend] API Server listening on port ${PORT}`);
  });
});

export default app;
