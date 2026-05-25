import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Customers views imports
import { CustomerHeader } from './components/web/CustomerHeader';
import { Footer } from './components/web/Footer';
import { LandingPage } from './components/web/LandingPage';
import { RestaurantListingPage } from './components/web/RestaurantListingPage';
import { RestaurantDetailPage } from './components/web/RestaurantDetailPage';
import { CartPage } from './components/web/CartPage';
import { UserProfilePage } from './components/web/UserProfilePage';
import { VendorCategoryPage } from './components/web/VendorCategoryPage';
import { PlannedEventsShowcase } from './components/web/PlannedEventsShowcase';
import { PortfolioPage } from './components/web/PortfolioPage';
import { AboutUsPage } from './components/web/AboutUsPage';
import { ContactUsPage } from './components/web/ContactUsPage';
import { HowItWorksPage } from './components/web/HowItWorksPage';
import { TermsPage } from './components/web/TermsPage';
import { PrivacyPolicyPage } from './components/web/PrivacyPolicyPage';
import { CancellationPolicyPage } from './components/web/CancellationPolicyPage';
import { MarigoldToran, RangoliMandala } from './components/web/GoldenDeco';

// Admin panel views imports
import { AdminSidebar } from './components/Admin/Sidebar/AdminSidebar';
import { AdminHeader } from './components/Admin/Header/AdminHeader';
import { AdminDashboard } from './components/Admin/Dashboard/AdminDashboard';
import { AdminManagement } from './components/Admin/Management/AdminManagement';
import { AdminOrders } from './components/Admin/Orders/AdminOrders';
import { AdminCustomers } from './components/Admin/Customers/AdminCustomers';
import { AdminMarketing } from './components/Admin/Marketing/AdminMarketing';

// Wedding & Traditional Planner Imports
import { PlannerEvents } from './components/PlannerEvents';
import { PlannerGuests } from './components/PlannerGuests';
import { PlannerFeast } from './components/PlannerFeast';
import { PlannerVendors } from './components/PlannerVendors';
import { PlannerBudget } from './components/PlannerBudget';
import { PlannerChuman } from './components/PlannerChuman';
import { PlannerInventory } from './components/PlannerInventory';

