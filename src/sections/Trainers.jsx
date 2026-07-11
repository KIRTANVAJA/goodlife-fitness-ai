import React, { useContext } from 'react';
import { Star, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { ContentContext } from '../context/ContentContext';
import { analyticsTracker } from '../utils/analytics';

const TrainerCard = ({ coach, whatsAppNumber }) => {
  const handleBookSession = (coachName) => {
    analyticsTracker.track('whatsapp_click', { source: 'Trainer Card', coach: coachName });
    const text = encodeURIComponent(`Hello Good Life Fitness! I would like to book an introductory Personal Coaching consult session with Coach ${coachName}. Please let me know available slots.`);
    window.open(`https://wa.me/${whatsAppNumber}?text=${text}`, '_blank');
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      style={{ borderRadius: 'var(--button-radius)' }}
      className="group relative h-[450px] w-full overflow-hidden bg-gym-gold/5 dark:bg-gym-card border border-gym-gold/20 dark:border-gym-border hover:border-gym-gold/40 dark:hover:border-gym-silver/40 transition-all duration-500 shadow-sm"
    >
      {/* Background image container */}
      <div className="absolute inset-0 z-0 select-none">
        <div 
          className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${coach.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gym-black via-gym-black/40 to-transparent" />
      </div>

      {/* Star Rating Badge */}
      <div 
        style={{ borderRadius: 'var(--button-radius)' }}
        className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-gym-black/85 border border-gym-gold/20 dark:border-gym-border px-2.5 py-1 flex items-center gap-1 text-[10px] font-bold text-gym-gold dark:text-gym-silver transition-all duration-1000"
      >
        <Star size={10} className="fill-current" />
        {coach.rating.toFixed(1)}
      </div>

      {/* Info Overlay Panel (Stays at the bottom, rises up on hover) */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-10 bg-gradient-to-t from-gym-black via-gym-black/95 to-transparent transition-all duration-300 translate-y-[100px] group-hover:translate-y-0">
        
        {/* Name and Designation */}
        <div className="space-y-1 pb-3 mb-3 border-b border-gym-border/40">
          <span className="block text-[9px] uppercase font-bold text-gym-gold dark:text-gym-silver tracking-widest transition-colors duration-1000">
            {coach.role}
          </span>
          <h3 className="text-lg font-black font-display uppercase tracking-wider text-white">
            {coach.name}
          </h3>
        </div>

        {/* Credentials */}
        <div className="space-y-2 mb-6">
          <span className="block text-[8px] uppercase tracking-wider text-zinc-400 font-bold">Speciality</span>
          <p className="text-xs text-white/90 font-semibold">{coach.specialization}</p>

          <span className="block text-[8px] uppercase tracking-wider text-zinc-400 font-bold pt-1">Credentials</span>
          <div className="flex flex-wrap gap-1.5">
            {coach.certs.map((cert, i) => (
              <span 
                key={i} 
                style={{ borderRadius: 'calc(var(--button-radius) / 2)' }}
                className="text-[9px] bg-gym-black/80 border border-gym-border text-zinc-400 px-2 py-0.5 font-medium"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => handleBookSession(coach.name)}
          style={{ borderRadius: 'var(--button-radius)' }}
          className="w-full bg-gold-metallic-gradient dark:bg-silver-metallic-gradient text-gym-black font-display font-black uppercase text-[10px] tracking-widest py-3 flex items-center justify-center gap-1.5 shadow-lg shadow-gym-gold/15 dark:shadow-gym-silver/15 transition-all duration-1000"
        >
          <Calendar size={12} />
          Book VIP Session
        </button>
      </div>

      {/* Static preview label visible before hover */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-10 bg-gradient-to-t from-gym-black to-transparent transition-all duration-300 group-hover:opacity-0">
        <span className="block text-[9px] uppercase font-bold text-gym-gold dark:text-gym-silver tracking-widest transition-colors duration-1000">
          {coach.role}
        </span>
        <h3 className="text-lg font-black font-display uppercase tracking-wider text-white">
          {coach.name}
        </h3>
      </div>
    </motion.div>
  );
};

const Trainers = () => {
  const { content } = useContext(ContentContext);
  const coaches = content.trainers;
  const contactInfo = content.contact;

  return (
    <section id="trainers" className="relative py-24 bg-transparent overflow-hidden">
      {/* Background glow flares */}
      <div className="absolute top-[20%] -right-[10vw] w-[35vw] h-[35vw] bg-gym-gold-deep/5 dark:bg-gym-silver-deep/5 rounded-full filter blur-[120px] pointer-events-none transition-colors duration-1000" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <h4 className="text-xs font-bold font-display text-gym-gold dark:text-gym-silver uppercase tracking-[0.25em] transition-colors duration-1000">
            ELITE TEAM
          </h4>
          <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight text-gym-black dark:text-white transition-colors duration-1000">
            MEET YOUR <span className="text-brand-gradient">SCULPTORS</span>
          </h2>
          <p className="text-xs md:text-sm text-gym-grey-secondary max-w-xl mx-auto font-medium transition-colors duration-1000">
            Certified elite performance scientists committed to designing your physical breakthrough.
          </p>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coaches.map((coach) => (
            <TrainerCard key={coach.id} coach={coach} whatsAppNumber={contactInfo.whatsApp} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trainers;
