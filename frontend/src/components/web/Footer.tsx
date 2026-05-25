import React from 'react';
import { AnimatedDiya } from './GoldenDeco';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, ShieldCheck } from 'lucide-react';
import LogoPng from '../../assets/app-ss.png';
import LogoSvg from '../../assets/logo.svg';

export const Footer: React.FC<{ isDarkMode: boolean; onNavigate?: (page: string) => void }> = ({ isDarkMode, onNavigate }) => {
  const handleLinkClick = (page: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <footer className="relative bg-stone-900 border-t-4 border-orange-500 text-stone-300 overflow-hidden pt-16 pb-8" id="festival-footer">
      
      {/* Background Diwali glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* DOWNLOAD APP SECTION */}
        <div className="mb-16 bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative" id="download-app-banner">
          {/* Sparkles */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="inline-block text-xs font-bold text-amber-200 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                Har Traditional Function Ka Smart Planning Partner
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Download Our Utsav Connect Mobile App Today!
 
              </h3>
              <div className="text-orange-50 text-base max-w-md space-y-4">
                <p className="font-bold text-amber-200">App Features:</p>
                <ul className="space-y-1.5 text-sm md:text-base font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-300">✅</span>
                    <span>Trusted local vendors search karo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-300">✅</span>
                    <span>Halwai, Tent, Decorator, Milk, Kirana sab ek jagah</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-300">✅</span>
                    <span>Guest list & RSVP management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-300">✅</span>
                    <span>Feast / Bhoj planning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-300">✅</span>
                    <span>Budget aur expense tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-300">✅</span>
                    <span>Gift / Chuman management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-300">✅</span>
                    <span>Bartan & inventory tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-300">✅</span>
                    <span>Event reminders & instant updates</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <p className="tagline py-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/5 inline-block text-xs md:text-sm">
                    <strong>Ghar ka bada function? Ab notebook nahi, Utsav Connect use karo 😄</strong>
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                {/* Google Play Store Badge */}
                <a 
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-3 px-4 py-2 bg-black hover:bg-stone-955 border border-stone-800 text-white rounded-xl transition-all duration-200 shadow-xl group/btn cursor-pointer min-w-[155px]"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white shrink-0 transition-transform group-hover/btn:scale-105" fill="currentColor">
                    <path d="M5 3c-.22 0-.43.06-.61.18L12.52 12l-8.13 8.81c.18.12.39.19.61.19.18 0 .35-.04.51-.13l13.79-7.23c.44-.23.7-.84.7-1.54s-.26-1.31-.7-1.54L5.51 3.13C5.35 3.04 5.18 3 5 3z" />
                  </svg>
                  <div className="text-left leading-none">
                    <span className="text-[9px] text-stone-400 font-bold tracking-wider block uppercase">GET IT ON</span>
                    <span className="text-sm font-extrabold tracking-tight block mt-0.5 font-sans">Google Play</span>
                  </div>
                </a>

                {/* Apple App Store Badge */}
                <a 
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-3 px-4 py-2.5 bg-black hover:bg-stone-955 border border-stone-800 text-white rounded-xl transition-all duration-200 shadow-xl group/btn cursor-pointer min-w-[155px]"
                >
                  <svg viewBox="0 0 384 512" className="w-5 h-5 text-white shrink-0 transition-transform group-hover/btn:scale-105" fill="currentColor">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-48.4-19.1-77.1-19.1-37.4 0-77.5 21.8-97.6 57.2-40 70.2-10.2 175 28.7 230 19.1 27.2 41.5 57.4 71.3 56.2 28.7-1.1 39.6-18.5 74.3-18.5 34.7 0 45.1 18.5 74.8 17.9 30.3-.6 50.1-27.2 69-54.6 21.8-31.5 30.8-62 31.1-63.6-1-.5-60.1-23.1-60.3-91.4zM269.4 90.1c19.1-23.1 31.9-55.2 28.4-87.1-27.4 1.1-60.4 18.2-80.1 41-16.7 18.8-31.3 51.3-27.3 82.9 30.6 2.3 61.4-14.7 79-36.8z"/>
                  </svg>
                  <div className="text-left leading-none">
                    <span className="text-[9px] text-stone-400 font-bold tracking-wider block uppercase font-sans">Download on the</span>
                    <span className="text-sm font-extrabold tracking-tight block mt-0.5 font-sans">App Store</span>
                  </div>
                </a>
              </div>
            </div>
            
            {/* Visual Phone Model with Diya */}
            <div className="relative flex justify-center pt-6  md:-mb-12 self-end">
              <div className="relative w-64 h-[500px] bg-stone-950 rounded-t-[40px] border-t-4 border-x-4 border-amber-400/40 shadow-3xl overflow-hidden flex flex-col justify-end">
                <div className="flex-1 flex flex-col justify-end items-center text-center">
                  <img 
                    src={LogoPng} 
                    alt="Utsav Connect App" 
                    className="w-full h-full object-cover object-top select-none transition-transform duration-300 group-hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER LINKS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12" id="footer-links-grid">
          
          {/* Column 1: Brand details */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
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
            <p className="text-sm text-stone-400 leading-relaxed">
              Bringing India's trusted vendor for event together on single platform,  Halwai se lekar tent house, milk supplier se flower decorator tak — sab kuch ek hi app mein..
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 bg-stone-850 hover:bg-orange-600 rounded-full hover:text-white transition-colors text-stone-400"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-stone-850 hover:bg-orange-600 rounded-full hover:text-white transition-colors text-stone-400"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-stone-850 hover:bg-orange-600 rounded-full hover:text-white transition-colors text-stone-400"><Twitter className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Column 2: Legal / Help */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase border-b border-orange-500/20 pb-2">
              Explore Feature
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Explore Vendor Search</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Explore Event Planning </a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Explore Bufget Tracker for event</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Explore Guest Management</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Explor bhoj bhat planning</a></li>
            </ul>
          </div>

          {/* Column 3: Legal & Help Charters */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase border-b border-orange-500/20 pb-2">
              Useful Link
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <a 
                  href="#about" 
                  onClick={(e) => handleLinkClick('about', e)} 
                  className="hover:text-orange-400 transition-colors cursor-pointer block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#how-it-works" 
                  onClick={(e) => handleLinkClick('how-it-works', e)} 
                  className="hover:text-orange-400 transition-colors cursor-pointer block"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a 
                  href="#terms" 
                  onClick={(e) => handleLinkClick('terms', e)} 
                  className="hover:text-orange-400 transition-colors cursor-pointer block"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a 
                  href="#privacy" 
                  onClick={(e) => handleLinkClick('privacy', e)} 
                  className="hover:text-orange-400 transition-colors cursor-pointer block"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#cancellation" 
                  onClick={(e) => handleLinkClick('cancellation', e)} 
                  className="hover:text-orange-400 transition-colors cursor-pointer block"
                >
                  Cancellation Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact details */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase border-b border-orange-500/20 pb-2">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Corp Office: Keshopur Pura, PO - Pokharvinda, Pupri thana, Sitamadhi - 843320</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>+91 1800 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>care@utsavconnect.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM RIGHTS */}
        <div className="border-t border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span>Certified Secure Platform</span>
          </div>
          <div className="text-center sm:text-right">
            <span>© 2026 Utsav Connect. Inspired by tradition. Prepared for & Made in India!</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
