import React from 'react';
import { motion } from 'motion/react';
import { Award, Heart, ShieldCheck, Flame, Star, Coffee, Sparkles } from 'lucide-react';
import { AnimatedDiya, RangoliMandala } from './GoldenDeco';

interface AboutUsPageProps {
  onNavigate: (page: string) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-24 pb-16 bg-stone-50 dark:bg-stone-900 transition-colors duration-200" id="about-us-page">
      
      {/* HERO BANNER SECTION */}
      <section className="relative overflow-hidden py-16 px-4 md:px-8 text-center bg-gradient-to-br from-stone-900 via-stone-950 to-orange-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-2xl mb-16" id="about-hero">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -right-16 -top-16 w-64 h-64 opacity-5 pointer-events-none">
          <RangoliMandala className="w-full h-full text-orange-400" />
        </div>
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="flex justify-center mb-4">
            <AnimatedDiya className="w-12 h-12 text-orange-500" />
          </div>
          <span className="text-xs font-bold font-mono tracking-widest text-orange-400 uppercase bg-orange-950/40 border border-orange-500/20 px-4 py-1.5 rounded-full inline-block">
            Our Heritage & Vision
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight mt-2 leading-tight">
            Crafting Holy Traditions & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-400 to-red-400">
              Royal Indian Celebrations
            </span>
          </h1>
          <p className="text-stone-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans">
            At Ceremony & Utsav Bites, we preserve India's rich ceremonial heritage, connecting modern families to timeless Vedic rituals, premium traditional catering, and magical custom decorators.
          </p>
        </div>
      </section>

