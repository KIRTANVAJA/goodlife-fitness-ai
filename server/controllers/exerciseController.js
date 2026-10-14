import Exercise from '../models/Exercise.js';
import { initialExercises } from '../data/initialExercises.js';

// Auto-seed helper
export const ensureExercisesSeeded = async () => {
  try {
    const count = await Exercise.countDocuments();
    if (count === 0) {
      console.log('[ExerciseController] No exercises found in database, auto-seeding initial library...');
      for (const ex of initialExercises) {
        await Exercise.create(ex);
      }
      console.log(`[ExerciseController] Auto-seeded ${initialExercises.length} exercises.`);
    }
  } catch (err) {
    console.error('[ExerciseController] Auto-seed failed:', err.message);
  }
};

// @desc    Get all exercises with optional filtering
// @route   GET /api/v1/exercises
// @access  Public
export const getAllExercises = async (req, res, next) => {
  try {
    const { category, difficulty, tracking, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (tracking !== undefined) query.trackingSupported = tracking === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { 'targetMuscles.primary': { $regex: search, $options: 'i' } },
      ];
    }

    let exercises = await Exercise.find(query).sort({ trackingSupported: -1, name: 1 });

    if (exercises.length === 0 && Object.keys(req.query).length === 0) {
      await ensureExercisesSeeded();
      exercises = await Exercise.find().sort({ trackingSupported: -1, name: 1 });
    }

    res.json({
      success: true,
      count: exercises.length,
      data: exercises,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single exercise by ID or slug
// @route   GET /api/v1/exercises/:id
// @access  Public
export const getExerciseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let exercise;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      exercise = await Exercise.findById(id);
    }

    if (!exercise) {
      exercise = await Exercise.findOne({ exerciseId: id.toLowerCase() });
    }

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: `Exercise '${id}' not found`,
      });
    }

    res.json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
};
