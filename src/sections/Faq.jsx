import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = [
  {
    question: 'Can I freeze or pause my gym membership?',
    answer: 'Yes. Elite and Black VIP members can freeze their membership twice a year for up to 30 days total at no extra charge. Gold members can pause memberships for a minimal nominal charge of ₹500/month by submitting a pause ticket.'
  },
  {
    question: 'What is included in the 1-Day Free VIP Trial Pass?',
    answer: 'The trial pass grants you complete 24-hour access to the strength floor and cardio decks, a complimentary bio-impedance body scan assessment (InBody 570), and access to steam showers. Special spa amenities are restricted to active member packages.'
  },
  {
    question: 'Do you offer private parking space?',
    answer: 'Yes. Our premium facilities feature dedicated basement valet parking with 24/7 CCTV surveillance cameras. Parking is completely free for all active membership holders.'
  },
  {
    question: 'Can I transfer my membership to another person?',
    answer: 'Memberships can be transferred to a family member or friend. A nominal one-time transfer documentation fee of ₹1,000 is processed at the club reception desk.'
  },
  {
    question: 'Do you offer personal lockers and clean towels?',
    answer: 'Elite Executive and Black Label VIP tiers include daily towel service and private lockers. Gold members can rent standard lockers monthly or utilize daily-use digital dial locker boxes.'
  }
];

const AccordionItem = ({ item, isOpen, onClick }) => {
  return (
    <div className="bg-white dark:bg-gym-card border border-gym-gold/10 dark:border-gym-border overflow-hidden transition-all duration-300">
      
      {/* Header Button Toggle */}
      <button
        onClick={onClick}
        className="w-full p-5 flex items-center justify-between text-left hover:text-gym-gold dark:hover:text-gym-silver transition-colors focus:outline-none"
      >
        <span className="font-display font-bold uppercase text-xs md:text-sm tracking-wider text-gym-black dark:text-white hover:text-gym-gold dark:hover:text-gym-silver transition-colors pr-4">
          {item.question}
        </span>
        <div className="w-8 h-8 rounded-full bg-white dark:bg-gym-black border border-gym-gold/15 dark:border-gym-border flex items-center justify-center text-gym-gold dark:text-gym-silver flex-shrink-0 transition-colors">
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </div>
      </button>

      {/* Answer Body Expand */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-5 pt-0 border-t border-gym-gold/10 dark:border-gym-border/40 text-xs md:text-sm text-gym-black/75 dark:text-gym-grey-muted leading-relaxed font-medium transition-colors">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

const Faq = () => {
  const [openIdx, setOpenIdx] = useState(0); // Open first by default

  const handleCustomQuestion = () => {
    const text = encodeURIComponent("Hello Good Life Fitness! I have a customized question that wasn't covered in your FAQ list.");
    window.open(`https://wa.me/919999999999?text=${text}`, '_blank');
  };

  return (
    <section id="faq" className="relative py-24 bg-transparent overflow-hidden transition-colors duration-1000">
      {/* Glow overlays */}
      <div className="absolute bottom-0 left-[10vw] w-[35vw] h-[35vw] bg-gym-gold/5 dark:bg-gym-silver/5 rounded-full filter blur-[120px] pointer-events-none transition-colors duration-1000" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <h4 className="text-xs font-bold font-display text-gym-gold dark:text-gym-silver uppercase tracking-[0.25em] transition-colors">
            HAVE QUESTIONS?
          </h4>
          <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight text-gym-black dark:text-white leading-tight transition-colors">
            FREQUENTLY ASKED <span className="text-brand-gradient">ANSWERS</span>
          </h2>
        </div>

        {/* Accordions Stack */}
        <div className="space-y-4">
          {faqData.map((item, idx) => (
            <AccordionItem
              key={idx}
              item={item}
              isOpen={openIdx === idx}
              onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
            />
          ))}
        </div>

        {/* WhatsApp help callout */}
        <div className="mt-12 text-center space-y-4 bg-white dark:bg-gym-card border border-gym-gold/10 dark:border-gym-border p-6 rounded-none transition-colors">
          <div className="flex items-center justify-center gap-2 text-gym-gold dark:text-gym-silver text-xs font-bold uppercase tracking-widest transition-colors">
            <HelpCircle size={16} /> Still have questions?
          </div>
          <p className="text-xs text-gym-black/70 dark:text-gym-grey-muted font-medium transition-colors">
            Contact our 24/7 customer concierge helpdesk directly via WhatsApp chat for instant guidance.
          </p>
          <button
            onClick={handleCustomQuestion}
            className="inline-flex items-center gap-1.5 px-6 py-3 bg-gold-metallic-gradient dark:bg-silver-metallic-gradient text-gym-black font-display font-black uppercase text-[10px] tracking-widest shadow-lg shadow-gym-gold/15 dark:shadow-gym-silver/10 transition-all duration-300 hover:scale-[1.02]"
          >
            <Send size={12} /> Contact Concierge Chat
          </button>
        </div>

      </div>
    </section>
  );
};

export default Faq;
