import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'goodlife_ai_fitness_jwt_secret_super_secure_key_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

// Formatter to maintain consistent user payload
const formatUser = (user) => {
  const isPremium = typeof user.hasPremiumAccess === 'function' 
    ? user.hasPremiumAccess() 
    : (user.subscription?.plan === 'PREMIUM' || (user.subscription?.tier && user.subscription.tier !== 'free'));

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profile: user.profile,
    subscription: {
      plan: user.subscription?.plan || (isPremium ? 'PREMIUM' : 'FREE'),
      tier: user.subscription?.tier || (isPremium ? 'gold' : 'free'),
      status: user.subscription?.status || 'ACTIVE',
      startDate: user.subscription?.startDate,
      endDate: user.subscription?.endDate || user.subscription?.expiresAt,
      hasPremiumAccess: isPremium,
    },
    createdAt: user.createdAt,
  };
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, profile } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      profile: profile || {},
      subscription: {
        tier: 'free',
        status: 'active',
      },
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.body.name) user.name = req.body.name.trim();

    if (req.body.profile) {
      user.profile = {
        ...user.profile.toObject(),
        ...req.body.profile,
      };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user subscription in MongoDB (Authoritative)
// @route   PUT /api/v1/auth/subscription
// @access  Private
export const updateSubscription = async (req, res, next) => {
  try {
    const { tier } = req.body;
    const validTiers = ['free', 'gold', 'elite', 'vip', 'premium'];
    if (!validTiers.includes(tier)) {
      return res.status(400).json({ success: false, message: 'Invalid subscription tier' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isPremium = tier !== 'free';
    user.subscription = {
      plan: isPremium ? 'PREMIUM' : 'FREE',
      tier,
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: isPremium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
      provider: 'internal',
    };

    await user.save();

    res.json({
      success: true,
      message: `Subscription successfully updated to ${tier.toUpperCase()}`,
      subscription: user.subscription,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upgrade to Premium Membership
// @route   POST /api/v1/auth/subscription/upgrade
// @access  Private
export const upgradeToPremium = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.subscription = {
      plan: 'PREMIUM',
      tier: 'gold',
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days active
      provider: 'internal',
    };

    await user.save();

    res.json({
      success: true,
      message: 'Upgraded to Good Life Fitness AI Premium successfully',
      subscription: user.subscription,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel Premium Membership (Access retained until endDate)
// @route   POST /api/v1/auth/subscription/cancel
// @access  Private
export const cancelSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.subscription.plan !== 'PREMIUM') {
      return res.status(400).json({
        success: false,
        message: 'No active premium subscription to cancel',
      });
    }

    user.subscription.status = 'CANCELLED';
    await user.save();

    res.json({
      success: true,
      message: 'Subscription marked as cancelled. Premium benefits remain active until the end of your billing cycle.',
      subscription: user.subscription,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Authoritative Subscription & Entitlement Status
// @route   GET /api/v1/auth/subscription/status
// @access  Private
export const getSubscriptionStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isPremium = typeof user.hasPremiumAccess === 'function' ? user.hasPremiumAccess() : false;

    res.json({
      success: true,
      data: {
        plan: user.subscription?.plan || 'FREE',
        tier: user.subscription?.tier || 'free',
        status: user.subscription?.status || 'ACTIVE',
        startDate: user.subscription?.startDate,
        endDate: user.subscription?.endDate,
        hasPremiumAccess: isPremium,
        features: {
          aiCameraCoach: isPremium,
          realtimePoseTracking: isPremium,
          biomechanicalRepCounting: isPremium,
          validatedFormFeedback: isPremium,
          advancedAiDietPlanning: isPremium,
          advancedWorkoutAnalytics: isPremium,
          publicBmiCalculator: true,
          basicExerciseCatalog: true,
          basicDietPlanner: true,
          basicWorkoutHistory: true,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
