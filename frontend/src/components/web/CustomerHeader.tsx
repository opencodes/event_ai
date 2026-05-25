import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Moon, 
  Sun, 
  Sparkles, 
  Menu, 
  X, 
  Landmark, 
  Home, 
  Utensils, 
  CalendarDays, 
  Award,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ChevronDown,
  Phone,
  MapPin,
  Mail,
  Send,
  BookOpen,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { CartItem } from '../../types';
import LogoSvg from '../../assets/logo.svg';

interface CustomerHeaderProps {
  cart: CartItem[];
  onNavigate: (page: string, data?: any) => void;
  currentPage: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onSwitchToAdmin: () => void;
  userProfile: { name: string; walletBalance: number };
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  cart,
  onNavigate,
  currentPage,
  isDarkMode,
  onToggleDarkMode,
  onSwitchToAdmin,
  userProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Blog / Contact overlays
  const [showContactModal, setShowContactModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  
  // Forms states
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.foodItem.price * item.quantity, 0);

  // Fallback / standard links
  const navLinks = [
    { label: 'Home', value: 'landing' },
    { label: 'Gallery', value: 'portfolio' },
    { label: 'Shop', value: 'restaurants' }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email) {
      setContactFormSubmitted(true);
      setTimeout(() => {
        setContactFormSubmitted(false);
        setContactForm({ name: '', email: '', message: '' });
        setShowContactModal(false);
      }, 2000);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 shadow-sm border-b border-stone-200/60 dark:border-stone-800" id="ceremony-main-header">
      
      {/* 1. TOP BAR: DARK CHARCOAL BACKGROUND */}
      <div className="w-full bg-[#242424] text-[#adadad] text-xs h-11 border-b border-stone-850/80 select-none" id="top-bar-container">
        <div className="mx-auto max-w-7xl h-full flex items-center justify-between pl-4 sm:pl-6 lg:pl-10 pr-0">
          
          {/* SOCIAL LINKS (Left-aligned) */}
          <div className="flex items-center gap-4 text-stone-300">
            <a href="#facebook" className="hover:text-orange-600 transition-colors duration-200 transform hover:scale-105" title="Facebook">
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a href="#twitter" className="hover:text-orange-600 transition-colors duration-200 transform hover:scale-105" title="Twitter">
              <Twitter className="w-3.5 h-3.5" />
            </a>
            <a href="#linkedin" className="hover:text-orange-600 transition-colors duration-200 transform hover:scale-105" title="LinkedIn">
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a href="#instagram" className="hover:text-orange-600 transition-colors duration-200 transform hover:scale-105" title="Instagram">
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <span className="font-serif text-[11px] font-extrabold tracking-tighter cursor-pointer hover:text-orange-600 inline-block pt-0.5 leading-none" title="Google Plus">
              G+
            </span>
          </div>

          {/* RIGHT: DYNAMIC BLOCK-STYLE "RSVP NOW" BUTTON */}
          <div className="h-full flex items-center">
            
            {/* Quick Dark Mode Toggler inside top-bar for layout preservation */}
            <button
              onClick={onToggleDarkMode}
              className="mr-4 p-1.5 rounded-lg hover:bg-stone-800 text-stone-300 dark:hover:bg-stone-800 transition-colors flex items-center justify-center cursor-pointer"
              title="Toggle theme styling"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* RSVP block */}
            <button
              onClick={() => onNavigate('celebrations')}
              className="h-full bg-orange-600 hover:bg-orange-700 text-white px-6 sm:px-8 font-mono text-xs font-black tracking-widest uppercase transition-all duration-300 flex items-center justify-center hover:shadow-inner cursor-pointer animate-pulse"
              id="btn-rsvp-topbar"
            >
              RSVP NOW
            </button>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER BAR: WHITE LAYER */}
      <div className="w-full bg-white dark:bg-stone-900 transition-colors duration-200" id="main-navigation-bar">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
          
          {/* A. LOGO: Beautiful gold/crimson brand logo loaded from logo.svg */}
          <div className="flex items-center">
            <div 
              onClick={() => onNavigate('landing')} 
              className="flex items-center gap-1 cursor-pointer group"
              id="header-logo"
            >
              <img 
                src={LogoSvg} 
                alt="Ceremony" 
                className="h-10 sm:h-12 w-auto select-none transition-transform duration-300 group-hover:scale-[1.03]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* B. DESKTOP PAGES NAV (Centered / Left-of-center alignment) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-3" id="desktop-main-navigation">
            
            {/* 1. HOME */}
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-4 text-[11px] font-extrabold tracking-widest uppercase transition-colors cursor-pointer ${
                currentPage === 'landing'
                  ? 'text-orange-600'
                  : 'text-stone-800 dark:text-stone-300 hover:text-orange-600'
              }`}
            >
              Home
            </button>

            {/* 2. PAGES (HOVER DROPDOWN) */}
            <div className="relative group/pages py-4">
              <button 
                className={`px-3 text-[11px] font-extrabold tracking-widest uppercase transition-colors cursor-pointer flex items-center gap-0.5 ${
                  ['vendor-categories', 'celebrations', 'profile'].includes(currentPage)
                    ? 'text-orange-600'
                    : 'text-stone-800 dark:text-stone-300 hover:text-orange-600'
                }`}
                aria-haspopup="true"
              >
                <span>Pages</span>
                <ChevronDown className="w-3 h-3 text-stone-400 dark:text-stone-500" />
              </button>

              <div className="absolute top-full left-0 mt-0 w-80 bg-white dark:bg-stone-900 shadow-2xl border border-stone-100 dark:border-stone-800 rounded-2xl py-4 px-4 opacity-0 invisible group-hover/pages:opacity-100 group-hover/pages:visible transition-all duration-200 z-50 grid grid-cols-2 gap-4">
                
                {/* Column 1: Services & Custom */}
                <div className="space-y-2">
                  <p className="text-[9px] uppercase font-bold tracking-widest text-orange-600 dark:text-orange-400 font-mono">Ceremonies</p>
                  <div className="space-y-1">
                    <button 
                      onClick={() => onNavigate('vendor-categories')} 
                      className={`w-full text-left px-2 py-1.5 text-[11px] font-semibold uppercase tracking-tight transition-colors cursor-pointer rounded-lg block ${
                        currentPage === 'vendor-categories'
                          ? 'text-orange-600 bg-orange-50/50 dark:bg-stone-800/20'
                          : 'text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-orange-600'
                      }`}
                    >
                      Wedding Vendors
                    </button>
                    <button 
                      onClick={() => onNavigate('celebrations')} 
                      className={`w-full text-left px-2 py-1.5 text-[11px] font-semibold uppercase tracking-tight transition-colors cursor-pointer rounded-lg block ${
                        currentPage === 'celebrations'
                          ? 'text-orange-600 bg-orange-50/50 dark:bg-stone-800/20'
                          : 'text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-orange-600'
                      }`}
                    >
                      RSVPs & Events
                    </button>
                    <button 
                      onClick={() => onNavigate('profile')} 
                      className={`w-full text-left px-2 py-1.5 text-[11px] font-semibold uppercase tracking-tight transition-colors cursor-pointer rounded-lg block ${
                        currentPage === 'profile'
                          ? 'text-orange-600 bg-orange-50/50 dark:bg-stone-800/20'
                          : 'text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-orange-600'
                      }`}
                    >
                      User Profile
                    </button>
                  </div>
                  
                  <div className="border-t my-1 border-stone-100 dark:border-stone-800 pt-1" />
                  <button 
                    onClick={onSwitchToAdmin} 
                    className="w-full text-left px-2 py-1.5 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-[9px] font-black text-amber-600 hover:text-amber-700 dark:text-amber-400 uppercase tracking-tight flex items-center gap-1 cursor-pointer transition-colors rounded-lg"
                  >
                    <Landmark className="w-2.5 h-2.5 text-amber-500" />
                    <span>Admin Panel Setup</span>
                  </button>
                </div>

                {/* Column 2: Legal & About */}
                <div className="space-y-2 border-l border-stone-100 dark:border-stone-800 pl-4">
                  <p className="text-[9px] uppercase font-bold tracking-widest text-orange-600 dark:text-orange-400 font-mono">Utsav Legal</p>
                  <div className="space-y-1">
                    <button 
                      onClick={() => onNavigate('about')} 
                      className={`w-full text-left px-2 py-1 text-[11px] font-semibold uppercase tracking-tight transition-colors cursor-pointer rounded-lg block ${
                        currentPage === 'about' ? 'text-orange-600 bg-orange-50/50 dark:bg-stone-800/20' : 'text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-orange-600'
                      }`}
                    >
                      About Us
                    </button>
                    <button 
                      onClick={() => onNavigate('how-it-works')} 
                      className={`w-full text-left px-2 py-1 text-[11px] font-semibold uppercase tracking-tight transition-colors cursor-pointer rounded-lg block ${
                        currentPage === 'how-it-works' ? 'text-orange-600 bg-orange-50/50 dark:bg-stone-800/20' : 'text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-orange-600'
                      }`}
                    >
                      How It Works
                    </button>
                    <button 
                      onClick={() => onNavigate('terms')} 
                      className={`w-full text-left px-2 py-1 text-[11px] font-semibold uppercase tracking-tight transition-colors cursor-pointer rounded-lg block ${
                        currentPage === 'terms' ? 'text-orange-600 bg-orange-50/50 dark:bg-stone-800/20' : 'text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-orange-600'
                      }`}
                    >
                      Terms of Use
                    </button>
                    <button 
                      onClick={() => onNavigate('privacy')} 
                      className={`w-full text-left px-2 py-1 text-[11px] font-semibold uppercase tracking-tight transition-colors cursor-pointer rounded-lg block ${
                        currentPage === 'privacy' ? 'text-orange-600 bg-orange-50/50 dark:bg-stone-800/20' : 'text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-orange-600'
                      }`}
                    >
                      Privacy Policy
                    </button>
                    <button 
                      onClick={() => onNavigate('cancellation')} 
                      className={`w-full text-left px-2 py-1 text-[11px] font-semibold uppercase tracking-tight transition-colors cursor-pointer rounded-lg block ${
                        currentPage === 'cancellation' ? 'text-orange-600 bg-orange-50/50 dark:bg-stone-800/20' : 'text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-orange-600'
                      }`}
                    >
                      Cancellation
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. GALLERY */}
            <button
              onClick={() => onNavigate('portfolio')}
              className={`px-3 py-4 text-[11px] font-extrabold tracking-widest uppercase transition-colors cursor-pointer ${
                currentPage === 'portfolio'
                  ? 'text-orange-600'
                  : 'text-stone-800 dark:text-stone-300 hover:text-orange-600'
              }`}
            >
              Gallery
            </button>

            {/* 4. SHOP */}
            <button
              onClick={() => onNavigate('restaurants')}
              className={`px-3 py-4 text-[11px] font-extrabold tracking-widest uppercase transition-colors cursor-pointer ${
                currentPage === 'restaurants' || currentPage === 'restaurant-detail'
                  ? 'text-orange-600'
                  : 'text-stone-800 dark:text-stone-300 hover:text-orange-600'
              }`}
            >
              Shop
            </button>

            {/* 5. BLOG */}
            <button
              onClick={() => setShowBlogModal(true)}
              className="px-3 py-4 text-[11px] font-extrabold tracking-widest uppercase text-stone-800 dark:text-stone-300 hover:text-orange-600 transition-colors cursor-pointer"
            >
              Blog
            </button>

            {/* 6. CONTACT US */}
            <button
              onClick={() => onNavigate('contact')}
              className={`px-3 py-4 text-[11px] font-extrabold tracking-widest uppercase transition-colors cursor-pointer ${
                currentPage === 'contact'
                  ? 'text-orange-600'
                  : 'text-stone-800 dark:text-stone-300 hover:text-orange-600'
              }`}
            >
              Contact Us
            </button>

          </nav>

          {/* C. UTILITIES (Basket with Counter, Search, Menu) */}
          <div className="flex items-center gap-2 select-none">
            
            {/* 1. Shopping Bag with Badge '0' exactly as in mockup */}
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2.5 rounded-full hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
              id="btn-basket-header"
              title="View your menu cart"
            >
              <ShoppingBag className="w-[18px] h-[18px] stroke-2" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-stone-700 text-white font-mono text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            </button>

            {/* 2. Search Icon (Magnifier) */}
            <button
              onClick={() => onNavigate('restaurants')}
              className="p-2.5 rounded-full hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
              title="Search traditional menus"
            >
              <Search className="w-[18px] h-[18px] stroke-2" />
            </button>

            {/* 3. Hamburger Menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 transition-colors"
              title="Toggle responsive drawer list"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-red-500" /> : <Menu className="w-5 h-5 stroke-2" />}
            </button>

          </div>

        </div>
      </div>

      {/* MOBILE COMPACT DRAWER ACTION LIST */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-3 shadow-xl absolute top-full left-0 w-full z-50 animate-in fade-in slide-in-from-top-3 duration-200 text-left">
          <p className="text-[10px] uppercase font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 px-2">
            Ceremony Menu Elements
          </p>
          <div className="space-y-1">
            
            <button
              onClick={() => {
                onNavigate('landing');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl text-xs font-bold uppercase tracking-widest text-stone-700 dark:text-stone-200"
            >
              Home View
            </button>

            <button
              onClick={() => {
                onNavigate('portfolio');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl text-xs font-bold uppercase tracking-widest text-stone-700 dark:text-stone-200"
            >
              Case Gallery
            </button>

            <button
              onClick={() => {
                onNavigate('restaurants');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl text-xs font-bold uppercase tracking-widest text-stone-700 dark:text-stone-200"
            >
              Satvik Shop
            </button>

            <button
              onClick={() => {
                onNavigate('vendor-categories');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-300"
            >
              Wedding Vendors
            </button>

            <button
              onClick={() => {
                onNavigate('celebrations');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-300"
            >
              RSVPs & Real Timelines
            </button>

            <button
              onClick={() => {
                onNavigate('profile');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-300"
            >
              User Account
            </button>

            <button
              onClick={() => {
                setShowBlogModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl text-xs font-bold uppercase tracking-widest text-stone-400"
            >
              Read Ceremony Blog
            </button>

            <button
              onClick={() => {
                setShowContactModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl text-xs font-bold uppercase tracking-widest text-stone-400"
            >
              Contact Offices
            </button>

          </div>

          <div className="pt-2.5 border-t border-dashed border-stone-150 dark:border-stone-800">
            <button
              onClick={() => {
                onSwitchToAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center px-4 py-2.5 rounded-xl text-xs font-black uppercase text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 dark:bg-stone-800 dark:border-stone-700 dark:text-amber-400 flex items-center justify-center gap-2"
            >
              <Landmark className="w-4 h-4 text-amber-500" />
              <span>Enter Management Admin Center</span>
            </button>
          </div>
        </div>
      )}

      {/* OVERLAY A: BLOG MODAL */}
      {showBlogModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-850 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-100 dark:border-stone-800 shadow-2xl relative text-left">
            <button 
              onClick={() => setShowBlogModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 dark:hover:text-white transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-stone-800 flex items-center justify-center text-orange-600">
                <BookOpen className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 tracking-widest font-mono">INSIGHTS // CEREMONY CATERING</span>
                <h3 className="text-xl font-black text-stone-900 dark:text-white uppercase mt-0.5">Wedding Banquet Wisdom Guides</h3>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-stone-600 dark:text-stone-300 font-medium">
                <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl hover:border-l-4 hover:border-orange-600 transition-all">
                  <h4 className="font-extrabold text-[#C51C13] dark:text-orange-400 uppercase">1. Scaling Satvik Wedding Feasts</h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">Learn how pure vegetarian ghee, organic seasonal lentils, and cold press oil maintain spiritual holiness for over 1000 guests.</p>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl hover:border-l-4 hover:border-orange-600 transition-all">
                  <h4 className="font-extrabold text-[#C51C13] dark:text-orange-400 uppercase">2. The Mithila Mandap Setup Checklist</h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">Meticulous spatial map setups, low-stools seating, traditional marigold hangings, and sand incense boilers coordination secrets.</p>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl hover:border-l-4 hover:border-orange-600 transition-all">
                  <h4 className="font-extrabold text-[#C51C13] dark:text-orange-400 uppercase">3. Managing High-Stress RSVP Windows</h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">How using real-time inventory systems keeps guests table seats, diet flags, and bartender mixers from running short.</p>
                </div>
              </div>

              <button
                onClick={() => setShowBlogModal(false)}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black tracking-wider rounded-xl uppercase transition cursor-pointer"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY B: CONTACT US INTEGRATED FORM & INFOS */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-850 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-stone-100 dark:border-stone-800 shadow-2xl relative text-left">
            <button 
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 dark:hover:text-white transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <div className="grid md:grid-cols-12 gap-6 items-start">
              
              {/* Info Column */}
              <div className="md:col-span-5 space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 tracking-widest font-mono">UTSAV PLANNERS</span>
                  <h3 className="text-xl font-black text-stone-900 dark:text-white uppercase leading-none mt-0.5">Reach Us</h3>
                </div>

                <p className="text-[11px] text-stone-450 dark:text-stone-300 leading-relaxed font-semibold">
                  Reach out to discuss your traditional layout options, pure vegetarian banquet costs, and booking timelines.
                </p>

                <div className="space-y-2 text-xs text-stone-600 dark:text-stone-350 pl-0.5">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                    <span>+91 98871 00234</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                    <span>concierge@utsavbites.in</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                    <span>Noida Sector 62 & Varanasi Ghats, UP</span>
                  </div>
                </div>
              </div>

              {/* Form Column */}
              <div className="md:col-span-7 bg-stone-50 dark:bg-stone-900 p-4 rounded-2xl border dark:border-stone-800">
                {contactFormSubmitted ? (
                  <div className="h-44 flex flex-col justify-center items-center text-center space-y-1">
                    <span className="text-3xl">🕊️</span>
                    <b className="text-xs text-emerald-600 uppercase font-bold">Inquiry Sent Successfully!</b>
                    <p className="text-[10px] text-stone-400">Our chief ceremony coordinator will telephone your contact within 3 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-extrabold text-stone-500 uppercase mb-1">Your Noble Name</label>
                      <input 
                        required
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Ananya Sharma"
                        className="w-full p-2 rounded-lg border bg-white dark:bg-stone-850 dark:border-stone-800 text-stone-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-stone-500 uppercase mb-1">Email Coordinates</label>
                      <input 
                        required
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="ananya@gmail.com"
                        className="w-full p-2 rounded-lg border bg-white dark:bg-stone-850 dark:border-stone-800 text-stone-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-stone-500 uppercase mb-1">Custom Notes / Guest Count</label>
                      <textarea 
                        rows={2}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Vedic wedding in Noida for 600 guests. Need Satvik banquet quota..."
                        className="w-full p-2 rounded-lg border bg-white dark:bg-stone-850 dark:border-stone-800 text-stone-900 dark:text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-750 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Transmit Inquiry</span>
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </header>
  );
};
