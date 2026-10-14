import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Camera, 
  CameraOff, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowLeft,
  Volume2,
  VolumeX,
  FlipHorizontal,
  Flame,
  Timer,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Trash2,
  Activity,
  Layers
} from 'lucide-react';
import api from '../services/api';
import storageService from '../services/storageService';
import { useCamera } from '../features/bodyTracking/hooks/useCamera';
import { usePoseTracker } from '../features/bodyTracking/hooks/usePoseTracker';
import { createExerciseTracker } from '../features/workouts/algorithms/trackerFactory';
import { calculateCaloriesBurned } from '../features/workouts/utils/calories';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const ActiveWorkoutSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isPremium, upgradeToPremium } = useAuth();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [formAlertCount, setFormAlertCount] = useState(0);
  const [activeDurationSeconds, setActiveDurationSeconds] = useState(0);
  const [pausedDurationSeconds, setPausedDurationSeconds] = useState(0);

  // Exercise details
  const [exercise, setExercise] = useState(null);
  const [loadingExercise, setLoadingExercise] = useState(true);

  // Workout state
  const [currentSet, setCurrentSet] = useState(1);
  const [targetSets, setTargetSets] = useState(3);
  const [targetReps, setTargetReps] = useState(12);
  const [targetHoldSeconds, setTargetHoldSeconds] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(60);
  const [isWorkoutPaused, setIsWorkoutPaused] = useState(false);
  const [workoutStartTime] = useState(Date.now());
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isFinishing, setIsFinishing] = useState(false);

  // Set-by-set results history
  const [completedSetsData, setCompletedSetsData] = useState([]);

  // Session Recovery State
  const [recoveryPrompt, setRecoveryPrompt] = useState(null);

  // Live Tracking state
  const [liveReps, setLiveReps] = useState(0);
  const [liveHoldSeconds, setLiveHoldSeconds] = useState(0);
  const [liveFeedback, setLiveFeedback] = useState('Position your full body in the camera frame.');
  const [formAlertActive, setFormAlertActive] = useState(false);
  const [activeJoints, setActiveJoints] = useState([]);
  const [audioFeedbackEnabled, setAudioFeedbackEnabled] = useState(false);

  // Tracker instance ref
  const trackerRef = useRef(null);
  const lastSpokenFeedbackRef = useRef('');

  // Camera hook
  const {
    videoRef,
    isCameraActive,
    cameraLoading,
    cameraError,
    devices,
    facingMode,
    startCamera,
    stopCamera,
    toggleFacingMode,
    selectDevice,
  } = useCamera();

  // Frame processing callback
  const handleFrameUpdate = useCallback((landmarks, timestamp) => {
    if (isWorkoutPaused || isResting || !trackerRef.current) return;

    const result = trackerRef.current.process(landmarks, timestamp);

    if (result) {
      if (result.reps !== undefined) setLiveReps(result.reps);
      if (result.holdDurationSeconds !== undefined) setLiveHoldSeconds(result.holdDurationSeconds);
      if (result.feedback) {
        setLiveFeedback(result.feedback);

        // Optional Web Speech API audio cue
        if (audioFeedbackEnabled && result.formAlert && result.feedback !== lastSpokenFeedbackRef.current) {
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(result.feedback);
            utterance.rate = 1.1;
            window.speechSynthesis.speak(utterance);
            lastSpokenFeedbackRef.current = result.feedback;
          }
        }
      }
      setFormAlertActive(!!result.formAlert);
      if (result.formAlert) {
        setFormAlertCount((prev) => prev + 1);
      }
      if (result.activeJoints) setActiveJoints(result.activeJoints);
    }
  }, [isWorkoutPaused, isResting, audioFeedbackEnabled]);

  // Pose tracker hook
  const {
    canvasRef,
    modelState,
    modelError,
    trackingStatus,
    trackingConfidence,
  } = usePoseTracker({
    videoRef,
    isCameraActive,
    onFrameUpdate: handleFrameUpdate,
    activeJointIndices: activeJoints,
    formCorrectionActive: formAlertActive,
  });

  // Fetch exercise data & init tracker
  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get(`/exercises/${id}`);
        if (res.success && res.data) {
          const ex = res.data;
          setExercise(ex);
          setTargetSets(ex.recommendedSets || 3);
          setTargetReps(ex.recommendedReps || 12);
          setTargetHoldSeconds(ex.recommendedHoldSeconds || 0);

          // Instantiate exercise tracker
          trackerRef.current = createExerciseTracker(ex.exerciseId, ex.name);

          // Check for recoverable local workout session
          if (user?.id) {
            const savedRecovery = storageService.getUserItem(user.id, 'workout-recovery', null);
            if (savedRecovery && savedRecovery.exerciseId === ex.exerciseId) {
              const ageHours = (Date.now() - (savedRecovery.lastUpdatedAt || 0)) / (1000 * 60 * 60);
              // Only offer recovery if less than 24 hours old
              if (ageHours < 24 && savedRecovery.completedSets?.length > 0) {
                setRecoveryPrompt(savedRecovery);
              } else if (ageHours >= 24) {
                storageService.removeUserItem(user.id, 'workout-recovery');
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to load exercise:', err);
      } finally {
        setLoadingExercise(false);
      }
    };

    init();
  }, [id, user?.id]);

  // Handle Recovery Actions
  const handleResumeRecovery = () => {
    if (!recoveryPrompt) return;
    setCompletedSetsData(recoveryPrompt.completedSets || []);
    setCurrentSet(recoveryPrompt.currentSet || (recoveryPrompt.completedSets?.length + 1) || 1);
    if (recoveryPrompt.sessionId) {
      setActiveSessionId(recoveryPrompt.sessionId);
    }
    setRecoveryPrompt(null);
  };

  const handleDiscardRecovery = () => {
    if (user?.id) {
      storageService.removeUserItem(user.id, 'workout-recovery');
    }
    setRecoveryPrompt(null);
  };

  // Helper to persist recovery state to localStorage
  const persistRecoveryState = (updatedSets, nextSet) => {
    if (!user?.id || !exercise) return;
    const recoveryRecord = {
      sessionId: activeSessionId,
      exerciseId: exercise.exerciseId,
      exerciseName: exercise.name,
      completedSets: updatedSets,
      currentSet: nextSet,
      targetSets,
      targetReps,
      targetHoldSeconds,
      elapsedActiveSeconds: Math.floor((Date.now() - workoutStartTime) / 1000),
      sessionStatus: 'in_progress',
      lastUpdatedAt: Date.now(),
    };
    storageService.setUserItem(user.id, 'workout-recovery', recoveryRecord);
  };

  // Rest timer countdown
  useEffect(() => {
    let timer = null;
    if (isResting && restTimeRemaining > 0) {
      timer = setInterval(() => {
        setRestTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isResting, restTimeRemaining]);

  // Complete current set
  const handleCompleteSet = () => {
    const isPlank = exercise?.exerciseId === 'plank';
    const setRecord = {
      setNumber: currentSet,
      repsCounted: isPlank ? 1 : liveReps,
      holdDurationSeconds: isPlank ? liveHoldSeconds : 0,
      durationSeconds: Math.max(20, Math.floor((Date.now() - workoutStartTime) / 1000)),
      restSeconds: 60,
    };

    const nextCompletedSets = [...completedSetsData, setRecord];
    setCompletedSetsData(nextCompletedSets);

    if (currentSet < targetSets) {
      const nextSetNum = currentSet + 1;
      setCurrentSet(nextSetNum);
      setIsResting(true);
      setRestTimeRemaining(exercise?.recommendedRestSeconds || 60);

      // Persist local recovery record immediately
      persistRecoveryState(nextCompletedSets, nextSetNum);

      // Reset live counter for next set
      if (trackerRef.current) {
        trackerRef.current.reset();
      }
      setLiveReps(0);
      setLiveHoldSeconds(0);
    } else {
      // Reached all target sets!
      handleFinishWorkout(nextCompletedSets);
    }
  };

  // Handle camera start with premium entitlement check
  const handleRequestStartCamera = () => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }
    startCamera();
  };

  // Skip rest period
  const handleSkipRest = () => {
    setIsResting(false);
    setRestTimeRemaining(60);
  };

  // Finish workout & persist session to MongoDB (Authoritative)
  const handleFinishWorkout = async (overrideSets = null) => {
    if (isFinishing) return;
    setIsFinishing(true);

    const isPlank = exercise?.exerciseId === 'plank';
    const totalDurationSeconds = Math.max(10, Math.floor((Date.now() - workoutStartTime) / 1000));

    // Consolidate sets
    const allSets = overrideSets ? [...overrideSets] : [...completedSetsData];
    // If user has in-progress reps in current set and didn't hit complete set, count it
    if (!overrideSets && (liveReps > 0 || liveHoldSeconds > 0)) {
      allSets.push({
        setNumber: currentSet,
        repsCounted: isPlank ? 1 : liveReps,
        holdDurationSeconds: isPlank ? liveHoldSeconds : 0,
        durationSeconds: 30,
        restSeconds: 0,
      });
    }

    const totalReps = allSets.reduce((acc, s) => acc + (s.repsCounted || 0), 0);
    const totalHoldSecs = allSets.reduce((acc, s) => acc + (s.holdDurationSeconds || 0), 0);

    const userWeight = user?.profile?.weightKg || 70;
    const estimatedCalories = calculateCaloriesBurned({
      exerciseId: exercise?.exerciseId,
      durationSeconds: totalDurationSeconds,
      bodyWeightKg: userWeight,
      customMet: exercise?.metValue,
    });

    try {
      // Stop camera hardware
      stopCamera();

      const trackingScore = trackingConfidence > 0 ? trackingConfidence : null;
      const calculatedTechniqueScore = (totalReps > 0 || totalHoldSecs > 0)
        ? Math.max(50, 100 - (formAlertCount * 5))
        : null;

      // Submit session payload to backend API
      const sessionPayload = {
        status: 'completed',
        totalDurationSeconds,
        activeDurationSeconds: activeDurationSeconds || totalDurationSeconds,
        pausedDurationSeconds: pausedDurationSeconds || 0,
        overallTrackingQualityScore: trackingScore,
        formTechniqueScore: calculatedTechniqueScore,
        exercises: [
          {
            exercise: exercise?._id,
            exerciseId: exercise?.exerciseId,
            exerciseName: exercise?.name,
            targetSets,
            setsCompleted: allSets.length,
            totalRepsCompleted: totalReps,
            holdDurationSeconds: totalHoldSecs,
            repsPerSet: allSets,
            estimatedCalories,
          },
        ],
        summaryNotes: `Completed ${allSets.length} sets of ${exercise?.name} via AI computer vision tracking.`,
      };

      let res;
      if (activeSessionId) {
        res = await api.patch(`/workouts/sessions/${activeSessionId}`, sessionPayload);
      } else {
        res = await api.post('/workouts/sessions', sessionPayload);
      }

      // Clear local recovery record upon confirmed MongoDB write
      if (user?.id) {
        storageService.removeUserItem(user.id, 'workout-recovery');
      }

      if (res.success && res.data) {
        navigate(`/workout/summary/${res.data._id}`);
      } else {
        navigate('/workout/history');
      }
    } catch (err) {
      console.error('Failed to save workout session:', err);
      navigate('/workout/history');
    } finally {
      setIsFinishing(false);
    }
  };

  const isPlank = exercise?.exerciseId === 'plank';

  if (loadingExercise) {
    return (
      <div className="min-h-screen bg-[#171916] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#C6A66B] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs uppercase tracking-widest text-[#C6A66B] font-medium">Preparing AI Studio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171916] text-[#F5F1E8] flex flex-col font-sans select-none">
      {/* Top Luxury Performance Header Bar */}
      <header className="bg-[#171916]/95 backdrop-blur-md border-b border-[#2A3029] px-4 sm:px-8 py-3.5 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              stopCamera();
              navigate(`/exercises/${exercise?.exerciseId || ''}`);
            }}
            className="p-2 rounded-xl bg-[#1F241E] hover:bg-[#262C24] text-[#A6A7A1] hover:text-[#F5F1E8] border border-[#2A3029] transition"
            title="Return to Movement Guide"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#C6A66B]">
                {exercise?.category || 'Strength'}
              </span>
              <span className="text-xs text-[#52574E]">•</span>
              <span className="text-[11px] text-[#85877F] uppercase tracking-wider">
                {exercise?.level || 'All Levels'}
              </span>
            </div>
            <h1 className="font-serif text-lg sm:text-xl font-bold text-[#F5F1E8] leading-tight tracking-wide">
              {exercise?.name}
            </h1>
          </div>
        </div>

        {/* Tracking Readiness / Status Badge & Audio Toggle */}
        <div className="flex items-center gap-2.5">
          {trackingStatus === 'tracking' && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#173F35]/70 text-[#4ADE80] border border-[#26745A]/60 text-xs font-semibold backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-ping"></span>
              Live Pose AI ({trackingConfidence}%)
            </span>
          )}
          {trackingStatus === 'position_body' && (
            <span className="px-3 py-1.5 rounded-full bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/40 text-xs font-medium">
              Frame Full Body
            </span>
          )}
          {trackingStatus === 'loading_model' && (
            <span className="px-3 py-1.5 rounded-full bg-[#173F35]/40 text-[#A6A7A1] border border-[#2A3029] text-xs font-medium animate-pulse">
              Initializing MediaPipe...
            </span>
          )}

          <button
            onClick={() => setAudioFeedbackEnabled(!audioFeedbackEnabled)}
            className={`p-2.5 rounded-xl border transition ${
              audioFeedbackEnabled
                ? 'bg-[#173F35] border-[#26745A] text-[#F5F1E8] shadow-sm'
                : 'bg-[#1F241E] border-[#2A3029] text-[#85877F] hover:text-[#F5F1E8]'
            }`}
            title="Toggle Voice Posture Cues"
          >
            {audioFeedbackEnabled ? <Volume2 className="w-4 h-4 text-[#C6A66B]" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Recovery Prompt Modal Banner */}
      {recoveryPrompt && (
        <div className="bg-[#173F35]/90 border-b border-[#26745A] px-4 sm:px-8 py-3 z-30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-[#F5F1E8]">
            <RefreshCw className="w-4 h-4 text-[#C6A66B] shrink-0 animate-spin" />
            <span>
              <strong>Interrupted Session Found:</strong> You have {recoveryPrompt.completedSets?.length} completed sets for {exercise?.name}. Would you like to resume where you left off?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResumeRecovery}
              className="px-4 py-1.5 rounded-xl bg-[#C6A66B] hover:bg-[#b08f52] text-[#171916] font-bold text-xs transition"
            >
              Resume Workout
            </button>
            <button
              onClick={handleDiscardRecovery}
              className="px-3.5 py-1.5 rounded-xl bg-[#171916]/80 hover:bg-[#171916] text-[#A6A7A1] text-xs transition border border-[#2A3029]"
            >
              Start Fresh
            </button>
          </div>
        </div>
      )}

      {/* Main Studio Workspace (Desktop Side-by-Side, Mobile Stacked) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Camera Preview & Skeleton Overlay Canvas */}
        <div className="lg:col-span-8 flex flex-col bg-[#121411] rounded-3xl border border-[#2A3029] overflow-hidden relative shadow-2xl min-h-[460px] sm:min-h-[560px]">
          {/* Video and Overlay Canvas Container */}
          <div className="relative flex-1 w-full h-full flex items-center justify-center bg-black overflow-hidden">
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${isCameraActive ? 'block' : 'hidden'}`}
            />

            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full pointer-events-none object-cover ${isCameraActive ? 'block' : 'hidden'}`}
            />

            {/* Inactive Camera Standby State */}
            {!isCameraActive && (
              <div className="text-center p-8 max-w-md mx-auto z-10">
                <div className="w-16 h-16 rounded-2xl bg-[#173F35]/40 border border-[#26745A]/40 flex items-center justify-center mx-auto mb-5 text-[#C6A66B]">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#F5F1E8] mb-2 tracking-wide">
                  Private Biomechanics Studio
                </h3>
                <p className="text-xs text-[#85877F] leading-relaxed mb-6">
                  Good Life AI tracks joint angles locally within your browser sandbox. Camera frames are processed strictly in memory and are never uploaded or recorded.
                </p>

                {cameraError ? (
                  <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                    {cameraError}
                  </div>
                ) : null}

                <button
                  onClick={handleRequestStartCamera}
                  disabled={cameraLoading}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#173F35] hover:bg-[#1f5043] text-[#F5F1E8] font-bold text-xs uppercase tracking-wider transition border border-[#26745A] shadow-lg disabled:opacity-50"
                >
                  <Camera className="w-4 h-4 text-[#C6A66B]" />
                  {cameraLoading ? 'Starting Optical Sensor...' : (isPremium ? 'Engage Optical Tracking' : 'Unlock AI Tracking (Member)')}
                </button>
              </div>
            )}

            {/* Premium Upgrade Modal */}
            {showPremiumModal && (
              <div className="absolute inset-0 bg-[#171916]/90 backdrop-blur-md flex flex-col items-center justify-center z-30 p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#C6A66B]/20 text-[#C6A66B] border border-[#C6A66B]/40 flex items-center justify-center mb-4">
                  <Sparkles size={24} />
                </div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C6A66B] mb-1">
                  Private Club Feature
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#F5F1E8] mb-2">
                  Real-Time Biomechanical Telemetry
                </h3>
                <p className="text-xs text-[#A6A7A1] max-w-sm mb-6 leading-relaxed">
                  Browser-based pose tracking, automatic repetition detection, and live posture auditory cues require a Good Life Fitness AI Member subscription.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={async () => {
                      await upgradeToPremium();
                      setShowPremiumModal(false);
                      startCamera();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#C6A66B] hover:bg-[#b08f52] text-[#171916] text-xs font-bold transition flex items-center gap-2 shadow-sm"
                  >
                    <Sparkles size={13} />
                    Upgrade to Premium ($29/mo)
                  </button>
                  <button
                    onClick={() => setShowPremiumModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#1F241E] hover:bg-[#262C24] text-[#A6A7A1] text-xs font-semibold transition border border-[#2A3029]"
                  >
                    Continue with Manual Logging
                  </button>
                </div>
              </div>
            )}

            {/* Rest Period Overlay */}
            {isResting && (
              <div className="absolute inset-0 bg-[#171916]/90 backdrop-blur-md flex flex-col items-center justify-center z-20 p-6 text-center">
                <Timer className="w-12 h-12 text-[#C6A66B] mb-3 animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C6A66B]">
                  Rest & Recovery
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#F5F1E8] mt-1 mb-2">
                  Set {currentSet} of {targetSets} Upcoming
                </h3>
                <p className="text-xs text-[#85877F] mb-6">Regulate your breathing and reset your stance.</p>
                <div className="text-6xl font-black text-[#F5F1E8] font-mono mb-6">
                  {restTimeRemaining}s
                </div>
                <button
                  onClick={handleSkipRest}
                  className="px-6 py-2.5 rounded-xl bg-[#1F241E] hover:bg-[#262C24] text-[#F5F1E8] text-xs font-bold border border-[#2A3029] transition"
                >
                  Skip Rest Period
                </button>
              </div>
            )}

            {/* Real-Time Live Form Feedback Overlay Banner */}
            {isCameraActive && !isResting && (
              <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none">
                <div
                  className={`px-4 py-3 rounded-2xl backdrop-blur-md text-xs sm:text-sm font-semibold flex items-center gap-3 border transition shadow-xl ${
                    formAlertActive
                      ? 'bg-rose-950/85 text-rose-100 border-rose-700/80'
                      : 'bg-[#173F35]/85 text-[#F5F1E8] border-[#26745A]/60'
                  }`}
                >
                  {formAlertActive ? (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-[#C6A66B] shrink-0" />
                  )}
                  <span className="truncate">{liveFeedback}</span>
                </div>
              </div>
            )}
          </div>

          {/* Camera Bottom Controls Bar */}
          <div className="p-3.5 bg-[#171916] border-t border-[#2A3029] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              {isCameraActive ? (
                <button
                  onClick={stopCamera}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1F241E] hover:bg-[#262C24] text-[#A6A7A1] hover:text-[#F5F1E8] border border-[#2A3029] transition"
                >
                  <CameraOff className="w-3.5 h-3.5 text-rose-400" />
                  Disengage Camera
                </button>
              ) : (
                <button
                  onClick={handleRequestStartCamera}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#173F35] hover:bg-[#1f5043] text-[#F5F1E8] font-semibold border border-[#26745A] transition"
                >
                  <Camera className="w-3.5 h-3.5 text-[#C6A66B]" />
                  Engage Camera
                </button>
              )}

              {devices.length > 1 && (
                <button
                  onClick={toggleFacingMode}
                  className="p-1.5 rounded-xl bg-[#1F241E] hover:bg-[#262C24] text-[#A6A7A1] border border-[#2A3029] transition"
                  title="Switch Camera (Front/Rear)"
                >
                  <FlipHorizontal className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-[11px] text-[#85877F] hidden sm:block">
              {exercise?.cameraOrientation === 'side' ? 'Suggested: Position camera sideways to your movement' : 'Suggested: Face camera directly'}
            </p>
          </div>
        </div>

        {/* Right Column: Workout Metrics & Interactive Controls */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
          
          {/* Metric Dashboard Cards */}
          <div className="space-y-4">
            {/* Current Set and Target Counter */}
            <div className="bg-[#121411] p-5 rounded-3xl border border-[#2A3029] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#85877F] block">
                  Current Series
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-[#F5F1E8] font-mono">{currentSet}</span>
                  <span className="text-[#52574E] text-sm font-bold font-mono">/ {targetSets}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#85877F] block">
                  Target Reps
                </span>
                <p className="text-base font-bold text-[#C6A66B] mt-1 font-mono">
                  {isPlank ? `${targetHoldSeconds}s hold` : `${targetReps} reps`}
                </p>
              </div>
            </div>

            {/* Live Counter Primary Card */}
            <div className="bg-gradient-to-br from-[#121411] to-[#1F241E] p-6 rounded-3xl border border-[#2A3029] shadow-xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#173F35]/15 rounded-full blur-2xl pointer-events-none" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C6A66B] block mb-2">
                {isPlank ? 'Active Hold Duration' : 'Verified Repetitions'}
              </span>

              <div className="text-7xl font-black text-[#F5F1E8] font-mono tracking-tight my-2">
                {isPlank ? `${liveHoldSeconds}s` : liveReps}
              </div>

              <p className="text-xs text-[#85877F]">
                {isPlank 
                  ? (liveHoldSeconds >= targetHoldSeconds ? 'Target hold achieved! Conclude set when ready.' : `Target: ${targetHoldSeconds} seconds continuous hold`)
                  : (liveReps >= targetReps ? 'Target repetitions achieved! Conclude set.' : `Target: ${targetReps} repetitions`)
                }
              </p>
            </div>

            {/* Exercise Demonstration Thumbnail Reference */}
            <div className="bg-[#121411] p-4 rounded-3xl border border-[#2A3029] flex items-center gap-3">
              <img
                src={exercise?.demoMedia?.thumbnail || exercise?.demoMedia?.image}
                alt={exercise?.name}
                className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-[#2A3029]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#F5F1E8] truncate font-serif">{exercise?.name}</p>
                <p className="text-[11px] text-[#85877F] truncate mt-0.5">
                  Muscles: {exercise?.targetMuscles?.primary?.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Action Control Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleCompleteSet}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#173F35] hover:bg-[#1f5043] text-[#F5F1E8] font-bold text-xs uppercase tracking-wider transition border border-[#26745A] shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5 text-[#C6A66B]" />
              {currentSet >= targetSets ? 'Conclude Final Series' : `Complete Set ${currentSet}`}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsWorkoutPaused(!isWorkoutPaused)}
                className="flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-[#1F241E] hover:bg-[#262C24] text-[#A6A7A1] hover:text-[#F5F1E8] text-xs font-semibold border border-[#2A3029] transition"
              >
                {isWorkoutPaused ? (
                  <>
                    <Play className="w-4 h-4 fill-current text-[#4ADE80]" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 text-[#C6A66B]" />
                    Pause
                  </>
                )}
              </button>

              <button
                onClick={() => handleFinishWorkout()}
                disabled={isFinishing}
                className="flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 text-xs font-semibold border border-rose-800/40 transition disabled:opacity-50"
              >
                {isFinishing ? 'Synchronizing...' : 'Conclude Session'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActiveWorkoutSession;
