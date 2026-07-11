import React, { useState, useEffect, useContext } from 'react';
import { Star, Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentContext } from '../context/ContentContext';

const Testimonials = () => {
  const { content } = useContext(ContentContext);
  const testimonials = content.testimonials || [];
  const [active, setActive] = useState(0);
  const total = testimonials.length;

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev === total - 1 ? 0 : prev + 1));
    }, 6000); // Rotate every 6 seconds

    return () => clearInterval(timer);
  }, [total]);

  if (total === 0) return null;

  const handleNext = () => {
    setActive((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActive((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const current = testimonials[active] || testimonials[0];

  return (
    <section id="testimonials" className="relative py-24 bg-transparent overflow-hidden transition-colors duration-1000">
      {/* Background radial spotlights */}
      <div className="absolute top-0 right-[15vw] w-[35vw] h-[35vw] bg-gym-gold/5 dark:bg-gym-silver/5 rounded-full filter blur-[120px] pointer-events-none transition-colors duration-1000" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        
        {/* Section Header */}
        <div className="space-y-3 mb-16">
          <h4 className="text-xs font-bold font-display text-gym-gold dark:text-gym-silver uppercase tracking-[0.25em] transition-colors">
            MEMBER TESTIMONIALS
          </h4>
          <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight text-gym-black dark:text-white transition-colors">
            THE CHOSEN <span className="text-brand-gradient">EXPERIENCE</span>
          </h2>
        </div>

        {/* Carousel Content */}
        <div className="relative min-h-[300px] flex flex-col items-center justify-center">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Quote Mark Icon */}
              <div className="flex justify-center text-gym-gold/20 dark:text-gym-silver/20 transition-colors">
                <Quote size={50} className="stroke-[1.5]" />
              </div>

              {/* Review Statement */}
              <p className="text-sm md:text-xl text-gym-black dark:text-white font-medium leading-relaxed italic max-w-2xl mx-auto transition-colors">
                "{current.review}"
              </p>

              {/* Star Ratings */}
              <div className="flex justify-center gap-1">
                {[...Array(current.rating || 5)].map((_, i) => (
                  <Star key={i} size={14} className="text-gym-gold dark:text-gym-silver fill-current transition-colors" />
                ))}
              </div>

              {/* Profile Details */}
              <div className="flex items-center justify-center gap-3 pt-4 select-none">
                {current.avatar && (
                  <img 
                    src={current.avatar} 
                    alt={current.name}
                    className="w-12 h-12 rounded-full border border-gym-gold/20 dark:border-gym-silver/20 object-cover transition-colors"
                  />
                )}
                <div className="text-left">
                  <h4 className="font-display font-black text-sm uppercase text-gym-black dark:text-white tracking-wider transition-colors">
                    {current.name}
                  </h4>
                  <p className="text-[10px] uppercase font-bold text-gym-gold dark:text-gym-silver tracking-widest transition-colors">
                    {current.role}
                  </p>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center w-full absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none px-0 md:px-4">
            <button
              onClick={handlePrev}
              style={{ borderRadius: 'var(--button-radius)' }}
              className="w-10 h-10 border border-gym-gold/20 dark:border-gym-border/40 hover:border-gym-gold dark:hover:border-gym-silver bg-white/60 dark:bg-gym-card/40 hover:bg-gym-gold dark:hover:bg-gym-silver text-gym-black dark:text-white hover:text-gym-black dark:hover:text-gym-black transition-all duration-300 flex items-center justify-center pointer-events-auto shadow-sm"
              aria-label="Previous Review"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={handleNext}
              style={{ borderRadius: 'var(--button-radius)' }}
              className="w-10 h-10 border border-gym-gold/20 dark:border-gym-border/40 hover:border-gym-gold dark:hover:border-gym-silver bg-white/60 dark:bg-gym-card/40 hover:bg-gym-gold dark:hover:bg-gym-silver text-gym-black dark:text-white hover:text-gym-black dark:hover:text-gym-black transition-all duration-300 flex items-center justify-center pointer-events-auto shadow-sm"
              aria-label="Next Review"
            >
              <ArrowRight size={14} />
            </button>
          </div>

        </div>

        {/* Thumbnail Selector Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              style={{ borderRadius: 'var(--button-radius)' }}
              className={`w-2.5 h-2.5 transition-all duration-300 ${
                active === index ? 'bg-gym-gold dark:bg-gym-silver scale-125' : 'bg-gym-gold/20 dark:bg-gym-border hover:bg-gym-border/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;

