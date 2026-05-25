import React, { useState } from 'react';
import { Shield, Eye, Lock, FileKey, Info, Check } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const [agreeChecked, setAgreeChecked] = useState(false);

  return (
    <div className="pt-24 pb-16 bg-stone-50 dark:bg-stone-900 transition-colors duration-200" id="privacy-policy-page">
      
      {/* HEADER BANNER */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <div className="flex justify-center mb-3">
          <Shield className="w-10 h-10 text-orange-650 animate-bounce" />
        </div>
        <span className="text-[10px] uppercase font-mono font-black tracking-widest text-orange-655 dark:text-orange-400 bg-orange-100 dark:bg-stone-800 px-3 py-1 rounded-full">
          Data Protection // Privacy Policy
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-black text-stone-900 dark:text-white mt-3 uppercase tracking-tight">
          Ceremonial Privacy Charters
        </h1>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mt-2 font-sans">
          How we safeguard your delicate wedding lists, guest diet preferences, GPS coordinate logs, and transaction security.
        </p>
        <p className="text-[10px] font-mono text-stone-400 mt-1">Version 2.3 // Effective May 2026</p>
        <div className="w-16 h-1 bg-orange-600 mx-auto mt-4 rounded-full" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-stone-850 rounded-3.5xl border border-stone-100 dark:border-stone-800 shadow-xl p-8 space-y-8" id="privacy-charter-document">
          
          {/* INTRO DUCTION */}
          <div className="space-y-3 font-sans" id="privacy-intro">
            <h3 className="text-sm font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 font-mono">
              ✦ Introduction & Commitments
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
              Pranam. At Ceremony & Utsav Bites, we hold your absolute personal privacy. Designing a wedding involves sharing sensitive, personal metadata—including family names, relative counts, guest food allergies, and household drop areas. We promise to never sell, rent, or lease your private databases to third-party ad empires. Your trust is our ultimate asset.
            </p>
          </div>

          {/* SECTION 1 */}
          <div className="space-y-3" id="privacy-sec-1">
            <h4 className="text-xs font-black uppercase text-stone-900 dark:text-white font-serif border-b pb-2 border-stone-100 dark:border-stone-800 flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-605" />
              <span>1. Information We Capture</span>
            </h4>
            <div className="text-xs text-stone-500 dark:text-stone-400 space-y-2 leading-relaxed">
              <p>We collect only the essential fields necessary to fulfill ceremonial logistics:</p>
              <ul className="list-disc pl-5 space-y-1 font-mono text-[10px]">
                <li><strong>Identification Details:</strong> Full name, telephone, email address, and home boundary coordinates.</li>
                <li><strong>Ceremonial Parameters:</strong> Muhurat dates, total guests, and pure ghee/Sattvik food choices.</li>
                <li><strong>Interaction Trails:</strong> Digital wallet logs, trial food feedback statements, and support tickets.</li>
              </ul>
            </div>
          </div>

          {/* SECTION 2 */}
          <div className="space-y-3" id="privacy-sec-2">
            <h4 className="text-xs font-black uppercase text-stone-900 dark:text-white font-serif border-b pb-2 border-stone-100 dark:border-stone-800 flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-605" />
              <span>2. How Data Is Employed</span>
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
              Your parameters strictly drive ceremonial operations: mapping delivery drivers to your sector gates, assigning Gurukul pandits to your chosen muhurat slot, validating catering trial packages delivery, processing instant digital wallet cashbacks, and preventing invalid duplications. We never carry out automated profiling algorithms.
            </p>
          </div>

          {/* SECTION 3 */}
          <div className="space-y-3" id="privacy-sec-3">
            <h4 className="text-xs font-black uppercase text-stone-900 dark:text-white font-serif border-b pb-2 border-stone-100 dark:border-stone-800 flex items-center gap-2">
              <FileKey className="w-4 h-4 text-orange-605" />
              <span>3. Information Splicing With Vetted Partners</span>
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
              To render services on-ground, we share micro-segmented data blocks only with designated licensed curators. For instance, we pass your floral colour requirements to our local growers, and your guest counts to our certified Sattvik kitchen chefs. These partners are strictly limited from reusing your telephone or family names for unsolicited promotional reach of any kind.
            </p>
          </div>

          {/* SECTION 4 */}
          <div className="space-y-3" id="privacy-sec-4">
            <h4 className="text-xs font-black uppercase text-stone-900 dark:text-white font-serif border-b pb-2 border-stone-100 dark:border-stone-800 flex items-center gap-2">
              <Info className="w-4 h-4 text-orange-605" />
              <span>4. User Controls & Account Erasure</span>
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
              You possess complete, unrestrained authority over your digital trails. You may at any point log into your profile menu to delete saved coordinates, clear orders list archives, or submit a formal requests to delete your entire Ceremony Account. We complete erasure actions from our system archives within 48 clock hours.
            </p>
          </div>

          {/* INTERACTIVE ACKNOWLEDGMENT SLATE */}
          <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-100 dark:border-stone-800" id="privacy-interactive-slate">
            <div className="flex items-start gap-3">
              <input 
                type="checkbox"
                id="privacy-ack-btn"
                checked={agreeChecked}
                onChange={(e) => setAgreeChecked(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-orange-655 focus:ring-orange-500 rounded border-stone-200"
              />
              <div>
                <label htmlFor="privacy-ack-btn" className="text-[11px] font-extrabold text-stone-800 dark:text-stone-200 uppercase tracking-tight cursor-pointer select-none">
                  Auspicious Privacy Charter Accepted
                </label>
                <p className="text-[10px] text-stone-400 mt-1 font-sans leading-tight">
                  By checking this optional selector, you acknowledge that Utsav Bites may use cookies to remember dark mode preference settings and save your active cart so items are not cleared upon page refresh.
                </p>
                {agreeChecked && (
                  <span className="text-[10px] font-mono text-green-600 font-bold block mt-2 animate-pulse">
                    ✓ Choice stored! Your active cart is now backed securely by standard browser storage.
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
