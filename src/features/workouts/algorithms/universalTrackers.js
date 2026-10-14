import {
  calculateAngleBetweenLandmarks,
  POSE_LANDMARKS,
} from '../../bodyTracking/utils/geometry.js';

/**
 * 1. Overhead Press / Shoulder / Triceps Extension Tracker
 * Evaluates arm extension upwards past 160° and lowering to 85°-90°.
 */
export class OverheadPressTracker {
  constructor(name = 'Overhead Press') {
    this.name = name;
    this.state = 'START'; // 'START' | 'LOWERING' | 'BOTTOM' | 'PRESSING'
    this.reps = 0;
    this.feedback = 'Position upper body in frame with dumbbells or hands at shoulder height.';
    this.formAlert = false;
    this.lastRepTimestamp = 0;
  }

  reset() {
    this.state = 'START';
    this.reps = 0;
    this.feedback = 'Position upper body in frame with dumbbells or hands at shoulder height.';
    this.formAlert = false;
  }

  process(landmarks, timestamp = Date.now()) {
    if (!landmarks) {
      return { reps: this.reps, state: this.state, feedback: 'Step into camera frame', formAlert: false, keyAngle: null };
    }

    const leftAngle = calculateAngleBetweenLandmarks(landmarks, POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST);
    const rightAngle = calculateAngleBetweenLandmarks(landmarks, POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST);
    const angle = leftAngle !== null && rightAngle !== null ? Math.round((leftAngle + rightAngle) / 2) : (leftAngle || rightAngle);

    if (angle === null) {
      return { reps: this.reps, state: this.state, feedback: 'Arms not fully visible. Keep hands in frame.', formAlert: true, keyAngle: null };
    }

    if (this.state === 'START' || this.state === 'PRESSING') {
      if (angle <= 95) {
        this.state = 'BOTTOM';
        this.feedback = 'Good depth. Now press straight overhead!';
        this.formAlert = false;
      } else {
        this.feedback = 'Lower hands to ear/shoulder level to complete full range.';
      }
    } else if (this.state === 'BOTTOM') {
      if (angle >= 160) {
        if (timestamp - this.lastRepTimestamp > 800) {
          this.reps += 1;
          this.lastRepTimestamp = timestamp;
          this.feedback = `Rep ${this.reps} counted! Controlled descent.`;
          this.formAlert = false;
        }
        this.state = 'START';
      }
    }

    return {
      reps: this.reps,
      state: this.state,
      feedback: this.feedback,
      formAlert: this.formAlert,
      keyAngle: angle,
    };
  }
}

/**
 * 2. Biceps Curl Tracker
 * Evaluates elbow curl angle from extended (≥145°) to peak contraction (≤55°).
 */
export class ArmCurlTracker {
  constructor() {
    this.state = 'DOWN'; // 'DOWN' | 'CURLING' | 'PEAK' | 'LOWERING'
    this.reps = 0;
    this.feedback = 'Stand upright with arms fully extended down at your sides.';
    this.formAlert = false;
    this.lastRepTimestamp = 0;
  }

  reset() {
    this.state = 'DOWN';
    this.reps = 0;
    this.feedback = 'Stand upright with arms fully extended down at your sides.';
    this.formAlert = false;
  }

  process(landmarks, timestamp = Date.now()) {
    if (!landmarks) {
      return { reps: this.reps, state: this.state, feedback: 'Position full arms in camera frame', formAlert: false, keyAngle: null };
    }

    const leftAngle = calculateAngleBetweenLandmarks(landmarks, POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST);
    const rightAngle = calculateAngleBetweenLandmarks(landmarks, POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST);
    const angle = leftAngle !== null ? leftAngle : rightAngle;

    if (angle === null) {
      return { reps: this.reps, state: this.state, feedback: 'Elbows not detected. Adjust distance.', formAlert: true, keyAngle: null };
    }

    if (this.state === 'DOWN' || this.state === 'LOWERING') {
      if (angle <= 60) {
        this.state = 'PEAK';
        this.feedback = 'Peak contraction! Now lower with control.';
        this.formAlert = false;
      }
    } else if (this.state === 'PEAK') {
      if (angle >= 145) {
        if (timestamp - this.lastRepTimestamp > 700) {
          this.reps += 1;
          this.lastRepTimestamp = timestamp;
          this.feedback = `Rep ${this.reps} counted! Squeeze at the top.`;
          this.formAlert = false;
        }
        this.state = 'DOWN';
      }
    }

    return {
      reps: this.reps,
      state: this.state,
      feedback: this.feedback,
      formAlert: this.formAlert,
      keyAngle: angle,
    };
  }
}

