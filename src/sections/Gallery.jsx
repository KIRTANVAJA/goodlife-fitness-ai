import React, { useState, useContext } from 'react';
import { X, ZoomIn, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentContext } from '../context/ContentContext';

const Gallery = () => {
  const { content } = useContext(ContentContext);
  const galleryItems = content.gallery;
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);

  const categories = ['All', 'Machinery', 'Workouts', 'Recovery', 'Fuel Bar'];

  const filteredItems = activeCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <section id="gallery" className="relative py-24 bg-transparent overflow-hidden">
      {/* Background glow flares */}
      <div className="absolute top-[30%] -right-[10vw] w-[35vw] h-[35vw] bg-gym-gold-dark/5 dark:bg-gym-silver-dark/5 rounded-full filter blur-[120px] pointer-events-none transition-colors duration-1000" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <h4 className="text-xs font-bold font-display text-gym-gold dark:text-gym-silver uppercase tracking-[0.25em] transition-colors duration-1000">
            VISUAL TOUR
          </h4>
          <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight text-gym-black dark:text-white leading-tight transition-colors duration-1000">
            THE GOOD LIFE <span className="text-brand-gradient">SOCIETY</span>
          </h2>
          <p className="text-xs md:text-sm text-gym-grey-secondary max-w-xl mx-auto font-medium transition-colors duration-1000">
            Explore actual snaps of our training floors, premium locker rooms, recovery lounges, and health cafe spaces.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-gym-gold/20 dark:border-gym-border/40 pb-6 transition-colors duration-1000">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{ borderRadius: 'var(--button-radius)' }}
              className={`px-5 py-2.5 font-display text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gym-gold dark:bg-gym-silver text-gym-black shadow-lg'
                  : 'bg-gym-gold/5 dark:bg-gym-card/50 text-gym-black/60 dark:text-gym-grey-muted border border-gym-gold/20 dark:border-gym-border/60 hover:text-gym-gold dark:hover:text-white hover:border-gym-gold dark:hover:border-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                onClick={() => setLightboxImage(item)}
                style={{ borderRadius: 'var(--button-radius)' }}
                className="group relative aspect-[4/3] overflow-hidden border border-gym-gold/20 dark:border-gym-border hover:border-gym-gold dark:hover:border-gym-silver cursor-pointer bg-gym-gold/5 dark:bg-gym-card select-none transition-all duration-500"
              >
                {/* Visual Image */}
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gym-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-6 z-10">
                  <ZoomIn className="text-gym-gold dark:text-gym-silver mb-2.5 transition-transform duration-300 group-hover:scale-110" size={24} />
                  <span className="block text-[8px] uppercase tracking-widest text-gym-gold dark:text-gym-silver font-bold mb-1 transition-colors duration-1000">
                    {item.category}
                  </span>
                  <h3 className="font-display font-bold uppercase text-xs tracking-wider text-white">
                    {item.title}
                  </h3>
                </div>

                {/* Ambient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-gym-black/40 to-transparent pointer-events-none" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 bg-gym-black/98 z-50 flex flex-col items-center justify-center p-6 cursor-zoom-out"
          >
            {/* Close Button */}
            <button 
              onClick={() => setLightboxImage(null)}
              style={{ borderRadius: 'var(--button-radius)' }}
              className="absolute top-6 right-6 w-12 h-12 bg-white dark:bg-gym-card border border-gym-gold/20 dark:border-gym-border text-gym-black dark:text-white hover:text-gym-gold dark:hover:text-gym-silver flex items-center justify-center transition-colors duration-1000"
              aria-label="Close Preview"
            >
              <X size={20} />
            </button>

            {/* Lightbox content */}
            <div 
              style={{ borderRadius: 'var(--button-radius)' }}
              className="relative max-w-4xl max-h-[80vh] overflow-hidden border border-gym-gold/20 dark:border-gym-border" 
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={lightboxImage.image} 
                alt={lightboxImage.title}
                className="w-full h-auto max-h-[75vh] object-contain"
              />
              
              {/* Image Description bar */}
              <div className="bg-white/95 dark:bg-gym-card/90 p-4 border-t border-gym-gold/20 dark:border-gym-border flex items-center justify-between text-left transition-colors duration-1000">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-gym-gold dark:text-gym-silver tracking-widest transition-colors duration-1000">
                    {lightboxImage.category}
                  </span>
                  <h4 className="font-display font-black text-sm uppercase text-gym-black dark:text-white tracking-wider transition-colors duration-1000">
                    {lightboxImage.title}
                  </h4>
                </div>
                <div className="text-[10px] text-gym-grey-muted uppercase font-bold tracking-widest flex items-center gap-1 transition-colors duration-1000">
                  <Eye size={12} className="text-gym-gold dark:text-gym-silver transition-colors duration-1000" /> GLF Media Room
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
