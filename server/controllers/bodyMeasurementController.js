import BodyMeasurement from '../models/BodyMeasurement.js';
import User from '../models/User.js';

// Helper: Calculate BMI category accurately
export const getBmiClassification = (bmi) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25.0) return 'Normal Weight';
  if (bmi < 30.0) return 'Overweight';
  return 'Obesity Range';
};

// @desc    Record a new body measurement
// @route   POST /api/v1/body/measurements
// @access  Private
export const recordMeasurement = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let { weightKg, heightCm, bodyFatPercentage, waistCircumferenceCm, notes, recordedAt } = req.body;

    const parsedWeight = parseFloat(weightKg);
    let parsedHeight = parseFloat(heightCm);

    // Fallback height to user profile if not provided
    if ((isNaN(parsedHeight) || parsedHeight <= 0) && req.user?.profile?.heightCm) {
      parsedHeight = req.user.profile.heightCm;
    }

    // Validation
    if (isNaN(parsedWeight) || parsedWeight < 25 || parsedWeight > 350) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid weight between 25 kg and 350 kg.',
      });
    }

    if (isNaN(parsedHeight) || parsedHeight < 60 || parsedHeight > 260) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid height between 60 cm and 260 cm.',
      });
    }

    const heightM = parsedHeight / 100;
    const bmi = parseFloat((parsedWeight / (heightM * heightM)).toFixed(1));
    const bmiCategory = getBmiClassification(bmi);

    const measurement = await BodyMeasurement.create({
      user: userId,
      weightKg: parsedWeight,
      heightCm: parsedHeight,
      bmi,
      bmiCategory,
      bodyFatPercentage: bodyFatPercentage ? parseFloat(bodyFatPercentage) : null,
      waistCircumferenceCm: waistCircumferenceCm ? parseFloat(waistCircumferenceCm) : null,
      notes: notes || '',
      recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
    });

    // Synchronize latest profile weight & height in User model
    await User.findByIdAndUpdate(userId, {
      'profile.weightKg': parsedWeight,
      'profile.heightCm': parsedHeight,
    });

    res.status(201).json({
      success: true,
      data: measurement,
      message: 'Body measurement recorded and biometric profile synchronized successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's body measurement history & analytics
// @route   GET /api/v1/body/measurements
// @access  Private
export const getMeasurements = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit, 10) || 50;

    const measurements = await BodyMeasurement.find({ user: userId })
      .sort({ recordedAt: 1 }) // Chronological for charts
      .limit(limit);

    // Compute progress delta if multiple records exist
    let progressSummary = null;
    if (measurements.length > 0) {
      const initial = measurements[0];
      const latest = measurements[measurements.length - 1];
      const weightDelta = parseFloat((latest.weightKg - initial.weightKg).toFixed(1));
      const bmiDelta = parseFloat((latest.bmi - initial.bmi).toFixed(1));

      const weights = measurements.map((m) => m.weightKg);
      progressSummary = {
        totalRecords: measurements.length,
        initialWeight: initial.weightKg,
        currentWeight: latest.weightKg,
        weightDelta,
        initialBmi: initial.bmi,
        currentBmi: latest.bmi,
        bmiDelta,
        minWeight: Math.min(...weights),
        maxWeight: Math.max(...weights),
        firstRecordedAt: initial.recordedAt,
        latestRecordedAt: latest.recordedAt,
      };
    }

    res.json({
      success: true,
      data: measurements,
      analytics: progressSummary,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single measurement record
// @route   GET /api/v1/body/measurements/:id
// @access  Private
export const getMeasurementById = async (req, res, next) => {
  try {
    const measurement = await BodyMeasurement.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: 'Measurement record not found.',
      });
    }

    res.json({
      success: true,
      data: measurement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a body measurement record
// @route   DELETE /api/v1/body/measurements/:id
// @access  Private
export const deleteMeasurement = async (req, res, next) => {
  try {
    const measurement = await BodyMeasurement.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: 'Measurement record not found or access denied.',
      });
    }

    res.json({
      success: true,
      message: 'Measurement record deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
