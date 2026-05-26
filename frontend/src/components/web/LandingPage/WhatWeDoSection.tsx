import React from 'react';
import { MessageSquare, Calendar, Heart, CheckSquare, Sliders, Sparkles } from 'lucide-react';

export const WhatWeDoSection: React.FC = () => {
  const steps = [
    {
      phase: "PHASE 01 // CONSULT",
      title: "Consult",
      description: "We understand your vision, priorities, and budget.",
      icon: MessageSquare,
      id: "step-consult"
    },
    {
      phase: "PHASE 02 // PLAN",
      title: "Plan",
      description: "We design a personalized wedding plan with expert insights.",
      icon: Calendar,
      id: "step-plan"
    },
    {
      phase: "PHASE 03 // SHORTLIST",
      title: "Shortlist",
      description: "Venues, vendors, and themes – we bring curated options to the table.",
      icon: Heart,
      id: "step-shortlist"
    },
    {
      phase: "PHASE 04 // BOOK",
      title: "Book",
      description: "We handle negotiations, confirmations, and contracts.",
      icon: CheckSquare,
      id: "step-book"
    },
    {
      phase: "PHASE 05 // MANAGE",
      title: "Manage",
      description: "We coordinate with all service providers to keep everything on track.",
      icon: Sliders,
      id: "step-manage"
    },
    {
      phase: "PHASE 06 // EXECUTE",
      title: "Execute",
      description: "On your big day, our team ensures every detail goes perfectly.",
      icon: Sparkles,
      id: "step-execute"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-left" id="what-we-do-section">
      <div className="text-center space-y-2 mb-12">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs uppercase font-extrabold text-orange-600 dark:text-orange-400 tracking-widest font-mono">
            ★ Seamless Traditional Ceremonies ★
          </span>
        </div>
        <h3 className="serif text-2xl md:text-3xl font-black italic text-[#C51C13] dark:text-white tracking-tight">
          What We Do
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">
          From the initial consultation to the final execution, we coordinate every beautiful milestone so you can live the grandest memories completely stress-free.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div 
              key={step.id} 
              className="bg-white dark:bg-stone-850 p-6 rounded-2xl border border-orange-100/40 dark:border-stone-800 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex flex-col items-start gap-4" 
              id={step.id}
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-stone-800 flex items-center justify-center text-[#C51C13] dark:text-orange-400 font-bold shrink-0 shadow-inner">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-orange-500 font-mono tracking-wider">{step.phase}</span>
                <h4 className="text-base font-black text-stone-900 dark:text-white mt-1 uppercase">{step.title}</h4>
                <p className="text-xs sm:text-sm text-stone-550 dark:text-stone-305 mt-2 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
