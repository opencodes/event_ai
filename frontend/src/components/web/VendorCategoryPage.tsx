import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import { RangoliMandala } from './GoldenDeco';

import { CategoriesGrid, WEDDING_CATEGORIES, CategoryItem } from './VendorCategoryPage/CategoriesGrid';
import { VendorGridCard, ListingCardItem } from './VendorCategoryPage/VendorGridCard';
import { SubCategoryDetailsModal } from './VendorCategoryPage/SubCategoryDetailsModal';
import { InquiryModal, InquiryFormData } from './VendorCategoryPage/InquiryModal';
import { ALL_MOCK_VENDORS } from './VendorCategoryPage/mockData';

interface VendorCategoryPageProps {
  onNavigate: (page: string, data?: any) => void;
  isDarkMode: boolean;
}

export const VendorCategoryPage: React.FC<VendorCategoryPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<CategoryItem | null>(null);

  // Dynamic filter state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [filterRating48, setFilterRating48] = useState(false);
  const [sortByOption, setSortByOption] = useState<'rating' | 'costAsc' | 'costDesc' | null>(null);

  // Inquiry form states
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryTarget, setInquiryTarget] = useState<ListingCardItem | null>(null);
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    phone: '',
    date: '',
    message: '',
    estimatedGuests: '150-300'
  });
  const [showCelebration, setShowCelebration] = useState(false);

  // Toggle bookmark / favorite
  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Trigger inquiry modal
  const handleOpenInquiry = (item: ListingCardItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setInquiryTarget(item);
    setShowInquiryModal(true);
  };

  // Filter Categories list based on search bar
  const filteredCategories = useMemo(() => {
    return WEDDING_CATEGORIES.filter(cat => 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cat.subtext.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Filtered list of service providers based on active category, search string, rating status & sort selections
  const filteredVendors = useMemo(() => {
    let list = [...ALL_MOCK_VENDORS];

    // 1. Category Filter
    if (selectedCategoryId) {
      list = list.filter(vendor => vendor.category === selectedCategoryId);
    }

    // 2. Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(vendor => 
        vendor.name.toLowerCase().includes(q) || 
        vendor.location.toLowerCase().includes(q)
      );
    }

    // 3. Rating filter (Top Rated 4.8+)
    if (filterRating48) {
      list = list.filter(vendor => vendor.rating >= 4.8);
    }

    // 4. Sorting
    if (sortByOption === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortByOption === 'costAsc') {
      const parsePrice = (priceStr: string) => {
        const cleaned = priceStr.replace(/[^\d]/g, '');
        return cleaned ? parseInt(cleaned, 10) : 0;
      };
      list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortByOption === 'costDesc') {
      const parsePrice = (priceStr: string) => {
        const cleaned = priceStr.replace(/[^\d]/g, '');
        return cleaned ? parseInt(cleaned, 10) : 0;
      };
      list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }

    return list;
  }, [selectedCategoryId, searchQuery, filterRating48, sortByOption]);

  const activeCategoryObject = useMemo(() => {
    return WEDDING_CATEGORIES.find(c => c.id === selectedCategoryId) || null;
  }, [selectedCategoryId]);

  const handleApplyInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      setShowInquiryModal(false);
      setFormData({ name: '', phone: '', date: '', message: '', estimatedGuests: '150-300' });
    }, 4500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 min-h-screen bg-stone-50 dark:bg-stone-900 text-left relative" id="wedding-vendor-categories-view">
      
      {/* Decorative background mandalas */}
      <div className="absolute top-10 right-4 w-60 h-60 opacity-[0.03] dark:opacity-[0.05] pointer-events-none select-none">
        <RangoliMandala className="w-full h-full text-orange-500" />
      </div>

      {/* HEADER SECTION & SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6" id="categories-header-block">
        <div className="space-y-2">
          <button
            onClick={() => {
              if (selectedCategoryId) {
                setSelectedCategoryId(null);
              } else {
                onNavigate('landing');
              }
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline mb-1 cursor-pointer"
            id="btn-back-landing-wedding"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{selectedCategoryId ? 'Back to All Categories' : 'Go Back Home'}</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-[10px] font-extrabold tracking-wider uppercase rounded-full">
              Traditional Utsav Planning
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          </div>

          <h2 className="serif text-3xl md:text-4xl font-extrabold italic text-stone-955 dark:text-white tracking-tight" id="wedding-heading-main">
            {activeCategoryObject ? `${activeCategoryObject.name} Specialists` : 'Wedding Vendor Directory'}
          </h2>

          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-2xl leading-relaxed">
            {activeCategoryObject 
              ? `Discover verified Sector 56 Noida direct providers specialized in traditional wedding ${activeCategoryObject.name.toLowerCase()} services.` 
              : 'Browse premium wedding decorators, traditional pandits, pre-wedding specialist shooters, mehendi artisans, royal wedding venues and bridal grooming experts in Sector 56 Noida.'
            }
          </p>
        </div>

        {/* Dynamic Category Search */}
        <div className="relative w-full md:w-80 shrink-0" id="search-wedding-group">
          <input
            type="text"
            placeholder={activeCategoryObject ? "Search within active category..." : "Search venue, makeup, decor..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-10 py-2.5 text-xs text-stone-805 dark:text-white placeholder-stone-400 bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-full focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all shadow-sm"
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-xs text-stone-404 hover:text-stone-600 dark:hover:text-white cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* QUICK CATEGORIES PILL SCROLLER BAR */}
      <div className="bg-amber-50/50 dark:bg-stone-850/40 p-3 rounded-2xl border border-amber-105/30 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2" id="categories-pill-scroller">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#C51C13] dark:text-[#FFCB44] uppercase px-2 shrink-0">
          📍 Categories:
        </span>
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedCategoryId === null
              ? 'bg-[#C51C13] text-white shadow-sm'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-700'
          }`}
          id="pill-cat-all"
        >
          All Categories Grid
        </button>
        {WEDDING_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedCategoryId === cat.id
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-700'
            }`}
            id={`pill-cat-${cat.id}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* 2. WEDDING CATEGORIES GRID ONLY SHOWN WHEN NO SINGLE CATEGORY SELECTED */}
      {!selectedCategoryId ? (
        <section className="space-y-6" id="wedding-categories-grid-section">
          <div className="flex justify-between items-center border-b border-orange-100 dark:border-stone-800 pb-3">
            <h3 className="serif text-xl font-bold italic text-stone-900 dark:text-white">
              Discover Wedding Specialties
            </h3>
            <span className="hidden sm:inline text-xs font-mono text-stone-400">Click any category tile below to view individual filtered vendor listings</span>
          </div>

          <CategoriesGrid
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(cat) => {
              setSelectedCategoryId(cat.id);
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
          />
        </section>
      ) : (
        /* DETAILED SERVICE LISTINGS WITH FILTER STRIP */
        <section className="space-y-6" id="filtered-vendor-results-block">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 border-b border-orange-100 dark:border-stone-800 pb-4">
            
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-orange-600 shrink-0" />
              <button
                onClick={() => setFilterRating48(!filterRating48)}
                className={`p-1.5 px-3 rounded-full text-xs font-bold transition-all border cursor-pointer flex items-center gap-1 ${
                  filterRating48 
                    ? 'bg-orange-600 text-white border-orange-600' 
                    : 'bg-white text-stone-700 border-stone-205 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700'
                }`}
              >
                <span>⭐ Top Rated (4.8+)</span>
                {filterRating48 && <Check className="w-3 h-3" />}
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-400">Sort Providers:</span>
              <select
                value={sortByOption || ''}
                onChange={(e) => setSortByOption((e.target.value as any) || null)}
                className="p-1 px-3 bg-white dark:bg-stone-850 text-xs font-bold text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 rounded-lg outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
              >
                <option value="">Auspicious Recommendations</option>
                <option value="rating">Rating: Highest First</option>
                <option value="costAsc">Price: Budget-friendly</option>
                <option value="costDesc">Price: Luxury First</option>
              </select>
            </div>

          </div>

          {/* Vendors Listing Grid */}
          <div className="space-y-4">
            <h3 className="serif text-lg font-black italic text-stone-900 dark:text-white flex items-center gap-2">
              <span>Verified directory list</span>
              <span className="text-xs font-mono font-bold bg-orange-100 dark:bg-amber-950/40 text-orange-600 dark:text-amber-400 p-1 px-2.5 rounded-full">
                {filteredVendors.length} Providers Available
              </span>
            </h3>

            {filteredVendors.length === 0 ? (
              <div className="p-12 bg-white dark:bg-stone-850 rounded-2xl text-center border border-dashed border-orange-200 dark:border-stone-800 space-y-4 max-w-sm mx-auto">
                <span className="text-3xl">🏜️</span>
                <h4 className="font-bold text-stone-700 dark:text-stone-300">No Matching Specialists</h4>
                <p className="text-xs text-stone-400">We couldn't find matches under active search. Try clearing filters.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterRating48(false);
                    setSortByOption(null);
                  }}
                  className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition"
                >
                  Reset Active Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredVendors.map((item) => (
                  <VendorGridCard
                    key={item.id}
                    item={item}
                    bookmarkedIds={bookmarkedIds}
                    onToggleBookmark={handleToggleBookmark}
                    onOpenInquiry={handleOpenInquiry}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. EXPLICIT CATEGORY PROMOTIONS SCROLLER */}
      {!selectedCategoryId && (
        <section className="space-y-4" id="promotions-corridor">
          <div className="flex justify-between items-center pb-2 border-b border-orange-100 dark:border-stone-800">
            <h3 className="serif text-xl font-bold italic text-stone-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Dussehra Spotlight Vendors</span>
            </h3>
            <span className="text-xs text-orange-600 dark:text-orange-400 font-bold hover:underline cursor-pointer">View Featured Partners</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ALL_MOCK_VENDORS.slice(0, 4).map((item) => (
              <VendorGridCard
                key={item.id}
                item={item}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={handleToggleBookmark}
                onOpenInquiry={handleOpenInquiry}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7. CLASSIC MODAL VIEW FOR EXPLICIT SUB-CATEGORY SPOTLIGHT VIEW */}
      <AnimatePresence>
        {selectedSubCategory && (
          <SubCategoryDetailsModal
            category={selectedSubCategory}
            onClose={() => setSelectedSubCategory(null)}
            onInquire={(dum) => {
              setSelectedSubCategory(null);
              setInquiryTarget(dum);
              setShowInquiryModal(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* 8. ROYAL INQUIRY booking modal overlay */}
      <AnimatePresence>
        {showInquiryModal && inquiryTarget && (
          <InquiryModal
            inquiryTarget={inquiryTarget}
            formData={formData}
            setFormData={setFormData}
            showCelebration={showCelebration}
            onClose={() => setShowInquiryModal(false)}
            onSubmit={handleApplyInquiry}
          />
        )}
      </AnimatePresence>

    </div>
  );
};
