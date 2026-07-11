import React, { useState, useContext } from 'react';
import { Mail, Phone, MapPin, Clock, Send, ShieldCheck } from 'lucide-react';
import { ContentContext } from '../context/ContentContext';
import { analyticsTracker } from '../utils/analytics';

const Contact = () => {
  const { content } = useContext(ContentContext);
  const contactInfo = content.contact;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    plan: 'Elite Executive Club',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { name, phone, plan, message } = formData;
    analyticsTracker.track('whatsapp_click', { source: 'Contact Form', selectedPlan: plan });

    let text = `Hello Good Life Fitness! \n\nMy name is *${name}*.\n*Phone:* ${phone}\n*Plan of Interest:* ${plan}`;
    
    if (message.trim()) {
      text += `\n*Message:* ${message}`;
    }

    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${contactInfo.whatsApp}?text=${encodedText}`;
    
    window.open(waUrl, '_blank');
    
    // Clear form
    setFormData({
      name: '',
      phone: '',
      plan: 'Elite Executive Club',
      message: ''
    });
  };

  return (
    <section id="contact" className="relative py-24 bg-transparent overflow-hidden border-t border-gym-gold/10 dark:border-gym-border transition-colors duration-1000">
      {/* Light glow flares */}
      <div className="absolute top-[20%] -right-[15vw] w-[40vw] h-[40vw] bg-gym-gold/5 dark:bg-gym-silver/5 rounded-full filter blur-[150px] pointer-events-none transition-colors duration-1000" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <h4 className="text-xs font-bold font-display text-gym-gold dark:text-gym-silver uppercase tracking-[0.25em] transition-colors">
            VISIT THE SANCTUARY
          </h4>
          <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight text-gym-black dark:text-white leading-tight transition-colors">
            SECURE YOUR <span className="text-brand-gradient">MEMBERSHIP</span>
          </h2>
          <p className="text-xs md:text-sm text-gym-grey-secondary max-w-xl mx-auto font-medium transition-colors">
            Fill in your credentials to schedule your private tour orientation. Redirects straight to WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Inquiry Form Card */}
          <div 
            style={{ borderRadius: 'var(--button-radius)' }}
            className="lg:col-span-7 bg-white dark:bg-gym-card border border-gym-gold/10 dark:border-gym-border p-8 relative flex flex-col justify-between transition-colors"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gym-gold/5 dark:bg-gym-silver/5 rounded-full filter blur-2xl pointer-events-none transition-colors duration-1000" />
            
            <div className="relative z-10">
              <h3 className="font-display font-black text-sm uppercase text-gym-black dark:text-white tracking-widest mb-6 pb-3 border-b border-gym-gold/10 dark:border-gym-border/40 transition-colors">
                BOOK TOUR PASS / TRIAL
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-gym-grey-muted transition-colors">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      placeholder="e.g. Rohan Sharma"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      style={{ borderRadius: 'var(--button-radius)' }}
                      className="w-full bg-white dark:bg-gym-black border border-gym-gold/15 dark:border-gym-border px-4 py-3 text-xs text-gym-black dark:text-white focus:outline-none focus:border-gym-gold dark:focus:border-gym-silver transition-colors font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-gym-grey-muted transition-colors">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="e.g. +91 99999 99999"
                      pattern="[0-9+ ]{10,17}"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      style={{ borderRadius: 'var(--button-radius)' }}
                      className="w-full bg-white dark:bg-gym-black border border-gym-gold/15 dark:border-gym-border px-4 py-3 text-xs text-gym-black dark:text-white focus:outline-none focus:border-gym-gold dark:focus:border-gym-silver transition-colors font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-gym-grey-muted transition-colors">Select Membership Level</label>
                  <select 
                    name="plan"
                    value={formData.plan}
                    onChange={handleChange}
                    style={{ borderRadius: 'var(--button-radius)' }}
                    className="w-full bg-white dark:bg-gym-black border border-gym-gold/15 dark:border-gym-border px-4 py-3 text-xs text-gym-black dark:text-white focus:outline-none focus:border-gym-gold dark:focus:border-gym-silver transition-colors font-semibold"
                  >
                    <option value="Gold Club Access" className="text-gym-black dark:text-white bg-white dark:bg-gym-black font-semibold">Gold Club Access - ₹2,499/mo</option>
                    <option value="Elite Executive Club" className="text-gym-black dark:text-white bg-white dark:bg-gym-black font-semibold">Elite Executive Club - ₹4,499/mo</option>
                    <option value="Black Label VIP Pass" className="text-gym-black dark:text-white bg-white dark:bg-gym-black font-semibold">Black Label VIP Pass - ₹8,999/mo</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-gym-grey-muted transition-colors">Notes / Query (Optional)</label>
                  <textarea 
                    name="message"
                    rows="4"
                    placeholder="e.g. Preferred timings, physical goals..."
                    value={formData.message}
                    onChange={handleChange}
                    style={{ borderRadius: 'var(--button-radius)' }}
                    className="w-full bg-white dark:bg-gym-black border border-gym-gold/15 dark:border-gym-border px-4 py-3 text-xs text-gym-black dark:text-white focus:outline-none focus:border-gym-gold dark:focus:border-gym-silver transition-colors resize-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  style={{ borderRadius: 'var(--button-radius)' }}
                  className="w-full bg-gold-metallic-gradient dark:bg-silver-metallic-gradient text-gym-black font-display font-black uppercase text-[10px] tracking-widest py-4 flex items-center justify-center gap-1.5 shadow-lg shadow-gym-gold/15 dark:shadow-gym-silver/10 transition-all duration-300 hover:scale-[1.01]"
                >
                  <Send size={12} />
                  Submit Booking via WhatsApp
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Physical Details Card */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div 
              style={{ borderRadius: 'var(--button-radius)' }}
              className="bg-white dark:bg-gym-card border border-gym-gold/10 dark:border-gym-border p-8 flex-grow space-y-6 relative transition-colors"
            >
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gym-gold/5 dark:bg-gym-silver/5 rounded-full filter blur-xl pointer-events-none transition-colors duration-1000" />

              <h3 className="font-display font-black text-sm uppercase text-gym-black dark:text-white tracking-widest pb-3 border-b border-gym-gold/10 dark:border-gym-border/40 transition-colors">
                HEADQUARTERS DETAILS
              </h3>

              <div className="space-y-5">
                {/* Location */}
                <div className="flex items-start gap-4 text-xs font-medium">
                  <div className="w-10 h-10 rounded-lg bg-gym-gold/10 dark:bg-gym-silver/10 border border-gym-gold/20 dark:border-gym-silver/20 flex items-center justify-center text-gym-gold dark:text-gym-silver flex-shrink-0 transition-colors">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gym-gold dark:text-gym-silver tracking-widest mb-0.5 transition-colors">Location Address</span>
                    <p className="text-gym-grey-secondary dark:text-gym-grey-muted leading-relaxed transition-colors">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>

                {/* Phones */}
                <div className="flex items-start gap-4 text-xs font-medium">
                  <div className="w-10 h-10 rounded-lg bg-gym-gold/10 dark:bg-gym-silver/10 border border-gym-gold/20 dark:border-gym-silver/20 flex items-center justify-center text-gym-gold dark:text-gym-silver flex-shrink-0 transition-colors">
                    <Phone size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gym-gold dark:text-gym-silver tracking-widest mb-0.5 transition-colors">Contact Hotline</span>
                    <p className="text-gym-grey-secondary dark:text-gym-grey-muted leading-normal transition-colors">
                      {contactInfo.phone} {contactInfo.phone2 && `\u2022 ${contactInfo.phone2}`}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 text-xs font-medium">
                  <div className="w-10 h-10 rounded-lg bg-gym-gold/10 dark:bg-gym-silver/10 border border-gym-gold/20 dark:border-gym-silver/20 flex items-center justify-center text-gym-gold dark:text-gym-silver flex-shrink-0 transition-colors">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gym-gold dark:text-gym-silver tracking-widest mb-0.5 transition-colors">Email Support</span>
                    <p className="text-gym-grey-secondary dark:text-gym-grey-muted leading-normal transition-colors">
                      {contactInfo.email}
                    </p>
                  </div>
                </div>

                {/* Timings */}
                <div className="flex items-start gap-4 text-xs font-medium">
                  <div className="w-10 h-10 rounded-lg bg-gym-gold/10 dark:bg-gym-silver/10 border border-gym-gold/20 dark:border-gym-silver/20 flex items-center justify-center text-gym-gold dark:text-gym-silver flex-shrink-0 transition-colors">
                    <Clock size={16} />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gym-gold dark:text-gym-silver tracking-widest mb-0.5 transition-colors">Club Operating Hours</span>
                    <p className="text-gym-grey-secondary dark:text-gym-grey-muted leading-relaxed transition-colors">
                      {contactInfo.timingsLine1} <br />
                      {contactInfo.timingsLine2}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gym-gold/10 dark:border-gym-border/40 flex items-center gap-2 text-[10px] text-gym-grey-secondary dark:text-gym-grey-muted uppercase font-bold tracking-widest transition-colors">
                <ShieldCheck size={16} className="text-gym-gold dark:text-gym-silver transition-colors" /> VIP Valet Parking is free for members
              </div>
            </div>
          </div>

        </div>

        {/* Google Map Section - Dark Inverted styled wrapper */}
        <div 
          style={{ borderRadius: 'var(--button-radius)' }}
          className="mt-12 h-[350px] w-full border border-gym-gold/15 dark:border-gym-border overflow-hidden relative shadow-xl transition-all duration-1000"
        >
          <iframe 
            title="Good Life Fitness Gym Location Map"
            src={contactInfo.googleMapsSrc}
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            className="w-full h-full filter transition-all duration-1000 dark:invert-[90%] dark:hue-rotate-[180deg] dark:contrast-[120%]"
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>
    </section>
  );
};

export default Contact;
