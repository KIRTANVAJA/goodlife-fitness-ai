import React, { useState } from 'react';
import { Dumbbell, ShieldCheck, Flame, Trophy, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const programData = [
  {
    id: 'strength',
    title: 'Titan Strength Training',
    category: 'Strength',
    desc: 'Heavy biomechanical compound lifting targeting myofibrillar hypertrophy. Build real functional muscle and dense power.',
    duration: '5 sessions / week',
    intensity: 'Extreme',
    coach: 'Coach Vikram (Arsenal Specialist)',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    icon: Dumbbell
  },
  {
    id: 'conditioning',
    title: 'Metabolic Conditioning',
    category: 'Endurance',
    desc: 'High-intensity interval training designed to spike VO2 max and burn fat up to 48 hours post-workout via EPOC effect.',
    duration: '4 sessions / week',
    intensity: 'High',
    coach: 'Coach Priya (CrossFit L2)',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=600&auto=format&fit=crop',
    icon: Flame
  },
  {
    id: 'combat',
    title: 'MMA & Combat Prep',
    category: 'Combat',
    desc: 'Learn authentic Muay Thai, Boxing, and BJJ. Improve core stabilization, reflexes, body mobility, and explosive speed.',
    duration: '3 sessions / week',
    intensity: 'Very High',
    coach: 'Coach Shera (National Wushu Gold)',
    image: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=600&auto=format&fit=crop',
    icon: Trophy
  },
  {
    id: 'coaching',
    title: 'Elite 1-on-1 VIP Coaching',
    category: 'VIP Coaching',
    desc: 'Bespoke fitness engineering. Custom macro diet logs, blood-work tracking, form assessment, and lifestyle management.',
    duration: 'Flexible Slots',
    intensity: 'Tailored',
    coach: 'Dr. Arjun (Sports Science Lead)',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',
    icon: ShieldCheck
  },
  {
    id: 'flexibility',
    title: 'Bio-Flow Yoga & Mobility',
    category: 'Endurance',
    desc: 'Restore posture, release myofascial tension, increase joint durability, and improve mental focus through breathing mechanics.',
    duration: '3 sessions / week',
    intensity: 'Low-Medium',
    coach: 'Yogini Ananya (RYT 500 Certified)',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
    icon: Heart
  }
];

const Programs = () => {
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'Strength', 'Endurance', 'Combat', 'VIP Coaching'];

  const filteredPrograms = activeTab === 'All' 
    ? programData 
    : programData.filter(item => item.category === activeTab);

  const handleInquiry = (programName) => {
    const text = encodeURIComponent(`Hello Good Life Fitness! I would like to inquire about the "${programName}" training program. Please provide slots and fees details.`);
    window.open(`https://wa.me/919999999999?text=${text}`, '_blank');
  };

  return (
    <section id="programs" className="relative py-24 bg-transparent border-y border-gym-gold/10 dark:border-gym-border transition-colors duration-1000">
      {/* Light glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[30vh] bg-gym-gold/5 dark:bg-gym-silver/5 rounded-full filter blur-[120px] pointer-events-none transition-colors duration-1000" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <h4 className="text-xs font-bold font-display text-gym-gold dark:text-gym-silver uppercase tracking-[0.25em] transition-colors">
            TRAINING DISCIPLINES
          </h4>
          <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight text-gym-black dark:text-white transition-colors">
            CHOOSE YOUR <span className="text-brand-gradient">BATTLEFIELD</span>
          </h2>
          <p className="text-xs md:text-sm text-gym-black/70 dark:text-gym-grey-muted max-w-xl mx-auto font-medium transition-colors">
            Scientifically structured workout regimes crafted to push mental limits and maximize physical progress.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-gym-gold/10 dark:border-gym-border/40 pb-6 transition-colors">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 font-display text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gym-gold dark:bg-gym-silver text-gym-black shadow-lg shadow-gym-gold/10 dark:shadow-gym-silver/10'
                  : 'bg-white dark:bg-gym-card/50 text-gym-black/60 dark:text-gym-grey-muted border border-gym-gold/15 dark:border-gym-border/60 hover:text-gym-black dark:hover:text-white hover:border-gym-gold dark:hover:border-gym-silver'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid cards with slide effects */}
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredPrograms.map((program) => {
              const Icon = program.icon;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={program.id}
                  className="group relative flex flex-col justify-between overflow-hidden glass-brand border border-gym-gold/10 dark:border-gym-border hover:border-gym-gold/40 dark:hover:border-gym-silver/40 transition-all duration-300 h-[480px]"
                >
                  {/* Hover Light Spotlight inside Card */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gym-gold/5 dark:bg-gym-silver/5 rounded-full filter blur-xl group-hover:bg-gym-gold/10 dark:group-hover:bg-gym-silver/10 transition-all duration-300 pointer-events-none" />

                  {/* Card Visual Background (Top Half) */}
                  <div className="relative h-44 w-full overflow-hidden select-none">
                    <div 
                      className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url('${program.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gym-card via-white/45 dark:via-gym-card/45 to-transparent transition-colors duration-1000" />
                    
                    {/* Floating Icon badge */}
                    <div className="absolute right-4 bottom-4 w-10 h-10 bg-white dark:bg-gym-black border border-gym-gold/20 dark:border-gym-silver/20 flex items-center justify-center text-gym-gold dark:text-gym-silver transition-colors duration-500">
                      <Icon size={18} />
                    </div>
                  </div>

                  {/* Content Container (Bottom Half) */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="inline-block text-[9px] uppercase font-bold text-gym-gold dark:text-gym-silver tracking-widest transition-colors">
                        {program.category}
                      </span>
                      <h3 className="text-lg font-bold font-display uppercase tracking-wider text-gym-black dark:text-white group-hover:text-gym-gold dark:group-hover:text-gym-silver transition-colors">
                        {program.title}
                      </h3>
                      <p className="text-xs text-gym-black/70 dark:text-gym-grey-muted leading-relaxed line-clamp-3 transition-colors">
                        {program.desc}
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gym-gold/10 dark:border-gym-border/40 transition-colors">
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-gym-black/60 dark:text-gym-grey-muted uppercase font-bold tracking-wider transition-colors">
                        <div>
                          <span className="block text-[8px] text-gym-gold dark:text-gym-silver font-semibold transition-colors">Frequency</span>
                          {program.duration}
                        </div>
                        <div>
                          <span className="block text-[8px] text-gym-gold dark:text-gym-silver font-semibold transition-colors">Intensity</span>
                          {program.intensity}
                        </div>
                      </div>

                      <button
                        onClick={() => handleInquiry(program.title)}
                        className="w-full relative py-3 bg-white dark:bg-gym-black hover:bg-gym-gold dark:hover:bg-gym-silver border border-gym-gold/15 dark:border-gym-border hover:border-gym-gold dark:hover:border-gym-silver text-gym-black dark:text-white hover:text-gym-black dark:hover:text-gym-black font-display font-semibold uppercase text-[10px] tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        Inquire via WhatsApp
                        <ArrowRight size={12} />
                      </button>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Programs;
