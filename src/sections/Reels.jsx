import React, { useState } from 'react';
import { Play, Volume2, Maximize, X, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const reelsData = [
  {
    id: 1,
    title: 'Peak Combat Prep',
    stat: 'Boxing & Reflex Conditioning',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-boxer-practicing-punches-in-a-dark-gym-41913-large.mp4',
    poster: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Titan Hypertrophy Session',
    stat: 'Barbell Deep Squats (180KG)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-squats-with-barbell-in-gym-48356-large.mp4',
    poster: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Metabolic Conditioning',
    stat: 'Kettlebell Swings & Thrusters',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-man-undergoing-a-rigorous-crossfit-workout-41908-large.mp4',
    poster: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=300&auto=format&fit=crop'
  }
];

const Reels = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section id="reels" className="relative py-24 bg-transparent border-y border-gym-gold/10 dark:border-gym-border overflow-hidden transition-colors duration-1000">
      {/* Background glow flares */}
      <div className="absolute top-[20%] -left-[10vw] w-[35vw] h-[35vw] bg-gym-gold/5 dark:bg-gym-silver/5 rounded-full filter blur-[120px] pointer-events-none transition-colors duration-1000" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <h4 className="text-xs font-bold font-display text-gym-gold dark:text-gym-silver uppercase tracking-[0.25em] transition-colors">
            SOCIAL &amp; ENERGY
          </h4>
          <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight text-gym-black dark:text-white leading-tight transition-colors">
            GLF CINEMATIC <span className="text-brand-gradient">SHORTS</span>
          </h2>
          <p className="text-xs md:text-sm text-gym-black/70 dark:text-gym-grey-muted max-w-xl mx-auto font-medium transition-colors">
            Catch the high-energy frequency of our training floor. Hover to view loop clips, or click to expand.
          </p>
        </div>

        {/* Reels Mobile-Phone Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-center max-w-[960px] mx-auto">
          {reelsData.map((reel) => (
            <div
              key={reel.id}
              onClick={() => setActiveVideo(reel)}
              className="group relative aspect-[9/16] max-w-[280px] w-full mx-auto bg-white dark:bg-gym-card border-4 border-gym-gold/10 dark:border-gym-border hover:border-gym-gold dark:hover:border-gym-silver rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:shadow-gym-gold/10 dark:hover:shadow-gym-silver/10 cursor-pointer select-none"
            >
              {/* Camera Notch simulation */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-gym-gold/10 dark:bg-gym-border rounded-full z-20 transition-colors" />

              {/* Looping video container */}
              <div className="absolute inset-0 z-0">
                <video
                  src={reel.url}
                  poster={reel.poster}
                  loop
                  muted
                  playsInline
                  autoPlay
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                />
              </div>

              {/* Card Static Info Panel */}
              <div className="absolute inset-0 bg-gradient-to-t from-gym-black/90 via-transparent to-transparent flex flex-col justify-end p-6 z-10">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 text-[8px] font-bold text-gym-gold dark:text-gym-silver uppercase tracking-wider bg-gym-gold/10 dark:bg-gym-silver/10 px-2 py-0.5 rounded border border-gym-gold/10 dark:border-gym-silver/10 transition-colors">
                    <Instagram size={8} /> LIVE SHORTS
                  </span>
                  <h3 className="font-display font-black text-sm uppercase text-white tracking-wide">
                    {reel.title}
                  </h3>
                  <p className="text-[10px] text-gym-grey-muted font-semibold tracking-wide">
                    {reel.stat}
                  </p>
                </div>
              </div>

              {/* Central Floating Play Icon */}
              <div className="absolute inset-0 flex items-center justify-center z-15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-gym-gold dark:bg-gym-silver flex items-center justify-center text-gym-black shadow-lg transition-colors">
                  <Play size={16} className="fill-current stroke-[2.5] ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Expanded Video Lightbox Overlay */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            className="fixed inset-0 bg-gym-black/98 z-50 flex items-center justify-center p-6"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-white dark:bg-gym-card border border-gym-gold/10 dark:border-gym-border text-gym-black dark:text-white hover:text-gym-gold dark:hover:text-gym-silver flex items-center justify-center transition-colors z-50"
              aria-label="Close Video"
            >
              <X size={20} />
            </button>

            {/* Video Container */}
            <div 
              className="relative aspect-[9/16] w-full max-w-[360px] rounded-3xl overflow-hidden border border-gym-gold/10 dark:border-gym-border shadow-2xl transition-colors" 
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={activeVideo.url}
                controls
                autoPlay
                playsInline
                loop
                className="w-full h-full object-cover"
              />
              
              {/* Media Controls details overlay */}
              <div className="absolute bottom-16 left-6 right-6 pointer-events-none text-left z-10 text-white drop-shadow-md">
                <span className="text-[9px] uppercase font-bold text-gym-gold dark:text-gym-silver tracking-widest block transition-colors">
                  {activeVideo.stat}
                </span>
                <h4 className="font-display font-black text-lg uppercase tracking-wide">
                  {activeVideo.title}
                </h4>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Reels;
