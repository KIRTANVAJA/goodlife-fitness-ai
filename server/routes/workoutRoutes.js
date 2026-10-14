import express from 'express';
import {
  createSession,
  getUserSessions,
  getSessionById,
  updateSession,
  getUserStats,
} from '../controllers/workoutController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All workout routes require authenticated user

router.post('/sessions', createSession);
router.get('/sessions', getUserSessions);
router.get('/sessions/:id', getSessionById);
router.patch('/sessions/:id', updateSession);
router.get('/stats', getUserStats);

export default router;
