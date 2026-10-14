import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

let poseLandmarkerInstance = null;
let initializationPromise = null;

const WASM_CDN_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm';
const MODEL_ASSET_URL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';

/**
 * Initializes and caches the MediaPipe PoseLandmarker instance.
 * Reuses the singleton to prevent redundant WASM reloads.
 */
export const getPoseLandmarker = async () => {
  if (poseLandmarkerInstance) {
    return poseLandmarkerInstance;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      console.log('[PoseService] Initializing MediaPipe FilesetResolver from official CDN...');
      const vision = await FilesetResolver.forVisionTasks(WASM_CDN_URL);

      console.log('[PoseService] Creating PoseLandmarker from official task model...');
      try {
        // Try GPU acceleration first
        poseLandmarkerInstance = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_ASSET_URL,
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        console.log('[PoseService] PoseLandmarker initialized with GPU delegate');
      } catch (gpuError) {
        console.warn('[PoseService] GPU delegate failed, falling back to CPU:', gpuError.message);
        poseLandmarkerInstance = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_ASSET_URL,
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        console.log('[PoseService] PoseLandmarker initialized with CPU delegate');
      }

      return poseLandmarkerInstance;
    } catch (error) {
      console.error('[PoseService] Failed to initialize MediaPipe PoseLandmarker:', error);
      initializationPromise = null;
      throw new Error(`MediaPipe Pose model initialization failed: ${error.message}`);
    }
  })();

  return initializationPromise;
};

/**
 * Releases resources when no longer needed
 */
export const disposePoseLandmarker = () => {
  if (poseLandmarkerInstance) {
    try {
      poseLandmarkerInstance.close();
    } catch (e) {
      console.warn('[PoseService] Error closing poseLandmarker:', e);
    }
    poseLandmarkerInstance = null;
    initializationPromise = null;
    console.log('[PoseService] PoseLandmarker disposed');
  }
};