/**
 * 3. Lateral Raise Tracker
 * Evaluates arm abduction between torso, shoulder, and elbow (25° up to 80°-90°).
 */
export class LateralRaiseTracker {
  constructor() {
    this.state = 'DOWN';
    this.reps = 0;
    this.feedback = 'Stand tall with dumbbells at sides. Raise arms to shoulder height.';
    this.formAlert = false;
    this.lastRepTimestamp = 0;
  }

  reset() {
    this.state = 'DOWN';
    this.reps = 0;
    this.feedback = 'Stand tall with dumbbells at sides. Raise arms to shoulder height.';
    this.formAlert = false;
  }

  process(landmarks, timestamp = Date.now()) {
    if (!landmarks) return { reps: this.reps, state: this.state, feedback: 'Step into frame', formAlert: false, keyAngle: null };

    const leftAngle = calculateAngleBetweenLandmarks(landmarks, POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW);
    const rightAngle = calculateAngleBetweenLandmarks(landmarks, POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW);
    const angle = leftAngle !== null && rightAngle !== null ? Math.round((leftAngle + rightAngle) / 2) : (leftAngle || rightAngle);

    if (angle === null) {
      return { reps: this.reps, state: this.state, feedback: 'Torso or arms not detected', formAlert: true, keyAngle: null };
    }

    if (this.state === 'DOWN') {
      if (angle >= 75) {
        this.state = 'UP';
        this.feedback = 'Parallel reached. Lower under control.';
      }
    } else if (this.state === 'UP') {
      if (angle <= 30) {
        if (timestamp - this.lastRepTimestamp > 800) {
          this.reps += 1;
          this.lastRepTimestamp = timestamp;
          this.feedback = `Rep ${this.reps} counted! Keep traps relaxed.`;
        }
        this.state = 'DOWN';
      }
    }

    return {
      reps: this.reps,
      state: this.state,
      feedback: this.feedback,
      formAlert: false,
      keyAngle: angle,
    };
  }
}

/**
 * 4. Pull-Up & Row Tracker
 * Evaluates arm pulling and elbow flexion cycles.
 */
export class PullTracker {
  constructor(name = 'Pulling Movement') {
    this.name = name;
    this.state = 'EXTENSION';
    this.reps = 0;
    this.feedback = `Begin ${name} with full arm reach and engage lats.`;
    this.formAlert = false;
    this.lastRepTimestamp = 0;
  }

  reset() {
    this.state = 'EXTENSION';
    this.reps = 0;
    this.feedback = `Begin ${this.name} with full arm reach and engage lats.`;
    this.formAlert = false;
  }

  process(landmarks, timestamp = Date.now()) {
    if (!landmarks) return { reps: this.reps, state: this.state, feedback: 'Step into frame', formAlert: false, keyAngle: null };

    const leftAngle = calculateAngleBetweenLandmarks(landmarks, POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST);
    const rightAngle = calculateAngleBetweenLandmarks(landmarks, POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST);
    const angle = leftAngle !== null ? leftAngle : rightAngle;

    if (angle === null) return { reps: this.reps, state: this.state, feedback: 'Arms not in view', formAlert: true, keyAngle: null };

    if (this.state === 'EXTENSION') {
      if (angle <= 80) {
        this.state = 'FLEXION';
        this.feedback = 'Full contraction! Squeeze shoulder blades.';
      }
    } else if (this.state === 'FLEXION') {
      if (angle >= 145) {
        if (timestamp - this.lastRepTimestamp > 800) {
          this.reps += 1;
          this.lastRepTimestamp = timestamp;
          this.feedback = `Rep ${this.reps} counted! Controlled eccentric.`;
        }
        this.state = 'EXTENSION';
      }
    }

    return {
      reps: this.reps,
      state: this.state,
      feedback: this.feedback,
      formAlert: false,
      keyAngle: angle,
    };
  }
}

