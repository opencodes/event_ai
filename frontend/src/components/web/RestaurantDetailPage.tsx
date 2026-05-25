import React, { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { FoodItem, CartItem } from '../../types';
import { MOCK_RESTAURANTS } from '../../data';
import { RestaurantDetailHero } from './RestaurantDetailPage/RestaurantDetailHero';
import { MenuCategoryToggleList } from './RestaurantDetailPage/MenuCategoryToggleList';
import { MenuFoodCard } from './RestaurantDetailPage/MenuFoodCard';
import { StickyCartFooter } from './RestaurantDetailPage/StickyCartFooter';

interface RestaurantDetailPageProps {
  restaurantId: string;
  onNavigate: (page: string, data?: any) => void;
  onAddToCart: (item: FoodItem, restId: string, restName: string) => void;
  onRemoveFromCart: (itemId: string) => void;
  cart: CartItem[];
}

export const RestaurantDetailPage: React.FC<RestaurantDetailPageProps> = ({
  restaurantId,
  onNavigate,
  onAddToCart,
  onRemoveFromCart,
  cart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isFavorite, setIsFavorite] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');

  const restaurant = useMemo(() => {
    return MOCK_RESTAURANTS.find((r) => r.id === restaurantId) || MOCK_RESTAURANTS[0];
  }, [restaurantId]);

  // Unique categories in this restaurant's menu
  const menuCategories = useMemo(() => {
    const cats = new Set<string>();
    restaurant.menu.forEach((item) => cats.add(item.category));
    return ['All', ...Array.from(cats)];
  }, [restaurant]);

  const filteredMenu = useMemo(() => {
    return restaurant.menu.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch =
        menuSearch.trim() === '' ||
        item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(menuSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [restaurant, selectedCategory, menuSearch]);

  const cartTotal = cart.reduce((acc, item) => acc + item.foodItem.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Helper to get item count in current cart
  const getItemQtyInCart = (itemId: string) => {
    const item = cart.find((c) => c.foodItem.id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen bg-stone-50 dark:bg-stone-900 text-left relative" id="restaurant-detail-container">
      
      {/* Back button */}
      <button
        onClick={() => onNavigate('restaurants')}
        className="flex items-center gap-2 text-sm font-bold text-stone-605 dark:text-stone-300 hover:text-orange-600 transition-colors cursor-pointer"
        id="btn-back-to-list"
      >
        <ArrowLeft className="w-4 h-4 text-orange-600" />
        <span>Back to Vendor List</span>
      </button>

      {/* 1. RESTAURANT HERO SECTION */}
      <RestaurantDetailHero
        restaurant={restaurant}
        isFavorite={isFavorite}
        setIsFavorite={setIsFavorite}
      />

      {/* Active Promotion message */}
      {restaurant.offerText && (
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-950/20 dark:to-orange-950/20 rounded-2xl p-4 border border-orange-200 dark:border-stone-850 flex items-center justify-between gap-4 animate-pulse-subtle" id="details-discount-banner">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪔</span>
            <div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-white">Active Dussehra Deal</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">{restaurant.offerText}</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-orange-600 text-white px-3 py-1 rounded">ACTIVE</span>
        </div>
      )}

      {/* MENU CATEGORIES TABS & MENU SEARCH */}
      <section className="space-y-6" id="detail-restaurant-menu">
        <MenuCategoryToggleList
          menuCategories={menuCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          menuSearch={menuSearch}
          setMenuSearch={setMenuSearch}
        />

        {/* FOOD CARD LIST */}
        <div className="space-y-4">
          {filteredMenu.length === 0 ? (
            <div className="p-12 bg-white dark:bg-stone-850 rounded-2xl text-center border ring-1 ring-orange-100 dark:ring-stone-800 space-y-2">
              <span className="text-3xl">🍲</span>
              <h5 className="font-bold text-stone-800 dark:text-stone-200">No Food Matching</h5>
              <p className="text-xs text-stone-400">Try changing your menu categories tab or filter query.</p>
            </div>
          ) : (
            <div className="grid gap-4" id="food-items-container">
              {filteredMenu.map((food) => {
                const qty = getItemQtyInCart(food.id);
                return (
                  <MenuFoodCard
                    key={food.id}
                    food={food}
                    qty={qty}
                    onAddToCart={(item) => onAddToCart(item, restaurant.id, restaurant.name)}
                    onRemoveFromCart={onRemoveFromCart}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 2. STICKY CART SUMMARY FLOOR WRAP */}
      {cartCount > 0 && (
        <StickyCartFooter
          cartCount={cartCount}
          cartTotal={cartTotal}
          onNavigate={onNavigate}
        />
      )}

    </div>
  );
};
