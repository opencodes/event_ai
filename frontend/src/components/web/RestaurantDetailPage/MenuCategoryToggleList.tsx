import React from 'react';
import { Search } from 'lucide-react';

interface MenuCategoryToggleListProps {
  menuCategories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  menuSearch: string;
  setMenuSearch: (search: string) => void;
}

export const MenuCategoryToggleList: React.FC<MenuCategoryToggleListProps> = ({
  menuCategories,
  selectedCategory,
  setSelectedCategory,
  menuSearch,
  setMenuSearch,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
      
      {/* Menu Categories list */}
      <div className="flex flex-wrap items-center gap-2 self-start animate-fade-in">
        {menuCategories.map((catName) => (
          <button
            key={catName}
            onClick={() => setSelectedCategory(catName)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === catName
                ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                : 'bg-white hover:bg-orange-50 dark:bg-stone-850 dark:hover:bg-stone-805 text-stone-700 dark:text-stone-300 border border-orange-100/45 dark:border-stone-800'
            }`}
          >
            {catName}
          </button>
        ))}
      </div>

      {/* Quick Menu search bar */}
      <div className="w-full sm:max-w-xs relative bg-white dark:bg-stone-850 p-1.5 rounded-xl border border-orange-100 dark:border-stone-800">
        <input
          type="text"
          placeholder="Search dish name..."
          value={menuSearch}
          onChange={(e) => setMenuSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1 text-xs text-stone-900 dark:text-white bg-transparent outline-none focus:outline-none"
        />
        <Search className="absolute left-3 top-3 w-4 h-4 text-orange-600" />
      </div>

    </div>
  );
};
