import WorkoutSession from '../models/WorkoutSession.js';
import Exercise from '../models/Exercise.js';
import User from '../models/User.js';

// Calorie helper function based on scientific MET formulas
const calculateEstimatedCalories = (met, durationSeconds, weightKg = 70) => {
  const durationMinutes = durationSeconds / 60;
  // Standard exercise science formula: (MET * 3.5 * weightKg / 200) * durationMinutes
  const calories = (met * 3.5 * weightKg / 200) * durationMinutes;
  return Math.round(calories * 10) / 10;
};

// @desc    Start / Create a new workout session
// @route   POST /api/v1/workouts/sessions
// @access  Private
export const createSession = async (req, res, next) => {
  try {
    const { exercises } = req.body;

    // Check if user already has an active in_progress session created recently
    const existingActive = await WorkoutSession.findOne({
      user: req.user.id,
      status: 'in_progress',
    }).sort({ createdAt: -1 });

    if (existingActive) {
      // If active session is less than 2 hours old, return it instead of creating duplicate
      const hoursOld = (Date.now() - new Date(existingActive.startTime).getTime()) / (1000 * 60 * 60);
      if (hoursOld < 2) {
        return res.status(200).json({
          success: true,
          message: 'Resuming existing active workout session',
          data: existingActive,
        });
      } else {
        // Mark stale session as abandoned
        existingActive.status = 'abandoned';
        await existingActive.save();
      }
    }

    const session = await WorkoutSession.create({
      user: req.user.id,
      startTime: new Date(),
      status: 'in_progress',
      exercises: exercises || [],
    });

    res.status(201).json({
      success: true,
      message: 'Workout session initialized',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all workout sessions for the logged-in user
// @route   GET /api/v1/workouts/sessions
// @access  Private
export const getUserSessions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const query = { user: req.user.id };
    if (req.query.status) {
      query.status = req.query.status;
    }

    const total = await WorkoutSession.countDocuments(query);
    const sessions = await WorkoutSession.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('exercises.exercise', 'name category equipment metValue demoMedia');

    res.json({
      success: true,
      count: sessions.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        total,
      },
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single workout session by ID
// @route   GET /api/v1/workouts/sessions/:id
// @access  Private
export const getSessionById = async (req, res, next) => {
  try {
    const session = await WorkoutSession.findById(req.params.id).populate(
      'exercises.exercise',
      'name category equipment metValue demoMedia'
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Workout session not found',
      });
    }

    // Verify ownership
    if (session.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only access your own workout sessions',
      });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update / Finish a workout session
// @route   PATCH /api/v1/workouts/sessions/:id
// @access  Private
export const updateSession = async (req, res, next) => {
  try {
    let session = await WorkoutSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Workout session not found',
      });
    }

    // Verify user ownership
    if (session.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only update your own workout sessions',
      });
    }

    const {
      status,
      exercises,
      totalDurationSeconds,
      activeDurationSeconds,
      pausedDurationSeconds,
      overallTrackingQualityScore,
      formTechniqueScore,
      summaryNotes,
    } = req.body;

    const userWeight = req.user.profile?.weightKg || 70;

    if (exercises && Array.isArray(exercises)) {
      session.exercises = exercises;

      // Calculate totals
      let totalSets = 0;
      let totalReps = 0;
      let totalHoldSecs = 0;
      let totalRestSecs = 0;
      let totalCalories = 0;

      for (const exResult of exercises) {
        totalSets += Number(exResult.setsCompleted || 0);
        totalReps += Number(exResult.totalRepsCompleted || 0);
        totalHoldSecs += Number(exResult.holdDurationSeconds || 0);
        totalRestSecs += Number(exResult.restDurationSeconds || 0);

        // Fetch MET if available or default 5.0
        let met = 5.0;
        if (exResult.exercise) {
          const exDoc = await Exercise.findById(exResult.exercise);
          if (exDoc?.metValue) met = exDoc.metValue;
        }

        const exerciseDuration = (exResult.holdDurationSeconds || 0) + (exResult.totalRepsCompleted ? exResult.totalRepsCompleted * 4 : (totalDurationSeconds || 60));
        const exCalories = calculateEstimatedCalories(met, exerciseDuration, userWeight);
        exResult.estimatedCalories = exCalories;
        totalCalories += exCalories;
      }

      session.totalSetsCompleted = totalSets;
      session.totalRepsCompleted = totalReps;
      session.totalHoldDurationSeconds = totalHoldSecs;
      session.totalRestDurationSeconds = totalRestSecs;
      session.estimatedCaloriesBurned = Math.round(totalCalories);
    }

    if (totalDurationSeconds !== undefined) {
      session.totalDurationSeconds = totalDurationSeconds;
    }

    if (activeDurationSeconds !== undefined) {
      session.activeDurationSeconds = activeDurationSeconds;
    }

    if (pausedDurationSeconds !== undefined) {
      session.pausedDurationSeconds = pausedDurationSeconds;
    }

    if (overallTrackingQualityScore !== undefined) {
      session.overallTrackingQualityScore = overallTrackingQualityScore;
    }

    if (formTechniqueScore !== undefined) {
      session.formTechniqueScore = formTechniqueScore;
    }

    if (summaryNotes !== undefined) {
      session.summaryNotes = summaryNotes;
    }

    if (status) {
      session.status = status;
      if (status === 'completed' && !session.endTime) {
        session.endTime = new Date();
      }
    }

    await session.save();

    res.json({
      success: true,
      message: 'Workout session updated successfully',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user aggregate workout stats for dashboard
// @route   GET /api/v1/workouts/stats
// @access  Private
export const getUserStats = async (req, res, next) => {
  try {
    const sessions = await WorkoutSession.find({
      user: req.user.id,
      status: 'completed',
    }).sort({ createdAt: -1 });

    const inProgressCount = await WorkoutSession.countDocuments({
      user: req.user.id,
      status: 'in_progress',
    });

    const totalWorkouts = sessions.length;
    let totalReps = 0;
    let totalHoldSeconds = 0;
    let totalDurationSeconds = 0;
    let totalCalories = 0;

    // Past 7 days calculation
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    let past7DaysWorkouts = 0;
    let past7DaysCalories = 0;

    const weekdayCounts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    sessions.forEach((s) => {
      totalReps += s.totalRepsCompleted || 0;
      totalHoldSeconds += s.totalHoldDurationSeconds || 0;
      totalDurationSeconds += s.activeDurationSeconds || s.totalDurationSeconds || 0;
      totalCalories += s.estimatedCaloriesBurned || 0;

      const sessionDate = new Date(s.createdAt);
      if (sessionDate >= sevenDaysAgo) {
        past7DaysWorkouts++;
        past7DaysCalories += s.estimatedCaloriesBurned || 0;
        const day = dayNames[sessionDate.getDay()];
        weekdayCounts[day] += 1;
      }
    });

    const weeklyActivity = Object.keys(weekdayCounts).map((day) => ({
      day,
      sessions: weekdayCounts[day],
    }));

    res.json({
      success: true,
      data: {
        totalWorkouts,
        inProgressCount,
        totalReps,
        totalHoldSeconds,
        totalDurationMinutes: Math.round(totalDurationSeconds / 60),
        totalCaloriesBurned: totalCalories,
        past7Days: {
          workoutCount: past7DaysWorkouts,
          caloriesBurned: past7DaysCalories,
        },
        weeklyActivity,
        recentSessions: sessions.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
};
