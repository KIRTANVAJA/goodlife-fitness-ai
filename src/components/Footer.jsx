import React from 'react';
import { Dumbbell, ShieldCheck, Sparkles, ArrowUpRight, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#171916] text-[#F5F1E8] border-t border-[#2E322C] pt-20 pb-12 font-sans relative overflow-hidden">
      {/* Subtle background ambient forest flare */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#173F35]/15 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-14 border-b border-[#2E322C]">
          
          {/* Brand & Identity Column */}
          <div className="lg:col-span-5 space-y-5">
            <Link to="/" className="flex items-center gap-3 text-left group">
              <div className="w-10 h-10 rounded-xl bg-[#173F35] border border-[#26745A]/40 flex items-center justify-center text-[#F5F1E8] shadow-sm">
                <Dumbbell size={19} className="stroke-[2.2] text-[#C6A66B]" />
              </div>
              <div>
                <span className="block text-base font-extrabold tracking-tight text-[#F5F1E8]">
                  GOOD LIFE FITNESS AI
                </span>
                <span className="block text-[9.5px] font-semibold text-[#C6A66B] tracking-[0.24em] -mt-0.5 uppercase">
                  LUXURY PERFORMANCE SANCTUARY
                </span>
              </div>
            </Link>
            
            <p className="text-xs text-[#A8AAA3] leading-relaxed max-w-sm">
              An exclusive private health technology platform integrating computer vision pose estimation, anatomical biomechanics calibration, and clinical nutrition architecture.
            </p>

            <div className="pt-2 text-xs text-[#85877F] space-y-1.5 font-medium">
              <p><strong className="text-[#F5F1E8] font-semibold">Private Flagship:</strong> 104 Equinox Boulevard, Mumbai, MH</p>
              <p><strong className="text-[#F5F1E8] font-semibold">Digital Concierge:</strong> concierge@goodlifefitness.ai</p>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="lg:col-span-3 space-y-4">
            <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#C6A66B] block">
              Platform Architecture
            </span>
            <ul className="space-y-2.5 text-xs text-[#A8AAA3]">
              <li>
                <Link to="/ai-coach" className="hover:text-[#F5F1E8] transition flex items-center gap-1 group">
                  <span>AI Workout Coach</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#C6A66B]" />
                </Link>
              </li>
              <li>
                <Link to="/exercises" className="hover:text-[#F5F1E8] transition flex items-center gap-1 group">
                  <span>Exercise & Biomechanics Library</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#C6A66B]" />
                </Link>
              </li>
              <li>
                <a href="/#bmi" className="hover:text-[#F5F1E8] transition flex items-center gap-1 group">
                  <span>Public BMI Calculator (Free)</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#C6A66B]" />
                </a>
              </li>
              <li>
                <a href="/#diet" className="hover:text-[#F5F1E8] transition flex items-center gap-1 group">
                  <span>AI Nutrition Consultation</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#C6A66B]" />
                </a>
              </li>
              <li>
                <Link to="/workout/history" className="hover:text-[#F5F1E8] transition flex items-center gap-1 group">
                  <span>Audited Workout Telemetry</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#C6A66B]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Entitlement & Security Disclosures */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#C6A66B] block">
              Entitlement Architecture
            </span>
            <p className="text-xs text-[#A8AAA3] leading-relaxed">
              Public access provides complimentary BMI diagnostics, baseline exercise demonstration cues, and daily meal planning. Camera-based pose tracking and weekly grocery logistics are guarded by authoritative MongoDB subscription security.
            </p>
            <div className="p-3.5 rounded-xl bg-[#1E211D] border border-[#2E322C] flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#26745A] shrink-0" />
              <div className="text-[11px]">
                <span className="font-semibold text-[#F5F1E8] block">Authoritative Cloud Security</span>
                <span className="text-[#85877F]">JWT Auth & MongoDB Session Synchronization</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Medical Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#85877F]">
          <p>© 2026 Good Life Fitness AI. All rights reserved.</p>
          <p className="italic text-center md:text-right max-w-xl">
            Biomechanical pose estimation and computer vision heuristics are engineered for movement education and athletic conditioning, not clinical medical diagnosis.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