/**
 * 5. Hip Hinge & Deadlift Tracker
 * Evaluates hip flexion from standing (165°) to hinged (≤115°) with neutral spine.
 */
export class HingeTracker {
  constructor() {
    this.state = 'UPRIGHT';
    this.reps = 0;
    this.feedback = 'Stand tall. Hinge at hips pushing glutes backward while keeping spine neutral.';
    this.formAlert = false;
    this.lastRepTimestamp = 0;
  }

  reset() {
    this.state = 'UPRIGHT';
    this.reps = 0;
    this.feedback = 'Stand tall. Hinge at hips pushing glutes backward.';
    this.formAlert = false;
  }

  process(landmarks, timestamp = Date.now()) {
    if (!landmarks) return { reps: this.reps, state: this.state, feedback: 'Stand side-on to camera', formAlert: false, keyAngle: null };

    const hipAngle = calculateAngleBetweenLandmarks(landmarks, POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE) ||
                     calculateAngleBetweenLandmarks(landmarks, POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE);

    if (hipAngle === null) return { reps: this.reps, state: this.state, feedback: 'Hips not fully visible', formAlert: true, keyAngle: null };

    if (this.state === 'UPRIGHT') {
      if (hipAngle <= 120) {
        this.state = 'HINGED';
        this.feedback = 'Good hinge depth. Drive hips forward to stand!';
      }
    } else if (this.state === 'HINGED') {
      if (hipAngle >= 160) {
        if (timestamp - this.lastRepTimestamp > 800) {
          this.reps += 1;
          this.lastRepTimestamp = timestamp;
          this.feedback = `Rep ${this.reps} counted! Squeeze glutes at top.`;
        }
        this.state = 'UPRIGHT';
      }
    }

    return {
      reps: this.reps,
      state: this.state,
      feedback: this.feedback,
      formAlert: false,
      keyAngle: hipAngle,
    };
  }
}

/**
 * 6. Dynamic Cadence & Core Cycle Tracker (Jumping Jacks, High Knees, Mountain Climbers, Calves, Crunches)
 */
export class CadenceTracker {
  constructor(name = 'Movement') {
    this.name = name;
    this.state = 'PHASE_A';
    this.reps = 0;
    this.feedback = `Maintain steady rhythm for ${name}.`;
    this.formAlert = false;
    this.lastRepTimestamp = 0;
  }

  reset() {
    this.state = 'PHASE_A';
    this.reps = 0;
    this.feedback = `Maintain steady rhythm for ${this.name}.`;
    this.formAlert = false;
  }

  process(landmarks, timestamp = Date.now()) {
    if (!landmarks) return { reps: this.reps, state: this.state, feedback: 'Body not detected', formAlert: false, keyAngle: null };

    // Check wrist/ankle or knee elevation cycles
    const leftWrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];
    const rightWrist = landmarks[POSE_LANDMARKS.RIGHT_WRIST];
    const nose = landmarks[POSE_LANDMARKS.NOSE];
    const leftKnee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
    const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];

    const isArmRaised = leftWrist && nose && leftWrist.y < nose.y;
    const isKneeDriven = leftKnee && leftHip && Math.abs(leftKnee.y - leftHip.y) < 0.25;

    const activeTrigger = isArmRaised || isKneeDriven;

    if (this.state === 'PHASE_A') {
      if (activeTrigger) {
        this.state = 'PHASE_B';
      }
    } else if (this.state === 'PHASE_B') {
      if (!activeTrigger) {
        if (timestamp - this.lastRepTimestamp > 450) {
          this.reps += 1;
          this.lastRepTimestamp = timestamp;
          this.feedback = `Cadence Rep ${this.reps} logged! Keep pace.`;
        }
        this.state = 'PHASE_A';
      }
    }

    return {
      reps: this.reps,
      state: this.state,
      feedback: this.feedback,
      formAlert: false,
      keyAngle: null,
    };
  }
}
