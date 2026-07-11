import React, { useEffect, useState, useContext } from 'react';
import { ShieldCheck, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { ContentContext } from '../context/ContentContext';
import { analyticsTracker } from '../utils/analytics';

const StatCounter = ({ endValue, label, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const duration = 2000; // 2 seconds

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
    <div className="text-center md:text-left">
      <h3 className="text-3xl md:text-5xl font-black font-display text-brand-gradient">
        {count}
        {suffix}
      </h3>
      <p className="text-[10px] md:text-xs uppercase tracking-widest text-gym-grey-secondary dark:text-gym-grey-muted mt-1 font-semibold">
        {label}
      </p>
    </div>
  );
};

const Hero = () => {
  const { content } = useContext(ContentContext);
  const { titleLine1, titleLine2, subheading, ctaText, bgImage } = content.hero;
  const contactInfo = content.contact;

  const handleCTA = () => {
    analyticsTracker.track('whatsapp_click', { source: 'Hero Join Now' });
    const text = encodeURIComponent(`Hello Good Life Fitness! I'm interested in joining the gym. Please guide me through the membership registration.`);
    window.open(`https://wa.me/${contactInfo.whatsApp}?text=${text}`, '_blank');
  };

  const handleScrollToNextSection = (id = 'about') => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden"
    >
      {/* Background Cinematic Visual - Day Mode Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center select-none opacity-100 dark:opacity-0 transition-opacity duration-1000"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(250, 250, 250, 0.85) 0%, rgba(250, 250, 250, 0.98) 100%), url('${bgImage}')`,
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Background Cinematic Visual - Night Mode Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center select-none opacity-0 dark:opacity-100 transition-opacity duration-1000"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(8, 8, 8, 0.3) 0%, rgba(8, 8, 8, 0.98) 100%), url('${bgImage}')`,
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Floating Light Beam for depth */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60vw] h-[30vh] bg-gym-gold/5 dark:bg-gym-silver/5 rounded-full filter blur-[100px] pointer-events-none transition-colors duration-1000" />

      {/* Content wrapper */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left text intro */}
        <div className="lg:col-span-8 text-center lg:text-left space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gym-gold/10 dark:bg-gym-silver/10 border border-gym-gold/20 dark:border-gym-silver/20 px-4 py-1.5 rounded-full"
          >
            <ShieldCheck size={14} className="text-gym-gold dark:text-gym-silver" />
            <span className="text-[10px] md:text-xs font-semibold text-gym-gold dark:text-gym-silver uppercase tracking-widest">
              India's Premier Luxury Fitness Destination
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-2"
          >
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black font-display leading-[0.95] tracking-tight uppercase text-gym-black dark:text-white transition-colors duration-500">
              {titleLine1} <br />
              <span className="text-brand-gradient">{titleLine2}</span>
            </h1>
            <p className="text-sm md:text-lg text-gym-grey-secondary dark:text-gym-grey-muted max-w-xl mx-auto lg:mx-0 font-medium transition-colors duration-500">
              {subheading}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
          >
            <button
              onClick={handleCTA}
              style={{ borderRadius: 'var(--button-radius)' }}
              className="w-full sm:w-auto relative group overflow-hidden bg-gold-metallic-gradient dark:bg-silver-metallic-gradient text-gym-black font-display font-bold uppercase tracking-widest text-xs py-4 px-8 shadow-2xl shadow-gym-gold/10 dark:shadow-gym-silver/10 hover:scale-[1.03] transition-all duration-300"
            >
              {ctaText}
              <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
            </button>

            <button
              onClick={() => handleScrollToNextSection('pricing')}
              style={{ borderRadius: 'var(--button-radius)' }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gym-gold/20 dark:border-gym-border hover:border-gym-gold dark:hover:border-gym-silver bg-white/40 dark:bg-gym-card/40 hover:bg-white/80 dark:hover:bg-gym-card/80 text-gym-black dark:text-white hover:text-gym-gold dark:hover:text-gym-silver font-display font-semibold uppercase tracking-widest text-xs py-4 px-8 transition-all duration-300 shadow-sm"
            >
              <Play size={14} className="fill-current text-gym-gold dark:text-gym-silver stroke-none" />
              Explore Plans
            </button>
          </motion.div>
        </div>

        {/* Right side stats box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ borderRadius: 'var(--button-radius)' }}
          className="lg:col-span-4 glass-brand p-8 relative flex flex-col justify-between h-[360px] md:h-[400px]"
        >
          {/* Subtle lighting overlay inside the card */}
          <div className="absolute inset-0 bg-gradient-to-tr from-gym-gold/5 dark:from-gym-silver/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <h4 className="text-xs font-bold font-display text-gym-gold dark:text-gym-silver uppercase tracking-[0.25em]">
              The Club Legacy
            </h4>
            <h2 className="text-xl md:text-2xl font-black font-display uppercase tracking-tight text-gym-black dark:text-white mt-1 leading-snug transition-colors">
              MORE THAN A GYM. <br />A STATEMENT.
            </h2>
          </div>

          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-1 gap-6 md:gap-8 my-auto">
            <StatCounter endValue={20} label="Thousand Sq.Ft Space" suffix="K+" />
            <StatCounter endValue={15} label="Elite Certified Coaches" suffix="+" />
            <StatCounter endValue={2} label="Active VIP Members" suffix="K+" />
          </div>

          <div className="relative z-10 border-t border-gym-gold/10 dark:border-gym-border/60 pt-4 flex items-center justify-between text-[11px] uppercase tracking-widest text-gym-grey-muted font-bold transition-colors">
            <span>Mumbai &bull; Bangalore</span>
            <span className="text-gym-gold dark:text-gym-silver flex items-center gap-1">Open 24/7 <span className="w-2 h-2 rounded-full bg-gym-gold dark:bg-gym-silver animate-pulse" /></span>
          </div>
        </motion.div>
      </div>

      {/* Parallax Scroll Down Indicator */}
      <div 
        onClick={() => handleScrollToNextSection('about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-10 flex flex-col items-center gap-2 group"
      >
        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-gym-grey-muted group-hover:text-gym-gold dark:group-hover:text-gym-silver transition-colors">
          Scroll Down
        </span>
        <div className="w-[18px] h-[32px] border-2 border-gym-grey-muted/30 dark:border-gym-grey-muted group-hover:border-gym-gold dark:group-hover:border-gym-silver rounded-full flex justify-center p-1 transition-colors">
          <div className="w-[3px] h-[6px] bg-gym-grey-muted group-hover:bg-gym-gold dark:group-hover:bg-gym-silver rounded-full animate-scroll-down" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
