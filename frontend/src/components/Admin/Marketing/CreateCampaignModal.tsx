import React, { useState } from 'react';
import { X } from 'lucide-react';
import { MarketingCampaign } from '../../../types';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaignData: { title: string; code: string; discount: string; type: MarketingCampaign['type'] }) => void;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [type, setType] = useState<MarketingCampaign['type']>('Coupon');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '' || code.trim() === '') return;

    onSubmit({
      title,
      code: code.toUpperCase(),
      discount,
      type,
    });

    setTitle('');
    setCode('');
    setDiscount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-stone-850 rounded-3xl max-w-sm w-full p-6 space-y-4 relative border border-orange-100 dark:border-stone-700 shadow-2xl animate-in zoom-in-95 text-left text-neutral-700 dark:text-neutral-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 dark:hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <h4 className="font-extrabold text-sm text-stone-905 dark:text-white uppercase border-b pb-2 dark:border-stone-800">
          Create Campaign Deployment
        </h4>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-semibold text-stone-650 dark:text-stone-300">
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">Campaign Title</label>
            <input
              type="text"
              placeholder="e.g. Diwali Sweets Promo Blast"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl dark:border-stone-700 dark:bg-stone-800 text-stone-909 dark:text-white font-medium focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3 font-semibold">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">Coupon Code</label>
              <input
                type="text"
                placeholder="e.g. DIWALI100"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl dark:border-stone-700 dark:bg-stone-800 text-stone-909 dark:text-white font-mono uppercase font-black focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono font-sans font-medium">Reward Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-xl dark:border-stone-700 dark:bg-stone-800 text-stone-909 dark:text-white font-medium focus:outline-none"
              >
                <option value="Coupon">Coupon Code</option>
                <option value="Festival">Festival Deal</option>
                <option value="Banner">Promo Banner</option>
                <option value="Referral">Referral Code</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">Benefits/Cashbacks description</label>
            <input
              type="text"
              placeholder="e.g. Flat ₹100 gold coins cashback in wallet"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl dark:border-stone-700 dark:bg-stone-800 text-stone-909 dark:text-white font-medium focus:outline-none"
              required
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-750 dark:text-stone-300 font-bold rounded-xl cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg cursor-pointer"
            >
              Deploy Plan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
