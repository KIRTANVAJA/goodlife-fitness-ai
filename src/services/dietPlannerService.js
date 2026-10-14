/**
 * Good Life Fitness AI — Pure Nutrition & Diet Blueprint Service
 * Provides comprehensive, science-backed meal plans focused purely on diet contents:
 * - Macro & micronutrient precision (Protein, Carbs, Fats, Calories)
 * - Exact ingredients & portion sizes
 * - Support for Vegetarian, Vegan, Non-Veg, and Jain cuisines
 * - 7-Day weekly meal schedules
 * - Categorized grocery shopping lists
 * - Hydration & meal timing schedules
 */

export const DIET_BUILDING_BLOCKS = {
  breakfast: {
    veg: [
      {
        name: 'Moong Dal Sprouts Chilla with Fresh Mint & Coriander Chutney',
        cals: 340,
        p: 20,
        c: 44,
        f: 7,
        portion: '2 medium chillas (180g)',
        ingredients: [
          'Sprouted green moong dal (1 cup / 120g)',
          'Finely chopped baby spinach & onions (40g)',
          'Grated ginger & green chillies (1 tsp)',
          'Cold-pressed mustard or olive oil (1 tsp)',
          'Mint-coriander rock salt dip (2 tbsp)'
        ],
        prepTime: '15 mins',
        macroNotes: 'High bio-available plant protein with low glycemic index complex carbs for sustained morning energy.'
      },
      {
        name: 'Rolled Oats Porridge with Roasted Almonds & Chia Pudding',
        cals: 390,
        p: 18,
        c: 58,
        f: 10,
        portion: '1 large bowl (300g)',
        ingredients: [
          '100% Whole rolled oats (60g)',
          'Low-fat milk or unsweetened almond milk (250ml)',
          'Crushed California almonds & walnuts (15g)',
          'Organic chia seeds (1 tbsp)',
          'Ceylon cinnamon powder (pinch)'
        ],
        prepTime: '10 mins',
        macroNotes: 'Rich in beta-glucan soluble fiber, omega-3 fatty acids, and magnesium.'
      },
      {
        name: 'Fresh Cow Milk Paneer Bhurji with 100% Whole Wheat Roti',
        cals: 420,
        p: 26,
        c: 34,
        f: 18,
        portion: '1 cup bhurji + 2 whole wheat rotis',
        ingredients: [
          'Fresh low-fat paneer (120g crumbled)',
          'Diced vine tomatoes, onions, capsicum (80g)',
          'Turmeric, cumin, black pepper (1 tsp)',
          'Freshly rolled whole wheat rotis (2 thin phulkas)'
        ],
        prepTime: '15 mins',
        macroNotes: 'Complete amino acid profile containing all 9 essential aminos for muscular repair.'
      }
    ],
    vegan: [
      {
        name: 'Organic Firm Tofu Scramble with Sourdough & Mashed Avocado',
        cals: 370,
        p: 24,
        c: 32,
        f: 16,
        portion: '1 large plate',
        ingredients: [
          'Organic non-GMO firm tofu (140g crumbled)',
          'Nutritional yeast for Vitamin B12 (1 tbsp)',
          'Sauteed cherry tomatoes & baby spinach (60g)',
          'Artisanal sourdough toast (2 slices)',
          'Ripe mashed avocado (30g) with sea salt'
        ],
        prepTime: '12 mins',
        macroNotes: 'Fortified with Vitamin B12, healthy monounsaturated fats, and soy isoflavones.'
      },
      {
        name: 'Sprouted Finger Millet (Ragi) & Pea Protein Porridge',
        cals: 350,
        p: 26,
        c: 48,
        f: 6,
        portion: '1 large nutrient bowl',
        ingredients: [
          'Sprouted Ragi flour (45g)',
          'Natural unflavored pea protein isolate (25g)',
          'Warm organic soy or oat milk (250ml)',
          'Pumpkin seeds & flaxseeds (10g)'
        ],
        prepTime: '10 mins',
        macroNotes: 'Rich in bioavailable calcium, plant iron, and branched-chain amino acids (BCAAs).'
      }
    ],
    nonveg: [
      {
        name: 'Farm Fresh Egg White Omelette with Mushrooms & Multigrain Toast',
        cals: 360,
        p: 30,
        c: 30,
        f: 8,
        portion: '4 egg whites + 1 whole egg + 2 toasts',
        ingredients: [
          'Free-range egg whites (4) + whole egg (1)',
          'Sauteed button mushrooms & bell peppers (60g)',
          'Multigrain sprouted grain bread (2 slices)',
          'Extra virgin olive oil brush (1/2 tsp)'
        ],
        prepTime: '10 mins',
        macroNotes: 'Optimal protein-to-calorie ratio with zero sugar and rich choline for brain focus.'
      },
      {
        name: 'Boiled Omega-3 Eggs with Steel-Cut Oats & Fresh Berries',
        cals: 410,
        p: 28,
        c: 50,
        f: 11,
        portion: 'Standard athlete breakfast',
        ingredients: [
          'Soft or hard boiled eggs (2 whole + 2 whites)',
          'Cooked steel-cut oats (1 cup)',
          'Wild blueberries or strawberries (40g)',
          'Flaxseed powder (1 tsp)'
        ],
        prepTime: '12 mins',
        macroNotes: 'High thermic effect of food with potent polyphenols and antioxidants.'
      }
    ],
    jain: [
      {
        name: 'Sprouted Moong & Black Chana Sundal (No Onion/No Garlic)',
        cals: 320,
        p: 19,
        c: 46,
        f: 5,
        portion: '1.5 cups (200g)',
        ingredients: [
          'Steamed sprouted moong & brown chickpeas (150g)',
          'Freshly grated coconut (1 tbsp / 10g)',
          'Curry leaves, mustard seeds, hing (asafoetida) tempering',
          'Fresh lemon juice & pink Himalayan rock salt'
        ],
        prepTime: '15 mins',
        macroNotes: 'Pure sattvic preparation rich in natural dietary fiber and clean legume protein.'
      },
      {
        name: 'Jain Paneer & Jeera Paratha with Probiotic Curd',
        cals: 400,
        p: 22,
        c: 46,
        f: 14,
        portion: '1 paratha (120g) + 1 cup curd (120g)',
        ingredients: [
          'Whole wheat flour dough (50g)',
          'Fresh grated paneer with roasted cumin & coriander (80g)',
          'A2 desi cow milk homemade curd (120g)'
        ],
        prepTime: '15 mins',
        macroNotes: 'Aids digestive microbiome balance with active lactobacillus probiotics.'
      }
    ]
  },

  snack: {
    veg: [
      {
        name: 'Roasted Phool Makhana (Fox Nuts) & Whey Protein Isolate',
        cals: 230,
        p: 27,
        c: 21,
        f: 3,
        portion: '1 bowl makhana (30g) + 1 scoop shake',
        ingredients: [
          'Dry-roasted fox nuts tossed with turmeric & black pepper (30g)',
          '100% Grass-fed whey protein isolate in chilled water (30g scoop)'
        ],
        prepTime: '5 mins',
        macroNotes: 'Rapidly absorbed leucine for muscle protein synthesis with crunchy low-calorie volume.'
      },
      {
        name: 'Thick Greek Yogurt Bowl with Roasted Seeds & Pomegranate',
        cals: 210,
        p: 18,
        c: 22,
        f: 5,
        portion: '1 cup (180g)',
        ingredients: [
          'Unsweetened plain Greek yogurt (160g)',
          'Fresh pomegranate seeds (30g)',
          'Roasted chia & flax seed blend (10g)'
        ],
        prepTime: '3 mins',
        macroNotes: 'Casein-rich slow-release protein with probiotic gut support.'
      }
    ],
    vegan: [
      {
        name: 'Sea Salt Steamed Edamame Pods with Matcha Green Tea',
        cals: 190,
        p: 18,
        c: 13,
        f: 6,
        portion: '1 bowl (150g pods)',
        ingredients: [
          'Fresh green edamame pods steamed in sea salt (150g)',
          'Ceremonial Japanese matcha green tea (1 cup)'
        ],
        prepTime: '6 mins',
        macroNotes: 'Whole-food plant protein loaded with isoflavones and EGCG fat-oxidation polyphenols.'
      },
      {
        name: 'Sprouted Green Gram Chaat with Cucumber, Lemon & Herbs',
        cals: 180,
        p: 15,
        c: 28,
        f: 1.5,
        portion: '1 large bowl (200g)',
        ingredients: [
          'Steamed sprouted green gram (140g)',
          'Finely diced English cucumber, fresh mint, coriander',
          'Freshly squeezed lemon juice, cumin & rock salt'
        ],
        prepTime: '5 mins',
        macroNotes: 'Zero saturated fats and ultra-high enzyme content from active sprouting.'
      }
    ],
    nonveg: [
      {
        name: 'Hard Boiled Egg Whites (5) with Paprika & Celery Sticks',
        cals: 190,
        p: 22,
        c: 4,
        f: 1,
        portion: '5 whites + celery sticks',
        ingredients: [
          'Large hard-boiled egg whites (5)',
          'Smoked Spanish paprika & black pepper dust',
          'Crisp celery sticks with yellow mustard'
        ],
        prepTime: '5 mins',
        macroNotes: 'Pure 100% albumin protein with virtually negligible calories from carbs or fats.'
      },
      {
        name: 'Sliced Roast Herb Chicken Breast with Cucumber Ribbons',
        cals: 210,
        p: 30,
        c: 3,
        f: 3.5,
        portion: '1 container (120g chicken)',
        ingredients: [
          'Cold sliced roasted chicken breast in oregano & garlic (120g)',
          'Thin English cucumber ribbons with apple cider vinegar'
        ],
        prepTime: '5 mins',
        macroNotes: 'High-density lean meat protein perfect for midday recovery.'
      }
    ],
    jain: [
      {
        name: 'Roasted Yellow Chickpeas (Bhuna Chana) & Mamra Badam',
        cals: 220,
        p: 14,
        c: 25,
        f: 8,
        portion: 'Handful pouch (50g)',
        ingredients: [
          'Unsalted roasted split brown chana (35g)',
          'Raw Kashmiri Mamra almonds (15g / 10 nuts)'
        ],
        prepTime: '2 mins',
        macroNotes: 'Slow digesting complex carbs and natural Vitamin E.'
      },
      {
        name: 'Raw Paneer Cubes with Roasted Cumin & Black Salt',
        cals: 200,
        p: 16,
        c: 3,
        f: 13,
        portion: '1 small plate (90g)',
        ingredients: [
          'Fresh artisanal soft cow milk paneer (90g)',
          'Toasted cumin seed powder & black rock salt'
        ],
        prepTime: '3 mins',
        macroNotes: 'Sustained satiety with healthy natural dairy fats.'
      }
    ]
  },

  lunch: {
    veg: [
      {
        name: 'Punjabi Rajma (Red Kidney Beans) with Brown Basmati Rice & Kachumber Salad',
        cals: 530,
        p: 24,
        c: 84,
        f: 9,
        portion: '1 full macro plate',
        ingredients: [
          'Slow-cooked red kidney beans in tomato ginger curry (200g)',
          'Steamed brown basmati rice (150g cooked / 1 cup)',
          'Kachumber salad (diced cucumber, radish, lemon) (100g)',
          'Cold-pressed cumin ghee drizzle (1/2 tsp)'
        ],
        prepTime: '25 mins',
        macroNotes: 'The classic Indian complementary protein pairing (beans + rice) providing a complete amino acid profile.'
      },
      {
        name: 'Tandoori Paneer Tikka Platter with Steamed Tri-Color Quinoa & Yellow Dal',
        cals: 570,
        p: 34,
        c: 60,
        f: 20,
        portion: '1 athlete bowl',
        ingredients: [
          'Marinated low-fat cow milk paneer cubes (140g)',
          'Cooked tri-color organic quinoa (140g)',
          'Light yellow moong dal tadka (150g)',
          'Grilled onions and capsicum skewers (80g)'
        ],
        prepTime: '20 mins',
        macroNotes: 'Outstanding 34g clean protein with high magnesium and iron from quinoa and lentils.'
      }
    ],
    vegan: [
      {
        name: 'Kala Chana (Black Bengal Gram) Curry with Foxtail Millet & Steamed Greens',
        cals: 490,
        p: 26,
        c: 78,
        f: 8,
        portion: '1 large bowl',
        ingredients: [
          'Pressure cooked black chickpeas in roasted cumin tomato reduction (200g)',
          'Steamed foxtail millet (Kangni) (140g cooked)',
          'Steamed broccoli florets, French beans, carrots (100g)'
        ],
        prepTime: '25 mins',
        macroNotes: 'Exceptional iron content (6mg) and resistant starch supporting metabolic glucose sensitivity.'
      },
      {
        name: 'Grilled Spiced Tempeh Steak with Lentil Rice Bowl & Sesame Greens',
        cals: 520,
        p: 36,
        c: 58,
        f: 15,
        portion: '1 bowl',
        ingredients: [
          'Fermented soybean tempeh slices (160g)',
          'Pigeon pea (Toor) dal steamed rice (1 cup)',
          'Wilted baby bok choy and bell peppers with toasted sesame (1 tsp)'
        ],
        prepTime: '20 mins',
        macroNotes: 'Fermented tempeh provides elevated digestibility and 36 grams of pure bioavailable vegan protein.'
      }
    ],
    nonveg: [
      {
        name: 'Desi Spice-Rubbed Grilled Chicken Breast with Brown Rice & Charred Broccoli',
        cals: 550,
        p: 52,
        c: 54,
        f: 12,
        portion: '1 high-protein plate',
        ingredients: [
          'Skinless chicken breast marinated in hung curd, ginger & spices (220g)',
          'Fragrant long-grain brown basmati rice (150g cooked)',
          'Charred broccoli florets & asparagus spears (120g)'
        ],
        prepTime: '20 mins',
        macroNotes: 'Over 50g of clean protein with exceptional bioavailability (BV = 79) and low saturated fats.'
      },
      {
        name: 'Pan-Seared River Fish / Rohu Tikka with Fragrant Jeera Brown Rice & Dal',
        cals: 500,
        p: 44,
        c: 56,
        f: 11,
        portion: '1 plate',
        ingredients: [
          'Fresh fish fillet marinated in mustard seed oil, lemon, ajwain (200g)',
          'Jeera-infused steamed brown rice (150g cooked)',
          'Light yellow moong dal soup (1 cup)'
        ],
        prepTime: '20 mins',
        macroNotes: 'Omega-3 eicosapentaenoic acid (EPA) supports joint lubrication and reduces post-workout systemic soreness.'
      }
    ],
    jain: [
      {
        name: 'Jain Dal Makhani & Green Pea Quinoa Pulao (No Onion/No Garlic)',
        cals: 510,
        p: 24,
        c: 74,
        f: 12,
        portion: '1 plate',
        ingredients: [
          'Black lentils (urad) & kidney beans simmered in tomato puree & ginger (200g)',
          'Steamed quinoa pulao with sweet green peas & cumin (140g)',
          'Thin cucumber and green tomato salad with lemon'
        ],
        prepTime: '25 mins',
        macroNotes: 'Rich in dietary fiber and essential minerals while adhering strictly to Jain culinary traditions.'
      },
      {
        name: 'Rajasthani Kadhi with Roasted Besan Bites & Brown Rice',
        cals: 480,
        p: 20,
        c: 70,
        f: 11,
        portion: '1 plate',
        ingredients: [
          'Low-fat curd & chickpea flour (besan) kadhi with fenugreek seeds (200g)',
          'Air-roasted spiced besan pakodi',
          'Steamed brown basmati rice (150g cooked)'
        ],
        prepTime: '20 mins',
        macroNotes: 'Combines gut-cooling fermented curd with high-protein besan legumes.'
      }
    ]
  },

  dinner: {
    veg: [
      {
        name: 'Artisanal Palak Paneer with 2 Multigrain Jowar Rotis & Sprouted Salad',
        cals: 460,
        p: 28,
        c: 44,
        f: 18,
        portion: '1 bowl curry + 2 rotis',
        ingredients: [
          'Fresh baby spinach puree with cumin and garam masala (2 cups / 200g)',
          'Lightly pan-tossed low-fat paneer cubes (120g)',
          'Gluten-friendly Jowar (Sorghum) or multigrain rotis (2 phulkas)'
        ],
        prepTime: '20 mins',
        macroNotes: 'High chlorophyll and dietary nitrates support nocturnal endothelial blood flow.'
      },
      {
        name: 'High-Protein Soya Chunks Tikka Masala with Vegetable Dal Khichdi',
        cals: 450,
        p: 35,
        c: 56,
        f: 8,
        portion: '1 large bowl (300g)',
        ingredients: [
          'Defatted textured soya chunks boiled & roasted (55g dry weight / ~150g rehydrated)',
          'Moong dal & broken wheat or rice khichdi with bottle gourd & peas (160g)'
        ],
        prepTime: '20 mins',
        macroNotes: 'Soya chunks boast 52g protein per 100g dry weight, ensuring deep overnight tissue recovery.'
      }
    ],
    vegan: [
      {
        name: 'Smoked Organic Tofu & Wok-Tossed Vegetables with Sesame Quinoa',
        cals: 430,
        p: 28,
        c: 42,
        f: 16,
        portion: '1 bowl',
        ingredients: [
          'Organic firm tofu marinated in tamari and crushed ginger (150g)',
          'Broccoli, red bell peppers, zucchini, French beans (120g)',
          'Cooked fluffy white quinoa with toasted white sesame (100g)'
        ],
        prepTime: '15 mins',
        macroNotes: 'Light, fast-digesting dinner that prevents nocturnal gastrointestinal distress while maximizing amino recovery.'
      },
      {
        name: 'Hearty Yellow Split Pea & Spinach Stew with Sweet Potato Mash',
        cals: 410,
        p: 22,
        c: 66,
        f: 6,
        portion: '1 bowl stew + 1 cup mash',
        ingredients: [
          'Split yellow peas (Moong/Toor) simmered with baby spinach and tomatoes (200g)',
          'Steamed mashed sweet potato seasoned with cinnamon & rock salt (120g)'
        ],
        prepTime: '20 mins',
        macroNotes: 'Complex carbohydrates promote natural nocturnal serotonin and melatonin production for deep REM sleep.'
      }
    ],
    nonveg: [
      {
        name: 'Grilled Salmon or Surmai Fillet with Lemon Butter Asparagus',
        cals: 460,
        p: 44,
        c: 12,
        f: 24,
        portion: '1 fish fillet (200g) + grilled asparagus',
        ingredients: [
          'Fresh Atlantic salmon or king fish fillet grilled with black pepper & sea salt (200g)',
          'Steamed and grilled tender asparagus & zucchini (120g)',
          'Extra virgin olive oil and fresh lemon reduction (1 tsp)'
        ],
        prepTime: '18 mins',
        macroNotes: 'Dense in DHA & EPA omega-3s, helping modulate exercise-induced inflammatory pathways overnight.'
      },
      {
        name: 'Light Herbed Chicken Stew with French Beans & 1 Whole Wheat Roti',
        cals: 420,
        p: 45,
        c: 34,
        f: 9,
        portion: '1 bowl chicken stew + 1 roti',
        ingredients: [
          'Boneless chicken breast pieces slow-poached with carrots, celery, bay leaf (200g)',
          'Freshly rolled phulka roti (1)',
          'Clear bone & vegetable broth infused with black pepper'
        ],
        prepTime: '25 mins',
        macroNotes: 'Rich in natural glycine and collagen from clear broth to reinforce tendon and ligament durability.'
      }
    ],
    jain: [
      {
        name: 'Yellow Moong Dal Khichdi with Toasted Papad & A2 Cow Ghee',
        cals: 420,
        p: 20,
        c: 68,
        f: 8,
        portion: '1 comfort bowl',
        ingredients: [
          'Split yellow moong dal & unpolished fragrant rice (160g cooked)',
          'Tempered with hing, cumin seeds, turmeric, and 1 tsp pure A2 cow ghee',
          'Air-roasted urad dal papad (1)'
        ],
        prepTime: '20 mins',
        macroNotes: 'Epitome of soothing, bio-compatible nutrition ensuring zero nocturnal digestive stress.'
      },
      {
        name: 'Sattvic Paneer & Soya Tikka in Creamy Green Cardamom Gravy',
        cals: 440,
        p: 32,
        c: 32,
        f: 17,
        portion: '1 bowl + 1 jowar roti',
        ingredients: [
          'Fresh cow milk paneer (70g) + boiled soya chunks (35g)',
          'Pureed tomatoes, melon seeds (magaz), and green cardamom gravy',
          'Warm freshly puffed Jowar roti (1)'
        ],
        prepTime: '20 mins',
        macroNotes: 'Wholesome protein density without any root vegetables, onions, or garlic.'
      }
    ]
  }
};

