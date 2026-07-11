import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Dumbbell, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentContext } from '../context/ContentContext';

const Navbar = ({ theme, onAdminTrigger }) => {
  const { content } = useContext(ContentContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Logo 5-click counter
  const [logoClicks, setLogoClicks] = useState(0);
  const [lastLogoClickTime, setLastLogoClickTime] = useState(0);

  const contactInfo = content.contact;
  const themeSettings = content.themeSettings;

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'Trainers', id: 'trainers' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'Testimonials', id: 'testimonials' },
    { label: 'Contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Check which section is in view
      const scrollPosition = window.scrollY + 120;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastLogoClickTime < 3000) {
      const clicks = logoClicks + 1;
      setLogoClicks(clicks);
      if (clicks >= 5) {
        setLogoClicks(0); // Reset clicks
        if (onAdminTrigger) {
          onAdminTrigger();
        } else {
          navigate('/glf-admin-panel');
        }
      }
    } else {
      setLogoClicks(1);
    }
    setLastLogoClickTime(now);
    scrollToSection('home');
  };

  const handleBookTrial = () => {
    const text = encodeURIComponent("Hello Good Life Fitness! I'd like to book a 1-Day Free Trial VIP Access Pass.");
    window.open(`https://wa.me/${contactInfo.whatsApp}?text=${text}`, '_blank');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
        scrolled 
          ? 'glassmorphism-nav py-4 shadow-xl' 
          : 'bg-transparent py-6 border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-2 text-left group"
          >
            <div 
              style={{ background: 'var(--accent-metallic)', borderRadius: 'var(--button-radius)' }}
              className="w-10 h-10 flex items-center justify-center text-gym-black shadow-lg transition-transform duration-300 group-hover:scale-110"
            >
              <Dumbbell size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="block text-lg font-black font-display tracking-wider text-gym-black dark:text-white transition-colors duration-500">
                GOOD LIFE
              </span>
              <span className="block text-[10px] font-semibold text-gym-gold dark:text-gym-silver tracking-[0.25em] -mt-1 flex items-center gap-0.5 transition-colors duration-500">
                FITNESS <ShieldCheck size={10} className="fill-current stroke-current dark:stroke-gym-black" />
              </span>
            </div>
          </button>

          {/* Desktop Menu Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-xs uppercase tracking-widest font-semibold font-display transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'text-gym-gold dark:text-gym-silver font-black' 
                    : 'text-gym-grey-muted hover:text-gym-black dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Action Call Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={handleBookTrial}
              style={{ background: 'var(--accent-metallic)', borderRadius: 'var(--button-radius)' }}
              className="text-gym-black font-display font-bold uppercase tracking-wider text-[11px] py-2.5 px-5 hover:scale-[1.03] transition-all duration-300 flex items-center gap-1.5 shadow-lg"
            >
              Book Free Trial
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Mobile Actions Hamburger Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 flex items-center justify-center text-gym-black dark:text-white hover:text-gym-gold dark:hover:text-gym-silver transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-[#FAFAFA]/98 dark:bg-gym-black/98 z-30 lg:hidden flex flex-col justify-center px-8 border-b border-gym-border"
          >
            <div className="space-y-6 text-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-xl uppercase tracking-widest font-bold font-display transition-colors py-2 ${
                    activeSection === item.id 
                      ? 'text-gym-gold dark:text-gym-silver text-2xl scale-105 font-black' 
                      : 'text-gym-grey-muted hover:text-gym-black dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-8">
                <button
                  onClick={handleBookTrial}
                  style={{ background: 'var(--accent-metallic)', borderRadius: 'var(--button-radius)' }}
                  className="w-full max-w-xs mx-auto text-gym-black font-display font-bold uppercase tracking-widest text-sm py-4 flex items-center justify-center gap-2 shadow-lg"
                >
                  Book Free Trial
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
