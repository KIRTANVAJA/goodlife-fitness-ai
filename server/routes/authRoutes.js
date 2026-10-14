import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  updateSubscription,
  upgradeToPremium,
  cancelSubscription,
  getSubscriptionStatus,
} from '../controllers/authController.js';
import { protect, requireSubscription, requirePremium } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Subscription & Entitlements
router.put('/subscription', protect, updateSubscription);
router.post('/subscription/upgrade', protect, upgradeToPremium);
router.post('/subscription/cancel', protect, cancelSubscription);
router.get('/subscription/status', protect, getSubscriptionStatus);

// Sample premium-protected endpoint to test backend entitlement check
router.get('/premium-features', protect, requireSubscription('gold'), (req, res) => {
  res.json({
    success: true,
    data: {
      vipAccess: true,
      features: [
        'Advanced Biomechanical Vector Telemetry',
        'Direct Head Coach Messaging',
        'Custom Macro Diet Logistics',
      ],
    },
  });
});

export default router;
