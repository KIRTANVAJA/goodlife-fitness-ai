import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Dumbbell, 
  Camera, 
  ShieldCheck, 
  Wind, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  Play,
  RotateCcw,
  Clock,
  Repeat
} from 'lucide-react';
import api from '../services/api';
import storageService from '../services/storageService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ExerciseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercise = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/exercises/${id}`);
        if (res.success && res.data) {
          setExercise(res.data);

          // Track recently viewed exercises safely in localStorage
          const recent = storageService.getItem('preferences:recent-exercises', []);
          const filtered = recent.filter((r) => r.exerciseId !== res.data.exerciseId);
          filtered.unshift({
            exerciseId: res.data.exerciseId,
            name: res.data.name,
            thumbnail: res.data.demoMedia?.thumbnail || res.data.demoMedia?.image,
            viewedAt: Date.now(),
          });
          storageService.setItem('preferences:recent-exercises', filtered.slice(0, 8));
        } else {
          setError('Exercise not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load exercise details');
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] dark:bg-[#171916] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#173F35]"></div>
        </div>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] dark:bg-[#171916] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto px-4 pt-36 text-center">
          <div className="bg-[#FFFFFF] dark:bg-[#1E211D] p-8 rounded-3xl border border-[#E5E1D7] dark:border-[#2E322C] shadow-sm">
            <h2 className="text-xl font-bold text-[#171916] dark:text-[#F5F1E8] mb-2">Exercise Not Found</h2>
            <p className="text-xs text-[#85877F] mb-6">{error || 'The requested exercise record could not be loaded.'}</p>
            <Link
              to="/exercises"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173F35] text-[#F5F1E8] text-xs font-semibold hover:bg-[#1F5144] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Movement Library
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] dark:bg-[#171916] text-[#171916] dark:text-[#F5F1E8] flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/exercises"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#85877F] hover:text-[#171916] dark:hover:text-[#F5F1E8] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Exercise Catalogue
          </Link>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-stretch">
          
          {/* Left Media Stage */}
          <div className="lg:col-span-7 bg-[#171916] rounded-3xl overflow-hidden border border-[#2E322C] shadow-lg relative min-h-[380px] flex items-center justify-center">
            <img
              src={exercise.demoMedia?.image || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop'}
              alt={exercise.name}
              className="w-full h-full object-cover max-h-[500px]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop';
              }}
            />

            {/* Subtle Gradient & Badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#171916] via-transparent to-black/20 pointer-events-none" />

            <div className="absolute top-4 left-4 flex gap-2">
              {exercise.trackingSupported ? (
                <span className="px-3 py-1 rounded-full bg-[#173F35]/90 backdrop-blur-md text-[#F5F1E8] border border-[#26745A]/50 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Camera size={13} className="text-[#C6A66B]" />
                  AI Vision Tracked
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-[#171916]/80 backdrop-blur-md text-[#A8AAA3] border border-white/10 text-xs font-bold uppercase tracking-wider">
                  Instructional Movement
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-5 right-5 text-white pointer-events-none">
              <span className="text-[10px] uppercase font-bold text-[#C6A66B] tracking-[0.2em] block">
                {exercise.category} &bull; {exercise.equipment}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
                {exercise.name}
              </h1>
            </div>
          </div>

          {/* Right Summary Details Card */}
          <div className="lg:col-span-5 bg-[#FFFFFF] dark:bg-[#1E211D] p-6 sm:p-8 rounded-3xl border border-[#E5E1D7] dark:border-[#2E322C] shadow-sm flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C6A66B] block mb-1">
                  Biomechanical Overview
                </span>
                <p className="text-xs sm:text-sm text-[#85877F] dark:text-[#A8AAA3] leading-relaxed">
                  {exercise.shortDescription}
                </p>
              </div>

              {/* Target Muscles */}
              <div>
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#171916] dark:text-[#F5F1E8] block mb-2">
                  Primary Muscle Drivers
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {exercise.targetMuscles?.primary?.map((m, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#173F35]/10 text-[#173F35] dark:text-[#C6A66B] text-xs font-bold uppercase tracking-wider"
                    >
                      {m}
                    </span>
                  ))}
                  {exercise.targetMuscles?.secondary?.map((m, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C] text-[#85877F] text-xs font-medium"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prescribed Metrics */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E5E1D7] dark:border-[#2E322C] text-center">
                <div className="p-3 rounded-2xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C]">
                  <span className="text-[9.5px] uppercase font-bold text-[#85877F] block">Sets</span>
                  <span className="text-lg font-black text-[#171916] dark:text-[#F5F1E8]">{exercise.recommendedSets}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C]">
                  <span className="text-[9.5px] uppercase font-bold text-[#85877F] block">
                    {exercise.recommendedHoldSeconds > 0 ? 'Hold' : 'Reps'}
                  </span>
                  <span className="text-lg font-black text-[#171916] dark:text-[#F5F1E8]">
                    {exercise.recommendedHoldSeconds > 0 ? `${exercise.recommendedHoldSeconds}s` : exercise.recommendedReps}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C]">
                  <span className="text-[9.5px] uppercase font-bold text-[#85877F] block">Rest</span>
                  <span className="text-lg font-black text-[#171916] dark:text-[#F5F1E8]">{exercise.recommendedRestSeconds}s</span>
                </div>
              </div>
            </div>

            {/* Launch Studio Action */}
            <div className="pt-6 border-t border-[#E5E1D7] dark:border-[#2E322C] mt-6">
              {exercise.trackingSupported ? (
                <Link
                  to={`/workout/active/${exercise.exerciseId}`}
                  className="w-full py-3.5 rounded-xl bg-[#173F35] hover:bg-[#1F5144] text-[#F5F1E8] text-xs font-bold uppercase tracking-[0.16em] transition shadow-md shadow-[#173F35]/20 flex items-center justify-center gap-2"
                >
                  <Camera size={15} className="text-[#C6A66B]" />
                  Launch Real-Time AI Workout
                </Link>
              ) : (
                <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C] text-center text-xs text-[#85877F]">
                  Manual tracking recommended. Review biomechanical cues below.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Detailed Movement Instructions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Step by Step Execution */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Setup & Starting Posture */}
            <div className="bg-[#FFFFFF] dark:bg-[#1E211D] p-6 sm:p-7 rounded-3xl border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#171916] dark:text-[#F5F1E8] mb-3 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#C6A66B]" />
                Starting Position & Setup
              </h3>
              <p className="text-xs sm:text-sm text-[#85877F] dark:text-[#A8AAA3] leading-relaxed">
                {exercise.startingPosition}
              </p>
            </div>

            {/* Step-by-Step Movement Instructions */}
            <div className="bg-[#FFFFFF] dark:bg-[#1E211D] p-6 sm:p-7 rounded-3xl border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#171916] dark:text-[#F5F1E8] mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#26745A]" />
                Movement Execution Steps
              </h3>
              <div className="space-y-3.5">
                {exercise.steps?.map((step) => (
                  <div key={step.stepNumber} className="flex items-start gap-3.5 text-xs sm:text-sm">
                    <span className="w-6 h-6 rounded-full bg-[#173F35]/10 text-[#173F35] dark:text-[#C6A66B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {step.stepNumber}
                    </span>
                    <p className="text-[#85877F] dark:text-[#A8AAA3] leading-relaxed pt-0.5">
                      {step.instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Mistakes & Corrections */}
            <div className="bg-[#FFFFFF] dark:bg-[#1E211D] p-6 sm:p-7 rounded-3xl border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#171916] dark:text-[#F5F1E8] mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#C6A66B]" />
                Common Faults & Corrections
              </h3>
              <div className="space-y-3">
                {exercise.commonMistakes?.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C] text-xs">
                    <p className="font-semibold text-rose-600 dark:text-rose-400 mb-1">
                      ✕ Fault: {item.mistake}
                    </p>
                    <p className="text-[#26745A] font-medium">
                      ✓ Correction: {item.correction}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Guidance Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Breathing Guidance */}
            {exercise.breathingGuidance && (
              <div className="bg-[#FFFFFF] dark:bg-[#1E211D] p-6 rounded-3xl border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#171916] dark:text-[#F5F1E8] flex items-center gap-2">
                  <Wind className="w-4 h-4 text-[#C6A66B]" />
                  Breathing Cadence
                </h4>
                <div className="text-xs text-[#85877F] dark:text-[#A8AAA3] space-y-2 leading-relaxed">
                  <p><strong>Inhale:</strong> {exercise.breathingGuidance.inhalePhase}</p>
                  <p><strong>Exhale:</strong> {exercise.breathingGuidance.exhalePhase}</p>
                  <p className="italic text-[#173F35] dark:text-[#C6A66B] font-semibold">{exercise.breathingGuidance.cue}</p>
                </div>
              </div>
            )}

            {/* Camera Positioning Advice */}
            <div className="bg-[#FFFFFF] dark:bg-[#1E211D] p-6 rounded-3xl border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#171916] dark:text-[#F5F1E8] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#26745A]" />
                Camera Setup Guidance
              </h4>
              <p className="text-xs text-[#85877F] dark:text-[#A8AAA3] leading-relaxed">
                Recommended orientation: <strong className="text-[#171916] dark:text-[#F5F1E8] uppercase">{exercise.cameraOrientation} view</strong>.
              </p>
              <ul className="text-xs text-[#85877F] dark:text-[#A8AAA3] space-y-1.5 list-disc list-inside">
                {exercise.setupInstructions?.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            </div>

            {/* Safety Tips */}
            <div className="bg-[#FFFFFF] dark:bg-[#1E211D] p-6 rounded-3xl border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#171916] dark:text-[#F5F1E8] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C6A66B]" />
                Safety Protocol
              </h4>
              <ul className="text-xs text-[#85877F] dark:text-[#A8AAA3] space-y-1.5 list-disc list-inside">
                {exercise.safetyInstructions?.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default ExerciseDetail;
