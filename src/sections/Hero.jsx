import React, { useEffect, useState, useContext } from 'react';
import { ShieldCheck, Play, Camera, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ContentContext } from '../context/ContentContext';

const StatCounter = ({ endValue, label, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const duration = 1800;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * endValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [endValue]);

  return (
    <div>
      <h3 className="text-3xl lg:text-4xl font-extrabold font-display text-[#171916] dark:text-[#F5F1E8] tracking-tight">
        {count}
        <span className="text-[#C6A66B]">{suffix}</span>
      </h3>
      <p className="text-[10px] uppercase tracking-[0.16em] text-[#85877F] dark:text-[#A8AAA3] mt-1 font-semibold">
        {label}
      </p>
    </div>
  );
};

const Hero = () => {
  const { content } = useContext(ContentContext);
  const navigate = useNavigate();

  const handleScrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 overflow-hidden bg-[#F5F1E8] dark:bg-[#171916] transition-colors"
    >
      {/* Subtle Atmospheric Lighting & Luxury Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[70vw] h-[40vh] bg-[#173F35]/5 dark:bg-[#173F35]/15 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[30vw] h-[30vh] bg-[#C6A66B]/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Editorial Headline & Actions */}
        <div className="lg:col-span-8 text-center lg:text-left space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#173F35]/10 dark:bg-[#173F35]/25 border border-[#173F35]/20 dark:border-[#26745A]/40 px-3.5 py-1.5 rounded-full"
          >
            <ShieldCheck size={14} className="text-[#173F35] dark:text-[#C6A66B]" />
            <span className="text-[10px] md:text-xs font-bold text-[#173F35] dark:text-[#F5F1E8] uppercase tracking-[0.2em]">
              India's Premier Luxury Fitness Sanctuary
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display leading-[1.02] tracking-tight uppercase text-[#171916] dark:text-[#F5F1E8]">
              Where Human Athleticism <br />
              <span className="text-[#173F35] dark:text-[#C6A66B] font-editorial italic font-normal tracking-normal lowercase text-5xl sm:text-7xl lg:text-8xl pr-2">
                meets
              </span>
              Vision Precision
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-[#85877F] dark:text-[#A8AAA3] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Step into an exclusive sanctuary engineered for elite performance. Experience computer vision pose estimation, biomechanically calibrated resistance lines, and clinical nutrition blueprints.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <button
              onClick={() => navigate('/exercises')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#173F35] hover:bg-[#1F5144] text-[#F5F1E8] font-bold text-xs uppercase tracking-[0.16em] transition-all shadow-md shadow-[#173F35]/20 flex items-center justify-center gap-2 group"
            >
              <Camera size={14} className="text-[#C6A66B]" />
              <span>Launch AI Studio</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleScrollToSection('pricing')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#1E211D] hover:bg-[#FAF8F3] dark:hover:bg-[#262924] text-[#171916] dark:text-[#F5F1E8] border border-[#E5E1D7] dark:border-[#2E322C] font-semibold text-xs uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Explore Memberships</span>
            </button>
          </motion.div>
        </div>

        {/* Right Column: Refined Club Legacy Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="lg:col-span-4 bg-[#FFFFFF] dark:bg-[#1E211D] p-7 rounded-3xl border border-[#E5E1D7] dark:border-[#2E322C] shadow-sm relative flex flex-col justify-between h-[380px]"
        >
          {/* Subtle top badge */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C6A66B]">
                The Sanctuary Standard
              </span>
              <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-[#26745A]">
                <span className="w-2 h-2 rounded-full bg-[#26745A] animate-pulse" />
                Active Telemetry
              </span>
            </div>
            <h2 className="text-xl font-bold font-display uppercase tracking-tight text-[#171916] dark:text-[#F5F1E8] mt-2">
              Beyond Ordinary Gyms. <br />Private Performance.
            </h2>
          </div>

          {/* Metric Scanners */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-5 my-auto">
            <StatCounter endValue={24} label="Biomechanical Movements" suffix="+" />
            <StatCounter endValue={30} label="Frames Per Second Telemetry" suffix=" FPS" />
            <StatCounter endValue={100} label="Client-Side Camera Privacy" suffix="%" />
          </div>

          {/* Footer location pill */}
          <div className="border-t border-[#E5E1D7] dark:border-[#2E322C] pt-3.5 flex items-center justify-between text-[11px] text-[#85877F] dark:text-[#A8AAA3] font-medium">
            <span>Mumbai &bull; Bangalore</span>
            <span className="text-[#173F35] dark:text-[#C6A66B] font-semibold">Concierge 24/7</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
