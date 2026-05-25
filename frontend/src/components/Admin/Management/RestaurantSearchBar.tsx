import React from 'react';
import { Search, Plus } from 'lucide-react';

interface RestaurantSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAddModal: () => void;
}

export const RestaurantSearchBar: React.FC<RestaurantSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-stone-850 p-4 rounded-xl border border-orange-100/40 dark:border-stone-800 shadow-sm">
      {/* Inner search query list */}
      <div className="relative w-full sm:max-w-xs text-left">
        <input
          type="text"
          placeholder="Search kitchens by name or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs border bg-stone-50 dark:bg-stone-900 rounded-xl focus:outline-none dark:border-stone-800 text-stone-900 dark:text-white"
        />
        <Search className="absolute left-3 top-3 w-4 h-4 text-orange-600" />
      </div>

      {/* Action Panel buttons */}
      <div className="flex gap-2 w-full sm:w-auto">
        <button
          onClick={onOpenAddModal}
          className="flex-1 sm:flex-initial px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
          id="admin-btn-add-restaurant"
        >
          <Plus className="w-4 h-4" />
          <span>Add Restaurant Store</span>
        </button>
      </div>
    </div>
  );
};
