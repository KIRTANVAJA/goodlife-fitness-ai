import React from 'react';
import { ArrowRight } from 'lucide-react';

const PremiumButton = ({ 
  children, 
  onClick, 
  variant = 'gold', 
  className = '', 
  icon: IconComponent = ArrowRight,
  showIcon = true,
  type = 'button'
}) => {
  
  const baseStyles = 'relative inline-flex items-center justify-center font-display font-semibold tracking-wider uppercase text-xs transition-all duration-500 py-3.5 px-7 rounded-none overflow-hidden select-none active:scale-[0.98] group';
  
  const variants = {
    gold: 'bg-gold-metallic-gradient dark:bg-silver-metallic-gradient text-gym-black shadow-lg shadow-gym-gold/15 dark:shadow-gym-silver/10 hover:shadow-gym-gold/30 dark:hover:shadow-gym-silver/20 hover:scale-[1.03]',
    outline: 'border border-gym-gold dark:border-gym-silver text-gym-gold dark:text-gym-silver bg-transparent hover:bg-gym-gold dark:hover:bg-gym-silver hover:text-gym-black dark:hover:text-gym-black hover:scale-[1.03]',
    glass: 'glass-brand text-gym-black dark:text-white hover:border-gym-gold dark:hover:border-gym-silver hover:text-gym-gold dark:hover:text-gym-silver hover:scale-[1.03]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {/* Sliding glow effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
      
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {showIcon && IconComponent && <IconComponent size={14} className="transition-transform duration-300 group-hover:translate-x-1" />}
      </span>

      {/* Decorative corners for the "luxury ticket/badge" feel */}
      <span className="absolute top-0 left-0 w-1 h-1 border-t border-l border-current opacity-60" />
      <span className="absolute top-0 right-0 w-1 h-1 border-t border-r border-current opacity-60" />
      <span className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-current opacity-60" />
      <span className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-current opacity-60" />
    </button>
  );
};

export default PremiumButton;
