import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { CategoryItem } from './CategoriesGrid';
import { ListingCardItem } from './VendorGridCard';

interface SubCategoryDetailsModalProps {
  category: CategoryItem;
  onClose: () => void;
  onInquire: (dum: ListingCardItem) => void;
}

export const SubCategoryDetailsModal: React.FC<SubCategoryDetailsModalProps> = ({
  category,
  onClose,
  onInquire,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-stone-850 rounded-3xl overflow-hidden max-w-2xl w-full border border-orange-100 dark:border-stone-800 shadow-2xl relative"
      >
        <div className="relative h-48 bg-stone-108">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/50" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold hover:bg-black transition cursor-pointer"
          >
            &times;
          </button>
          <div className="absolute bottom-4 left-6 text-white space-y-1 text-left">
            <h3 className="serif text-2xl font-black italic">{category.name} Category</h3>
            <p className="text-xs text-stone-200">{category.subtext}</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-4 text-left">
          <h4 className="font-bold text-xs uppercase text-amber-600 tracking-wider">Auspicious Category Detail</h4>
          <p className="text-xs text-stone-605 dark:text-stone-300 leading-relaxed">
            We have cataloged 24 premier customized traditional providers matching the <b>{category.name}</b> category in Noida and adjoining NCR suburbs. They provide satvik standards, tailored multi-day packages, and high-performance execution.
          </p>

          <div className="border border-amber-100 dark:border-stone-800 bg-amber-50/40 dark:bg-stone-900/30 p-3.5 rounded-xl space-y-1 text-xs">
            <span className="font-extrabold text-orange-700 dark:text-[#FFCB44] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Special Benefit Offer Active
            </span>
            <p className="text-stone-600 dark:text-stone-400">
              Submit a query package via this directory and receive an immediate 10% complimentary coupon and premium coordination free.
            </p>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              onClick={() => {
                const dumm: ListingCardItem = {
                  id: `cat-spot-${category.id}`,
                  name: `${category.name} Traditional Lead Service`,
                  location: 'Sector 56, Noida, UP',
                  rating: 5.0,
                  price: 'Custom Estimate Packages',
                  category: category.id,
                  image: category.image
                };
                onInquire(dumm);
              }}
              className="flex-grow py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-center text-xs rounded-xl transition-all cursor-pointer"
            >
              Send Category Inquiry &rarr;
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-705 dark:text-stone-300 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
