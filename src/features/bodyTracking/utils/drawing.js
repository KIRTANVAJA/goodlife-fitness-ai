import { POSE_CONNECTIONS, isLandmarkVisible, resolveLandmarkIndex } from './geometry.js';

/**
 * Draws the futuristic skeleton overlay and joint nodes on an HTML5 Canvas.
 * Supports mirrored camera feed and custom active joint highlights.
 */
export const drawSkeleton = ({
  ctx,
  landmarks,
  width,
  height,
  mirrored = true,
  activeJointIndices = [],
  formCorrectionActive = false,
}) => {
  if (!ctx || !landmarks || landmarks.length === 0) return;

  ctx.save();

  // Clear previous frame
  ctx.clearRect(0, 0, width, height);

  // Styling tokens (Light Futuristic Good Life Fitness palette)
  const boneColorNormal = 'rgba(16, 185, 129, 0.75)'; // Emerald futuristic
  const boneColorAlert = 'rgba(239, 68, 68, 0.85)'; // Coral red on alert
  const boneWidth = 3.5;

  const jointFill = '#FFFFFF';
  const jointStrokeNormal = '#10B981'; // Emerald
  const jointStrokeAlert = '#EF4444'; // Red
  const activeHaloColor = formCorrectionActive ? 'rgba(239, 68, 68, 0.45)' : 'rgba(212, 175, 55, 0.5)'; // Gold glow

  // Map landmarks to canvas coordinates (accounting for mirroring)
  const toCanvasCoords = (lm) => {
    const rawX = lm.x * width;
    const x = mirrored ? width - rawX : rawX;
    const y = lm.y * height;
    return { x, y };
  };

  // 1. Draw Skeleton Connectors (Bones)
  ctx.lineWidth = boneWidth;
  ctx.lineCap = 'round';
  ctx.strokeStyle = formCorrectionActive ? boneColorAlert : boneColorNormal;

  for (const [startIdx, endIdx] of POSE_CONNECTIONS) {
    const startLm = landmarks[startIdx];
    const endLm = landmarks[endIdx];

    if (isLandmarkVisible(startLm, 0.4) && isLandmarkVisible(endLm, 0.4)) {
      const p1 = toCanvasCoords(startLm);
      const p2 = toCanvasCoords(endLm);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }

  // Convert active joint names or indices to resolved set
  const activeSet = new Set(
    activeJointIndices
      .map((id) => resolveLandmarkIndex(id))
      .filter((idx) => idx !== null)
  );

  // 2. Draw Landmark Nodes (Joints)
  for (let i = 0; i < landmarks.length; i++) {
    const lm = landmarks[i];
    if (!isLandmarkVisible(lm, 0.45)) continue;

    // Skip detailed facial landmarks for cleaner fitness silhouette (keep nose at 0)
    if (i > 0 && i < 11) continue;

    const pt = toCanvasCoords(lm);
    const isActive = activeSet.has(i);

    // Active joint pulse halo
    if (isActive) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 11, 0, 2 * Math.PI);
      ctx.fillStyle = activeHaloColor;
      ctx.fill();
    }

    // Joint core circle
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, isActive ? 6 : 4, 0, 2 * Math.PI);
    ctx.fillStyle = jointFill;
    ctx.fill();

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = formCorrectionActive && isActive ? jointStrokeAlert : (isActive ? '#D4AF37' : jointStrokeNormal);
    ctx.stroke();
  }

  ctx.restore();
};
