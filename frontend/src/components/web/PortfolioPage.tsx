import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MapPin, 
  Users, 
  Heart, 
  Utensils, 
  ChevronRight, 
  Image, 
  Grid, 
  Filter, 
  Award, 
  Quote, 
  Calendar, 
  DollarSign,
  Search,
  BookOpen,
  CheckCircle,
  Clock
} from 'lucide-react';
import { MarigoldToran, RangoliMandala } from './GoldenDeco';
import { CaseStudyDetails } from './CaseStudyDetails';

interface PortfolioItem {
  id: string;
  title: string;
  celebrants: string;
  location: string;
  date: string;
  category: 'Royal Palace' | 'Mithila Heritage' | 'Contemporary' | 'Corporate Festive';
  image: string;
  guestCount: number;
  highlightFood: string;
  decorTheme: string;
  quoteAuthor: string;
  quoteText: string;
  description: string;
  detailedCaseStudy: {
    story: string;
    timeline: { time: string; ritual: string }[];
    chefSpecial: string[];
    invitationTheme: string;
    decorationSecrets: string[];
  };
}

const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'The Mithila Royal Heritage Wedding',
    celebrants: 'Ananya & Shreyas',
    location: 'Surbhi Grand Mansion, Noida',
    date: 'November 2025',
    category: 'Mithila Heritage',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=60',
    guestCount: 650,
    highlightFood: 'Pure Aromatic Vedic Saffron Shrikhand & Claypot Ghee Khichdi',
    decorTheme: 'Marigold Canopy & Authentic Hand-Painted Madhubani Walls',
    quoteAuthor: 'Pt. Chandrakant Mishra (Father of the Bride)',
    quoteText: 'UtsavBites turned our long-cherished ritual wedding dream into absolute perfection. From the customized pure satvik bhoj that our elders adored to the live flute background during our Dwar Puja ritual, everything was elegant.',
    description: 'A magnificent heritage celebration combining traditional Vedic math rituals from Northern India with rich, pure vegetarian culinary masterpieces.',
    detailedCaseStudy: {
      story: 'With over 600 invited relatives from Bihar and Varanasi, this wedding required meticulous custom logistics. Traditional seating was established on low wooden stools (Chowkis) where guests received hand-ground saffron sandalwood paste blessings.',
      timeline: [
        { time: '17:00 IST', ritual: 'Traditional Dwar Puja with Vedic Chants and Flutists' },
        { time: '19:30 IST', ritual: 'Pristine Jaimala of Marigold & White Lilies' },
        { time: '21:00 IST', ritual: 'Grand Bhoj - Five Courses of Pure Ghee Mithila Delicacies' },
        { time: '23:30 IST', ritual: 'Simulated Kohabar Traditional Art Chamber Sentiments' }
      ],
      chefSpecial: [
        'Pratham Madhuparka (Sweet Curd & Honey starters)',
        'Mithila Saffron Kheer with 24K Gold Leafing',
        'Special Dal Baghari tossed in indigenous cow ghee',
        'Dahi Baigani cooked inside earthen handis'
      ],
      invitationTheme: 'Handmade Scroll Papyrus with Madhubani Peacock Accents',
      decorationSecrets: [
        'Over 400 kg of fresh yellow & orange Lucknow marigolds',
        'Traditional oil diya lamps hand-poured inside courtyard brass urli vessels',
        'Sandalwood incense diffused through low-noise warm boilers'
      ]
    }
  },
  {
    id: 'port-2',
    title: 'The Royal Rajasthani Palace Weekend',
    celebrants: 'Devika & Harshvardhan',
    location: 'Heritage Palace Resort, Delhi NCR Ext.',
    date: 'February 2026',
    category: 'Royal Palace',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=60',
    guestCount: 450,
    highlightFood: 'Traditional Rajasthani Panchmel Dal Baati Churma cooked on slow firewood',
    decorTheme: 'Golden Mirrors & Royal Red Velveteen Drapery',
    quoteAuthor: 'Devika (The Bride)',
    quoteText: 'The team managed a complex 3-day royal itinerary without a single flaw. Our guests still talk about the live chaat street bazaar and the premium custom return gift silver coins!',
    description: 'An expansive weekend gala celebrating desert royalty themes with live folklore dances, custom dhol troupes, and rich ghee-laden banquets.',
    detailedCaseStudy: {
      story: 'This palace extravaganza mirrored Jodhpur hospitality standards. The groom arrived on a majestic horse accompanied by 24 traditional trumpet and dhol artists. The feast was presented on royal silver utensils with personalized velvet menus for every guest.',
      timeline: [
        { time: '16:00 IST', ritual: 'Ghoomar Dance Folk welcoming at step-wells' },
        { time: '18:00 IST', ritual: 'Traditional Henna Mehndi Bazaar and dry fruit tasting' },
        { time: '20:30 IST', ritual: 'Sangeet Choreography Stage and Fire-dancing performances' },
        { time: '22:30 IST', ritual: 'Midnight Phere with pure sandalwood wood fires' }
      ],
      chefSpecial: [
        'Shahi Panchmel Dal infused with dry desert bird-chile',
        'Rajasthani Gatte ki Sabzi in rich sour yogurt gravy',
        'Warm Malai Ghevar with Kesari Rabdi topping',
        'Rosewater Mint Elixirs in custom clay kulhads'
      ],
      invitationTheme: 'Crushed Velvet Clasp Boxes inside Gold Foil Embroidery pouches',
      decorationSecrets: [
        '30 handmade mirror mosaics built custom for the central backdrop',
        'Real red roses cascading from hand-forged vintage iron chandeliers',
        'Traditional handloom carpets from Bikaner lining all walkways'
      ]
    }
  },
  {
    id: 'port-3',
    title: 'Unilever Mega Festive Dussehra Feast',
    celebrants: 'Unilever North Corporate Team',
    location: 'Sanskriti Convention Lawns, Sector 62',
    date: 'October 2025',
    category: 'Corporate Festive',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=60',
    guestCount: 1200,
    highlightFood: 'Live Interactive Katori Chaat Station & Hot Jalebi Rabdi counters',
    decorTheme: 'Terracotta Pots & Vibrant Multi-colored Rangoli Mats',
    quoteAuthor: 'Amit K. (HR VP Operations)',
    quoteText: 'Catering for 1200 employees simultaneously is a logistics nightmare, but UtsavBites executed our pure traditional Dussehra theme with zero waiting delay. Sensational taste.',
    description: 'A large-scale corporate festive food carnival recreating the street-food hubs of Varanasi, Banaras, and Old Delhi using certified hygiene guidelines.',
    detailedCaseStudy: {
      story: 'Designed to drive employee engagement during the autumn Navratri/Dussehra peak. We constructed 12 separate interactive street food stalls, utilizing safe organic leaf bowls (patravalis) and serving fresh kulfis in handmade clay cones.',
      timeline: [
        { time: '12:00 IST', ritual: 'Vedic Pooja and corporate office opening lamps' },
        { time: '13:00 IST', ritual: 'Activation of 12 live North & South Indian festive stalls' },
        { time: '15:30 IST', ritual: 'Traditional Dandiya Raas workshop & corporate dancing faceoff' },
        { time: '17:00 IST', ritual: 'Gift distribution of handloom Mithila art paintings' }
      ],
      chefSpecial: [
        'Crispy Varanasi Palak Patta Chaat with sweetened yogurt',
        'Hot Mathura Bedmi Poori with spicy hing aloo gravy',
        'Freshly piped Saffron Jalebi cooked in desi ghee',
        'Wood-fired filter coffee served in custom pottery cups'
      ],
      invitationTheme: 'Smart E-Invitation with interactive Rangoli patterns & gift selector',
      decorationSecrets: [
        'Giant 15-foot high floral gateway shaped like a traditional temple gopuram',
        'More than 150 terracotta painted pots displaying real wheat grass spikes',
        'Corporate photo zones utilizing traditional swings with marigold garlands'
      ]
    }
  },
  {
    id: 'port-4',
    title: 'Modern Minimalist Pastel Sangeet',
    celebrants: 'Kriti & Raghav',
    location: 'Rooftop Oasis Clubhouse, Gurugram',
    date: 'April 2026',
    category: 'Contemporary',
    image: 'https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?w=600&auto=format&fit=crop&q=60',
    guestCount: 250,
    highlightFood: 'Gourmet Paneer Tikka Tacos & Saffron Infused Lychee Lassi Shots',
    decorTheme: 'Soft Pastel Pinks & Ivory White Orchids with Neon Accents',
    quoteAuthor: 'Kriti (The Bride)',
    quoteText: 'We wanted a fusion theme that was light and modern, yet retained traditional roots. UtsavBites nailed the pastel aesthetic! The edible marigold garnishes on drinks were absolute genius.',
    description: 'A high-contrast contemporary evening featuring minimalist structural decor, gourmet traditional-fusion finger foods, and a vibrant indoor dance floor.',
    detailedCaseStudy: {
      story: 'Kriti and Raghav requested a cozy, sleek gathering for 250 close tech-industry friends. We designed a fusion menu blending Indian spice profiles with global street food presentations, all set against a backdrop of soft warm fairy lights and white lilies.',
      timeline: [
        { time: '18:30 IST', ritual: 'Sun-set cocktail hour with fusion appetizer pairing' },
        { time: '20:00 IST', ritual: 'Neon stage sangeet dance ring & live acoustic singer' },
        { time: '22:00 IST', ritual: 'International salad bar meets artisanal sweets buffet' },
        { time: '23:30 IST', ritual: 'Lantern release and celebratory traditional wishes token' }
      ],
      chefSpecial: [
        'Achar Paneer mini-quesadillas with raw mango relish',
        'Avocado & Sweet Potato spicy chaat with pomegranate seeds',
        'Deconstructed Rasgulla cups with sweet almond rabdi base',
        'Minty Lime and Tender Coconut water mocktails'
      ],
      invitationTheme: 'Digital interactive video invite with custom classical-lofi fusion soundtrack',
      decorationSecrets: [
        'Minimalist circular metal arches layered with ivory orchid blossoms',
        'Flickering wax-less LED candles on all glass table tops',
        'Custom neon logo of the couple framed by lush green eucalyptus leaves'
      ]
    }
  }
];

