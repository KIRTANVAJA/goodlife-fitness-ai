import { SquatTracker } from './squatTracker';
import { PushupTracker } from './pushupTracker';
import { PlankTracker } from './plankTracker';
import { LungeTracker } from './lungeTracker';

class InstructionalTracker {
  constructor(exerciseName) {
    this.name = exerciseName;
    this.reps = 0;
    this.feedback = `Maintain steady form and pace for ${exerciseName}. Count completed repetitions manually.`;
    this.formAlert = false;
  }

  reset() {
    this.reps = 0;
    this.feedback = `Maintain steady form and pace for ${this.name}. Count completed repetitions manually.`;
  }

  process(landmarks) {
    if (!landmarks) {
      return {
        reps: this.reps,
        state: 'INSTRUCTIONAL',
        feedback: 'Position yourself in front of camera',
        formAlert: false,
        keyAngle: null,
      };
    }
    return {
      reps: this.reps,
      state: 'INSTRUCTIONAL',
      feedback: 'Posture detected. Follow steady breathing and track your sets.',
      formAlert: false,
      keyAngle: null,
      activeJoints: [],
    };
  }
}

export const createExerciseTracker = (exerciseId, exerciseName = '') => {
  switch (exerciseId) {
    case 'bodyweight-squat':
      return new SquatTracker();
    case 'push-up':
      return new PushupTracker();
    case 'plank':
      return new PlankTracker();
    case 'forward-lunge':
      return new LungeTracker();
    default:
      return new InstructionalTracker(exerciseName || exerciseId);
  }
};
