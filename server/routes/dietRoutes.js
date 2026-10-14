import express from 'express';
import {
  getDailyDietPlan,
  getPremiumDietPlan,
  saveDietPlan,
  getUserDietPlans,
  getDietPlanById,
  updateDietPlan,
  deleteDietPlan,
} from '../controllers/dietController.js';
import { protect, requirePremium } from '../middleware/auth.js';

const router = express.Router();

// Free Diet Planning generator (Publicly accessible or authenticated)
router.post('/generate', getDailyDietPlan);

// Premium Weekly Diet Planning (Guarded by JWT protect and requirePremium)
router.post('/premium-plan', protect, requirePremium, getPremiumDietPlan);

// Saved Diet Plans Persistence (Guarded by JWT protect, user-isolated)
router.route('/plans')
  .post(protect, saveDietPlan)
  .get(protect, getUserDietPlans);

router.route('/plans/:id')
  .get(protect, getDietPlanById)
  .put(protect, updateDietPlan)
  .delete(protect, deleteDietPlan);

export default router;
