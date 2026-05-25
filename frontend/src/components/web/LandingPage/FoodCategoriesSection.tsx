import React from 'react';
import { Compass } from 'lucide-react';

const WEDDING_SPECIALTIES = [
  { id: 'venues', name: 'Premium Venues', icon: '🏰', count: 40 },
  { id: 'food', name: 'Halwai & Catering', icon: '👨‍🍳', count: 25 },
  { id: 'planning-decor', name: 'Mandap & Decor', icon: '🌸', count: 30 },
  { id: 'photographers', name: 'Photography', icon: '📸', count: 15 },
  { id: 'makeup', name: 'Makeup & Beauty', icon: '💄', count: 22 },
  { id: 'music-dance', name: 'Music & Sangeet', icon: '💃', count: 12 },
  { id: 'pandits', name: 'Vedic Pandits', icon: '🪔', count: 18 },
];

interface FoodCategoriesSectionProps {
  onNavigate: (page: string, data?: any) => void;
}

export const FoodCategoriesSection: React.FC<FoodCategoriesSectionProps> = ({ onNavigate }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="food-categories">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-orange-600 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-600 dark:text-amber-400">
              Traditional Wedding Services
            </span>
          </div>
          <h3 className="serif text-2xl md:text-3xl font-black italic text-stone-955 dark:text-white tracking-tight text-[#C51C13]">
            Wedding Specialties
          </h3>
        </div>
        <button
          onClick={() => onNavigate('vendor-categories')}
          className="mt-2 md:mt-0 text-sm font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 hover:underline flex items-center gap-1 cursor-pointer"
        >
          See All Specialties &rarr;
        </button>
      </div>

      {/* Horizontal scroller */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {WEDDING_SPECIALTIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onNavigate('vendor-categories', { categoryId: cat.id })}
            className="flex flex-col items-center p-5 rounded-2xl bg-white dark:bg-stone-850 hover:bg-orange-50 dark:hover:bg-amber-950/20 border border-orange-100/40 dark:border-stone-800 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            id={`cat-card-${cat.id}`}
          >
            <div className="w-14 h-14 bg-amber-55/60 dark:bg-stone-800/80 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner filter drop-shadow">
              {cat.icon}
            </div>
            <span className="text-sm font-bold text-stone-800 dark:text-stone-100 text-center line-clamp-1">
              {cat.name}
            </span>
            <span className="text-[11px] font-medium text-stone-400 mt-1">
              {cat.count}+ providers
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
