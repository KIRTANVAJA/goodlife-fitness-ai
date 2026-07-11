import React, { useState, useContext } from 'react';
import { Check, Star, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { ContentContext } from '../context/ContentContext';
import { analyticsTracker } from '../utils/analytics';

const PricingCard = ({ plan, cycle, onSelect, isPopular }) => {
  let price = plan.priceMonthly;
  let periodLabel = '/ mo';
  let equivalentMonthly = plan.priceMonthly;
  let savingsText = '';

  if (cycle === 'quarterly') {
    price = plan.priceQuarterly;
    periodLabel = '/ quarter';
    equivalentMonthly = Math.round(plan.priceQuarterly / 3);
    const baseCost = plan.priceMonthly * 3;
    const discount = Math.round((1 - plan.priceQuarterly / baseCost) * 100);
    if (discount > 0) savingsText = `Save ${discount}%`;
  } else if (cycle === 'yearly') {
    price = plan.priceYearly;
    periodLabel = '/ yr';
    equivalentMonthly = Math.round(plan.priceYearly / 12);
    const baseCost = plan.priceMonthly * 12;
    const discount = Math.round((1 - plan.priceYearly / baseCost) * 100);
    if (discount > 0) savingsText = `Save ${discount}%`;
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      style={{ borderRadius: 'var(--button-radius)' }}
      className={`relative flex flex-col justify-between p-8 glass-brand transition-all duration-300 h-full ${
        isPopular 
          ? 'border-gym-gold dark:border-gym-silver shadow-xl shadow-gym-gold/5 dark:shadow-gym-silver/5 scale-100 lg:scale-[1.03]' 
          : 'hover:border-gym-gold/30 dark:hover:border-white/10'
      }`}
    >
      {isPopular && (
        <div 
          style={{ borderRadius: 'var(--button-radius)' }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-metallic-gradient dark:bg-silver-metallic-gradient text-gym-black text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 flex items-center gap-1 shadow-lg shadow-gym-gold/20 dark:shadow-gym-silver/20 transition-all duration-1000"
        >
          <Star size={10} className="fill-current" />
          Recommended Tier
        </div>
      )}


      {/* Pricing Header */}
      <div className="space-y-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-gym-gold dark:text-gym-silver tracking-widest block mb-1 transition-colors duration-1000">
            {plan.tagline}
          </span>
          <h3 className="text-xl font-black font-display uppercase tracking-wider text-gym-black dark:text-white transition-colors duration-1000">
            {plan.name}
          </h3>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-semibold text-gym-gold dark:text-gym-silver transition-colors duration-1000">₹</span>
            <span className="text-4xl md:text-5xl font-black font-display text-gym-black dark:text-white tracking-tight transition-colors duration-1000">
              {price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-gym-grey-secondary lowercase font-medium transition-colors duration-1000">{periodLabel}</span>
          </div>
          
          {cycle !== 'monthly' && (
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-[10px] text-gym-grey-muted font-semibold uppercase tracking-wider">
                Equivalent to ₹{equivalentMonthly.toLocaleString('en-IN')}/mo
              </span>
              {savingsText && (
                <span className="text-[9px] uppercase font-black text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 border border-green-200 dark:border-green-900/40">
                  {savingsText}
                </span>
              )}
            </div>
          )}
        </div>

        <p className="text-xs text-gym-grey-secondary leading-relaxed font-medium pt-2 transition-colors duration-1000">
          {plan.desc}
        </p>

        {/* Feature List */}
        <div className="space-y-3 pt-6 border-t border-gym-gold/20 dark:border-gym-border/40 transition-colors duration-1000">
          {plan.features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs leading-tight transition-colors duration-1000">
              <Check size={14} className="text-gym-gold dark:text-gym-silver flex-shrink-0 mt-0.5 transition-colors duration-1000" />
              <span className="text-gym-grey-secondary font-medium transition-colors duration-1000">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-8 mt-auto">
        <button
          onClick={() => onSelect(plan.name, price, cycle)}
          style={{ borderRadius: 'var(--button-radius)' }}
          className={`w-full py-3.5 font-display font-bold uppercase text-[10px] tracking-widest transition-all duration-500 flex items-center justify-center gap-2 ${
            isPopular 
              ? 'bg-gold-metallic-gradient dark:bg-silver-metallic-gradient text-gym-black shadow-lg shadow-gym-gold/15 dark:shadow-gym-silver/15 hover:scale-[1.02]' 
              : 'bg-gym-gold/10 hover:bg-gym-gold dark:bg-white/5 dark:hover:bg-white border border-gym-gold/30 hover:border-gym-gold dark:border-white/10 dark:hover:border-white text-gym-gold hover:text-gym-black dark:text-white dark:hover:text-gym-black'
          }`}
        >
          {plan.btnText}
        </button>
      </div>
    </motion.div>
  );
};

const Pricing = () => {
  const { content } = useContext(ContentContext);
  const [cycle, setCycle] = useState('monthly'); // monthly, quarterly, yearly

  const plans = content.pricing;
  const contactInfo = content.contact;

  const handleSelectPlan = (name, price, activeCycle) => {
    analyticsTracker.track('whatsapp_click', { 
      source: 'Pricing Card', 
      plan: name, 
      cycle: activeCycle 
    });
    const cycleNames = {
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      yearly: 'Yearly'
    };
    const text = encodeURIComponent(`Hello Good Life Fitness! I'm interested in booking the "${name}" (${cycleNames[activeCycle]} Membership) priced at ₹${price.toLocaleString('en-IN')}. Please guide me on signup.`);
    window.open(`https://wa.me/${contactInfo.whatsApp}?text=${text}`, '_blank');
  };

  return (
    <section id="pricing" className="relative py-24 bg-gym-gold/[0.01] dark:bg-gym-dark/20 border-b border-gym-gold/10 dark:border-b-gym-border transition-colors duration-1000">
      {/* Glow flares */}
      <div className="absolute top-0 right-0 w-[35vw] h-[35vw] bg-gym-gold-dark/5 dark:bg-gym-silver-dark/5 rounded-full filter blur-[120px] pointer-events-none transition-colors duration-1000" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <h4 className="text-xs font-bold font-display text-gym-gold dark:text-gym-silver uppercase tracking-[0.25em] transition-colors duration-1000">
            MEMBERSHIP TIERS
          </h4>
          <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight text-gym-black dark:text-white transition-colors duration-1000">
            INVEST IN <span className="text-brand-gradient">YOUR LEGACY</span>
          </h2>
          <p className="text-xs md:text-sm text-gym-grey-secondary max-w-xl mx-auto font-medium transition-colors duration-1000">
            Flexible premium memberships with transparent pricing. Zero hidden charges. Focus entirely on your physique.
          </p>
        </div>

        {/* Pricing Duration Toggle Switch - 3 Segment Tab Switcher */}
        <div className="flex items-center justify-center mb-16 select-none">
          <div 
            style={{ borderRadius: 'var(--button-radius)' }}
            className="flex bg-gym-gold/5 dark:bg-gym-card border border-gym-gold/20 dark:border-gym-border p-1"
          >
            {[
              { id: 'monthly', label: 'Monthly' },
              { id: 'quarterly', label: 'Quarterly' },
              { id: 'yearly', label: 'Yearly' }
            ].map((segment) => (
              <button
                key={segment.id}
                onClick={() => setCycle(segment.id)}
                style={{ borderRadius: 'var(--button-radius)' }}
                className={`px-6 py-2 text-xs uppercase tracking-widest font-black transition-all duration-300 ${
                  cycle === segment.id
                    ? 'bg-gym-gold dark:bg-gym-silver text-gym-black shadow-md'
                    : 'text-gym-grey-muted hover:text-gym-black dark:hover:text-white'
                }`}
              >
                {segment.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              plan={plan}
              cycle={cycle}
              isPopular={plan.highlighted !== undefined ? plan.highlighted : index === 1}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
