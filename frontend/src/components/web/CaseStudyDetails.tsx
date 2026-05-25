import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Utensils, 
  BookOpen, 
  Clock, 
  Quote, 
  CheckCircle, 
  Award 
} from 'lucide-react';
import { AnimatedDiya } from './GoldenDeco';
import { PortfolioItem } from '../../types';

interface CaseStudyDetailsProps {
  selectedItem: PortfolioItem | null;
  onNavigate: (page: string, data?: any) => void;
}

export const CaseStudyDetails: React.FC<CaseStudyDetailsProps> = ({ selectedItem, onNavigate }) => {
  if (!selectedItem) {
    return (
      <div className="h-96 border border-dashed rounded-3xl flex flex-col items-center justify-center text-center text-xs text-stone-405 p-8 dark:border-stone-800">
        <AnimatedDiya className="w-16 h-16 opacity-30 mb-2" />
        <b className="text-stone-400 dark:text-stone-300">No Portfolio Selection Made</b>
        <p className="max-w-xs mt-1 text-stone-400">Select any past marriage highlight or festive corporate feast representation on the left to see full blueprint case information.</p>
      </div>
    );
  }

  return (
    <motion.div
      key={selectedItem.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white dark:bg-stone-850 p-6 sm:p-8 rounded-3xl border border-orange-100 dark:border-stone-800 shadow-md space-y-6"
      id="case-study-details-panel"
    >
      {/* Header info */}
      <div className="border-b pb-5 dark:border-stone-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 font-mono tracking-widest uppercase flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 fill-[#C51C13] text-transparent" />
            <span>Case Summary Highlight</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white uppercase tracking-tight mt-1">
            {selectedItem.title}
          </h2>
          <p className="text-stone-400 text-xs font-mono font-bold mt-1">
            Executed Successfully on: {selectedItem.date} // {selectedItem.location}
          </p>
        </div>

        <span className="px-3 py-1 bg-rose-50 dark:bg-stone-900 border border-rose-100 dark:border-stone-800 text-[#C51C13] dark:text-orange-400 font-black text-[10px] rounded-lg tracking-wider uppercase font-mono shrink-0">
          {selectedItem.category}
        </span>
      </div>

      {/* Narrative overview */}
      <div className="space-y-2">
        <h4 className="text-xs font-black uppercase text-stone-400 font-mono tracking-widest flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>The Client Vision and Backstory</span>
        </h4>
        <p className="text-xs sm:text-sm leading-relaxed text-stone-605 dark:text-stone-300 font-semibold">
          {selectedItem.detailedCaseStudy.story}
        </p>
      </div>

      {/* Decor secret specs */}
      <div className="bg-orange-600/5 dark:bg-orange-950/10 p-5 rounded-2xl border border-orange-200/50 space-y-3">
        <h4 className="text-xs font-black uppercase text-[#C51C13] dark:text-orange-400 font-mono flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#C51C13]" />
          <span>Traditional Décor Specifications</span>
        </h4>
        <p className="text-xs text-stone-550 dark:text-stone-350">
          <b>Theme Concept:</b> {selectedItem.decorTheme}
        </p>
        <ul className="grid sm:grid-cols-2 gap-2 text-[11px] text-stone-450 dark:text-stone-300 font-medium pl-1">
          {selectedItem.detailedCaseStudy.decorationSecrets.map((sec, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{sec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Grand food highlights spotlight */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2 dark:border-stone-800">
          <h4 className="text-xs font-black uppercase text-stone-400 font-mono tracking-widest flex items-center gap-1.5">
            <Utensils className="w-4 h-4" />
            <span>Shahi Traditional Feast Banquet Spotlight</span>
          </h4>
          <span className="text-[9px] bg-[#C51C13] text-white px-2 py-0.5 rounded font-black font-mono">
            Veg Excellence
          </span>
        </div>

        <p className="text-xs text-stone-500 font-semibold leading-relaxed">
          <b>Featured Taste Index:</b> {selectedItem.highlightFood}
        </p>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          {selectedItem.detailedCaseStudy.chefSpecial.map((dish, idx) => (
            <div key={idx} className="p-3 bg-stone-50 dark:bg-stone-900 border dark:border-stone-800 rounded-xl leading-snug flex items-center gap-2">
              <span className="text-lg">🍲</span>
              <div>
                <b className="text-stone-900 dark:text-white block font-sans uppercase font-black text-[11px]">{dish.split(' (')[0]}</b>
                <span className="text-[10px] text-stone-400 font-medium">{dish.includes('(') ? dish.substring(dish.indexOf('(')) : 'Organic pure butter ghee'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline execution milestones */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase text-[#C51C13] border-b pb-2 dark:border-stone-800 font-mono tracking-widest flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>Fine-Tuned Execution Checklist & Timeline</span>
        </h4>

        <div className="relative border-l-2 border-orange-100 dark:border-stone-800 pl-4 ml-1.5 my-2 space-y-4 text-xs font-semibold">
          {selectedItem.detailedCaseStudy.timeline.map((mile, idx) => (
            <div key={idx} className="relative">
              {/* Dot Bullet */}
              <div className="absolute -left-[2px] -translate-x-[20px] top-1.5 w-2 h-2 rounded-full bg-[#C51C13]" />
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center-inner">
                <span className="text-[10px] font-bold font-mono text-[#C51C13] dark:text-orange-400 uppercase">{mile.time}</span>
                <span className="text-stone-900 dark:text-white font-black ml-1 uppercase">{mile.ritual}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Client Testimonial Card */}
      <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-3xl border dark:border-stone-800 relative">
        <Quote className="absolute top-2 right-4 w-12 h-12 text-orange-200/50 dark:text-stone-800 pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="flex gap-1 text-amber-500 text-xs">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          
          <p className="text-xs font-medium italic text-stone-605 dark:text-stone-300 leading-relaxed">
            "{selectedItem.quoteText}"
          </p>

          <div className="pt-2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-stone-800 flex items-center justify-center text-xs">
              👑
            </div>
            <div className="leading-none text-left">
              <b className="text-[11px] font-black text-stone-900 dark:text-white block">{selectedItem.quoteAuthor}</b>
              <span className="text-[10px] text-stone-400 font-mono">Wedding Client</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BUTTON ACTS */}
      <div className="pt-4 border-t dark:border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <span className="text-stone-405 font-medium">Want to budget and plan your own festive evening like this?</span>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('vendor-categories')}
            className="flex-1 sm:flex-none px-4 py-2 bg-stone-105 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-805 dark:text-white font-bold rounded-xl transition cursor-pointer"
          >
            Browse Vendors
          </button>
          <button
            onClick={() => onNavigate('restaurants')}
            className="flex-grow sm:flex-grow-0 px-4 py-2 bg-[#C51C13] hover:bg-red-700 text-white font-bold rounded-xl transition shadow-sm hover:scale-[1.01] cursor-pointer"
          >
            Explore Shahi Catering
          </button>
        </div>
      </div>

    </motion.div>
  );
};
