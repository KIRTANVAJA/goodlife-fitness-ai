import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token required to access this resource',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'goodlife_ai_fitness_jwt_secret_super_secure_key_2026'
    );

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
      error: error.message,
    });
  }
};

/**
 * Entitlement middleware enforcing backend-authoritative subscriptions.
 * Prevents client-side localStorage manipulation from granting premium features.
 */
export const requireSubscription = (minTier = 'gold') => {
  const tierRanks = { free: 0, gold: 1, elite: 2, vip: 3 };

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const sub = req.user.subscription || { tier: 'free', status: 'active' };

    // Check expiration
    const expiry = sub.endDate || sub.expiresAt;
    if (expiry && new Date(expiry) < new Date()) {
      return res.status(403).json({
        success: false,
        code: 'SUBSCRIPTION_EXPIRED',
        message: 'Your premium subscription has expired. Please renew your plan.',
      });
    }

    const normStatus = (sub.status || '').toLowerCase();
    if (normStatus !== 'active' && normStatus !== 'trialing') {
      return res.status(403).json({
        success: false,
        code: 'SUBSCRIPTION_INACTIVE',
        message: 'Active subscription required.',
      });
    }

    const userRank = tierRanks[sub.tier] || 0;
    const requiredRank = tierRanks[minTier] || 1;

    if (userRank < requiredRank) {
      return res.status(403).json({
        success: false,
        code: 'SUBSCRIPTION_UPGRADE_REQUIRED',
        message: `This feature requires a ${minTier.toUpperCase()} tier subscription or higher. Current plan: ${sub.tier}.`,
      });
    }

    next();
  };
};

/**
 * Centralized entitlement middleware for Premium Membership features.
 * Authoritative check retrieved from MongoDB; cannot be bypassed by client-side storage.
 */
export const requirePremium = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  if (!req.user.hasPremiumAccess || !req.user.hasPremiumAccess()) {
    return res.status(403).json({
      success: false,
      code: 'PREMIUM_REQUIRED',
      message: 'This feature requires an active Good Life Fitness AI Premium membership.',
      subscription: req.user.subscription,
    });
  }

  next();
};
