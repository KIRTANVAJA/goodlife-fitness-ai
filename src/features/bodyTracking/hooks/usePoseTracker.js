import { useState, useEffect, useRef, useCallback } from 'react';
import { getPoseLandmarker } from '../services/poseLandmarkerService';
import { drawSkeleton } from '../utils/drawing';
import { isBodyInFrame } from '../utils/geometry';

export const usePoseTracker = ({
  videoRef,
  isCameraActive,
  onFrameUpdate = null, // Callback with (landmarks, timestamp)
  activeJointIndices = [],
  formCorrectionActive = false,
  targetFps = 30,
}) => {
  const canvasRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const isProcessingFrame = useRef(false);
  const lastVideoTimeRef = useRef(-1);
  const lastProcessedTimestampRef = useRef(0);

  const [modelState, setModelState] = useState('idle'); // 'idle' | 'loading' | 'ready' | 'error'
  const [modelError, setModelError] = useState(null);
  const [trackingStatus, setTrackingStatus] = useState('waiting_for_camera');
  // 'waiting_for_camera' | 'loading_model' | 'position_body' | 'tracking' | 'low_confidence' | 'stopped'
  const [detectedLandmarks, setDetectedLandmarks] = useState(null);
  const [trackingConfidence, setTrackingConfidence] = useState(0);

  // Initialize PoseLandmarker once
  useEffect(() => {
    let isMounted = true;

    const initModel = async () => {
      setModelState('loading');
      setTrackingStatus('loading_model');
      try {
        const landmarker = await getPoseLandmarker();
        if (isMounted) {
          landmarkerRef.current = landmarker;
          setModelState('ready');
          setTrackingStatus(isCameraActive ? 'position_body' : 'waiting_for_camera');
        }
      } catch (err) {
        if (isMounted) {
          setModelState('error');
          setModelError(err.message);
          setTrackingStatus('error');
        }
      }
    };

    initModel();

    return () => {
      isMounted = false;
    };
  }, [isCameraActive]);

  // Main pose estimation frame loop
  const processFrame = useCallback(() => {
    if (!isCameraActive || !videoRef.current || !canvasRef.current || !landmarkerRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = landmarkerRef.current;

    // Verify video stream is actively playing and has dimensions
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      animFrameIdRef.current = requestAnimationFrame(processFrame);
      return;
    }

    // Adjust canvas resolution to match video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    const now = performance.now();
    const frameInterval = 1000 / targetFps;

    // Check FPS throttling and prevent overlapping frame detection
    if (now - lastProcessedTimestampRef.current >= frameInterval && !isProcessingFrame.current) {
      isProcessingFrame.current = true;
      lastProcessedTimestampRef.current = now;

      try {
        // Run MediaPipe PoseLandmarker detection on current video frame
        const result = landmarker.detectForVideo(video, now);

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        if (result && result.landmarks && result.landmarks.length > 0) {
          const landmarks = result.landmarks[0]; // First detected person

          // Check if key body parts are in frame
          const inFrame = isBodyInFrame(landmarks, 0.45);

          if (!inFrame) {
            setTrackingStatus('position_body');
          } else {
            setTrackingStatus('tracking');
          }

          // Compute average confidence
          let confSum = 0;
          landmarks.forEach((lm) => {
            confSum += lm.visibility !== undefined ? lm.visibility : (lm.presence || 0.8);
          });
          const avgConfidence = Math.round((confSum / landmarks.length) * 100);
          setTrackingConfidence(avgConfidence);

          // Draw skeleton on canvas
          drawSkeleton({
            ctx,
            landmarks,
            width,
            height,
            mirrored: true,
            activeJointIndices,
            formCorrectionActive,
          });

          // Update latest detected landmarks
          setDetectedLandmarks(landmarks);

          // Forward to workout exercise state machine
          if (onFrameUpdate) {
            onFrameUpdate(landmarks, now);
          }
        } else {
          // No person detected in frame
          setTrackingStatus('position_body');
          setDetectedLandmarks(null);
          setTrackingConfidence(0);
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, width, height);
        }
      } catch (detectErr) {
        console.warn('[usePoseTracker] Error during frame detection:', detectErr);
      } finally {
        isProcessingFrame.current = false;
      }
    }

    animFrameIdRef.current = requestAnimationFrame(processFrame);
  }, [
    isCameraActive,
    videoRef,
    targetFps,
    activeJointIndices,
    formCorrectionActive,
    onFrameUpdate,
  ]);

  // Start / stop loop based on camera and page visibility
  useEffect(() => {
    if (isCameraActive && modelState === 'ready') {
      animFrameIdRef.current = requestAnimationFrame(processFrame);
    } else {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      setTrackingStatus(isCameraActive ? 'position_body' : 'stopped');
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animFrameIdRef.current) {
          cancelAnimationFrame(animFrameIdRef.current);
          animFrameIdRef.current = null;
        }
      } else if (isCameraActive && modelState === 'ready') {
        animFrameIdRef.current = requestAnimationFrame(processFrame);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [isCameraActive, modelState, processFrame]);

  return {
    canvasRef,
    modelState,
    modelError,
    trackingStatus,
    detectedLandmarks,
    trackingConfidence,
  };
};
