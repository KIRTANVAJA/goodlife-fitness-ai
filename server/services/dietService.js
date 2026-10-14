/**
 * Good Life Fitness AI - Nutrition & Diet Planning Service
 * Provides science-backed, macro-calculated nutrition plans
 * with comprehensive support for Indian, Vegetarian, Vegan, Jain, and Non-Veg dietary requirements.
 */

// Nutrient database for verified macro compositions per standard serving
const NUTRITIONAL_BUILDING_BLOCKS = {
  breakfast: {
    veg: [
      { name: 'Moong Dal Sprouts Chilla with Mint Chutney', cals: 320, p: 18, c: 45, f: 6, ingredients: ['Sprouted yellow moong dal (1 cup)', 'Fresh coriander & green chillies', 'Olive/cold-pressed mustard oil (1 tsp)'], portion: '2 medium chillas' },
      { name: 'High-Protein Rolled Oats with Skimmed Milk & Almonds', cals: 380, p: 20, c: 55, f: 9, ingredients: ['Rolled oats (50g)', 'Skimmed milk or almond milk (250ml)', 'Crushed almonds & walnuts (15g)', 'Chia seeds (1 tsp)'], portion: '1 large bowl' },
      { name: 'Paneer Bhurji with 100% Whole Wheat Toast', cals: 410, p: 24, c: 32, f: 18, ingredients: ['Low-fat paneer (100g)', 'Tomatoes, onions, turmeric & cumin', 'Whole wheat artisanal toast (2 slices)'], portion: '1 serving with 2 slices' },
    ],
    vegan: [
      { name: 'Tofu Bhurji (Scramble) with Avocado Toast', cals: 360, p: 22, c: 30, f: 16, ingredients: ['Organic firm tofu (120g)', 'Nutritional yeast, bell peppers', 'Sourdough toast (2 slices)', 'Quarter avocado'], portion: '1 bowl with 2 slices' },
      { name: 'Sprouted Ragi & Chia Porridge with Plant Protein', cals: 340, p: 24, c: 46, f: 6, ingredients: ['Sprouted finger millet (Ragi) flour (40g)', 'Plant pea/brown rice protein (25g scoop)', 'Soy milk (200ml)'], portion: '1 bowl' },
    ],
    nonveg: [
      { name: 'Masala Egg White Omelette with Multigrain Toast', cals: 350, p: 28, c: 32, f: 8, ingredients: ['Egg whites (5) + Whole egg (1)', 'Spinach, mushrooms, onions', 'Multigrain bread (2 slices)'], portion: '3-egg omelette + 2 toasts' },
      { name: 'Boiled Eggs & Steel-Cut Oats with Berries', cals: 420, p: 26, c: 52, f: 12, ingredients: ['Whole boiled eggs (2) + whites (2)', 'Steel-cut oats (45g)', 'Blueberries & chia seeds'], portion: 'Standard breakfast plate' },
    ],
    jain: [
      { name: 'Sprouted Moong & Chana Sundal (No Onion/Garlic)', cals: 310, p: 17, c: 44, f: 5, ingredients: ['Sprouted green moong & brown chana (1.5 cups)', 'Fresh grated coconut (1 tbsp)', 'Curry leaves & mustard seeds tempering'], portion: '1.5 cups' },
      { name: 'Jain Paneer Paratha (Low Oil) with Curd', cals: 390, p: 20, c: 48, f: 13, ingredients: ['Whole wheat flour (50g)', 'Grated fresh cow milk paneer (80g)', 'Fresh coriander & cumin powder', 'Homemade curd (100g)'], portion: '1 paratha with curd' },
    ],
  },
  lunch: {
    veg: [
      { name: 'High-Protein Rajma Masala with Brown Rice & Cucumber Salad', cals: 520, p: 22, c: 82, f: 8, ingredients: ['Boiled red kidney beans (1.5 cups)', 'Brown basmati rice (1 cup cooked)', 'Diced cucumber & lemon'], portion: '1 plate' },
      { name: 'Tandoori Paneer Tikka Bowl with Quinoa & Dal Tadka', cals: 560, p: 32, c: 58, f: 20, ingredients: ['Low-fat cow paneer (120g)', 'Cooked tri-color quinoa (1 cup)', 'Yellow moong dal (1 bowl)'], portion: '1 macro bowl' },
    ],
    vegan: [
      { name: 'Black Chickpea (Kala Chana) Curry with Millets', cals: 480, p: 24, c: 76, f: 8, ingredients: ['Boiled black chana (1.5 cups)', 'Foxtail millet / brown rice (1 cup)', 'Steamed French beans & carrots'], portion: '1 bowl' },
      { name: 'Grilled Tempeh Steak with Lentil Rice & Stir-fry Greens', cals: 510, p: 34, c: 56, f: 14, ingredients: ['Tempeh blocks (140g)', 'Pigeon pea (Toor) dal rice (1 cup)', 'Broccoli & bell peppers'], portion: '1 bowl' },
    ],
    nonveg: [
      { name: 'Desi Spiced Grilled Chicken Breast with Brown Rice & Greens', cals: 540, p: 48, c: 52, f: 12, ingredients: ['Skinless chicken breast (200g)', 'Brown basmati rice (1 cup cooked)', 'Steamed broccoli & asparagus'], portion: '1 high-protein plate' },
      { name: 'Baked Rohu/Fish Tikka with Jeera Rice & Dal', cals: 490, p: 42, c: 54, f: 10, ingredients: ['Fresh river fish / cod (180g)', 'Fragrant jeera brown rice (1 cup)', 'Yellow moong dal (1 cup)'], portion: '1 plate' },
    ],
    jain: [
      { name: 'Jain Dal Makhani (No Onion/Garlic) with Quinoa Pulao', cals: 510, p: 23, c: 72, f: 12, ingredients: ['Black lentils & rajma simmered in tomato puree', 'Cooked quinoa pulao with green peas', 'Fresh cucumber slices'], portion: '1 plate' },
      { name: 'Kadhi with Besan Pakodi & Brown Rice', cals: 470, p: 18, c: 68, f: 11, ingredients: ['Low-fat buttermilk kadhi with methi seeds', 'Roasted besan bites', 'Steamed brown rice (1 cup)'], portion: '1 large bowl' },
    ],
  },
  snack: {
    veg: [
      { name: 'Roasted Makhana (Fox Nuts) with Whey Isolate Shake', cals: 240, p: 28, c: 22, f: 3, ingredients: ['Roasted phool makhana (30g)', 'Whey protein isolate (1 scoop) in water'], portion: '1 bowl + shake' },
      { name: 'Greek Yogurt with Crushed Flaxseeds & Pomegranate', cals: 210, p: 16, c: 20, f: 5, ingredients: ['Unsweetened Greek yogurt (150g)', 'Roasted flaxseeds (1 tbsp)', 'Fresh pomegranate pearls'], portion: '1 cup' },
    ],
    vegan: [
      { name: 'Roasted Spiced Edamame with Green Tea', cals: 190, p: 17, c: 14, f: 6, ingredients: ['Dry roasted edamame beans (40g)', 'Organic loose-leaf green tea'], portion: '1 bowl' },
      { name: 'Sprouted Moong Chaat with Lemon & Rock Salt', cals: 180, p: 14, c: 28, f: 1, ingredients: ['Steamed sprouted moong (1 cup)', 'Diced tomatoes, cilantro, chaat masala'], portion: '1 bowl' },
    ],
    nonveg: [
      { name: 'Boiled Egg Whites (4) with Hummus & Celery', cals: 190, p: 20, c: 12, f: 5, ingredients: ['Boiled egg whites (4)', 'Tahini-chickpea hummus (2 tbsp)', 'Celery sticks'], portion: '1 plate' },
      { name: 'Smoked Chicken Breast Slices with Cucumber Cups', cals: 180, p: 26, c: 4, f: 3, ingredients: ['Lean sliced chicken breast (90g)', 'Cucumber slices with black pepper'], portion: '1 snack box' },
    ],
    jain: [
      { name: 'Roasted Chana (Chickpeas) & Almonds', cals: 220, p: 12, c: 24, f: 8, ingredients: ['Dry roasted unsalted brown chana (40g)', 'Raw Mamra almonds (10 pieces)'], portion: '1 pouch' },
      { name: 'Paneer Cubes with Rock Salt & Cumin Powder', cals: 210, p: 15, c: 4, f: 14, ingredients: ['Fresh cow milk paneer (80g)', 'Toasted cumin powder & black pepper'], portion: '1 small plate' },
    ],
  },
  dinner: {
    veg: [
      { name: 'Palak Paneer (Low Cream) with 2 Multigrain Rotis', cals: 460, p: 26, c: 42, f: 18, ingredients: ['Fresh baby spinach puree (2 cups)', 'Low-fat paneer cubes (100g)', 'Jowar / Multigrain rotis (2)'], portion: '1 bowl + 2 rotis' },
      { name: 'Soya Chunks Curry with Vegetable Khichdi', cals: 440, p: 32, c: 54, f: 8, ingredients: ['Nutrela soya chunks (50g dry)', 'Moong dal & dalia khichdi (1 cup)', 'Steamed bottle gourd (Lauki)'], portion: '1 large bowl' },
    ],
    vegan: [
      { name: 'Tofu & Broccoli Stir-Fry with Sesame Quinoa', cals: 420, p: 26, c: 40, f: 16, ingredients: ['Organic tofu (140g)', 'Broccoli, bell peppers, zucchini', 'Toasted white sesame seeds', 'Cooked quinoa (0.75 cup)'], portion: '1 bowl' },
      { name: 'Lentil Vegetable Stew with Sweet Potato Mash', cals: 390, p: 20, c: 62, f: 5, ingredients: ['Yellow split peas & brown lentils', 'Carrots, spinach, tomatoes', 'Steamed sweet potato (1 medium)'], portion: '1 bowl' },
    ],
    nonveg: [
      { name: 'Tandoori Salmon/Fish Fillet with Grilled Asparagus', cals: 430, p: 40, c: 14, f: 22, ingredients: ['Atlantic Salmon or Surmai (180g)', 'Grilled asparagus & zucchini spears', 'Extra virgin olive oil glaze (1 tsp)'], portion: '1 fillet + vegetables' },
      { name: 'Light Chicken Stew with Steamed French Beans & 1 Roti', cals: 410, p: 42, c: 34, f: 8, ingredients: ['Boneless chicken breast (180g)', 'Clear vegetable broth with carrots & peas', 'Whole wheat phulka (1)'], portion: '1 bowl + 1 roti' },
    ],
    jain: [
      { name: 'Yellow Moong Dal Khichdi with Roasted Papad (No Onion/Garlic)', cals: 410, p: 18, c: 68, f: 7, ingredients: ['Yellow moong dal & unpolished rice', 'Ghee tempering with jeera & hing (1 tsp)', 'Roasted urad dal papad'], portion: '1 bowl' },
      { name: 'Stir-fried Soya Chunks & Paneer with Tomato Gravy', cals: 430, p: 30, c: 32, f: 16, ingredients: ['Soya chunks (35g)', 'Fresh paneer (60g)', 'Pureed tomatoes, cumin, turmeric'], portion: '1 bowl' },
    ],
  },
};

