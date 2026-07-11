import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentContext } from '../context/ContentContext';
import { analyticsTracker } from '../utils/analytics';

// Core Components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackgroundEffects from '../components/BackgroundEffects';
import WhatsAppWidget from '../components/WhatsAppWidget';
import AdminAuthModal from '../components/AdminAuthModal';

// Page Sections
import Hero from '../sections/Hero';
import About from '../sections/About';
import Pricing from '../sections/Pricing';
import Trainers from '../sections/Trainers';
import Testimonials from '../sections/Testimonials';
import Gallery from '../sections/Gallery';
import Contact from '../sections/Contact';

const MainSite = () => {
  const { content } = useContext(ContentContext);
  const navigate = useNavigate();
  const { lightLuxuryTheme } = content.themeSettings;
  const activeTheme = lightLuxuryTheme ? 'light' : 'dark';

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Secret keyboard trigger: Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAuthModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Analytics scroll view tracking
  useEffect(() => {
    // Track initial page visit
    analyticsTracker.track('page_visit');

    const sections = document.querySelectorAll('[data-section]');
    const viewedSections = new Set();

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.25, // Track when 25% of section is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.getAttribute('data-section');
          if (sectionName && !viewedSections.has(sectionName)) {
            viewedSections.add(sectionName);
            analyticsTracker.track('section_view', { sectionName });
          }
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-transparent text-current">
      {/* Background Canvas Particles and ambient light glows */}
      <BackgroundEffects theme={activeTheme} />

      {/* Floating Header Navbar */}
      <Navbar theme={activeTheme} onAdminTrigger={() => setIsAuthModalOpen(true)} />

      {/* Main Content Sections */}
      <main className="relative z-10 w-full">
        <div id="hero-section" data-section="Hero"><Hero /></div>
        <div id="about-section" data-section="About"><About /></div>
        <div id="pricing-section" data-section="Pricing"><Pricing /></div>
        <div id="trainers-section" data-section="Trainers"><Trainers /></div>
        <div id="gallery-section" data-section="Gallery"><Gallery /></div>
        <div id="testimonials-section" data-section="Testimonials"><Testimonials /></div>
        <div id="contact-section" data-section="Contact"><Contact /></div>
      </main>

      {/* Global Concierge Floating Widget */}
      <WhatsAppWidget theme={activeTheme} />

      {/* Footer Branding Links */}
      <Footer />

      {/* Hidden Luxury Authentication Modal */}
      <AdminAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default MainSite;

