import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { RangoliMandala } from '../GoldenDeco';
import { FESTIVE_COUPONS } from '../../../data';

export const FeaturedOffersSection: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" id="coupon-offers">
      <div className="bg-orange-60 dark:bg-stone-850/60 border border-orange-100 dark:border-stone-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
          <RangoliMandala className="w-full h-full text-orange-600 animate-pulse" />
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <div className="p-1 bg-orange-600 rounded-lg text-white">
            <Gift className="w-5 h-5 shrink-0" />
          </div>
          <h4 className="text-lg font-bold text-stone-900 dark:text-white">
            Saffron Festive Special Offers
          </h4>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FESTIVE_COUPONS.map((cpn, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-stone-800 p-4 rounded-xl border-t-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-stone-900 px-2 py-0.5 rounded">
                    {cpn.discount}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-stone-400">COUPON</span>
                </div>
                <h5 className="font-extrabold text-stone-900 dark:text-stone-100 font-mono mt-2 tracking-wider">
                  {cpn.code}
                </h5>
                <p className="text-xs text-stone-500 mt-1">
                  {cpn.desc}
                </p>
              </div>
              <button
                onClick={() => handleCopy(cpn.code)}
                className={`w-full py-1.5 font-bold text-xs rounded-lg transition-all border border-transparent cursor-pointer ${
                  copiedCode === cpn.code
                    ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200'
                    : 'bg-stone-100 hover:bg-orange-50 dark:bg-stone-900 dark:hover:bg-amber-950/20 text-stone-700 dark:text-stone-300 hover:text-orange-600 dark:hover:text-amber-400 hover:border-orange-200'
                }`}
              >
                {copiedCode === cpn.code ? '✓ Copied!' : 'Keep Coupon Code'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
