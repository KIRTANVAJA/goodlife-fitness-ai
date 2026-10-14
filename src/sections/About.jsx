import React from 'react';
import { Award, Zap, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, desc }) => {
  return (
    <motion.div 
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-[#FFFFFF] dark:bg-[#1E211D] p-5 rounded-2xl border border-[#E5E1D7] dark:border-[#2E322C] border-l-4 border-l-[#173F35] dark:border-l-[#C6A66B] shadow-xs flex items-start gap-4"
    >
      <div className="w-10 h-10 rounded-xl bg-[#173F35]/10 dark:bg-[#173F35]/25 border border-[#173F35]/20 dark:border-[#26745A]/40 flex items-center justify-center text-[#173F35] dark:text-[#C6A66B] shrink-0">
        <Icon size={19} className="stroke-[1.8]" />
      </div>
      <div>
        <h4 className="font-display font-bold uppercase tracking-wider text-xs sm:text-sm text-[#171916] dark:text-[#F5F1E8]">
          {title}
        </h4>
        <p className="text-xs text-[#85877F] dark:text-[#A8AAA3] mt-1 leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  );
};

const About = () => {
  const highlights = [
    {
      icon: Zap,
      title: "Biomechanical Arsenal",
      desc: "Train on imported state-of-the-art Arsenal Strength and Panatta biomechanically calibrated resistance lines."
    },
    {
      icon: Award,
      title: "ISSA & ACSM Certified Coaches",
      desc: "Gain scientific movement analysis, form correction cues, and personalized athletic progression."
    },
    {
      icon: Sparkles,
      title: "Luxury Recovery Suites",
      desc: "Rejuvenate in our private cryotherapy tanks, infrared saunas, steam rooms, and sports massage zones."
    },
    {
      icon: Heart,
      title: "Clinical Nutrition Concierge",
      desc: "Fuel up at our in-house health cafe serving customized macronutrient meal preps and performance supplements."
    }
  ];

  return (
    <section id="about" className="relative py-24 overflow-hidden bg-[#F5F1E8] dark:bg-[#171916] border-t border-[#E5E1D7] dark:border-[#2E322C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Images Collage */}
          <div className="relative h-[440px] sm:h-[520px] flex items-center justify-center">
            {/* Primary Main Image */}
            <div className="absolute w-[75%] h-[80%] left-0 top-0 rounded-3xl border border-[#E5E1D7] dark:border-[#2E322C] shadow-lg overflow-hidden group select-none">
              <div 
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop')` 
                }}
              />
              <div className="absolute inset-0 bg-[#171916]/15 transition-colors" />
            </div>

            {/* Overlapping Secondary Image */}
            <div className="absolute w-[55%] h-[55%] right-0 bottom-0 rounded-2xl border-2 border-[#FFFFFF] dark:border-[#1E211D] shadow-2xl overflow-hidden group select-none">
              <div 
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop')` 
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171916]/60 via-transparent to-transparent" />
            </div>

            {/* Accent Floating Badge */}
            <div className="absolute left-[8%] bottom-[10%] bg-[#173F35] text-[#F5F1E8] px-5 py-3.5 rounded-2xl border border-[#26745A]/40 shadow-xl flex flex-col items-center justify-center text-center">
              <span className="text-lg font-black text-[#C6A66B]">100%</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#F5F1E8]">Sanctuary</span>
            </div>
          </div>

          {/* Right Column: Text & Features */}
          <div className="space-y-7">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C6A66B]">
                The Sanctuary Standard
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold font-display uppercase tracking-tight text-[#171916] dark:text-[#F5F1E8] leading-tight">
                We Do Not Do Ordinary. <br />
                <span className="text-[#173F35] dark:text-[#C6A66B] font-editorial italic font-normal lowercase tracking-normal text-4xl sm:text-6xl">
                  We Engineer
                </span> Performance.
              </h2>
              <p className="text-xs sm:text-sm text-[#85877F] dark:text-[#A8AAA3] font-normal leading-relaxed">
                Good Life Fitness represents the pinnacle of physical engineering. Our facility is designed to support individuals who refuse to compromise on biomechanical precision, privacy, and scientific results.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 gap-3.5">
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
