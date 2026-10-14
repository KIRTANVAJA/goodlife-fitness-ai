import React, { useState, useEffect } from 'react';
import { 
  Apple, 
  Sparkles, 
  Check, 
  ShoppingBag, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Flame, 
  Droplet,
  Utensils,
  Layers,
  Leaf,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  DIET_BUILDING_BLOCKS, 
  WEEKLY_DIET_SCHEDULE, 
  CONSOLIDATED_GROCERY_LIST, 
  HYDRATION_BLUEPRINT,
  generateClientDietPlan 
} from '../services/dietPlannerService';
import storageService from '../services/storageService';

const DietPlans = () => {
  // Navigation tabs: 'daily' | 'weekly' | 'grocery' | 'hydration'
  const [activeTab, setActiveTab] = useState('daily');

  // Preferences from storageService or default
  const savedPref = storageService.getItem('preferences:diet_clean', {
    goal: 'muscle_building',
    dietType: 'veg',
  });

  const [goal, setGoal] = useState(savedPref.goal || 'muscle_building');
  const [dietType, setDietType] = useState(savedPref.dietType || 'veg');

  // Client-generated plan state
  const [plan, setPlan] = useState(() => {
    return generateClientDietPlan({ fitnessGoal: goal, dietaryPreference: dietType });
  });

  useEffect(() => {
    storageService.setItem('preferences:diet_clean', { goal, dietType });
    const newPlan = generateClientDietPlan({ fitnessGoal: goal, dietaryPreference: dietType });
    setPlan(newPlan);
  }, [goal, dietType]);

  const goals = [
    { id: 'muscle_building', label: 'Muscle Hypertrophy', desc: 'High protein (+250 kcal surplus)' },
    { id: 'fat_loss', label: 'Lean Fat Loss', desc: 'Thermogenic deficit (-350 kcal)' },
    { id: 'endurance', label: 'Athletic Durability', desc: 'Complex glycogen fueling' },
  ];

  const dietTypes = [
    { id: 'veg', label: 'Vegetarian', icon: '🥗' },
    { id: 'vegan', label: 'Vegan (Plant-Based)', icon: '🌱' },
    { id: 'nonveg', label: 'High-Protein Non-Veg', icon: '🍗' },
    { id: 'jain', label: 'Jain (No Onion/Garlic)', icon: '🥣' },
  ];

  return (
    <section id="diet" className="py-24 bg-[#F5F1E8] dark:bg-[#171916] text-[#171916] dark:text-[#F5F1E8] relative overflow-hidden transition-colors border-t border-[#E5E1D7] dark:border-[#2E322C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173F35]/10 dark:bg-[#173F35]/25 border border-[#173F35]/20 dark:border-[#26745A]/30 text-[#173F35] dark:text-[#C6A66B] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
            <Apple className="w-3.5 h-3.5 text-[#C6A66B]" />
            Clean Nutrition & Diet Engine
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#171916] dark:text-[#F5F1E8] tracking-tight font-display">
            Science-Backed Diet Blueprints
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#85877F] dark:text-[#A8AAA3] leading-relaxed">
            Whole-food nutrition blueprints calibrated to your metabolic demands. Exact meal portions, ingredients lists, macronutrient targets, and 7-day culinary logistics.
          </p>

          {/* Navigation Tabs Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-[#FFFFFF] dark:bg-[#1E211D] border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs max-w-xl mx-auto">
            {[
              { id: 'daily', label: 'Daily Meal Breakdown', icon: Utensils },
              { id: 'weekly', label: '7-Day Rotation', icon: Calendar },
              { id: 'grocery', label: 'Grocery Checklist', icon: ShoppingBag },
              { id: 'hydration', label: 'Hydration Guide', icon: Droplet },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                    activeTab === tab.id
                      ? 'bg-[#173F35] text-[#F5F1E8] shadow-xs'
                      : 'text-[#85877F] hover:text-[#171916] dark:hover:text-[#F5F1E8]'
                  }`}
                >
                  <Icon size={14} className={activeTab === tab.id ? 'text-[#C6A66B]' : ''} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dietary Preferences Selectors */}
        <div className="bg-[#FFFFFF] dark:bg-[#1E211D] p-6 sm:p-8 rounded-3xl border border-[#E5E1D7] dark:border-[#2E322C] shadow-sm mb-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Goal Selector */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#85877F] block mb-3">
                1. Select Metabolic Fitness Goal
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                      goal === g.id
                        ? 'bg-[#173F35] text-[#F5F1E8] border-[#173F35] shadow-xs'
                        : 'bg-[#FAF8F3] dark:bg-[#171916] text-[#171916] dark:text-[#F5F1E8] border-[#E5E1D7] dark:border-[#2E322C] hover:border-[#173F35]/40'
                    }`}
                  >
                    <span className="font-bold text-xs">{g.label}</span>
                    <span className={`text-[10px] mt-1 ${goal === g.id ? 'text-[#C6A66B]' : 'text-[#85877F]'}`}>
                      {g.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Diet Type Selector */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#85877F] block mb-3">
                2. Select Dietary Philosophy
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {dietTypes.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDietType(d.id)}
                    className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                      dietType === d.id
                        ? 'bg-[#173F35] text-[#F5F1E8] border-[#173F35] shadow-xs'
                        : 'bg-[#FAF8F3] dark:bg-[#171916] text-[#171916] dark:text-[#F5F1E8] border-[#E5E1D7] dark:border-[#2E322C] hover:border-[#173F35]/40'
                    }`}
                  >
                    <span className="text-xl">{d.icon}</span>
                    <span className="font-semibold text-[11px] leading-tight">{d.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Macro Summary Ribbon */}
          <div className="mt-8 pt-6 border-t border-[#E5E1D7] dark:border-[#2E322C] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C]">
              <span className="text-[10px] uppercase font-bold text-[#85877F] tracking-wider block">Daily Calories</span>
              <span className="text-2xl font-black font-display text-[#171916] dark:text-[#F5F1E8] mt-1 block">
                {plan.targetCalories} <span className="text-xs font-normal text-[#85877F]">kcal</span>
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C]">
              <span className="text-[10px] uppercase font-bold text-[#85877F] tracking-wider block">Protein Target</span>
              <span className="text-2xl font-black font-display text-[#173F35] dark:text-[#C6A66B] mt-1 block">
                {plan.macros.protein}g <span className="text-xs font-normal text-[#85877F]">/ day</span>
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C]">
              <span className="text-[10px] uppercase font-bold text-[#85877F] tracking-wider block">Complex Carbs</span>
              <span className="text-2xl font-black font-display text-[#171916] dark:text-[#F5F1E8] mt-1 block">
                {plan.macros.carbs}g <span className="text-xs font-normal text-[#85877F]">/ day</span>
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C]">
              <span className="text-[10px] uppercase font-bold text-[#85877F] tracking-wider block">Healthy Fats</span>
              <span className="text-2xl font-black font-display text-[#171916] dark:text-[#F5F1E8] mt-1 block">
                {plan.macros.fat}g <span className="text-xs font-normal text-[#85877F]">/ day</span>
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: DAILY MEAL CONTENTS */}
        {/* ========================================================= */}
        {activeTab === 'daily' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Breakfast */}
              <div className="bg-[#FFFFFF] dark:bg-[#1E211D] rounded-3xl p-6 sm:p-7 border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-[#173F35]/10 text-[#173F35] dark:text-[#C6A66B] border border-[#173F35]/15">
                      Meal 1 • Breakfast (08:00 AM)
                    </span>
                    <span className="text-xs font-bold text-[#171916] dark:text-[#F5F1E8]">
                      {plan.meals.breakfast.cals} kcal
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#171916] dark:text-[#F5F1E8] mb-1">
                    {plan.meals.breakfast.name}
                  </h3>
                  <span className="text-[11px] text-[#85877F] font-semibold block mb-4">
                    Portion: {plan.meals.breakfast.portion} • Prep: {plan.meals.breakfast.prepTime}
                  </span>

                  {/* Macros breakdown */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#FAF8F3] dark:bg-[#171916] mb-4 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-[#85877F] block">Protein</span>
                      <strong className="text-[#173F35] dark:text-[#C6A66B]">{plan.meals.breakfast.p}g</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#85877F] block">Carbs</span>
                      <strong className="text-[#171916] dark:text-[#F5F1E8]">{plan.meals.breakfast.c}g</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#85877F] block">Fats</span>
                      <strong className="text-[#171916] dark:text-[#F5F1E8]">{plan.meals.breakfast.f}g</strong>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#85877F] block">
                      Ingredients & Exact Portions:
                    </span>
                    <ul className="text-xs text-[#171916] dark:text-[#F5F1E8] space-y-1">
                      {plan.meals.breakfast.ingredients?.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check size={13} className="text-[#26745A] shrink-0" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E1D7] dark:border-[#2E322C] text-[11px] text-[#85877F] italic">
                  💡 {plan.meals.breakfast.macroNotes}
                </div>
              </div>

              {/* Mid-Morning Snack */}
              <div className="bg-[#FFFFFF] dark:bg-[#1E211D] rounded-3xl p-6 sm:p-7 border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                      Meal 2 • Mid-Morning (11:30 AM)
                    </span>
                    <span className="text-xs font-bold text-[#171916] dark:text-[#F5F1E8]">
                      {plan.meals.snack.cals} kcal
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#171916] dark:text-[#F5F1E8] mb-1">
                    {plan.meals.snack.name}
                  </h3>
                  <span className="text-[11px] text-[#85877F] font-semibold block mb-4">
                    Portion: {plan.meals.snack.portion} • Prep: {plan.meals.snack.prepTime}
                  </span>

                  {/* Macros breakdown */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#FAF8F3] dark:bg-[#171916] mb-4 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-[#85877F] block">Protein</span>
                      <strong className="text-[#173F35] dark:text-[#C6A66B]">{plan.meals.snack.p}g</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#85877F] block">Carbs</span>
                      <strong className="text-[#171916] dark:text-[#F5F1E8]">{plan.meals.snack.c}g</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#85877F] block">Fats</span>
                      <strong className="text-[#171916] dark:text-[#F5F1E8]">{plan.meals.snack.f}g</strong>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#85877F] block">
                      Ingredients & Exact Portions:
                    </span>
                    <ul className="text-xs text-[#171916] dark:text-[#F5F1E8] space-y-1">
                      {plan.meals.snack.ingredients?.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check size={13} className="text-[#26745A] shrink-0" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E1D7] dark:border-[#2E322C] text-[11px] text-[#85877F] italic">
                  💡 {plan.meals.snack.macroNotes}
                </div>
              </div>

              {/* Lunch */}
              <div className="bg-[#FFFFFF] dark:bg-[#1E211D] rounded-3xl p-6 sm:p-7 border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      Meal 3 • Power Lunch (01:30 PM)
                    </span>
                    <span className="text-xs font-bold text-[#171916] dark:text-[#F5F1E8]">
                      {plan.meals.lunch.cals} kcal
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#171916] dark:text-[#F5F1E8] mb-1">
                    {plan.meals.lunch.name}
                  </h3>
                  <span className="text-[11px] text-[#85877F] font-semibold block mb-4">
                    Portion: {plan.meals.lunch.portion} • Prep: {plan.meals.lunch.prepTime}
                  </span>

                  {/* Macros breakdown */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#FAF8F3] dark:bg-[#171916] mb-4 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-[#85877F] block">Protein</span>
                      <strong className="text-[#173F35] dark:text-[#C6A66B]">{plan.meals.lunch.p}g</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#85877F] block">Carbs</span>
                      <strong className="text-[#171916] dark:text-[#F5F1E8]">{plan.meals.lunch.c}g</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#85877F] block">Fats</span>
                      <strong className="text-[#171916] dark:text-[#F5F1E8]">{plan.meals.lunch.f}g</strong>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#85877F] block">
                      Ingredients & Exact Portions:
                    </span>
                    <ul className="text-xs text-[#171916] dark:text-[#F5F1E8] space-y-1">
                      {plan.meals.lunch.ingredients?.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check size={13} className="text-[#26745A] shrink-0" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E1D7] dark:border-[#2E322C] text-[11px] text-[#85877F] italic">
                  💡 {plan.meals.lunch.macroNotes}
                </div>
              </div>

              {/* Dinner */}
              <div className="bg-[#FFFFFF] dark:bg-[#1E211D] rounded-3xl p-6 sm:p-7 border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                      Meal 4 • Nocturnal Recovery Dinner (08:00 PM)
                    </span>
                    <span className="text-xs font-bold text-[#171916] dark:text-[#F5F1E8]">
                      {plan.meals.dinner.cals} kcal
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#171916] dark:text-[#F5F1E8] mb-1">
                    {plan.meals.dinner.name}
                  </h3>
                  <span className="text-[11px] text-[#85877F] font-semibold block mb-4">
                    Portion: {plan.meals.dinner.portion} • Prep: {plan.meals.dinner.prepTime}
                  </span>

                  {/* Macros breakdown */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#FAF8F3] dark:bg-[#171916] mb-4 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-[#85877F] block">Protein</span>
                      <strong className="text-[#173F35] dark:text-[#C6A66B]">{plan.meals.dinner.p}g</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#85877F] block">Carbs</span>
                      <strong className="text-[#171916] dark:text-[#F5F1E8]">{plan.meals.dinner.c}g</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#85877F] block">Fats</span>
                      <strong className="text-[#171916] dark:text-[#F5F1E8]">{plan.meals.dinner.f}g</strong>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#85877F] block">
                      Ingredients & Exact Portions:
                    </span>
                    <ul className="text-xs text-[#171916] dark:text-[#F5F1E8] space-y-1">
                      {plan.meals.dinner.ingredients?.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check size={13} className="text-[#26745A] shrink-0" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E1D7] dark:border-[#2E322C] text-[11px] text-[#85877F] italic">
                  💡 {plan.meals.dinner.macroNotes}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: 7-DAY ROTATION SCHEDULE */}
        {/* ========================================================= */}
        {activeTab === 'weekly' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {WEEKLY_DIET_SCHEDULE.map((dayPlan, idx) => (
                <div
                  key={idx}
                  className="bg-[#FFFFFF] dark:bg-[#1E211D] p-6 rounded-3xl border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold font-serif text-[#173F35] dark:text-[#C6A66B]">
                        {dayPlan.day}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C]">
                        {dayPlan.targetCalories} kcal
                      </span>
                    </div>

                    <span className="text-[11px] text-[#85877F] block mb-4">
                      {dayPlan.theme}
                    </span>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#171916]">
                        <span className="text-[10px] text-[#85877F] uppercase font-bold block">Breakfast</span>
                        <span className="font-semibold text-[#171916] dark:text-[#F5F1E8]">{dayPlan.breakfast}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#171916]">
                        <span className="text-[10px] text-[#85877F] uppercase font-bold block">Lunch</span>
                        <span className="font-semibold text-[#171916] dark:text-[#F5F1E8]">{dayPlan.lunch}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#171916]">
                        <span className="text-[10px] text-[#85877F] uppercase font-bold block">Snack</span>
                        <span className="font-semibold text-[#171916] dark:text-[#F5F1E8]">{dayPlan.snack}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#171916]">
                        <span className="text-[10px] text-[#85877F] uppercase font-bold block">Dinner</span>
                        <span className="font-semibold text-[#171916] dark:text-[#F5F1E8]">{dayPlan.dinner}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E5E1D7] dark:border-[#2E322C] flex justify-between text-[11px] text-[#85877F]">
                    <span>Protein: <strong className="text-[#173F35] dark:text-[#C6A66B]">{dayPlan.proteinGrams}g</strong></span>
                    <span>Carbs: <strong className="text-[#171916] dark:text-[#F5F1E8]">{dayPlan.carbsGrams}g</strong></span>
                    <span>Fats: <strong className="text-[#171916] dark:text-[#F5F1E8]">{dayPlan.fatGrams}g</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: GROCERY SHOPPING INVENTORY */}
        {/* ========================================================= */}
        {activeTab === 'grocery' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CONSOLIDATED_GROCERY_LIST.map((group, idx) => (
              <div
                key={idx}
                className="bg-[#FFFFFF] dark:bg-[#1E211D] p-6 sm:p-7 rounded-3xl border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs"
              >
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="w-4 h-4 text-[#C6A66B]" />
                  <h3 className="font-bold text-sm text-[#171916] dark:text-[#F5F1E8]">
                    {group.category}
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {group.items.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C] flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#171916] dark:text-[#F5F1E8] block">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-[#85877F]">{item.notes}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] dark:bg-[#1E211D] border border-[#E5E1D7] dark:border-[#2E322C] font-mono text-[11px] font-bold text-[#173F35] dark:text-[#C6A66B]">
                        {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: HYDRATION & ELECTROLYTE PROTOCOL */}
        {/* ========================================================= */}
        {activeTab === 'hydration' && (
          <div className="bg-[#FFFFFF] dark:bg-[#1E211D] p-7 sm:p-9 rounded-3xl border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#E5E1D7] dark:border-[#2E322C]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#85877F] tracking-wider block">
                  Prescribed Daily Water Volume
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#173F35] dark:text-[#C6A66B] mt-1">
                  {HYDRATION_BLUEPRINT.dailyTargetLiters}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#173F35]/10 text-[#173F35] dark:text-[#C6A66B] flex items-center justify-center">
                <Droplet size={24} />
              </div>
            </div>

            <div className="space-y-4">
              {HYDRATION_BLUEPRINT.schedule.map((slot, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-[#171916] dark:text-[#F5F1E8] block">
                      {slot.time}
                    </span>
                    <p className="text-[#85877F] dark:text-[#A8AAA3] leading-relaxed">
                      {slot.detail}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-[#FFFFFF] dark:bg-[#1E211D] border border-[#E5E1D7] dark:border-[#2E322C] font-mono font-bold text-[#173F35] dark:text-[#C6A66B] shrink-0 text-center">
                    {slot.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default DietPlans;
