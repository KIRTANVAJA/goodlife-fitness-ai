import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { startAdminSession } from '../utils/session';

/**
 * Premium Admin Authentication Modal.
 * Prompts the user for the admin passcode, performs local verification, 
 * sets the temporary session state, and redirects to the dashboard.
 */
const AdminAuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    setIsError(false);

    // Stored admin passcode
    if (passcode === '123456') {
      setIsSuccess(true);
      startAdminSession();
      setTimeout(() => {
        setIsSuccess(false);
        setPasscode('');
        onClose();
        navigate('/glf-admin-panel');
      }, 700);
    } else {
      setIsError(true);
      // Brief timeout to reset error and clear input after shake animation
      setTimeout(() => {
        setIsError(false);
        setPasscode('');
      }, 600);
    }
  };

  // Modal animation variants
  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      x: 0
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      x: 0,
      transition: { type: 'spring', damping: 25, stiffness: 350 }
    },
    shake: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: [0, -10, 10, -10, 10, -5, 5, 0],
      transition: { duration: 0.4, ease: 'easeInOut' }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Backdrop Blur Screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Card Layout */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate={isError ? 'shake' : 'visible'}
            exit="hidden"
            className="relative z-10 w-full max-w-sm mx-4 p-8 bg-white/95 backdrop-blur-xl border border-[#D4AF37]/30 shadow-[0_25px_60px_rgba(212,175,55,0.18)] text-zinc-800 rounded-none overflow-hidden select-none"
          >
            {/* Ambient gold glow in top corner */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#D4AF37]/10 rounded-full filter blur-2xl pointer-events-none" />

            {/* Close Cross Button */}
            <button 
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-[#D4AF37] transition-colors p-1"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Header & Icon */}
            <div className="text-center space-y-3 mb-6">
              <motion.div 
                animate={isSuccess ? { scale: [1, 1.15, 1], rotate: [0, 360] } : {}}
                className={`w-16 h-16 rounded-full border bg-zinc-50 flex items-center justify-center mx-auto shadow-sm transition-colors duration-300 ${
                  isError 
                    ? 'border-red-500 text-red-500 shadow-red-500/10' 
                    : isSuccess 
                      ? 'border-green-500 text-green-500 shadow-green-500/10' 
                      : 'border-[#D4AF37]/30 text-[#D4AF37] shadow-[#D4AF37]/5'
                }`}
              >
                {isSuccess ? (
                  <Unlock size={24} className="stroke-[2.5]" />
                ) : (
                  <Lock size={24} className={`stroke-[2.5] ${isOpen && !isError ? 'animate-pulse' : ''}`} />
                )}
              </motion.div>
              <h2 className="font-display font-black text-lg uppercase tracking-[0.2em] text-zinc-950">
                GLF ADMIN ACCESS
              </h2>
              <p className="text-[9px] uppercase font-black text-zinc-500 tracking-widest">
                Authentication Required
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  Admin Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="••••••"
                    maxLength={12}
                    required
                    autoFocus
                    className={`w-full bg-zinc-50 border ${
                      isError 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                        : 'border-zinc-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10'
                    } px-4 py-3 text-base text-center font-mono tracking-[0.3em] font-black focus:outline-none transition-all pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#D4AF37] transition-colors p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                
                {/* Incorrect Code Error text */}
                <AnimatePresence>
                  {isError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-center gap-1 justify-center text-red-500 font-bold uppercase tracking-widest text-[9px] mt-2"
                    >
                      <AlertCircle size={10} />
                      <span>Incorrect Access Code</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isSuccess}
                  style={{ borderRadius: 'var(--button-radius, 0px)' }}
                  className="w-full py-3 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA7C11] text-zinc-950 font-display font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] active:scale-98 transition-all shadow-md shadow-[#D4AF37]/15 disabled:opacity-90"
                >
                  {isSuccess ? 'Access Granted' : 'Access Dashboard'}
                </button>
                
                <button
                  type="button"
                  onClick={onClose}
                  style={{ borderRadius: 'var(--button-radius, 0px)' }}
                  className="w-full py-3 bg-transparent border border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 font-display font-bold uppercase tracking-widest text-[11px] transition-all text-center"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminAuthModal;
