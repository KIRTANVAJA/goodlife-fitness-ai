import React from 'react';
import { Dumbbell, ShieldCheck, Instagram, Facebook, Youtube, Send } from 'lucide-react';

const Footer = () => {
  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleCTA = () => {
    const text = encodeURIComponent("Hello! I want to subscribe to the Good Life Fitness newsletter.");
    window.open(`https://wa.me/919999999999?text=${text}`, '_blank');
  };

  return (
    <footer className="bg-gym-black border-t border-gym-border pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 border-b border-gym-border/40 pb-12 mb-8">
        
        {/* Brand details (Col span 4) */}
        <div className="lg:col-span-4 space-y-4">
          <button 
            onClick={() => handleScroll('home')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-9 h-9 bg-silver-metallic-gradient rounded-lg flex items-center justify-center text-gym-black shadow-lg shadow-gym-silver/10 transition-transform duration-300 group-hover:scale-110">
              <Dumbbell size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="block text-base font-black font-display tracking-wider text-white transition-colors duration-500">
                GOOD LIFE
              </span>
              <span className="block text-[9px] font-semibold text-gym-silver tracking-[0.22em] -mt-1 flex items-center gap-0.5 transition-colors duration-500">
                FITNESS <ShieldCheck size={9} className="fill-gym-silver stroke-gym-black" />
              </span>
            </div>
          </button>
          
          <p className="text-xs text-gym-grey-muted leading-relaxed font-medium">
            India's ultra-premium fitness sanctuary. Meticulously engineered biomechanical weights, recovery cryo and sauna lounges, and sports nutrition plans designed for high performers.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3 pt-2">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-gym-card border border-gym-border hover:border-gym-silver hover:text-gym-silver text-white flex items-center justify-center transition-all duration-300"
              aria-label="Follow us on Instagram"
            >
              <Instagram size={14} />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-gym-card border border-gym-border hover:border-gym-silver hover:text-gym-silver text-white flex items-center justify-center transition-all duration-300"
              aria-label="Follow us on Facebook"
            >
              <Facebook size={14} />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-gym-card border border-gym-border hover:border-gym-silver hover:text-gym-silver text-white flex items-center justify-center transition-all duration-300"
              aria-label="Follow us on Youtube"
            >
              <Youtube size={14} />
            </a>
          </div>
        </div>

        {/* Quick Links (Col span 3) */}
        <div className="lg:col-span-3 lg:col-start-6 space-y-4">
          <h4 className="font-display font-black text-xs uppercase tracking-wider text-white">
            Quick Navigation
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            {[
              { label: 'Home', id: 'home' },
              { label: 'About Club', id: 'about' },
              { label: 'Membership', id: 'pricing' },
              { label: 'Coaches', id: 'trainers' },
              { label: 'Gallery', id: 'gallery' },
              { label: 'Testimonials', id: 'testimonials' },
              { label: 'Contact', id: 'contact' }
            ].map((link, idx) => (
              <button
                key={idx}
                onClick={() => handleScroll(link.id)}
                className="text-left text-gym-grey-muted hover:text-gym-silver transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Newsletter / Join (Col span 4) */}
        <div className="lg:col-span-4 space-y-4">
          <h4 className="font-display font-black text-xs uppercase tracking-wider text-white">
            JOIN THE INNER CIRCLE
          </h4>
          <p className="text-xs text-gym-grey-muted leading-relaxed font-medium">
            Receive elite fitness blueprints, diet guides, and early access vip registration passes directly.
          </p>

          {/* Simulated Input field linking to WhatsApp */}
          <div className="flex bg-gym-card border border-gym-border p-1">
            <input 
              type="email" 
              placeholder="Your email address..."
              required
              className="w-full bg-transparent px-3 py-2 text-xs text-white focus:outline-none placeholder-gym-grey-muted/60 font-medium"
            />
            <button
              onClick={handleCTA}
              className="bg-silver-metallic-gradient text-gym-black font-display font-bold uppercase tracking-widest text-[9px] px-4 py-2 hover:scale-[1.02] transition-all flex items-center justify-center gap-1"
            >
              <Send size={10} /> Join
            </button>
          </div>
        </div>

      </div>

      {/* Copyright branding bar */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-[10px] text-gym-grey-muted uppercase font-bold tracking-widest gap-4">
        <span>&copy; {new Date().getFullYear()} Good Life Fitness Club. All Rights Reserved.</span>
        <span>Bandra West &bull; Bengaluru Central &bull; Delhi NCR</span>
      </div>
    </footer>
  );
};

export default Footer;
