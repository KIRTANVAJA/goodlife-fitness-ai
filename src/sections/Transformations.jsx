import React, { useState, useRef, useEffect } from 'react';
import { Eye, MoveHorizontal, Award } from 'lucide-react';


const Transformations = () => {
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  const members = [
    { name: 'Sameer Verma', loss: '-18 Kg', time: '6 Months', achievement: 'Fat Loss & Core Strength' },
    { name: 'Karan Malhotra', loss: '+8 Kg', time: '5 Months', achievement: 'Lean Muscle Hypertrophy' },
    { name: 'Riya Sen', loss: '-12 Kg', time: '4 Months', achievement: 'Body Recompositioning' }
  ];

  return (
    <section id="transformations" className="relative py-24 bg-gym-gold/[0.01] dark:bg-gym-dark/20 border-b border-gym-gold/10 dark:border-b-gym-border overflow-hidden transition-colors duration-1000">
      {/* Background radial spotlight */}
      <div className="absolute top-1/2 left-0 w-[45vw] h-[45vw] bg-gym-gold-dark/5 dark:bg-gym-silver-dark/5 rounded-full filter blur-[150px] pointer-events-none transition-colors duration-1000" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <h4 className="text-xs font-bold font-display text-gym-gold dark:text-gym-silver uppercase tracking-[0.25em] transition-colors duration-1000">
            PROVEN RESULTS
          </h4>
          <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight text-gym-black dark:text-white leading-tight transition-colors duration-1000">
            PHYSICAL <span className="text-brand-gradient">METAMORPHOSIS</span>
          </h2>
          <p className="text-xs md:text-sm text-gym-black/70 dark:text-gym-grey-muted max-w-xl mx-auto font-medium transition-colors duration-1000">
            Drag the visual slider to inspect standard physique upgrades achieved by our Elite members.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Before/After Card */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            <div 
              ref={containerRef}
              className="relative w-full aspect-[4/3] max-w-[600px] border border-gym-gold/20 dark:border-gym-border shadow-2xl overflow-hidden cursor-ew-resize select-none transition-colors duration-1000"
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* After Image (Full background) */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop')` 
                }}
              />
              <div className="absolute right-4 bottom-4 bg-gym-gold dark:bg-gym-silver text-gym-black font-display font-black text-[9px] uppercase px-3 py-1 tracking-widest z-10 transition-colors duration-1000">
                AFTER (WEEK 24)
              </div>

              {/* Before Image (Overlaid, clipped using percentage width) */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop')`,
                  width: `${sliderPosition}%`,
                  transition: isDragging ? 'none' : 'width 0.1s ease-out'
                }}
              />
              <div className="absolute left-4 bottom-4 bg-white/80 dark:bg-gym-black/85 border border-gym-gold/20 dark:border-gym-border text-gym-black dark:text-white font-display font-black text-[9px] uppercase px-3 py-1 tracking-widest z-10 transition-all duration-1000">
                BEFORE (WEEK 0)
              </div>

              {/* Central Divider Handle Line */}
              <div 
                className="absolute top-0 bottom-0 w-[2px] bg-gym-gold dark:bg-gym-silver transition-colors duration-1000"
                style={{ 
                  left: `${sliderPosition}%`,
                  transition: isDragging ? 'none' : 'left 0.1s ease-out'
                }}
              >
                {/* Floating Central Circle */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white dark:bg-gym-black border-2 border-gym-gold dark:border-gym-silver flex items-center justify-center text-gym-gold dark:text-gym-silver shadow-2xl transition-colors duration-1000">
                  <MoveHorizontal size={14} className="animate-pulse" />
                </div>
              </div>
            </div>

            <p className="text-[10px] text-gym-black/70 dark:text-gym-grey-muted uppercase tracking-widest mt-4 font-bold flex items-center gap-1.5 transition-colors duration-1000">
              <Eye size={12} className="text-gym-gold dark:text-gym-silver transition-colors duration-1000" /> Hover &amp; Drag slider horizontally to compare
            </p>
          </div>

          {/* Right Column: Key metrics and testaments */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-black font-display uppercase tracking-wider text-gym-black dark:text-white transition-colors duration-1000">
                WE DO NOT SELL PROMISES. <br />WE MEASURE DATA.
              </h3>
              <p className="text-xs text-gym-black/70 dark:text-gym-grey-muted leading-relaxed font-medium transition-colors duration-1000">
                Our trainers utilize 3D body composition scanners (InBody 570) and weekly calipers metrics checking to guarantee body recompositioning.
              </p>
            </div>

            {/* Testimonials Metrics Grid */}
            <div className="space-y-4 pt-4 border-t border-gym-gold/20 dark:border-gym-border/40 transition-colors duration-1000">
              {members.map((member, idx) => (
                <div 
                  key={idx}
                  className="glass-brand p-5 flex items-center justify-between border-l-2 border-l-gym-gold dark:border-l-gym-silver hover:border-l-gym-gold-accent dark:hover:border-l-white transition-all duration-300"
                >
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-sm text-gym-black dark:text-white uppercase tracking-wider transition-colors duration-1000">
                      {member.name}
                    </h4>
                    <p className="text-[10px] text-gym-black/60 dark:text-gym-grey-muted uppercase font-bold tracking-widest transition-colors duration-1000">
                      Goal: {member.achievement}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span className="block font-display font-black text-lg text-gym-gold dark:text-gym-silver tracking-wide transition-colors duration-1000">
                      {member.loss}
                    </span>
                    <span className="block text-[8px] uppercase text-gym-black/60 dark:text-gym-grey-muted tracking-widest font-semibold transition-colors duration-1000">
                      Time: {member.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Micro badge */}
            <div className="flex items-center gap-2.5 text-[10px] text-gym-black/70 dark:text-gym-grey-muted uppercase font-bold tracking-widest transition-colors duration-1000">
              <Award size={16} className="text-gym-gold dark:text-gym-silver transition-colors duration-1000" />
              Over 450+ physical transformations completed this year
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Transformations;
