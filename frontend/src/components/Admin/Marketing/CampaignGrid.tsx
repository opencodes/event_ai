import React from 'react';
import { MarketingCampaign } from '../../../types';

interface CampaignGridProps {
  campaigns: MarketingCampaign[];
  onDeleteCampaign: (id: string) => void;
}

export const CampaignGrid: React.FC<CampaignGridProps> = ({ campaigns, onDeleteCampaign }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="marketing-campaigns-grid">
      {campaigns.map((camp) => (
        <div
          key={camp.id}
          className="bg-white dark:bg-stone-850 p-5 rounded-2xl border border-orange-100/30 dark:border-stone-800 shadow-sm flex flex-col justify-between gap-4 text-left relative animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Type badge overlay */}
          <span className="absolute top-4 right-4 bg-orange-50 dark:bg-stone-900 text-orange-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
            {camp.type}
          </span>

          <div className="space-y-3">
            <span className="text-[10px] font-mono font-black border border-orange-200/40 rounded px-1.5 py-0.5 text-orange-600 bg-orange-600/10">
              {camp.code}
            </span>
            <h4 className="font-extrabold text-sm text-stone-900 dark:text-white line-clamp-2 pt-1 font-sans">
              {camp.title}
            </h4>
            <p className="text-xs text-stone-500 font-semibold">Benefit: {camp.discount}</p>
            
            <div className="text-[10px] text-stone-400 font-mono">
              Duration: {camp.startDate} to {camp.endDate}
            </div>
          </div>

          {/* Performance progress indicator */}
          <div className="space-y-1 pt-2 border-t dark:border-stone-800 font-medium">
            <div className="flex justify-between text-[10px] text-stone-400 font-bold uppercase font-mono">
              <span>Direct ROI Conversion</span>
              <span className="text-orange-605">{camp.performance}%</span>
            </div>
            <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-orange-600 h-full rounded-full" style={{ width: `${camp.performance}%` }} />
            </div>
          </div>

          <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t dark:border-stone-800 font-bold">
            <span className={`text-[9px] px-2 py-0.5 rounded uppercase ${
              camp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-stone-105 text-stone-650 dark:bg-stone-800 dark:text-stone-300'
            }`}>
              {camp.status}
            </span>

            <button
              onClick={() => onDeleteCampaign(camp.id)}
              className="text-[11px] text-red-656 hover:underline cursor-pointer"
            >
              Delete
            </button>
          </div>

        </div>
      ))}
    </div>
  );
};
