import React, { useEffect, useRef, useState } from 'react';

/**
 * Good Life Fitness AI — "Almoayyed" Bloom Field Mesh Gradient
 * Recreated from 21st.dev (https://21st.dev/community/gradients)
 * 
 * Architecture & Mathematics:
 * - Style: Bloom Field. Mesh gradient of layered radial blobs anchored at individual focal points
 * - Animation: Driven by requestAnimationFrame loop with continuous elapsed-seconds clock `t`
 * - Exact zero-snap formula at ph=0: (sin(ph * 0.55 + p) - sin(p)) * 14 * amt
 * - Parallax integration: Continuous smooth lerp tracking mouse displacement & page scroll depth
 * - Palette adapted to Good Life Fitness AI luxury aesthetic:
 *   Velvet Forest Emerald (#173F35), Champagne Bronze (#C6A66B), High-Energy Botanical (#26745A),
 *   Smoked Amber (#3D2714), and Pure Champagne Glow (#E5C388).
 */

const GRAIN_SVG = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.22'/></svg>";

export const BloomFieldBackground = ({ theme = 'dark', className = '' }) => {
  const containerRef = useRef(null);
  const layerRef = useRef(null);
  const moveableRef = useRef(null);

  // Parallax target coordinates
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ y: 0, targetY: 0 });

  useEffect(() => {
    let animId;
    const startTime = performance.now();

    // Mouse movement listener for smooth parallax tracking
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      // Normalized between -1 and +1
      mouseRef.current.targetX = (e.clientX / innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      scrollRef.current.targetY = window.scrollY || window.pageYOffset || 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Seed-based static phase offsets (deterministic hash to prevent snapping)
    // 5 blobs configuration
    const blobs = [
      {
        id: 'blob_mauve_emerald',
        baseX: 66.94,
        baseY: 46.43,
        radius: 76.1,
        p: 1.428,
        p2: 3.194,
        darkColor: { r: 23, g: 63, b: 53, a: 0.90 },      // #173F35 (Deep Velvet Emerald)
        lightColor: { r: 215, g: 213, b: 213, a: 0.85 }, // #D7D5D5 (Mauve / Pearl)
        parallaxWeight: 1.2
      },
      {
        id: 'blob_midnight_bronze',
        baseX: 34.69,
        baseY: 66.31,
        radius: 50.9,
        p: 4.812,
        p2: 0.923,
        darkColor: { r: 198, g: 166, b: 107, a: 0.70 },   // #C6A66B (Champagne Bronze)
        lightColor: { r: 49, g: 5, b: 39, a: 0.35 },     // #310527 (Midnight)
        parallaxWeight: -1.5
      },
      {
        id: 'blob_charcoal_botanical',
        baseX: 48.93,
        baseY: 19.32,
        radius: 67.0,
        p: 2.745,
        p2: 5.109,
        darkColor: { r: 38, g: 116, b: 90, a: 0.75 },    // #26745A (Luminous Botanical)
        lightColor: { r: 57, g: 5, b: 31, a: 0.45 },     // #39051F (Charcoal Crimson)
        parallaxWeight: 0.9
      },
      {
        id: 'blob_white_champagne',
        baseX: 80.23,
        baseY: 87.54,
        radius: 41.1,
        p: 5.619,
        p2: 2.371,
        darkColor: { r: 229, g: 195, b: 136, a: 0.45 },  // #E5C388 (Warm Champagne Starlight)
        lightColor: { r: 255, g: 255, b: 255, a: 0.80 }, // #FFFFFF (Pure White)
        parallaxWeight: 1.8
      },
      {
        id: 'blob_ambient_depth',
        baseX: 20.15,
        baseY: 35.80,
        radius: 58.0,
        p: 3.411,
        p2: 4.298,
        darkColor: { r: 61, g: 39, b: 20, a: 0.55 },     // #3D2714 (Smoked Amber Ambient)
        lightColor: { r: 245, g: 241, b: 232, a: 0.60 }, // #F5F1E8 (Alabaster)
        parallaxWeight: -0.8
      }
    ];

    const isDarkMode = theme === 'dark' || document.documentElement.classList.contains('dark');
    const backdrop = isDarkMode ? '#111613' : '#F5F1E8';

    const renderFrame = () => {
      const now = performance.now();
      const t = (now - startTime) / 1000;

      // 21st.dev mathematical constants:
      const ph = t * 1.00;
      const amt = 0.40;

      // Smooth lerp mouse coordinates (prevents jerking)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Smooth lerp scroll
      scrollRef.current.y += (scrollRef.current.targetY - scrollRef.current.y) * 0.08;
      const scrollNorm = (scrollRef.current.y % 2000) / 2000;

      // Build each radial-gradient blob dynamically without quantization
      const radialGradients = blobs.map((blob) => {
        // Continuous modulation (strictly 0 at ph = 0 to prevent start snap)
        const deltaX = (Math.sin(ph * 0.55 + blob.p) - Math.sin(blob.p)) * 14 * amt;
        const deltaY = (Math.sin(ph * 0.43 + blob.p2) - Math.sin(blob.p2)) * 14 * amt;

        // Apply mouse & scroll parallax offset
        const mouseShiftX = mouseRef.current.x * 6 * blob.parallaxWeight;
        const mouseShiftY = mouseRef.current.y * 6 * blob.parallaxWeight;
        const scrollShiftY = Math.sin(scrollNorm * Math.PI * 2 + blob.p) * 8;

        const posX = (blob.baseX + deltaX + mouseShiftX).toFixed(3);
        const posY = (blob.baseY + deltaY + mouseShiftY + scrollShiftY).toFixed(3);

        const col = isDarkMode ? blob.darkColor : blob.lightColor;
        const r = col.r;
        const g = col.g;
        const b = col.b;
        const a = col.a;

        const stop1 = (blob.radius * 0.25).toFixed(2);
        const stop2 = (blob.radius * 0.50).toFixed(2);
        const stop3 = (blob.radius * 0.75).toFixed(2);
        const stop4 = blob.radius.toFixed(2);

        return `radial-gradient(circle at ${posX}% ${posY}%, rgba(${r}, ${g}, ${b}, ${a}) 0%, rgba(${r}, ${g}, ${b}, ${(a * 0.844).toFixed(3)}) ${stop1}%, rgba(${r}, ${g}, ${b}, ${(a * 0.5).toFixed(3)}) ${stop2}%, rgba(${r}, ${g}, ${b}, ${(a * 0.156).toFixed(3)}) ${stop3}%, rgba(${r}, ${g}, ${b}, 0) ${stop4}%)`;
      });

      // Assemble full-bleed CSS layered background
      if (layerRef.current) {
        layerRef.current.style.backgroundColor = backdrop;
        layerRef.current.style.backgroundImage = `url("${GRAIN_SVG}"), ${radialGradients.join(', ')}`;
        layerRef.current.style.backgroundSize = `120px 120px, ${blobs.map(() => 'auto').join(', ')}`;
        layerRef.current.style.backgroundBlendMode = `overlay, ${blobs.map(() => 'normal').join(', ')}`;
      }

      // Moveable Parallax Depth Layer (Content elements floating in 3D parallax)
      if (moveableRef.current) {
        const mx = mouseRef.current.x * 22;
        const my = mouseRef.current.y * 22;
        moveableRef.current.style.transform = `translate3d(${mx.toFixed(2)}px, ${my.toFixed(2)}px, 0)`;
      }

      animId = requestAnimationFrame(renderFrame);
    };

    animId = requestAnimationFrame(renderFrame);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 21st.dev Almoayyed Bloom Field Animated Mesh Canvas Layer */}
      <div
        ref={layerRef}
        className="absolute inset-0 w-full h-full transition-colors duration-700 ease-out"
        style={{
          willChange: 'background-image, background-position',
          transform: 'translateZ(0)',
        }}
      />

      {/* Moveable Parallax Floating Elements Layer */}
      <div
        ref={moveableRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30 dark:opacity-40"
        style={{ willChange: 'transform' }}
      >
        {/* Floating Kinetic Depth Ring 1 */}
        <div
          className="absolute top-[18%] left-[12%] w-72 h-72 rounded-full border border-[#C6A66B]/25 blur-[1px]"
          style={{ transform: 'rotate(25deg)' }}
        />

        {/* Floating Ambient Bio-Grid Ring 2 */}
        <div
          className="absolute bottom-[22%] right-[10%] w-96 h-96 rounded-full border border-[#26745A]/20 blur-[2px]"
          style={{ transform: 'rotate(-15deg)' }}
        />

        {/* Floating Telemetry Coordinates Token */}
        <div className="absolute top-[38%] right-[18%] font-mono text-[9px] tracking-[0.25em] text-[#C6A66B]/40 uppercase select-none">
          GLF // OPTICAL_FIELD_ACTIVE [33_LANDMARKS]
        </div>

        <div className="absolute bottom-[35%] left-[8%] font-mono text-[9px] tracking-[0.25em] text-[#26745A]/35 uppercase select-none">
          BIOMECHANICAL_TELEMETRY_ENGINE // 60FPS
        </div>
      </div>

      {/* Gentle Edge Vignette for Cinematic Focus */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#111613]/40 dark:to-[#0D100E]/70 pointer-events-none" />
    </div>
  );
};

export default BloomFieldBackground;
