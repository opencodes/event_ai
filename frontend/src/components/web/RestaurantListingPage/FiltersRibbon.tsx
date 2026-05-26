import React from 'react';
import { ArrowUpDown, Check, Sparkles } from 'lucide-react';

interface FiltersRibbonProps {
  filterPureVeg: boolean;
  setFilterPureVeg: (val: boolean) => void;
  filterOffers: boolean;
  setFilterOffers: (val: boolean) => void;
  selectedCuisine: string | null;
  setSelectedCuisine: (cuisine: string | null) => void;
  allCuisines: string[];
  sortBy: 'rating' | 'time' | 'costAsc' | 'costDesc' | 'distance' | null;
  setSortBy: (sort: 'rating' | 'time' | 'costAsc' | 'costDesc' | 'distance' | null) => void;
}

export const FiltersRibbon: React.FC<FiltersRibbonProps> = ({
  filterPureVeg,
  setFilterPureVeg,
  filterOffers,
  setFilterOffers,
  selectedCuisine,
  setSelectedCuisine,
  allCuisines,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="sticky top-20 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur shadow-sm p-4 rounded-xl border border-orange-100/40 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4" id="filters-ribbon">
      
      {/* Left: Quick active badges */}
      <div className="flex flex-wrap items-center gap-2">
        
        {/* Pure Veg filter button */}
        <button
          onClick={() => setFilterPureVeg(!filterPureVeg)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 border cursor-pointer ${
            filterPureVeg
              ? 'bg-green-700 text-white border-green-700'
              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
          }`}
        >
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full border border-white shrink-0" />
          <span>Pure Veg</span>
          {filterPureVeg && <Check className="w-3.5 h-3.5" />}
        </button>

        {/* Offers Filter Button */}
        <button
          onClick={() => setFilterOffers(!filterOffers)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 border cursor-pointer ${
            filterOffers
              ? 'bg-orange-600 text-white border-orange-600'
              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Offers & Deals</span>
          {filterOffers && <Check className="w-3.5 h-3.5" />}
        </button>

        {/* Quick Cuisine Selection */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase font-mono mr-1">Cuisines:</span>
          <button
            onClick={() => setSelectedCuisine(null)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCuisine === null
                ? 'bg-orange-600 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-700'
            }`}
          >
            All
          </button>
          {allCuisines.slice(0, 4).map((cuis) => (
            <button
              key={cuis}
              onClick={() => setSelectedCuisine(cuis)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCuisine === cuis
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-700'
              }`}
            >
              {cuis}
            </button>
          ))}
        </div>

      </div>

      {/* Right: Sort controls */}
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-orange-600 shrink-0" />
        <span className="text-xs font-bold text-stone-550 dark:text-stone-405">Sort by:</span>
        <select
          value={sortBy || ''}
          onChange={(e) => setSortBy((e.target.value as any) || null)}
          className="text-xs font-bold bg-transparent border border-orange-100 dark:border-stone-700 dark:bg-stone-800 p-1.5 rounded-lg text-stone-750 dark:text-stone-300 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
        >
          <option value="">Popularity/Standard</option>
          <option value="rating">Top Rated (⭐)</option>
          <option value="time">Fastest Delivery (⏱️)</option>
          <option value="costAsc">Cost: Low to High</option>
          <option value="costDesc">Cost: High to Low</option>
          <option value="distance">Distance: Nearest</option>
        </select>
      </div>

    </div>
  );
};
