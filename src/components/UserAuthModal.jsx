import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserAuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        const res = await register(name, email, password);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Registration failed');
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Invalid email or password');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await login('demo@goodlifefitness.com', 'password123');
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Demo login failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171916]/70 backdrop-blur-sm">
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E5E1D7] shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-[#85877F] hover:text-[#171916] hover:bg-[#F5F1E8] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#173F35]/10 text-[#173F35] border border-[#173F35]/20 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-7 h-7 text-[#C6A66B]" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C6A66B] block mb-1">
            Private Member Access
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#171916]">
            {isRegister ? 'Join Good Life Club' : 'Welcome to Good Life AI'}
          </h2>
          <p className="text-xs text-[#85877F] mt-1 leading-relaxed">
            Access your AI workout coach, computer vision telemetry, and synchronized nutrition plans.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-[11px] font-bold text-[#171916] mb-1.5 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#85877F]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E1D7] text-xs bg-[#F5F1E8] focus:bg-white focus:outline-none focus:border-[#173F35] transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-[#171916] mb-1.5 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#85877F]" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E1D7] text-xs bg-[#F5F1E8] focus:bg-white focus:outline-none focus:border-[#173F35] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#171916] mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#85877F]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E1D7] text-xs bg-[#F5F1E8] focus:bg-white focus:outline-none focus:border-[#173F35] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#173F35] hover:bg-[#1f5043] text-[#F5F1E8] font-bold text-xs uppercase tracking-wider transition shadow-sm disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In to Club'}
          </button>
        </form>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E1D7]" />
          </div>
          <span className="relative bg-[#FFFFFF] px-2 text-[10px] text-[#85877F] uppercase tracking-wider font-semibold">
            Or quick demo access
          </span>
        </div>

        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-[#F5F1E8] hover:bg-[#EAE5D9] text-[#171916] border border-[#E5E1D7] font-bold text-xs transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
          Instant Demo Login (Alex Mercer)
        </button>

        <div className="text-center mt-4">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs text-[#85877F] hover:text-[#171916] transition font-medium"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAuthModal;
