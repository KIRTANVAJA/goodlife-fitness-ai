import React, { createContext, useState, useEffect } from 'react';
import { analyticsTracker } from '../utils/analytics';
import { 
  saveContent, 
  subscribeToContent, 
  isFirebaseConfigured, 
  getFirebaseConfig, 
  saveFirebaseConfig, 
  clearFirebaseConfig 
} from '../utils/db';

export const ContentContext = createContext();

const DEFAULT_CONTENT = {
  hero: {
    titleLine1: 'BECOME',
    titleLine2: 'UNSTOPPABLE',
    subheading: 'Step into a fitness sanctuary engineered for elite performance. Experience biomechanical weights, custom micro-nutrition, and recovery suites.',
    ctaText: 'Join Good Life Elite',
    bgImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop'
  },
  pricing: [
    {
      name: 'Gold Club Access',
      tagline: 'STANDARD FITNESS',
      priceMonthly: 2499,
      priceQuarterly: 6499,
      priceYearly: 21999,
      desc: 'Perfect for local gym-goers looking to train on elite level strength machinery with luxury hygiene standard setups.',
      features: [
        'Complete access to Gym floors 24/7',
        'Imported Panatta & Arsenal machines',
        'Luxury shower rooms & steam standard lockers',
        '1 Free certified personal trainer orientation',
        '10% off at the Good Life Cafe'
      ],
      btnText: 'Start Gold Access'
    },
    {
      name: 'Elite Executive Club',
      tagline: 'PREMIUM FITNESS & RECOVERY',
      priceMonthly: 4499,
      priceQuarterly: 11999,
      priceYearly: 39999,
      desc: 'Our most sought-after tier. Combines intense training access with custom nutrition templates and full recovery features.',
      features: [
        'All features of Gold Club tier included',
        'Access to Cryotherapy & Infrared Sauna',
        'Monthly assessment with Elite Head Coach',
        'Custom macro diet chart planning',
        '5 Free Guest Passes per Quarter',
        '15% off at the Good Life Cafe'
      ],
      btnText: 'Claim Elite Privileges'
    },
    {
      name: 'Black Label VIP Pass',
      tagline: 'THE ULTIMATE DESTINATION',
      priceMonthly: 8999,
      priceQuarterly: 23999,
      priceYearly: 79999,
      desc: 'Exclusive, highly limited tier providing an all-inclusive concierge health experience. Absolute dedication to results.',
      features: [
        'All features of Elite Executive included',
        'Dedicated 1-on-1 Certified Personal Coach',
        '24/7 direct WhatsApp Line to Dietician',
        'Dedicated Private VIP Standard Locker',
        '1 Free Premium Protein Shake daily',
        'Quarterly Physiotherapy consultation',
        'Free Unlimited Guest Entry standard'
      ],
      btnText: 'Secure Black Label Pass'
    }
  ],
  trainers: [
    {
      id: 1,
      name: 'Vikram "Titan" Singh',
      role: 'Head Strength Coach',
      image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=600&auto=format&fit=crop',
      certs: ['ISSA Strength Specialist', '12+ Years Experience', 'Competitive Powerlifter'],
      specialization: 'High Hypertrophy & Powerlifting Prep',
      rating: 5.0
    },
    {
      id: 2,
      name: 'Priya "Aero" Patel',
      role: 'CrossFit L2 Head Trainer',
      image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=600&auto=format&fit=crop',
      certs: ['CrossFit Level 2 Coach', 'Nutrition Science (GSU)', 'State-level Athletics Lead'],
      specialization: 'Metabolic Conditioning & Core Durability',
      rating: 4.9
    },
    {
      id: 3,
      name: 'Shera "Combat" Khan',
      role: 'Combat Arts Specialist',
      image: 'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?q=80&w=600&auto=format&fit=crop',
      certs: ['Wushu National Gold Medalist', 'Blue Belt BJJ', 'Muay Thai Camp certified'],
      specialization: 'Combat Conditioning, Kickboxing & MMA',
      rating: 5.0
    },
    {
      id: 4,
      name: 'Dr. Arjun Dev',
      role: 'Rehabilitation & Physio Lead',
      image: 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?q=80&w=600&auto=format&fit=crop',
      certs: ['BPT Physiotherapy Degree', 'ACSM Exercise Physiologist', 'Dry Needling Certified'],
      specialization: 'Posture Correction, Sports Rehab & Injury Avoidance',
      rating: 4.9
    }
  ],
  gallery: [
    {
      id: 1,
      category: 'Machinery',
      title: 'Biomechanical Chest Press',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      category: 'Workouts',
      title: 'Barbell Deadlifts Session',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 3,
      category: 'Recovery',
      title: 'Dry Infrared Sauna Cabins',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 4,
      category: 'Machinery',
      title: 'Olympic Lifting Platforms',
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 5,
      category: 'Workouts',
      title: 'Kettlebell Hypertrophy Prep',
      image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 6,
      category: 'Fuel Bar',
      title: 'Post-Workout Protein Cafe',
      image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=800&auto=format&fit=crop'
    }
  ],
  testimonials: [
    {
      id: 1,
      name: 'Devendra Jha',
      role: 'Elite Club Member',
      review: 'The quality of machinery here is second to none in India. Training on Arsenal Strength and Panatta frames has drastically reduced joint stress. Worth every single rupee!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Priyanka Sen',
      role: 'Black Label VIP Member',
      review: 'Having access to a cryotherapy tank and dry infrared sauna right inside the recovery zone makes a huge difference. The 1-on-1 coaching is incredibly scientific.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Kabir Malhotra',
      role: 'Elite Club Member',
      review: 'Their customized protein post-workout meals from the health cafe save my time. Highly professional environment. Clean, luxurious, and highly motivating crowd.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop'
    }
  ],
  contact: {
    phone: '+91 99999 99999',
    phone2: '+91 22 4567 8910',
    whatsApp: '919999999999',
    email: 'concierge@goodlifefitness.in',
    address: 'Good Life Fitness Sanctuary, Level 3, Platinum Commercial Arcade, Linking Road, Bandra West, Mumbai, India.',
    timingsLine1: 'Strength & Cardio Arena: Open 24/7/365',
    timingsLine2: 'Sauna & Recovery Lounge: 06:00 AM - 10:00 PM Daily',
    googleMapsSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.218569830588!2d72.831518!3d19.054366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c913d0000001%3A0xe54d6fa7c244ac50!2sLinking%20Rd%2C%20Bandra%20West%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com'
  },
  themeSettings: {
    accentColor: 'gold', // gold, chrome, emerald, roseGold
    fontFamily: 'display', // display, sans
    buttonStyle: 'sharp', // sharp, rounded, pill
    lightLuxuryTheme: true, // true (White/Gold), false (Black/Silver)
    shadowStyle: 'subtle', // none, subtle, glow, heavy
    animationIntensity: 'cinematic' // none, calm, cinematic, active
  },
  integrations: {
    googleAnalyticsId: '',
    clarityId: ''
  },
  recentUpdates: [
    { time: 'System Bootup', desc: 'CMS content initialized with premium luxury defaults.' }
  ]
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('glf_website_content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Fallback for missing keys in case of schema additions
        return { ...DEFAULT_CONTENT, ...parsed };
      } catch (e) {
        console.error('Error parsing stored content, resetting defaults.', e);
      }
    }
    return DEFAULT_CONTENT;
  });

  const [firebaseConfig, setFirebaseConfigState] = useState(getFirebaseConfig);
  const [isCloudConnected, setIsCloudConnected] = useState(isFirebaseConfigured);

  // Subscribe to real-time content changes (both cloud snapshot and tab-to-tab BroadcastChannel fallback)
  useEffect(() => {
    const unsubscribe = subscribeToContent((updatedContent) => {
      setContent((prev) => ({
        ...prev,
        ...updatedContent
      }));
    });
    return () => unsubscribe();
  }, [firebaseConfig]); // Re-subscribe if Firebase configuration changes

  useEffect(() => {
    localStorage.setItem('glf_website_content', JSON.stringify(content));
  }, [content]);

  // Inject styles dynamically into document root whenever theme settings change
  useEffect(() => {
    const root = document.documentElement;
    const settings = content.themeSettings;

    // Toggle Root Class for Dark/Light Mode
    if (settings.lightLuxuryTheme) {
      root.classList.remove('dark');
      root.style.setProperty('--bg-primary', '#FAFAFA');
      root.style.setProperty('--text-primary', '#1C1C1E');
      root.style.setProperty('--flare-color', 'rgba(212, 175, 55, 0.06)');
    } else {
      root.classList.add('dark');
      root.style.setProperty('--bg-primary', '#080808');
      root.style.setProperty('--text-primary', '#FFFFFF');
      root.style.setProperty('--flare-color', 'rgba(229, 231, 235, 0.05)');
    }

    // Map Accent Color Hexes & Metallic Gradients
    const accents = {
      gold: {
        accent: '#D4AF37',
        start: '#BF953F',
        mid: '#FCF6BA',
        end: '#835F0C',
        metallic: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA7C11 100%)',
        glow: 'rgba(212, 175, 55, 0.25)'
      },
      chrome: {
        accent: '#E5E7EB',
        start: '#9CA3AF',
        mid: '#F3F4F6',
        end: '#4B5563',
        metallic: 'linear-gradient(135deg, #9CA3AF 0%, #E5E7EB 25%, #C0C0C0 50%, #F3F4F6 75%, #4B5563 100%)',
        glow: 'rgba(192, 192, 192, 0.2)'
      },
      emerald: {
        accent: '#10B981',
        start: '#059669',
        mid: '#6EE7B7',
        end: '#064E3B',
        metallic: 'linear-gradient(135deg, #059669 0%, #34D399 25%, #10B981 50%, #6EE7B7 75%, #064E3B 100%)',
        glow: 'rgba(16, 185, 129, 0.25)'
      },
      roseGold: {
        accent: '#B76E79',
        start: '#B76E79',
        mid: '#F4D3D5',
        end: '#723A40',
        metallic: 'linear-gradient(135deg, #B76E79 0%, #F4D3D5 25%, #D4A3A7 50%, #E8C5C8 75%, #723A40 100%)',
        glow: 'rgba(183, 110, 121, 0.25)'
      }
    };

    const currentAccent = accents[settings.accentColor] || accents.gold;
    root.style.setProperty('--accent-color', currentAccent.accent);
    root.style.setProperty('--accent-grad-start', currentAccent.start);
    root.style.setProperty('--accent-grad-mid', currentAccent.mid);
    root.style.setProperty('--accent-grad-end', currentAccent.end);
    root.style.setProperty('--accent-metallic', currentAccent.metallic);
    root.style.setProperty('--accent-glow-shadow', currentAccent.glow);

    // Font Family Map
    const fonts = {
      display: "'Outfit', sans-serif",
      sans: "'Inter', sans-serif"
    };
    root.style.setProperty('--font-display', fonts[settings.fontFamily] || fonts.display);

    // Button Radius Map
    const radius = {
      sharp: '0px',
      rounded: '8px',
      pill: '9999px'
    };
    root.style.setProperty('--button-radius', radius[settings.buttonStyle] || radius.sharp);

    // Dynamic Shadow Style Map
    const shadows = {
      none: 'none',
      subtle: settings.lightLuxuryTheme 
        ? '0 4px 12px rgba(0, 0, 0, 0.05)' 
        : '0 4px 12px rgba(0, 0, 0, 0.4)',
      glow: `0 0 30px -5px ${currentAccent.glow}`,
      heavy: settings.lightLuxuryTheme 
        ? '0 20px 40px -15px rgba(0, 0, 0, 0.15)' 
        : '0 20px 40px -15px rgba(0, 0, 0, 0.6)'
    };
    root.style.setProperty('--card-shadow', shadows[settings.shadowStyle] || shadows.subtle);

    // Dynamic Transition Speed Map
    const transitionSpeeds = {
      none: '0ms',
      calm: '1200ms',
      cinematic: '600ms',
      active: '300ms'
    };
    root.style.setProperty('--transition-speed', transitionSpeeds[settings.animationIntensity] || transitionSpeeds.cinematic);

  }, [content.themeSettings]);

  // Helper to log updates in admin dashboard and sync
  const addUpdateLog = async (desc, currentContentState) => {
    const timeString = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const nextContent = {
      ...currentContentState,
      recentUpdates: [
        { time: timeString, desc },
        ...(currentContentState.recentUpdates || []).slice(0, 9)
      ]
    };
    setContent(nextContent);
    return await saveContent(nextContent);
  };

  const updateHero = async (heroData) => {
    const nextContent = { ...content, hero: heroData };
    return await addUpdateLog('Hero section contents updated.', nextContent);
  };

  const updatePricing = async (pricingData) => {
    const nextContent = { ...content, pricing: pricingData };
    return await addUpdateLog('Membership plans and pricing structures updated.', nextContent);
  };

  const addTrainer = async (trainer) => {
    const nextContent = {
      ...content,
      trainers: [...content.trainers, { ...trainer, id: Date.now() }]
    };
    return await addUpdateLog(`New trainer added: ${trainer.name}`, nextContent);
  };

  const deleteTrainer = async (id) => {
    const trainerName = content.trainers.find(t => t.id === id)?.name || id;
    const nextContent = {
      ...content,
      trainers: content.trainers.filter((t) => t.id !== id)
    };
    return await addUpdateLog(`Trainer removed: ${trainerName}`, nextContent);
  };

  const updateTrainer = async (id, updatedTrainer) => {
    const nextContent = {
      ...content,
      trainers: content.trainers.map((t) => (t.id === id ? { ...t, ...updatedTrainer } : t))
    };
    return await addUpdateLog(`Trainer credentials updated: ${updatedTrainer.name}`, nextContent);
  };

  const addGalleryItem = async (item) => {
    const nextContent = {
      ...content,
      gallery: [...content.gallery, { ...item, id: Date.now() }]
    };
    return await addUpdateLog(`New gallery item uploaded: ${item.title}`, nextContent);
  };

  const deleteGalleryItem = async (id) => {
    const itemTitle = content.gallery.find(g => g.id === id)?.title || id;
    const nextContent = {
      ...content,
      gallery: content.gallery.filter((g) => g.id !== id)
    };
    return await addUpdateLog(`Gallery item deleted: ${itemTitle}`, nextContent);
  };

  const updateGalleryItem = async (id, updatedItem) => {
    const nextContent = {
      ...content,
      gallery: content.gallery.map((g) => (g.id === id ? { ...g, ...updatedItem } : g))
    };
    return await addUpdateLog(`Gallery asset updated: ${updatedItem.title}`, nextContent);
  };

  const reorderGallery = async (newGallery) => {
    const nextContent = { ...content, gallery: newGallery };
    return await addUpdateLog('Gallery item sequencing modified.', nextContent);
  };

  const addTestimonial = async (testimonial) => {
    const nextContent = {
      ...content,
      testimonials: [...content.testimonials, { ...testimonial, id: Date.now() }]
    };
    return await addUpdateLog(`New testimonial added from: ${testimonial.name}`, nextContent);
  };

  const deleteTestimonial = async (id) => {
    const testName = content.testimonials.find(t => t.id === id)?.name || id;
    const nextContent = {
      ...content,
      testimonials: content.testimonials.filter((t) => t.id !== id)
    };
    return await addUpdateLog(`Member testimonial deleted: ${testName}`, nextContent);
  };

  const updateTestimonial = async (id, updatedTestimonial) => {
    const nextContent = {
      ...content,
      testimonials: content.testimonials.map((t) => (t.id === id ? { ...t, ...updatedTestimonial } : t))
    };
    return await addUpdateLog(`Member testimonial updated for: ${updatedTestimonial.name}`, nextContent);
  };

  const updateContact = async (contactData) => {
    const nextContent = { ...content, contact: contactData };
    return await addUpdateLog('Headquarters contact settings updated.', nextContent);
  };

  const updateThemeSettings = async (themeData) => {
    const nextContent = { ...content, themeSettings: themeData };
    return await addUpdateLog(`Website theme config updated: Accent ${themeData.accentColor}, Layout ${themeData.lightLuxuryTheme ? 'Light Luxury' : 'Night Mode'}.`, nextContent);
  };

  const updateIntegrations = async (integrationsData) => {
    const nextContent = { ...content, integrations: integrationsData };
    return await addUpdateLog('Third-party script integration IDs updated.', nextContent);
  };

  const updateFirebaseConfig = async (config) => {
    saveFirebaseConfig(config);
    setFirebaseConfigState(config);
    setIsCloudConnected(!!(config && config.apiKey && config.projectId));
    // Immediately upload/push current content to Firestore
    await saveContent(content);
    addUpdateLog('Cloud Sync Database credentials connected.', content);
  };

  const disconnectFirebase = () => {
    clearFirebaseConfig();
    setFirebaseConfigState(null);
    setIsCloudConnected(false);
    addUpdateLog('Cloud Sync Database disconnected.', content);
  };

  // Inject Google Analytics & Clarity scripts when integration IDs change
  useEffect(() => {
    const integrations = content.integrations || { googleAnalyticsId: '', clarityId: '' };
    analyticsTracker.injectGoogleAnalytics(integrations.googleAnalyticsId);
    analyticsTracker.injectClarity(integrations.clarityId);
  }, [content.integrations]);

  const resetAllContent = () => {
    if (window.confirm('Are you absolutely sure you want to reset all content to premium system defaults? This cannot be undone.')) {
      setContent(DEFAULT_CONTENT);
      localStorage.removeItem('glf_website_content');
      window.location.reload();
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        updateHero,
        updatePricing,
        addTrainer,
        deleteTrainer,
        updateTrainer,
        addGalleryItem,
        deleteGalleryItem,
        updateGalleryItem,
        reorderGallery,
        addTestimonial,
        deleteTestimonial,
        updateTestimonial,
        updateContact,
        updateThemeSettings,
        updateIntegrations,
        resetAllContent,
        firebaseConfig,
        isCloudConnected,
        updateFirebaseConfig,
        disconnectFirebase
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};