export const PortfolioPage: React.FC<{ onNavigate: (page: string, data?: any) => void }> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(PORTFOLIO_DATA[0]);
  const [searchWord, setSearchWord] = useState<string>('');

  // Categories mapping list
  const categories = ['All', 'Royal Palace', 'Mithila Heritage', 'Contemporary', 'Corporate Festive'];

  const filteredItems = PORTFOLIO_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchWord.toLowerCase()) ||
      item.celebrants.toLowerCase().includes(searchWord.toLowerCase()) ||
      item.location.toLowerCase().includes(searchWord.toLowerCase()) ||
      item.decorTheme.toLowerCase().includes(searchWord.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-stone-50 dark:bg-stone-900 text-stone-850 dark:text-stone-100 min-h-screen pb-20 relative text-left" id="portfolio-page-root">
      <MarigoldToran />

      {/* AESTHETIC DECORATIVE BACKGROUND RANGLI */}
      <div className="absolute top-24 right-4 opacity-5 pointer-events-none select-none">
        <RangoliMandala className="w-96 h-96" />
      </div>

      {/* HEADER HERO CONTENT */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-[#C51C13] rounded-3xl p-6 sm:p-12 text-white shadow-xl relative overflow-hidden border-b-4 border-[#FFCB44]">
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none select-none">
            <span className="text-[200px]">🏮</span>
          </div>

          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="px-3 py-1 text-[10px] font-black tracking-widest bg-[#FFCB44] text-red-950 rounded-full uppercase font-mono">
                AURA PORTFOLIO
              </span>
              <span className="text-xs text-amber-300 font-extrabold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Proven Traditional Legacy
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-sans leading-tight">
              A Gallery of Golden <br />Traditional Memories
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 max-w-3xl font-medium leading-relaxed">
              Explore how we have designed high-fidelity weddings, intimate vermala rituals, and large-scale satvik community feasts in Noida, Delhi, and Gurugram. Every picture represents a real family milestone we coordinated, managed, and executed to absolute perfection.
            </p>
          </div>
        </div>
      </div>

      {/* CORE STATS BANNER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="portfolio-stats-banner">
          
          <div className="bg-white dark:bg-stone-850 p-4 rounded-2xl border border-orange-100/40 dark:border-stone-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-[#C51C13] dark:text-orange-400 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 fill-[#C51C13] dark:fill-orange-400" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black block leading-none font-mono text-[#C51C13]">150+</span>
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Weddings Managed</span>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-850 p-4 rounded-2xl border border-orange-100/40 dark:border-stone-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-[#C51C13] dark:text-orange-400 flex items-center justify-center shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black block leading-none font-mono text-[#C51C13]">22k+</span>
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Satvik Bowls Served</span>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-850 p-4 rounded-2xl border border-orange-100/40 dark:border-stone-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-[#C51C13] dark:text-orange-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black block leading-none font-mono text-[#C51C13]">4.92</span>
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Pure Veg Score</span>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-850 p-4 rounded-2xl border border-orange-100/40 dark:border-stone-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-[#C51C13] dark:text-orange-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black block leading-none font-mono text-[#C51C13]">120+</span>
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Vetted Top Vendors</span>
            </div>
          </div>

        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white dark:bg-stone-850 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4" id="portfolio-filters-wrapper">
          
          {/* Keyword Search */}
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Search by celebrity name or theme..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#C51C13]"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
          </div>

          {/* Interactive Categories selector */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto justify-start md:justify-end">
            <span className="text-xs text-stone-400 font-bold self-center mr-1 hidden sm:inline uppercase tracking-normal">
              Filter Style:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  // Default select first item matching category
                  const found = PORTFOLIO_DATA.find(i => cat === 'All' || i.category === cat);
                  if (found) setSelectedItem(found);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#C51C13] text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* TWO COLUMN GRID LAYOUT */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 grid lg:grid-cols-12 gap-8 text-left">
        
        {/* LEFT COLUMN: FILTERED PORTFOLIO PREVIEW CARDS */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-black uppercase text-stone-400 tracking-widest pl-1 font-mono">
            III. Past Celebration Milestones ({filteredItems.length})
          </h3>

          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const itemIsSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`group rounded-3xl border text-left cursor-pointer transition-all bg-white dark:bg-stone-850 overflow-hidden relative ${
                    itemIsSelected
                      ? 'border-[#C51C13] ring-1 ring-[#C51C13]/40 shadow-md scale-[1.01]'
                      : 'border-stone-150 dark:border-stone-800 hover:border-orange-200 hover:shadow-md'
                  }`}
                  id={`portfolio-card-${item.id}`}
                >
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Floating badge for category */}
                    <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-[#FFCB44] text-[9px] font-black tracking-wider uppercase px-2.5 py-1 rounded-lg">
                      {item.category}
                    </span>

                    {/* Guest Count sticker right-bottom */}
                    <span className="absolute bottom-3 right-3 bg-white/95 text-stone-950 font-bold font-mono text-[10px] px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#C51C13]" />
                      <span>{item.guestCount} Guests</span>
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 space-y-2">
                    <div className="flex items-center gap-1 text-stone-400 text-[10px]">
                      <MapPin className="w-3 h-3 text-[#C51C13]" />
                      <span>{item.location}</span>
                    </div>

                    <h4 className="font-extrabold text-[#C51C13] dark:text-orange-400 text-sm sm:text-base leading-tight uppercase">
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-stone-500 leading-relaxed font-semibold">
                      {item.description}
                    </p>

                    <div className="flex justify-between items-center pt-3 border-t border-dashed dark:border-stone-800 text-[10px] text-stone-400 font-mono">
                      <span>Celebrants: <b>{item.celebrants}</b></span>
                      <span className="text-[#C51C13] hover:underline flex items-center font-bold">
                        Read Case Analysis &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="p-12 text-center text-xs text-stone-400 border border-dashed rounded-3xl bg-white dark:bg-stone-850">
                <Image className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                <b>No events match your criteria</b>
                <p className="max-w-xs mx-auto mt-1">Try resetting filters to show other corporate or wedding themes.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE SELECTION CASE DRILLDOWN STUDY */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <CaseStudyDetails selectedItem={selectedItem} onNavigate={onNavigate} />
          </AnimatePresence>
        </div>
      </div>

      {/* COMPACT DECORATIVE BOTTOM GALLERY BANNER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-[#FFFDF7] dark:bg-stone-850 p-6 sm:p-8 rounded-3xl border border-orange-150/40 dark:border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6" id="portfolio-planning-cta">
          <div className="text-left space-y-2 max-w-2xl">
            <h3 className="serif text-xl sm:text-2xl font-black text-[#C51C13] dark:text-orange-400 uppercase leading-none">
              Plan Your Marriage Ceremony Custom
            </h3>
            <p className="text-xs sm:text-xs text-stone-500 font-semibold leading-relaxed">
              Activate the built-in <b>Utsav Mithila Planner Suite</b> in the Admin Center. Set up dynamic guest tables, map out bartender inventory, check pure vegetarian festive catering menus, and generate your live RSVP pages.
            </p>
          </div>

          <button
            onClick={() => {
              alert('Redirecting to the Admin Center. Switch to "Admin Center" using the navbar button at top level to open Mithila Setup Planner, manage live wedding timelines, adjust satvik menu options, and register user profiles!');
            }}
            className="w-full md:w-auto px-6 py-3 bg-[#C51C13] hover:bg-orange-750 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow hover:scale-[1.02] cursor-pointer"
          >
            Go To Admin Center Setup
          </button>
        </div>
      </div>

    </div>
  );
};
