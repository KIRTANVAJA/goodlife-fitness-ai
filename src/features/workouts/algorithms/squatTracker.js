import {
  calculateAngleBetweenLandmarks,
  checkLandmarksVisibility,
  POSE_LANDMARKS,
} from '../../bodyTracking/utils/geometry.js';

export class SquatTracker {
  constructor() {
    this.state = 'START'; // 'START' | 'DESCENDING' | 'BOTTOM' | 'ASCENDING'
    this.reps = 0;
    this.feedback = 'Stand tall with side profile to camera to begin.';
    this.formAlert = false;
    this.minKneeAngleRecorded = 180;
    this.lastRepTimestamp = 0;
    this.formEvents = [];
  }

  reset() {
    this.state = 'START';
    this.reps = 0;
    this.feedback = 'Stand tall with side profile to camera to begin.';
    this.formAlert = false;
    this.minKneeAngleRecorded = 180;
    this.formEvents = [];
  }

  process(landmarks, timestamp) {
    if (!landmarks) {
      return {
        reps: this.reps,
        state: this.state,
        feedback: 'Position full body in camera frame',
        formAlert: false,
        keyAngle: null,
      };
    }

    // Determine which side is more visible (left or right profile)
    const leftHipVis = landmarks[POSE_LANDMARKS.LEFT_HIP]?.visibility || 0;
    const rightHipVis = landmarks[POSE_LANDMARKS.RIGHT_HIP]?.visibility || 0;
    const isLeftSide = leftHipVis >= rightHipVis;

    const shoulder = isLeftSide ? POSE_LANDMARKS.LEFT_SHOULDER : POSE_LANDMARKS.RIGHT_SHOULDER;
    const hip = isLeftSide ? POSE_LANDMARKS.LEFT_HIP : POSE_LANDMARKS.RIGHT_HIP;
    const knee = isLeftSide ? POSE_LANDMARKS.LEFT_KNEE : POSE_LANDMARKS.RIGHT_KNEE;
    const ankle = isLeftSide ? POSE_LANDMARKS.LEFT_ANKLE : POSE_LANDMARKS.RIGHT_ANKLE;

    // Check visibility of required joints
    const kneeAngle = calculateAngleBetweenLandmarks(landmarks, hip, knee, ankle);
    const hipAngle = calculateAngleBetweenLandmarks(landmarks, shoulder, hip, knee);

    if (kneeAngle === null) {
      return {
        reps: this.reps,
        state: this.state,
        feedback: 'Legs not fully visible. Step back so knees and ankles are in frame.',
        formAlert: true,
        keyAngle: null,
      };
    }

    let feedback = this.feedback;
    let formAlert = false;

    // State machine with hysteresis
    switch (this.state) {
      case 'START':
        if (kneeAngle > 155) {
          feedback = 'Ready! Begin descending into your squat.';
        }
        if (kneeAngle < 140) {
          this.state = 'DESCENDING';
          this.minKneeAngleRecorded = kneeAngle;
          feedback = 'Descending... lower your hips smoothly.';
        }
        break;

      case 'DESCENDING':
        if (kneeAngle < this.minKneeAngleRecorded) {
          this.minKneeAngleRecorded = kneeAngle;
        }

        // Check if bottom depth reached (thigh parallel to floor, knee angle <= 95°)
        if (kneeAngle <= 95) {
          this.state = 'BOTTOM';
          feedback = 'Excellent depth! Drive up through your heels.';
        } else if (kneeAngle > 145) {
          // Incomplete rep: returned without hitting depth
          this.state = 'START';
          feedback = 'Squat deeper for full repetition credit (target parallel).';
          formAlert = true;
          this.formEvents.push('Incomplete squat depth');
        }
        break;

      case 'BOTTOM':
        if (kneeAngle < this.minKneeAngleRecorded) {
          this.minKneeAngleRecorded = kneeAngle;
        }

        // Check chest collapse
        if (hipAngle && hipAngle < 60) {
          feedback = 'Keep your chest elevated; avoid folding forward.';
          formAlert = true;
        }

        if (kneeAngle > 115) {
          this.state = 'ASCENDING';
          feedback = 'Ascending... stand all the way up.';
        }
        break;

      case 'ASCENDING':
        if (kneeAngle >= 155) {
          // Completed full rep cycle! Ensure minimum time between reps (debounce 500ms)
          if (!this.lastRepTimestamp || timestamp - this.lastRepTimestamp > 500) {
            this.reps += 1;
            this.lastRepTimestamp = timestamp;
            feedback = `Rep ${this.reps} completed! Great form.`;
          }
          this.state = 'START';
          this.minKneeAngleRecorded = 180;
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
      keyAngle: kneeAngle,
      secondaryAngle: hipAngle,
      activeJoints: [hip, knee, ankle],
    };
  }
}