/**
 * 7-Day Rotational Meal Schedules
 */
export const WEEKLY_DIET_SCHEDULE = [
  {
    day: 'Monday',
    theme: 'Foundational Strength & Metabolic Ignition',
    breakfast: 'Moong Dal Sprouts Chilla (or Egg Omelette)',
    lunch: 'Rajma Masala with Brown Basmati & Kachumber Salad',
    snack: 'Roasted Makhana with Whey/Plant Protein Shake',
    dinner: 'Palak Paneer with Multigrain Jowar Rotis',
    targetCalories: 2250,
    proteinGrams: 145,
    carbsGrams: 235,
    fatGrams: 58
  },
  {
    day: 'Tuesday',
    theme: 'Lower Body Fuel & Glycogen Replenishment',
    breakfast: 'Rolled Oats Porridge with Almonds & Chia',
    lunch: 'Tandoori Tikka Platter with Tri-Color Quinoa & Moong Dal',
    snack: 'Greek Yogurt Bowl with Flaxseed & Pomegranate',
    dinner: 'High-Protein Soya Chunks Curry with Vegetable Khichdi',
    targetCalories: 2320,
    proteinGrams: 150,
    carbsGrams: 245,
    fatGrams: 55
  },
  {
    day: 'Wednesday',
    theme: 'Cellular Recovery & Anti-Inflammatory Focus',
    breakfast: 'Paneer / Tofu Scramble with Sourdough Toast',
    lunch: 'Kala Chana Curry with Foxtail Millet & Steamed Greens',
    snack: 'Sea Salt Steamed Edamame Pods with Green Tea',
    dinner: 'Grilled Fish / Tempeh Steak with Asparagus & Quinoa',
    targetCalories: 2180,
    proteinGrams: 140,
    carbsGrams: 220,
    fatGrams: 56
  },
  {
    day: 'Thursday',
    theme: 'Upper Body Hypertrophy & Sustained Power',
    breakfast: 'Sprouted Ragi & Pea Protein Porridge with Nuts',
    lunch: 'Grilled Chicken Breast / Tofu Steak with Brown Rice',
    snack: 'Boiled Egg Whites / Sprouted Moong Chaat with Lemon',
    dinner: 'Artisanal Palak Paneer with Multigrain Rotis',
    targetCalories: 2280,
    proteinGrams: 148,
    carbsGrams: 230,
    fatGrams: 58
  },
  {
    day: 'Friday',
    theme: 'High Metabolic Output & HIIT Conditioning',
    breakfast: 'Moong Dal Sprouts Chilla with Mint Chutney',
    lunch: 'Rajma Masala or Tempeh Lentil Bowl with Rice',
    snack: 'Roasted Yellow Chickpeas & Kashmiri Almonds',
    dinner: 'Light Herb Chicken Stew / Soya Tikka Khichdi',
    targetCalories: 2240,
    proteinGrams: 142,
    carbsGrams: 238,
    fatGrams: 54
  },
  {
    day: 'Saturday',
    theme: 'Heavy Compound Lift Loading & Peak Energy',
    breakfast: 'Masala Egg White Omelette or Paneer Paratha',
    lunch: 'Tandoori Paneer / Salmon Tikka with Jeera Rice',
    snack: 'Greek Yogurt with Pumpkin Seeds & Berries',
    dinner: 'Yellow Moong Dal Khichdi with Toasted Papad & Ghee',
    targetCalories: 2350,
    proteinGrams: 152,
    carbsGrams: 245,
    fatGrams: 62
  },
  {
    day: 'Sunday',
    theme: 'Systemic Regeneration & Digestive Reset',
    breakfast: 'Steel-Cut Oats with Berries & Plant Protein',
    lunch: 'Comfort Kadhi / Black Chana with Brown Rice',
    snack: 'Sprouted Moong Chaat with Green Tea',
    dinner: 'Clear Broth Vegetable Stew with Steamed Sweet Potato',
    targetCalories: 2050,
    proteinGrams: 130,
    carbsGrams: 210,
    fatGrams: 48
  }
];

