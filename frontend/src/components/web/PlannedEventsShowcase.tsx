import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Check, Search, Plus, Clock, MapPin, Sparkles, X, ChevronRight, Gift, Heart, Utensils, BookOpen, MessageCircle } from 'lucide-react';
import { MarigoldToran, RangoliMandala, AnimatedDiya } from './GoldenDeco';

interface Guest {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  familyCount: number;
  contact: string;
  group: 'Bride Family' | 'Groom Family' | 'Local Villagers' | 'VIP Relatives' | 'Mutual Friends';
  rsvpStatus: 'Confirmed' | 'Pending' | 'Declined';
  roomAllocated: string;
  returnGiftItem: string;
  returnGiftStatus: 'Pending' | 'Assigned' | 'Gifted';
  notes: string;
}

interface Ritual {
  id: string;
  name: string;
  description: string;
  duration: string;
  subEventId: string;
}

interface SubEvent {
  id: string;
  name: string;
  time: string;
  venue: string;
  notes: string;
}

interface WeddingEvent {
  id: string;
  name: string;
  date: string;
  description: string;
  isActive: boolean;
}

// Fallback Seeds (to sync with Admin LocalStorage schemas)
const STATIC_FALLBACK_EVENTS: WeddingEvent[] = [
  { id: 'evt-1', name: 'Grand Shadi Festival (Main Ceremony)', date: '2026-11-12', description: 'The main wedding event with royal traditional golden themes.', isActive: true },
  { id: 'evt-2', name: 'Pre-wedding Sangeet & Mehndi Gala', date: '2026-11-10', description: 'Shadi opening cultural feast, choreography dances, and henna setup.', isActive: false },
  { id: 'evt-3', name: 'Dussehra Community Food Festival', date: '2026-10-25', description: 'Mass Satvik catering and traditional Mithila art bazaar.', isActive: false }
];

const STATIC_FALLBACK_SUB_EVENTS: SubEvent[] = [
  { id: 'sub-1', name: 'Baraat Swagat Welcome', time: '17:30', venue: 'Grand Entrance Gateway, Sector 56 Noida', notes: 'Rose petal shower arrangement and dhol players sync.' },
  { id: 'sub-2', name: 'Mehndi Evening Bazaar', time: '16:00', venue: 'Courtyard Lawn & Gazebo Garden', notes: 'Saffron tea and dry fruits sweet tables operational.' },
  { id: 'sub-3', name: 'Sangeet Stage Performances', time: '20:00', venue: 'Rooftop Palace Hall', notes: 'Ensure sound check for traditional Maithili geet and folk choreography.' }
];

const STATIC_FALLBACK_RITUALS: Ritual[] = [
  { id: 'rit-1', name: 'Dwar Puja Ceremony', description: 'Groom greeting ritual at the main entrance gate with Vedic shlokas.', duration: '45 mins', subEventId: 'sub-1' },
  { id: 'rit-2', name: 'Gauri Puja & Haldi paste', description: 'Pre-wedding haldi pasting ceremonies with close family members.', duration: '2 hours', subEventId: 'unmapped' },
  { id: 'rit-3', name: 'Jaimala Varmala Exchange', description: 'Pristine floral garlands exchange on the central amphitheater stage.', duration: '30 mins', subEventId: 'sub-3' }
];

const STATIC_FALLBACK_GUESTS: Guest[] = [
  {
    id: 'gst-1',
    name: 'Pandey Jha Ji (Mama Ji)',
    gender: 'Male',
    age: 58,
    familyCount: 4,
    contact: '+91 94312 87654',
    group: 'Bride Family',
    rsvpStatus: 'Confirmed',
    roomAllocated: 'VIP Palace Suite 101',
    returnGiftItem: 'Premium Silver Diya Set',
    returnGiftStatus: 'Assigned',
    notes: 'Requires ground floor accommodations; pure satvik fasting meals.'
  },
  {
    id: 'gst-2',
    name: 'Sushant Kumar Mishra',
    gender: 'Male',
    age: 32,
    familyCount: 2,
    contact: '+91 88776 55443',
    group: 'Groom Family',
    rsvpStatus: 'Confirmed',
    roomAllocated: 'Heritage Room 104',
    returnGiftItem: 'Classic Mithai Box',
    returnGiftStatus: 'Gifted',
    notes: 'Driver accompanying; needs separate driver dome spacing.'
  },
  {
    id: 'gst-3',
    name: 'Apeksha Roy',
    gender: 'Female',
    age: 26,
    familyCount: 0,
    contact: '+91 74012 32156',
    group: 'Mutual Friends',
    rsvpStatus: 'Pending',
    roomAllocated: 'De-lux Quad 202',
    returnGiftItem: 'Silk Handloom Stole',
    returnGiftStatus: 'Pending',
    notes: 'Sangeet stage presenter; check microphone config on arrival.'
  }
];

