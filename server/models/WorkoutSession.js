import mongoose from 'mongoose';

const workoutExerciseResultSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true,
  },
  exerciseId: {
    type: String,
    required: true,
  },
  exerciseName: {
    type: String,
    required: true,
  },
  targetSets: {
    type: Number,
    default: 3,
  },
  setsCompleted: {
    type: Number,
    default: 0,
  },
  totalRepsCompleted: {
    type: Number,
    default: 0,
  },
  repsPerSet: [
    {
      setNumber: Number,
      repsCounted: Number,
      durationSeconds: Number,
      restSeconds: Number,
      formFeedbackEvents: [String],
    },
  ],
  holdDurationSeconds: {
    type: Number,
    default: 0,
  },
  restDurationSeconds: {
    type: Number,
    default: 0,
  },
  trackingQuality: {
    averageConfidence: { type: Number, default: 0 },
    visibilityIssuesDetected: { type: Number, default: 0 },
    formCorrectionsCount: { type: Number, default: 0 },
  },
  estimatedCalories: {
    type: Number,
    default: 0,
  },
});

const workoutSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endTime: {
      type: Date,
    },
    totalDurationSeconds: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['in_progress', 'paused', 'completed', 'abandoned'],
      default: 'in_progress',
      index: true,
    },
    activeDurationSeconds: {
      type: Number,
      default: 0,
    },
    pausedDurationSeconds: {
      type: Number,
      default: 0,
    },
    exercises: [workoutExerciseResultSchema],
    totalSetsCompleted: {
      type: Number,
      default: 0,
    },
    totalRepsCompleted: {
      type: Number,
      default: 0,
    },
    totalHoldDurationSeconds: {
      type: Number,
      default: 0,
    },
    totalRestDurationSeconds: {
      type: Number,
      default: 0,
    },
    estimatedCaloriesBurned: {
      type: Number,
      default: 0,
    },
    calorieEstimationMethod: {
      type: String,
      default: 'MET formulation based on exercise intensity, body mass, and active duration',
    },
    overallTrackingQualityScore: {
      type: Number, // 0 - 100 percentage based on MediaPipe confidence
      default: null,
    },
    formTechniqueScore: {
      type: Number, // 0 - 100 percentage based on completed cycles vs form alerts
      default: null,
    },
    summaryNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast query of user's workout history sorted by date
workoutSessionSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('WorkoutSession', workoutSessionSchema);
