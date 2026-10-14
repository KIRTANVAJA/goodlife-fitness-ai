/**
 * Scientific Calorie Estimation Engine using MET (Metabolic Equivalent of Task)
 *
 * Formula:
 * Energy Expenditure (kcal) = MET * 3.5 * Body Weight (kg) / 200 * Duration (minutes)
 *
 * Reference:
 * Ainsworth BE, et al. Compendium of Physical Activities: a second update of codes and MET intensities.
 * Medicine and Science in Sports and Exercise.
 *
 * IMPORTANT: This value is strictly a physiological approximation.
 * True energy expenditure varies based on body composition, individual metabolic efficiency, and heart rate.
 */

export const EXERCISE_MET_VALUES = {
  'bodyweight-squat': 5.5,
  'push-up': 8.0,
  'plank': 3.8,
  'forward-lunge': 4.5,
  'standing-shoulder-press': 5.5,
  default: 5.0,
};

export const calculateCaloriesBurned = ({
  exerciseId,
  durationSeconds,
  bodyWeightKg = 70,
  customMet = null,
}) => {
  if (!durationSeconds || durationSeconds <= 0) return 0;

  const met = customMet || EXERCISE_MET_VALUES[exerciseId] || EXERCISE_MET_VALUES.default;
  const durationMinutes = durationSeconds / 60;
  const calories = (met * 3.5 * bodyWeightKg / 200) * durationMinutes;

  return Math.round(calories * 10) / 10;
};
