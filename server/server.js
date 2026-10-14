import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/error.js';
import { ensureExercisesSeeded } from './controllers/exerciseController.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import dietRoutes from './routes/dietRoutes.js';
import bodyMeasurementRoutes from './routes/bodyMeasurementRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  // Check if exercises need auto-seeding
  ensureExercisesSeeded();
});

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Good Life Fitness AI API',
    version: '1.0.0',
  });
});

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/exercises', exerciseRoutes);
app.use('/api/v1/workouts', workoutRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);
app.use('/api/v1/diet', dietRoutes);
app.use('/api/v1/body', bodyMeasurementRoutes);

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`,
  });
});

// Centralized error handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`[Good Life Fitness AI] Server listening on port ${PORT}`);
  console.log(`[Good Life Fitness AI] API Base URL: http://localhost:${PORT}/api/v1`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

export default app;
