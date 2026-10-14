import Exercise from '../models/Exercise.js';
import WorkoutSession from '../models/WorkoutSession.js';

// @desc    Get personalized recommendations based on profile and history
// @route   GET /api/v1/recommendations
// @access  Private
export const getPersonalizedRecommendations = async (req, res, next) => {
  try {
    const user = req.user;
    const profile = user.profile || {};

    const {
      fitnessLevel = 'beginner',
      primaryGoal = 'general_fitness',
      availableEquipment = ['bodyweight'],
      targetWorkoutsPerWeek = 3,
    } = profile;

    // Fetch user recent sessions to inspect what was recently practiced
    const recentSessions = await WorkoutSession.find({
      user: user.id,
      status: 'completed',
    })
      .sort({ createdAt: -1 })
      .limit(10);

    const practicedExerciseIds = new Set();
    recentSessions.forEach((s) => {
      s.exercises.forEach((ex) => {
        if (ex.exerciseId) practicedExerciseIds.add(ex.exerciseId);
      });
    });

    // Fetch all exercises from DB
    const allExercises = await Exercise.find();

    const scoredExercises = allExercises.map((ex) => {
      let score = 50; // base score
      const rationale = [];

      // 1. Equipment compatibility
      const hasEquipment =
        ex.equipment === 'bodyweight' ||
        availableEquipment.includes(ex.equipment);

      if (hasEquipment) {
        score += 20;
      } else {
        score -= 40;
        rationale.push(`Requires ${ex.equipment} (not currently in your equipment profile)`);
      }

      // 2. Fitness Level match
      if (ex.difficulty === fitnessLevel) {
        score += 20;
        rationale.push(`Matches your current ${fitnessLevel} fitness level.`);
      } else if (
        (fitnessLevel === 'beginner' && ex.difficulty === 'advanced') ||
        (fitnessLevel === 'advanced' && ex.difficulty === 'beginner')
      ) {
        score -= 10;
      }

      // 3. Goal alignment
      if (primaryGoal === 'fat_loss') {
        if (ex.category === 'strength' || ex.category === 'hiit') {
          score += 15;
          rationale.push('High metabolic demand supports caloric deficit and fat loss.');
        }
      } else if (primaryGoal === 'muscle_building') {
        if (ex.category === 'strength') {
          score += 20;
          rationale.push('Compound mechanical tension triggers myofibrillar hypertrophy.');
        }
      } else if (primaryGoal === 'general_fitness') {
        if (ex.category === 'core' || ex.category === 'strength') {
          score += 15;
          rationale.push('Foundational multi-joint pattern promotes functional durability.');
        }
      } else if (primaryGoal === 'endurance') {
        if (ex.category === 'endurance' || ex.category === 'core') {
          score += 15;
          rationale.push('Sustained isometric tension elevates muscular stamina.');
        }
      }

      // 4. AI-tracking capability boost (prioritize validated computer vision features)
      if (ex.trackingSupported) {
        score += 15;
        rationale.push('Real-time computer vision pose tracking and rep counting enabled.');
      }

      // 5. Variety vs Mastery rule
      if (practicedExerciseIds.has(ex.exerciseId)) {
        rationale.push('Previous activity logged; continue progressive overload.');
      } else {
        score += 5;
        rationale.push('New movement to expand neuromuscular adaptation.');
      }

      return {
        exercise: ex,
        score,
        rationale,
      };
    });

    // Sort by score descending
    scoredExercises.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      data: {
        profileSummary: {
          fitnessLevel,
          primaryGoal,
          availableEquipment,
          targetWorkoutsPerWeek,
          completedWorkoutsCount: recentSessions.length,
        },
        recommendations: scoredExercises.slice(0, 4),
        algorithmTransparency: {
          method: 'Multi-criteria rule-based recommendation matrix',
          factorsEvaluated: [
            'Equipment availability match',
            'Biomechanical difficulty vs user training experience',
            'Primary metabolic goal alignment',
            'Computer vision tracking availability',
            'Workout history rotation',
          ],
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
