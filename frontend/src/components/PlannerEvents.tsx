import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Clock, MapPin, Sparkles, AlertCircle } from 'lucide-react';

interface Ritual {
  id: string;
  name: string;
  description: string;
  duration: string;
  subEventId: string; // mapped sub-event (can be empty / 'unmapped')
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

// Pre-seeded Indian Festive/Wedding Data
const DEFAULT_EVENTS: WeddingEvent[] = [
  { id: 'evt-1', name: 'Grand Shadi Festival (Main Ceremony)', date: '2026-11-12', description: 'The main wedding event with royal traditional themes.', isActive: true },
  { id: 'evt-2', name: 'Pre-wedding Sangeet & Mehndi', date: '2026-11-10', description: 'Shadi opening cultural feast, choreography dances, and henna setup.', isActive: false },
];

const DEFAULT_SUB_EVENTS: SubEvent[] = [
  { id: 'sub-1', name: 'Baraat Swagat Welcome', time: '17:30', venue: 'Grand Entrance Gateway, Sector 56', notes: 'Rose petal shower arrangement and dhol players sync.' },
  { id: 'sub-2', name: 'Mehndi Evening Bazaar', time: '16:00', venue: 'Courtyard Lawn & Gazebo', notes: 'Saffron tea and dry fruits sweet tables operational.' },
  { id: 'sub-3', name: 'Sangeet Stage Performances', time: '20:00', venue: 'Rooftop Palace Hall', notes: 'Ensure sound check for traditional Maithili geet and folk choreography.' },
];

const DEFAULT_RITUALS: Ritual[] = [
  { id: 'rit-1', name: 'Dwar Puja Ceremony', description: 'Groom greeting ritual at the main entrance gate with Vedic shlokas.', duration: '45 mins', subEventId: 'sub-1' },
  { id: 'rit-2', name: 'Gauri Puja & Haldi', description: 'Pre-wedding haldi pasting ceremonies with close family members.', duration: '2 hours', subEventId: 'unmapped' },
  { id: 'rit-3', name: 'Jaimala Varmala exchange', description: 'Pristine floral garlands exchange on the central amphitheater stage.', duration: '30 mins', subEventId: 'sub-3' },
];

export const PlannerEvents: React.FC = () => {
  const [events, setEvents] = useState<WeddingEvent[]>(() => {
    const saved = localStorage.getItem('utsav_planner_events');
    return saved ? JSON.parse(saved) : DEFAULT_EVENTS;
  });

  const [subEvents, setSubEvents] = useState<SubEvent[]>(() => {
    const saved = localStorage.getItem('utsav_planner_sub_events');
    return saved ? JSON.parse(saved) : DEFAULT_SUB_EVENTS;
  });

  const [rituals, setRituals] = useState<Ritual[]>(() => {
    const saved = localStorage.getItem('utsav_planner_rituals');
    return saved ? JSON.parse(saved) : DEFAULT_RITUALS;
  });

  // Event states
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');

  // Sub-event states
  const [newSubName, setNewSubName] = useState('');
  const [newSubTime, setNewSubTime] = useState('');
  const [newSubVenue, setNewSubVenue] = useState('');
  const [newSubNotes, setNewSubNotes] = useState('');

  // Ritual states
  const [newRitName, setNewRitName] = useState('');
  const [newRitDesc, setNewRitDesc] = useState('');
  const [newRitDuration, setNewRitDuration] = useState('1 hour');
  const [newRitSubId, setNewRitSubId] = useState('unmapped');

  useEffect(() => {
    localStorage.setItem('utsav_planner_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('utsav_planner_sub_events', JSON.stringify(subEvents));
  }, [subEvents]);

  useEffect(() => {
    localStorage.setItem('utsav_planner_rituals', JSON.stringify(rituals));
  }, [rituals]);

  // Handle Event Add
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName || !newEventDate) return;
    const newEvt: WeddingEvent = {
      id: `evt-${Date.now()}`,
      name: newEventName,
      date: newEventDate,
      description: newEventDesc,
      isActive: events.length === 0,
    };
    setEvents([...events, newEvt]);
    setNewEventName('');
    setNewEventDate('');
    setNewEventDesc('');
  };

