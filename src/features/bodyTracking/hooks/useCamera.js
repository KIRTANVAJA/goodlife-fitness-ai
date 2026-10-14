import { useState, useEffect, useRef, useCallback } from 'react';

export const useCamera = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [facingMode, setFacingMode] = useState('user'); // 'user' (front) or 'environment' (rear)

  // Enumerate video input devices
  const updateDeviceList = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices.filter((d) => d.kind === 'videoinput');
      setDevices(videoInputs);
    } catch (err) {
      console.warn('[useCamera] Could not enumerate devices:', err);
    }
  }, []);

  // Stop camera stream safely and release hardware locks
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('[useCamera] Error stopping track:', e);
        }
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraActive(false);
    setCameraLoading(false);
    console.log('[useCamera] Camera stream stopped and hardware tracks released');
  }, []);

  // Start camera stream
  const startCamera = useCallback(async (customDeviceId = null, customFacing = null) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access is not supported by this browser. Please use Chrome, Edge, Safari, or Firefox.');
      return false;
    }

    // Stop any existing stream before starting a new one
    stopCamera();

    setCameraLoading(true);
    setCameraError(null);

    const targetFacing = customFacing || facingMode;
    const targetDevice = customDeviceId || selectedDeviceId;

    const constraints = {
      audio: false,
      video: targetDevice
        ? { deviceId: { exact: targetDevice }, width: { ideal: 1280 }, height: { ideal: 720 } }
        : { facingMode: targetFacing, width: { ideal: 1280 }, height: { ideal: 720 } },
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for metadata to resolve dimensions
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().then(resolve).catch(resolve);
          };
        });
      }

      setIsCameraActive(true);
      setCameraLoading(false);
      await updateDeviceList();
      return true;
    } catch (err) {
      console.error('[useCamera] getUserMedia failed:', err);
      let errorMsg = 'Failed to access camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Camera permission was denied. Please allow camera permissions in your browser address bar.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No camera device found on this computer/device.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = 'Camera is currently in use by another application or tab.';
      } else if (err.name === 'OverconstrainedError') {
        errorMsg = 'Camera does not satisfy resolution requirements. Trying standard defaults...';
      }
      setCameraError(errorMsg);
      setCameraLoading(false);
      setIsCameraActive(false);
      return false;
    }
  }, [facingMode, selectedDeviceId, stopCamera, updateDeviceList]);

  // Toggle between front and rear cameras
  const toggleFacingMode = useCallback(() => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    if (isCameraActive) {
      startCamera(null, nextMode);
    }
  }, [facingMode, isCameraActive, startCamera]);

  // Handle device change
  const selectDevice = useCallback((deviceId) => {
    setSelectedDeviceId(deviceId);
    if (isCameraActive) {
      startCamera(deviceId);
    }
  }, [isCameraActive, startCamera]);

  // Automatically release stream when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Listen for device changes (e.g. plugging/unplugging webcam)
  useEffect(() => {
    if (navigator.mediaDevices?.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', updateDeviceList);
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', updateDeviceList);
      };
    }
  }, [updateDeviceList]);

  return {
    videoRef,
    isCameraActive,
    cameraLoading,
    cameraError,
    devices,
    selectedDeviceId,
    facingMode,
    startCamera,
    stopCamera,
    toggleFacingMode,
    selectDevice,
  };
};
