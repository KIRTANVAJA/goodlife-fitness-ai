import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Trophy, 
  Flame, 
  Timer, 
  Repeat, 
  CheckCircle, 
  ArrowRight, 
  RotateCcw,
  ShieldCheck, 
  Calendar, 
  Sparkles, 
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const WorkoutSummary = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get(`/workouts/sessions/${sessionId}`);
        if (res.success && res.data) {
          setSession(res.data);
        } else {
          setError('Workout session not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load workout summary');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const formatDuration = (totalSeconds) => {
    if (!totalSeconds || totalSeconds <= 0) return '0 min';
    if (totalSeconds < 60) return `${totalSeconds}s`;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#173F35] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs uppercase tracking-widest text-[#173F35] font-semibold">Generating Workout Audit...</span>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 max-w-md mx-auto pt-36 px-4 text-center">
          <div className="bg-[#FFFFFF] p-8 rounded-3xl border border-[#E5E1D7] shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-[#171916]">Summary Not Found</h2>
            <p className="text-xs text-[#85877F] mt-2 mb-6">{error || 'Session could not be located in your cloud records.'}</p>
            <Link
              to="/workout/history"
              className="px-5 py-2.5 rounded-xl bg-[#173F35] text-[#F5F1E8] text-xs font-semibold uppercase tracking-wider transition"
            >
              View Workout History
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const durationFormatted = formatDuration(session.activeDurationSeconds || session.totalDurationSeconds || 0);

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#171916] flex flex-col font-sans transition-colors selection:bg-[#C6A66B]/20 selection:text-[#171916]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-32 pb-20">
        
        {/* Celebration Header Card */}
        <div className="bg-[#171916] text-[#F5F1E8] rounded-3xl p-8 sm:p-12 text-center border border-[#2A3029] shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#173F35]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-16 h-16 rounded-2xl bg-[#C6A66B]/20 text-[#C6A66B] border border-[#C6A66B]/40 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8" />
          </div>

          <span className="px-3 py-1 rounded-full bg-[#173F35]/80 text-[#C6A66B] border border-[#26745A] text-[10px] font-bold tracking-[0.2em] uppercase">
            Workout Verified & Synchronized
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F1E8] mt-4 mb-2">
            Session Successfully Logged
          </h1>
          <p className="text-xs sm:text-sm text-[#A6A7A1] max-w-lg mx-auto leading-relaxed">
            {session.overallTrackingQualityScore !== null && session.overallTrackingQualityScore !== undefined
              ? `Biomechanical tracking quality scored at ${session.overallTrackingQualityScore}% confidence. Repetition intervals verified.`
              : 'Direct completion recorded; authoritative session ledger safely persisted in MongoDB.'}
          </p>
        </div>

        {/* Core Stats Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E1D7] text-center shadow-sm">
            <Timer className="w-5 h-5 text-[#173F35] mx-auto mb-2" />
            <span className="text-[10px] text-[#85877F] font-bold uppercase tracking-wider block">Duration</span>
            <p className="font-serif text-2xl font-bold text-[#171916] mt-1">{durationFormatted}</p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E1D7] text-center shadow-sm">
            <Repeat className="w-5 h-5 text-[#173F35] mx-auto mb-2" />
            <span className="text-[10px] text-[#85877F] font-bold uppercase tracking-wider block">Verified Reps</span>
            <p className="font-serif text-2xl font-bold text-[#171916] mt-1">{session.totalRepsCompleted || 0}</p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E1D7] text-center shadow-sm">
            <CheckCircle className="w-5 h-5 text-[#173F35] mx-auto mb-2" />
            <span className="text-[10px] text-[#85877F] font-bold uppercase tracking-wider block">Series Completed</span>
            <p className="font-serif text-2xl font-bold text-[#171916] mt-1">{session.totalSetsCompleted || session.exercises?.length || 1}</p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E1D7] text-center shadow-sm">
            <Flame className="w-5 h-5 text-[#C6A66B] mx-auto mb-2" />
            <span className="text-[10px] text-[#85877F] font-bold uppercase tracking-wider block">Est. Calories</span>
            <p className="font-serif text-2xl font-bold text-[#171916] mt-1">
              {session.estimatedCaloriesBurned > 0 ? `${session.estimatedCaloriesBurned} kcal` : 'Not Available'}
            </p>
          </div>
        </div>

        {/* Exercises Breakdown */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#E5E1D7] p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl font-bold text-[#171916]">
              Movement Performance Breakdown
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C6A66B] bg-[#C6A66B]/10 px-2.5 py-1 rounded-full">
              Audit Complete
            </span>
          </div>

          <div className="space-y-3">
            {session.exercises?.map((ex, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#F5F1E8] border border-[#E5E1D7] flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-base text-[#171916]">{ex.exerciseName}</h4>
                  <p className="text-[11px] text-[#85877F] mt-0.5">
                    {ex.setsCompleted} sets • {ex.totalRepsCompleted > 0 ? `${ex.totalRepsCompleted} reps` : `${ex.holdDurationSeconds}s hold`}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#173F35]/10 text-[#173F35] border border-[#173F35]/20">
                    {ex.estimatedCalories > 0 ? `${ex.estimatedCalories} kcal` : 'Calorie N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[#E5E1D7] text-[11px] text-[#85877F] leading-relaxed flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#173F35] shrink-0" />
            <span>MET biomechanical formulation calibrated against your current weight in profile settings.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/workout/history"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#173F35] hover:bg-[#1f5043] text-[#F5F1E8] text-xs font-bold uppercase tracking-wider transition shadow-sm"
          >
            Inspect Ledger History
            <ArrowRight className="w-3.5 h-3.5 text-[#C6A66B]" />
          </Link>

          <Link
            to="/ai-coach"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#FFFFFF] border border-[#E5E1D7] text-[#171916] hover:bg-[#F5F1E8] text-xs font-bold uppercase tracking-wider transition shadow-sm"
          >
            Return to Dashboard
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WorkoutSummary;
