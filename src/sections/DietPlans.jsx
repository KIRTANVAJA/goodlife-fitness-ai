import React, { useState } from 'react';
import { Apple, Eye, ShieldAlert, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const dietPlans = {
  gain: {
    title: 'Anabolic Muscle Gain Plan',
    calories: '3,000 - 3,500 kcal/day',
    macros: { protein: '40%', carbs: '40%', fats: '20%' },
    meals: {
      veg: {
        breakfast: 'Oats cooked in soy milk + almonds + 1 scoop plant protein + banana.',
        lunch: 'Brown rice + grilled tofu/paneer tikka + boiled chickpeas + leafy greens salad.',
        snack: 'Roasted peanut salad or peanut butter on multi-grain toast + apple.',
        dinner: 'Tofu/Paneer stir-fry + high-protein soya chunks curry + quinoa grains.'
      },
      nonveg: {
        breakfast: 'Whole eggs scrambled + oats + almonds + protein shake + blueberries.',
        lunch: 'Grilled chicken breast + brown rice/sweet potatoes + broccoli + olive oil glaze.',
        snack: 'Boiled egg whites (5-6) + almonds or raw fruit mix + nuts.',
        dinner: 'Baked Salmon fillet + sweet potato mash + asparagus spears + virgin olive dressing.'
      },
      vegan: {
        breakfast: 'Spelt porridge with chia seeds + hemp seeds + vegan protein shake.',
        lunch: 'Tempeh blocks grilled + brown rice + red lentils dal + steam spinach greens.',
        snack: 'Roasted edamame beans + pumpkin seeds + green tea bowl.',
        dinner: 'Sautéed mock meat strips + broccoli + sweet potato quinoa bowl + avocado fat.'
      }
    }
  },
  cut: {
    title: 'Lean Shred & Definition Plan',
    calories: '1,800 - 2,200 kcal/day',
    macros: { protein: '50%', carbs: '30%', fats: '20%' },
    meals: {
      veg: {
        breakfast: 'Moong dal chilla (sprouts paste pancake) + Greek yogurt bowl.',
        lunch: 'Low-fat paneer salad + cucumber slices + sautéed mushrooms + broccoli.',
        snack: '1 scoop whey protein in cold water + handful of walnuts.',
        dinner: 'Soya chunks stir-fry with bell peppers + baby corn + asparagus (low oil).'
      },
      nonveg: {
        breakfast: 'Egg white omelet (5 whites) + baby spinach + half avocado.',
        lunch: 'Baked cod/tilapia fish + steam broccoli + baby carrots + green tea.',
        snack: 'Grilled chicken breast salad with lemon cilantro dressing.',
        dinner: 'Lean turkey patties or grilled chicken strips + green beans salad + chia seeds.'
      },
      vegan: {
        breakfast: 'Sprouted grains wrap + grilled tofu + spinach leaves.',
        lunch: 'Tofu scramble + steam asparagus + black beans bowl + raw cucumber.',
        snack: 'Organic pumpkin seeds + organic vegan protein water shake.',
        dinner: 'Tempeh cube stir-fry with celery + bell peppers + light sesame dressing.'
      }
    }
  },
  maintain: {
    title: 'Athletic Maintenance Plan',
    calories: '2,400 - 2,700 kcal/day',
    macros: { protein: '35%', carbs: '45%', fats: '20%' },
    meals: {
      veg: {
        breakfast: 'Sprouted moong dal + roasted paneer + multi-grain sandwich + orange.',
        lunch: 'Quinoa stir-fry + paneer cubes + black beans + mixed vegetable salad.',
        snack: 'Mixed berries salad + Greek yogurt cup + pumpkin seeds.',
        dinner: 'High-protein lentil soup + grilled tofu with herbs + baked broccoli.'
      },
      nonveg: {
        breakfast: 'Whole eggs (2) + egg whites (3) scrambled + oatmeal + berries.',
        lunch: 'Grilled chicken breast wrap with whole-wheat tortilla + mixed greens.',
        snack: 'Boiled egg whites (4) + sliced almonds + banana.',
        dinner: 'Grilled sea bass/salmon + quinoa cup + steamed mixed vegetables.'
      },
      vegan: {
        breakfast: 'Chia pudding + hemp protein powder + soy milk shake + walnuts.',
        lunch: 'Lentils pasta with organic tomato sauce + grilled tempeh block + spinach.',
        snack: 'Roasted chickpeas + mixed seeds bowl + apple.',
        dinner: 'Tofu quinoa bowl + roasted sweet potatoes + avocado salad.'
      }
    }
  }
};

const DietPlans = () => {
  const [goal, setGoal] = useState('gain'); // gain, cut, maintain
  const [type, setType] = useState('nonveg'); // veg, nonveg, vegan

  const currentPlan = dietPlans[goal];
  const activeMeals = currentPlan.meals[type];

  const handleNutritionistInquiry = () => {
    const text = encodeURIComponent(`Hello Good Life Fitness! I'm looking to consult a certified sports nutritionist to help me design my diet. Goal: ${goal.toUpperCase()}, Diet Type: ${type.toUpperCase()}.`);
    window.open(`https://wa.me/919999999999?text=${text}`, '_blank');
  };

  return (
    <section id="diet" className="relative py-24 bg-gym-gold/[0.01] dark:bg-gym-dark/20 border-b border-gym-gold/10 dark:border-b-gym-border overflow-hidden transition-colors duration-1000">
      {/* Light flares */}
      <div className="absolute bottom-0 right-[10vw] w-[35vw] h-[35vw] bg-gym-gold-deep/5 dark:bg-gym-silver-deep/5 rounded-full filter blur-[150px] pointer-events-none transition-colors duration-1000" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <h4 className="text-xs font-bold font-display text-gym-gold dark:text-gym-silver uppercase tracking-[0.25em] transition-colors duration-1000">
            NUTRITION BLUEPRINTS
          </h4>
          <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight text-gym-black dark:text-white leading-tight transition-colors duration-1000">
            FUEL THE <span className="text-brand-gradient">MACHINE</span>
          </h2>
          <p className="text-xs md:text-sm text-gym-black/70 dark:text-gym-grey-muted max-w-xl mx-auto font-medium transition-colors duration-1000">
            Physical progress is 70% nutrition. Filter out standardized luxury nutrition templates below.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          {/* Goal Selector */}
          <div className="space-y-3">
            <span className="block text-[10px] uppercase font-bold tracking-widest text-gym-black/60 dark:text-gym-grey-muted transition-colors duration-1000">Select Fitness Goal</span>
            <div className="flex bg-gym-gold/5 dark:bg-gym-black border border-gym-gold/20 dark:border-gym-border p-1 w-full transition-colors duration-1000">
              {['gain', 'cut', 'maintain'].map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`flex-grow py-3 text-xs uppercase tracking-widest font-bold transition-all duration-300 ${
                    goal === g 
                      ? 'bg-gym-gold dark:bg-gym-silver text-gym-black shadow' 
                      : 'text-gym-black/60 dark:text-gym-grey-muted hover:text-gym-black dark:hover:text-white'
                  }`}
                >
                  {g === 'gain' ? 'Gain' : g === 'cut' ? 'Shred' : 'Maintain'}
                </button>
              ))}
            </div>
          </div>

          {/* Diet Type Selector */}
          <div className="space-y-3">
            <span className="block text-[10px] uppercase font-bold tracking-widest text-gym-black/60 dark:text-gym-grey-muted transition-colors duration-1000">Select Dietary Preference</span>
            <div className="flex bg-gym-gold/5 dark:bg-gym-black border border-gym-gold/20 dark:border-gym-border p-1 w-full transition-colors duration-1000">
              {['veg', 'nonveg', 'vegan'].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-grow py-3 text-xs uppercase tracking-widest font-bold transition-all duration-300 ${
                    type === t 
                      ? 'bg-gym-gold dark:bg-gym-silver text-gym-black shadow' 
                      : 'text-gym-black/60 dark:text-gym-grey-muted hover:text-gym-black dark:hover:text-white'
                  }`}
                >
                  {t === 'veg' ? 'Veg' : t === 'nonveg' ? 'Non-Veg' : 'Vegan'}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Blueprint Layout Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel (Macros and calories info) */}
          <div className="lg:col-span-4 glass-brand p-8 flex flex-col justify-between relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gym-gold/5 dark:bg-gym-silver/5 rounded-full filter blur-xl pointer-events-none transition-colors duration-1000" />

            <div className="space-y-6">
              <div className="space-y-1.5 pb-4 border-b border-gym-gold/20 dark:border-gym-border/40 transition-colors duration-1000">
                <span className="text-[10px] font-bold text-gym-gold dark:text-gym-silver uppercase tracking-widest flex items-center gap-1.5 transition-colors duration-1000">
                  <Apple size={12} /> Target Intake
                </span>
                <h3 className="text-xl font-black font-display text-gym-black dark:text-white uppercase tracking-wider transition-colors duration-1000">
                  {currentPlan.title}
                </h3>
              </div>

              <div className="space-y-2">
                <span className="block text-[10px] uppercase text-gym-black/60 dark:text-gym-grey-muted font-bold tracking-wider transition-colors duration-1000">Est. Caloric Target</span>
                <span className="text-2xl font-black font-display text-gym-black dark:text-white block transition-colors duration-1000">{currentPlan.calories}</span>
              </div>

              {/* Macros ratio visualization bars */}
              <div className="space-y-4 pt-4 border-t border-gym-gold/20 dark:border-gym-border/40 transition-colors duration-1000">
                <span className="block text-[10px] uppercase text-gym-black/60 dark:text-gym-grey-muted font-bold tracking-wider transition-colors duration-1000">Recommended Macros Ratio</span>
                
                <div className="space-y-3">
                  {/* Protein */}
                  <div>
                    <div className="flex justify-between text-xs text-gym-black dark:text-white mb-1 font-semibold transition-colors duration-1000">
                      <span>Protein</span>
                      <span className="text-gym-gold dark:text-gym-silver transition-colors duration-1000">{currentPlan.macros.protein}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gym-gold/10 dark:bg-gym-black rounded-full overflow-hidden transition-colors duration-1000">
                      <div className="h-full bg-gym-gold dark:bg-gym-silver transition-colors duration-1000" style={{ width: currentPlan.macros.protein }} />
                    </div>
                  </div>
                  {/* Carbs */}
                  <div>
                    <div className="flex justify-between text-xs text-gym-black dark:text-white mb-1 font-semibold transition-colors duration-1000">
                      <span>Carbs</span>
                      <span className="text-gym-black/60 dark:text-gym-grey-muted transition-colors duration-1000">{currentPlan.macros.carbs}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gym-gold/10 dark:bg-gym-black rounded-full overflow-hidden transition-colors duration-1000">
                      <div className="h-full bg-gym-gold/30 dark:bg-gym-silver/40 transition-colors duration-1000" style={{ width: currentPlan.macros.carbs }} />
                    </div>
                  </div>
                  {/* Fats */}
                  <div>
                    <div className="flex justify-between text-xs text-gym-black dark:text-white mb-1 font-semibold transition-colors duration-1000">
                      <span>Fats</span>
                      <span className="text-gym-black/60 dark:text-gym-grey-muted transition-colors duration-1000">{currentPlan.macros.fats}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gym-gold/10 dark:bg-gym-black rounded-full overflow-hidden transition-colors duration-1000">
                      <div className="h-full bg-gym-gold/20 dark:bg-gym-silver-deep/40 transition-colors duration-1000" style={{ width: currentPlan.macros.fats }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gym-gold/20 dark:border-gym-border/40 mt-8 transition-colors duration-1000">
              <button
                onClick={handleNutritionistInquiry}
                className="w-full py-3.5 bg-gym-gold/10 hover:bg-gym-gold dark:bg-white/5 dark:hover:bg-white border border-gym-gold/30 hover:border-gym-gold dark:border-white/10 dark:hover:border-white text-gym-gold hover:text-gym-black dark:text-white dark:hover:text-gym-black font-display font-black uppercase text-[10px] tracking-widest transition-all duration-500 flex items-center justify-center gap-1.5"
              >
                <Send size={12} />
                Consult Certified Nutritionist
              </button>
            </div>
          </div>

          {/* Right panel (Meal plan breakdown lists) */}
          <div className="lg:col-span-8 glass-brand p-8 relative">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gym-gold/5 dark:bg-gym-silver/5 rounded-full filter blur-2xl pointer-events-none transition-colors duration-1000" />

            <h3 className="text-sm font-bold font-display uppercase tracking-widest text-gym-gold dark:text-gym-silver mb-6 border-b border-gym-gold/20 dark:border-gym-border/40 pb-4 flex items-center gap-2 transition-colors duration-1000">
              <Sparkles size={14} className="animate-pulse text-gym-gold dark:text-gym-silver" /> Daily Meal Schedule Layout
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Meal 1 */}
              <div className="glass-brand p-5 space-y-1.5 border-l-2 border-l-gym-gold dark:border-l-gym-silver hover:border-l-gym-gold-accent dark:hover:border-l-white transition-all duration-300">
                <span className="text-[10px] uppercase font-bold text-gym-gold dark:text-gym-silver tracking-widest block transition-colors duration-1000">Meal 1: Breakfast</span>
                <p className="text-xs text-gym-black/80 dark:text-gym-grey-muted leading-relaxed font-medium transition-colors duration-1000">
                  {activeMeals.breakfast}
                </p>
              </div>

              {/* Meal 2 */}
              <div className="glass-brand p-5 space-y-1.5 border-l-2 border-l-gym-gold dark:border-l-gym-silver hover:border-l-gym-gold-accent dark:hover:border-l-white transition-all duration-300">
                <span className="text-[10px] uppercase font-bold text-gym-gold dark:text-gym-silver tracking-widest block transition-colors duration-1000">Meal 2: Lunch</span>
                <p className="text-xs text-gym-black/80 dark:text-gym-grey-muted leading-relaxed font-medium transition-colors duration-1000">
                  {activeMeals.lunch}
                </p>
              </div>

              {/* Meal 3 */}
              <div className="glass-brand p-5 space-y-1.5 border-l-2 border-l-gym-gold dark:border-l-gym-silver hover:border-l-gym-gold-accent dark:hover:border-l-white transition-all duration-300">
                <span className="text-[10px] uppercase font-bold text-gym-gold dark:text-gym-silver tracking-widest block transition-colors duration-1000">Meal 3: Mid-Day Snack</span>
                <p className="text-xs text-gym-black/80 dark:text-gym-grey-muted leading-relaxed font-medium transition-colors duration-1000">
                  {activeMeals.snack}
                </p>
              </div>

              {/* Meal 4 */}
              <div className="glass-brand p-5 space-y-1.5 border-l-2 border-l-gym-gold dark:border-l-gym-silver hover:border-l-gym-gold-accent dark:hover:border-l-white transition-all duration-300">
                <span className="text-[10px] uppercase font-bold text-gym-gold dark:text-gym-silver tracking-widest block transition-colors duration-1000">Meal 4: Dinner</span>
                <p className="text-xs text-gym-black/80 dark:text-gym-grey-muted leading-relaxed font-medium transition-colors duration-1000">
                  {activeMeals.dinner}
                </p>
              </div>

            </div>

            <div className="mt-8 flex items-start gap-2.5 bg-gym-gold/5 dark:bg-gym-black/40 border border-gym-gold/20 dark:border-gym-border/60 p-4 transition-colors duration-1000">
              <ShieldAlert size={16} className="text-gym-gold dark:text-gym-silver flex-shrink-0 mt-0.5 transition-colors duration-1000" />
              <p className="text-[10px] text-gym-black/60 dark:text-gym-grey-muted leading-relaxed transition-colors duration-1000">
                Standard dietary logs require individual customizations. Do not alter current medical diet plans without consulting a certified primary healthcare provider.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DietPlans;
