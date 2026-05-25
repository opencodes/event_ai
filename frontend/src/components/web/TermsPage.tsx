import React, { useState } from 'react';
import { ShieldCheck, Scale, FileText, ChevronRight, AlertTriangle } from 'lucide-react';
import { AnimatedDiya } from './GoldenDeco';

export const TermsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number | null>(0);

  const sections = [
    {
      title: "1. Acceptance of Sacred Terms",
      content: "By accessing, browsing, or utilizing the Ceremony & Utsav Bites website, mobile application, or physical booking concierge (jointly called the 'Service'), you explicitly declare to have read, understood, and agreed to be legally bound by these Terms and Conditions. If you do not agree to these terms, please halt your engagement immediately."
    },
    {
      title: "2. Auspicious Ceremonial Sanctity Protocols",
      content: "The Service specializes in the coordination and supplying of traditional Hindu sacred ceremonies and Vedic catering. As such, you covenant and agree that any physical venue or booking space managed by Utsav Bites must strictly abide by traditional Sattvik purity standards. This forbids the introduction, consumption, or carrying of any non-vegetarian meats, egg elements, alcohol, or narcotic products inside the designated Mandap boundaries. Our designated Pandits and karigars retain the absolute right to halt rituals and cancel bookings instantly with full fee forfeiture should this clause be violated."
    },
    {
      title: "3. Booking Deposits & auspicious Muhurat Scheduling",
      content: "Indian weddings operate around specific divine Muhurat times. All bookings require an initial 35% non-refundable seed collateral deposit at the time of reservation. The remaining 65% balance must be settled in full exactly 14 calendar days prior to the wedding date. Should a ceremony date require shifting, we will apply our best efforts to match a sibling auspicious Muhurat, subject to Pandit and floral growers board availability, and a minor 10% rescheduling premium fee."
    },
    {
      title: "4. Vendor & Pandit Sourcing Authority",
      content: "Utsav Bites works as an integrated smart coordination marketplace. While we perform stringent background verification, license auditing (including FSSAI standards), and Gurukul certificate checking, the individual third-party caterer, decorator, or scholar is directly liable for the final quality of service on-site. Utsav Bites shall not be liable for any sudden performance disruptions arising from acts of God, unexpected natural weather, crop failures of critical marigold stocks, or road transport blocks."
    },
    {
      title: "5. Safe Digital Wallet Use & Refund Conditions",
      content: "Our system features a client-side digital wallet for streamlined cashbacks and refunds. Wallet funds can be redeemed against special catering items, sweet boxes, or silver ware rentals. Cash withdrawals from the digital wallet are processed back to the original bank account within 7 to 10 banking business days, subject to minor standard security audits."
    },
    {
      title: "6. Limitation of Liability",
      content: "To the maximum parameters allowed by Indian law, Ceremony & Utsav Bites and its directors shall not be held liable for any indirect, incidental, or exemplary damages, including but not limited to loss of sentimental joy, unexpected weather damage to wedding silks, guest complaints regarding spice intensities, or delayed arrival of decorated horse carriages."
    }
  ];

  return (
    <div className="pt-24 pb-16 bg-stone-50 dark:bg-stone-900 transition-colors duration-200" id="terms-page">
      
      {/* HEADER SECTION */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <div className="flex justify-center mb-3">
          <Scale className="w-10 h-10 text-orange-600 animate-pulse" />
        </div>
        <span className="text-[10px] uppercase font-mono font-black tracking-widest text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-stone-800 px-3 py-1 rounded-full">
          Legal Agreement // Terms & Conditions
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-black text-stone-900 dark:text-white mt-3 uppercase tracking-tight">
          Terms of Ceremonial Engagement
        </h1>
        <p className="text-xs text-stone-505 max-w-md mx-auto mt-2 font-sans text-stone-500">
          Please read these guidelines thoroughly. They establish the legal boundaries, deposit schedules, and traditional sanctity parameters.
        </p>
        <p className="text-[10px] font-mono text-stone-400 mt-1">Last Modified: May 24, 2026</p>
        <div className="w-16 h-1 bg-orange-600 mx-auto mt-4 rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          
          {/* QUICK SUMMARY COLUMN (Left-aligned 4 columns) */}
          <div className="md:col-span-4 space-y-4">
            <div className="bg-white dark:bg-stone-850 p-5 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm space-y-3">
              <span className="text-[10px] font-mono font-bold tracking-wider text-orange-650 uppercase block">
                Quick Highlight Summary
              </span>
              <ul className="space-y-3 text-[11px] text-stone-600 dark:text-stone-300 font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-orange-655 shrink-0">🪔</span>
                  <span><strong>Zero Meat/Alcohol:</strong> Mandaps must be strictly Sattvik pure.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-655 shrink-0">💳</span>
                  <span><strong>35% Seed Deposit:</strong> Non-refundable to secure growers and scholars.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-655 shrink-0">📆</span>
                  <span><strong>14-Day Deadline:</strong> Complete balance due 14 days prior to wedding.</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-xl">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <h4 className="text-[11px] font-black uppercase text-amber-650 tracking-wider">Sanctity Clause</h4>
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 font-sans leading-relaxed">
                Pandits retain unilateral authority to halt rituals instantly if meat or alcohol is found on physical event grounds.
              </p>
            </div>
          </div>

          {/* MAIN LEGAL CONTENT ACCORDION (Right-aligned 8 columns) */}
          <div className="md:col-span-8 bg-white dark:bg-stone-850 rounded-2.5xl border border-stone-100 dark:border-stone-800 shadow-xl p-6 md:p-8 space-y-4" id="terms-accordion">
            {sections.map((sec, idx) => (
              <div 
                key={idx}
                className="border-b border-stone-100 dark:border-stone-800 pb-3 last:border-0 last:pb-0"
              >
                <button
                  onClick={() => setActiveSection(activeSection === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left py-2 font-serif font-black text-stone-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 font-bold uppercase text-xs md:text-sm transition-colors cursor-pointer select-none"
                >
                  <span>{sec.title}</span>
                  <ChevronRight 
                    className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${
                      activeSection === idx ? 'rotate-90 text-orange-600' : ''
                    }`}
                  />
                </button>

                {activeSection === idx && (
                  <div className="text-xs text-stone-500 dark:text-stone-400 font-sans leading-relaxed pt-2 pl-1 animate-fadeIn">
                    {sec.content}
                  </div>
                )}
              </div>
            ))}

            <div className="mt-8 pt-4 border-t border-stone-100 dark:border-stone-800 text-[10px] text-stone-400 font-sans text-center">
              Have questions regarding our ceremonial terms? Write to our specialized legal counsel at <span className="underline select-all text-stone-505">legal@utsavbites.in</span> and we will respond with joy.
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