  // Toggle active event context
  const selectActiveEvent = (id: string) => {
    setEvents(events.map(e => ({ ...e, isActive: e.id === id })));
  };

  const handleDeleteEvent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEvents(events.filter(e => e.id !== id));
  };

  // Handle Sub-Event Add
  const handleAddSubEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName || !newSubTime || !newSubVenue) return;
    const newSub: SubEvent = {
      id: `sub-${Date.now()}`,
      name: newSubName,
      time: newSubTime,
      venue: newSubVenue,
      notes: newSubNotes,
    };
    setSubEvents([...subEvents, newSub]);
    setNewSubName('');
    setNewSubTime('');
    setNewSubVenue('');
    setNewSubNotes('');
  };

  const handleDeleteSubEvent = (id: string) => {
    setSubEvents(subEvents.filter(s => s.id !== id));
    // Reset mapped rituals
    setRituals(rituals.map(rit => rit.subEventId === id ? { ...rit, subEventId: 'unmapped' } : rit));
  };

  // Handle Ritual Add
  const handleAddRitual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRitName) return;
    const newRit: Ritual = {
      id: `rit-${Date.now()}`,
      name: newRitName,
      description: newRitDesc,
      duration: newRitDuration,
      subEventId: newRitSubId,
    };
    setRituals([...rituals, newRit]);
    setNewRitName('');
    setNewRitDesc('');
    setNewRitDuration('1 hour');
    setNewRitSubId('unmapped');
  };

  // Map Ritual to specific sub-event later
  const handleUpdateRitualMapping = (ritId: string, subId: string) => {
    setRituals(rituals.map(rit => rit.id === ritId ? { ...rit, subEventId: subId } : rit));
  };

  const handleDeleteRitual = (id: string) => {
    setRituals(rituals.filter(r => r.id !== id));
  };

  const activeEventName = events.find(e => e.isActive)?.name || 'Generic Festive Event';

  return (
    <div className="space-y-8 pb-12" id="planner-events-root">
      {/* Decorative Ribbon Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none text-9xl">
          🏮
        </div>
        <div className="z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
              Utsav Organizer Mode
            </span>
            <div className="flex items-center gap-1 text-orange-200">
              <Sparkles className="w-3 h-3 animate-spin" />
              <span className="text-[10px] uppercase tracking-wider font-mono">Traditional Vedic Align</span>
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight uppercase">Event & Rituals Coordinator</h1>
          <p className="text-stone-100 text-xs mt-1 max-w-xl">
            Design your main festival theme, register key sub-events, and outline complex traditional ceremonies mapped accurately to timelines.
          </p>
        </div>
        
        {/* Active Context */}
        <div className="bg-stone-900/40 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-2xl text-left shrink-0">
          <span className="text-[9px] uppercase tracking-wider text-orange-200 block font-mono font-bold">Currently Managing</span>
          <b className="text-sm font-bold block truncate max-w-[200px] text-white">
            {activeEventName}
          </b>
        </div>
      </div>

      {/* Grid of Event Creation & Event Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Write Event Forms */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-6">
          <h2 className="text-sm font-black uppercase text-stone-900 dark:text-white pb-3 border-b border-stone-100 dark:border-stone-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-600" />
            <span>Create Master Event</span>
          </h2>

          <form onSubmit={handleAddEvent} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">Event Name</label>
              <input
                type="text"
                placeholder="e.g. Traditional Wedding Ceremonies"
                value={newEventName}
                onChange={e => setNewEventName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 focus:ring-1 focus:ring-orange-600 focus:outline-none bg-stone-50 dark:bg-stone-900 dark:text-white"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">Execution Date</label>
                <input
                  type="date"
                  value={newEventDate}
                  onChange={e => setNewEventDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 focus:ring-1 focus:ring-orange-600 focus:outline-none bg-stone-50 dark:bg-stone-900 dark:text-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">Brief Description / Objective</label>
              <textarea
                placeholder="Describe key logistics or visual cues..."
                value={newEventDesc}
                onChange={e => setNewEventDesc(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 focus:ring-1 focus:ring-orange-600 focus:outline-none bg-stone-50 dark:bg-stone-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Register Event</span>
            </button>
          </form>
        </div>

        {/* Master Directory List */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-black uppercase text-stone-900 dark:text-white pb-3 border-b border-stone-100 dark:border-stone-700 mb-4">
              Registered Master Events
            </h2>

            {events.length === 0 ? (
              <div className="text-center py-12 text-stone-400">
                <AlertCircle className="w-8 h-8 mx-auto text-orange-650 opacity-60 mb-2" />
                <p className="text-xs font-bold">No active events registered.</p>
                <p className="text-[10px]">Prepare a master template using the left form.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => selectActiveEvent(evt.id)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      evt.isActive
                        ? 'border-orange-500 bg-orange-500/5 dark:bg-orange-500/10'
                        : 'border-stone-200 dark:border-stone-700 hover:border-orange-500 hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-stone-900 dark:text-white">{evt.name}</h3>
                          {evt.isActive && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] bg-emerald-500 text-white font-black uppercase tracking-wider font-mono">
                              ACTIVE CONTEXT
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">{evt.description || 'No description provided.'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-orange-600/10 text-orange-655 font-mono text-xs font-bold shrink-0">
                          {evt.date}
                        </span>
                        <button
                          onClick={(e) => handleDeleteEvent(evt.id, e)}
                          className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-stone-105"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700 text-[11px] text-stone-400 italic">
            💡 Selecting an event updates the focus scope for sub-events and guest planning metrics dynamically.
          </div>
        </div>
      </div>

      {/* Sub-Events section & Ritual coordination */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-stone-200 dark:border-stone-700/60 pt-8">
        
        {/* Sub-Events Manager */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-stone-100 dark:border-stone-700">
            <h2 className="text-sm font-black uppercase text-stone-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>Sub-Events & Timelines</span>
            </h2>
            <span className="font-mono text-[9px] px-2 py-0.5 bg-orange-600/10 text-orange-600 font-bold rounded-full">
              {subEvents.length} Active Tracks
            </span>
          </div>

          {/* Form to add sub-event */}
          <form onSubmit={handleAddSubEvent} className="p-4 bg-stone-50 dark:bg-stone-900/50 rounded-xl space-y-3.5">
            <span className="text-[10px] uppercase font-mono font-bold text-orange-600 block">Stage New Sub-Event Timeline</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Sub-event name (e.g., Baraat, Sangeet)"
                  value={newSubName}
                  onChange={e => setNewSubName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-1 focus:ring-orange-600 text-stone-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <input
                  type="time"
                  value={newSubTime}
                  onChange={e => setNewSubTime(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-1 focus:ring-orange-600 text-stone-900 dark:text-white"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Specify venue or hall area"
                value={newSubVenue}
                onChange={e => setNewSubVenue(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-1 focus:ring-orange-600 text-stone-900 dark:text-white"
                required
              />
              <input
                type="text"
                placeholder="Logistics Notes (catering, decorators review)"
                value={newSubNotes}
                onChange={e => setNewSubNotes(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-1 focus:ring-orange-600 text-stone-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="py-1.5 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold uppercase transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Sub-Event</span>
            </button>
          </form>

          {/* List sub-events */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {subEvents.length === 0 ? (
              <p className="text-center text-stone-400 py-6 text-xs font-bold">No sub-events planned yet.</p>
            ) : (
              subEvents.map((sub) => (
                <div key={sub.id} className="p-3 rounded-xl border border-stone-200 dark:border-stone-700/80 hover:bg-stone-50/50 flex items-start justify-between gap-4">
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <b className="text-xs text-stone-900 dark:text-white uppercase font-black tracking-tight">{sub.name}</b>
                      <span className="font-mono text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.2 rounded font-bold flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {sub.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-stone-500 mt-1">
                      <MapPin className="w-3 h-3 text-orange-600" />
                      <span>{sub.venue}</span>
                    </div>
                    {sub.notes && (
                      <p className="text-[10px] text-stone-400 font-mono mt-0.5 italic">Note: {sub.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteSubEvent(sub.id)}
                    className="p-1 hover:bg-stone-100 text-stone-400 hover:text-red-500 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Rituals & Ceremonies Management */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-stone-100 dark:border-stone-700">
            <h2 className="text-sm font-black uppercase text-stone-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600 animate-pulse" />
              <span>Rituals & Traditional Ceremonies</span>
            </h2>
            <span className="font-mono text-[9px] px-2 py-0.5 bg-orange-600/10 text-orange-600 font-bold rounded-full">
              {rituals.length} Total
            </span>
          </div>

          {/* Form to add rituals */}
          <form onSubmit={handleAddRitual} className="p-4 bg-stone-50 dark:bg-stone-900/50 rounded-xl space-y-3.5">
            <span className="text-[10px] uppercase font-mono font-bold text-orange-600 block">Register Vedic Ritual / Puja</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Ritual / Ceremony name"
                value={newRitName}
                onChange={e => setNewRitName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-1 focus:ring-orange-600 text-stone-900 dark:text-white"
                required
              />
              <select
                value={newRitDuration}
                onChange={e => setNewRitDuration(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-1 focus:ring-orange-600 text-stone-900 dark:text-white font-bold"
              >
                <option value="30 mins">30 minutes</option>
                <option value="45 mins">45 minutes</option>
                <option value="1 hour">1 hour</option>
                <option value="1.5 hours">1.5 hours</option>
                <option value="2 hours">2 hours</option>
                <option value="3 hours+">3 hours +</option>
              </select>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Short ceremony details or items required"
                value={newRitDesc}
                onChange={e => setNewRitDesc(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-1 focus:ring-orange-600 text-stone-900 dark:text-white"
              />
              <div>
                <label className="block text-[9px] uppercase font-bold text-stone-500 mb-1">Map to Sub-Event (Now or Later)</label>
                <select
                  value={newRitSubId}
                  onChange={e => setNewRitSubId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-1 focus:ring-orange-600 text-stone-900 dark:text-white font-mono"
                >
                  <option value="unmapped">⏳ Keep Unmapped (Standard rituals shelf)</option>
                  {subEvents.map(sub => (
                    <option key={sub.id} value={sub.id}>📅 {sub.name} (at {sub.time})</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="py-1.5 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold uppercase transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Ritual</span>
            </button>
          </form>

          {/* List of rituals with dynamic mapping capability */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {rituals.length === 0 ? (
              <p className="text-center text-stone-400 py-6 text-xs font-bold">No rituals registered yet.</p>
            ) : (
              rituals.map((rit) => {
                const mappedSub = subEvents.find(s => s.id === rit.subEventId);
                return (
                  <div key={rit.id} className="p-3 rounded-xl border border-stone-200 dark:border-stone-700/80 hover:bg-stone-50/50 flex flex-col justify-between gap-2 text-left">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <b className="text-xs text-orange-600 uppercase font-black tracking-tight">{rit.name}</b>
                          <span className="font-mono text-[9px] bg-stone-100 dark:bg-stone-900 px-1.5 py-0.2 rounded text-stone-600 dark:text-stone-400">
                             ⏱️ {rit.duration}
                          </span>
                        </div>
                        {rit.description && (
                          <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">{rit.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteRitual(rit.id)}
                        className="p-1 hover:bg-stone-100 text-stone-400 hover:text-red-500 rounded shrink-0 self-start"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Mapping Select Dropdown */}
                    <div className="mt-1 flex items-center justify-between gap-2 bg-stone-50 dark:bg-stone-900/60 p-2 rounded-lg">
                      <span className="text-[9px] uppercase font-bold text-stone-400">Sub-Event Sync:</span>
                      <select
                        value={rit.subEventId}
                        onChange={e => handleUpdateRitualMapping(rit.id, e.target.value)}
                        className="text-[10px] bg-white dark:bg-stone-800 border dark:border-stone-700 rounded px-1.5 py-0.5 max-w-[170px] font-mono text-stone-800 dark:text-stone-200"
                      >
                        <option value="unmapped">Unmapped (Vedic Shelf)</option>
                        {subEvents.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
