import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Dumbbell, 
  Play, 
  Camera, 
  History, 
  Flame, 
  Timer, 
  Trophy, 
  ArrowRight, 
  CheckCircle2, 
  Target,
  TrendingUp,
  User,
  ShieldCheck, 
  Lock, 
  ChevronRight, 
  RefreshCw, 
  Activity,
  Utensils,
  Scale,
  Calendar,
  Layers
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import api from '../services/api';
import storageService from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AiCoachDashboard = () => {
  const { user, isPremium, upgradeToPremium } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(() => {
    if (user?.id) {
      return storageService.getUserItem(user.id, 'stats-cache', null);
    }
    return null;
  });
  const [recommendations, setRecommendations] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(!stats);
  const [upgrading, setUpgrading] = useState(false);

  // Interrupted workout recovery check
  const [interruptedWorkout, setInterruptedWorkout] = useState(() => {
    if (!user?.id) return null;
    const rec = storageService.getUserItem(user.id, 'workout-recovery', null);
    if (rec && rec.lastUpdatedAt && (Date.now() - rec.lastUpdatedAt) < 24 * 60 * 60 * 1000) {
      return rec;
    }
    return null;
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const promises = [
          api.get('/workouts/stats'),
          api.get('/recommendations'),
        ];

        // Also fetch measurements and saved diet plans if user is authenticated
        if (user) {
          promises.push(api.get('/body/measurements').catch(() => ({ success: false, data: [] })));
          promises.push(api.get('/diet/plans').catch(() => ({ success: false, data: [] })));
        }

        const [statsRes, recsRes, bodyRes, dietRes] = await Promise.all(promises);

        if (statsRes?.success && statsRes.data) {
          setStats(statsRes.data);
          if (user?.id) {
            storageService.setUserItem(user.id, 'stats-cache', statsRes.data);
          }
        }

        if (recsRes?.success && recsRes.data) {
          setRecommendations(recsRes.data.recommendations || []);
        }

        if (bodyRes?.success && Array.isArray(bodyRes.data)) {
          setMeasurements(bodyRes.data);
        }

        if (dietRes?.success && Array.isArray(dietRes.data)) {
          setDietPlans(dietRes.data);
        }
      } catch (err) {
        console.warn('Dashboard data fetch warning:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      await upgradeToPremium();
    } catch (err) {
      console.error('Upgrade failed:', err);
    } finally {
      setUpgrading(false);
    }
  };

  const chartData = stats?.weeklyActivity || [
    { day: 'Mon', sessions: 0 },
    { day: 'Tue', sessions: 0 },
    { day: 'Wed', sessions: 0 },
    { day: 'Thu', sessions: 0 },
    { day: 'Fri', sessions: 0 },
    { day: 'Sat', sessions: 0 },
    { day: 'Sun', sessions: 0 },
  ];

  const latestMeasurement = measurements.length > 0 ? measurements[0] : null;

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#171916] flex flex-col font-sans transition-colors selection:bg-[#C6A66B]/20 selection:text-[#171916]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        
        {/* Top Header & Greeting */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.16em] ${
                isPremium
                  ? 'bg-[#173F35] text-[#C6A66B] border border-[#26745A]'
                  : 'bg-[#FFFFFF] text-[#85877F] border border-[#E5E1D7]'
              }`}>
                {isPremium ? 'Good Life Member' : 'Free Sanctuary Account'}
              </span>
              <span className="text-xs text-[#85877F]">
                {user?.profile?.fitnessLevel ? `Level: ${user.profile.fitnessLevel}` : 'Private Studio'}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#171916]">
              Welcome back, {user?.name?.split(' ')[0] || 'Athlete'}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#85877F] max-w-2xl leading-relaxed">
              Continuous biomechanical audit, repetition ledger, and synchronized nutrition blueprints tailored to your durability.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/exercises"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173F35] hover:bg-[#1f5043] text-[#F5F1E8] text-xs font-semibold tracking-wider uppercase transition shadow-sm"
            >
              <Camera className="w-4 h-4 text-[#C6A66B]" />
              Launch AI Studio
            </Link>
          </div>
        </div>

        {/* Interrupted Workout Recovery Alert Banner */}
        {interruptedWorkout && (
          <div className="mb-8 p-5 bg-[#FFFFFF] border-l-4 border-l-[#C6A66B] rounded-2xl border border-[#E5E1D7] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] flex items-center justify-center shrink-0">
                <RefreshCw size={18} className="animate-spin" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#171916] block">
                  Interrupted Session Available: {interruptedWorkout.exerciseName || 'Workout'}
                </span>
                <span className="text-xs text-[#85877F]">
                  {interruptedWorkout.completedSets?.length || 0} completed sets saved locally in your browser storage.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigate(`/workout/active/${interruptedWorkout.exerciseId}`)}
                className="px-4 py-2 rounded-xl bg-[#173F35] hover:bg-[#1f5043] text-[#F5F1E8] text-xs font-semibold transition"
              >
                Resume Session
              </button>
              <button
                onClick={() => {
                  if (user?.id) storageService.removeUserItem(user.id, 'workout-recovery');
                  setInterruptedWorkout(null);
                }}
                className="px-3.5 py-2 rounded-xl border border-[#E5E1D7] text-[#85877F] hover:text-[#171916] text-xs transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Free Plan Upgrade CTA Banner (For Free Users) */}
        {!isPremium && (
          <div className="mb-10 p-8 bg-[#171916] text-[#F5F1E8] rounded-3xl border border-[#2A3029] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#173F35]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-2 max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173F35] text-[#C6A66B] text-[10px] font-bold uppercase tracking-[0.2em] border border-[#26745A]">
                <Sparkles size={12} />
                Private Membership Access
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F1E8]">
                Unlock Real-Time Computer Vision Optical Pose Tracking
              </h3>
              <p className="text-xs text-[#A6A7A1] leading-relaxed">
                As a free sanctuary guest, you have full access to our public BMI calculator, manual exercise library, and daily diet blueprints. Elevate to Good Life Member to unlock 33-point joint optical tracking, auditory posture coaching cues, and cloud weekly logistics.
              </p>
            </div>
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="px-6 py-3.5 rounded-xl bg-[#C6A66B] hover:bg-[#b08f52] text-[#171916] text-xs font-bold uppercase tracking-wider transition shrink-0 shadow-sm flex items-center gap-2 disabled:opacity-60 relative z-10"
            >
              <Sparkles size={14} />
              {upgrading ? 'Upgrading...' : 'Upgrade to Member ($29/mo)'}
              <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* Core Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E1D7] shadow-sm hover:border-[#173F35]/30 transition">
            <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#85877F] block">
              Completed Workouts
            </span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#171916] mt-2">
              {stats?.totalWorkouts ?? 0}
            </p>
            <span className="text-[11px] text-[#85877F] block mt-1.5">
              Verified MongoDB ledger
            </span>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E1D7] shadow-sm hover:border-[#173F35]/30 transition">
            <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#85877F] block">
              Verified Repetitions
            </span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#173F35] mt-2">
              {stats?.totalReps ?? 0}
            </p>
            <span className="text-[11px] text-[#85877F] block mt-1.5">
              Biomechanical cycles audited
            </span>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E1D7] shadow-sm hover:border-[#173F35]/30 transition">
            <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#85877F] block">
              Active Time Under Load
            </span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#171916] mt-2">
              {stats?.totalDurationMinutes ?? 0} <span className="text-base font-normal text-[#85877F]">min</span>
            </p>
            <span className="text-[11px] text-[#85877F] block mt-1.5">
              Recorded exertion duration
            </span>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E1D7] shadow-sm hover:border-[#173F35]/30 transition">
            <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#85877F] block">
              Est. Energy Expenditure
            </span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#171916] mt-2">
              {stats?.totalCaloriesBurned ? `${stats.totalCaloriesBurned}` : '0'}{' '}
              <span className="text-base font-normal text-[#85877F]">kcal</span>
            </p>
            <span className="text-[11px] text-[#85877F] block mt-1.5">
              MET bodyweight calculation
            </span>
          </div>
        </div>

        {/* Activity Chart & Prescribed Movements */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          
          {/* Weekly Activity Chart */}
          <div className="lg:col-span-7 bg-[#FFFFFF] rounded-3xl border border-[#E5E1D7] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#85877F] block mb-1">
                  Training Frequency
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#171916]">
                  Past 7 Days Session Adherence
                </h3>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#173F35]/10 text-[#173F35] border border-[#173F35]/20">
                {stats?.past7Days?.workoutCount || 0} workouts logged
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E1D7" opacity={0.7} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#85877F" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={{ stroke: '#E5E1D7' }} 
                  />
                  <YAxis 
                    allowDecimals={false} 
                    stroke="#85877F" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#171916', 
                      borderColor: '#2A3029', 
                      borderRadius: '16px',
                      color: '#F5F1E8',
                      fontSize: '11px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                    }} 
                    itemStyle={{ color: '#C6A66B' }}
                  />
                  <Bar dataKey="sessions" fill="#173F35" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Prescribed Movement Blueprints */}
          <div className="lg:col-span-5 bg-[#FFFFFF] rounded-3xl border border-[#E5E1D7] p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D7]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C6A66B] block mb-0.5">
                  Algorithmic Suggestions
                </span>
                <h3 className="font-serif text-lg font-bold text-[#171916]">
                  Prescribed Movements
                </h3>
              </div>
              <Link to="/exercises" className="text-xs text-[#173F35] hover:underline flex items-center gap-1 font-semibold">
                Library <ChevronRight size={13} />
              </Link>
            </div>

            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-[#F5F1E8] rounded-2xl border border-[#E5E1D7] flex items-center justify-between gap-3 hover:border-[#173F35]/30 transition"
                >
                  <div className="min-w-0">
                    <span className="font-serif text-sm font-bold text-[#171916] truncate block">
                      {rec.exercise?.name}
                    </span>
                    <span className="text-[11px] text-[#85877F] truncate block mt-0.5">
                      {rec.rationale?.[0] || 'Target movement pattern'}
                    </span>
                  </div>

                  <Link
                    to={`/workout/active/${rec.exercise?.exerciseId}`}
                    className="p-2 rounded-xl bg-[#173F35] text-[#F5F1E8] hover:bg-[#1f5043] transition shrink-0"
                    title="Start Exercise Session"
                  >
                    <Play size={12} className="text-[#C6A66B]" />
                  </Link>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                to="/workout/history"
                className="w-full py-3 px-4 rounded-xl border border-[#E5E1D7] text-xs font-semibold text-[#85877F] hover:text-[#171916] hover:bg-[#F5F1E8] flex items-center justify-center gap-2 transition"
              >
                <History size={14} />
                View Full Workout Ledger History
              </Link>
            </div>
          </div>
        </div>

        {/* Biometrics & Synchronized Nutrition Blueprints Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Biometric & Body Measurements Card */}
          <div className="bg-[#FFFFFF] rounded-3xl border border-[#E5E1D7] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#173F35]/10 text-[#173F35] flex items-center justify-center">
                  <Scale className="w-5 h-5 text-[#C6A66B]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#85877F] block">
                    Telemetry Sync
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#171916]">
                    Biometric Measurements
                  </h3>
                </div>
              </div>

              <Link
                to="/profile"
                className="text-xs font-semibold text-[#173F35] hover:underline flex items-center gap-1"
              >
                Log New <ChevronRight size={13} />
              </Link>
            </div>

            {latestMeasurement ? (
              <div className="p-4 rounded-2xl bg-[#F5F1E8] border border-[#E5E1D7] mb-4">
                <div className="flex items-center justify-between text-xs text-[#85877F] mb-2">
                  <span>Latest Entry ({new Date(latestMeasurement.recordedAt || latestMeasurement.createdAt).toLocaleDateString()})</span>
                  <span className="font-semibold text-[#173F35] bg-[#173F35]/10 px-2.5 py-0.5 rounded-full uppercase text-[10px]">
                    {latestMeasurement.bmiCategory || 'Normal'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#85877F] block">Weight</span>
                    <span className="font-serif text-2xl font-bold text-[#171916]">{latestMeasurement.weightKg} <span className="text-xs font-sans text-[#85877F]">kg</span></span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#85877F] block">Height</span>
                    <span className="font-serif text-2xl font-bold text-[#171916]">{latestMeasurement.heightCm} <span className="text-xs font-sans text-[#85877F]">cm</span></span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#85877F] block">BMI Index</span>
                    <span className="font-serif text-2xl font-bold text-[#173F35]">{latestMeasurement.bmi ? latestMeasurement.bmi.toFixed(1) : '--'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#E5E1D7] text-center mb-4">
                <p className="text-xs text-[#85877F] mb-3">No biometric measurement logged yet.</p>
                <Link
                  to="/#bmi"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#173F35] text-[#F5F1E8] text-xs font-semibold"
                >
                  Open Free BMI Calculator
                </Link>
              </div>
            )}

            <p className="text-[11px] text-[#85877F] flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#173F35] shrink-0" />
              <span>Biometric telemetry is calibrated for precise MET caloric calculations.</span>
            </p>
          </div>

          {/* Active Nutrition Blueprints Card */}
          <div className="bg-[#FFFFFF] rounded-3xl border border-[#E5E1D7] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#173F35]/10 text-[#173F35] flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-[#C6A66B]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#85877F] block">
                    Diet Architecture
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#171916]">
                    Saved Nutrition Plans
                  </h3>
                </div>
              </div>

              <Link
                to="/#diet"
                className="text-xs font-semibold text-[#173F35] hover:underline flex items-center gap-1"
              >
                Plan Diet <ChevronRight size={13} />
              </Link>
            </div>

            {dietPlans.length > 0 ? (
              <div className="space-y-2.5 mb-4">
                {dietPlans.slice(0, 2).map((plan) => (
                  <div
                    key={plan._id}
                    className="p-3.5 rounded-2xl bg-[#F5F1E8] border border-[#E5E1D7] flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#171916]">{plan.name}</h4>
                      <p className="text-[11px] text-[#85877F]">
                        {plan.dailyCalories} kcal • {plan.dietaryPreference || 'Omnivore'}
                      </p>
                    </div>
                    <Link
                      to="/#diet"
                      className="px-3 py-1.5 rounded-xl border border-[#E5E1D7] text-[11px] font-semibold text-[#171916] hover:bg-[#FFFFFF] transition"
                    >
                      View Meals
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#E5E1D7] text-center mb-4">
                <p className="text-xs text-[#85877F] mb-3">No saved custom diet blueprint yet.</p>
                <Link
                  to="/#diet"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#173F35] text-[#F5F1E8] text-xs font-semibold"
                >
                  Generate Nutrition Blueprint
                </Link>
              </div>
            )}

            <p className="text-[11px] text-[#85877F] flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#173F35] shrink-0" />
              <span>Full macro logistics (Protein, Carbs, Healthy Fats) synchronized with MongoDB.</span>
            </p>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default AiCoachDashboard;