      {/* CORE PILARS / VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20" id="about-pillars">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 dark:text-white uppercase tracking-wider">
            Our Three Golden Pillars
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-stone-850 p-8 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-200 flex flex-col items-center text-center space-y-4" id="pillar-food">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-950/30 text-orange-600 rounded-2xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-white uppercase">Sattvik Shudh Feast</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
              We exclusively source pure organic cold-press oils, hand-ground spices, and pure cow ghee to curate divine, high-vibe wedding banquets certified by FSSAI and absolute spiritual standards.
            </p>
          </div>

          <div className="bg-white dark:bg-stone-850 p-8 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-200 flex flex-col items-center text-center space-y-4" id="pillar-rituals">
            <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-white uppercase">Vedic Ceremonial Fidelity</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
              From Dwar Puja to Mandap rituals, we safeguard authentic ceremonial structures. Our coordination suite pairs families with approved certified scholars, pandits, and auspicious item kits.
            </p>
          </div>

          <div className="bg-white dark:bg-stone-850 p-8 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 duration-200 flex flex-col items-center text-center space-y-4" id="pillar-design">
            <div className="w-14 h-14 bg-orange-50 dark:bg-orange-950/30 text-red-600 rounded-2xl flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-white uppercase">Royal Spatial Canvas</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
              Hand-hung fresh marigold torans, beautifully traced sand rangoli mandalas, and royal vintage wooden seating are thoughtfully designed by native Indian karigars and master decorators.
            </p>
          </div>
        </div>
      </section>

      {/* THE STORY OF WORK */}
      <section className="bg-stone-100 dark:bg-stone-950 py-16 transition-colors duration-200 mb-20" id="about-story">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Visual block */}
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-tr from-orange-600 to-amber-500 rounded-3xl p-1 relative shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-stone-950/20 backdrop-blur-xs flex items-center justify-center">
                  <RangoliMandala className="w-48 h-48 text-amber-100/20 animate-spin-slow" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-stone-900/95 p-6 rounded-2xl border border-stone-100 dark:border-stone-850 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🪔</span>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-white uppercase">Bespoke Heritage Award</h4>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400">Awarded "Best Authentic Event Planning Suite" in Northern India, 2025.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-600/10 rounded-full blur-xl pointer-events-none" />
            </div>

            {/* Story text */}
            <div className="space-y-6">
              <span className="text-[11px] font-mono tracking-widest text-orange-600 dark:text-orange-400 font-bold uppercase block">
                How It Began // Since 2018
              </span>
              <h2 className="text-3xl font-serif font-black text-stone-900 dark:text-white uppercase tracking-tight">
                Our Journey From Varanasi Ghats To Smart Planners
              </h2>
              <p className="text-xs md:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                Utsav Bites arose out of a burning desire to cure a persistent malady: the dilution of pure traditional ingredients and ritualistic integrity in modern Indian weddings. Witnessing chemical ghee, plastic garlands, and discomposed scheduling, our founders set out to build a platform that marries timeless aesthetics with state-of-the-art technological convenience.
              </p>
              <p className="text-xs md:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                Today, we operate in 5 major regions, managing over 420 premier traditional caterers, 1,200 verified pandits, and a vibrant community of local flower growers, sweet smiths, and folk musicians.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-200 dark:border-stone-800">
                <div>
                  <h5 className="text-2xl font-black text-orange-600 font-mono">15,000+</h5>
                  <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider font-sans">Satiated Guests</p>
                </div>
                <div>
                  <h5 className="text-2xl font-black text-orange-600 font-mono">150+</h5>
                  <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider font-sans">Weddings Hosted</p>
                </div>
                <div>
                  <h5 className="text-2xl font-black text-orange-600 font-mono">100%</h5>
                  <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider font-sans">Satvik Promise</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MEET OUR ARCHITECTS / LEADERSHIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16" id="about-team">
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 dark:text-white uppercase tracking-wider">
            Ceremonial Architects
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto mt-2 font-sans">
            A collective of master chefs, Vedic scholars, luxury designers, and technology pioneers working jointly.
          </p>
          <div className="w-16 h-1 bg-orange-600 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="bg-white dark:bg-stone-850 p-6 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-md flex flex-col items-center text-center space-y-3" id="team-vimal">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-200 to-orange-400 rounded-full flex items-center justify-center text-3xl font-bold text-orange-950 font-serif shadow-inner border-2 border-orange-500/20">
              VS
            </div>
            <div>
              <h4 className="font-serif font-black text-stone-900 dark:text-white text-base">Vimal Shastri</h4>
              <p className="text-[10px] font-mono tracking-wider text-orange-600 uppercase font-bold mt-0.5">Founder & Rituals Custodian</p>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed font-sans mt-2">
              Deeply trained in Sanskrit rituals at Banaras Hindu University, Vimal oversees the authenticity of our ceremonial modules and pandit boards.
            </p>
          </div>

          <div className="bg-white dark:bg-stone-850 p-6 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-md flex flex-col items-center text-center space-y-3" id="team-ananya">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-red-400 rounded-full flex items-center justify-center text-3xl font-bold text-orange-950 font-serif shadow-inner border-2 border-orange-500/20">
              AM
            </div>
            <div>
              <h4 className="font-serif font-black text-stone-900 dark:text-white text-base">Ananya Mishra</h4>
              <p className="text-[10px] font-mono tracking-wider text-orange-600 uppercase font-bold mt-0.5">Director of Aesthetics & Decor</p>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed font-sans mt-2">
              With 12 years in premium luxury spatial designs, Ananya combines localized floral heritage with stunning modern lighting systems.
            </p>
          </div>

          <div className="bg-white dark:bg-stone-850 p-6 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-md flex flex-col items-center text-center space-y-3" id="team-rohit">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-200 to-blue-400 rounded-full flex items-center justify-center text-3xl font-bold text-orange-950 font-serif shadow-inner border-2 border-orange-500/20">
              RK
            </div>
            <div>
              <h4 className="font-serif font-black text-stone-900 dark:text-white text-base">Rohit Kapoor</h4>
              <p className="text-[10px] font-mono tracking-wider text-orange-600 uppercase font-bold mt-0.5">Chief Feast Curator (Chef)</p>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed font-sans mt-2">
               Former Executive Chef specialized in traditional Awadhi, Bhojpuri, and Satvik cuisines. Rohit governs our pure ghee kitchens policy.
            </p>
          </div>

        </div>

        <div className="mt-12">
          <button 
            onClick={() => onNavigate('vendor-categories')}
            className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs font-black uppercase tracking-widest rounded-xl shadow-lg transition-transform hover:scale-105"
          >
            Find Wedding Vendors
          </button>
        </div>
      </section>

    </div>
  );
};
