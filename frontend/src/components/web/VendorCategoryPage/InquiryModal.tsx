import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MapPin, User, Phone, Calendar, CheckCircle2 } from 'lucide-react';
import { AnimatedDiya } from '../GoldenDeco';
import { ListingCardItem } from './VendorGridCard';

export interface InquiryFormData {
  name: string;
  phone: string;
  date: string;
  estimatedGuests: string;
  message: string;
}

interface InquiryModalProps {
  inquiryTarget: ListingCardItem;
  formData: InquiryFormData;
  setFormData: (val: InquiryFormData) => void;
  showCelebration: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  inquiryTarget,
  formData,
  setFormData,
  showCelebration,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[250] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="bg-white dark:bg-stone-850 rounded-3xl overflow-hidden max-w-md w-full border border-orange-100/50 dark:border-stone-800 shadow-2xl relative p-6 sm:p-8 space-y-5"
      >
        
        {/* Confetti or traditional holy celebration notification layer */}
        {showCelebration && (
          <div className="absolute inset-0 bg-orange-600 text-white flex flex-col items-center justify-center p-6 space-y-4 text-center z-50 animate-in fade-in duration-300">
            <div className="relative p-2 bg-white/10 rounded-full animate-bounce">
              <AnimatedDiya className="w-16 h-16 text-yellow-300" />
            </div>
            <h3 className="serif text-2xl font-black italic tracking-wide text-yellow-250">
              Auspicious Inquiry Confirmed!
            </h3>
            <div className="space-y-2 text-xs opacity-90 leading-relaxed max-w-sm text-center">
              <p className="font-semibold text-yellow-105">
                Om Shree Ganeshay Namah 🪔
              </p>
              <p>
                Your wedding consultation inquiry for <b>{inquiryTarget.name}</b> has been booked successfully!
              </p>
              <p className="text-[11px] text-orange-200">
                Our lead traditional coordination specialist will analyze your specifications and reach out within 2 hours.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold tracking-widest text-amber-200 bg-black/20 p-2 px-4 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
              <span>Reference ID: UTS-W-983</span>
            </div>
          </div>
        )}

        <div className="flex justify-between items-start">
          <div className="space-y-1 text-left">
            <span className="text-[10px] tracking-wider uppercase font-extrabold text-orange-600 dark:text-orange-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500 animate-spin" />
              Royal Wedding Consultation
            </span>
            <h3 className="serif text-xl font-bold italic text-stone-900 dark:text-white">
              Send Inquiry Box
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded text-stone-400 text-lg font-bold cursor-pointer transition-all"
          >
            &times;
          </button>
        </div>

        {/* Display Target info */}
        <div className="bg-orange-50/40 dark:bg-stone-900/40 rounded-xl p-3 border border-orange-100/30 flex gap-3 items-center text-xs">
          <img
            src={inquiryTarget.image}
            alt={inquiryTarget.name}
            className="w-12 h-12 object-cover rounded-lg shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-0.5 text-left truncate">
            <h4 className="font-bold text-stone-900 dark:text-white truncate">{inquiryTarget.name}</h4>
            <p className="text-[10px] text-stone-400 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
              <span className="truncate">{inquiryTarget.location}</span>
            </p>
            <p className="text-[10px] font-bold text-orange-600 dark:text-[#FFCB44]">{inquiryTarget.price}</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
          
          {/* Name */}
          <div className="space-y-1 text-left">
            <label className="font-extrabold text-stone-605 text-[10px] uppercase">Groom / Bride Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 dark:bg-stone-900 text-stone-850 dark:text-white border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <User className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-400 animate-pulse" />
            </div>
          </div>

          {/* Contact phone */}
          <div className="space-y-1 text-left">
            <label className="font-extrabold text-stone-650 text-[10px] uppercase">WhatsApp Contact</label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="e.g. +91 91000 00000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 dark:bg-stone-900 text-stone-850 dark:text-white border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <Phone className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Event Date */}
            <div className="space-y-1 text-left">
              <label className="font-extrabold text-stone-650 text-[10px] uppercase">Auspicious Date</label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-8 pr-2 py-1.5 bg-stone-50 dark:bg-stone-900 text-stone-850 dark:text-white border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <Calendar className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
              </div>
            </div>

            {/* Estimated Guests count */}
            <div className="space-y-1 text-left">
              <label className="font-extrabold text-stone-650 text-[10px] uppercase">Guests Volume</label>
              <select
                value={formData.estimatedGuests}
                onChange={(e) => setFormData({ ...formData, estimatedGuests: e.target.value })}
                className="w-full py-1.5 px-2 bg-stone-50 dark:bg-stone-900 text-stone-850 dark:text-white border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="Under 100">Under 100</option>
                <option value="150-300">150 - 300 guests</option>
                <option value="300-600">300 - 600 guests</option>
                <option value="600-1000">600 - 1000 guests</option>
              </select>
            </div>
          </div>

          {/* Short message */}
          <div className="space-y-1 text-left">
            <label className="font-extrabold text-stone-650 text-[10px] uppercase">Special Request Note</label>
            <textarea
              rows={2}
              placeholder="We want traditional decor with marigold flower torans, sangeet entry dance theme..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-2 bg-stone-50 dark:bg-stone-900 text-stone-850 dark:text-white border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer"
          >
            Confirm Auspicious Consultation &rarr;
          </button>
        </form>
      </motion.div>
    </div>
  );
};
