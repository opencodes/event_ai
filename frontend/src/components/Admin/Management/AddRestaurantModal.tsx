import React, { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { Restaurant } from '../../../types';

interface AddRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newRest: Omit<Restaurant, 'id' | 'rating' | 'ratingCount' | 'distance' | 'featuredDishes' | 'menu'>) => void;
}

export const AddRestaurantModal: React.FC<AddRestaurantModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [cuisineStr, setCuisineStr] = useState('');
  const [costForTwo, setCostForTwo] = useState('400');
  const [deliveryTime, setDeliveryTime] = useState('30');
  const [image, setImage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '') return;

    onSubmit({
      name,
      cuisine: cuisineStr.split(',').map((c) => c.trim()),
      costForTwo: parseInt(costForTwo) || 405,
      deliveryTime: parseInt(deliveryTime) || 30,
      image: image || 'https://images.unsplash.com/photo-1545231027-63b3f162d20e?w=500',
    });

    // Reset values
    setName('');
    setCuisineStr('');
    setCostForTwo('400');
    setDeliveryTime('30');
    setImage('');
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

        <h4 className="font-extrabold text-sm text-stone-900 dark:text-white uppercase border-b pb-2 dark:border-stone-800">
          Register Kitchen Store Outlet
        </h4>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-semibold text-stone-600 dark:text-stone-300">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">Kitchen outlet Name</label>
            <input
              type="text"
              placeholder="e.g. Noida Satvik Thali Joint"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl dark:border-stone-700 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">Gourmet Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Sweets, Thali, North Indian"
              value={cuisineStr}
              onChange={(e) => setCuisineStr(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl dark:border-stone-700 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">Cost for 2 (₹)</label>
              <input
                type="number"
                placeholder="400"
                value={costForTwo}
                onChange={(e) => setCostForTwo(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl dark:border-stone-700 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">Delivery limit (mins)</label>
              <input
                type="number"
                placeholder="30"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl dark:border-stone-700 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              <span>Cuisine Cover Image URL (optional)</span>
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl dark:border-stone-700 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:outline-none"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-750 dark:text-stone-300 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg cursor-pointer"
            >
              Approve Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
