import React from 'react';
import { Plus, ArrowUpRight, ExternalLink } from 'lucide-react';

interface QuickActionsPanelProps {
  onNavigateTab: (tab: string) => void;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ onNavigateTab }) => {
  return (
    <div className="bg-white dark:bg-stone-850 p-5 rounded-2xl border border-orange-100/40 dark:border-stone-800 shadow-sm space-y-4">
      <h3 className="text-base font-black text-stone-950 dark:text-white border-b pb-3 border-stone-105 dark:border-stone-800 text-left">
        Enterprise Quick Actions
      </h3>

      <div className="space-y-2 text-left">
        <button
          onClick={() => onNavigateTab('restaurants')}
          className="w-full py-2.5 px-3 bg-stone-50 hover:bg-orange-50 dark:bg-stone-900 dark:hover:bg-orange-950/20 text-stone-750 dark:text-stone-300 hover:text-orange-600 font-bold text-xs rounded-xl flex items-center justify-between border border-stone-200/50 dark:border-stone-800 cursor-pointer transition-all"
        >
          <span>Add New Restaurant Store</span>
          <Plus className="w-4 h-4 shrink-0 text-orange-600" />
        </button>

        <button
          onClick={() => onNavigateTab('marketing')}
          className="w-full py-2.5 px-3 bg-stone-50 hover:bg-orange-50 dark:bg-stone-900 dark:hover:bg-orange-950/20 text-stone-750 dark:text-stone-300 hover:text-orange-600 font-bold text-xs rounded-xl flex items-center justify-between border border-stone-200/50 dark:border-stone-800 cursor-pointer transition-all"
        >
          <span>Deploy Diwali Campaign Banner</span>
          <ArrowUpRight className="w-4 h-4 shrink-0 text-orange-600" />
        </button>

        <button
          onClick={() => alert('All delivery partner logs downloaded to system workspace secure sector.')}
          className="w-full py-2.5 px-3 bg-stone-50 hover:bg-orange-50 dark:bg-stone-900 dark:hover:bg-orange-950/20 text-stone-750 dark:text-stone-300 hover:text-orange-600 font-bold text-xs rounded-xl flex items-center justify-between border border-stone-200/50 dark:border-stone-800 cursor-pointer transition-all"
        >
          <span>Download Delivery Partner Logs</span>
          <ExternalLink className="w-4 h-4 shrink-0 text-orange-600" />
        </button>
      </div>
    </div>
  );
};
