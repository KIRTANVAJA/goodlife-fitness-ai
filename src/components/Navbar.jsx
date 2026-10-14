import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X, Dumbbell, Sparkles, User, LogOut, Camera, Sun, Moon, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentContext } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import UserAuthModal from './UserAuthModal';

const Navbar = ({ theme, onAdminTrigger }) => {
  const { content, updateThemeSettings } = useContext(ContentContext);
  const { user, logout, isAuthenticated, isPremium, upgradeToPremium } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  // Logo 5-click counter for secret admin access
  const [logoClicks, setLogoClicks] = useState(0);
  const [lastLogoClickTime, setLastLogoClickTime] = useState(0);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'AI Coach', path: '/ai-coach', badge: 'PRO' },
    { label: 'Exercises', path: '/exercises' },
    { label: 'Diet Planner', path: '/#diet' },
    { label: 'BMI Calc', path: '/#bmi' },
    { label: 'History', path: '/workout/history' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastLogoClickTime < 3000) {
      const clicks = logoClicks + 1;
      setLogoClicks(clicks);
      if (clicks >= 5) {
        setLogoClicks(0);
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
    navigate('/');
  };

  const isLight = content.themeSettings?.lightLuxuryTheme ?? true;

  const handleToggleTheme = () => {
    updateThemeSettings({
      ...content.themeSettings,
      lightLuxuryTheme: !isLight,
    });
  };

  const handleNavClick = (path) => {
    setIsOpen(false);
    if (path.startsWith('/#')) {
      const hash = path.substring(2);
      if (location.pathname === '/') {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      navigate(path);
    }
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      await upgradeToPremium();
    } catch (err) {
      console.error('Upgrade failed:', err);
    } finally {
      setUpgrading(false);
    }
  };

  const isNavItemActive = (itemPath) => {
    if (itemPath === '/') {
      return location.pathname === '/' && !location.hash;
    }
    if (itemPath.startsWith('/#')) {
      return location.hash === itemPath.substring(1);
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F5F1E8]/90 dark:bg-[#171916]/95 backdrop-blur-md py-3 shadow-[0_2px_12px_rgba(23,25,22,0.04)] border-b border-[#E5E1D7] dark:border-[#2E322C]'
            : 'bg-[#F5F1E8]/75 dark:bg-[#171916]/80 backdrop-blur-sm py-4 border-b border-[#E5E1D7]/60 dark:border-[#2E322C]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo - Luxury Monogram Treatment */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 text-left group focus:outline-none"
            aria-label="Good Life Fitness AI Home"
          >
            <div className="w-9 h-9 rounded-xl bg-[#173F35] flex items-center justify-center text-[#F5F1E8] shadow-sm transition-transform duration-300 group-hover:scale-105 border border-[#173F35]/20">
              <Dumbbell size={18} className="stroke-[2.2] text-[#C6A66B]" />
            </div>
            <div>
              <span className="block text-sm font-extrabold tracking-tight text-[#171916] dark:text-[#F5F1E8] leading-tight">
                GOOD LIFE
              </span>
              <span className="block text-[9px] font-semibold text-[#C6A66B] tracking-[0.22em] -mt-0.5 uppercase">
                FITNESS AI
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => {
              const active = isNavItemActive(item.path);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`text-[11px] uppercase tracking-[0.16em] font-semibold transition-colors duration-200 flex items-center gap-1.5 py-1 relative ${
                    active
                      ? 'text-[#173F35] dark:text-[#F5F1E8] font-bold'
                      : 'text-[#85877F] hover:text-[#171916] dark:text-[#A8AAA3] dark:hover:text-[#F5F1E8]'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full bg-[#173F35]/10 text-[#173F35] dark:bg-[#1F5144]/30 dark:text-[#C6A66B] text-[8.5px] font-bold tracking-wider">
                      {item.badge}
                    </span>
                  )}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#173F35] dark:bg-[#C6A66B] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Controls: Membership, Auth, Studio Launcher */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-xl text-[#85877F] hover:text-[#171916] dark:text-[#A8AAA3] dark:hover:text-[#F5F1E8] hover:bg-[#EAE5D9]/50 dark:hover:bg-[#1E211D] transition"
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLight ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                {/* Membership Badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#173F35]/10 border border-[#173F35]/25 text-[#173F35] dark:text-[#C6A66B] text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles size={11} className="text-[#C6A66B]" />
                  AI Athlete
                </span>

                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFFFF] dark:bg-[#1E211D] border border-[#E5E1D7] dark:border-[#2E322C] text-[#171916] dark:text-[#F5F1E8] text-xs font-medium hover:border-[#173F35] transition shadow-xs"
                >
                  <User size={13} className="text-[#173F35] dark:text-[#C6A66B]" />
                  <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-[#85877F] hover:text-rose-600 hover:bg-[#EAE5D9]/50 dark:hover:bg-[#1E211D] transition"
                  title="Sign Out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-xl text-[#171916] dark:text-[#F5F1E8] hover:bg-[#EAE5D9]/60 dark:hover:bg-[#1E211D] transition border border-[#E5E1D7] dark:border-[#2E322C]"
              >
                Sign In
              </button>
            )}

            {/* AI Studio Call to Action */}
            <Link
              to="/exercises"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#173F35] hover:bg-[#1F5144] text-[#F5F1E8] text-xs font-semibold transition shadow-sm tracking-wide border border-[#173F35]/20"
            >
              <Camera size={13} className="text-[#C6A66B]" />
              AI Studio
            </Link>
          </div>

          {/* Mobile Actions Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-xl text-[#85877F] hover:text-[#171916] dark:text-[#A8AAA3]"
            >
              {isLight ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-[#171916] dark:text-[#F5F1E8] hover:bg-[#EAE5D9]/60 dark:hover:bg-[#1E211D] transition"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 top-[64px] w-full bg-[#F5F1E8] dark:bg-[#171916] z-30 lg:hidden flex flex-col justify-start p-6 border-b border-[#E5E1D7] dark:border-[#2E322C] shadow-xl overflow-y-auto"
          >
            <div className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className="flex items-center justify-between text-base font-bold text-[#171916] dark:text-[#F5F1E8] py-2.5 border-b border-[#E5E1D7]/60 dark:border-[#2E322C]"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-[#173F35]/10 text-[#173F35] dark:text-[#C6A66B] text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}

              <div className="pt-4 space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFFFFF] dark:bg-[#1E211D] border border-[#E5E1D7] dark:border-[#2E322C]">
                      <div>
                        <span className="text-xs font-bold text-[#171916] dark:text-[#F5F1E8] block">
                          {user?.name}
                        </span>
                        <span className="text-[10px] font-bold text-[#173F35] dark:text-[#C6A66B]">
                          AI Athlete (Free Access)
                        </span>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="px-3 py-1 rounded-lg bg-[#173F35] text-[#F5F1E8] text-xs font-semibold"
                      >
                        Profile
                      </Link>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="block w-full py-2.5 rounded-xl text-center text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full py-3 rounded-xl bg-[#171916] dark:bg-[#FFFFFF] text-[#F5F1E8] dark:text-[#171916] text-xs font-bold"
                  >
                    Sign In to Account
                  </button>
                )}

                <Link
                  to="/exercises"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3.5 rounded-xl bg-[#173F35] text-[#F5F1E8] text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Camera size={14} className="text-[#C6A66B]" />
                  Start AI Workout Studio
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Authentication Modal */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
