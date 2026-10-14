import mongoose from 'mongoose';

const mealItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  portion: { type: String, required: true },
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
});

const mealSchema = new mongoose.Schema({
  mealName: { type: String, required: true }, // e.g., 'Breakfast', 'Lunch', 'Dinner', 'Post-Workout Snack'
  scheduledTime: { type: String, default: '' },
  items: [mealItemSchema],
  totalMealCalories: { type: Number, default: 0 },
  notes: { type: String, default: '' },
});

const dietPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    planName: {
      type: String,
      required: true,
      default: 'Personalized Nutrition Blueprint',
    },
    fitnessGoal: {
      type: String,
      required: true,
      default: 'general_fitness',
    },
    dietaryPreference: {
      type: String,
      required: true,
      default: 'veg',
    },
    allergies: {
      type: [String],
      default: [],
    },
    restrictions: {
      type: [String],
      default: [],
    },
    cuisine: {
      type: String,
      default: 'Indian',
    },
    dailyCaloricTarget: {
      type: Number,
      required: true,
    },
    macronutrientDistribution: {
      proteinGrams: { type: Number, default: 0 },
      carbsGrams: { type: Number, default: 0 },
      fatGrams: { type: Number, default: 0 },
    },
    mealBreakdown: [mealSchema],
    hydrationRecommendationLiters: {
      type: Number,
      default: 3.0,
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

dietPlanSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('DietPlan', dietPlanSchema);
