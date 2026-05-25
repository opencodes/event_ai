import React from 'react';
import { Flame, Star, Clock } from 'lucide-react';
import { MOCK_RESTAURANTS } from '../../../data';
import { AnimatedDiya } from '../GoldenDeco';

interface PopularRestaurantsGridProps {
  onNavigate: (page: string, data?: any) => void;
}

export const PopularRestaurantsGrid: React.FC<PopularRestaurantsGridProps> = ({ onNavigate }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="popular-restaurants">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-red-600 animate-pulse" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-red-600 dark:text-red-400">
              Lustrous Culinary Havens
            </span>
          </div>
          <h3 className="serif text-2xl md:text-3xl font-black italic text-stone-900 dark:text-white tracking-tight text-[#C51C13]">
            Trending Vendors in Noida Sector 56
          </h3>
        </div>
        <button
          onClick={() => onNavigate('restaurants')}
          className="mt-2 sm:mt-0 text-sm font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 hover:underline cursor-pointer"
        >
          Explore All Vendors ({MOCK_RESTAURANTS.length}) &rarr;
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="restaurants-grid">
        {MOCK_RESTAURANTS.slice(0, 3).map((rest) => (
          <div
            key={rest.id}
            onClick={() => onNavigate('restaurant-detail', { restaurantId: rest.id })}
            className="bg-white dark:bg-stone-850 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 border border-orange-105/30 dark:border-stone-800 cursor-pointer flex flex-col justify-between group"
          >
            
            {/* Card Header Image */}
            <div className="relative h-48 overflow-hidden bg-stone-105">
              <img
                src={rest.image}
                alt={rest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              
              {/* Diwali ribbon / offer overlay */}
              {rest.offerText && (
                <div className="absolute bottom-3 left-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-lg">
                  🔥 {rest.offerText}
                </div>
              )}

              {/* Veg Tag */}
              {rest.isVeg && (
                <div className="absolute top-3 left-3 bg-green-800 text-white font-bold text-[10px] px-2 py-1 rounded shadow flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white block border border-green-700" />
                  <span>PURE VEG</span>
                </div>
              )}
              
              {/* Popular rating flag */}
              {rest.isPopular && (
                <div className="absolute top-3 right-3 bg-amber-500 text-stone-950 font-bold text-[10px] px-2 py-1 rounded shadow flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-current stroke-current" />
                  <span>POPULAR</span>
                </div>
              )}
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-extrabold text-lg text-stone-900 dark:text-white group-hover:text-orange-600 transition-colors line-clamp-1">
                  {rest.name}
                </h4>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 font-extrabold text-sm shrink-0">
                  <Star className="w-4 h-4 fill-current shrink-0" />
                  <span>{rest.rating}</span>
                </div>
              </div>

              <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                {rest.cuisine.join(', ')}
              </p>

              {/* Meta details */}
              <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-3 text-xs font-bold text-stone-600 dark:text-stone-300">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>{rest.deliveryTime} mins</span>
                </div>
                <div>•</div>
                <span>{rest.distance} km</span>
                <div>•</div>
                <span>₹{rest.costForTwo} for two</span>
              </div>

              {/* Festive highlight */}
              {rest.hasFestivalDeal && (
                <div className="mt-2 bg-amber-500/10 dark:bg-amber-950/20 rounded-xl p-2 border border-amber-300/30 flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-400">
                  <AnimatedDiya className="w-4 h-4 shrink-0" />
                  <span className="font-semibold truncate">Festival Special Dishes on Menus!</span>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};
