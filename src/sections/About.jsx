import React from 'react';
import { Award, Zap, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, desc }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="glass-brand p-6 border-l-2 border-l-gym-gold dark:border-l-gym-silver hover:border-l-gym-gold-accent dark:hover:border-l-white transition-all duration-300 flex items-start gap-4"
    >
      <div className="w-12 h-12 rounded-lg bg-gym-gold/10 dark:bg-gym-silver/10 border border-gym-gold/20 dark:border-gym-silver/20 flex items-center justify-center text-gym-gold dark:text-gym-silver flex-shrink-0">
        <Icon size={20} className="stroke-[1.5]" />
      </div>
      <div>
        <h4 className="font-display font-bold uppercase tracking-wider text-sm text-gym-black dark:text-white transition-colors">{title}</h4>
        <p className="text-xs text-gym-black/70 dark:text-gym-grey-muted mt-1 leading-relaxed transition-colors">{desc}</p>
      </div>
    </motion.div>
  );
};

const About = () => {
  const highlights = [
    {
      icon: Zap,
      title: "Biomechanical Arsenal",
      desc: "Train on imported state-of-the-art Arsenal Strength and Panatta biomechanically engineered lines."
    },
    {
      icon: Award,
      title: "ISSA & ACSM Certified Coaches",
      desc: "Gain scientific guidance, form correction, and personalized target tracking from certified fitness professionals."
    },
    {
      icon: Sparkles,
      title: "Luxury Recovery Lounge",
      desc: "Rejuvenate in our private cryotherapy tanks, standard infrared saunas, steam rooms, and sports massage zones."
    },
    {
      icon: Heart,
      title: "Holistic Wellness & Cafe",
      desc: "Recharge at our in-house premium health cafe serving customized protein meals, cold presses, and performance supplements."
    }
  ];

  return (
    <section id="about" className="relative py-24 overflow-hidden bg-transparent">
      {/* Light glow effects */}
      <div className="absolute top-[20%] -left-[10vw] w-[35vw] h-[35vw] bg-gym-gold-dark/5 dark:bg-gym-silver-dark/5 rounded-full filter blur-[120px] pointer-events-none transition-colors duration-1000" />
      <div className="absolute bottom-[20%] -right-[10vw] w-[35vw] h-[35vw] bg-gym-gold-deep/5 dark:bg-gym-silver-deep/5 rounded-full filter blur-[120px] pointer-events-none transition-colors duration-1000" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Premium Images Collage */}
          <div className="relative h-[480px] md:h-[600px] flex items-center justify-center">
            {/* Primary Main Image */}
            <div 
              className="absolute w-[75%] h-[75%] left-0 top-0 border border-gym-gold/15 dark:border-gym-border shadow-2xl overflow-hidden group select-none transition-colors"
            >
              <div 
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop')` 
                }}
              />
              <div className="absolute inset-0 bg-gym-black/10 dark:bg-gym-black/30 transition-colors" />
            </div>

            {/* Overlapping Secondary Image */}
            <div 
              className="absolute w-[60%] h-[60%] right-0 bottom-0 border border-gym-gold/20 dark:border-gym-silver/20 shadow-2xl overflow-hidden glass-brand group select-none"
            >
              <div 
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop')` 
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gym-black/50 dark:from-gym-black/75 via-transparent to-transparent transition-colors" />
            </div>

            {/* Accent Floating Badge */}
            <div className="absolute left-[5%] bottom-[8%] bg-gym-gold dark:bg-gym-silver text-gym-black px-6 py-4 font-display font-black tracking-widest text-xs uppercase shadow-xl flex flex-col items-center justify-center text-center transition-colors duration-1000">
              <span className="text-xl">100%</span>
              <span>Premium</span>
            </div>
          </div>

          {/* Right Column: Text & Features */}
          <div className="space-y-8">
            <div className="space-y-3">
              <h4 className="text-xs font-bold font-display text-gym-gold dark:text-gym-silver uppercase tracking-[0.25em] transition-colors">
                Discover Good Life
              </h4>
              <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight leading-tight text-gym-black dark:text-white transition-colors">
                WE DO NOT DO AVERAGE.<br />
                <span className="text-brand-gradient">WE FORGE ICONS.</span>
              </h2>
              <p className="text-sm md:text-base text-gym-black/70 dark:text-gym-grey-muted font-medium leading-relaxed transition-colors">
                Good Life Fitness represents the pinnacle of physical engineering. Our facility is meticulously designed to support professional athletes and fitness enthusiasts who refuse to compromise on quality, privacy, and results.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 gap-4">
              {highlights.map((item, index) => (
                <FeatureCard 
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  desc={item.desc}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
