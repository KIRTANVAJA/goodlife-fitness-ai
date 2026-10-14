import React, { useState } from 'react';
import { Check, Star, ShieldCheck, Sparkles, ArrowRight, Zap, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Pricing = () => {
  const { user, isPremium, upgradeToPremium, isAuthenticated } = useAuth();
  const [upgrading, setUpgrading] = useState(false);
  const [cycle, setCycle] = useState('monthly'); // 'monthly' | 'yearly'

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

  return (
    <section id="pricing" className="py-24 bg-[#F5F1E8] dark:bg-[#171916] border-t border-[#E5E1D7] dark:border-[#2E322C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173F35]/10 dark:bg-[#173F35]/25 border border-[#173F35]/20 dark:border-[#26745A]/30 text-[#173F35] dark:text-[#C6A66B] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
            Transparent Memberships
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#171916] dark:text-[#F5F1E8] tracking-tight font-display">
            Entitlement Architecture
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#85877F] dark:text-[#A8AAA3]">
            No hidden clauses. Free diagnostics for all visitors, with full computer vision telemetry reserved for verified members.
          </p>

          {/* Billing Switch */}
          <div className="mt-6 inline-flex p-1 rounded-xl bg-[#FFFFFF] dark:bg-[#1E211D] border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs">
            <button
              onClick={() => setCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                cycle === 'monthly'
                  ? 'bg-[#173F35] text-[#F5F1E8]'
                  : 'text-[#85877F]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setCycle('yearly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
                cycle === 'yearly'
                  ? 'bg-[#173F35] text-[#F5F1E8]'
                  : 'text-[#85877F]'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#C6A66B] text-[#171916] font-extrabold">Save 25%</span>
            </button>
          </div>
        </div>

        {/* 2-Tier Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* TIER 1: FREE SANCTUARY ACCESS */}
          <div className="bg-[#FFFFFF] dark:bg-[#1E211D] rounded-3xl p-8 sm:p-10 border border-[#E5E1D7] dark:border-[#2E322C] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#85877F]">
                  Public Access
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C] text-[10px] font-bold text-[#85877F] uppercase tracking-wider">
                  Complimentary
                </span>
              </div>

              <h3 className="text-2xl font-bold font-display text-[#171916] dark:text-[#F5F1E8]">
                Sanctuary Guest
              </h3>
              <p className="text-xs text-[#85877F] dark:text-[#A8AAA3] mt-2 mb-6">
                Foundational movement guidance, whole-food dietary consultation, and open biometric health calculators.
              </p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black font-display text-[#171916] dark:text-[#F5F1E8]">
                  $0
                </span>
                <span className="text-xs text-[#85877F]">/ month, forever</span>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3 pt-6 border-t border-[#E5E1D7] dark:border-[#2E322C]">
                {[
                  { title: 'Real-Time Webcam Pose Tracking (Free AI Coach)', included: true },
                  { title: 'Automated Repetition Counter & Live Joint Angles', included: true },
                  { title: 'Full 24-Exercise Biomechanical Catalog', included: true },
                  { title: 'Biometric BMI Calculator & Classification', included: true },
                  { title: 'Pure Diet Meal Blueprint Generator (All Cuisines)', included: true },
                  { title: '7-Day Weekly Meal Schedules & Grocery Logistics', included: true },
                  { title: 'Workout Session History & Progress Analytics', included: true },
                  { title: 'VIP On-Floor Personal Coach & Private Sauna Lounge', included: false },
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs leading-normal">
                    {feat.included ? (
                      <Check size={15} className="text-[#26745A] shrink-0 mt-0.5" />
                    ) : (
                      <X size={15} className="text-[#85877F]/50 shrink-0 mt-0.5" />
                    )}
                    <span className={feat.included ? 'text-[#171916] dark:text-[#F5F1E8] font-medium' : 'text-[#85877F]/60'}>
                      {feat.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5E1D7] dark:border-[#2E322C]">
              <span className="block text-center text-xs font-semibold text-[#85877F]">
                Included with any registered visitor account
              </span>
            </div>
          </div>

          {/* TIER 2: PRIVATE MEMBER */}
          <div className="bg-[#173F35] text-[#F5F1E8] rounded-3xl p-8 sm:p-10 border border-[#26745A]/50 shadow-xl relative flex flex-col justify-between">
            {/* Top Recommended Tag */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#C6A66B] text-[#171916] text-[9px] font-extrabold uppercase tracking-[0.2em] shadow-sm flex items-center gap-1">
              <Star size={10} className="fill-current" />
              Private Performance
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 mt-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C6A66B]">
                  Full Access Studio
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#102B24] border border-[#26745A]/40 text-[10px] font-bold text-[#C6A66B] uppercase tracking-wider">
                  Authoritative
                </span>
              </div>

              <h3 className="text-2xl font-bold font-display text-white">
                Good Life Member
              </h3>
              <p className="text-xs text-[#FAF8F3]/70 mt-2 mb-6">
                Client-side computer vision pose estimation, automated repetition counts, form feedback alerts, and cloud telemetry.
              </p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black font-display text-white">
                  {cycle === 'monthly' ? '$29' : '$22'}
                </span>
                <span className="text-xs text-[#FAF8F3]/70">
                  / month {cycle === 'yearly' && '(billed $264 annually)'}
                </span>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3 pt-6 border-t border-[#26745A]/40">
                {[
                  { title: 'Everything in Sanctuary Guest Tier', included: true },
                  { title: 'MediaPipe 33-Landmark Pose Estimation (30 FPS)', included: true },
                  { title: 'Computer Vision Repetition Counting (Squats, Push-Ups, Lunges)', included: true },
                  { title: 'Continuous Isometric Hold Timer (Plank)', included: true },
                  { title: 'Real-Time Biomechanical Form Angle Feedback Alerts', included: true },
                  { title: 'Authoritative MongoDB Workout Session History', included: true },
                  { title: 'Body Measurement & Weight Progression Analytics', included: true },
                  { title: '7-Day Meal Logistics & Consolidated Shopping Blueprints', included: true },
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs leading-normal">
                    <Check size={15} className="text-[#C6A66B] shrink-0 mt-0.5" />
                    <span className="text-[#F5F1E8] font-medium">
                      {feat.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#26745A]/40">
              {isPremium ? (
                <div className="w-full py-3.5 rounded-xl bg-[#102B24] border border-[#26745A]/50 text-[#C6A66B] text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2">
                  <ShieldCheck size={15} />
                  Your Active Membership Tier
                </div>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  className="w-full py-3.5 rounded-xl bg-[#C6A66B] hover:bg-[#D8BF8F] text-[#171916] text-xs font-bold uppercase tracking-[0.16em] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Sparkles size={14} />
                  {upgrading ? 'Processing...' : 'Upgrade to Member ($29/mo)'}
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Pricing;
