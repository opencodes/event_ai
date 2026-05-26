import React from 'react';
import { Sparkles } from 'lucide-react';
import { RangoliMandala } from '../GoldenDeco';

interface WeddingDirectoryBannerPromoProps {
  onNavigate: (page: string, data?: any) => void;
}

export const WeddingDirectoryBannerPromo: React.FC<WeddingDirectoryBannerPromoProps> = ({ onNavigate }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2" id="wedding-directory-banner-promo">
      <div className="bg-gradient-to-r from-stone-900 to-amber-950 rounded-3xl p-8 text-white relative overflow-hidden border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="absolute right-0 bottom-0 w-64 h-64 opacity-10 pointer-events-none select-none">
          <RangoliMandala className="w-full h-full text-[#FFCB44]" />
        </div>
        <div className="space-y-3 max-w-xl text-left">
          <div className="flex items-center gap-2">
            <span className="p-1 px-3 bg-amber-500/20 text-[#FFCB44] border border-amber-500/40 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
              Utsav Premium Wedding Planning
            </span>
            <Sparkles className="w-4 h-4 text-[#FFCB44] animate-pulse" />
          </div>
          <h3 className="serif text-2xl sm:text-3xl font-bold italic tracking-wide text-white">
            Biography Traditional Wedding Directory
          </h3>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Plan the perfect traditional wedding of your dreams! Discover 15+ bespoke vendor categories from elite banquet venues to mehndi gurus, regional pandits, choreographers, and celebrity bridal makeup artists near you.
          </p>
        </div>
        <div className="shrink-0">
          <button
            onClick={() => onNavigate('vendor-categories')}
            className="px-6 py-3 bg-[#C51C13] hover:bg-[#A2110A] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-center flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Explore Wedding categories</span>
          </button>
        </div>
      </div>
    </section>
  );
};