/**
 * Consolidated 7-Day Grocery Shopping Inventory
 */
export const CONSOLIDATED_GROCERY_LIST = [
  { category: 'Fresh Produce & Greens', items: [
    { name: 'Fresh Baby Spinach (Palak)', quantity: '500g', notes: 'Iron, nitrates & chlorophyll' },
    { name: 'Broccoli Florets & Asparagus', quantity: '400g', notes: 'Cruciferous indoles & fiber' },
    { name: 'English Salad Cucumbers', quantity: '1 kg', notes: 'Hydration & mineral electrolyte balance' },
    { name: 'Vine Ripe Tomatoes & Red Onions', quantity: '1.5 kg', notes: 'Base curry aromatics & lycopene' },
    { name: 'Fresh Mint, Coriander, Ginger, Lemons', quantity: '2 bunches', notes: 'Natural digestive catalysts' },
    { name: 'Wild Blueberries or Pomegranate', quantity: '300g', notes: 'High ORAC antioxidant score' }
  ]},
  { category: 'Whole Grains & Legumes', items: [
    { name: 'Whole Sprouted Green Moong Dal', quantity: '1 kg', notes: 'Pure low-GI plant protein' },
    { name: 'Red Kidney Beans (Rajma)', quantity: '500g', notes: 'High-fiber complex carbohydrate' },
    { name: 'Black Bengal Gram (Kala Chana)', quantity: '500g', notes: 'Dense iron & magnesium source' },
    { name: 'Organic Rolled Oats', quantity: '1 kg', notes: 'Beta-glucan prebiotic soluble fiber' },
    { name: 'Long-Grain Brown Basmati Rice', quantity: '1.5 kg', notes: 'Clean muscle glycogen replenishment' },
    { name: 'Organic Tri-Color Quinoa / Millets', quantity: '500g', notes: 'Complete plant amino acid profile' }
  ]},
  { category: 'Proteins & Dairy / Plant Alternatives', items: [
    { name: 'Low-Fat Fresh Cow Milk Paneer', quantity: '800g', notes: 'Slow-release casein & calcium' },
    { name: 'Organic Non-GMO Firm Tofu or Tempeh', quantity: '600g', notes: 'Complete vegan protein blocks' },
    { name: 'Free-Range Omega-3 Eggs', quantity: '2 dozen', notes: 'Bio-available leucine & choline' },
    { name: 'Skinless Chicken Breast / Fresh Fish', quantity: '1.2 kg', notes: 'High-density lean animal protein' },
    { name: 'Defatted Textured Soya Chunks', quantity: '400g', notes: '52% protein density' },
    { name: 'Unsweetened Greek Yogurt', quantity: '600g', notes: 'Living probiotic cultures' }
  ]},
  { category: 'Healthy Fats, Seeds & Seasonings', items: [
    { name: 'Phool Makhana (Fox Nuts)', quantity: '250g', notes: 'Mineral-rich crunch' },
    { name: 'California Almonds & Raw Walnuts', quantity: '300g', notes: 'Cardioprotective monounsaturates' },
    { name: 'Chia Seeds & Roasted Flaxseeds', quantity: '200g', notes: 'Alpha-linolenic omega-3 acid (ALA)' },
    { name: 'Cold-Pressed Mustard / Extra Virgin Olive Oil', quantity: '500ml', notes: 'Zero trans fats' },
    { name: 'Pink Himalayan Rock Salt & Cumin Seeds', quantity: '1 pack', notes: 'Trace minerals & digestion' }
  ]}
];