export const PlannedEventsShowcase: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  // Bind React States to LocalStorage so changes in admin reflect here instantly
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [subEvents, setSubEvents] = useState<SubEvent[]>([]);
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);

  // Selected event drilldown state
  const [selectedEvent, setSelectedEvent] = useState<WeddingEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabFilter, setActiveTabFilter] = useState<'All' | 'Upcoming' | 'Past'>('All');

  // Dynamic Countdown Timer
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // RSVP search and updates states
  const [rsvpSearch, setRsvpSearch] = useState('');
  const [foundGuest, setFoundGuest] = useState<Guest | null>(null);
  const [rsvpMsg, setRsvpMsg] = useState('');
  
  // Quick RSVP register self
  const [showSelfRegForm, setShowSelfRegForm] = useState(false);
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regGroup, setRegGroup] = useState<Guest['group']>('Mutual Friends');

  // Fetch / Sync databases on load
  const loadDatabase = () => {
    const savedEvents = localStorage.getItem('utsav_planner_events');
    const savedSubs = localStorage.getItem('utsav_planner_sub_events');
    const savedRituals = localStorage.getItem('utsav_planner_rituals');
    const savedGuests = localStorage.getItem('utsav_planner_guests');

    const loadedEvts = savedEvents ? JSON.parse(savedEvents) : STATIC_FALLBACK_EVENTS;
    const loadedSubs = savedSubs ? JSON.parse(savedSubs) : STATIC_FALLBACK_SUB_EVENTS;
    const loadedRits = savedRituals ? JSON.parse(savedRituals) : STATIC_FALLBACK_RITUALS;
    const loadedGsts = savedGuests ? JSON.parse(savedGuests) : STATIC_FALLBACK_GUESTS;

    setEvents(loadedEvts);
    setSubEvents(loadedSubs);
    setRituals(loadedRits);
    setGuests(loadedGsts);

    // Default expand the first active event or any event
    if (loadedEvts.length > 0) {
      const activeObj = loadedEvts.find((e: WeddingEvent) => e.isActive) || loadedEvts[0];
      setSelectedEvent(activeObj);
    }
  };

  useEffect(() => {
    loadDatabase();
    // Refresh listener in case Admin updates tabs in same window frame
    window.addEventListener('storage', loadDatabase);
    return () => window.removeEventListener('storage', loadDatabase);
  }, []);

  // Compute countdown to the nearest upcoming event
  useEffect(() => {
    const timer = setInterval(() => {
      if (events.length === 0) return;
      
      // Get upcoming event
      const upcoming = events
        .filter(e => new Date(e.date).getTime() > Date.now())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] || events[0];

      if (!upcoming) return;

      const targetTime = new Date(upcoming.date + 'T17:00:00').getTime();
      const diff = targetTime - Date.now();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [events]);

  // Handle Guest RSVP lookup
  const handleRsvpSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpSearch.trim()) return;

    const query = rsvpSearch.toLowerCase().trim();
    const guestMatch = guests.find(g => g.name.toLowerCase().includes(query) || g.contact.includes(query));

    if (guestMatch) {
      setFoundGuest(guestMatch);
      setRsvpMsg('');
    } else {
      setFoundGuest(null);
      setRsvpMsg('No guest invitation record found with that name. Register your presence below!');
    }
  };

  // Confirm RSVP
  const handleToggleConfRsvp = (guestId: string, status: Guest['rsvpStatus']) => {
    const updated = guests.map(g => {
      if (g.id === guestId) {
        return { ...g, rsvpStatus: status };
      }
      return g;
    });

    setGuests(updated);
    localStorage.setItem('utsav_planner_guests', JSON.stringify(updated));
    
    // Update active visual matching state
    if (foundGuest && foundGuest.id === guestId) {
      setFoundGuest({ ...foundGuest, rsvpStatus: status });
    }

    setRsvpMsg(`Shree RSVP index updated! Your presence status stands updated as "${status}" successfully.`);
  };

  // Self guest registration
  const handleSelfRegisterGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    const newGuest: Guest = {
      id: `gst-${Date.now()}`,
      name: regName.trim(),
      gender: 'Other',
      age: 28,
      familyCount: 1,
      contact: regPhone || 'N/A',
      group: regGroup,
      rsvpStatus: 'Confirmed',
      roomAllocated: 'Lotus Village Transit Block',
      returnGiftItem: 'Sacred Mithila Art Frame',
      returnGiftStatus: 'Assigned',
      notes: 'Self-registered guest well-wisher via public celebrations timeline.'
    };

    const updated = [...guests, newGuest];
    setGuests(updated);
    localStorage.setItem('utsav_planner_guests', JSON.stringify(updated));

    setFoundGuest(newGuest);
    setSearchQuery('');
    setRegName('');
    setRegPhone('');
    setShowSelfRegForm(false);
    setRsvpMsg(`Aura Welcome! You have been successfully registered under the "${regGroup}" cluster.`);
  };

  // Filter events based on criteria
  const filteredEvents = events.filter(e => {
    const isUpcoming = new Date(e.date).getTime() >= Date.now() - 24 * 60 * 60 * 1000;
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTabFilter === 'Upcoming') {
      return matchesSearch && isUpcoming;
    } else if (activeTabFilter === 'Past') {
      return matchesSearch && !isUpcoming;
    }
    return matchesSearch;
  });

  const nextUpcomingEvent = events
    .filter(e => new Date(e.date).getTime() > Date.now())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] || events[0];

  return (
    <div className="bg-stone-50 dark:bg-stone-900 text-stone-850 dark:text-stone-100 min-h-screen pb-16 relative" id="planned-events-showcase">
      <MarigoldToran />
      
      {/* 1. SECTION HEADER: TRADITIONAL BANNER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-gradient-to-r from-red-800 via-[#C51C13] to-orange-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden text-left border-y-4 border-[#FFCB44]">
          <div className="absolute right-0 bottom-0 opacity-15 leading-none pointer-events-none select-none text-9xl">
            🏵️
          </div>
          
          <div className="relative z-10 space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-[10px] font-black tracking-widest bg-[#FFCB44] text-red-950 rounded-full uppercase">
                UTSAV GUEST DIARY
              </span>
              <span className="text-xs text-orange-200 font-mono tracking-widest uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FFCB44]" />
                Live Celebration Registry
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase leading-tight font-sans">
              Traditional Celebrations <br className="hidden sm:inline" />Planned on Utsav
            </h1>
            
            <p className="text-xs sm:text-sm text-stone-100 font-medium">
              Browse marriages, traditional Sangeet nights, community feasts, and ritual programs planned securely in Noida, Delhi NCR, and Bihar regions. Verify your guest cards, look up room numbers, and inspect culinary menus.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 grid lg:grid-cols-12 gap-8 text-left">
        
        {/* LEFT SIDEBAR: LIST OF EVENTS AND INTEGRATED RSVP SEARCH */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* A. INTEGRATED COUNTDOWN WIDGET */}
          {nextUpcomingEvent && (
            <div className="bg-orange-50/70 dark:bg-stone-850 p-6 rounded-3xl border border-orange-200/50 dark:border-stone-800 shadow-md relative overflow-hidden">
              <div className="absolute top-2 right-2 opacity-10">
                <RangoliMandala className="w-24 h-24" />
              </div>
              <div className="relative z-10 text-stone-900 dark:text-white">
                <span className="text-[10px] font-bold text-orange-600 block uppercase font-mono tracking-widest">
                  Next Mega Celebration
                </span>
                <h4 className="text-base font-black truncate mt-1">
                  {nextUpcomingEvent.name}
                </h4>
                <p className="text-[11px] text-stone-500 font-medium">{nextUpcomingEvent.date} (5:00 PM onwards)</p>
                
                {/* Visual clock timers */}
                <div className="grid grid-cols-4 gap-2 mt-4 font-mono font-bold text-center">
                  <div className="bg-[#C51C13] text-white p-2 rounded-xl">
                    <span className="block text-lg font-black">{countdown.days}</span>
                    <span className="text-[9px] uppercase tracking-wider text-orange-100 font-semibold font-sans">Days</span>
                  </div>
                  <div className="bg-[#C51C13] text-white p-2 rounded-xl">
                    <span className="block text-lg font-black">{countdown.hours}</span>
                    <span className="text-[9px] uppercase tracking-wider text-orange-100 font-semibold font-sans">Hrs</span>
                  </div>
                  <div className="bg-[#C51C13] text-white p-2 rounded-xl">
                    <span className="block text-lg font-black">{countdown.minutes}</span>
                    <span className="text-[9px] uppercase tracking-wider text-orange-100 font-semibold font-sans">Mins</span>
                  </div>
                  <div className="bg-[#C51C13] text-white p-2 rounded-xl">
                    <span className="block text-lg font-black">{countdown.seconds}</span>
                    <span className="text-[9px] uppercase tracking-wider text-orange-100 font-semibold font-sans">Secs</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* B. LIST FINDER & FILTERS */}
          <div className="bg-white dark:bg-stone-850 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-stone-950 dark:text-white uppercase flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C51C13]" />
              <span>Registered Celebrations ({filteredEvents.length})</span>
            </h3>

            {/* Tabs toggle */}
            <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl gap-1 text-xs">
              {(['All', 'Upcoming', 'Past'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTabFilter(tab)}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-colors cursor-pointer ${
                    activeTabFilter === tab 
                      ? 'bg-white dark:bg-stone-900 text-[#C51C13] dark:text-orange-400 shadow-sm scale-[1.01]' 
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Keyword finder */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search events by keyword theme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-stone-50 dark:bg-stone-900 border-stone-250 dark:border-stone-850 text-stone-900 dark:text-white focus:outline-none"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
            </div>

            {/* Main Events List */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredEvents.map(evt => {
                const isSelected = selectedEvent?.id === evt.id;
                const isUpcomingStr = new Date(evt.date).getTime() >= Date.now() - 24 * 60 * 60 * 1000;
                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#C51C13] bg-orange-50/30 dark:bg-orange-950/15'
                        : 'border-stone-150 dark:border-stone-800 hover:bg-stone-50/50 dark:hover:bg-stone-800/40'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        isUpcomingStr ? 'bg-emerald-100 text-emerald-805' : 'bg-stone-200 text-stone-605'
                      }`}>
                        {isUpcomingStr ? 'Upcoming' : 'Concluded'}
                      </span>
                      <b className="text-[10px] text-stone-400 font-mono">{evt.date}</b>
                    </div>
                    
                    <h4 className="font-extrabold text-[#C51C13] dark:text-orange-400 text-xs sm:text-sm mt-1">
                      {evt.name}
                    </h4>
                    
                    <p className="text-[11px] text-stone-500 line-clamp-2 mt-1">
                      {evt.description}
                    </p>
                  </div>
                );
              })}

              {filteredEvents.length === 0 && (
                <div className="p-8 text-center text-xs text-stone-400 border border-dashed rounded-2xl">
                  No weddings or campaigns match these filters. Use the Mithila Suite in Admin mode to outline a celebration!
                </div>
              )}
            </div>
          </div>

          {/* C. INTERACTIVE RSVP INTEGRATED SERVICE */}
          <div className="bg-white dark:bg-stone-850 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-md space-y-4 text-neutral-800 dark:text-stone-100 block">
            <h3 className="text-sm font-black text-[#C51C13] dark:text-orange-400 uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-600" />
              <span>RSVP & Seating Suite</span>
            </h3>
            <p className="text-[11px] text-stone-400">
              Assigned guest room or suite locations, return gifts indices, and RSVP confirmation logs. Look up your card index below.
            </p>

            <form onSubmit={handleRsvpSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Mishra or Pandey Jha..."
                value={rsvpSearch}
                onChange={(e) => setRsvpSearch(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border rounded-xl dark:border-stone-750 dark:bg-stone-900 text-stone-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#C51C13] hover:bg-orange-700 text-white font-bold text-xs rounded-xl whitespace-nowrap cursor-pointer transition-colors"
              >
                Find Invitation
              </button>
            </form>

            <AnimatePresence mode="wait">
              {foundGuest ? (
                <motion.div
                  key={foundGuest.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-orange-600/5 dark:bg-orange-950/10 border border-orange-200 rounded-2xl space-y-3"
                >
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <span className="text-[9px] uppercase font-mono font-bold text-stone-400">Invitation Verified</span>
                      <b className="block text-sm font-black text-stone-905 dark:text-white">{foundGuest.name}</b>
                      <p className="text-[10px] text-stone-500 font-mono">Cluster: {foundGuest.group}</p>
                    </div>
                    
                    <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${
                      foundGuest.rsvpStatus === 'Confirmed' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : foundGuest.rsvpStatus === 'Declined' 
                        ? 'bg-rose-100 text-rose-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {foundGuest.rsvpStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs border-y py-2.5 my-2 border-orange-100/50 dark:border-stone-800">
                    <div>
                      <span className="text-[9px] text-stone-400 block font-mono">Allocated Lodging</span>
                      <b className="text-[#C51C13] dark:text-orange-400">{foundGuest.roomAllocated || 'Standard Transit Complex'}</b>
                    </div>
                    <div>
                      <span className="text-[9px] text-stone-400 block font-mono">Mithila Return Token</span>
                      <b>{foundGuest.returnGiftItem || 'Classic Sweets'}</b>
                    </div>
                  </div>

                  {foundGuest.notes && (
                    <p className="text-[11px] text-stone-500 italic bg-stone-50 dark:bg-stone-905/30 p-2 rounded-lg">
                      Note: {foundGuest.notes}
                    </p>
                  )}

                  <div className="flex gap-2 pt-1 font-bold text-[10px]">
                    <button
                      onClick={() => handleToggleConfRsvp(foundGuest.id, 'Confirmed')}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
                    >
                      ✓ Confirm Presence
                    </button>
                    <button
                      onClick={() => handleToggleConfRsvp(foundGuest.id, 'Declined')}
                      className="flex-1 py-1.5 bg-stone-105 hover:bg-stone-200 dark:bg-stone-800 text-stone-605 rounded-lg transition-colors cursor-pointer"
                    >
                      Declined
                    </button>
                  </div>
                </motion.div>
              ) : (
                !showSelfRegForm && (
                  <div className="p-4 border border-dashed rounded-2xl flex flex-col items-center justify-center text-center text-xs space-y-2">
                    <span className="text-2xl">🏮</span>
                    <p className="text-stone-400">Search your name above to see your details. Not in the pre-invited guest listings?</p>
                    <button
                      onClick={() => setShowSelfRegForm(true)}
                      className="text-xs text-[#C51C13] hover:underline font-extrabold cursor-pointer"
                    >
                      Self Register as Wedding Welcomer &rarr;
                    </button>
                  </div>
                )
              )}
            </AnimatePresence>

            {/* Self register sub-panel */}
            {showSelfRegForm && (
              <form onSubmit={handleSelfRegisterGuest} className="p-4 bg-stone-50 dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-850/50 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-center-inner">
                  <h4 className="text-xs font-black text-[#C51C13] uppercase">Self-registration Ledger</h4>
                  <button type="button" onClick={() => setShowSelfRegForm(false)} className="text-stone-400 text-xs">✕</button>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[9px] font-bold text-stone-400 uppercase font-mono block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra Pathak"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-2.5 py-1.5 border rounded-lg dark:border-stone-750 dark:bg-stone-800 text-stone-909 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-bold text-stone-400 uppercase font-mono block mb-1">Mobile Contact</label>
                      <input
                        type="tel"
                        placeholder="+91..."
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 border rounded-lg dark:border-stone-750 dark:bg-stone-800 text-stone-909"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-stone-400 uppercase font-mono block mb-1">Relation Group</label>
                      <select
                        value={regGroup}
                        onChange={(e) => setRegGroup(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 border rounded-lg dark:border-stone-750 dark:bg-stone-800 text-stone-909 bg-white text-stone-950 dark:text-white"
                      >
                        <option value="Bride Family">Bride Side</option>
                        <option value="Groom Family">Groom Side</option>
                        <option value="Local Villagers">Noida Locals</option>
                        <option value="Mutual Friends">Mutual Friends</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition shadow cursor-pointer"
                >
                  Verify and Add My Invitation Card
                </button>
              </form>
            )}

            {rsvpMsg && (
              <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-extrabold bg-emerald-100/30 p-2.5 border border-emerald-300 rounded-xl">
                ✨ {rsvpMsg}
              </p>
            )}
          </div>

        </div>

        {/* RIGHT MAIN BOX: CURRENT SELECTION BROADCAST TIMELINE & RITUALS */}
        <div className="lg:col-span-7 space-y-6">
          
          <AnimatePresence mode="wait">
            {selectedEvent ? (
              <motion.div
                key={selectedEvent.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-stone-850 p-6 sm:p-8 rounded-3xl border border-orange-100 dark:border-stone-800 shadow-lg space-y-6"
              >
                {/* Visual Header */}
                <div className="border-b pb-4 dark:border-stone-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-[#C51C13] dark:text-orange-400">
                      <Heart className="w-4 h-4 fill-current text-red-500 shrink-0" />
                      <span className="text-xs uppercase font-black font-mono tracking-widest">Aura Traditional Blueprint</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white uppercase tracking-tight mt-1">
                      {selectedEvent.name}
                    </h2>
                    <p className="text-stone-400 text-xs font-mono font-bold mt-1">
                      Target Ceremony Date: {selectedEvent.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 p-2 bg-rose-50 dark:bg-stone-900 rounded-xl border border-rose-100 dark:border-stone-850 leading-none shrink-0 text-left">
                    <span className="w-3 h-3 rounded-full bg-[#C51C13] block shrink-0 animate-ping" />
                    <div>
                      <b className="text-stone-900 dark:text-white block text-[10px] uppercase font-black font-mono">Live Broadcast</b>
                      <span className="text-[9px] text-stone-400">Synchronized (UTC)</span>
                    </div>
                  </div>
                </div>

                {/* Sub-description */}
                <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-300">
                  {selectedEvent.description}
                </p>

                {/* Rituals Subsection: Vedic Align */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2 dark:border-stone-800">
                    <h3 className="text-xs font-black uppercase font-mono tracking-widest text-stone-400">
                      I. Scheduled Vedic Ceremonies & Rituals
                    </h3>
                    <span className="text-[10px] bg-sky-50 dark:bg-sky-950/20 text-sky-700 px-2.5 py-0.5 rounded font-black font-mono">
                      Vedic Alignment
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Filter and render mapped traditional rituals */}
                    {rituals.map(rit => (
                      <div
                        key={rit.id}
                        className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border dark:border-stone-800 text-xs font-semibold flex flex-col justify-between hover:scale-[1.01] transition-transform"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <span className="text-[10px] font-mono text-orange-600 font-extrabold uppercase">
                              Duration: {rit.duration}
                            </span>
                            <span className="text-stone-300 font-bold">🏵️</span>
                          </div>
                          
                          <h4 className="text-[#C51C13] dark:text-orange-400 font-black text-sm mt-1 uppercase">
                            {rit.name}
                          </h4>
                          
                          <p className="text-stone-500 font-medium text-[11px] mt-1 line-clamp-2 leading-relaxed">
                            {rit.description}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t dark:border-stone-800 text-[10px] text-stone-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-555 text-emerald-500 shrink-0" />
                          <span>Status: Assured on site</span>
                        </div>
                      </div>
                    ))}

                    {rituals.length === 0 && (
                      <div className="sm:col-span-2 p-6 border border-dashed rounded-2xl text-center text-xs text-stone-400 select-none">
                        No ceremonies or traditional ritual stages declared yet for this celebration setup.
                      </div>
                    )}
                  </div>
                </div>

                {/* Timelines subsection */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase font-mono tracking-widest text-[#C51C13] border-b pb-2 dark:border-stone-800">
                    II. Swagat Entry & Timeline Milestones
                  </h3>

                  <div className="relative border-l-2 border-orange-200 dark:border-orange-950 pl-5 ml-2.5 space-y-6">
                    {subEvents.map((sub, sidx) => (
                      <div key={sub.id} className="relative group text-left">
                        {/* Bullet */}
                        <div className="absolute -left-[30px] top-1.5 w-4 h-4 bg-[#C51C13] dark:bg-orange-500 rounded-full border-2 border-white dark:border-stone-850 flex items-center justify-center text-white text-[8px] font-bold">
                          {sidx + 1}
                        </div>

                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h4 className="text-stone-900 dark:text-white font-extrabold text-sm uppercase">
                              {sub.name}
                            </h4>
                            <span className="text-xs font-black font-mono text-[#C51C13] dark:text-orange-400 uppercase flex items-center gap-1 shrink-0">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{sub.time} IST</span>
                            </span>
                          </div>

                          <p className="text-[11px] text-amber-900 dark:text-amber-400 font-bold flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span>Venue: {sub.venue}</span>
                          </p>

                          {sub.notes && (
                            <p className="text-stone-500 dark:text-stone-300 text-xs leading-relaxed mt-1 italic font-medium bg-stone-50 dark:bg-stone-900 p-2 border-l-2 border-red-500 rounded-r-lg">
                              Organizer notes: {sub.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {subEvents.length === 0 && (
                      <div className="p-4 text-center text-xs text-stone-400">
                        No sub-events timeline has been registered.
                      </div>
                    )}
                  </div>
                </div>

                {/* III. INTEGRATED CATERING CORER */}
                <div className="space-y-3 p-5 rounded-3xl bg-neutral-50 dark:bg-stone-900 border dark:border-orange-950 border-orange-100">
                  <div className="flex justify-between items-center border-b pb-2.5 mb-2.5 dark:border-stone-800">
                    <span className="text-xs font-black uppercase text-[#C51C13] dark:text-orange-400 flex items-center gap-1 font-mono">
                      <Utensils className="w-4 h-4" />
                      <span>Shahi Satvik Feast Catering</span>
                    </span>
                    <span className="text-[9px] bg-orange-100 text-orange-850 dark:bg-stone-800 dark:text-orange-300 font-mono px-2 py-0.5 rounded font-bold"> Pure Veg </span>
                  </div>

                  <p className="text-xs text-stone-500 leading-relaxed font-semibold">
                    This selection is paired with exclusive catering from local top-end joints like <b>Saffron Grand Thali & Kesaria Rasoi</b>. Expected delicacies include Saffron Kaju Katli, traditional Thali with Satvik ghee breads, and Cool Rose Elixirs.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2.5 border-t dark:border-stone-800 gap-3">
                    <span className="text-[10px] text-stone-400 font-bold">Interested in traditional food catering for your guests?</span>
                    <button
                      onClick={() => onNavigate('restaurants')}
                      className="px-3.5 py-1.5 bg-[#C51C13] hover:bg-orange-700 text-white font-heavy text-[10px] uppercase tracking-wider rounded-lg transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                    >
                      Browse Festive Menus
                    </button>
                  </div>
                </div>

                {/* IV. SWEET WISHES CARD */}
                <div className="border-t dark:border-stone-800 pt-5 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-stone-400">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse shrink-0" />
                    <span><b>50+ well wishers</b> verified logs</span>
                  </div>

                  <button
                    onClick={() => {
                      alert('Traditional Chuman wishes dispatched securely to Noida Utsav Registry ledger!');
                    }}
                    className="flex items-center gap-1 font-extrabold text-xs text-[#C51C13] hover:underline cursor-pointer"
                  >
                    <span>Send Traditional Wishes Token</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </motion.div>
            ) : (
              <div className="h-96 border border-dashed rounded-3xl flex flex-col items-center justify-center text-center text-xs text-stone-400 p-8">
                <AnimatedDiya className="w-16 h-16 opacity-30 mb-2" />
                <b>No active traditional weddings selected</b>
                <p className="max-w-xs mt-1">Select any planned event on the left list column to read timings and inspect timeline indices.</p>
              </div>
            )}
          </AnimatePresence>

          {/* QUICK PROSPECTUS INFO */}
          <div className="bg-gradient-to-tr from-[#C51C13]/10 to-transparent p-5 rounded-3xl border border-orange-100 dark:border-stone-800/80 text-left space-y-3">
            <h4 className="text-xs font-black uppercase text-stone-950 dark:text-white flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-[#C51C13]" />
              <span>Planning your own traditional ceremony?</span>
            </h4>
            <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
              Utsav Planner is designed by local pandas, wedding experts, and premium chefs from Banaras & Mithila region. Map your high-fidelity budgets, verify bartan inventories, hire premium catering suppliers, and deploy your custom-branded RSVP registry pages with a single click.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  alert('Opening Utsav Mithila planner setup. Switch to "Admin Center" using the navbar button to manage, add, or alter events live!');
                }}
                className="text-xs text-[#C51C13] dark:text-orange-400 font-black hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Outline event in Admin Suite</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
