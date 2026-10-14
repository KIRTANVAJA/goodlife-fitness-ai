import React, { useState, useEffect } from 'react';
import { 
  Apple, 
  Sparkles, 
  Lock, 
  Check, 
  ShoppingBag, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  Flame,
  AlertCircle,
  Save,
  Trash2,
  Bookmark,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';
import storageService from '../services/storageService';
import { useAuth } from '../context/AuthContext';

const DietPlans = () => {
  const { user, isPremium, upgradeToPremium, isAuthenticated } = useAuth();

  // Active view tab: 'daily' | 'saved' | 'weekly'
  const [activeTab, setActiveTab] = useState('daily');

  // Preferences from storageService or defaults
  const savedPref = storageService.getItem('preferences:diet', {
    goal: 'muscle_building',
    dietType: 'veg',
    allergies: [],
    cuisine: 'Indian',
  });

  const [goal, setGoal] = useState(savedPref.goal || 'muscle_building');
  const [dietType, setDietType] = useState(savedPref.dietType || 'veg');
  const [allergies, setAllergies] = useState(savedPref.allergies || []);
  const [cuisine, setCuisine] = useState(savedPref.cuisine || 'Indian');

  const [dailyPlan, setDailyPlan] = useState(null);
  const [premiumPlan, setPremiumPlan] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Fetch free daily diet plan
  const fetchDailyPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/diet/generate', {
        fitnessGoal: goal,
        dietaryPreference: dietType,
        allergies,
        cuisine,
      });
      if (res.success && res.data) {
        setDailyPlan(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate nutrition blueprint');
    } finally {
      setLoading(false);
    }
  };

  // Fetch premium weekly diet plan
  const fetchWeeklyPlan = async () => {
    if (!isPremium) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/diet/premium-plan', {
        fitnessGoal: goal,
        dietaryPreference: dietType,
        allergies,
        cuisine,
      });
      if (res.success && res.data) {
        setPremiumPlan(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load weekly schedule');
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved plans for authenticated user
  const fetchSavedPlans = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/diet/plans');
      if (res.success && res.data) {
        setSavedPlans(res.data);
      }
    } catch (err) {
      console.warn('Failed to load saved diet plans:', err.message);
    }
  };

  useEffect(() => {
    storageService.setItem('preferences:diet', { goal, dietType, allergies, cuisine });
    if (activeTab === 'daily') {
      fetchDailyPlan();
    } else if (activeTab === 'weekly' && isPremium) {
      fetchWeeklyPlan();
    } else if (activeTab === 'saved' && isAuthenticated) {
      fetchSavedPlans();
    }
  }, [goal, dietType, allergies, cuisine, activeTab, isPremium, isAuthenticated]);

  const toggleAllergy = (allergen) => {
    setAllergies((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
    );
  };

  const handleSavePlan = async () => {
    if (!isAuthenticated || !dailyPlan) return;
    setSavingPlan(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const payload = {
        planName: `${dietType.toUpperCase()} ${goal.replace('_', ' ').toUpperCase()} Blueprint`,
        fitnessGoal: goal,
        dietaryPreference: dietType,
        allergies,
        cuisine,
        dailyCaloricTarget: dailyPlan.targetCalories || 2200,
        macronutrientDistribution: {
          proteinGrams: dailyPlan.macros?.protein || 130,
          carbsGrams: dailyPlan.macros?.carbs || 220,
          fatGrams: dailyPlan.macros?.fat || 55,
        },
        mealBreakdown: [
          {
            mealName: 'Breakfast',
            scheduledTime: '08:00 AM',
            items: [dailyPlan.meals?.breakfast],
            totalMealCalories: dailyPlan.meals?.breakfast?.cals || 380,
          },
          {
            mealName: 'Lunch',
            scheduledTime: '01:00 PM',
            items: [dailyPlan.meals?.lunch],
            totalMealCalories: dailyPlan.meals?.lunch?.cals || 540,
          },
          {
            mealName: 'Evening Snack',
            scheduledTime: '05:00 PM',
            items: [dailyPlan.meals?.snack],
            totalMealCalories: dailyPlan.meals?.snack?.cals || 220,
          },
          {
            mealName: 'Dinner',
            scheduledTime: '08:30 PM',
            items: [dailyPlan.meals?.dinner],
            totalMealCalories: dailyPlan.meals?.dinner?.cals || 450,
          },
        ].filter((m) => m.items[0]),
        hydrationRecommendationLiters: 3.2,
      };

      const res = await api.post('/diet/plans', payload);
      if (res.success) {
        setSaveSuccess(true);
        fetchSavedPlans();
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      setError(err.message || 'Failed to save diet plan to MongoDB.');
    } finally {
      setSavingPlan(false);
    }
  };

  const handleDeleteSavedPlan = async (planId) => {
    try {
      await api.delete(`/diet/plans/${planId}`);
      setSavedPlans((prev) => prev.filter((p) => p._id !== planId));
    } catch (err) {
      setError(err.message || 'Failed to delete plan.');
    }
  };

  return (
    <section id="diet" className="py-24 bg-[#FAF8F3] dark:bg-[#1A1D19] border-t border-[#E5E1D7] dark:border-[#2E322C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173F35]/10 dark:bg-[#173F35]/25 border border-[#173F35]/20 dark:border-[#26745A]/30 text-[#173F35] dark:text-[#C6A66B] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
            <Apple className="w-3.5 h-3.5 text-[#C6A66B]" />
            Clinical Nutrition Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171916] dark:text-[#F5F1E8] tracking-tight font-display">
            Personalized Dietary Consultation
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#85877F] dark:text-[#A8AAA3]">
            Calibrated macronutrient targets and authentic whole-food Indian nutrition engineered for hypertrophy, metabolic acceleration, and longevity.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 rounded-xl bg-[#FFFFFF] dark:bg-[#1E211D] border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                activeTab === 'daily'
                  ? 'bg-[#173F35] text-[#F5F1E8] shadow-xs'
                  : 'text-[#85877F] hover:text-[#171916] dark:hover:text-[#F5F1E8]'
              }`}
            >
              Daily Blueprint (Free)
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                activeTab === 'saved'
                  ? 'bg-[#173F35] text-[#F5F1E8] shadow-xs'
                  : 'text-[#85877F] hover:text-[#171916] dark:hover:text-[#F5F1E8]'
              }`}
            >
              Saved Blueprints {isAuthenticated && `(${savedPlans.length})`}
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
                activeTab === 'weekly'
                  ? 'bg-[#173F35] text-[#F5F1E8] shadow-xs'
                  : 'text-[#85877F] hover:text-[#171916] dark:hover:text-[#F5F1E8]'
              }`}
            >
              <span>Weekly Logistics</span>
              {!isPremium && <Lock size={11} className="text-[#C6A66B]" />}
            </button>
          </div>
        </div>

        {/* Preferences Consultation Bar */}
        <div className="bg-[#FFFFFF] dark:bg-[#1E211D] rounded-2xl border border-[#E5E1D7] dark:border-[#2E322C] p-6 shadow-xs mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Goal */}
            <div>
              <label className="block text-[10.5px] uppercase font-bold text-[#85877F] dark:text-[#A8AAA3] tracking-wider mb-2">
                Primary Athletic Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C] text-[#171916] dark:text-[#F5F1E8] text-xs font-semibold focus:outline-none focus:border-[#173F35]"
              >
                <option value="muscle_building">Muscle Hypertrophy & Strength</option>
                <option value="fat_loss">Fat Loss & Metabolic Definition</option>
                <option value="general_fitness">General Durability & Health</option>
                <option value="endurance">Endurance & Cardiovascular Capacity</option>
              </select>
            </div>

            {/* Dietary Type */}
            <div>
              <label className="block text-[10.5px] uppercase font-bold text-[#85877F] dark:text-[#A8AAA3] tracking-wider mb-2">
                Dietary Framework
              </label>
              <select
                value={dietType}
                onChange={(e) => setDietType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C] text-[#171916] dark:text-[#F5F1E8] text-xs font-semibold focus:outline-none focus:border-[#173F35]"
              >
                <option value="veg">Vegetarian (Lacto-Vegetarian)</option>
                <option value="nonveg">High-Protein Non-Vegetarian</option>
                <option value="vegan">100% Plant-Based Vegan</option>
                <option value="jain">Jain (No Root Vegetables / Onion / Garlic)</option>
              </select>
            </div>

            {/* Cuisine */}
            <div>
              <label className="block text-[10.5px] uppercase font-bold text-[#85877F] dark:text-[#A8AAA3] tracking-wider mb-2">
                Cuisine Profile
              </label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C] text-[#171916] dark:text-[#F5F1E8] text-xs font-semibold focus:outline-none focus:border-[#173F35]"
              >
                <option value="Indian">Regional Indian Whole Foods</option>
                <option value="Mediterranean">Mediterranean & Olive Oil</option>
                <option value="Continental">Clean Continental Macro Bowl</option>
              </select>
            </div>

            {/* Allergies & Restrictions */}
            <div>
              <label className="block text-[10.5px] uppercase font-bold text-[#85877F] dark:text-[#A8AAA3] tracking-wider mb-2">
                Exclude Allergens
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['dairy', 'nuts', 'gluten', 'soy'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAllergy(item)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
                      allergies.includes(item)
                        ? 'bg-rose-600 text-white'
                        : 'bg-[#FAF8F3] dark:bg-[#171916] text-[#85877F] border border-[#E5E1D7] dark:border-[#2E322C]'
                    }`}
                  >
                    {allergies.includes(item) ? `✕ ${item}` : `+ ${item}`}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* TAB 1: DAILY BLUEPRINT */}
        {activeTab === 'daily' && (
          <div>
            {loading ? (
              <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#173F35] mx-auto mb-3"></div>
                <p className="text-xs text-[#85877F]">Formulating individualized macro calculations...</p>
              </div>
            ) : dailyPlan ? (
              <div className="space-y-8">
                {/* Macronutrient Header Banner */}
                <div className="bg-[#173F35] text-[#F5F1E8] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C6A66B] block mb-1">
                      Target Energy Expenditure
                    </span>
                    <h3 className="text-3xl font-extrabold font-display">
                      {dailyPlan.targetCalories} <span className="text-sm font-normal text-[#FAF8F3]/80">kcal / day</span>
                    </h3>
                    <p className="text-xs text-[#FAF8F3]/70 mt-1 max-w-md">
                      Calibrated based on a standard adult metabolic baseline and active resistance conditioning.
                    </p>
                  </div>

                  {/* Macro Counters */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
                    <div className="bg-[#102B24] px-4 py-3 rounded-2xl border border-[#26745A]/40">
                      <span className="text-[9px] uppercase font-bold text-[#C6A66B] block">Protein</span>
                      <span className="text-lg font-black text-white">{dailyPlan.macros?.protein}g</span>
                    </div>
                    <div className="bg-[#102B24] px-4 py-3 rounded-2xl border border-[#26745A]/40">
                      <span className="text-[9px] uppercase font-bold text-[#C6A66B] block">Carbs</span>
                      <span className="text-lg font-black text-white">{dailyPlan.macros?.carbs}g</span>
                    </div>
                    <div className="bg-[#102B24] px-4 py-3 rounded-2xl border border-[#26745A]/40">
                      <span className="text-[9px] uppercase font-bold text-[#C6A66B] block">Fats</span>
                      <span className="text-lg font-black text-white">{dailyPlan.macros?.fat}g</span>
                    </div>
                  </div>

                  {/* Save to Profile Button */}
                  {isAuthenticated && (
                    <button
                      onClick={handleSavePlan}
                      disabled={savingPlan}
                      className="px-5 py-3 rounded-xl bg-[#C6A66B] hover:bg-[#D8BF8F] text-[#171916] text-xs font-bold uppercase tracking-wider transition shrink-0 flex items-center gap-2 shadow-xs disabled:opacity-60"
                    >
                      <Save size={14} />
                      {savingPlan ? 'Saving...' : saveSuccess ? 'Saved to Cloud ✅' : 'Save Blueprint'}
                    </button>
                  )}
                </div>

                {/* 4 Meals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(dailyPlan.meals || {}).map(([mealKey, meal]) => {
                    const titles = {
                      breakfast: 'Breakfast (08:00 AM)',
                      lunch: 'Lunch (01:00 PM)',
                      snack: 'Pre/Post Workout (05:00 PM)',
                      dinner: 'Dinner (08:30 PM)',
                    };

                    return (
                      <div
                        key={mealKey}
                        className="bg-[#FFFFFF] dark:bg-[#1E211D] p-6 rounded-2xl border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D7] dark:border-[#2E322C] mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#173F35] dark:text-[#C6A66B]">
                              {titles[mealKey] || mealKey}
                            </span>
                            <span className="text-xs font-bold font-mono text-[#171916] dark:text-[#F5F1E8]">
                              {meal.cals} kcal
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-[#171916] dark:text-[#F5F1E8] mb-2">
                            {meal.name}
                          </h4>

                          <p className="text-xs text-[#85877F] dark:text-[#A8AAA3] mb-3">
                            <strong>Portion:</strong> {meal.portion}
                          </p>

                          <div className="text-xs text-[#85877F] dark:text-[#A8AAA3] space-y-1">
                            <span className="font-bold text-[10px] uppercase tracking-wider block text-[#171916] dark:text-[#F5F1E8]">
                              Ingredients:
                            </span>
                            <ul className="list-disc list-inside space-y-0.5 text-[11.5px]">
                              {meal.ingredients?.map((ing, i) => (
                                <li key={i}>{ing}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Meal Macro Pill */}
                        <div className="mt-4 pt-3 border-t border-[#E5E1D7] dark:border-[#2E322C] flex items-center justify-between text-[11px] font-semibold text-[#85877F]">
                          <span>Protein: {meal.p}g</span>
                          <span>Carbs: {meal.c}g</span>
                          <span>Fat: {meal.f}g</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* TAB 2: SAVED BLUEPRINTS */}
        {activeTab === 'saved' && (
          <div>
            {!isAuthenticated ? (
              <div className="bg-[#FFFFFF] dark:bg-[#1E211D] rounded-3xl p-10 text-center border border-[#E5E1D7] dark:border-[#2E322C] max-w-xl mx-auto">
                <Bookmark className="w-10 h-10 text-[#C6A66B] mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[#171916] dark:text-[#F5F1E8]">
                  Save Your Blueprints to the Cloud
                </h3>
                <p className="text-xs text-[#85877F] mt-2 mb-6">
                  Sign in or create an account to persist custom meal blueprints in MongoDB and reload them on any device.
                </p>
                <button
                  onClick={() => setActiveTab('daily')}
                  className="px-5 py-2.5 rounded-xl bg-[#173F35] text-[#F5F1E8] text-xs font-semibold"
                >
                  Generate Free Blueprint
                </button>
              </div>
            ) : savedPlans.length === 0 ? (
              <div className="bg-[#FFFFFF] dark:bg-[#1E211D] rounded-3xl p-10 text-center border border-[#E5E1D7] dark:border-[#2E322C] max-w-xl mx-auto">
                <Bookmark className="w-10 h-10 text-[#85877F] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#171916] dark:text-[#F5F1E8]">
                  No Saved Diet Plans Yet
                </h3>
                <p className="text-xs text-[#85877F] mt-1 mb-6">
                  Configure your preferences in the Daily Blueprint tab and click "Save Blueprint" to store it permanently in your account.
                </p>
                <button
                  onClick={() => setActiveTab('daily')}
                  className="px-5 py-2 rounded-xl bg-[#173F35] text-[#F5F1E8] text-xs font-semibold"
                >
                  Create Your First Plan
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPlans.map((plan) => (
                  <div
                    key={plan._id}
                    className="bg-[#FFFFFF] dark:bg-[#1E211D] p-6 rounded-2xl border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C6A66B]">
                          {plan.dietaryPreference} &bull; {plan.fitnessGoal?.replace('_', ' ')}
                        </span>
                        <button
                          onClick={() => handleDeleteSavedPlan(plan._id)}
                          className="text-[#85877F] hover:text-rose-600 p-1"
                          title="Delete saved plan"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <h4 className="font-bold text-sm text-[#171916] dark:text-[#F5F1E8]">
                        {plan.planName}
                      </h4>
                      <p className="text-xl font-extrabold font-display text-[#173F35] dark:text-[#C6A66B] my-2">
                        {plan.dailyCaloricTarget} kcal
                      </p>
                      <div className="flex gap-3 text-xs text-[#85877F]">
                        <span>P: {plan.macronutrientDistribution?.proteinGrams}g</span>
                        <span>C: {plan.macronutrientDistribution?.carbsGrams}g</span>
                        <span>F: {plan.macronutrientDistribution?.fatGrams}g</span>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#E5E1D7] dark:border-[#2E322C] space-y-1.5">
                        {plan.mealBreakdown?.map((m, idx) => (
                          <div key={idx} className="text-[11.5px] text-[#85877F] flex justify-between">
                            <span>{m.mealName}:</span>
                            <span className="font-medium text-[#171916] dark:text-[#F5F1E8] truncate max-w-[150px]">
                              {m.items?.[0]?.name || 'Scheduled Meal'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E5E1D7] dark:border-[#2E322C] text-[10px] text-[#85877F]">
                      Saved {new Date(plan.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WEEKLY LOGISTICS (Member Tier) */}
        {activeTab === 'weekly' && (
          <div>
            {!isPremium ? (
              <div className="bg-[#FFFFFF] dark:bg-[#1E211D] rounded-3xl p-10 text-center border border-[#C6A66B]/30 max-w-xl mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-[#C6A66B]/15 text-[#C6A66B] flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#171916] dark:text-[#F5F1E8]">
                  Weekly Meal Schedules & Grocery Logistics
                </h3>
                <p className="text-xs text-[#85877F] mt-2 mb-6 leading-relaxed">
                  7-day rotational menus, consolidated grocery shopping ingredient quantities, and batch-cooking guidance are reserved for Good Life private club members.
                </p>
                <button
                  onClick={upgradeToPremium}
                  className="px-6 py-3 rounded-xl bg-[#173F35] hover:bg-[#1F5144] text-[#F5F1E8] text-xs font-bold uppercase tracking-wider transition shadow-sm"
                >
                  Upgrade to Member ($29/mo)
                </button>
              </div>
            ) : premiumPlan ? (
              <div className="space-y-6">
                <div className="bg-[#FFFFFF] dark:bg-[#1E211D] p-6 rounded-2xl border border-[#E5E1D7] dark:border-[#2E322C]">
                  <h3 className="text-lg font-bold text-[#171916] dark:text-[#F5F1E8] mb-4">
                    7-Day Consolidated Grocery List
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {premiumPlan.shoppingList?.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C] text-xs">
                        <span className="font-bold text-[#171916] dark:text-[#F5F1E8] block">{item.name}</span>
                        <span className="text-[#85877F] text-[11px]">{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

      </div>
    </section>
  );
};

export default DietPlans;
