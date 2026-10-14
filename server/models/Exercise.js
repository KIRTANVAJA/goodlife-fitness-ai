import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['strength', 'endurance', 'mobility', 'core', 'hiit'],
      default: 'strength',
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    targetMuscles: {
      primary: [{ type: String, required: true }],
      secondary: [{ type: String }],
    },
    equipment: {
      type: String,
      default: 'bodyweight',
    },
    startingPosition: {
      type: String,
      required: true,
    },
    steps: [
      {
        stepNumber: Number,
        instruction: String,
      },
    ],
    breathingGuidance: {
      inhalePhase: String,
      exhalePhase: String,
      cue: String,
    },
    recommendedSets: {
      type: Number,
      default: 3,
    },
    recommendedReps: {
      type: Number,
      default: 12,
    },
    recommendedHoldSeconds: {
      type: Number,
      default: 0,
    },
    recommendedRestSeconds: {
      type: Number,
      default: 60,
    },
    commonMistakes: [
      {
        mistake: String,
        correction: String,
      },
    ],
    safetyInstructions: [String],
    cameraOrientation: {
      type: String,
      enum: ['side', 'front', 'diagonal'],
      required: true,
      default: 'side',
    },
    requiredLandmarks: [String],
    trackingSupported: {
      type: Boolean,
      default: false,
    },
    trackingCapabilities: {
      repCounting: { type: Boolean, default: false },
      durationTracking: { type: Boolean, default: false },
      formChecks: [String],
      keyAngles: [String],
    },
    setupInstructions: [String],
    demoMedia: {
      image: { type: String, required: true },
      thumbnail: { type: String },
      video: { type: String },
      altText: { type: String },
    },
    metValue: {
      type: Number,
      default: 5.0, // Standard MET (Metabolic Equivalent of Task)
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Exercise', exerciseSchema);