// Types & Data
import { FoodItem, CartItem, UserProfile } from './types';
import { MOCK_USER_PROFILE } from './data';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Customer states info
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [currentLocation, setCurrentLocation] = useState<string>('Sector 56, Noida, UP');
  const [selectedRestId, setSelectedRestId] = useState<string>('rest-1');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILE);

  // Admin dynamic states
  const [currentAdminTab, setCurrentAdminTab] = useState<string>('dashboard');

  // Unified global callbacks & state helpers
  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNavigatePage = (pageName: string, data?: any) => {
    if (data && data.restaurantId) {
      setSelectedRestId(data.restaurantId);
    }
    setCurrentPage(pageName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (item: FoodItem, restId: string, restName: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.foodItem.id === item.id);
      if (existing) {
        return prev.map((c) => (c.foodItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { foodItem: item, quantity: 1, restaurantId: restId, restaurantName: restName }];
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.foodItem.id === itemId);
      if (!existing) return prev;
      if (existing.quantity === 1) {
        return prev.filter((c) => c.foodItem.id !== itemId);
      }
      return prev.map((c) => (c.foodItem.id === itemId ? { ...c, quantity: c.quantity - 1 } : c));
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleUpdateWallet = (newBalance: number) => {
    setUserProfile((prev) => ({ ...prev, walletBalance: newBalance }));
  };

  const handleAddOrderToHistory = (items: any[], total: number, restName: string, restImg: string) => {
    const newOrder = {
      id: `FED-${Math.floor(Math.random() * 9000) + 1000}-X`,
      restaurantName: restName,
      restaurantImage: restImg,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending' as const,
      items,
      totalAmount: total,
    };

    setUserProfile((prev) => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
    }));
  };

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'dark bg-stone-900 text-stone-100' : 'bg-stone-50 text-stone-900'}`} id="app-wrapper">
      
      

      {/* 2. LAYOUT SPLIT: CUSTOMER PORTAL vs ENTERPRISE ADMIN SUITE */}
      {!isAdminMode ? (
        
        /* ================= CUSTOMER PORTAL INTERFACE ================= */
        <div className="flex flex-col min-h-screen relative overflow-hidden" id="customer-portal-view">
          
          {/* Subtle background Diwali light effect */}
          <div className="absolute top-0 right-[-100px] w-80 h-80 opacity-5 pointer-events-none">
            <RangoliMandala className="w-full h-full text-orange-500" />
          </div>

          <CustomerHeader
            cart={cart}
            onNavigate={handleNavigatePage}
            currentPage={currentPage}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
            onSwitchToAdmin={() => setIsAdminMode(true)}
            userProfile={userProfile}
          />

          {/* Core views router with animations */}
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                {currentPage === 'landing' && (
                  <LandingPage
                    onNavigate={handleNavigatePage}
                    onSearchDishes={() => handleNavigatePage('restaurants')}
                    isDarkMode={isDarkMode}
                  />
                )}

                {currentPage === 'restaurants' && (
                  <RestaurantListingPage
                    onNavigate={handleNavigatePage}
                    isDarkMode={isDarkMode}
                  />
                )}

                {currentPage === 'restaurant-detail' && (
                  <RestaurantDetailPage
                    restaurantId={selectedRestId}
                    onNavigate={handleNavigatePage}
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={handleRemoveFromCart}
                    cart={cart}
                  />
                )}

                {currentPage === 'cart' && (
                  <CartPage
                    cart={cart}
                    onNavigate={handleNavigatePage}
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={handleRemoveFromCart}
                    onClearCart={handleClearCart}
                    userProfile={userProfile}
                    onUpdateWallet={handleUpdateWallet}
                    onAddOrderToHistory={handleAddOrderToHistory}
                  />
                )}

                {currentPage === 'profile' && (
                  <UserProfilePage
                    userProfile={userProfile}
                    onUpdateWallet={handleUpdateWallet}
                    onNavigate={handleNavigatePage}
                  />
                )}

                {currentPage === 'vendor-categories' && (
                  <VendorCategoryPage
                    onNavigate={handleNavigatePage}
                    isDarkMode={isDarkMode}
                  />
                )}

                {currentPage === 'celebrations' && (
                  <PlannedEventsShowcase
                    onNavigate={handleNavigatePage}
                  />
                )}

                {currentPage === 'portfolio' && (
                  <PortfolioPage
                    onNavigate={handleNavigatePage}
                  />
                )}

                {currentPage === 'about' && (
                  <AboutUsPage
                    onNavigate={handleNavigatePage}
                  />
                )}

                {currentPage === 'contact' && (
                  <ContactUsPage
                    onNavigate={handleNavigatePage}
                  />
                )}

                {currentPage === 'how-it-works' && (
                  <HowItWorksPage
                    onNavigate={handleNavigatePage}
                  />
                )}

                {currentPage === 'terms' && (
                  <TermsPage />
                )}

                {currentPage === 'privacy' && (
                  <PrivacyPolicyPage />
                )}

                {currentPage === 'cancellation' && (
                  <CancellationPolicyPage />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          <Footer isDarkMode={isDarkMode} onNavigate={handleNavigatePage} />
        </div>
      ) : (
        
        /* ================= ENTERPRISE ADMIN PANEL INTERFACE ================= */
        <div className="flex h-screen overflow-hidden bg-stone-100 dark:bg-stone-900" id="admin-portal-view">
          
          <AdminSidebar
            currentAdminTab={currentAdminTab}
            onSelectTab={setCurrentAdminTab}
            onExitAdmin={() => setIsAdminMode(false)}
          />

          {/* Main workspace container (Header + body) */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            
            <AdminHeader currentTabName={currentAdminTab} />

            {/* Admin view Router */}
            <main className="flex-1 p-6 overflow-y-auto space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAdminTab}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  className="h-full"
                >
                  {currentAdminTab === 'dashboard' && (
                    <AdminDashboard onNavigateTab={setCurrentAdminTab} />
                  )}

                  {currentAdminTab === 'restaurants' && (
                    <AdminManagement />
                  )}

                  {currentAdminTab === 'orders' && (
                    <AdminOrders />
                  )}

                  {currentAdminTab === 'customers' && (
                    <AdminCustomers />
                  )}

                  {currentAdminTab === 'marketing' && (
                    <AdminMarketing />
                  )}

                  {currentAdminTab === 'planner-events' && (
                    <PlannerEvents />
                  )}

                  {currentAdminTab === 'planner-guests' && (
                    <PlannerGuests />
                  )}

                  {currentAdminTab === 'planner-feast' && (
                    <PlannerFeast />
                  )}

                  {currentAdminTab === 'planner-vendors' && (
                    <PlannerVendors />
                  )}

                  {currentAdminTab === 'planner-budget' && (
                    <PlannerBudget />
                  )}

                  {currentAdminTab === 'planner-chuman' && (
                    <PlannerChuman />
                  )}

                  {currentAdminTab === 'planner-inventory' && (
                    <PlannerInventory />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>

          </div>

        </div>
      )}

    </div>
  );
}
