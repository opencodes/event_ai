import React from 'react';
import { Star, Heart, MapPin } from 'lucide-react';

export interface ListingCardItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: string;
  category: string;
  image: string;
}

interface VendorGridCardProps {
  item: ListingCardItem;
  bookmarkedIds: string[];
  onToggleBookmark: (itemId: string, event: React.MouseEvent) => void;
  onOpenInquiry: (item: ListingCardItem, event: React.MouseEvent) => void;
  priceLabel?: string;
}

export const VendorGridCard: React.FC<VendorGridCardProps> = ({
  item,
  bookmarkedIds,
  onToggleBookmark,
  onOpenInquiry,
  priceLabel = "Service Fee",
}) => {
  const isBookmarked = bookmarkedIds.includes(item.id);

  return (
    <div
      key={item.id}
      className="bg-white dark:bg-stone-850 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group h-full"
    >
      <div className="relative h-44 overflow-hidden bg-stone-100 shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        
        {/* Rating overlay badge */}
        <div className="absolute top-3 left-3 bg-green-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow">
          <Star className="w-3 h-3 fill-current text-white shrink-0" />
          <span>{item.rating.toFixed(1)}</span>
        </div>

        {/* Favorite Bookmark */}
        <button
          onClick={(e) => onToggleBookmark(item.id, e)}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-stone-900/80 hover:bg-white dark:hover:bg-stone-900 transition-colors shadow cursor-pointer z-10"
        >
          <Heart className={`w-3.5 h-3.5 shrink-0 ${isBookmarked ? 'fill-red-500 text-red-500' : 'text-stone-650 dark:text-stone-300'}`} />
        </button>
      </div>

      <div className="p-4 space-y-2 text-left flex-grow flex flex-col justify-between">
        <div>
          <h4 className="font-extrabold text-sm text-stone-900 dark:text-white tracking-tight group-hover:text-orange-600 line-clamp-1 transition-colors">
            {item.name}
          </h4>
          <div className="flex items-center gap-1 text-stone-400 mt-1">
            <MapPin className="w-3 h-3 shrink-0 text-orange-500" />
            <span className="text-[10px] truncate max-w-[170px]">{item.location}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
          <div className="flex flex-col text-left truncate pr-2">
            <span className="text-[9px] uppercase tracking-wider text-stone-400 font-mono leading-none">{priceLabel}</span>
            <span className="font-black text-xs text-[#C51C13] dark:text-[#FFCB44] mt-0.5 truncate leading-none">{item.price}</span>
          </div>
          <button
            onClick={(e) => onOpenInquiry(item, e)}
            className="p-1 px-3 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold rounded cursor-pointer shrink-0 transition"
          >
            Inquire
          </button>
        </div>
      </div>
    </div>
  );
};
