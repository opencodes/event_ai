import React, { useState } from 'react';
import { Sparkles, Calendar, BookOpen, Coffee, Check, Calculator, Award } from 'lucide-react';
import { AnimatedDiya, RangoliMandala } from './GoldenDeco';

interface HowItWorksPageProps {
  onNavigate: (page: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  const [activeStep, setActiveStep] = useState(0);
  
  // Dynamic Budget Estimator local state
  const [guestCount, setGuestCount] = useState(250);
  const [feastTier, setFeastTier] = useState('Standard Ghee Feast'); // 650, 1200, 1800 INR
  const [hasDecoration, setHasDecoration] = useState(true);
  const [hasScholars, setHasScholars] = useState(true);

  const steps = [
    {
      title: "1. State Your Royal Vision",
      subtitle: "Configure date, guests & ritual vibe",
      description: "Use our online smart-planner board to mention your preferred Hindu auspicious dates, invite boundaries, mandap preferences, and Satvik dietary requirements. No upfront cost or commitment required.",
      emoji: "🪔",
      bulletPoints: ["Verify auspicious Hindu Lunar calendar dates", "Choose pure Sattvik or customized royal catering styles", "Plan seating layouts with simple drag and drop"]
    },
    {
      title: "2. Connect with Vetted Karigars",
      subtitle: "Caterers, pandits & decorators unlocked",
      description: "Our system pre-filters local growers, sweet builders, approved scholars, and experienced florists matched precisely to your budget and aesthetic thresholds. View live verification files & physical certificates.",
      emoji: "🤝",
      bulletPoints: ["Only FSSAI-licensed kitchens", "Sanksrit scholars certified from traditional temples", "Handmade craft items sourced directly from weavers"]
    },
    {
      title: "3. Complete Trial Tasting & Iteration",
      subtitle: "Pre-event sample trials delivered to your home",
      description: "Order live miniature samples of pure ghee Motichoor Ladoos, royal Mughlai Biryanis, or specific floral setup miniatures directly to your door to confirm color, aroma, and taste fidelity.",
      emoji: "🍲",
      bulletPoints: ["Fresh catering sample boxes delivered in sanitised packages", "Mock-up physical invitations with royal silver detailing", "Live coordinator trial phone review session included"]
    },
    {
      title: "4. Auspicious On-Ground Execution",
      subtitle: "Unwind & praise the divine blessings",
      description: "On Muhurat day, your dedicated Utsav Concierge command center checks the entry gate logs, sand boilers incense levels, pandit puja alignments, and plate delivery counts so you focus fully on relatives.",
      emoji: "💍",
      bulletPoints: ["Real-time table tracking via mobile app", "Strict hygiene & Satvik protocols fully reinforced", "Instant wallet cashbacks on remaining materials inventory"]
    }
  ];

  // Live calculator math
  const getFeastPrice = () => {
    if (feastTier === 'Sattvik Dev Edition') return 1450;
    if (feastTier === 'Royal Emperor Feast') return 2200;
    return 750; // Standard Ghee Feast
  };

  const calculateEstimation = () => {
    const cateringTotal = guestCount * getFeastPrice();
    const decorCost = hasDecoration ? 75000 : 0;
    const scholarCost = hasScholars ? 15000 : 0;
    const baseTotal = cateringTotal + decorCost + scholarCost;
    
    // CGST/SGST 18%
    const tax = Math.round(baseTotal * 0.18);
    const grand = baseTotal + tax;

    return {
      cateringTotal,
      decorCost,
      scholarCost,
      tax,
      grand
    };
  };

  const estimates = calculateEstimation();

  return (
    <div className="pt-24 pb-16 bg-stone-50 dark:bg-stone-900 transition-colors duration-200" id="how-it-works-page">
      
      {/* TIMELINE HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <div className="flex justify-center mb-3">
          <AnimatedDiya className="w-10 h-10 text-orange-600" />
        </div>
        <span className="text-[10px] uppercase font-mono font-black tracking-widest text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-stone-800 px-3 py-1 rounded-full">
          The Ceremony Blueprint
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-black text-stone-900 dark:text-white mt-3 uppercase tracking-tight">
          How Ceremony & Utsav Works
        </h1>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mt-2 font-sans">
          Four flawless phases ensuring your sacred ceremony matches royal Indian traditions with contemporary operational safety.
        </p>
        <div className="w-16 h-1 bg-orange-600 mx-auto mt-4 rounded-full" />
      </div>

      {/* 4-STEP INTERACTIVE STEPPER TIMELINE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-20" id="stepper-section">
        
        {/* Buttons strip */}
        <div className="grid grid-cols-4 gap-2 border-b border-stone-200 dark:border-stone-800 pb-4 mb-8">
          {steps.map((st, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-xl text-center select-none cursor-pointer transition-all duration-200 ${
                activeStep === idx
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-white dark:bg-stone-850 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <div className="text-lg md:text-xl">{st.emoji}</div>
              <div className="text-[10px] md:text-xs font-bold font-serif uppercase tracking-tight mt-1 line-clamp-1">{st.title.split('. ')[1]}</div>
            </button>
          ))}
        </div>

        {/* Dynamic Display Panel */}
        <div className="bg-white dark:bg-stone-850 rounded-3xl border border-stone-100 dark:border-stone-800 p-8 shadow-xl grid md:grid-cols-12 gap-8 items-center" id="active-step-panel">
          
          <div className="md:col-span-12 lg:col-span-7 space-y-4">
            <span className="inline-block text-[10px] font-mono tracking-wider font-extrabold text-orange-600 dark:text-orange-400 uppercase">
              {steps[activeStep].subtitle}
            </span>
            <h2 className="text-2xl font-serif font-black text-stone-900 dark:text-white uppercase">
              {steps[activeStep].title}
            </h2>
            <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 leading-relaxed font-sans mt-2">
              {steps[activeStep].description}
            </p>

            <ul className="space-y-2 pt-2">
              {steps[activeStep].bulletPoints.map((bp, bidx) => (
                <li key={bidx} className="flex items-center gap-2.5 text-xs text-stone-700 dark:text-stone-300">
                  <span className="w-4 h-4 bg-orange-100 dark:bg-stone-800 rounded-full flex items-center justify-center text-[10px] text-orange-600 font-bold shrink-0">✓</span>
                  <span className="font-sans font-medium">{bp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-12 lg:col-span-5 bg-gradient-to-br from-orange-500 to-red-600 p-8 rounded-2.5xl text-white relative overflow-hidden flex flex-col justify-between aspect-square min-h-[250px]" id="step-accent-badge">
            <div className="absolute top-[-30px] right-[-30px] w-36 h-36 opacity-10 pointer-events-none">
              <RangoliMandala className="w-full h-full text-white" />
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl">{steps[activeStep].emoji}</div>
              <h4 className="text-lg font-serif font-bold uppercase tracking-wide">Phase {activeStep + 1} Cleared</h4>
              <p className="text-[11px] text-orange-100 leading-relaxed font-sans">
                Each operational phase utilizes strict verification checks. We back every wedding vendor milestone with written collateral deposits.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs border-t border-white/20 pt-4 mt-4">
              <Award className="w-4 h-4 text-amber-300" />
              <span className="font-mono text-[10px] font-bold tracking-widest uppercase">Certified Ceremony Guarantee</span>
            </div>
          </div>

        </div>

      </section>

      {/* RITUAL BUDGET ESTIMATOR WIDGET */}
      <section className="bg-stone-100 dark:bg-stone-950 py-16 transition-colors duration-200" id="interactive-budget-tool">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center mb-8">
            <Calculator className="w-8 h-8 text-orange-650 mx-auto mb-2 animate-bounce" />
            <h2 className="text-xl md:text-2xl font-serif font-black text-stone-900 dark:text-white uppercase">
              Interactive Utsav Cost Estimator
            </h2>
            <p className="text-[11px] text-stone-500 font-sans">
              Adjust parameters below to see an immediate breakdown of pure Ghee plates, Mandap structures, and Vedic scholar costs.
            </p>
          </div>

          <div className="bg-white dark:bg-stone-850 p-6 md:p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-xl grid md:grid-cols-2 gap-8">
            
            {/* Control Inputs */}
            <div className="space-y-4" id="estimator-inputs">
              <h3 className="text-xs font-mono font-black uppercase text-orange-650 dark:text-orange-400 tracking-wider">
                1. Adjust Event Parameters
              </h3>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-stone-600 dark:text-stone-300">
                  <span>Guest Count:</span>
                  <span className="font-mono text-orange-600">{guestCount} Guests</span>
                </div>
                <input 
                  type="range"
                  min="50"
                  max="1200"
                  step="50"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full accent-orange-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-stone-500 tracking-wider">Feast Culinary Package</label>
                <select 
                  value={feastTier} 
                  onChange={(e) => setFeastTier(e.target.value)}
                  className="w-full px-4 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 text-xs rounded-xl text-stone-900 dark:text-white"
                >
                  <option value="Standard Ghee Feast">Standard Ghee Feast (750 INR/plate)</option>
                  <option value="Sattvik Dev Edition">Sattvik Dev Edition (1450 INR/plate)</option>
                  <option value="Royal Emperor Feast">Royal Emperor Feast (2200 INR/plate)</option>
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-600 dark:text-stone-300 font-sans">Include Custom Floral Mandap Decor (+₹75,000)</span>
                  <input 
                    type="checkbox"
                    checked={hasDecoration}
                    onChange={(e) => setHasDecoration(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 bg-stone-100 dark:bg-stone-900"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-600 dark:text-stone-300 font-sans">Unlock Certified Gurukul Scholars (+₹15,000)</span>
                  <input 
                    type="checkbox"
                    checked={hasScholars}
                    onChange={(e) => setHasScholars(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 bg-stone-100 dark:bg-stone-900"
                  />
                </div>
              </div>
            </div>

            {/* Calculations Breakdown Output */}
            <div className="bg-stone-50 dark:bg-stone-900 p-6 rounded-2xl border border-stone-100 dark:border-stone-800 flex flex-col justify-between" id="estimator-outputs">
              <h4 className="text-xs font-mono font-black uppercase text-stone-500 tracking-wider mb-2">
                2. Live Estimation Breakdown
              </h4>

              <div className="space-y-2 text-xs font-sans text-stone-605 col-span-12 font-mono">
                <div className="flex justify-between border-b pb-1 dark:border-stone-800">
                  <span>Catering ({guestCount} x ₹{getFeastPrice()}):</span>
                  <span className="font-bold text-stone-950 dark:text-white">₹{estimates.cateringTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-1 dark:border-stone-800">
                  <span>Floral/Sand Decor:</span>
                  <span className="font-bold text-stone-950 dark:text-white">₹{estimates.decorCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-1 dark:border-stone-800">
                  <span>Sanskrit Scholars Board:</span>
                  <span className="font-bold text-stone-950 dark:text-white">₹{estimates.scholarCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-1 dark:border-stone-800 text-stone-400">
                  <span>SGST/CGST (18%):</span>
                  <span>₹{estimates.tax.toLocaleString()}</span>
                </div>

                <div className="flex justify-between pt-2 text-sm font-serif font-black text-orange-600">
                  <span>ESTIMATED TOTAL:</span>
                  <span>₹{estimates.grand.toLocaleString()}*</span>
                </div>
              </div>

              <div className="pt-4 mt-2">
                <p className="text-[9px] text-stone-400 italic mb-2 leading-tight">
                  *Estimated price does not include customized travel allowances. Taxes subject to regional policies. We offer full refund guarantees.
                </p>
                <button 
                  onClick={() => onNavigate('contact')}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-mono text-[10px] font-black uppercase tracking-widest rounded-xl transition cursor-pointer"
                >
                  Book Free Culinary Trial
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
