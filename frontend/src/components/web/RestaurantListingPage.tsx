import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Check, Star, Clock, Filter, Sparkles } from 'lucide-react';
import { MOCK_RESTAURANTS } from '../../data';
import { AnimatedDiya } from './GoldenDeco';
import { RestaurantListingHero } from './RestaurantListingPage/RestaurantListingHero';
import { FiltersRibbon } from './RestaurantListingPage/FiltersRibbon';
import { RestaurantListItemCard } from './RestaurantListingPage/RestaurantListItemCard';

interface RestaurantListingPageProps {
  onNavigate: (page: string, data?: any) => void;
  isDarkMode: boolean;
}

export const RestaurantListingPage: React.FC<RestaurantListingPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'time' | 'costAsc' | 'costDesc' | 'distance' | null>(null);
  const [filterPureVeg, setFilterPureVeg] = useState(false);
  const [filterOffers, setFilterOffers] = useState(false);
  const [isInfiniteScrolling, setIsInfiniteScrolling] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  // Available unique cuisines
  const allCuisines = useMemo(() => {
    const set = new Set<string>();
    MOCK_RESTAURANTS.forEach((r) => r.cuisine.forEach((c) => set.add(c)));
    return Array.from(set);
  }, []);

  const filteredRestaurants = useMemo(() => {
    let list = [...MOCK_RESTAURANTS];

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.some((c) => c.toLowerCase().includes(q)) ||
          r.featuredDishes.some((d) => d.toLowerCase().includes(q))
      );
    }

    // Cuisine Filter
    if (selectedCuisine) {
      list = list.filter((r) => r.cuisine.includes(selectedCuisine));
    }

    // Pure Veg Filter
    if (filterPureVeg) {
      list = list.filter((r) => r.isPureVeg);
    }

    // Offers Filter
    if (filterOffers) {
      list = list.filter((r) => r.offerText || r.hasFestivalDeal);
    }

    // Sort
    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'time') {
      list.sort((a, b) => a.deliveryTime - b.deliveryTime);
    } else if (sortBy === 'costAsc') {
      list.sort((a, b) => a.costForTwo - b.costForTwo);
    } else if (sortBy === 'costDesc') {
      list.sort((a, b) => b.costForTwo - a.costForTwo);
    } else if (sortBy === 'distance') {
      list.sort((a, b) => a.distance - b.distance);
    }

    return list;
  }, [searchQuery, selectedCuisine, sortBy, filterPureVeg, filterOffers]);

  const handleSimulateInfiniteScroll = () => {
    setIsInfiniteScrolling(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 2);
      setIsInfiniteScrolling(false);
    }, 1200);
  };

  const hasMore = filteredRestaurants.length > visibleCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen bg-stone-50 dark:bg-stone-900" id="restaurant-listing-container">
      
      {/* Search Header Banner */}
      <RestaurantListingHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* FILTERS & SORT NAVIGATION RIBBON */}
      <FiltersRibbon
        filterPureVeg={filterPureVeg}
        setFilterPureVeg={setFilterPureVeg}
        filterOffers={filterOffers}
        setFilterOffers={setFilterOffers}
        selectedCuisine={selectedCuisine}
        setSelectedCuisine={setSelectedCuisine}
        allCuisines={allCuisines}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* LISTING GRID */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-orange-600" />
            <span>Found {filteredRestaurants.length} Vendors Matches</span>
          </h3>
          {(selectedCuisine || sortBy || filterPureVeg || filterOffers) && (
            <button
              onClick={() => {
                setSelectedCuisine(null);
                setSortBy(null);
                setFilterPureVeg(false);
                setFilterOffers(false);
              }}
              className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredRestaurants.length === 0 ? (
          /* Empty state */
          <div className="bg-white dark:bg-stone-850 rounded-2xl p-12 text-center border border-orange-50 dark:border-stone-800 space-y-4 max-w-md mx-auto" id="listing-empty-state">
            <AnimatedDiya className="w-16 h-16 mx-auto animate-bounce filter drop-shadow" />
            <h4 className="text-lg font-bold text-stone-850 dark:text-white">
              No Festive Kitchen Matches Found
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              We couldn't find any vendors that fit your current active search parameters. Try resetting your active filters or query.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCuisine(null);
                setFilterPureVeg(false);
                setFilterOffers(false);
              }}
              className="px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl shadow hover:bg-orange-700 transition cursor-pointer"
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6" id="filtered-restaurants-grid">
            {filteredRestaurants.slice(0, visibleCount).map((rest) => (
              <RestaurantListItemCard
                key={rest.id}
                restaurant={rest}
                onClick={() => onNavigate('restaurant-detail', { restaurantId: rest.id })}
              />
            ))}
          </div>
        )}

        {/* 6. INFINITE SCROLL DESIGN */}
        {hasMore && (
          <div className="flex justify-center pt-6" id="infinite-scroll-trigger">
            <button
              onClick={handleSimulateInfiniteScroll}
              disabled={isInfiniteScrolling}
              className="px-6 py-2.5 bg-white dark:bg-stone-850 hover:bg-orange-50 dark:hover:bg-amber-950/20 text-stone-800 dark:text-stone-200 hover:text-orange-600 dark:hover:text-amber-400 font-extrabold text-xs tracking-wider uppercase border border-orange-100 dark:border-stone-800 rounded-full shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isInfiniteScrolling ? (
                <>
                  <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                  <span>Loading sweets & curries...</span>
                </>
              ) : (
                <>
                  <span>Load More Vendors</span>
                  <span>↓</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
