import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Timer, 
  Flame, 
  Repeat, 
  Dumbbell, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Search, 
  Filter, 
  Eye, 
  X, 
  ShieldCheck, 
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const WorkoutHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = '/workouts/sessions';
        if (statusFilter !== 'all') {
          url += `?status=${statusFilter}`;
        }
        const res = await api.get(url);
        if (res.success) {
          setSessions(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load workout history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [statusFilter]);

  // Aggregate stats strictly distinguishing completed from in-progress
  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const inProgressSessions = sessions.filter((s) => s.status === 'in_progress');

  const totalCompletedWorkouts = completedSessions.length;
  const totalReps = completedSessions.reduce((sum, s) => sum + (s.totalRepsCompleted || 0), 0);
  const totalDurationMin = Math.round(
    completedSessions.reduce((sum, s) => sum + (s.activeDurationSeconds || s.totalDurationSeconds || 0), 0) / 60
  );
  const totalCalories = completedSessions.reduce((sum, s) => sum + (s.estimatedCaloriesBurned || 0), 0);

  // Duration formatter avoiding artificial Math.max(1, ...)
  const formatDuration = (totalSeconds) => {
    if (!totalSeconds || totalSeconds <= 0) return '0 min';
    if (totalSeconds < 60) return `${totalSeconds}s`;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#171916] flex flex-col font-sans transition-colors selection:bg-[#C6A66B]/20 selection:text-[#171916]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        
        {/* Page Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173F35]/10 text-[#173F35] text-[10px] font-bold tracking-[0.2em] uppercase mb-3 border border-[#173F35]/15">
            <Activity className="w-3 h-3 text-[#C6A66B]" />
            Authoritative Biomechanical Ledger
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#171916]">
            Workout History & Progression
          </h1>
          <p className="mt-2 text-[#85877F] text-xs sm:text-sm max-w-2xl leading-relaxed">
            Every movement cycle, repetition audit, and biomechanical telemetry session securely preserved and verified in your private cloud profile.
          </p>
        </div>

        {/* Aggregated Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E1D7] shadow-sm relative overflow-hidden group hover:border-[#173F35]/30 transition">
            <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#85877F] block">
              Completed Sessions
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-[#171916]">
                {totalCompletedWorkouts}
              </span>
              {inProgressSessions.length > 0 && (
                <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  +{inProgressSessions.length} in progress
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#85877F] mt-2">Authoritative MongoDB records</p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E1D7] shadow-sm relative overflow-hidden group hover:border-[#173F35]/30 transition">
            <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#85877F] block">
              Verified Repetitions
            </span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#173F35] mt-2">
              {totalReps}
            </p>
            <p className="text-[11px] text-[#85877F] mt-2">Optical pose algorithm counts</p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E1D7] shadow-sm relative overflow-hidden group hover:border-[#173F35]/30 transition">
            <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#85877F] block">
              Active Time Under Load
            </span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#171916] mt-2">
              {totalDurationMin} <span className="text-base font-normal text-[#85877F]">min</span>
            </p>
            <p className="text-[11px] text-[#85877F] mt-2">Net training exertion</p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E1D7] shadow-sm relative overflow-hidden group hover:border-[#173F35]/30 transition">
            <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#85877F] block">
              Est. Calorie Expenditure
            </span>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#171916] mt-2">
              {totalCalories > 0 ? `${totalCalories}` : '0'}{' '}
              <span className="text-base font-normal text-[#85877F]">kcal</span>
            </p>
            <p className="text-[11px] text-[#85877F] mt-2">MET metabolic formulation</p>
          </div>
        </div>

        {/* Filters and Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex bg-[#FFFFFF] p-1.5 rounded-2xl border border-[#E5E1D7] shadow-sm">
            {[
              { id: 'all', label: 'All Sessions' },
              { id: 'completed', label: 'Completed' },
              { id: 'in_progress', label: 'In Progress' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  statusFilter === f.id
                    ? 'bg-[#173F35] text-[#F5F1E8] shadow-sm'
                    : 'text-[#85877F] hover:text-[#171916]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <Link
            to="/exercises"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173F35] hover:bg-[#1f5043] text-[#F5F1E8] text-xs font-semibold tracking-wider uppercase transition shadow-sm self-start sm:self-auto"
          >
            <Dumbbell className="w-3.5 h-3.5 text-[#C6A66B]" />
            Launch AI Workout
          </Link>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 bg-[#FFFFFF] rounded-3xl border border-[#E5E1D7] animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-[#FFFFFF] border border-rose-200 text-rose-800 p-8 rounded-3xl text-center max-w-md mx-auto shadow-sm">
            <AlertCircle className="w-8 h-8 mx-auto mb-3 text-rose-600" />
            <h3 className="font-bold text-sm">Failed to Load Workout Ledger</h3>
            <p className="text-xs text-rose-700 mt-1">{error}</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-[#FFFFFF] rounded-3xl border border-[#E5E1D7] p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#173F35]/10 text-[#173F35] flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-7 h-7 text-[#C6A66B]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#171916]">
              No Sessions Recorded Yet
            </h3>
            <p className="text-xs text-[#85877F] mt-2 mb-6 leading-relaxed">
              Launch an AI-assisted studio session to track joint angles, count repetitions, and record authoritative data points in your profile.
            </p>
            <Link
              to="/exercises"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173F35] hover:bg-[#1f5043] text-[#F5F1E8] text-xs font-semibold tracking-wider uppercase transition shadow-sm"
            >
              Browse Movement Library
              <ArrowRight className="w-3.5 h-3.5 text-[#C6A66B]" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const dateStr = new Date(session.createdAt || session.startTime).toLocaleDateString(
                undefined,
                { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
              );
              const durationFormatted = formatDuration(session.activeDurationSeconds || session.totalDurationSeconds || 0);

              return (
                <div
                  key={session._id}
                  className="bg-[#FFFFFF] rounded-3xl border border-[#E5E1D7] p-6 shadow-sm hover:border-[#173F35]/40 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[11px] font-medium text-[#85877F] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C6A66B]" />
                        {dateStr}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          session.status === 'completed'
                            ? 'bg-[#173F35]/10 text-[#173F35] border border-[#173F35]/20'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {session.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {session.exercises?.map((ex, i) => (
                        <h3 key={i} className="font-serif text-xl sm:text-2xl font-bold text-[#171916]">
                          {ex.exerciseName || 'Exercise Session'}
                        </h3>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#85877F] mt-3">
                      <span className="flex items-center gap-1.5">
                        <Timer className="w-4 h-4 text-[#173F35]" />
                        <strong className="text-[#171916]">{durationFormatted}</strong>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Repeat className="w-4 h-4 text-[#173F35]" />
                        <strong className="text-[#171916]">{session.totalRepsCompleted || 0}</strong> reps
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-[#C6A66B]" />
                        {session.estimatedCaloriesBurned > 0
                          ? <span><strong className="text-[#171916]">{session.estimatedCaloriesBurned}</strong> kcal (est.)</span>
                          : 'Calorie: Not Available'}
                      </span>
                      <span className="font-medium text-[#173F35] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C6A66B]" />
                        {session.overallTrackingQualityScore !== null && session.overallTrackingQualityScore !== undefined
                          ? `Tracking Quality: ${session.overallTrackingQualityScore}%`
                          : 'Pose Tracking: Manual'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-4 md:pt-0 border-t md:border-t-0 border-[#E5E1D7]">
                    <button
                      onClick={() => setSelectedSession(session)}
                      className="px-4 py-2.5 rounded-xl border border-[#E5E1D7] hover:bg-[#F5F1E8] text-xs font-semibold text-[#171916] transition flex items-center gap-1.5"
                    >
                      <Eye size={13} className="text-[#85877F]" />
                      Telemetry Details
                    </button>
                    <Link
                      to={`/workout/summary/${session._id}`}
                      className="px-4 py-2.5 rounded-xl bg-[#173F35] hover:bg-[#1f5043] text-[#F5F1E8] text-xs font-semibold transition flex items-center gap-1"
                    >
                      Summary View
                      <ChevronRight size={13} className="text-[#C6A66B]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Session Inspector Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171916]/60 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] rounded-3xl border border-[#E5E1D7] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedSession(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#85877F] hover:text-[#171916] hover:bg-[#F5F1E8] transition"
            >
              <X size={18} />
            </button>

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C6A66B] block mb-1">
              Biomechanical Telemetry Inspector
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#171916] mb-1">
              {selectedSession.exercises?.[0]?.exerciseName || 'Session Inspection'}
            </h3>
            <p className="text-xs text-[#85877F] mb-6">
              Session Hash: <span className="font-mono text-[11px] text-[#171916]">{selectedSession._id}</span>
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
              <div className="p-4 bg-[#F5F1E8] rounded-2xl border border-[#E5E1D7]">
                <span className="text-[10px] uppercase font-bold text-[#85877F] block">Status</span>
                <span className="font-bold text-[#171916] uppercase mt-0.5 block">{selectedSession.status}</span>
              </div>
              <div className="p-4 bg-[#F5F1E8] rounded-2xl border border-[#E5E1D7]">
                <span className="text-[10px] uppercase font-bold text-[#85877F] block">Active Duration</span>
                <span className="font-bold text-[#171916] mt-0.5 block">{formatDuration(selectedSession.activeDurationSeconds || selectedSession.totalDurationSeconds)}</span>
              </div>
              <div className="p-4 bg-[#F5F1E8] rounded-2xl border border-[#E5E1D7]">
                <span className="text-[10px] uppercase font-bold text-[#85877F] block">Sets Completed</span>
                <span className="font-bold text-[#171916] mt-0.5 block">{selectedSession.totalSetsCompleted || selectedSession.exercises?.[0]?.setsCompleted || 0}</span>
              </div>
              <div className="p-4 bg-[#F5F1E8] rounded-2xl border border-[#E5E1D7]">
                <span className="text-[10px] uppercase font-bold text-[#85877F] block">Verified Repetitions</span>
                <span className="font-bold text-[#173F35] mt-0.5 block">{selectedSession.totalRepsCompleted || 0} reps</span>
              </div>
            </div>

            {/* Set by set breakdown */}
            <div className="space-y-2.5 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#171916] block">
                Series Breakdown
              </span>
              {selectedSession.exercises?.[0]?.repsPerSet?.length > 0 ? (
                selectedSession.exercises[0].repsPerSet.map((s, idx) => (
                  <div key={idx} className="p-3 bg-[#F5F1E8] rounded-xl border border-[#E5E1D7] text-xs flex justify-between items-center">
                    <span className="font-medium text-[#171916]">Set {s.setNumber || idx + 1}</span>
                    <span className="font-bold text-[#173F35]">{s.repsCounted || 0} reps ({s.durationSeconds || 0}s)</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#85877F] italic">No set breakdown logged for this session.</p>
              )}
            </div>

            {/* Tracking Quality Breakdown */}
            <div className="p-4 bg-[#F5F1E8] rounded-2xl border border-[#E5E1D7] text-xs space-y-1.5">
              <span className="font-bold text-[#171916] block">Computer Vision Quality Assessment</span>
              <p className="text-[#85877F] leading-relaxed">
                {selectedSession.overallTrackingQualityScore !== null && selectedSession.overallTrackingQualityScore !== undefined
                  ? `Average MediaPipe Landmark Confidence: ${selectedSession.overallTrackingQualityScore}%. Skeleton joints were verified continuously.`
                  : 'Pose estimation camera was in manual mode; movement was recorded directly by member input.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default WorkoutHistory;