/**
 * Hydration & Electrolyte Timing Protocol
 */
export const HYDRATION_BLUEPRINT = {
  dailyTargetLiters: '3.5 - 4.0 Liters',
  schedule: [
    { time: 'Upon Waking (06:30 AM)', amount: '500 ml', detail: 'Lukewarm water with pink rock salt and fresh lemon juice to rehydrate after overnight water loss.' },
    { time: 'Mid-Morning (10:30 AM)', amount: '600 ml', detail: 'Plain filtered water with soaked chia seeds for sustained intracellular hydration.' },
    { time: 'Pre-Workout (45 mins prior)', amount: '400 ml', detail: 'Electrolyte water containing trace sodium and potassium to support muscle nerve contraction.' },
    { time: 'Intra-Workout (During session)', amount: '500 ml', detail: 'Small 100ml sips every 15 minutes to replace sweat rate without stomach heaviness.' },
    { time: 'Post-Workout (Within 30 mins)', amount: '500 ml', detail: 'Fresh coconut water or water with whey isolate to accelerate glycogen and amino uptake.' },
    { time: 'Evening & Dinner (07:00 PM)', amount: '500 ml', detail: 'Water taken 30 minutes before meal to avoid diluting stomach enzymes.' },
    { time: 'Pre-Bedtime (09:30 PM)', amount: '250 ml', detail: 'Warm water or chamomile herbal tea to promote nocturnal recovery without sleep disruption.' }
  ]
};

