/**
 * Biomechanical vector mathematics and MediaPipe Pose Landmark utilities.
 */

export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
};

export const POSE_CONNECTIONS = [
  // Torso
  [11, 12], [12, 24], [24, 23], [23, 11],
  // Left Arm
  [11, 13], [13, 15],
  // Right Arm
  [12, 14], [14, 16],
  // Left Leg
  [23, 25], [25, 27], [27, 29], [29, 31],
  // Right Leg
  [24, 26], [26, 28], [28, 30], [30, 32],
];

/**
 * Resolves a landmark index from a name or index number
 */
export const resolveLandmarkIndex = (identifier) => {
  if (typeof identifier === 'number') return identifier;
  const upper = identifier.toUpperCase().replace(/-/g, '_');
  return POSE_LANDMARKS[upper] !== undefined ? POSE_LANDMARKS[upper] : null;
};

/**
 * Checks if a landmark exists and meets confidence/visibility threshold
 */
export const isLandmarkVisible = (lm, minConfidence = 0.5) => {
  if (!lm) return false;
  const vis = lm.visibility !== undefined ? lm.visibility : (lm.presence !== undefined ? lm.presence : 1.0);
  return vis >= minConfidence;
};

/**
 * Evaluates visibility for a set of required landmarks
 */
export const checkLandmarksVisibility = (landmarks, requiredIdentifiers = [], minConfidence = 0.45) => {
  if (!landmarks || landmarks.length === 0) {
    return { allVisible: false, missingLandmarks: requiredIdentifiers, visibilityRatio: 0 };
  }

  const missing = [];
  let visibleCount = 0;

  for (const id of requiredIdentifiers) {
    const idx = resolveLandmarkIndex(id);
    if (idx === null || !landmarks[idx] || !isLandmarkVisible(landmarks[idx], minConfidence)) {
      missing.push(id);
    } else {
      visibleCount++;
    }
  }

  return {
    allVisible: missing.length === 0,
    missingLandmarks: missing,
    visibilityRatio: requiredIdentifiers.length > 0 ? visibleCount / requiredIdentifiers.length : 1,
  };
};

/**
 * Calculates the interior angle (in degrees) at vertex B formed by points A, B, and C.
 * Uses the dot product of vectors BA and BC:
 * angle = arccos( (BA . BC) / (|BA| * |BC|) ) * (180 / PI)
 * Handles missing points, zero lengths, and precision clamping to safely avoid NaN or Infinity.
 */
export const calculateAngle = (pointA, pointB, pointC) => {
  if (!pointA || !pointB || !pointC) return null;

  // Vector BA: A - B
  const baX = pointA.x - pointB.x;
  const baY = pointA.y - pointB.y;

  // Vector BC: C - B
  const bcX = pointC.x - pointB.x;
  const bcY = pointC.y - pointB.y;

  const dot = baX * bcX + baY * bcY;
  const magBA = Math.sqrt(baX * baX + baY * baY);
  const magBC = Math.sqrt(bcX * bcX + bcY * bcY);

  if (magBA < 1e-7 || magBC < 1e-7) {
    return null; // Prevent zero division
  }

  // Numerical precision clamp
  const cosTheta = Math.max(-1.0, Math.min(1.0, dot / (magBA * magBC)));
  const angleRad = Math.acos(cosTheta);
  const angleDeg = (angleRad * 180) / Math.PI;

  return Math.round(angleDeg * 10) / 10;
};

/**
 * Calculates angle between 3 landmarks identified by index or name.
 */
export const calculateAngleBetweenLandmarks = (landmarks, idA, idB, idC, minConfidence = 0.4) => {
  if (!landmarks) return null;

  const idxA = resolveLandmarkIndex(idA);
  const idxB = resolveLandmarkIndex(idB);
  const idxC = resolveLandmarkIndex(idC);

  if (idxA === null || idxB === null || idxC === null) return null;

  const pA = landmarks[idxA];
  const pB = landmarks[idxB];
  const pC = landmarks[idxC];

  if (!isLandmarkVisible(pA, minConfidence) ||
      !isLandmarkVisible(pB, minConfidence) ||
      !isLandmarkVisible(pC, minConfidence)) {
    return null;
  }

  return calculateAngle(pA, pB, pC);
};

/**
 * Determines whether the user's primary body frame is in view
 */
export const isBodyInFrame = (landmarks, minConfidence = 0.45) => {
  if (!landmarks || landmarks.length < 33) return false;

  // Core indicators: at least one shoulder, one hip, and one knee or ankle
  const leftShoulderVis = isLandmarkVisible(landmarks[POSE_LANDMARKS.LEFT_SHOULDER], minConfidence);
  const rightShoulderVis = isLandmarkVisible(landmarks[POSE_LANDMARKS.RIGHT_SHOULDER], minConfidence);
  const leftHipVis = isLandmarkVisible(landmarks[POSE_LANDMARKS.LEFT_HIP], minConfidence);
  const rightHipVis = isLandmarkVisible(landmarks[POSE_LANDMARKS.RIGHT_HIP], minConfidence);
  const leftKneeVis = isLandmarkVisible(landmarks[POSE_LANDMARKS.LEFT_KNEE], minConfidence);
  const rightKneeVis = isLandmarkVisible(landmarks[POSE_LANDMARKS.RIGHT_KNEE], minConfidence);

  const shouldersOk = leftShoulderVis || rightShoulderVis;
  const hipsOk = leftHipVis || rightHipVis;
  const kneesOk = leftKneeVis || rightKneeVis;

  return shouldersOk && hipsOk && kneesOk;
};
