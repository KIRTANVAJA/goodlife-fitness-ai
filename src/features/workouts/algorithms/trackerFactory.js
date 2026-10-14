import { SquatTracker } from './squatTracker';
import { PushupTracker } from './pushupTracker';
import { PlankTracker } from './plankTracker';
import { LungeTracker } from './lungeTracker';
import { 
  OverheadPressTracker, 
  ArmCurlTracker, 
  LateralRaiseTracker, 
  PullTracker, 
  HingeTracker, 
  CadenceTracker 
} from './universalTrackers';

/**
 * Universal AI Exercise Tracker Factory
 * Empowers ALL 24 exercises in the platform with live computer vision tracking & rep telemetry.
 */
export const createExerciseTracker = (exerciseId, exerciseName = '') => {
  switch (exerciseId) {
    // Squat family
    case 'bodyweight-squat':
    case 'goblet-squat':
    case 'squat':
      return new SquatTracker();

    // Horizontal Press family
    case 'push-up':
    case 'incline-push-up':
    case 'dumbbell-bench-press':
      return new PushupTracker();

    // Isometric Core Hold family
    case 'plank':
    case 'side-plank':
      return new PlankTracker();

    // Lunge & Unilateral family
    case 'forward-lunge':
    case 'reverse-lunge':
    case 'lunge':
      return new LungeTracker();

    // Vertical Press & Overhead Extension
    case 'standing-shoulder-press':
    case 'arnold-press':
    case 'triceps-overhead-extension':
      return new OverheadPressTracker(exerciseName || 'Overhead Press');

    // Biceps Arm Flexion
    case 'dumbbell-biceps-curl':
      return new ArmCurlTracker();

    // Shoulder Lateral Abduction
    case 'dumbbell-lateral-raise':
      return new LateralRaiseTracker();

    // Vertical & Horizontal Pull family
    case 'pull-up':
    case 'lat-pulldown':
    case 'bent-over-row':
      return new PullTracker(exerciseName || 'Pulling Movement');

    // Hip Hinge & Posterior Chain
    case 'romanian-deadlift':
      return new HingeTracker();

    // Dynamic Cadence, Calves & Agility
    case 'jumping-jacks':
    case 'high-knees':
    case 'mountain-climbers':
    case 'bicycle-crunch':
    case 'dead-bug':
    case 'standing-calf-raise':
      return new CadenceTracker(exerciseName || 'Cadence Rhythm');

    default:
      return new CadenceTracker(exerciseName || 'AI Exercise Session');
  }
};

export default createExerciseTracker;
