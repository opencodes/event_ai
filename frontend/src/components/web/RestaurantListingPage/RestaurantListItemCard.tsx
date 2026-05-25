import React from 'react';
import { Star, Clock } from 'lucide-react';
import { Restaurant } from '../../../types';

interface RestaurantListItemCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

export const RestaurantListItemCard: React.FC<RestaurantListItemCardProps> = ({
  restaurant,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-stone-850 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.005] transition-all border border-orange-100/40 dark:border-stone-800 cursor-pointer flex flex-col sm:flex-row h-full group"
    >
      {/* Image Section */}
      <div className="relative w-full sm:w-48 h-48 sm:h-full shrink-0 overflow-hidden bg-stone-100">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        {restaurant.offerText && (
          <div className="absolute bottom-2 left-2 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-[10px] px-2 py-1 rounded shadow">
            {restaurant.offerText}
          </div>
        )}
        {restaurant.isPureVeg && (
          <div className="absolute top-2 left-2 bg-green-800 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow">
            VEG ONLY
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3 text-left">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-extrabold text-lg text-stone-900 dark:text-white group-hover:text-orange-600 transition-colors line-clamp-1">
              {restaurant.name}
            </h4>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 font-extrabold text-xs shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{restaurant.rating}</span>
            </div>
          </div>

          <p className="text-xs text-stone-550 dark:text-stone-400 line-clamp-1 mt-1">
            {restaurant.cuisine.join(', ')}
          </p>

          {/* Featured highlights tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {restaurant.featuredDishes.slice(0, 3).map((dish) => (
              <span
                key={dish}
                className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 bg-stone-105 dark:bg-stone-800 px-2.5 py-1 rounded-full"
              >
                {dish}
              </span>
            ))}
          </div>
        </div>

        {/* Core Meta Details */}
        <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-3 text-xs font-bold text-stone-605 dark:text-stone-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span>{restaurant.deliveryTime} mins</span>
          </div>
          <span>{restaurant.distance} km</span>
          <span className="text-orange-600 dark:text-orange-400">₹{restaurant.costForTwo} for two</span>
        </div>
      </div>
    </div>
  );
};
