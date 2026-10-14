import {
  calculateAngleBetweenLandmarks,
  POSE_LANDMARKS,
} from '../../bodyTracking/utils/geometry.js';

export class PushupTracker {
  constructor() {
    this.state = 'PLANK_START'; // 'PLANK_START' | 'DESCENDING' | 'BOTTOM' | 'ASCENDING'
    this.reps = 0;
    this.feedback = 'Assume high plank position sideways to camera.';
    this.formAlert = false;
    this.minElbowAngle = 180;
    this.lastRepTimestamp = 0;
    this.formEvents = [];
  }

  reset() {
    this.state = 'PLANK_START';
    this.reps = 0;
    this.feedback = 'Assume high plank position sideways to camera.';
    this.formAlert = false;
    this.minElbowAngle = 180;
    this.formEvents = [];
  }

  process(landmarks, timestamp) {
    if (!landmarks) {
      return {
        reps: this.reps,
        state: this.state,
        feedback: 'Position body in side profile in frame',
        formAlert: false,
        keyAngle: null,
      };
    }

    // Determine primary side
    const leftElbowVis = landmarks[POSE_LANDMARKS.LEFT_ELBOW]?.visibility || 0;
    const rightElbowVis = landmarks[POSE_LANDMARKS.RIGHT_ELBOW]?.visibility || 0;
    const isLeftSide = leftElbowVis >= rightElbowVis;

    const shoulder = isLeftSide ? POSE_LANDMARKS.LEFT_SHOULDER : POSE_LANDMARKS.RIGHT_SHOULDER;
    const elbow = isLeftSide ? POSE_LANDMARKS.LEFT_ELBOW : POSE_LANDMARKS.RIGHT_ELBOW;
    const wrist = isLeftSide ? POSE_LANDMARKS.LEFT_WRIST : POSE_LANDMARKS.RIGHT_WRIST;
    const hip = isLeftSide ? POSE_LANDMARKS.LEFT_HIP : POSE_LANDMARKS.RIGHT_HIP;
    const ankle = isLeftSide ? POSE_LANDMARKS.LEFT_ANKLE : POSE_LANDMARKS.RIGHT_ANKLE;

    const elbowAngle = calculateAngleBetweenLandmarks(landmarks, shoulder, elbow, wrist);
    const bodyAngle = calculateAngleBetweenLandmarks(landmarks, shoulder, hip, ankle);

    if (elbowAngle === null) {
      return {
        reps: this.reps,
        state: this.state,
        feedback: 'Arms not visible. Ensure hands, elbows, and shoulders are in view.',
        formAlert: true,
        keyAngle: null,
      };
    }

    let feedback = this.feedback;
    let formAlert = false;

    // Body alignment check (hip sagging or piking)
    if (bodyAngle && (bodyAngle < 150 || bodyAngle > 195)) {
      feedback = 'Keep your body in a straight line; avoid sagging hips.';
      formAlert = true;
      this.formEvents.push('Improper body alignment in push-up');
    }

    switch (this.state) {
      case 'PLANK_START':
        if (elbowAngle > 150) {
          if (!formAlert) feedback = 'High plank ready! Lower your chest toward the floor.';
        }
        if (elbowAngle < 130) {
          this.state = 'DESCENDING';
          this.minElbowAngle = elbowAngle;
          if (!formAlert) feedback = 'Lowering... maintain controlled tempo.';
        }
        break;

      case 'DESCENDING':
        if (elbowAngle < this.minElbowAngle) {
          this.minElbowAngle = elbowAngle;
        }

        if (elbowAngle <= 90) {
          this.state = 'BOTTOM';
          if (!formAlert) feedback = 'Full chest depth reached! Press up firmly.';
        } else if (elbowAngle > 140) {
          // Half rep returned too early
          this.state = 'PLANK_START';
          feedback = 'Lower chest closer to 90 degrees for a full rep.';
          formAlert = true;
        }
        break;

      case 'BOTTOM':
        if (elbowAngle > 115) {
          this.state = 'ASCENDING';
          if (!formAlert) feedback = 'Pushing upward... lock out arms.';
        }
        break;

      case 'ASCENDING':
        if (elbowAngle >= 150) {
          if (!this.lastRepTimestamp || timestamp - this.lastRepTimestamp > 500) {
            this.reps += 1;
            this.lastRepTimestamp = timestamp;
            feedback = `Rep ${this.reps} completed! Strong push.`;
          }
          this.state = 'PLANK_START';
          this.minElbowAngle = 180;
        }
        break;

      default:
        this.state = 'PLANK_START';
    }

    this.feedback = feedback;
    this.formAlert = formAlert;

    return {
      reps: this.reps,
      state: this.state,
      feedback,
      formAlert,
      keyAngle: elbowAngle,
      secondaryAngle: bodyAngle,
      activeJoints: [shoulder, elbow, wrist, hip],
    };
  }
}
