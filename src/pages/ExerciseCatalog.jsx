import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  Search, 
  Filter, 
  Camera, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertCircle,
  Eye,
  Heart
} from 'lucide-react';
import api from '../services/api';
import storageService from '../services/storageService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ExerciseCatalog = () => {
  const [exercises, setExercises] = useState(() => {
    return storageService.getCache('exercises-catalog') || [];
  });
  const [loading, setLoading] = useState(exercises.length === 0);
  const [error, setError] = useState(null);
  const [isFromCache, setIsFromCache] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [onlyAiTracked, setOnlyAiTracked] = useState(false);

  // Favorites stored locally
  const [favorites, setFavorites] = useState(() => {
    return storageService.getItem('preferences:favorite-exercises', []);
  });

  const toggleFavorite = (exerciseId, e) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = favorites.includes(exerciseId)
      ? favorites.filter((id) => id !== exerciseId)
      : [...favorites, exerciseId];
    setFavorites(updated);
    storageService.setItem('preferences:favorite-exercises', updated);
  };

  useEffect(() => {
    const fetchExercises = async () => {
      setError(null);
      try {
        let url = '/exercises';
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') params.append('category', selectedCategory);
        if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);
        if (selectedEquipment !== 'all') params.append('equipment', selectedEquipment);
        if (onlyAiTracked) params.append('tracking', 'true');
        if (searchQuery.trim()) params.append('search', searchQuery.trim());

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const res = await api.get(url);
        if (res.success) {
          setExercises(res.data);
          setIsFromCache(false);
          if (selectedCategory === 'all' && selectedDifficulty === 'all' && selectedEquipment === 'all' && !onlyAiTracked && !searchQuery.trim()) {
            storageService.setCache('exercises-catalog', res.data, '1.0');
          }
        }
      } catch (err) {
        const cached = storageService.getCache('exercises-catalog');
        if (cached && cached.length > 0) {
          setExercises(cached);
          setIsFromCache(true);
        } else {
          setError(err.message || 'Failed to load exercises');
        }
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchExercises, 200);
    return () => clearTimeout(timeout);
  }, [selectedCategory, selectedDifficulty, selectedEquipment, onlyAiTracked, searchQuery]);

  const categories = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'strength', label: 'Strength' },
    { id: 'core', label: 'Core Stability' },
    { id: 'hiit', label: 'Cardio & HIIT' },
    { id: 'mobility', label: 'Mobility' },
  ];

  const difficulties = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F1E8] dark:bg-[#171916] text-[#171916] dark:text-[#F5F1E8] flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173F35]/10 dark:bg-[#173F35]/25 border border-[#173F35]/20 dark:border-[#26745A]/30 text-[#173F35] dark:text-[#C6A66B] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
            <Sparkles className="w-3 h-3 text-[#C6A66B]" />
            Biomechanical Exercise Library
          </div>
          {isFromCache && (
            <div className="mb-2 block">
              <span className="px-2.5 py-0.5 rounded-full bg-[#E5E1D7] dark:bg-[#2E322C] text-[#85877F] text-[10px] font-bold uppercase tracking-wider">
                Offline Cache Mode Active
              </span>
            </div>
          )}
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-[#171916] dark:text-[#F5F1E8]">
            Movement Catalogue & Biomechanics
          </h1>
          <p className="mt-2 text-[#85877F] dark:text-[#A8AAA3] text-xs sm:text-sm">
            Calibrated movements engineered with anatomical form cues, joint angle criteria, and computer vision pose tracking.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-[#FFFFFF] dark:bg-[#1E211D] p-5 rounded-3xl border border-[#E5E1D7] dark:border-[#2E322C] shadow-sm mb-10 space-y-4">
          {/* Search Input Row */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#85877F]" />
              <input
                type="text"
                placeholder="Search by exercise name, target muscle, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C] rounded-xl text-xs text-[#171916] dark:text-[#F5F1E8] focus:outline-none focus:border-[#173F35]"
              />
            </div>

            {/* Quick stats and AI Tracked switch */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <span className="text-xs font-semibold text-[#85877F]">
                Showing {exercises.length} movements
              </span>
              <button
                onClick={() => setOnlyAiTracked(!onlyAiTracked)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border transition ${
                  onlyAiTracked
                    ? 'bg-[#173F35] text-[#F5F1E8] border-[#173F35]'
                    : 'bg-[#FAF8F3] dark:bg-[#171916] border-[#E5E1D7] dark:border-[#2E322C] text-[#85877F] hover:border-[#173F35]'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-[#C6A66B]" />
                AI Tracked Only
              </button>
            </div>
          </div>

          {/* Filter Pills Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#E5E1D7] dark:border-[#2E322C]">
            {/* Categories */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedCategory === cat.id
                      ? 'bg-[#173F35] text-[#F5F1E8] shadow-xs'
                      : 'text-[#85877F] hover:text-[#171916] dark:hover:text-[#F5F1E8] bg-[#FAF8F3] dark:bg-[#171916]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Difficulty Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase font-bold text-[#85877F]">Level:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C] text-xs font-semibold text-[#171916] dark:text-[#F5F1E8] focus:outline-none focus:border-[#173F35]"
              >
                {difficulties.map((diff) => (
                  <option key={diff.id} value={diff.id}>{diff.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#173F35] mx-auto mb-4"></div>
            <p className="text-xs text-[#85877F]">Retrieving calibrated exercise data from MongoDB...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center bg-[#FFFFFF] dark:bg-[#1E211D] rounded-3xl border border-rose-200 p-8 max-w-md mx-auto">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-rose-700">Failed to Load Exercises</h3>
            <p className="text-xs text-[#85877F] mt-1 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-[#173F35] text-white text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        ) : exercises.length === 0 ? (
          <div className="py-20 text-center bg-[#FFFFFF] dark:bg-[#1E211D] rounded-3xl border border-[#E5E1D7] dark:border-[#2E322C] p-8 max-w-md mx-auto">
            <Dumbbell className="w-8 h-8 text-[#85877F] mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#171916] dark:text-[#F5F1E8]">No Exercises Match Filters</h3>
            <p className="text-xs text-[#85877F] mt-1 mb-4">Try clearing search query or choosing another category.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedDifficulty('all'); setOnlyAiTracked(false); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-[#173F35] text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Exercise Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => {
              const isFav = favorites.includes(exercise.exerciseId);

              return (
                <div
                  key={exercise._id || exercise.exerciseId}
                  className="bg-[#FFFFFF] dark:bg-[#1E211D] rounded-3xl border border-[#E5E1D7] dark:border-[#2E322C] shadow-xs overflow-hidden flex flex-col justify-between group hover:border-[#173F35]/40 dark:hover:border-[#C6A66B]/40 transition-all duration-300"
                >
                  {/* Image & Badges Banner */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#171916]">
                    <img
                      src={exercise.demoMedia?.image || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop'}
                      alt={exercise.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop';
                      }}
                    />

                    {/* Gradient overlay for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171916]/80 via-transparent to-black/20 pointer-events-none" />

                    {/* AI Tracked Pill */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {exercise.trackingSupported ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#173F35]/90 backdrop-blur-md text-[#F5F1E8] border border-[#26745A]/50 text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Camera size={11} className="text-[#C6A66B]" />
                          AI Tracked
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-[#171916]/80 backdrop-blur-md text-[#A8AAA3] border border-white/10 text-[9.5px] font-bold uppercase tracking-wider">
                          Instructional
                        </span>
                      )}
                    </div>

                    {/* Difficulty Pill & Favorite */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-white/90 dark:bg-[#171916]/90 backdrop-blur-md text-[#171916] dark:text-[#F5F1E8] text-[9.5px] font-bold uppercase tracking-wider">
                        {exercise.difficulty}
                      </span>
                      <button
                        onClick={(e) => toggleFavorite(exercise.exerciseId, e)}
                        className={`p-1.5 rounded-full backdrop-blur-md transition ${
                          isFav ? 'bg-rose-600 text-white' : 'bg-black/40 text-white/80 hover:text-white'
                        }`}
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart size={12} className={isFav ? 'fill-current' : ''} />
                      </button>
                    </div>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-3 left-4 right-4 pointer-events-none">
                      <span className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#C6A66B] block">
                        {exercise.category} &bull; {exercise.equipment}
                      </span>
                      <h3 className="text-lg font-bold text-white tracking-tight leading-tight">
                        {exercise.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs text-[#85877F] dark:text-[#A8AAA3] line-clamp-2 leading-relaxed">
                      {exercise.shortDescription}
                    </p>

                    {/* Target Muscle Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {exercise.targetMuscles?.primary?.map((m, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C] text-[#85877F] text-[10px] font-bold uppercase tracking-wider"
                        >
                          {m}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-[#E5E1D7] dark:border-[#2E322C] flex items-center justify-between gap-3">
                      <Link
                        to={`/exercises/${exercise.exerciseId}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E1D7] dark:border-[#2E322C] hover:border-[#173F35] text-xs font-semibold text-[#171916] dark:text-[#F5F1E8] transition"
                      >
                        <Eye size={12} />
                        Details
                      </Link>

                      {exercise.trackingSupported ? (
                        <Link
                          to={`/workout/active/${exercise.exerciseId}`}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#173F35] hover:bg-[#1F5144] text-[#F5F1E8] text-xs font-semibold transition shadow-xs tracking-wide"
                        >
                          <Camera size={12} className="text-[#C6A66B]" />
                          Start Session
                          <ArrowRight size={11} />
                        </Link>
                      ) : (
                        <Link
                          to={`/exercises/${exercise.exerciseId}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C] text-[#85877F] text-xs font-semibold hover:text-[#171916]"
                        >
                          Movement Guide
                          <ArrowRight size={11} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default ExerciseCatalog;
