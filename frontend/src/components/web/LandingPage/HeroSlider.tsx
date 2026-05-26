import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RangoliMandala } from '../GoldenDeco';

interface HeroSliderProps {
  onNavigate: (page: string, data?: any) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      title: "Shaadi Ya Koi Bada Function? Planning Ab Tension Free",
      subtitle: "Utsav Connect is the premier event management platform and community marketplace dedicated to ensuring your Indian ceremonies are authentic, seamless, and beautifully executed.",
      coupon: "UTSAVCONNECT",
      bgClass: "from-[#C51C13] via-stone-900 to-amber-700",
      cta: "Plan Your Event",
      accent: "✨ Your Gateway to Traditional Celebrations ✨",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=450&auto=format&fit=crop&q=80"
    },
    {
      title: "Vetted Royal Venues & Exquisite Catering",
      subtitle: "Simplify booking traditional, absolute satvik culinary chefs and stunning palace-themed decorations across NCR and Lucknow under user-friendly payment plans.",
      coupon: "UTSAWROYAL",
      bgClass: "from-amber-600 via-stone-850 to-[#C51C13]",
      cta: "Browse Marketplace",
      accent: "👑 Reliable Traditional Experts 👑",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=450&auto=format&fit=crop&q=80"
    },
    {
      title: "Real-Time Ceremonial Coordinator Suites",
      subtitle: "Map layout setups, track bar coordinates, schedule live flute rehearsals, and manage guests' seating, all on our zero-stress administrative panels.",
      coupon: "PLANFREE",
      bgClass: "from-rose-800 via-stone-900 to-emerald-800",
      cta: "Explore Tech Tools",
      accent: "🌸 Hassle-Free Execution Tech 🌸",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=450&auto=format&fit=crop&q=80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 pt-6 max-w-7xl mx-auto" id="hero-carousel">
      {/* Decorative background mandala inside hero */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none select-none z-0 hidden lg:block opacity-10">
        <RangoliMandala className="w-96 h-96 text-orange-400" />
      </div>
      <div className="absolute top-1/2 right-10 -translate-y-1/2 pointer-events-none select-none z-0 hidden lg:block opacity-10">
        <RangoliMandala className="w-96 h-96 text-amber-400 animate-[spin_120s_linear_infinite]" />
      </div>

      <div className="relative overflow-hidden h-96 rounded-3xl shadow-xl bg-gradient-to-r z-10 transition-all duration-700">
        {banners.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-gradient-to-r ${slide.bgClass} flex flex-col md:flex-row items-center justify-between p-8 md:p-14 gap-6 transition-all duration-700 ease-in-out ${
              idx === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
            }`}
          >
            <div className="space-y-4 max-w-xl text-left">
              <span className="inline-block text-xs font-bold text-yellow-300 dark:text-yellow-200 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                {slide.accent}
              </span>
              <h2 className="serif text-3xl sm:text-4xl md:text-5xl font-black italic text-white leading-tight drop-shadow-md">
                {slide.title}
              </h2>
              <p className="text-amber-50 text-xs sm:text-sm md:text-base font-semibold max-w-md">
                {slide.subtitle}
              </p>
              
              {/* Coupon Code visual */}
              <div className="flex items-center gap-3">
                <div className="border-2 border-dashed border-amber-300 rounded-lg px-3 py-1 bg-black/20 backdrop-blur-sm text-yellow-300 font-mono text-sm font-bold">
                  CODE: {slide.coupon}
                </div>
                <span className="text-xs text-yellow-105 font-medium">✨ Copy on Checkout</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('restaurants')}
                  className="px-6 py-3 bg-white hover:bg-orange-50 text-orange-700 font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm uppercase tracking-wide cursor-pointer"
                >
                  {slide.cta}
                </button>
              </div>
            </div>

            {/* Banner Right Image */}
            <div className="hidden md:block w-70 h-70 lg:w-80 lg:h-80 relative shrink-0">
              <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl animate-pulse" />
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover rounded-2xl border-4 border-white/20 shadow-2xl skew-y-1 transform hover:rotate-3 transition-transform duration-550"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        ))}

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-white px-3' : 'bg-white/40'}`}
            />
          ))}
        </div>

        {/* Nav arrows */}
        <button
          onClick={() => setCurrentSlide((currentSlide - 1 + banners.length) % banners.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/30 text-white transition-colors z-20 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((currentSlide + 1) % banners.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/30 text-white transition-colors z-20 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