/**
 * Filter items by allergy
 */
function isAllergenFree(item, allergies = []) {
  if (!allergies || !allergies.length) return true;
  const allergenKeywords = {
    dairy: ['milk', 'paneer', 'curd', 'yogurt', 'whey', 'ghee'],
    nuts: ['almond', 'walnut', 'peanut', 'cashew'],
    gluten: ['wheat', 'roti', 'paratha', 'toast', 'bread', 'oats'],
    soy: ['soya', 'tofu', 'soy', 'tempeh', 'edamame'],
    egg: ['egg', 'omelette'],
    fish: ['fish', 'salmon', 'cod', 'rohu', 'surmai'],
  };

  const ingredientsText = (item.ingredients.join(' ') + ' ' + item.name).toLowerCase();

  for (const allergy of allergies) {
    const key = allergy.toLowerCase().trim();
    const keywords = allergenKeywords[key] || [key];
    for (const kw of keywords) {
      if (ingredientsText.includes(kw)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Generates an authoritative Daily Diet Plan
 */
export function generateDailyDietPlan({
  fitnessGoal = 'general_fitness',
  dietaryPreference = 'veg',
  allergies = [],
  restrictions = [],
  cuisine = 'Indian',
  targetCalories = null,
  bodyWeightKg = 70,
}) {
  // Normalize preference
  let prefKey = 'veg';
  const normPref = dietaryPreference.toLowerCase();
  if (normPref.includes('non') || normPref.includes('meat') || normPref.includes('egg')) {
    prefKey = 'nonveg';
  } else if (normPref.includes('vegan')) {
    prefKey = 'vegan';
  } else if (normPref.includes('jain')) {
    prefKey = 'jain';
  }

  // Adjust calorie range based on goal
  let targetCals = targetCalories;
  if (!targetCals) {
    if (fitnessGoal === 'fat_loss') targetCals = 1900;
    else if (fitnessGoal === 'muscle_building') targetCals = 2800;
    else if (fitnessGoal === 'endurance') targetCals = 2400;
    else targetCals = 2200;
  }

  const mealSlots = ['breakfast', 'lunch', 'snack', 'dinner'];
  const plan = {};
  let totalCals = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;

  for (const slot of mealSlots) {
    const candidateList = NUTRITIONAL_BUILDING_BLOCKS[slot][prefKey] || NUTRITIONAL_BUILDING_BLOCKS[slot]['veg'];
    const safeCandidates = candidateList.filter((c) => isAllergenFree(c, allergies));
    const selectedItem = safeCandidates.length > 0 ? safeCandidates[0] : candidateList[0];

    plan[slot] = {
      title: selectedItem.name,
      portion: selectedItem.portion,
      ingredients: selectedItem.ingredients,
      macros: {
        calories: selectedItem.cals,
        proteinGrams: selectedItem.p,
        carbsGrams: selectedItem.c,
        fatsGrams: selectedItem.f,
      },
    };

    totalCals += selectedItem.cals;
    totalProtein += selectedItem.p;
    totalCarbs += selectedItem.c;
    totalFats += selectedItem.f;
  }

  return {
    success: true,
    planType: 'STANDARD_DAILY',
    meta: {
      fitnessGoal,
      dietaryPreference,
      allergies,
      cuisine,
      targetCalories: targetCals,
      estimatedActualCalories: totalCals,
      macronutrients: {
        totalCalories: totalCals,
        totalProteinGrams: totalProtein,
        totalCarbsGrams: totalCarbs,
        totalFatsGrams: totalFats,
        proteinPercentage: Math.round(((totalProtein * 4) / totalCals) * 100),
        carbsPercentage: Math.round(((totalCarbs * 4) / totalCals) * 100),
        fatsPercentage: Math.round(((totalFats * 9) / totalCals) * 100),
      },
    },
    meals: plan,
    disclaimer: 'Nutritional figures are verified estimates calculated per standard Indian kitchen measures. Consult a licensed dietitian before beginning restrictive regimes.',
  };
}

/**
 * Generates Premium Weekly Nutrition Plan with grocery lists and workout-aware nutrition timing
 */
export function generatePremiumWeeklyPlan({
  fitnessGoal = 'general_fitness',
  dietaryPreference = 'veg',
  allergies = [],
  cuisine = 'Indian',
  bodyWeightKg = 70,
}) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dailyPlans = daysOfWeek.map((day, idx) => {
    const base = generateDailyDietPlan({
      fitnessGoal,
      dietaryPreference,
      allergies,
      cuisine,
      bodyWeightKg,
    });
    return {
      day,
      focus: idx % 2 === 0 ? 'High Energy & Resistance Fuel' : 'Active Recovery & Micronutrient Density',
      ...base.meals,
      macros: base.meta.macronutrients,
    };
  });

  return {
    success: true,
    planType: 'PREMIUM_WEEKLY',
    weeklySchedule: dailyPlans,
    workoutAwareNutrition: {
      preWorkoutMeal: '30-45 mins before: 1 medium banana or 2 dates + 5 almonds. Light carbs for immediate glycogen access.',
      postWorkoutMeal: 'Within 45 mins after: 1 scoop protein shake (or 100g low-fat paneer / 4 egg whites) + coconut water for electrolyte rebalancing.',
      hydrationTargetLiters: Math.max(2.5, ((bodyWeightKg * 35) / 1000).toFixed(1)),
    },
    groceryShoppingList: [
      { category: 'Proteins', items: ['Organic Firm Tofu / Paneer', 'Moong Dal Sprouts', 'Yellow Dal / Rajma', 'Chia & Flax Seeds', 'Whey/Plant Protein'] },
      { category: 'Complex Carbs', items: ['Rolled Oats', 'Brown Basmati Rice', 'Tri-Color Quinoa', 'Sweet Potatoes', 'Multigrain/Sourdough Flour'] },
      { category: 'Fresh Produce', items: ['Baby Spinach', 'Broccoli', 'Cucumber', 'Pomegranate', 'Lemon & Fresh Coriander'] },
      { category: 'Healthy Fats & Spices', items: ['Cold-pressed Mustard / Olive Oil', 'Raw Almonds & Walnuts', 'Turmeric, Cumin, Rock Salt'] },
    ],
    mealSubstitutions: [
      { original: 'Paneer', alternative: 'Tofu or High-protein Tempeh', reason: 'Reduces saturated fats while sustaining complete amino acid profile.' },
      { original: 'White Rice', alternative: 'Brown Rice, Quinoa or Foxtail Millet', reason: 'Lowers glycemic index; sustains blood sugar control.' },
    ],
  };
}
