import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { MOCK_MARKETING_CAMPAIGNS } from '../../../data';
import { MarketingCampaign } from '../../../types';
import { MarketingStats } from './MarketingStats';
import { CampaignGrid } from './CampaignGrid';
import { CreateCampaignModal } from './CreateCampaignModal';

export const AdminMarketing: React.FC = () => {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(MOCK_MARKETING_CAMPAIGNS);
  const [showCreatorModal, setShowCreatorModal] = useState(false);

  const handleCreateCampaign = (campData: { title: string; code: string; discount: string; type: MarketingCampaign['type'] }) => {
    const newCamp: MarketingCampaign = {
      id: `camp-${Date.now()}`,
      title: campData.title,
      code: campData.code,
      discount: campData.discount,
      status: 'Scheduled',
      performance: 0,
      type: campData.type,
      startDate: '2026-05-24',
      endDate: '2026-06-15',
    };

    setCampaigns([newCamp, ...campaigns]);
    setShowCreatorModal(false);
    alert(`Marketing plan "${newCamp.title}" flagged successfully to dispatch queues.`);
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm('Erase this campaign record?')) {
      setCampaigns(campaigns.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300" id="admin-marketing-tab">
      
      {/* Promotion top statistics indicators */}
      <MarketingStats />

      {/* Campaign List Control panel */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-stone-850 p-4 rounded-xl border border-orange-100/40 dark:border-stone-800 shadow-sm gap-4">
        <div className="text-left">
          <h3 className="font-extrabold text-sm text-stone-900 dark:text-white uppercase font-sans">Active Promotional & Campaign Indices</h3>
          <p className="text-[11px] text-stone-400 font-medium">Pushed to user client mobile applications</p>
        </div>

        <button
          onClick={() => setShowCreatorModal(true)}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow flex items-center gap-1.5 cursor-pointer font-sans"
          id="btn-create-campaign"
        >
          <Plus className="w-4 h-4" />
          <span>New Festival Campaign</span>
        </button>
      </div>

      {/* CAMPAIGN CARD GRID LISTING */}
      <CampaignGrid campaigns={campaigns} onDeleteCampaign={handleDeleteCampaign} />

      {/* CREATE DIALOG OVERLAY */}
      <CreateCampaignModal
        isOpen={showCreatorModal}
        onClose={() => setShowCreatorModal(false)}
        onSubmit={handleCreateCampaign}
      />

    </div>
  );
};
