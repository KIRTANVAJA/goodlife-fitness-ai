import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Layers, Compass, Wind, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const facilitiesData = [
  {
    title: 'Heavy Strength Arena',
    subtitle: 'THE IRON ZONE',
    desc: 'An intimidating floor space equipped with 40+ selectorized plates, custom dumbbells up to 80kg, multi-racks, deadlift platforms, and competition-grade power benches.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
    icon: Layers,
    stats: ['Arsenal & Panatta gear', 'Dumbbells up to 80KG', 'Dampened Olympic platforms']
  },
  {
    title: 'Biomechanical Cardio Deck',
    subtitle: 'VO2 MAX LAB',
    desc: 'Perform stamina training on matrix-console treadmills, assault air bikes, curved self-powered runners, and alpine climb incline simulators connected to active fitness monitors.',
    image: 'https://images.unsplash.com/photo-1578762560072-46cf12a5d586?q=80&w=1200&auto=format&fit=crop',
    icon: Compass,
    stats: ['Curved self-powered runners', 'Ambient active air flow', 'Real-time telemetry stats']
  },
  {
    title: 'Infrared Sauna & Cryotherapy',
    subtitle: 'RECOVERY CLUB',
    desc: 'Unlock optimal muscle recovery. The dedicated recovery zone features dry sauna chambers, eucalyptus steam showers, deep ice tubs, and compression recovery systems.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop',
    icon: Wind,
    stats: ['-110°C Cryotherapy chamber', 'Standard infrared saunas', 'Hydromassage therapy beds']
  },
  {
    title: 'Good Life Cafe & Juice Bar',
    subtitle: 'FUEL LOUNGE',
    desc: 'Pre-workout shots, custom protein shakes, meal logs, cold-press juices, and customized post-workout meals mixed and packaged fresh for healthy refueling.',
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=1200&auto=format&fit=crop',
    icon: Coffee,
    stats: ['Bespoke post-workout macros', 'Pure organic whey & vegan options', 'Premium espresso prep']
  }
];

const Facilities = () => {
  const [current, setCurrent] = useState(0);
  const total = facilitiesData.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const active = facilitiesData[current];
  const Icon = active.icon;

  return (
    <section id="facilities" className="relative py-24 bg-transparent overflow-hidden">
      {/* Lights flare */}
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-gym-gold-deep/5 dark:bg-gym-silver-deep/5 rounded-full filter blur-[150px] pointer-events-none transition-colors duration-1000" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-display text-gym-gold dark:text-gym-silver uppercase tracking-[0.25em] transition-colors duration-1000">
              THE FACILITY
            </h4>
            <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight text-gym-black dark:text-white leading-tight transition-colors duration-1000">
              LUXURY INSIDE <span className="text-brand-gradient">AND OUT</span>
            </h2>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              className="w-12 h-12 border border-gym-gold/20 dark:border-gym-border hover:border-gym-gold dark:hover:border-gym-silver bg-gym-gold/5 dark:bg-gym-card/50 hover:bg-gym-gold dark:hover:bg-gym-silver text-gym-gold dark:text-white hover:text-gym-black dark:hover:text-gym-black transition-all duration-500 flex items-center justify-center"
              aria-label="Previous Facility"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 border border-gym-gold/20 dark:border-gym-border hover:border-gym-gold dark:hover:border-gym-silver bg-gym-gold/5 dark:bg-gym-card/50 hover:bg-gym-gold dark:hover:bg-gym-silver text-gym-gold dark:text-white hover:text-gym-black dark:hover:text-gym-black transition-all duration-500 flex items-center justify-center"
              aria-label="Next Facility"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Carousel Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left half: Media Slider */}
          <div className="lg:col-span-7 relative h-[300px] md:h-[450px] overflow-hidden border border-gym-gold/20 dark:border-gym-border shadow-2xl transition-colors duration-1000">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                className="absolute inset-0 select-none"
              >
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${active.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gym-black/40 dark:from-gym-black/60 to-transparent" />
              </motion.div>
            </AnimatePresence>
            
            {/* Number indicator */}
            <div className="absolute top-4 left-4 bg-white/80 dark:bg-gym-black/85 border border-gym-gold/20 dark:border-gym-border px-3.5 py-1 text-xs font-semibold font-display tracking-widest text-gym-gold dark:text-gym-silver transition-all duration-1000">
              0{current + 1} / 0{total}
            </div>
          </div>

          {/* Right half: Text Content Card */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 glass-brand relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gym-gold/5 dark:bg-gym-silver/5 rounded-full filter blur-2xl pointer-events-none transition-colors duration-1000" />

            <div className="space-y-6 relative z-10">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-gym-gold dark:text-gym-silver tracking-widest block transition-colors duration-1000">
                  {active.subtitle}
                </span>
                <h3 className="text-2xl font-black font-display uppercase tracking-wider text-gym-black dark:text-white transition-colors duration-1000">
                  {active.title}
                </h3>
              </div>

              <p className="text-xs md:text-sm text-gym-black/70 dark:text-gym-grey-muted leading-relaxed transition-colors duration-1000">
                {active.desc}
              </p>

              {/* Bullet details */}
              <div className="space-y-3.5 pt-4 border-t border-gym-gold/20 dark:border-gym-border/40 transition-colors duration-1000">
                {active.stats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-gym-black dark:text-white font-medium transition-colors duration-1000">
                    <span className="w-1.5 h-1.5 bg-gym-gold dark:bg-gym-silver rounded-full transition-colors duration-1000" />
                    {stat}
                  </div>
                ))}
              </div>
            </div>

            {/* Thumbnail navigation selectors */}
            <div className="flex gap-2 mt-8 pt-6 border-t border-gym-gold/20 dark:border-gym-border/40 relative z-10 transition-colors duration-1000">
              {facilitiesData.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`h-1.5 flex-grow transition-all duration-500 ${
                    current === index ? 'bg-gym-gold dark:bg-gym-silver' : 'bg-gym-gold/20 dark:bg-gym-border hover:bg-gym-gold/40 dark:hover:bg-gym-border/80'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Facilities;
