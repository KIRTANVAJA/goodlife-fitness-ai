import {
  calculateAngleBetweenLandmarks,
  POSE_LANDMARKS,
} from '../../bodyTracking/utils/geometry.js';

export class PlankTracker {
  constructor() {
    this.holdDurationSeconds = 0;
    this.state = 'NOT_HOLDING'; // 'HOLDING' | 'NOT_HOLDING'
    this.feedback = 'Assume forearm plank position in profile view.';
    this.formAlert = false;
    this.lastTimestamp = 0;
    this.formEvents = [];
  }

  reset() {
    this.holdDurationSeconds = 0;
    this.state = 'NOT_HOLDING';
    this.feedback = 'Assume forearm plank position in profile view.';
    this.formAlert = false;
    this.lastTimestamp = 0;
    this.formEvents = [];
  }

  process(landmarks, timestamp) {
    if (!landmarks) {
      return {
        holdDurationSeconds: Math.floor(this.holdDurationSeconds),
        state: this.state,
        feedback: 'Position full body in side profile in frame',
        formAlert: false,
        keyAngle: null,
      };
    }

    const leftShoulderVis = landmarks[POSE_LANDMARKS.LEFT_SHOULDER]?.visibility || 0;
    const rightShoulderVis = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER]?.visibility || 0;
    const isLeftSide = leftShoulderVis >= rightShoulderVis;

    const shoulder = isLeftSide ? POSE_LANDMARKS.LEFT_SHOULDER : POSE_LANDMARKS.RIGHT_SHOULDER;
    const hip = isLeftSide ? POSE_LANDMARKS.LEFT_HIP : POSE_LANDMARKS.RIGHT_HIP;
    const ankle = isLeftSide ? POSE_LANDMARKS.LEFT_ANKLE : POSE_LANDMARKS.RIGHT_ANKLE;

    const bodyLineAngle = calculateAngleBetweenLandmarks(landmarks, shoulder, hip, ankle);

    if (bodyLineAngle === null) {
      this.lastTimestamp = timestamp;
      return {
        holdDurationSeconds: Math.floor(this.holdDurationSeconds),
        state: 'NOT_HOLDING',
        feedback: 'Body not fully detected. Step back to show shoulders, hips, and feet.',
        formAlert: true,
        keyAngle: null,
      };
    }

    let feedback = 'Hold solid! Core engaged and glutes squeezed.';
    let formAlert = false;
    let isValidPosture = false;

    // Check posture alignment (ideal is ~170 - 185)
    if (bodyLineAngle < 155) {
      feedback = 'Hips are sagging! Squeeze abs and pull hips level.';
      formAlert = true;
      this.formEvents.push('Plank hip sag detected');
    } else if (bodyLineAngle > 200) {
      feedback = 'Hips too high! Lower hips to form a straight line.';
      formAlert = true;
      this.formEvents.push('Plank hip pike detected');
    } else {
      isValidPosture = true;
      feedback = `Solid hold! ${Math.floor(this.holdDurationSeconds)}s recorded. Keep steady.`;
    }

    if (isValidPosture) {
      this.state = 'HOLDING';
      if (this.lastTimestamp > 0) {
        const deltaSeconds = (timestamp - this.lastTimestamp) / 1000;
        // Cap max delta in case of tab lag (max 1.5s increment per frame)
        if (deltaSeconds > 0 && deltaSeconds < 1.5) {
          this.holdDurationSeconds += deltaSeconds;
        }
      }
    } else {
      this.state = 'NOT_HOLDING';
    }

    this.lastTimestamp = timestamp;
    this.feedback = feedback;
    this.formAlert = formAlert;

    return {
      holdDurationSeconds: Math.floor(this.holdDurationSeconds),
      state: this.state,
      feedback,
      formAlert,
      keyAngle: bodyLineAngle,
      activeJoints: [shoulder, hip, ankle],
    };
  }
}
