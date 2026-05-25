import React from 'react';
import { Target, Percent, Megaphone, Star } from 'lucide-react';

export const MarketingStats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="marketing-stats">
      <div className="bg-white dark:bg-stone-850 p-4 rounded-xl border border-orange-100/40 dark:border-stone-800 flex items-center justify-between">
        <div className="text-left animate-in fade-in">
          <span className="text-[10px] text-stone-400 block uppercase font-mono font-bold">Total conversion</span>
          <b className="text-lg font-black text-stone-900 dark:text-white mt-1 block">68.2 %</b>
        </div>
        <div className="p-2 bg-gradient-to-tr from-orange-600 to-orange-700 rounded text-white shrink-0">
          <Percent className="w-4 h-4" />
        </div>
      </div>

      <div className="bg-white dark:bg-stone-850 p-4 rounded-xl border border-orange-100/40 dark:border-stone-800 flex items-center justify-between">
        <div className="text-left">
          <span className="text-[10px] text-stone-400 block uppercase font-mono font-bold">Promo Reach today</span>
          <b className="text-lg font-black text-stone-900 dark:text-white mt-1 block">84,120 clicks</b>
        </div>
        <Target className="w-5 h-5 text-red-550 text-red-550 shrink-0" />
      </div>

      <div className="bg-white dark:bg-stone-850 p-4 rounded-xl border border-orange-100/40 dark:border-stone-800 flex items-center justify-between">
        <div className="text-left">
          <span className="text-[10px] text-stone-400 block uppercase font-mono font-bold">Diwali Special Cashbacks</span>
          <b className="text-lg font-black text-stone-900 dark:text-white mt-1 block">₹28,500 dispersed</b>
        </div>
        <Megaphone className="w-5 h-5 text-green-700 shrink-0" />
      </div>

      <div className="bg-white dark:bg-stone-850 p-4 rounded-xl border border-orange-100/40 dark:border-stone-800 flex items-center justify-between">
        <div className="text-left">
          <span className="text-[10px] text-stone-400 block uppercase font-mono font-bold">Referrals Enrolled</span>
          <b className="text-lg font-black text-stone-900 dark:text-white mt-1 block">1,402 pairings</b>
        </div>
        <Star className="w-5 h-5 text-orange-600 shrink-0" />
      </div>
    </div>
  );
};
