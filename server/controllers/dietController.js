import DietPlan from '../models/DietPlan.js';
import { generateDailyDietPlan, generatePremiumWeeklyPlan } from '../services/dietService.js';

// @desc    Generate Free / Standard Daily Diet Plan
// @route   POST /api/v1/diet/generate
// @access  Public (Optional auth for profile sync)
export const getDailyDietPlan = async (req, res, next) => {
  try {
    const {
      fitnessGoal,
      dietaryPreference,
      allergies,
      restrictions,
      cuisine,
      targetCalories,
    } = req.body;

    const userWeight = req.user?.profile?.weightKg || 70;

    const plan = generateDailyDietPlan({
      fitnessGoal: fitnessGoal || req.user?.profile?.primaryGoal || 'general_fitness',
      dietaryPreference: dietaryPreference || 'veg',
      allergies: allergies || [],
      restrictions: restrictions || [],
      cuisine: cuisine || 'Indian',
      targetCalories: targetCalories || null,
      bodyWeightKg: userWeight,
    });

    res.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate Premium Weekly Meal Plan & Shopping Logistics
// @route   POST /api/v1/diet/premium-plan
// @access  Private (Guarded by requirePremium)
export const getPremiumDietPlan = async (req, res, next) => {
  try {
    const {
      fitnessGoal,
      dietaryPreference,
      allergies,
      cuisine,
    } = req.body;

    const userWeight = req.user?.profile?.weightKg || 70;

    const premiumPlan = generatePremiumWeeklyPlan({
      fitnessGoal: fitnessGoal || req.user?.profile?.primaryGoal || 'general_fitness',
      dietaryPreference: dietaryPreference || 'veg',
      allergies: allergies || [],
      cuisine: cuisine || 'Indian',
      bodyWeightKg: userWeight,
    });

    res.json({
      success: true,
      data: premiumPlan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save a generated diet plan to user account in MongoDB
// @route   POST /api/v1/diet/plans or POST /api/v1/diet-plans
// @access  Private
export const saveDietPlan = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      planName,
      fitnessGoal,
      dietaryPreference,
      allergies,
      restrictions,
      cuisine,
      dailyCaloricTarget,
      macronutrientDistribution,
      mealBreakdown,
      hydrationRecommendationLiters,
      notes,
    } = req.body;

    if (!dailyCaloricTarget || !mealBreakdown || mealBreakdown.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'A complete nutrition plan structure with meal breakdown is required to save.',
      });
    }

    const savedPlan = await DietPlan.create({
      user: userId,
      planName: planName || 'Personalized Nutrition Blueprint',
      fitnessGoal: fitnessGoal || req.user?.profile?.primaryGoal || 'general_fitness',
      dietaryPreference: dietaryPreference || 'veg',
      allergies: allergies || [],
      restrictions: restrictions || [],
      cuisine: cuisine || 'Indian',
      dailyCaloricTarget: Number(dailyCaloricTarget),
      macronutrientDistribution: macronutrientDistribution || { proteinGrams: 0, carbsGrams: 0, fatGrams: 0 },
      mealBreakdown,
      hydrationRecommendationLiters: hydrationRecommendationLiters || 3.0,
      notes: notes || '',
      status: 'active',
    });

    res.status(201).json({
      success: true,
      data: savedPlan,
      message: 'Nutrition blueprint saved to your profile successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all saved diet plans for authenticated user
// @route   GET /api/v1/diet/plans or GET /api/v1/diet-plans
// @access  Private
export const getUserDietPlans = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const plans = await DietPlan.find({ user: userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single diet plan by ID
// @route   GET /api/v1/diet/plans/:id or GET /api/v1/diet-plans/:id
// @access  Private
export const getDietPlanById = async (req, res, next) => {
  try {
    const plan = await DietPlan.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found or access denied.',
      });
    }

    res.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a saved diet plan
// @route   PUT /api/v1/diet/plans/:id or PUT /api/v1/diet-plans/:id
// @access  Private
export const updateDietPlan = async (req, res, next) => {
  try {
    const plan = await DietPlan.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found or access denied.',
      });
    }

    const {
      planName,
      status,
      notes,
    } = req.body;

    if (planName) plan.planName = planName;
    if (status) plan.status = status;
    if (notes !== undefined) plan.notes = notes;

    await plan.save();

    res.json({
      success: true,
      data: plan,
      message: 'Diet plan updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a saved diet plan
// @route   DELETE /api/v1/diet/plans/:id or DELETE /api/v1/diet-plans/:id
// @access  Private
export const deleteDietPlan = async (req, res, next) => {
  try {
    const plan = await DietPlan.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found or access denied.',
      });
    }

    res.json({
      success: true,
      message: 'Diet plan deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
