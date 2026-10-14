import mongoose from 'mongoose';

const bodyMeasurementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    weightKg: {
      type: Number,
      required: [true, 'Weight in kg is required'],
      min: [25, 'Weight must be at least 25 kg'],
      max: [350, 'Weight must be realistic (≤ 350 kg)'],
    },
    heightCm: {
      type: Number,
      required: [true, 'Height in cm is required'],
      min: [60, 'Height must be at least 60 cm'],
      max: [260, 'Height must be realistic (≤ 260 cm)'],
    },
    bmi: {
      type: Number,
      required: true,
    },
    bmiCategory: {
      type: String,
      enum: ['Underweight', 'Normal Weight', 'Overweight', 'Obesity Range'],
      required: true,
    },
    bodyFatPercentage: {
      type: Number,
      min: 3,
      max: 60,
      default: null,
    },
    waistCircumferenceCm: {
      type: Number,
      default: null,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    notes: {
      type: String,
      default: '',
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  }
);

bodyMeasurementSchema.index({ user: 1, recordedAt: -1 });

export default mongoose.model('BodyMeasurement', bodyMeasurementSchema);
