import React, { useState } from 'react';
import { Calculator, ArrowRight, ShieldCheck, Check, AlertCircle, Save, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BmiCalculator = () => {
  const { user, isAuthenticated } = useAuth();

  const [unit, setUnit] = useState('metric'); // 'metric' (kg, cm) | 'imperial' (lbs, ft, in)
  const [weight, setWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [weightLbs, setWeightLbs] = useState('');

  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [advice, setAdvice] = useState('');
  const [calculatedWeightKg, setCalculatedWeightKg] = useState(null);
  const [calculatedHeightCm, setCalculatedHeightCm] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const calculateBMI = (e) => {
    e.preventDefault();
    setValidationError('');
    setSavedSuccess(false);

    let weightKgNum = 0;
    let heightMetersNum = 0;
    let heightCmNum = 0;

    if (unit === 'metric') {
      const w = parseFloat(weight);
      const h = parseFloat(heightCm);

      if (isNaN(w) || isNaN(h)) {
        setValidationError('Please enter valid numerical measurements for height and weight.');
        return;
      }
      if (w <= 0 || h <= 0) {
        setValidationError('Height and weight must be greater than zero.');
        return;
      }
      if (w < 25 || w > 350) {
        setValidationError('Weight must be within a realistic physiological range (25 kg - 350 kg).');
        return;
      }
      if (h < 60 || h > 260) {
        setValidationError('Height must be within a realistic range (60 cm - 260 cm).');
        return;
      }

      weightKgNum = w;
      heightCmNum = h;
      heightMetersNum = h / 100;
    } else {
      const lbs = parseFloat(weightLbs);
      const ft = parseFloat(heightFeet);
      const inches = parseFloat(heightInches || '0');

      if (isNaN(lbs) || isNaN(ft) || isNaN(inches)) {
        setValidationError('Please enter valid numerical imperial measurements.');
        return;
      }
      if (lbs <= 0 || ft <= 0) {
        setValidationError('Height and weight must be greater than zero.');
        return;
      }
      if (lbs < 55 || lbs > 770) {
        setValidationError('Weight must be within realistic bounds (55 lbs - 770 lbs).');
        return;
      }

      const totalInches = ft * 12 + inches;
      if (totalInches < 24 || totalInches > 102) {
        setValidationError('Height must be within realistic bounds (2 ft - 8 ft 6 in).');
        return;
      }

      weightKgNum = lbs * 0.45359237;
      heightMetersNum = totalInches * 0.0254;
      heightCmNum = totalInches * 2.54;
    }

    const computedBmi = parseFloat((weightKgNum / (heightMetersNum * heightMetersNum)).toFixed(1));

    if (isNaN(computedBmi) || !isFinite(computedBmi)) {
      setValidationError('Calculation produced an invalid result. Please verify inputs.');
      return;
    }

    setBmi(computedBmi);
    setCalculatedWeightKg(parseFloat(weightKgNum.toFixed(1)));
    setCalculatedHeightCm(Math.round(heightCmNum));

    if (computedBmi < 18.5) {
      setCategory('Underweight');
      setAdvice('A structured caloric surplus paired with progressive resistance training is recommended to build lean functional muscle tissue safely.');
    } else if (computedBmi >= 18.5 && computedBmi < 25.0) {
      setCategory('Normal Weight');
      setAdvice('Optimal epidemiological classification range. Maintain balanced macronutrient intake and compound resistance movements for longevity and athletic power.');
    } else if (computedBmi >= 25.0 && computedBmi < 30.0) {
      setCategory('Overweight');
      setAdvice('A moderate caloric deficit paired with metabolic conditioning and compound resistance training promotes fat loss while preserving lean mass.');
    } else {
      setCategory('Obesity Range');
      setAdvice('Prioritize low-impact aerobic conditioning and structured resistance training to safeguard joint health while improving metabolic biomarkers.');
    }
  };

  const handleSaveToHistory = async () => {
    if (!isAuthenticated) return;
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await api.post('/body/measurements', {
        weightKg: calculatedWeightKg,
        heightCm: calculatedHeightCm,
        notes: `Calculated from Good Life BMI Studio (${unit} mode)`,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      setValidationError(err.message || 'Failed to persist measurement to cloud.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section id="bmi" className="py-24 bg-[#F5F1E8] dark:bg-[#171916] border-t border-[#E5E1D7] dark:border-[#2E322C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173F35]/10 dark:bg-[#173F35]/25 border border-[#173F35]/20 dark:border-[#26745A]/30 text-[#173F35] dark:text-[#C6A66B] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
            <Calculator className="w-3.5 h-3.5 text-[#C6A66B]" />
            Complimentary Diagnostic
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171916] dark:text-[#F5F1E8] tracking-tight font-display">
            Biometric BMI Calculator
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#85877F] dark:text-[#A8AAA3]">
            Evaluate your Body Mass Index using calibrated World Health Organization physiological metrics. Completely free for all visitors.
          </p>
        </div>

        {/* Interactive Calculator Card */}
        <div className="max-w-3xl mx-auto bg-[#FFFFFF] dark:bg-[#1E211D] rounded-3xl border border-[#E5E1D7] dark:border-[#2E322C] p-6 sm:p-10 shadow-sm">
          
          {/* Unit Switcher */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 rounded-xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C]">
              <button
                type="button"
                onClick={() => { setUnit('metric'); setValidationError(''); setBmi(null); }}
                className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                  unit === 'metric'
                    ? 'bg-[#173F35] text-[#F5F1E8] shadow-xs'
                    : 'text-[#85877F] hover:text-[#171916] dark:hover:text-[#F5F1E8]'
                }`}
              >
                Metric (cm / kg)
              </button>
              <button
                type="button"
                onClick={() => { setUnit('imperial'); setValidationError(''); setBmi(null); }}
                className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                  unit === 'imperial'
                    ? 'bg-[#173F35] text-[#F5F1E8] shadow-xs'
                    : 'text-[#85877F] hover:text-[#171916] dark:hover:text-[#F5F1E8]'
                }`}
              >
                Imperial (ft, in / lbs)
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={calculateBMI} className="space-y-6">
            {validationError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {unit === 'metric' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-[#85877F] dark:text-[#A8AAA3] uppercase tracking-wider mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="e.g. 175"
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C] text-[#171916] dark:text-[#F5F1E8] text-sm focus:outline-none focus:border-[#173F35] transition"
                  />
                  <span className="text-[10px] text-[#85877F] mt-1 block">Valid range: 60 - 260 cm</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#85877F] dark:text-[#A8AAA3] uppercase tracking-wider mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 72"
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C] text-[#171916] dark:text-[#F5F1E8] text-sm focus:outline-none focus:border-[#173F35] transition"
                  />
                  <span className="text-[10px] text-[#85877F] mt-1 block">Valid range: 25 - 350 kg</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-[#85877F] dark:text-[#A8AAA3] uppercase tracking-wider mb-2">
                    Height (Feet & Inches)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(e.target.value)}
                      placeholder="Feet (e.g. 5)"
                      className="w-full px-3.5 py-3 rounded-xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C] text-[#171916] dark:text-[#F5F1E8] text-sm focus:outline-none focus:border-[#173F35] transition"
                    />
                    <input
                      type="number"
                      value={heightInches}
                      onChange={(e) => setHeightInches(e.target.value)}
                      placeholder="Inches (e.g. 9)"
                      className="w-full px-3.5 py-3 rounded-xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C] text-[#171916] dark:text-[#F5F1E8] text-sm focus:outline-none focus:border-[#173F35] transition"
                    />
                  </div>
                  <span className="text-[10px] text-[#85877F] mt-1 block">Valid range: 2ft to 8ft 6in</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#85877F] dark:text-[#A8AAA3] uppercase tracking-wider mb-2">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value)}
                    placeholder="e.g. 160"
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C] text-[#171916] dark:text-[#F5F1E8] text-sm focus:outline-none focus:border-[#173F35] transition"
                  />
                  <span className="text-[10px] text-[#85877F] mt-1 block">Valid range: 55 - 770 lbs</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#173F35] hover:bg-[#1F5144] text-[#F5F1E8] text-xs font-bold uppercase tracking-[0.16em] transition shadow-md shadow-[#173F35]/15 flex items-center justify-center gap-2"
            >
              <Calculator size={15} className="text-[#C6A66B]" />
              Compute Biometric BMI
            </button>
          </form>

          {/* Results Display */}
          {bmi !== null && (
            <div className="mt-10 pt-8 border-t border-[#E5E1D7] dark:border-[#2E322C] space-y-6">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-[#85877F] dark:text-[#A8AAA3] tracking-[0.2em] block">
                  Computed Body Mass Index
                </span>
                <div className="text-5xl font-black font-display text-[#171916] dark:text-[#F5F1E8] my-2">
                  {bmi}
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#173F35]/10 dark:bg-[#173F35]/30 border border-[#173F35]/25 text-[#173F35] dark:text-[#D8BF8F] text-xs font-bold">
                  <span>Category: {category}</span>
                </div>
              </div>

              {/* Visual Category Range Bar */}
              <div className="space-y-2">
                <div className="h-3 w-full bg-[#FAF8F3] dark:bg-[#171916] rounded-full overflow-hidden flex border border-[#E5E1D7] dark:border-[#2E322C]">
                  <div className={`h-full flex-1 transition-opacity ${category === 'Underweight' ? 'bg-[#C6A66B] opacity-100' : 'bg-[#C6A66B]/30'}`} title="Underweight (<18.5)" />
                  <div className={`h-full flex-1 transition-opacity ${category === 'Normal Weight' ? 'bg-[#26745A] opacity-100' : 'bg-[#26745A]/30'}`} title="Normal (18.5 - 24.9)" />
                  <div className={`h-full flex-1 transition-opacity ${category === 'Overweight' ? 'bg-[#C6A66B] opacity-100' : 'bg-[#C6A66B]/30'}`} title="Overweight (25 - 29.9)" />
                  <div className={`h-full flex-1 transition-opacity ${category === 'Obesity Range' ? 'bg-amber-600 opacity-100' : 'bg-amber-600/30'}`} title="Obese (≥30)" />
                </div>
                <div className="flex justify-between text-[9px] font-semibold text-[#85877F] uppercase tracking-wider">
                  <span>&lt; 18.5</span>
                  <span>18.5 - 24.9</span>
                  <span>25.0 - 29.9</span>
                  <span>30.0+</span>
                </div>
              </div>

              {/* Explanatory Clinical Cue */}
              <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#171916] border border-[#E5E1D7] dark:border-[#2E322C]">
                <p className="text-xs text-[#85877F] dark:text-[#A8AAA3] leading-relaxed">
                  <strong>Clinical Guidance:</strong> {advice}
                </p>
              </div>

              {/* Authenticated Save Action */}
              {isAuthenticated ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#173F35]/5 dark:bg-[#173F35]/15 border border-[#173F35]/20">
                  <div className="text-left">
                    <span className="text-xs font-bold text-[#171916] dark:text-[#F5F1E8] block">
                      Synchronize with Profile History
                    </span>
                    <span className="text-[11px] text-[#85877F]">
                      Record this {calculatedWeightKg} kg / {calculatedHeightCm} cm metric permanently in MongoDB.
                    </span>
                  </div>
                  <button
                    onClick={handleSaveToHistory}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-xl bg-[#173F35] hover:bg-[#1F5144] text-[#F5F1E8] text-xs font-semibold transition shrink-0 flex items-center gap-1.5 disabled:opacity-60"
                  >
                    <Save size={13} className="text-[#C6A66B]" />
                    {isSaving ? 'Saving...' : savedSuccess ? 'Saved to Cloud ✅' : 'Save to History'}
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-[#85877F] text-center">
                  Sign in to automatically log this measurement to your permanent biometric progression history.
                </p>
              )}
            </div>
          )}

          {/* Medical Disclaimer */}
          <div className="mt-8 pt-6 border-t border-[#E5E1D7] dark:border-[#2E322C] flex items-start gap-2.5 text-[10.5px] text-[#85877F] leading-normal">
            <ShieldCheck className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
            <p>
              <strong>Health Disclaimer:</strong> Body Mass Index (BMI) provides a standardized population estimate of body composition based on height and weight. It does not directly distinguish between lean skeletal muscle mass and adipose tissue. Consult a certified medical specialist or accredited sports scientist for comprehensive diagnostic assessments.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default BmiCalculator;
