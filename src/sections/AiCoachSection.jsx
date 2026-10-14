import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  Sparkles, 
  ArrowRight, 
  Repeat, 
  Lock,
  Activity,
  ShieldCheck
} from 'lucide-react';

const AiCoachSection = () => {
  return (
    <section id="ai-coach" className="py-24 bg-[#FAF8F3] dark:bg-[#1A1D19] relative overflow-hidden border-t border-[#E5E1D7] dark:border-[#2E322C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Tag & Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173F35]/10 dark:bg-[#173F35]/25 border border-[#173F35]/20 dark:border-[#26745A]/30 text-[#173F35] dark:text-[#C6A66B] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
            <Sparkles className="w-3 h-3 text-[#C6A66B]" />
            AI Computer Vision Coach
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#171916] dark:text-[#F5F1E8] tracking-tight font-display">
            Real-Time Pose Tracking. Zero Hardware Required.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#85877F] dark:text-[#A8AAA3] leading-relaxed">
            Experience next-generation private fitness engineering. Activate your webcam voluntarily to receive live skeleton tracking, automated repetition counts, form depth checks, and set rest timers.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
          {/* Interactive Visual Graphic */}
          <div className="lg:col-span-7 bg-[#171916] rounded-3xl p-6 sm:p-7 text-[#F5F1E8] relative overflow-hidden shadow-xl border border-[#2E322C]">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#0F100E] flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=900&auto=format&fit=crop"
                alt="AI Body Tracking Demonstration"
                className="w-full h-full object-cover opacity-50"
              />

              {/* Simulated Skeleton Overlay Graphic in Emerald / Gold */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg className="w-full h-full absolute inset-0 text-[#26745A]" viewBox="0 0 100 100" fill="none">
                  <line x1="50" y1="20" x2="50" y2="45" stroke="#26745A" strokeWidth="1.8" />
                  <line x1="50" y1="25" x2="35" y2="40" stroke="#26745A" strokeWidth="1.8" />
                  <line x1="50" y1="25" x2="65" y2="40" stroke="#26745A" strokeWidth="1.8" />
                  <line x1="50" y1="45" x2="38" y2="65" stroke="#26745A" strokeWidth="1.8" />
                  <line x1="38" y1="65" x2="35" y2="85" stroke="#26745A" strokeWidth="1.8" />
                  <line x1="50" y1="45" x2="62" y2="65" stroke="#26745A" strokeWidth="1.8" />
                  <line x1="62" y1="65" x2="65" y2="85" stroke="#26745A" strokeWidth="1.8" />

                  {/* Anatomical Landmark Nodes */}
                  <circle cx="50" cy="18" r="3" fill="#FFFFFF" stroke="#26745A" strokeWidth="1.2" />
                  <circle cx="50" cy="25" r="2" fill="#FFFFFF" stroke="#26745A" strokeWidth="1.2" />
                  <circle cx="38" cy="65" r="2.5" fill="#FFFFFF" stroke="#C6A66B" strokeWidth="1.8" />
                  <circle cx="62" cy="65" r="2.5" fill="#FFFFFF" stroke="#C6A66B" strokeWidth="1.8" />
                </svg>
              </div>

              {/* Real-Time Telemetry Badges */}
              <div className="absolute top-4 left-4 bg-[#171916]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#26745A]/40 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#26745A] animate-pulse"></span>
                <span className="text-[11px] font-bold text-[#F5F1E8]">Vision Telemetry Active</span>
              </div>

              <div className="absolute bottom-4 left-4 bg-[#171916]/90 backdrop-blur-md p-3.5 rounded-2xl border border-[#2E322C]">
                <p className="text-[9.5px] text-[#A8AAA3] uppercase font-bold tracking-wider">Rep Count</p>
                <p className="text-2xl font-black text-[#F5F1E8] font-mono">12 / 12</p>
              </div>

              <div className="absolute bottom-4 right-4 bg-[#173F35]/90 backdrop-blur-md p-3.5 rounded-2xl border border-[#26745A]/50 text-right">
                <p className="text-[9.5px] text-[#C6A66B] uppercase font-bold tracking-wider">Knee Depth Angle</p>
                <p className="text-2xl font-black text-[#F5F1E8] font-mono">88° (Optimal)</p>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#1E211D] border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#173F35]/10 text-[#173F35] dark:text-[#C6A66B] flex items-center justify-center shrink-0 mt-0.5">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#171916] dark:text-[#F5F1E8] text-sm">MediaPipe Pose Landmarker</h3>
                  <p className="text-xs text-[#85877F] dark:text-[#A8AAA3] mt-1 leading-relaxed">
                    Evaluates 33 full-body anatomical landmark coordinates at 30 frames per second directly in your browser.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#1E211D] border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#26745A]/10 text-[#26745A] dark:text-[#338F70] flex items-center justify-center shrink-0 mt-0.5">
                  <Repeat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#171916] dark:text-[#F5F1E8] text-sm">Biomechanical State Machines</h3>
                  <p className="text-xs text-[#85877F] dark:text-[#A8AAA3] mt-1 leading-relaxed">
                    Dedicated movement cycle engines for squats, push-ups, planks, and lunges with hysteresis to prevent arbitrary increments.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#1E211D] border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#171916]/10 text-[#171916] dark:text-[#F5F1E8] flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#171916] dark:text-[#F5F1E8] text-sm">100% Client-Side Privacy</h3>
                  <p className="text-xs text-[#85877F] dark:text-[#A8AAA3] mt-1 leading-relaxed">
                    No camera streams or pictures are ever transmitted to external AI servers or saved to databases. Only aggregate workout summaries persist.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/ai-coach"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#173F35] hover:bg-[#1F5144] text-[#F5F1E8] font-bold text-xs uppercase tracking-wider transition shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#C6A66B]" />
                Launch AI Coach Hub
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/exercises"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#1E211D] hover:bg-[#FAF8F3] dark:hover:bg-[#262924] text-[#171916] dark:text-[#F5F1E8] border border-[#E5E1D7] dark:border-[#2E322C] font-semibold text-xs uppercase tracking-wider transition shadow-xs"
              >
                Browse 24 Exercises
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiCoachSection;
