import React from 'react';
import { Search } from 'lucide-react';

interface RestaurantListingHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const RestaurantListingHero: React.FC<RestaurantListingHeroProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 rounded-2xl p-6 sm:p-10 shadow-lg text-white flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden" id="listing-hero">
      <div className="space-y-2 text-center md:text-left z-10">
        <span className="text-yellow-300 font-extrabold text-xs uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
          🪔 Dussehra & Diwali Food Bazaar 🪔
        </span>
        <h2 className="serif text-2xl sm:text-3xl font-black italic tracking-normal leading-none">
          Find the Best Festive Flavors Near You
        </h2>
        <p className="text-orange-50 text-xs sm:text-sm font-semibold max-w-lg">
          Certified hygienic food, customized sweets boxes, traditional Mughlai thalis, and pure-ghee delicacies.
        </p>
      </div>

      <div className="w-full md:max-w-md relative z-10 bg-white dark:bg-stone-800 p-1.5 rounded-full shadow-lg">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search sweets, hot curries, local diners, biryani..."
          className="w-full pl-12 pr-10 py-2.5 bg-transparent text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 rounded-full focus:outline-none text-sm"
        />
        <Search className="absolute left-4.5 top-5 w-4.5 h-4.5 text-orange-600" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-4 text-xs font-bold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
