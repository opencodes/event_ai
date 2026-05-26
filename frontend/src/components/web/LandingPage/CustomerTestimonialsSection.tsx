import React from 'react';
import { Star } from 'lucide-react';

export const CustomerTestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Priya Varma",
      role: "Gourmet Enthusiast, Delhi",
      text: "The Kesari Kaju Katli was absolutely divine! So fresh, rich with saffron, and not overly sweet. It reminded me of my grandmother's handmade sweets during Diwali.",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "Amit Singhal",
      role: "Tech Lead, Noida",
      text: "The Great Shahi Thali is big enough for two people. Incredible selection, beautifully packaged with traditional motifs, and arrived steaming hot!",
      rating: 5,
      avatar: "👨‍💻"
    },
    {
      name: "Sanjana Roy",
      role: "Home Maker, Gurugram",
      text: "Ordering chaat online usually ruins the crispness, but Chaat Bazaar's packaging kept the Katori Chaat amazingly crispy and separate. Full marks for quality!",
      rating: 5,
      avatar: "👩‍🍳"
    }
  ];

  return (
    <section className="bg-amber-55/60 dark:bg-stone-850 py-16" id="customer-reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-2">
          <span className="text-xs uppercase font-extrabold text-orange-600 dark:text-orange-400 tracking-widest font-mono">
            ★ Words of Utsav Diners ★
          </span>
          <h3 className="serif text-2xl md:text-3xl font-black italic text-stone-950 dark:text-white tracking-tight text-[#C51C13]">
            What the Devotees Say About Our Deliveries
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-md border border-orange-100/40 dark:border-stone-800 relative text-left flex flex-col justify-between"
            >
              {/* Sparkle decorator */}
              <div className="absolute top-4 right-4 text-orange-400/20 text-4xl">🪔</div>
              
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-stone-605 dark:text-stone-300 text-sm leading-relaxed italic">
                  "{test.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-stone-100 dark:border-stone-800 mt-6">
                <span className="w-10 h-10 bg-amber-100 dark:bg-stone-800 rounded-full flex items-center justify-center text-xl shrink-0">
                  {test.avatar}
                </span>
                <div>
                  <h5 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {test.name}
                  </h5>
                  <p className="text-xs text-stone-400">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
