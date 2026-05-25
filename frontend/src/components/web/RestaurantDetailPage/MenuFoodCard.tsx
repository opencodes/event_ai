import React from 'react';
import { Star, Minus, Plus } from 'lucide-react';
import { FoodItem } from '../../../types';

interface MenuFoodCardProps {
  food: FoodItem;
  qty: number;
  onAddToCart: (item: FoodItem) => void;
  onRemoveFromCart: (itemId: string) => void;
}

export const MenuFoodCard: React.FC<MenuFoodCardProps> = ({
  food,
  qty,
  onAddToCart,
  onRemoveFromCart,
}) => {
  return (
    <div
      className="bg-white dark:bg-stone-850 p-5 rounded-2xl border border-orange-100/30 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row gap-5 items-stretch justify-between text-left group"
    >
      {/* Food Info Left */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          {/* Food Badges */}
          <div className="flex items-center gap-1.5">
            {food.isVeg ? (
              <span className="w-4 h-4 rounded border-2 border-green-700 flex items-center justify-center p-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-700 block" />
              </span>
            ) : (
              <span className="w-4 h-4 rounded border-2 border-red-700 flex items-center justify-center p-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-700 block" />
              </span>
            )}

            {food.isFestiveSpecial && (
              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded flex items-center gap-0.5 border border-amber-204/10">
                🪔 FESTIVE SPECIAL
              </span>
            )}

            {food.isBestSeller && (
              <span className="text-[9px] font-bold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded">
                ⭐ BESTSELLER
              </span>
            )}
          </div>

          {/* Name and Price */}
          <h4 className="font-black text-lg text-stone-900 dark:text-white group-hover:text-orange-600 transition-colors">
            {food.name}
          </h4>
          <div className="flex items-center gap-2">
            <span className="font-bold text-orange-600 dark:text-orange-400">₹{food.price}</span>
            <span className="text-xs text-stone-400">({food.category})</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed max-w-xl">
          {food.description}
        </p>

        {/* Rating given by users */}
        <div className="flex items-center gap-1 text-xs text-stone-400">
          <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
          <span className="text-stone-605 dark:text-stone-300 font-bold">{food.rating}</span>
          <span>({food.ratingCount} orders rating)</span>
        </div>
      </div>

      {/* Food Image & Cart Actions Right */}
      <div className="w-32 h-32 relative self-center sm:self-stretch shrink-0 flex flex-col justify-end">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-24 object-cover rounded-xl shadow-inner border border-stone-200 dark:border-stone-800"
          referrerPolicy="no-referrer"
        />
        
        {/* CART ACTION PANEL FLOAT */}
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-28 bg-white dark:bg-stone-800 rounded-lg shadow-md border border-orange-100 dark:border-stone-700 p-1 flex items-center justify-between font-mono select-none">
          {qty === 0 ? (
            <button
              onClick={() => onAddToCart(food)}
              className="w-full text-center py-1 bg-white hover:bg-orange-50 dark:bg-stone-800 dark:hover:bg-stone-700 text-orange-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider rounded cursor-pointer"
              id={`add-btn-${food.id}`}
            >
              ADD +
            </button>
          ) : (
            <>
              <button
                onClick={() => onRemoveFromCart(food.id)}
                className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400 rounded cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-extrabold text-stone-900 dark:text-white">
                {qty}
              </span>
              <button
                onClick={() => onAddToCart(food)}
                className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 text-orange-600 dark:text-amber-400 rounded cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
