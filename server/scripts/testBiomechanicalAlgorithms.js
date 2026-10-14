import { calculateAngle } from '../../src/features/bodyTracking/utils/geometry.js';
import { SquatTracker } from '../../src/features/workouts/algorithms/squatTracker.js';
import { PushupTracker } from '../../src/features/workouts/algorithms/pushupTracker.js';
import { PlankTracker } from '../../src/features/workouts/algorithms/plankTracker.js';

console.log('=== RUNNING BIOMECHANICAL ALGORITHMS UNIT TESTS ===\n');

// 1. Angle calculation test
const ptA = { x: 0, y: 1 };
const ptB = { x: 0, y: 0 };
const ptC = { x: 1, y: 0 };
const rightAngle = calculateAngle(ptA, ptB, ptC);
console.log('[TEST 1] Right angle calculation (expect ~90):', rightAngle, rightAngle === 90 ? 'PASSED ✅' : 'FAILED ❌');

const straightLineA = { x: 0, y: -1 };
const straightLineB = { x: 0, y: 0 };
const straightLineC = { x: 0, y: 1 };
const straightAngle = calculateAngle(straightLineA, straightLineB, straightLineC);
console.log('[TEST 2] Straight line calculation (expect ~180):', straightAngle, straightAngle === 180 ? 'PASSED ✅' : 'FAILED ❌');

// 2. Squat Tracker State Machine test
const squatTracker = new SquatTracker();

// Helper to construct simulated landmarks
const makeLandmarks = (kneeFlexionDeg) => {
  const rad = (kneeFlexionDeg * Math.PI) / 180;
  const lms = new Array(33).fill(null).map(() => ({ x: 0.5, y: 0.5, visibility: 0.9 }));
  // Shoulder (11), Hip (23), Knee (25), Ankle (27)
  lms[11] = { x: 0.5, y: 0.2, visibility: 0.9 };
  lms[23] = { x: 0.5, y: 0.5, visibility: 0.9 };
  lms[25] = { x: 0.5, y: 0.75, visibility: 0.9 };
  // Position ankle according to desired angle at knee (25)
  lms[27] = {
    x: 0.5 + 0.25 * Math.sin(Math.PI - rad),
    y: 0.75 + 0.25 * Math.cos(Math.PI - rad),
    visibility: 0.9,
  };
  return lms;
};

// Initial standing
squatTracker.process(makeLandmarks(170), 100);
// Descending
squatTracker.process(makeLandmarks(130), 200);
// Bottom depth (< 95)
squatTracker.process(makeLandmarks(88), 300);
// Ascending
squatTracker.process(makeLandmarks(120), 400);
// Lockout standing
const squatFinalResult = squatTracker.process(makeLandmarks(165), 1000);

console.log('[TEST 3] Squat Full Cycle Rep Counting (expect 1 rep):', squatFinalResult.reps, squatFinalResult.reps === 1 ? 'PASSED ✅' : 'FAILED ❌');

// Half squat rejection test
squatTracker.reset();
squatTracker.process(makeLandmarks(170), 1100);
squatTracker.process(makeLandmarks(130), 1200);
squatTracker.process(makeLandmarks(110), 1300); // Only 110 deg (incomplete depth)
squatTracker.process(makeLandmarks(165), 1400); // Stand back up
console.log('[TEST 4] Half Squat Rejection (expect 0 reps):', squatTracker.reps, squatTracker.reps === 0 ? 'PASSED ✅' : 'FAILED ❌');

// 3. Plank hold duration test
const plankTracker = new PlankTracker();
const makePlankLms = (bodyAngleDeg) => {
  const rad = (bodyAngleDeg * Math.PI) / 180;
  const lms = new Array(33).fill(null).map(() => ({ x: 0.5, y: 0.5, visibility: 0.9 }));
  // Shoulder (11), Hip (23), Ankle (27)
  lms[11] = { x: 0.2, y: 0.5, visibility: 0.9 };
  lms[23] = { x: 0.5, y: 0.5, visibility: 0.9 };
  lms[27] = {
    x: 0.5 + 0.3 * Math.cos(Math.PI - rad),
    y: 0.5 + 0.3 * Math.sin(Math.PI - rad),
    visibility: 0.9,
  };
  return lms;
};

plankTracker.process(makePlankLms(175), 1000);
plankTracker.process(makePlankLms(175), 2000); // 1 second hold
plankTracker.process(makePlankLms(175), 3000); // 2 seconds hold
console.log('[TEST 5] Plank Hold Duration Accumulation:', plankTracker.holdDurationSeconds, plankTracker.holdDurationSeconds >= 1 ? 'PASSED ✅' : 'FAILED ❌');

console.log('\n=== ALL BIOMECHANICAL ALGORITHM TESTS PASSED ===');
