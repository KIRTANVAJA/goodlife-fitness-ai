import {
  calculateAngleBetweenLandmarks,
  POSE_LANDMARKS,
} from '../../bodyTracking/utils/geometry.js';

export class LungeTracker {
  constructor() {
    this.state = 'START'; // 'START' | 'LUNGING' | 'BOTTOM' | 'RETURNING'
    this.reps = 0;
    this.feedback = 'Stand upright in side profile to begin lunges.';
    this.formAlert = false;
    this.minKneeAngle = 180;
    this.lastRepTimestamp = 0;
    this.formEvents = [];
  }

  reset() {
    this.state = 'START';
    this.reps = 0;
    this.feedback = 'Stand upright in side profile to begin lunges.';
    this.formAlert = false;
    this.minKneeAngle = 180;
    this.formEvents = [];
  }

  process(landmarks, timestamp) {
    if (!landmarks) {
      return {
        reps: this.reps,
        state: this.state,
        feedback: 'Position body sideways in frame',
        formAlert: false,
        keyAngle: null,
      };
    }

    // Determine leading knee angle from both legs, taking whichever is flexing more
    const leftKneeAngle = calculateAngleBetweenLandmarks(
      landmarks,
      POSE_LANDMARKS.LEFT_HIP,
      POSE_LANDMARKS.LEFT_KNEE,
      POSE_LANDMARKS.LEFT_ANKLE
    );

    const rightKneeAngle = calculateAngleBetweenLandmarks(
      landmarks,
      POSE_LANDMARKS.RIGHT_HIP,
      POSE_LANDMARKS.RIGHT_KNEE,
      POSE_LANDMARKS.RIGHT_ANKLE
    );

    const validAngles = [leftKneeAngle, rightKneeAngle].filter((a) => a !== null);
    if (validAngles.length === 0) {
      return {
        reps: this.reps,
        state: this.state,
        feedback: 'Legs not clearly visible. Step back slightly.',
        formAlert: true,
        keyAngle: null,
      };
    }

    // Lead leg has the lower angle during lunge flexion
    const activeKneeAngle = Math.min(...validAngles);

    let feedback = this.feedback;
    let formAlert = false;

    switch (this.state) {
      case 'START':
        if (activeKneeAngle > 155) {
          feedback = 'Ready! Step forward into a deep lunge.';
        }
        if (activeKneeAngle < 140) {
          this.state = 'LUNGING';
          this.minKneeAngle = activeKneeAngle;
          feedback = 'Descending... lower back knee toward floor.';
        }
        break;

      case 'LUNGING':
        if (activeKneeAngle < this.minKneeAngle) {
          this.minKneeAngle = activeKneeAngle;
        }

        if (activeKneeAngle <= 95) {
          this.state = 'BOTTOM';
          feedback = 'Target 90° lunge depth reached! Push firmly back to start.';
        } else if (activeKneeAngle > 145) {
          this.state = 'START';
          feedback = 'Lunge deeper: aim for 90° at the front knee.';
          formAlert = true;
        }
        break;

      case 'BOTTOM':
        if (activeKneeAngle > 125) {
          this.state = 'RETURNING';
          feedback = 'Returning to standing posture...';
        }
        break;

      case 'RETURNING':
        if (activeKneeAngle >= 155) {
          if (!this.lastRepTimestamp || timestamp - this.lastRepTimestamp > 600) {
            this.reps += 1;
            this.lastRepTimestamp = timestamp;
            feedback = `Rep ${this.reps} complete! Great balance.`;
          }
          this.state = 'START';
          this.minKneeAngle = 180;
        }
        break;

      default:
        this.state = 'START';
    }

    this.feedback = feedback;
    this.formAlert = formAlert;

    return {
      reps: this.reps,
      state: this.state,
      feedback,
      formAlert,
      keyAngle: activeKneeAngle,
      activeJoints: [
        POSE_LANDMARKS.LEFT_HIP,
        POSE_LANDMARKS.LEFT_KNEE,
        POSE_LANDMARKS.RIGHT_HIP,
        POSE_LANDMARKS.RIGHT_KNEE,
      ],
    };
  }
}
