import React from 'react';
import { HeroSlider } from './LandingPage/HeroSlider';
import { FoodCategoriesSection } from './LandingPage/FoodCategoriesSection';
import { FeaturedOffersSection } from './LandingPage/FeaturedOffersSection';
import { WeddingDirectoryBannerPromo } from './LandingPage/WeddingDirectoryBannerPromo';
import { WhatWeDoSection } from './LandingPage/WhatWeDoSection';
import { PopularRestaurantsGrid } from './LandingPage/PopularRestaurantsGrid';
import { CustomerTestimonialsSection } from './LandingPage/CustomerTestimonialsSection';

interface LandingPageProps {
  onNavigate: (page: string, data?: any) => void;
  onSearchDishes: () => void;
  isDarkMode: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16 min-h-screen bg-stone-50 dark:bg-stone-900" id="landing-page-container">
      
      {/* 1. HERO & PROMOTIONAL CAROUSEL BANNER */}
      <HeroSlider onNavigate={onNavigate} />

      {/* 2. FOOD CATEGORIES SECTION */}
      <FoodCategoriesSection onNavigate={onNavigate} />

      {/* 3. FEATURED OFFERS SECTION */}
      <FeaturedOffersSection />

      {/* 4. WEDDING DIRECTORY PROMO BANNER */}
      <WeddingDirectoryBannerPromo onNavigate={onNavigate} />

      {/* 5. WHAT WE DO SECTION */}
      <WhatWeDoSection />

      {/* 6. POPULAR VENDORS / RESTAURANTS GRID */}
      <PopularRestaurantsGrid onNavigate={onNavigate} />

      {/* 7. CUSTOMER TESTIMONIALS SECTION */}
      <CustomerTestimonialsSection />

    </div>
  );
};
