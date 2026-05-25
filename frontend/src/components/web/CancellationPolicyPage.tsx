import React, { useState } from 'react';
import { RefreshCw, Calculator, HelpCircle, FileX, CalendarDays, Coins } from 'lucide-react';
import { AnimatedDiya, RangoliMandala } from './GoldenDeco';

export const CancellationPolicyPage: React.FC = () => {
  // Local state for calculator
  const [bookingAmount, setBookingAmount] = useState(150000);
  const [daysRemaining, setDaysRemaining] = useState(45);

  const calculateRefund = () => {
    let percentage = 0;
    let comment = "No Refund Eligible due to ingredients, flowers and pandits pre-booking allocations.";

    if (daysRemaining > 30) {
      percentage = 90;
      comment = "Highly Auspicious window: Eligible for 90% Refund on the non-seed portion of the booking fee.";
    } else if (daysRemaining >= 15 && daysRemaining <= 30) {
      percentage = 50;
      comment = "Partial buffer window: Eligible for 50% refund of the overall pricing block.";
    } else {
      percentage = 0;
      comment = "Critically narrow window: Flowers are gathered, ghee is procured, and artists are locked. 0% cash refund eligible.";
    }

    const refundAmount = Math.round(bookingAmount * (percentage / 100));
    const retentionAmount = bookingAmount - refundAmount;

    return {
      percentage,
      refundAmount,
      retentionAmount,
      comment
    };
  };

  const refundDetails = calculateRefund();

  return (
    <div className="pt-24 pb-16 bg-stone-50 dark:bg-stone-900 transition-colors duration-200" id="cancellation-policy-page">
      
      {/* HEADER BANNER */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <div className="flex justify-center mb-3">
          <FileX className="w-10 h-10 text-orange-655 animate-bounce" />
        </div>
        <span className="text-[10px] uppercase font-mono font-black tracking-widest text-orange-655 dark:text-orange-400 bg-orange-100 dark:bg-stone-800 px-3 py-1 rounded-full">
          Refunds & Amendments // Cancellation
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-black text-stone-900 dark:text-white mt-3 uppercase tracking-tight">
          Cancellation & Refund Policy
        </h1>
        <p className="text-xs text-stone-505 max-w-sm mx-auto mt-2 font-sans text-stone-500">
          Clear, balanced guidelines on booking modifications, pre-arranged flowers dispatch, food trials cancellations, and date rescheduling.
        </p>
        <p className="text-[10px] font-mono text-stone-400 mt-1">Authentic Vedic Standard Covenant // Last Revised May 2026</p>
        <div className="w-16 h-1 bg-orange-600 mx-auto mt-4 rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: GUIDELINE TIERS (Col span 7) */}
          <div className="md:col-span-7 space-y-6" id="guidelines-tiers">
            
            <div className="bg-white dark:bg-stone-850 rounded-2.5xl p-6 border border-stone-100 dark:border-stone-800 shadow-md space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 font-mono flex items-center gap-2">
                <CalendarDays className="w-4 h-4 shrink-0" />
                <span>Ceremony Proximity Windows</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
                 Because traditional Indian weddings involve coordinating fresh marigold flower farms, specialized Sattvik dairy kitchens, and certified elite pandit scholars from Varanasi, our cancellations operate on strict chronological thresholds:
              </p>

              <div className="space-y-3 font-mono text-[11px]" id="policy-slabs-list">
                <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800 flex justify-between items-center gap-2">
                  <div>
                    <span className="font-bold text-green-600 uppercase block">Tier A: More than 30 Days</span>
                    <span className="text-[10px] text-stone-450 text-stone-400 block font-sans">90% refund of non-seed booking deposit</span>
                  </div>
                  <span className="bg-green-100 dark:bg-green-950/25 text-green-700 dark:text-green-400 font-black px-2.5 py-1 rounded-lg text-xs">
                    90% Refund
                  </span>
                </div>

                <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800 flex justify-between items-center gap-2">
                  <div>
                    <span className="font-bold text-amber-600 uppercase block">Tier B: 15 to 30 Days</span>
                    <span className="text-[10px] text-stone-450 text-stone-400 block font-sans">50% refund on the overall booking value</span>
                  </div>
                  <span className="bg-amber-100 dark:bg-amber-950/25 text-amber-700 dark:text-amber-400 font-black px-2.5 py-1 rounded-lg text-xs">
                    50% Refund
                  </span>
                </div>

                <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800 flex justify-between items-center gap-2">
                  <div>
                    <span className="font-bold text-[#C51C13] uppercase block">Tier C: Less than 14 Days</span>
                    <span className="text-[10px] text-stone-450 text-stone-400 block font-sans">No refund; flowers gathered and chefs booked.</span>
                  </div>
                  <span className="bg-red-100 dark:bg-red-950/25 text-[#C51C13] dark:text-red-400 font-black px-2.5 py-1 rounded-lg text-xs">
                    0% Refund
                  </span>
                </div>
              </div>
            </div>

            {/* FORCE MAJEURE SPECIFIC CLAUSE */}
            <div className="bg-gradient-to-r from-orange-600/15 via-transparent to-transparent p-5 rounded-r-2xl border-l-4 border-orange-600 shadow-sm space-y-2">
              <h4 className="text-xs font-black uppercase text-stone-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-orange-600 animate-spin-slow" />
                <span>Our Free Rescheduling Option</span>
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
                Instead of canceling, you are protected with <strong>one free rescheduling choice</strong> to any date within the next 365 calendar days, provided the request is filed exactly 10 days before the original date. This has zero service fee.
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: INTERACTIVE REFUND VALUE ESTIMATOR (Col span 5) */}
          <div className="md:col-span-5 bg-white dark:bg-stone-850 rounded-2.5xl p-6 border border-stone-100 dark:border-stone-800 shadow-xl space-y-5" id="refund-visualizer">
            
            <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
              <Calculator className="w-5 h-5 text-orange-605" />
              <h4 className="font-serif font-black text-stone-900 dark:text-white uppercase text-xs">Live Refund Estimator</h4>
            </div>

            <div className="space-y-4 text-xs font-sans">
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-stone-500 tracking-wider">Estimated Booking Cost (INR)</label>
                <input 
                  type="number" 
                  value={bookingAmount}
                  onChange={(e) => setBookingAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 font-mono text-xs text-stone-900 dark:text-white focus:outline-none"
                  placeholder="e.g. 150000"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-black uppercase text-stone-500 tracking-wider">
                  <span>Days Before Ceremony:</span>
                  <span className="font-bold text-orange-600">{daysRemaining} Days</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="120"
                  value={daysRemaining}
                  onChange={(e) => setDaysRemaining(Number(e.target.value))}
                  className="w-full accent-orange-600"
                />
              </div>

              {/* Math Display block */}
              <div className="bg-stone-50 dark:bg-stone-90030 p-4 rounded-xl border border-stone-100 dark:border-stone-800 space-y-2 font-mono text-[11px] bg-stone-50 dark:bg-stone-900">
                <div className="flex justify-between">
                  <span>Booking Value:</span>
                  <span className="font-bold">₹{bookingAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Refund Ratio:</span>
                  <span className={`font-bold ${refundDetails.percentage > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {refundDetails.percentage}%
                  </span>
                </div>
                <div className="flex justify-between border-t pt-1 dark:border-stone-800">
                  <span className="text-green-600 dark:text-green-400 font-bold">Estimated Refund:</span>
                  <span className="font-black text-green-600 dark:text-green-400">₹{refundDetails.refundAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Operator Retention:</span>
                  <span>₹{refundDetails.retentionAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Comment text */}
              <p className="text-[10px] text-stone-400 italic font-sans leading-tight">
                {refundDetails.comment}
              </p>

              <button 
                onClick={() => alert(`Your cancellation request estimate of ₹${refundDetails.refundAmount.toLocaleString()} is recorded. Please file a formal support request under user profile to clear details.`)}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-mono text-[10px] font-black uppercase tracking-widest rounded-xl transition cursor-pointer"
              >
                File Cancellation Notice
              </button>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
