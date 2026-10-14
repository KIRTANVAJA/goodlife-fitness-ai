import React, { useEffect, useRef, useContext } from 'react';
import { ContentContext } from '../context/ContentContext';
import BloomFieldBackground from './BloomFieldBackground';

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

    const intensityConfig = {
      none: { countMult: 0, speedMult: 0 },
      calm: { countMult: 0.5, speedMult: 0.5 },
      cinematic: { countMult: 1.0, speedMult: 1.0 },
      active: { countMult: 1.6, speedMult: 1.8 }
    };
    
    const config = intensityConfig[animationIntensity] || intensityConfig.cinematic;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() * 0.4 - 0.2) * config.speedMult;
        this.speedY = (Math.random() * -0.5 - 0.1) * config.speedMult;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.pulseSpeed = (Math.random() * 0.02 + 0.005) * config.speedMult;
        this.pulseDir = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        if (config.speedMult === 0) return;
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y < 0) {
          this.y = canvas.height;
          this.x = Math.random() * canvas.width;
        }
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX;
        }

        this.opacity += this.pulseSpeed * this.pulseDir;
        if (this.opacity > 0.6 || this.opacity < 0.1) {
          this.pulseDir = -this.pulseDir;
        }
      }

      draw() {
        if (config.countMult === 0) return;
        const particleColor = `rgba(198, 166, 107, ${this.opacity * 0.7})`; // Champagne Gold dust
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      const baseCount = Math.min(Math.floor(canvas.width / 35), 45);
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

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 21st.dev "Almoayyed" Bloom Field Mesh Gradient with Parallax Motion */}
      <BloomFieldBackground theme={theme} />

      {/* HTML5 Subtle Starlight & Gold Dust Particles */}
      {animationIntensity !== 'none' && (
        <canvas ref={canvasRef} className="absolute inset-0 opacity-40 z-10" />
      )}
    </div>
  );
};

export default BackgroundEffects;
