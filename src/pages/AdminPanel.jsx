import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAdminSession, clearAdminSession } from '../utils/session';
import { 
  LayoutDashboard, 
  Sparkles, 
  CreditCard, 
  Users, 
  Image, 
  MessageSquare, 
  PhoneCall, 
  Palette, 
  ArrowLeft, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw,
  CheckCircle,
  Eye,
  Cloud,
  Loader2,
  Star
} from 'lucide-react';
import { ContentContext } from '../context/ContentContext';

const AdminPanel = () => {
  const navigate = useNavigate();
  const {
    content,
    updateHero,
    updatePricing,
    addTrainer,
    deleteTrainer,
    updateTrainer,
    addGalleryItem,
    deleteGalleryItem,
    reorderGallery,
    addTestimonial,
    deleteTestimonial,
    updateContact,
    updateThemeSettings,
    resetAllContent,
    firebaseConfig,
    isCloudConnected,
    updateFirebaseConfig,
    disconnectFirebase
  } = useContext(ContentContext);

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Notification Toast State
  const [toastMessage, setToastMessage] = useState('');

  // Saving States
  const [isSaving, setIsSaving] = useState({
    hero: false,
    pricing: false,
    trainer: false,
    gallery: false,
    testimonial: false,
    contact: false,
    theme: false,
    cloud: false
  });

  // Validate admin session and handle auto-redirect on expiry
  useEffect(() => {
    const verifySession = () => {
      if (!checkAdminSession()) {
        navigate('/');
      }
    };

    verifySession();
    const interval = setInterval(verifySession, 10000); // Check every 10 seconds for idle/expiry

    return () => clearInterval(interval);
  }, [navigate]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // 1. Dashboard Tab States & Helpers
  const stats = [
    { label: 'Trainers', count: content.trainers.length, icon: Users },
    { label: 'Gallery Snaps', count: content.gallery.length, icon: Image },
    { label: 'Client Reviews', count: content.testimonials.length, icon: MessageSquare },
    { label: 'Membership Tiers', count: content.pricing.length, icon: CreditCard }
  ];

  // Editing Mode States
  const [editingTrainerId, setEditingTrainerId] = useState(null);
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);

  // 2. Hero Form State
  const [heroForm, setHeroForm] = useState({ ...content.hero });
  const handleHeroSave = async (e) => {
    e.preventDefault();
    setIsSaving(prev => ({ ...prev, hero: true }));
    try {
      await updateHero(heroForm);
      showToast('Hero Section updated successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save Hero section to database.');
    } finally {
      setIsSaving(prev => ({ ...prev, hero: false }));
    }
  };

  const handleHeroCancel = () => {
    setHeroForm({ ...content.hero });
    showToast('Hero edits discarded.');
  };

  // 3. Pricing Editor State
  const [editingPlanIdx, setEditingPlanIdx] = useState(0);
  const [pricingForm, setPricingForm] = useState({ ...content.pricing[0] });

  useEffect(() => {
    if (content.pricing[editingPlanIdx]) {
      setPricingForm({ ...content.pricing[editingPlanIdx] });
    }
  }, [editingPlanIdx, content.pricing]);

  const handlePricingSave = async (e) => {
    e.preventDefault();
    setIsSaving(prev => ({ ...prev, pricing: true }));
    try {
      const updatedPlans = [...content.pricing];
      updatedPlans[editingPlanIdx] = pricingForm;
      await updatePricing(updatedPlans);
      showToast(`${pricingForm.name} updated successfully!`);
    } catch (err) {
      console.error(err);
      showToast('Failed to save pricing details to database.');
    } finally {
      setIsSaving(prev => ({ ...prev, pricing: false }));
    }
  };

  const handlePricingCancel = () => {
    if (content.pricing[editingPlanIdx]) {
      setPricingForm({ ...content.pricing[editingPlanIdx] });
      showToast('Pricing edits discarded.');
    }
  };

  const handleAddPlan = async () => {
    const defaultNewPlan = {
      name: 'New Membership Club',
      tagline: 'LIFETIME FITNESS',
      priceMonthly: 3000,
      priceQuarterly: 8000,
      priceYearly: 28000,
      desc: 'Customize features and pricing options below. Update live in real time.',
      features: [
        'Complete access to Gym floors 24/7',
        'Custom personal coaching consultation'
      ],
      btnText: 'Start Your Fitness Journey',
      highlighted: false
    };
    const updatedPlans = [...content.pricing, defaultNewPlan];
    setIsSaving(prev => ({ ...prev, pricing: true }));
    try {
      await updatePricing(updatedPlans);
      setEditingPlanIdx(updatedPlans.length - 1);
      showToast('New membership plan added!');
    } catch (err) {
      showToast('Failed to add new plan.');
    } finally {
      setIsSaving(prev => ({ ...prev, pricing: false }));
    }
  };

  const handleDeletePlan = async () => {
    if (content.pricing.length <= 1) {
      showToast('Cannot delete the only remaining plan.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete the plan "${pricingForm.name}"?`)) {
      return;
    }
    const updatedPlans = content.pricing.filter((_, idx) => idx !== editingPlanIdx);
    setIsSaving(prev => ({ ...prev, pricing: true }));
    try {
      await updatePricing(updatedPlans);
      setEditingPlanIdx(0);
      showToast('Membership plan removed.');
    } catch (err) {
      showToast('Failed to delete plan.');
    } finally {
      setIsSaving(prev => ({ ...prev, pricing: false }));
    }
  };

  const handleFeatureChange = (index, value) => {
    const nextFeatures = [...pricingForm.features];
    nextFeatures[index] = value;
    setPricingForm(prev => ({ ...prev, features: nextFeatures }));
  };

  const removeFeature = (index) => {
    const nextFeatures = pricingForm.features.filter((_, i) => i !== index);
    setPricingForm(prev => ({ ...prev, features: nextFeatures }));
  };

  const addFeature = () => {
    setPricingForm(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  // 4. Trainers Form State
  const [newTrainer, setNewTrainer] = useState({
    name: '',
    role: '',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    specialization: '',
    certs: '',
    rating: 5.0
  });

  const handleTrainerAdd = async (e) => {
    e.preventDefault();
    setIsSaving(prev => ({ ...prev, trainer: true }));
    try {
      const certsArray = Array.isArray(newTrainer.certs) 
        ? newTrainer.certs 
        : newTrainer.certs.split(',').map(c => c.trim()).filter(Boolean);
      
      if (editingTrainerId) {
        // Edit Mode
        await updateTrainer(editingTrainerId, {
          ...newTrainer,
          certs: certsArray,
          rating: parseFloat(newTrainer.rating) || 5.0
        });
        setEditingTrainerId(null);
        showToast('Trainer updated successfully!');
      } else {
        // Create Mode
        await addTrainer({
          ...newTrainer,
          certs: certsArray,
          rating: parseFloat(newTrainer.rating) || 5.0
        });
        showToast('Trainer added successfully!');
      }
      setNewTrainer({
        name: '',
        role: '',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
        specialization: '',
        certs: '',
        rating: 5.0
      });
    } catch (err) {
      console.error(err);
      showToast('Failed to sync trainer details.');
    } finally {
      setIsSaving(prev => ({ ...prev, trainer: false }));
    }
  };

  const handleTrainerEditClick = (trainer) => {
    setEditingTrainerId(trainer.id);
    setNewTrainer({
      name: trainer.name,
      role: trainer.role,
      image: trainer.image,
      specialization: trainer.specialization,
      certs: Array.isArray(trainer.certs) ? trainer.certs.join(', ') : trainer.certs,
      rating: trainer.rating
    });
    const formElement = document.getElementById('trainer-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTrainerCancel = () => {
    setEditingTrainerId(null);
    setNewTrainer({
      name: '',
      role: '',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
      specialization: '',
      certs: '',
      rating: 5.0
    });
    showToast('Trainer form reset.');
  };

  // 5. Gallery Form State
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    category: 'Machinery',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop'
  });

  const handleGalleryAdd = async (e) => {
    e.preventDefault();
    setIsSaving(prev => ({ ...prev, gallery: true }));
    try {
      if (editingGalleryId) {
        // Edit mode
        await updateGalleryItem(editingGalleryId, newGalleryItem);
        setEditingGalleryId(null);
        showToast('Gallery snap updated successfully!');
      } else {
        // Create mode
        await addGalleryItem(newGalleryItem);
        showToast('Gallery visual uploaded!');
      }
      setNewGalleryItem({
        title: '',
        category: 'Machinery',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop'
      });
    } catch (err) {
      console.error(err);
      showToast('Failed to sync gallery visual.');
    } finally {
      setIsSaving(prev => ({ ...prev, gallery: false }));
    }
  };

  const handleGalleryEditClick = (item) => {
    setEditingGalleryId(item.id);
    setNewGalleryItem({
      title: item.title,
      category: item.category,
      image: item.image
    });
    const formElement = document.getElementById('gallery-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGalleryCancel = () => {
    setEditingGalleryId(null);
    setNewGalleryItem({
      title: '',
      category: 'Machinery',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop'
    });
    showToast('Gallery form reset.');
  };

  const handleMoveGalleryItem = async (index, direction) => {
    const nextGallery = [...content.gallery];
    const swapWith = direction === 'left' ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= nextGallery.length) return;
    
    // Swap items
    const temp = nextGallery[index];
    nextGallery[index] = nextGallery[swapWith];
    nextGallery[swapWith] = temp;

    setIsSaving(prev => ({ ...prev, gallery: true }));
    try {
      await reorderGallery(nextGallery);
      showToast('Gallery order updated!');
    } catch (err) {
      showToast('Failed to update gallery sequence.');
    } finally {
      setIsSaving(prev => ({ ...prev, gallery: false }));
    }
  };

  // 6. Testimonials Form State
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    role: 'Elite Club Member',
    review: '',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'
  });

  const handleTestimonialAdd = async (e) => {
    e.preventDefault();
    setIsSaving(prev => ({ ...prev, testimonial: true }));
    try {
      if (editingTestimonialId) {
        // Edit mode
        await updateTestimonial(editingTestimonialId, newTestimonial);
        setEditingTestimonialId(null);
        showToast('Client review updated successfully!');
      } else {
        // Create mode
        await addTestimonial(newTestimonial);
        showToast('Client review added!');
      }
      setNewTestimonial({
        name: '',
        role: 'Elite Club Member',
        review: '',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'
      });
    } catch (err) {
      console.error(err);
      showToast('Failed to sync client review.');
    } finally {
      setIsSaving(prev => ({ ...prev, testimonial: false }));
    }
  };

  const handleTestimonialEditClick = (test) => {
    setEditingTestimonialId(test.id);
    setNewTestimonial({
      name: test.name,
      role: test.role,
      review: test.review,
      rating: test.rating || 5,
      avatar: test.avatar
    });
    const formElement = document.getElementById('testimonial-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTestimonialCancel = () => {
    setEditingTestimonialId(null);
    setNewTestimonial({
      name: '',
      role: 'Elite Club Member',
      review: '',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'
    });
    showToast('Testimonial form reset.');
  };

  // 7. Contact Form State
  const [contactForm, setContactForm] = useState({ ...content.contact });
  const handleContactSave = async (e) => {
    e.preventDefault();
    setIsSaving(prev => ({ ...prev, contact: true }));
    try {
      await updateContact(contactForm);
      showToast('Contact and Timings updated!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save contact settings.');
    } finally {
      setIsSaving(prev => ({ ...prev, contact: false }));
    }
  };

  const handleContactCancel = () => {
    setContactForm({ ...content.contact });
    showToast('Contact edits reset.');
  };

  // 8. Theme Form State
  const [themeForm, setThemeForm] = useState({ ...content.themeSettings });
  
  useEffect(() => {
    setThemeForm({ ...content.themeSettings });
  }, [content.themeSettings]);

  const handleThemeSave = async (e) => {
    e.preventDefault();
    setIsSaving(prev => ({ ...prev, theme: true }));
    try {
      await updateThemeSettings(themeForm);
      showToast('Theme preferences synchronized!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save theme settings.');
    } finally {
      setIsSaving(prev => ({ ...prev, theme: false }));
    }
  };

  const handleThemeCancel = () => {
    setThemeForm({ ...content.themeSettings });
    showToast('Theme edits reset.');
  };

  // 9. Cloud Sync Form State
  const [cloudForm, setCloudForm] = useState({
    apiKey: '',
    projectId: '',
    authDomain: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    docName: 'good-life-fitness-mumbai'
  });

  // Populate cloudForm with saved credentials when tab is loaded or config changes
  useEffect(() => {
    if (firebaseConfig) {
      setCloudForm({
        apiKey: firebaseConfig.apiKey || '',
        projectId: firebaseConfig.projectId || '',
        authDomain: firebaseConfig.authDomain || '',
        storageBucket: firebaseConfig.storageBucket || '',
        messagingSenderId: firebaseConfig.messagingSenderId || '',
        appId: firebaseConfig.appId || '',
        docName: firebaseConfig.docName || 'good-life-fitness-mumbai'
      });
    } else {
      setCloudForm({
        apiKey: '',
        projectId: '',
        authDomain: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
        docName: 'good-life-fitness-mumbai'
      });
    }
  }, [firebaseConfig]);

  const handleCloudSave = async (e) => {
    e.preventDefault();
    setIsSaving(prev => ({ ...prev, cloud: true }));
    try {
      await updateFirebaseConfig(cloudForm);
      showToast('Firebase connected and content uploaded successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to connect to Firebase database.');
    } finally {
      setIsSaving(prev => ({ ...prev, cloud: false }));
    }
  };

  const handleCloudDisconnect = () => {
    if (window.confirm('Disconnect Cloud Sync? Website will revert to local same-browser synchronizations.')) {
      disconnectFirebase();
      showToast('Cloud Sync disconnected.');
    }
  };

  const handleLockSession = () => {
    clearAdminSession();
    navigate('/');
  };

  // Admin Dashboard Panel Design
  return (
    <div className="min-h-screen bg-[#F6F6F9] text-gym-black flex font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-gym-black text-white px-5 py-3 shadow-2xl flex items-center gap-2 border border-gym-gold font-semibold text-xs uppercase tracking-wider animate-slide-up">
          <CheckCircle size={16} className="text-gym-gold" />
          {toastMessage}
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gym-black text-white flex flex-col justify-between border-r border-gym-border">
        <div>
          {/* Sidebar Logo */}
          <div className="p-6 border-b border-gym-border flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gold-metallic-gradient text-gym-black flex items-center justify-center font-bold">
              GL
            </div>
            <div>
              <span className="block text-sm font-black font-display tracking-widest">GLF CONCIERGE</span>
              <span className="block text-[8px] tracking-[0.2em] font-semibold text-gym-silver -mt-1">ADMIN CONSOLE</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'hero', label: 'Hero Section', icon: Sparkles },
              { id: 'pricing', label: 'Membership Plans', icon: CreditCard },
              { id: 'trainers', label: 'Trainer Bios', icon: Users },
              { id: 'gallery', label: 'Gallery Snaps', icon: Image },
              { id: 'testimonials', label: 'Client Reviews', icon: MessageSquare },
              { id: 'contact', label: 'Contact Settings', icon: PhoneCall },
              { id: 'theme', label: 'Theme Settings', icon: Palette },
              { id: 'cloud', label: 'Cloud Sync', icon: Cloud }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-bold transition-all rounded-none ${
                    isActive 
                      ? 'bg-gold-metallic-gradient text-gym-black shadow-lg font-black' 
                      : 'text-gym-grey-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer options */}
        <div className="p-4 border-t border-gym-border space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 bg-white/5 border border-gym-border text-white text-[10px] uppercase font-bold tracking-widest hover:bg-white hover:text-gym-black transition-all flex items-center justify-center gap-1.5 rounded-none"
          >
            <Eye size={12} />
            Preview Site
          </button>
          
          <button
            onClick={handleLockSession}
            className="w-full py-2.5 bg-red-950/20 border border-red-900/40 text-red-400 text-[10px] uppercase font-bold tracking-widest hover:bg-red-900 hover:text-white transition-all flex items-center justify-center gap-1.5 rounded-none"
          >
            <Unlock size={12} />
            Lock Console
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Workspace Topbar Header */}
        <header className="bg-white border-b border-gym-grey-light/30 px-8 py-4 flex items-center justify-between shadow-sm select-none">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-black text-sm uppercase tracking-wider text-gym-black flex items-center gap-1.5">
              Editing Domain: <span className="text-gym-gold capitalize">{activeTab}</span>
            </h2>
            {isCloudConnected ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-green-600 uppercase font-bold tracking-widest">CLOUD CONNECTED</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] text-red-600 uppercase font-bold tracking-widest">LOCAL OFFLINE SYNC</span>
              </>
            )}
          </div>

          <div className="text-[10px] font-bold uppercase text-gym-grey-muted tracking-widest">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        </header>

        {/* Tab Components Container */}
        <div className="p-8 max-w-5xl w-full mx-auto space-y-8 pb-16">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white border border-gym-grey-light/30 p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gym-gold/5 rounded-full filter blur-2xl" />
                <div className="relative z-10 space-y-2">
                  <h3 className="font-display font-black text-xl uppercase tracking-tight">Concierge Welcome</h3>
                  <p className="text-xs text-gym-grey-muted leading-relaxed max-w-2xl font-medium">
                    Welcome back, Administrator. This panel allows you to modify the website copy, pricing tiers, trainer lineups, gallery photos, and branding settings. All modifications take effect immediately for users.
                  </p>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-white border border-gym-grey-light/30 p-6 flex items-center justify-between shadow-sm">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-widest">{stat.label}</span>
                        <span className="block font-display font-black text-3xl mt-1">{stat.count}</span>
                      </div>
                      <div className="w-10 h-10 rounded bg-gym-gold/10 flex items-center justify-center text-gym-gold">
                        <Icon size={18} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Logs & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Recent Updates */}
                <div className="lg:col-span-8 bg-white border border-gym-grey-light/30 p-6 shadow-sm">
                  <h4 className="font-display font-black text-xs uppercase tracking-widest border-b border-gym-grey-light/20 pb-3 mb-4 flex items-center gap-1.5">
                    Recent Modification Activity Logs
                  </h4>
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {content.recentUpdates.map((log, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs leading-tight">
                        <span className="text-[10px] font-mono bg-gym-grey-light/30 px-2 py-0.5 font-bold flex-shrink-0 text-gym-grey-muted">{log.time}</span>
                        <span className="text-gym-black/80 font-medium">{log.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="lg:col-span-4 bg-white border border-gym-grey-light/30 p-6 shadow-sm space-y-4">
                  <h4 className="font-display font-black text-xs uppercase tracking-widest border-b border-gym-grey-light/20 pb-3 mb-2">
                    System Actions
                  </h4>
                  
                  <button
                    onClick={() => setActiveTab('theme')}
                    className="w-full py-3 border border-gym-gold/20 hover:border-gym-gold bg-gym-gold/5 text-gym-gold text-[10px] uppercase font-bold tracking-widest hover:bg-gym-gold hover:text-gym-black transition-all text-center flex items-center justify-center gap-1"
                  >
                    <Palette size={12} /> Accent Color Setup
                  </button>

                  <button
                    onClick={resetAllContent}
                    className="w-full py-3 border border-red-200 bg-red-50 hover:bg-red-500 hover:border-red-500 hover:text-white text-red-500 text-[10px] uppercase font-bold tracking-widest transition-all text-center flex items-center justify-center gap-1"
                  >
                    <RotateCcw size={12} /> Reset to System Defaults
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: HERO SECTION EDITOR */}
          {activeTab === 'hero' && (
            <form onSubmit={handleHeroSave} className="bg-white border border-gym-grey-light/30 p-8 shadow-sm space-y-6 animate-fade-in">
              <h3 className="font-display font-black text-sm uppercase tracking-wider border-b border-gym-grey-light/20 pb-3">
                Hero Section Headlines & Visuals
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Heading Line 1</label>
                  <input
                    type="text"
                    value={heroForm.titleLine1}
                    onChange={(e) => setHeroForm(prev => ({ ...prev, titleLine1: e.target.value }))}
                    required
                    className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-bold uppercase"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Heading Line 2 (Brand Highlighted)</label>
                  <input
                    type="text"
                    value={heroForm.titleLine2}
                    onChange={(e) => setHeroForm(prev => ({ ...prev, titleLine2: e.target.value }))}
                    required
                    className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-bold uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Subheading Paragraph</label>
                <textarea
                  value={heroForm.subheading}
                  onChange={(e) => setHeroForm(prev => ({ ...prev, subheading: e.target.value }))}
                  required
                  rows="3"
                  className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">CTA Button Text</label>
                  <input
                    type="text"
                    value={heroForm.ctaText}
                    onChange={(e) => setHeroForm(prev => ({ ...prev, ctaText: e.target.value }))}
                    required
                    className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Background Image URL</label>
                  <input
                    type="text"
                    value={heroForm.bgImage}
                    onChange={(e) => setHeroForm(prev => ({ ...prev, bgImage: e.target.value }))}
                    required
                    className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                  />
                </div>
              </div>

              {/* Previews */}
              <div className="space-y-1.5 pt-4">
                <span className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Background Image Preview</span>
                <div 
                  className="h-44 w-full bg-cover bg-center border border-gym-grey-light"
                  style={{ backgroundImage: `url('${heroForm.bgImage}')` }}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSaving.hero}
                  className="py-3 px-6 bg-gym-black text-white hover:bg-gym-gold hover:text-gym-black text-[10px] uppercase font-bold tracking-widest transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving.hero ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Syncing to Cloud...
                    </>
                  ) : (
                    <>
                      <Save size={14} /> Save Hero Section Content
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleHeroCancel}
                  className="py-3 px-6 border border-gym-grey-light text-gym-grey-muted hover:text-gym-black text-[10px] uppercase font-bold tracking-widest transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: MEMBERSHIP PLANS EDITOR */}
          {activeTab === 'pricing' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Tier Selection Buttons */}
              <div className="flex flex-wrap items-center border border-gym-grey-light bg-white p-1 gap-1">
                {content.pricing.map((plan, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setEditingPlanIdx(idx)}
                    className={`flex-1 min-w-[120px] py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                      editingPlanIdx === idx 
                        ? 'bg-gym-black text-white' 
                        : 'text-gym-grey-muted hover:text-gym-black hover:bg-gym-grey-light/10'
                    }`}
                  >
                    {plan.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleAddPlan}
                  className="px-4 py-3 bg-gym-gold/10 hover:bg-gym-gold text-gym-gold hover:text-gym-black text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1"
                >
                  <Plus size={14} /> Add Plan
                </button>
              </div>

              <form onSubmit={handlePricingSave} className="bg-white border border-gym-grey-light/30 p-8 shadow-sm space-y-6">
                <h3 className="font-display font-black text-sm uppercase tracking-wider border-b border-gym-grey-light/20 pb-3 flex justify-between items-center">
                  <span>Modifying Tier: {pricingForm.name}</span>
                  <span className="text-[10px] text-gym-gold tracking-widest">{pricingForm.tagline}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Plan Name</label>
                    <input
                      type="text"
                      value={pricingForm.name}
                      onChange={(e) => setPricingForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Tagline</label>
                    <input
                      type="text"
                      value={pricingForm.tagline}
                      onChange={(e) => setPricingForm(prev => ({ ...prev, tagline: e.target.value }))}
                      required
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-bold uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Price (Monthly - ₹)</label>
                    <input
                      type="number"
                      value={pricingForm.priceMonthly}
                      onChange={(e) => setPricingForm(prev => ({ ...prev, priceMonthly: parseInt(e.target.value) || 0 }))}
                      required
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Price (Quarterly - ₹)</label>
                    <input
                      type="number"
                      value={pricingForm.priceQuarterly}
                      onChange={(e) => setPricingForm(prev => ({ ...prev, priceQuarterly: parseInt(e.target.value) || 0 }))}
                      required
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Price (Yearly - ₹)</label>
                    <input
                      type="number"
                      value={pricingForm.priceYearly}
                      onChange={(e) => setPricingForm(prev => ({ ...prev, priceYearly: parseInt(e.target.value) || 0 }))}
                      required
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Tier Description</label>
                  <textarea
                    value={pricingForm.desc}
                    onChange={(e) => setPricingForm(prev => ({ ...prev, desc: e.target.value }))}
                    required
                    rows="2"
                    className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-medium"
                  />
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="plan-highlighted"
                    checked={pricingForm.highlighted || false}
                    onChange={(e) => setPricingForm(prev => ({ ...prev, highlighted: e.target.checked }))}
                    className="w-4 h-4 accent-gym-gold cursor-pointer"
                  />
                  <label htmlFor="plan-highlighted" className="text-xs font-semibold text-gym-black uppercase tracking-wider cursor-pointer select-none">
                    ⭐ Recommended Tier (Will display "Recommended Tier" badge on live website)
                  </label>
                </div>

                {/* Plan Features */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-gym-grey-light/20 pb-2">
                    <span className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Included Perks/Features</span>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-[9px] uppercase font-bold text-gym-gold tracking-widest hover:text-gym-black flex items-center gap-0.5"
                    >
                      <Plus size={12} /> Add Feature Line
                    </button>
                  </div>
                  <div className="space-y-2">
                    {pricingForm.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleFeatureChange(idx, e.target.value)}
                          required
                          placeholder="Feature description line..."
                          className="flex-1 border border-gym-grey-light bg-transparent px-4 py-2.5 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 transition-colors"
                          title="Remove feature"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gym-grey-light/20">
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isSaving.pricing}
                      className="py-3 px-6 bg-gym-black text-white hover:bg-gym-gold hover:text-gym-black text-[10px] uppercase font-bold tracking-widest transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving.pricing ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Syncing to Cloud...
                        </>
                      ) : (
                        <>
                          <Save size={14} /> Save {pricingForm.name} Details
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handlePricingCancel}
                      className="py-3 px-6 border border-gym-grey-light text-gym-grey-muted hover:text-gym-black text-[10px] uppercase font-bold tracking-widest transition-all"
                    >
                      Cancel
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleDeletePlan}
                    className="py-3 px-6 border border-red-200 bg-red-50 hover:bg-red-500 hover:border-red-500 hover:text-white text-red-500 text-[10px] uppercase font-bold tracking-widest transition-all flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Delete Plan
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* TAB 4: TRAINERS BIOS */}
          {activeTab === 'trainers' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Existing Trainers List */}
              <div className="bg-white border border-gym-grey-light/30 p-8 shadow-sm space-y-6">
                <h3 className="font-display font-black text-sm uppercase tracking-wider border-b border-gym-grey-light/20 pb-3">
                  Current Certified Lineup
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.trainers.map((trainer) => (
                    <div key={trainer.id} className="flex border border-gym-grey-light p-4 gap-4 items-center justify-between bg-gym-grey-light/10">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <img 
                          src={trainer.image} 
                          alt={trainer.name} 
                          className="w-16 h-16 object-cover border border-gym-grey-light flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="block text-[9px] uppercase font-bold text-gym-gold tracking-widest">{trainer.role}</span>
                          <h4 className="font-display font-black text-sm uppercase truncate">{trainer.name}</h4>
                          <span className="block text-[10px] text-gym-grey-muted font-medium truncate">{trainer.specialization}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleTrainerEditClick(trainer)}
                          className="px-3 py-2 border border-gym-grey-light text-gym-black hover:bg-gym-grey-light/20 text-xs font-bold uppercase tracking-wider transition-all"
                        >
                          Edit Coach
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTrainer(trainer.id)}
                          className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 transition-all"
                          title="Remove trainer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add/Edit Trainer Form */}
              <form onSubmit={handleTrainerAdd} id="trainer-form" className="bg-white border border-gym-grey-light/30 p-8 shadow-sm space-y-6">
                <h3 className="font-display font-black text-sm uppercase tracking-wider border-b border-gym-grey-light/20 pb-3">
                  {editingTrainerId ? 'Modify Coach Details' : 'Register New Elite Coach'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Coach Name</label>
                    <input
                      type="text"
                      value={newTrainer.name}
                      onChange={(e) => setNewTrainer(prev => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="e.g. Vikram Titan Singh"
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Designation/Role</label>
                    <input
                      type="text"
                      value={newTrainer.role}
                      onChange={(e) => setNewTrainer(prev => ({ ...prev, role: e.target.value }))}
                      required
                      placeholder="e.g. Head Strength Coach"
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Specialization</label>
                    <input
                      type="text"
                      value={newTrainer.specialization}
                      onChange={(e) => setNewTrainer(prev => ({ ...prev, specialization: e.target.value }))}
                      required
                      placeholder="e.g. Posture Correction, Powerlifting"
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Rating (1.0 - 5.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={newTrainer.rating}
                      onChange={(e) => setNewTrainer(prev => ({ ...prev, rating: e.target.value }))}
                      required
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Credentials/Certificates (Comma Separated)</label>
                  <input
                    type="text"
                    value={newTrainer.certs}
                    onChange={(e) => setNewTrainer(prev => ({ ...prev, certs: e.target.value }))}
                    required
                    placeholder="e.g. ISSA Certified, 10+ Years Exp"
                    className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Coach Image URL</label>
                  <input
                    type="text"
                    value={newTrainer.image}
                    onChange={(e) => setNewTrainer(prev => ({ ...prev, image: e.target.value }))}
                    required
                    className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                  />
                  {newTrainer.image && (
                    <div className="mt-2 space-y-1">
                      <span className="block text-[9px] uppercase font-bold text-gym-grey-muted tracking-wider">Image Preview</span>
                      <div className="w-24 h-24 border border-gym-grey-light overflow-hidden bg-gym-grey-light/25">
                        <img 
                          src={newTrainer.image} 
                          alt="Coach preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSaving.trainer}
                    className="py-3 px-6 bg-gym-black text-white hover:bg-gym-gold hover:text-gym-black text-[10px] uppercase font-bold tracking-widest transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving.trainer ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Syncing to Cloud...
                      </>
                    ) : (
                      <>
                        {editingTrainerId ? <Save size={14} /> : <Plus size={14} />} 
                        {editingTrainerId ? 'Save Changes' : 'Add Coach to Roster'}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleTrainerCancel}
                    className="py-3 px-6 border border-gym-grey-light text-gym-grey-muted hover:text-gym-black text-[10px] uppercase font-bold tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>

            </div>
          )}

          {/* TAB 5: GALLERY SNAPS */}
          {activeTab === 'gallery' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Existing Snaps Grid */}
              <div className="bg-white border border-gym-grey-light/30 p-8 shadow-sm space-y-6">
                <h3 className="font-display font-black text-sm uppercase tracking-wider border-b border-gym-grey-light/20 pb-3">
                  Media Library Tour Grid
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {content.gallery.map((item, idx) => (
                    <div key={item.id} className="relative aspect-[4/3] group border border-gym-grey-light overflow-hidden bg-gym-grey-light/25 shadow-sm">
                      <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${item.image}')` }}
                      />
                      <div className="absolute inset-0 bg-gym-black/85 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
                        {/* Top: Category & Move Buttons */}
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] uppercase tracking-widest text-gym-gold font-black">{item.category}</span>
                          <div className="flex gap-1.5 bg-black/40 p-0.5 rounded">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveGalleryItem(idx, 'left')}
                              className="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-gym-gold hover:text-gym-black disabled:opacity-30 disabled:hover:bg-white/10 disabled:hover:text-white transition-all text-xs font-black"
                              title="Move Left"
                            >
                              ←
                            </button>
                            <button
                              type="button"
                              disabled={idx === content.gallery.length - 1}
                              onClick={() => handleMoveGalleryItem(idx, 'right')}
                              className="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-gym-gold hover:text-gym-black disabled:opacity-30 disabled:hover:bg-white/10 disabled:hover:text-white transition-all text-xs font-black"
                              title="Move Right"
                            >
                              →
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <h5 className="font-display font-black text-xs uppercase tracking-wide truncate">{item.title}</h5>

                        {/* Actions */}
                        <div className="flex justify-between items-center gap-2 pt-2 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => handleGalleryEditClick(item)}
                            className="px-2.5 py-1 bg-white/10 hover:bg-white hover:text-gym-black text-[9px] uppercase font-black tracking-wider transition-all"
                          >
                            Edit visual
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteGalleryItem(item.id)}
                            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                            title="Delete Snap"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add/Edit Gallery Item Form */}
              <form onSubmit={handleGalleryAdd} id="gallery-form" className="bg-white border border-gym-grey-light/30 p-8 shadow-sm space-y-6">
                <h3 className="font-display font-black text-sm uppercase tracking-wider border-b border-gym-grey-light/20 pb-3">
                  {editingGalleryId ? 'Modify Visual Asset' : 'Upload Visual Asset'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Photo Title</label>
                    <input
                      type="text"
                      value={newGalleryItem.title}
                      onChange={(e) => setNewGalleryItem(prev => ({ ...prev, title: e.target.value }))}
                      required
                      placeholder="e.g. Heavy Duty Squat Rack"
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Gallery Category</label>
                    <select
                      value={newGalleryItem.category}
                      onChange={(e) => setNewGalleryItem(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold font-sans"
                    >
                      <option value="Machinery">Machinery</option>
                      <option value="Workouts">Workouts</option>
                      <option value="Recovery">Recovery</option>
                      <option value="Fuel Bar">Fuel Bar</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Photo URL</label>
                  <input
                    type="text"
                    value={newGalleryItem.image}
                    onChange={(e) => setNewGalleryItem(prev => ({ ...prev, image: e.target.value }))}
                    required
                    className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                  />
                  {newGalleryItem.image && (
                    <div className="mt-2 space-y-1">
                      <span className="block text-[9px] uppercase font-bold text-gym-grey-muted tracking-wider">Image Preview</span>
                      <div className="w-40 h-28 border border-gym-grey-light overflow-hidden bg-gym-grey-light/25">
                        <img 
                          src={newGalleryItem.image} 
                          alt="Visual asset preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSaving.gallery}
                    className="py-3 px-6 bg-gym-black text-white hover:bg-gym-gold hover:text-gym-black text-[10px] uppercase font-bold tracking-widest transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving.gallery ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Syncing to Cloud...
                      </>
                    ) : (
                      <>
                        {editingGalleryId ? <Save size={14} /> : <Plus size={14} />}
                        {editingGalleryId ? 'Save Changes' : 'Add Picture to Media Tour'}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleGalleryCancel}
                    className="py-3 px-6 border border-gym-grey-light text-gym-grey-muted hover:text-gym-black text-[10px] uppercase font-bold tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>

            </div>
          )}

          {/* TAB 6: CLIENT REVIEWS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Existing Reviews */}
              <div className="bg-white border border-gym-grey-light/30 p-8 shadow-sm space-y-6">
                <h3 className="font-display font-black text-sm uppercase tracking-wider border-b border-gym-grey-light/20 pb-3">
                  Current Testimonials List
                </h3>

                <div className="space-y-4">
                  {content.testimonials.map((test) => (
                    <div key={test.id} className="flex border border-gym-grey-light p-4 gap-4 items-center justify-between bg-gym-grey-light/10">
                      <div className="flex items-center gap-4 flex-1">
                        <img 
                          src={test.avatar} 
                          alt={test.name} 
                          className="w-12 h-12 rounded-full object-cover border border-gym-grey-light flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="block text-[9px] uppercase font-bold text-gym-gold tracking-widest">{test.role}</span>
                          <h4 className="font-display font-black text-sm uppercase truncate">{test.name}</h4>
                          <p className="text-xs text-gym-grey-muted italic font-medium leading-relaxed mt-1">"{test.review}"</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTestimonial(test.id)}
                        className="p-3 text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 transition-all flex-shrink-0"
                        title="Remove Review"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Testimonial Form */}
              <form onSubmit={handleTestimonialAdd} className="bg-white border border-gym-grey-light/30 p-8 shadow-sm space-y-6">
                <h3 className="font-display font-black text-sm uppercase tracking-wider border-b border-gym-grey-light/20 pb-3">
                  Write Member Story
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Member Name</label>
                    <input
                      type="text"
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="e.g. Priyanka Sen"
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Member Title/Role</label>
                    <input
                      type="text"
                      value={newTestimonial.role}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, role: e.target.value }))}
                      required
                      placeholder="e.g. Elite Club Member"
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Avatar Image URL</label>
                  <input
                    type="text"
                    value={newTestimonial.avatar}
                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, avatar: e.target.value }))}
                    required
                    className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Review Statement</label>
                  <textarea
                    value={newTestimonial.review}
                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, review: e.target.value }))}
                    required
                    rows="3"
                    placeholder="Describe their experience with coaches, sauna, cryo, cafe, machines..."
                    className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving.testimonial}
                  className="py-3 px-6 bg-gym-black text-white hover:bg-gym-gold hover:text-gym-black text-[10px] uppercase font-bold tracking-widest transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving.testimonial ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Syncing to Cloud...
                    </>
                  ) : (
                    <>
                      <Plus size={14} /> Add Member Review
                    </>
                  )}
                </button>
              </form>

            </div>
          )}

          {/* TAB 7: CONTACT SETTINGS */}
          {activeTab === 'contact' && (
            <form onSubmit={handleContactSave} className="bg-white border border-gym-grey-light/30 p-8 shadow-sm space-y-6 animate-fade-in">
              <h3 className="font-display font-black text-sm uppercase tracking-wider border-b border-gym-grey-light/20 pb-3">
                Headquarters Contact Hotline & Locations
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Primary Phone Hotline</label>
                  <input
                    type="text"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Secondary Contact Hotline</label>
                  <input
                    type="text"
                    value={contactForm.phone2}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone2: e.target.value }))}
                    required
                    className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">WhatsApp Number (e.g. 919999999999)</label>
                  <input
                    type="text"
                    value={contactForm.whatsApp}
                    onChange={(e) => setContactForm(prev => ({ ...prev, whatsApp: e.target.value }))}
                    required
                    className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Support Email Address</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Gym Physical Address</label>
                <textarea
                  value={contactForm.address}
                  onChange={(e) => setContactForm(prev => ({ ...prev, address: e.target.value }))}
                  required
                  rows="2"
                  className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Timings Detail Line 1</label>
                  <input
                    type="text"
                    value={contactForm.timingsLine1}
                    onChange={(e) => setContactForm(prev => ({ ...prev, timingsLine1: e.target.value }))}
                    required
                    className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Timings Detail Line 2</label>
                  <input
                    type="text"
                    value={contactForm.timingsLine2}
                    onChange={(e) => setContactForm(prev => ({ ...prev, timingsLine2: e.target.value }))}
                    required
                    className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Google Maps Embed Link (Src URL)</label>
                <input
                  type="text"
                  value={contactForm.googleMapsSrc}
                  onChange={(e) => setContactForm(prev => ({ ...prev, googleMapsSrc: e.target.value }))}
                  required
                  className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Instagram Page</label>
                  <input
                    type="text"
                    value={contactForm.instagram}
                    onChange={(e) => setContactForm(prev => ({ ...prev, instagram: e.target.value }))}
                    required
                    className="w-full border border-gym-grey-light bg-transparent px-3 py-2.5 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Facebook Page</label>
                  <input
                    type="text"
                    value={contactForm.facebook}
                    onChange={(e) => setContactForm(prev => ({ ...prev, facebook: e.target.value }))}
                    required
                    className="w-full border border-gym-grey-light bg-transparent px-3 py-2.5 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Youtube Channel</label>
                  <input
                    type="text"
                    value={contactForm.youtube}
                    onChange={(e) => setContactForm(prev => ({ ...prev, youtube: e.target.value }))}
                    required
                    className="w-full border border-gym-grey-light bg-transparent px-3 py-2.5 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving.contact}
                className="py-3 px-6 bg-gym-black text-white hover:bg-gym-gold hover:text-gym-black text-[10px] uppercase font-bold tracking-widest transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving.contact ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Syncing to Cloud...
                  </>
                ) : (
                  <>
                    <Save size={14} /> Save Headquarters Setup
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 8: THEME SETTINGS */}
          {activeTab === 'theme' && (
            <form onSubmit={handleThemeSave} className="bg-white border border-gym-grey-light/30 p-8 shadow-sm space-y-6 animate-fade-in">
              <h3 className="font-display font-black text-sm uppercase tracking-wider border-b border-gym-grey-light/20 pb-3">
                Branding Aesthetics, Accent Palette & Theme Mode
              </h3>

              {/* Theme Toggle (Light luxury vs Night Mode) */}
              <div className="space-y-2 border-b border-gym-grey-light/20 pb-4">
                <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Design Palette Mode</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                    <input
                      type="radio"
                      name="lightLuxuryTheme"
                      checked={themeForm.lightLuxuryTheme === true}
                      onChange={() => setThemeForm(prev => ({ ...prev, lightLuxuryTheme: true }))}
                      className="accent-gym-gold w-4 h-4"
                    />
                    ☀️ Light Luxury Wellness (White & Gold)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                    <input
                      type="radio"
                      name="lightLuxuryTheme"
                      checked={themeForm.lightLuxuryTheme === false}
                      onChange={() => setThemeForm(prev => ({ ...prev, lightLuxuryTheme: false }))}
                      className="accent-gym-gold w-4 h-4"
                    />
                    🌙 Cinematic Night Mode (Matte Black & Silver)
                  </label>
                </div>
              </div>

              {/* Color Swatch Accent Picker */}
              <div className="space-y-3">
                <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Luxury Accent Color</label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { id: 'gold', label: 'Classic Gold', colorBg: 'bg-gold-metallic-gradient' },
                    { id: 'chrome', label: 'Chrome Silver', colorBg: 'bg-silver-metallic-gradient' },
                    { id: 'emerald', label: 'Emerald Green', colorBg: 'bg-emerald-500' },
                    { id: 'roseGold', label: 'Rose Gold', colorBg: 'bg-rose-300' }
                  ].map(swatch => (
                    <button
                      key={swatch.id}
                      type="button"
                      onClick={() => setThemeForm(prev => ({ ...prev, accentColor: swatch.id }))}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all ${
                        themeForm.accentColor === swatch.id
                          ? 'border-gym-black bg-gym-grey-light/20 scale-[1.03]'
                          : 'border-gym-grey-light/40 hover:border-gym-black bg-transparent'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border border-gym-black/10 inline-block flex-shrink-0 ${swatch.colorBg}`} />
                      {swatch.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family Config */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Display Font Family</label>
                  <select
                    value={themeForm.fontFamily}
                    onChange={(e) => setThemeForm(prev => ({ ...prev, fontFamily: e.target.value }))}
                    className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                  >
                    <option value="display">Outfit (Modern Luxury)</option>
                    <option value="sans">Inter (Classic Minimalist)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Button Corner Styles</label>
                  <select
                    value={themeForm.buttonStyle}
                    onChange={(e) => setThemeForm(prev => ({ ...prev, buttonStyle: e.target.value }))}
                    className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                  >
                    <option value="sharp">Sharp (0px - Luxury Ticket Feel)</option>
                    <option value="rounded">Rounded Corners (8px - Smooth App Feel)</option>
                    <option value="pill">Pill Shape (9999px - High Energy Athletic)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving.theme}
                className="py-3 px-6 bg-gym-black text-white hover:bg-gym-gold hover:text-gym-black text-[10px] uppercase font-bold tracking-widest transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving.theme ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Syncing to Cloud...
                  </>
                ) : (
                  <>
                    <Save size={14} /> Synchronize Theme Variables
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 9: CLOUD SYNC SETTINGS */}
          {activeTab === 'cloud' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white border border-gym-grey-light/30 p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gym-gold/5 rounded-full filter blur-2xl" />
                <div className="relative z-10 space-y-2">
                  <h3 className="font-display font-black text-xl uppercase tracking-tight">Cloud Database Synchronizer</h3>
                  <p className="text-xs text-gym-grey-muted leading-relaxed max-w-2xl font-medium">
                    By default, Good Life Fitness updates content locally across open browser tabs using same-browser synchronization.
                    To enable global updates across all devices, configure a **Firebase Firestore** cloud database.
                  </p>
                  <div className="pt-2">
                    {isCloudConnected ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-[10px] uppercase font-bold tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Status: Cloud Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 text-[10px] uppercase font-bold tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        Status: Local Offline Sync Only
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleCloudSave} className="bg-white border border-gym-grey-light/30 p-8 shadow-sm space-y-6">
                <h3 className="font-display font-black text-sm uppercase tracking-wider border-b border-gym-grey-light/20 pb-3">
                  Firebase Credentials Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Firebase API Key</label>
                    <input
                      type="text"
                      value={cloudForm.apiKey}
                      onChange={(e) => setCloudForm(prev => ({ ...prev, apiKey: e.target.value }))}
                      required
                      placeholder="AIzaSy..."
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Project ID</label>
                    <input
                      type="text"
                      value={cloudForm.projectId}
                      onChange={(e) => setCloudForm(prev => ({ ...prev, projectId: e.target.value }))}
                      required
                      placeholder="good-life-fitness-mumbai"
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Auth Domain</label>
                    <input
                      type="text"
                      value={cloudForm.authDomain}
                      onChange={(e) => setCloudForm(prev => ({ ...prev, authDomain: e.target.value }))}
                      placeholder="good-life-fitness-mumbai.firebaseapp.com"
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Storage Bucket</label>
                    <input
                      type="text"
                      value={cloudForm.storageBucket}
                      onChange={(e) => setCloudForm(prev => ({ ...prev, storageBucket: e.target.value }))}
                      placeholder="good-life-fitness-mumbai.appspot.com"
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Messaging Sender ID</label>
                    <input
                      type="text"
                      value={cloudForm.messagingSenderId}
                      onChange={(e) => setCloudForm(prev => ({ ...prev, messagingSenderId: e.target.value }))}
                      placeholder="893247294324"
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">App ID</label>
                    <input
                      type="text"
                      value={cloudForm.appId}
                      onChange={(e) => setCloudForm(prev => ({ ...prev, appId: e.target.value }))}
                      placeholder="1:893247294324:web:e3924f0c"
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gym-grey-muted tracking-wider">Collection Document Name</label>
                    <input
                      type="text"
                      value={cloudForm.docName}
                      onChange={(e) => setCloudForm(prev => ({ ...prev, docName: e.target.value }))}
                      required
                      placeholder="good-life-fitness-mumbai"
                      className="w-full border border-gym-grey-light bg-transparent px-4 py-3 text-xs text-gym-black focus:outline-none focus:border-gym-gold font-semibold"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSaving.cloud}
                    className="py-3 px-6 bg-gym-black text-white hover:bg-gym-gold hover:text-gym-black text-[10px] uppercase font-bold tracking-widest transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving.cloud ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Connecting & Syncing...
                      </>
                    ) : (
                      <>
                        <Save size={14} /> Connect & Push Content
                      </>
                    )}
                  </button>

                  {isCloudConnected && (
                    <button
                      type="button"
                      onClick={handleCloudDisconnect}
                      className="py-3 px-6 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 text-[10px] uppercase font-bold tracking-widest transition-all"
                    >
                      Disconnect Cloud Sync
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
