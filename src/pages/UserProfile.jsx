import React, { useState, useEffect } from 'react';
import { 
  User, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  ArrowLeft,
  Dumbbell,
  Target,
  Sparkles,
  Scale,
  Plus,
  Trash2,
  Calendar,
  Activity,
  Layers
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserProfile = () => {
  const { user, updateProfile, updateSubscription } = useAuth();

  const [name, setName] = useState('');
  const [age, setAge] = useState(26);
  const [gender, setGender] = useState('unspecified');
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);
  const [fitnessLevel, setFitnessLevel] = useState('beginner');
  const [primaryGoal, setPrimaryGoal] = useState('general_fitness');
  const [equipment, setEquipment] = useState(['bodyweight']);
  const [targetWorkouts, setTargetWorkouts] = useState(3);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Biometric Measurement Logging State
  const [measurements, setMeasurements] = useState([]);
  const [loadingMeasurements, setLoadingMeasurements] = useState(false);
  const [newWeight, setNewWeight] = useState(72);
  const [newHeight, setNewHeight] = useState(175);
  const [newBodyFat, setNewBodyFat] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [submittingMeasurement, setSubmittingMeasurement] = useState(false);
  const [measMsg, setMeasMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      const prof = user.profile || {};
      if (prof.age) setAge(prof.age);
      if (prof.gender) setGender(prof.gender);
      if (prof.heightCm) {
        setHeightCm(prof.heightCm);
        setNewHeight(prof.heightCm);
      }
      if (prof.weightKg) {
        setWeightKg(prof.weightKg);
        setNewWeight(prof.weightKg);
      }
      if (prof.fitnessLevel) setFitnessLevel(prof.fitnessLevel);
      if (prof.primaryGoal) setPrimaryGoal(prof.primaryGoal);
      if (prof.availableEquipment) setEquipment(prof.availableEquipment);
      if (prof.targetWorkoutsPerWeek) setTargetWorkouts(prof.targetWorkoutsPerWeek);
    }
  }, [user]);

  // Fetch measurement history
  const fetchMeasurements = async () => {
    setLoadingMeasurements(true);
    try {
      const res = await api.get('/body/measurements');
      if (res.success && Array.isArray(res.data)) {
        setMeasurements(res.data);
      }
    } catch (err) {
      console.warn('Failed to load measurements:', err);
    } finally {
      setLoadingMeasurements(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMeasurements();
    }
  }, [user]);

  const toggleEquipment = (item) => {
    if (equipment.includes(item)) {
      if (equipment.length > 1) {
        setEquipment(equipment.filter((e) => e !== item));
      }
    } else {
      setEquipment([...equipment, item]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await updateProfile({
        age: Number(age),
        gender,
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        fitnessLevel,
        primaryGoal,
        availableEquipment: equipment,
        targetWorkoutsPerWeek: Number(targetWorkouts),
      });

      if (res.success) {
        setSuccessMsg('Fitness profile and biometric metrics updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res.error || 'Failed to update profile');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const handleAddMeasurement = async (e) => {
    e.preventDefault();
    setSubmittingMeasurement(true);
    setMeasMsg('');

    try {
      const payload = {
        weightKg: Number(newWeight),
        heightCm: Number(newHeight),
        bodyFatPercentage: newBodyFat ? Number(newBodyFat) : undefined,
        notes: newNotes || undefined,
      };

      const res = await api.post('/body/measurements', payload);
      if (res.success) {
        setMeasMsg('Biometric measurement successfully logged in MongoDB!');
        setNewNotes('');
        setNewBodyFat('');
        await fetchMeasurements();
        setTimeout(() => setMeasMsg(''), 4000);
      }
    } catch (err) {
      console.error('Failed to log measurement:', err);
    } finally {
      setSubmittingMeasurement(false);
    }
  };

  const handleDeleteMeasurement = async (id) => {
    try {
      const res = await api.delete(`/body/measurements/${id}`);
      if (res.success) {
        setMeasurements(measurements.filter((m) => m._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete measurement:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#171916] flex flex-col font-sans transition-colors selection:bg-[#C6A66B]/20 selection:text-[#171916]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        
        {/* Page Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173F35]/10 text-[#173F35] text-[10px] font-bold tracking-[0.2em] uppercase mb-3 border border-[#173F35]/15">
            <Sparkles className="w-3 h-3 text-[#C6A66B]" />
            Member Sanctuary Calibration
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#171916]">
            Profile & Biometric Settings
          </h1>
          <p className="mt-2 text-[#85877F] text-xs sm:text-sm max-w-2xl leading-relaxed">
            Calibrate your physiological baseline, body composition telemetry, and authoritative private club entitlements.
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-[#173F35]/10 border border-[#173F35]/30 text-[#173F35] text-xs font-semibold flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-[#173F35] shrink-0" />
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* Profile Details Form */}
        <form onSubmit={handleSubmit} className="bg-[#FFFFFF] p-6 sm:p-10 rounded-3xl border border-[#E5E1D7] shadow-sm space-y-8 mb-10">
          {/* Physiological Metrics */}
          <div>
            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C6A66B] block">
                Primary Physiological Metrics
              </span>
              <h3 className="font-serif text-xl font-bold text-[#171916]">
                Basal Calibration
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#171916] mb-1.5 uppercase tracking-wider">Age (Years)</label>
                <input
                  type="number"
                  min="12"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E1D7] bg-[#F5F1E8] focus:bg-white text-sm focus:outline-none focus:border-[#173F35] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171916] mb-1.5 uppercase tracking-wider">Height (cm)</label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E1D7] bg-[#F5F1E8] focus:bg-white text-sm focus:outline-none focus:border-[#173F35] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171916] mb-1.5 uppercase tracking-wider">Weight (kg)</label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E1D7] bg-[#F5F1E8] focus:bg-white text-sm focus:outline-none focus:border-[#173F35] transition"
                />
              </div>
            </div>
          </div>

          {/* Training Level & Goal */}
          <div className="pt-6 border-t border-[#E5E1D7]">
            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C6A66B] block">
                Movement Architecture
              </span>
              <h3 className="font-serif text-xl font-bold text-[#171916]">
                Training Objectives
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#171916] mb-1.5 uppercase tracking-wider">Fitness Level</label>
                <select
                  value={fitnessLevel}
                  onChange={(e) => setFitnessLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E1D7] bg-[#F5F1E8] focus:bg-white text-sm capitalize focus:outline-none focus:border-[#173F35] transition"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171916] mb-1.5 uppercase tracking-wider">Primary Objective</label>
                <select
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E1D7] bg-[#F5F1E8] focus:bg-white text-sm capitalize focus:outline-none focus:border-[#173F35] transition"
                >
                  <option value="general_fitness">General Durability & Health</option>
                  <option value="muscle_building">Muscle Hypertrophy & Strength</option>
                  <option value="fat_loss">Metabolic Conditioning & Fat Loss</option>
                  <option value="endurance">Muscular Endurance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Equipment Available */}
          <div className="pt-6 border-t border-[#E5E1D7]">
            <div className="mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C6A66B] block">
                Apparatus Availability
              </span>
              <h3 className="font-serif text-xl font-bold text-[#171916]">
                Available Equipment
              </h3>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {[
                { id: 'bodyweight', label: 'Bodyweight Only' },
                { id: 'dumbbells', label: 'Dumbbells' },
                { id: 'barbell', label: 'Barbell & Plates' },
                { id: 'resistance_bands', label: 'Resistance Bands' },
                { id: 'gym_machines', label: 'Gym Machines' },
              ].map((item) => {
                const isSelected = equipment.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleEquipment(item.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition ${
                      isSelected
                        ? 'bg-[#173F35] text-[#F5F1E8] border-[#173F35] shadow-xs'
                        : 'bg-[#F5F1E8] text-[#171916] border-[#E5E1D7] hover:border-[#173F35]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weekly Workouts Target */}
          <div className="pt-6 border-t border-[#E5E1D7]">
            <label className="block text-xs font-bold text-[#171916] mb-2 uppercase tracking-wider">
              Target Training Sessions: {targetWorkouts} workouts / week
            </label>
            <input
              type="range"
              min="1"
              max="7"
              value={targetWorkouts}
              onChange={(e) => setTargetWorkouts(e.target.value)}
              className="w-full accent-[#173F35]"
            />
          </div>

          <div className="pt-6 border-t border-[#E5E1D7] flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#173F35] hover:bg-[#1f5043] text-[#F5F1E8] font-bold text-xs uppercase tracking-wider transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#C6A66B]" />
              {saving ? 'Synchronizing...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>

        {/* Biometric Measurement Tracking Section */}
        <div className="bg-[#FFFFFF] p-6 sm:p-10 rounded-3xl border border-[#E5E1D7] shadow-sm mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#173F35]/10 text-[#173F35] text-[10px] font-bold tracking-[0.16em] uppercase mb-1">
                <Scale className="w-3 h-3 text-[#C6A66B]" />
                Cloud Biometric Tracker
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#171916]">
                Body Measurements & BMI Log
              </h3>
              <p className="text-xs text-[#85877F] mt-1">
                Log changes in bodyweight and height to track your metabolic trends over time.
              </p>
            </div>
          </div>

          {measMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-[#173F35]/10 border border-[#173F35]/30 text-[#173F35] text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#173F35] shrink-0" />
              {measMsg}
            </div>
          )}

          {/* Log New Measurement Form */}
          <form onSubmit={handleAddMeasurement} className="p-5 bg-[#F5F1E8] rounded-2xl border border-[#E5E1D7] mb-8">
            <h4 className="font-serif font-bold text-sm text-[#171916] mb-3">
              Record New Biometric Measurement
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-[#171916] mb-1 uppercase tracking-wider">Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E1D7] bg-[#FFFFFF] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#171916] mb-1 uppercase tracking-wider">Height (cm) *</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={newHeight}
                  onChange={(e) => setNewHeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E1D7] bg-[#FFFFFF] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#171916] mb-1 uppercase tracking-wider">Body Fat % (Opt)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 15.5"
                  value={newBodyFat}
                  onChange={(e) => setNewBodyFat(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E1D7] bg-[#FFFFFF] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#171916] mb-1 uppercase tracking-wider">Notes (Opt)</label>
                <input
                  type="text"
                  placeholder="Morning weigh-in"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E1D7] bg-[#FFFFFF] text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingMeasurement}
                className="px-5 py-2.5 rounded-xl bg-[#173F35] hover:bg-[#1f5043] text-[#F5F1E8] text-xs font-bold uppercase tracking-wider transition shadow-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                <Plus size={14} className="text-[#C6A66B]" />
                {submittingMeasurement ? 'Logging...' : 'Save Biometric Entry'}
              </button>
            </div>
          </form>

          {/* Measurements Historical Table */}
          {loadingMeasurements ? (
            <div className="h-32 bg-[#F5F1E8] rounded-2xl animate-pulse" />
          ) : measurements.length === 0 ? (
            <div className="p-8 text-center bg-[#F5F1E8] rounded-2xl border border-[#E5E1D7]">
              <p className="text-xs text-[#85877F]">No measurement logs saved yet. Record your first weigh-in above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E5E1D7] text-[#85877F] uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-bold">Date</th>
                    <th className="pb-3 font-bold">Weight</th>
                    <th className="pb-3 font-bold">Height</th>
                    <th className="pb-3 font-bold">BMI</th>
                    <th className="pb-3 font-bold">Classification</th>
                    <th className="pb-3 font-bold">Notes</th>
                    <th className="pb-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1D7]">
                  {measurements.map((m) => (
                    <tr key={m._id} className="hover:bg-[#F5F1E8]/60 transition">
                      <td className="py-3 text-[#171916] font-medium">
                        {new Date(m.recordedAt || m.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 font-bold text-[#171916]">{m.weightKg} kg</td>
                      <td className="py-3 text-[#85877F]">{m.heightCm} cm</td>
                      <td className="py-3 font-bold text-[#173F35]">{m.bmi ? m.bmi.toFixed(1) : '--'}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full bg-[#173F35]/10 text-[#173F35] text-[10px] font-semibold uppercase">
                          {m.bmiCategory || 'Normal'}
                        </span>
                      </td>
                      <td className="py-3 text-[#85877F] truncate max-w-[120px]">{m.notes || '—'}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteMeasurement(m._id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                          title="Delete entry"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MongoDB Authoritative Subscription & Entitlements */}
        <div className="bg-[#FFFFFF] p-6 sm:p-10 rounded-3xl border border-[#E5E1D7] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#C6A66B] block">
                Authoritative Tier Verification
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#171916] mt-0.5">Membership Plan & Entitlements</h3>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-[#173F35] text-[#C6A66B] border border-[#26745A] text-xs font-bold uppercase tracking-wider">
              {user?.subscription?.tier || 'Free'} Tier
            </span>
          </div>

          <p className="text-xs text-[#85877F] leading-relaxed mb-6">
            Subscription verification is enforced authoritatively on the MongoDB backend. Cached client preferences cannot grant elevated privileges.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { id: 'free', label: 'Free Tier', desc: 'Standard workouts' },
              { id: 'gold', label: 'Gold Club', desc: 'Full AI tracking' },
              { id: 'elite', label: 'Elite Executive', desc: 'Custom nutrition' },
              { id: 'vip', label: 'Black Label VIP', desc: 'VIP concierge' },
            ].map((tier) => {
              const isCurrent = (user?.subscription?.tier || 'free') === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={async () => {
                    setSaving(true);
                    await updateSubscription(tier.id);
                    setSaving(false);
                    setSuccessMsg(`Plan updated to ${tier.label} in MongoDB.`);
                    setTimeout(() => setSuccessMsg(''), 3000);
                  }}
                  className={`p-4 rounded-2xl text-left border transition ${
                    isCurrent
                      ? 'border-[#173F35] bg-[#173F35]/5 shadow-sm ring-1 ring-[#173F35]'
                      : 'border-[#E5E1D7] hover:border-[#173F35] bg-[#F5F1E8]'
                  }`}
                >
                  <p className="font-serif font-bold text-sm text-[#171916]">{tier.label}</p>
                  <p className="text-[11px] text-[#85877F] mt-0.5">{tier.desc}</p>
                  {isCurrent && (
                    <span className="inline-block mt-3 text-[10px] font-bold text-[#173F35] bg-[#173F35]/15 px-2.5 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfile;
