import React, { useEffect, useRef, useContext } from 'react';
import { ContentContext } from '../context/ContentContext';

const BackgroundEffects = ({ theme }) => {
  const canvasRef = useRef(null);
  const { content } = useContext(ContentContext);
  const animationIntensity = content?.themeSettings?.animationIntensity || 'cinematic';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Map animationIntensity config parameters
    const intensityConfig = {
      none: { countMult: 0, speedMult: 0 },
      calm: { countMult: 0.5, speedMult: 0.5 },
      cinematic: { countMult: 1.0, speedMult: 1.0 },
      active: { countMult: 1.6, speedMult: 1.8 }
    };
    
    const config = intensityConfig[animationIntensity] || intensityConfig.cinematic;

    // Theme-specific particle properties
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() * 0.4 - 0.2) * config.speedMult;
        this.speedY = (Math.random() * -0.5 - 0.1) * config.speedMult; // Float upwards
        this.opacity = Math.random() * 0.5 + 0.1;
        this.pulseSpeed = (Math.random() * 0.02 + 0.005) * config.speedMult;
        this.pulseDir = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        if (config.speedMult === 0) return;
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset if they float off screen
        if (this.y < 0) {
          this.y = canvas.height;
          this.x = Math.random() * canvas.width;
        }
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX;
        }

        // Opacity pulsing
        this.opacity += this.pulseSpeed * this.pulseDir;
        if (this.opacity > 0.7 || this.opacity < 0.1) {
          this.pulseDir = -this.pulseDir;
        }
      }

      draw() {
        if (config.countMult === 0) return;
        const particleColor = theme === 'dark'
          ? `rgba(229, 231, 235, ${this.opacity})` // Silver
          : `rgba(212, 175, 55, ${this.opacity})`;  // Gold
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      const baseCount = Math.min(Math.floor(canvas.width / 25), 60);
      const count = Math.floor(baseCount * config.countMult);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    initParticles();

    const animate = () => {
      if (animationIntensity === 'none') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, animationIntensity]);

  const getFlareStyle = (baseSeconds, delaySeconds = 0) => {
    if (animationIntensity === 'none') {
      return { animation: 'none' };
    }
    const speedMultMap = {
      calm: 2,
      cinematic: 1,
      active: 0.5
    };
    const mult = speedMultMap[animationIntensity] || 1;
    const duration = baseSeconds * mult;
    const delay = delaySeconds * mult;
    return {
      animation: `pulse-glow ${duration}s ease-in-out infinite ${delay ? `${delay}s` : ''}`
    };
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-transparent">
      {/* HTML5 Canvas for Floating Particles */}
      {animationIntensity !== 'none' && (
        <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />
      )}

      {/* Cinematic Ambient Radial Lights */}
      {/* Top Left Flare */}
      <div 
        className="light-flare bg-gym-gold-dark/40 dark:bg-gym-silver-dark/20 w-[40vw] h-[40vw] -left-[10vw] -top-[10vw] transition-colors duration-1000"
        style={getFlareStyle(8)}
      />
      
      {/* Center Right Flare */}
      <div 
        className="light-flare bg-gym-gold/30 dark:bg-gym-silver/10 w-[35vw] h-[35vw] -right-[5vw] top-[35vh] transition-colors duration-1000"
        style={getFlareStyle(12, 2)}
      />
      
      {/* Bottom Left Accent Flare */}
      <div 
        className="light-flare bg-gym-gold-deep/30 dark:bg-gym-silver-deep/15 w-[45vw] h-[45vw] -left-[15vw] bottom-[10vh] transition-colors duration-1000"
        style={getFlareStyle(10, 4)}
      />

      {/* Theme adaptive overlay to bind them nicely */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-transparent to-[#FAFAFA] dark:from-[#080808] dark:to-[#080808] opacity-90 transition-all duration-1000" />
    </div>
  );
};

export default BackgroundEffects;