/**
 * Client-Side Meal Generator Engine
 */
export function generateClientDietPlan({
  fitnessGoal = 'muscle_building',
  dietaryPreference = 'veg',
  allergies = []
}) {
  const pref = dietaryPreference.toLowerCase();
  const selectedPref = DIET_BUILDING_BLOCKS.breakfast[pref] ? pref : 'veg';

  const breakfastOptions = DIET_BUILDING_BLOCKS.breakfast[selectedPref] || DIET_BUILDING_BLOCKS.breakfast.veg;
  const snackOptions = DIET_BUILDING_BLOCKS.snack[selectedPref] || DIET_BUILDING_BLOCKS.snack.veg;
  const lunchOptions = DIET_BUILDING_BLOCKS.lunch[selectedPref] || DIET_BUILDING_BLOCKS.lunch.veg;
  const dinnerOptions = DIET_BUILDING_BLOCKS.dinner[selectedPref] || DIET_BUILDING_BLOCKS.dinner.veg;

  const breakfast = breakfastOptions[0];
  const snack = snackOptions[0];
  const lunch = lunchOptions[0];
  const dinner = dinnerOptions[0];

  let targetCals = 2200;
  let pRatio = 0.30;
  let cRatio = 0.45;
  let fRatio = 0.25;

  if (fitnessGoal === 'fat_loss') {
    targetCals = 1850;
    pRatio = 0.35;
    cRatio = 0.40;
    fRatio = 0.25;
  } else if (fitnessGoal === 'muscle_building') {
    targetCals = 2450;
    pRatio = 0.30;
    cRatio = 0.50;
    fRatio = 0.20;
  } else if (fitnessGoal === 'endurance') {
    targetCals = 2300;
    pRatio = 0.25;
    cRatio = 0.55;
    fRatio = 0.20;
  }

  const proteinGrams = Math.round((targetCals * pRatio) / 4);
  const carbsGrams = Math.round((targetCals * cRatio) / 4);
  const fatGrams = Math.round((targetCals * fRatio) / 9);

  return {
    fitnessGoal,
    dietaryPreference: selectedPref,
    targetCalories: targetCals,
    macros: {
      protein: proteinGrams,
      carbs: carbsGrams,
      fat: fatGrams,
      fiber: 38
    },
    meals: {
      breakfast,
      snack,
      lunch,
      dinner
    },
    weeklySchedule: WEEKLY_DIET_SCHEDULE,
    shoppingList: CONSOLIDATED_GROCERY_LIST,
    hydration: HYDRATION_BLUEPRINT,
    generatedAt: new Date().toISOString()
  };
}

export default {
  DIET_BUILDING_BLOCKS,
  WEEKLY_DIET_SCHEDULE,
  CONSOLIDATED_GROCERY_LIST,
  HYDRATION_BLUEPRINT,
  generateClientDietPlan
};
