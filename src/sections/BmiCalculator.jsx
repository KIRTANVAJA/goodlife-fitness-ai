import React, { useState } from 'react';
import { Calculator, ArrowRight, ShieldCheck } from 'lucide-react';

const BmiCalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [advice, setAdvice] = useState('');

  const calculateBMI = (e) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // convert cm to meters

    if (w > 0 && h > 0) {
      const computedBmi = parseFloat((w / (h * h)).toFixed(1));
      setBmi(computedBmi);

      // Determine Category and Advice
      if (computedBmi < 18.5) {
        setCategory('Underweight');
        setAdvice('To optimize health, focus on caloric surplus and resistance training to build dense muscle mass. Good Life trainers can design custom bulking regimes.');
      } else if (computedBmi >= 18.5 && computedBmi < 25) {
        setCategory('Normal Weight');
        setAdvice('Excellent! You are in a healthy range. Maintain this with progressive resistance training and balanced macros. Experience our Elite programs to level up.');
      } else if (computedBmi >= 25 && computedBmi < 30) {
        setCategory('Overweight');
        setAdvice('A caloric deficit paired with metabolic conditioning is recommended to shed adipose tissue. Let our coaches formulate a metabolic plan.');
      } else {
        setCategory('Obese');
        setAdvice('Prioritize cardiovascular durability and muscle preservation via scientifically guided workouts. Let our medical gym leads structure a safe pathway.');
      }
    }
  };

  const handleBmiCTA = () => {
    const text = encodeURIComponent(`Hello Good Life Fitness! I calculated my BMI as ${bmi} (${category}) on your website. I'm looking for a personalized diet and training plan.`);
    window.open(`https://wa.me/919999999999?text=${text}`, '_blank');
  };

  const resetBmi = () => {
    setWeight('');
    setHeight('');
    setBmi(null);
    setCategory('');
    setAdvice('');
  };

  return (
    <section id="bmi" className="relative py-24 bg-transparent overflow-hidden">
      {/* Lights flare */}
      <div className="absolute top-[20%] -left-[10vw] w-[35vw] h-[35vw] bg-gym-gold-dark/5 dark:bg-gym-silver-dark/5 rounded-full filter blur-[120px] pointer-events-none transition-colors duration-1000" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual description & BMI scale gauge */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold font-display text-gym-gold dark:text-gym-silver uppercase tracking-[0.25em] transition-colors duration-1000">
                FITNESS SCIENCE
              </h4>
              <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight text-gym-black dark:text-white leading-tight transition-colors duration-1000">
                COMPUTE YOUR <span className="text-brand-gradient">BODY INDEX</span>
              </h2>
              <p className="text-xs md:text-sm text-gym-black/70 dark:text-gym-grey-muted leading-relaxed font-medium transition-colors duration-1000">
                The Body Mass Index (BMI) is a mathematically sound, internationally accepted metric representing ratio classification of weight-to-height. Check your classification index instantly.
              </p>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-4 pt-4 border-t border-gym-gold/20 dark:border-gym-border/40 transition-colors duration-1000">
              <span className="block text-[10px] uppercase font-bold text-gym-black/60 dark:text-gym-grey-muted tracking-widest transition-colors duration-1000">
                BMI Classification Range
              </span>

              {/* Progress scale */}
              <div className="relative">
                <div className="h-2 w-full bg-gym-gold/10 dark:bg-gym-card rounded-full overflow-hidden flex transition-colors duration-1000">
                  <div className="h-full bg-blue-500 w-[18.5%]" title="Underweight" />
                  <div className="h-full bg-green-500 w-[6.5%]" title="Normal" />
                  <div className="h-full bg-yellow-500 w-[5%]" title="Overweight" />
                  <div className="h-full bg-red-500 w-[70%]" title="Obese" />
                </div>
                
                {/* Labels under scale */}
                <div className="flex justify-between text-[8px] text-gym-black/60 dark:text-gym-grey-muted uppercase font-bold tracking-wider pt-2 transition-colors duration-1000">
                  <span>18.5 Under</span>
                  <span>18.5 - 24.9 Normal</span>
                  <span>25.0 - 29.9 Over</span>
                  <span>30.0+ Obese</span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-2 text-[10px] text-gym-black/60 dark:text-gym-grey-muted leading-normal transition-colors duration-1000">
                <ShieldCheck size={14} className="text-gym-gold dark:text-gym-silver flex-shrink-0 mt-0.5 transition-colors duration-1000" />
                <span>Note: BMI calculations exclude direct skeletal muscle mass metrics. Ideal analysis is performed at the club via bio-impedance scanners.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Calculator Input Panel */}
          <div className="lg:col-span-6">
            <div className="glass-brand p-8 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gym-gold/5 dark:bg-gym-silver/5 rounded-full filter blur-2xl pointer-events-none transition-colors duration-1000" />
              
              <div className="flex items-center gap-3 pb-6 border-b border-gym-gold/20 dark:border-gym-border/40 mb-6 transition-colors duration-1000">
                <div className="w-10 h-10 bg-gym-gold/10 dark:bg-gym-silver/10 border border-gym-gold/20 dark:border-gym-silver/20 flex items-center justify-center text-gym-gold dark:text-gym-silver transition-colors duration-1000">
                  <Calculator size={18} />
                </div>
                <div>
                  <h3 className="font-display font-black uppercase text-sm tracking-widest text-gym-black dark:text-white transition-colors duration-1000">BMI CALCULATOR</h3>
                  <p className="text-[10px] text-gym-black/60 dark:text-gym-grey-muted uppercase font-bold tracking-widest transition-colors duration-1000">Metric measurements</p>
                </div>
              </div>

              {bmi === null ? (
                /* Input Form */
                <form onSubmit={calculateBMI} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-gym-black/60 dark:text-gym-grey-muted transition-colors duration-1000">Weight (KG)</label>
                      <input 
                        type="number"
                        placeholder="e.g. 70"
                        min="30"
                        max="250"
                        required
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full bg-gym-gold/5 dark:bg-gym-black border border-gym-gold/20 dark:border-gym-border rounded-none px-4 py-3 text-sm text-gym-black dark:text-white focus:outline-none focus:border-gym-gold dark:focus:border-gym-silver transition-all duration-500 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-gym-black/60 dark:text-gym-grey-muted transition-colors duration-1000">Height (CM)</label>
                      <input 
                        type="number"
                        placeholder="e.g. 175"
                        min="100"
                        max="250"
                        required
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full bg-gym-gold/5 dark:bg-gym-black border border-gym-gold/20 dark:border-gym-border rounded-none px-4 py-3 text-sm text-gym-black dark:text-white focus:outline-none focus:border-gym-gold dark:focus:border-gym-silver transition-all duration-500 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gold-metallic-gradient dark:bg-silver-metallic-gradient text-gym-black font-display font-black uppercase tracking-widest text-xs py-4 flex items-center justify-center gap-1.5 shadow-lg shadow-gym-gold/15 dark:shadow-gym-silver/15 transition-all duration-1000 hover:scale-[1.02]"
                  >
                    Calculate BMI
                    <ArrowRight size={14} />
                  </button>
                </form>
              ) : (
                /* Results Screen */
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-baseline justify-between border-b border-gym-gold/20 dark:border-gym-border/40 pb-4 transition-colors duration-1000">
                    <div>
                      <span className="text-[10px] uppercase text-gym-black/60 dark:text-gym-grey-muted font-bold tracking-wider block transition-colors duration-1000">Your Calculated BMI</span>
                      <span className="text-5xl font-black font-display text-gym-black dark:text-white transition-colors duration-1000">{bmi}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-gym-black/60 dark:text-gym-grey-muted font-bold tracking-wider block transition-colors duration-1000">Classification</span>
                      <span className="text-lg font-black font-display text-gym-gold dark:text-gym-silver uppercase tracking-wider transition-colors duration-1000">{category}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-gym-black/60 dark:text-gym-grey-muted transition-colors duration-1000">Professional Advice</span>
                    <p className="text-xs text-gym-black/80 dark:text-gym-grey-muted leading-relaxed font-medium transition-colors duration-1000">
                      {advice}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gym-gold/20 dark:border-gym-border/40 transition-colors duration-1000">
                    <button
                      onClick={resetBmi}
                      className="py-3.5 border border-gym-gold/30 dark:border-gym-border hover:border-gym-gold dark:hover:border-white text-gym-gold dark:text-white hover:text-gym-black dark:hover:text-gym-black bg-transparent hover:bg-gym-gold dark:hover:bg-white font-display font-semibold uppercase text-[10px] tracking-widest transition-all duration-500"
                    >
                      Reset Form
                    </button>
                    <button
                      onClick={handleBmiCTA}
                      className="py-3.5 bg-gold-metallic-gradient dark:bg-silver-metallic-gradient text-gym-black font-display font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-gym-gold/10 dark:shadow-gym-silver/10 flex items-center justify-center gap-1.5 transition-all duration-1000 hover:scale-[1.02]"
                    >
                      Get Custom Plan
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BmiCalculator;
