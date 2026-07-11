import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

const WhatsAppWidget = ({ theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('General Membership Inquiry');
  const [customMsg, setCustomMsg] = useState('');

  const WHATSAPP_NUMBER = '919999999999'; // Default Indian contact code + number

  const topics = [
    { label: '🎟️ Claim Free Trial Pass', text: 'I want to claim my 1-Day Free VIP Access Pass!' },
    { label: '💎 Luxury Membership Plans', text: 'Please send details about the Elite & Black VIP membership tiers.' },
    { label: '🏋️ Personal Coach Inquiry', text: 'I am looking for an Elite Personal Coach for fat-loss / muscle-gain.' },
    { label: '💬 General Query', text: 'I have a few questions about gym timings and facilities.' }
  ];

  const handleSend = (e) => {
    e.preventDefault();
    
    // Choose which text to send
    const chosenTopicText = topics.find(t => t.label.includes(selectedTopic) || selectedTopic === t.label)?.text || selectedTopic;
    let fullText = `Hello Good Life Fitness! \n\nMy name is *${name || 'Guest'}*.\n*Query:* ${chosenTopicText}`;
    
    if (customMsg.trim()) {
      fullText += `\n*Note:* ${customMsg}`;
    }

    const encodedText = encodeURIComponent(fullText);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    
    window.open(waUrl, '_blank');
    setIsOpen(false);
    setName('');
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Expanded Widget Box */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[350px] max-w-[calc(100vw-2rem)] glass-brand rounded-2xl shadow-2xl overflow-hidden animate-slide-up duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-white to-[#F5F5F7] dark:from-gym-black dark:to-gym-card p-4 border-b border-gym-gold/15 dark:border-gym-border flex justify-between items-center transition-colors duration-1000">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gold-metallic-gradient dark:bg-silver-metallic-gradient flex items-center justify-center text-gym-black font-bold text-sm shadow-md">
                  GL
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gym-black rounded-full" />
              </div>
              <div>
                <h4 className="text-sm font-semibold font-display tracking-wide text-gym-black dark:text-white transition-colors duration-1000">GLF CONCIERGE</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-green-600 dark:text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
                  Online | Typically replies in 5m
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gym-black/50 dark:text-gym-grey-muted hover:text-gym-black dark:hover:text-white transition-colors duration-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSend} className="p-5 space-y-4 bg-[#FAFAFA]/95 dark:bg-gym-card/95 transition-colors duration-1000">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gym-black/60 dark:text-gym-grey-muted mb-1 font-semibold">Your Name</label>
              <input
                type="text"
                placeholder="e.g., Rohan Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white dark:bg-gym-black border border-gym-gold/15 dark:border-gym-border rounded-lg px-3 py-2 text-sm text-gym-black dark:text-white focus:outline-none focus:border-gym-gold dark:focus:border-gym-silver transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gym-black/60 dark:text-gym-grey-muted mb-1 font-semibold">What are you interested in?</label>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                {topics.map((topic, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedTopic(topic.label)}
                    className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-all duration-300 ${
                      selectedTopic === topic.label 
                        ? 'bg-gym-gold/10 dark:bg-gym-silver/10 border-gym-gold dark:border-gym-silver text-gym-gold dark:text-gym-silver font-medium shadow-sm' 
                        : 'bg-white dark:bg-gym-black/40 border-gym-gold/10 dark:border-gym-border text-gym-black/70 dark:text-gym-grey-muted hover:text-gym-black dark:hover:text-white hover:border-gym-gold/30 dark:hover:border-gym-border/80'
                    }`}
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gym-black/60 dark:text-gym-grey-muted mb-1 font-semibold">Additional details (Optional)</label>
              <textarea
                placeholder="e.g., Preferred slot timings, health goals..."
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                rows="2"
                className="w-full bg-white dark:bg-gym-black border border-gym-gold/15 dark:border-gym-border rounded-lg px-3 py-2 text-sm text-gym-black dark:text-white focus:outline-none focus:border-gym-gold dark:focus:border-gym-silver transition-all duration-300 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gold-metallic-gradient dark:bg-silver-metallic-gradient text-gym-black font-semibold text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-200 shadow-lg shadow-gym-gold/10 dark:shadow-gym-silver/10"
            >
              <Send size={15} />
              Start Chat on WhatsApp
            </button>
          </form>
        </div>
      )}

      {/* Floating Circle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 group relative"
        aria-label="Contact Concierge"
      >
        <MessageCircle size={28} className="transition-transform group-hover:rotate-12" />
        
        {/* Glow effect on idle */}
        <span className="absolute -inset-1 rounded-full bg-green-500/30 -z-10 animate-ping opacity-60" />
        
        {/* Tiny Tooltip */}
        {!isOpen && (
          <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-white/95 dark:bg-gym-black/90 border border-gym-gold/20 dark:border-gym-silver/20 text-gym-gold dark:text-gym-silver text-[11px] px-3 py-1.5 rounded-lg whitespace-nowrap font-medium tracking-wide shadow-xl flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <Sparkles size={12} className="animate-pulse" />
            Book Free VIP Pass
          </div>
        )}
      </button>
    </div>
  );
};

export default WhatsAppWidget;
