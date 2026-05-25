import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Home, Gift, Check, Search, Calendar, Phone, Activity } from 'lucide-react';

interface Guest {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  familyCount: number; // Accompanying members
  contact: string;
  group: 'Bride Family' | 'Groom Family' | 'Local Villagers' | 'VIP Relatives' | 'Mutual Friends';
  rsvpStatus: 'Confirmed' | 'Pending' | 'Declined';
  roomAllocated: string; // e.g. Room 101, VIP Heritage Suite, Family Hall, Standard Ac
  returnGiftItem: string; // e.g. Brass Coin, Silk Saree, Mithai Box, Silver Diya
  returnGiftStatus: 'Pending' | 'Assigned' | 'Gifted';
  notes: string;
}

const DEFAULT_GUESTS: Guest[] = [
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
  },
  {
    id: 'gst-4',
    name: 'Shree Mukhiya Ji (Village Chief)',
    gender: 'Male',
    age: 64,
    familyCount: 5,
    contact: '+91 99001 22334',
    group: 'Local Villagers',
    rsvpStatus: 'Confirmed',
    roomAllocated: 'Local Guest Transit Cottage',
    returnGiftItem: 'Brass Puja Thali & Sweets',
    returnGiftStatus: 'Assigned',
    notes: 'Honorable local dignitary. Arrange main stage flower welcoming.'
  }
];

export const PlannerGuests: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem('utsav_planner_guests');
    return saved ? JSON.parse(saved) : DEFAULT_GUESTS;
  });

  // Local uninvited estimate storage
  const [estUninvitedVillagers, setEstUninvitedVillagers] = useState<number>(() => {
    const saved = localStorage.getItem('utsav_planner_est_villagers');
    return saved ? parseInt(saved, 10) : 120;
  });
  const [estUninvitedRelatives, setEstUninvitedRelatives] = useState<number>(() => {
    const saved = localStorage.getItem('utsav_planner_est_relatives');
    return saved ? parseInt(saved, 10) : 45;
  });

  // Searching & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState('All');
  const [filterRsvp, setFilterRsvp] = useState('All');

  // Input States for New Guest Form
  const [gName, setGName] = useState('');
  const [gGender, setGGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [gAge, setGAge] = useState('30');
  const [gFamily, setGFamily] = useState('1');
  const [gContact, setGContact] = useState('');
  const [gGroup, setGGroup] = useState<'Bride Family' | 'Groom Family' | 'Local Villagers' | 'VIP Relatives' | 'Mutual Friends'>('Bride Family');
  const [gRsvp, setGRsvp] = useState<'Confirmed' | 'Pending' | 'Declined'>('Confirmed');
  const [gRoom, setGRoom] = useState('');
  const [gGift, setGGift] = useState('Classic Mithai Box');
  const [gGiftStatus, setGGiftStatus] = useState<'Pending' | 'Assigned' | 'Gifted'>('Pending');
  const [gNotes, setGNotes] = useState('');

  useEffect(() => {
    localStorage.setItem('utsav_planner_guests', JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem('utsav_planner_est_villagers', estUninvitedVillagers.toString());
  }, [estUninvitedVillagers]);

  useEffect(() => {
    localStorage.setItem('utsav_planner_est_relatives', estUninvitedRelatives.toString());
  }, [estUninvitedRelatives]);

  // Form submit
  const handleAddGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gName || !gContact) return;

    const newGst: Guest = {
      id: `gst-${Date.now()}`,
      name: gName,
      gender: gGender,
      age: parseInt(gAge, 10) || 30,
      familyCount: parseInt(gFamily, 10) || 0,
      contact: gContact,
      group: gGroup,
      rsvpStatus: gRsvp,
      roomAllocated: gRoom || 'Unallocated Room',
      returnGiftItem: gGift,
      returnGiftStatus: gGiftStatus,
      notes: gNotes
    };

    setGuests([newGst, ...guests]);
    // Reset inputs
    setGName('');
    setGContact('');
    setGRoom('');
    setGNotes('');
  };

  // Direct actions helpers
  const handleToggleRsvp = (id: string, nextStatus: 'Confirmed' | 'Pending' | 'Declined') => {
    setGuests(guests.map(g => g.id === id ? { ...g, rsvpStatus: nextStatus } : g));
  };

  const handleUpdateGiftStatus = (id: string, status: 'Pending' | 'Assigned' | 'Gifted') => {
    setGuests(guests.map(g => g.id === id ? { ...g, returnGiftStatus: status } : g));
  };

  const handleUpdateRoom = (id: string, room: string) => {
    setGuests(guests.map(g => g.id === id ? { ...g, roomAllocated: room } : g));
  };

  const handleDeleteGuest = (id: string) => {
    setGuests(guests.filter(g => g.id !== id));
  };

  // DASHBOARD CALCULATIONS
  const totalGuestsInIndex = guests.length;
  const confirmedMainGuests = guests.filter(g => g.rsvpStatus === 'Confirmed');
  const confirmedMainCount = confirmedMainGuests.length;
  
  // Accompanying family count for confirmed guests
  const confirmedFamilySum = confirmedMainGuests.reduce((acc, g) => acc + g.familyCount, 0);
  
  // Confirmed total (registered head counts)
  const confirmedTotalHeadCount = confirmedMainCount + confirmedFamilySum;

  const pendingMainCount = guests.filter(g => g.rsvpStatus === 'Pending').length;
  const pendingFamilySum = guests.filter(g => g.rsvpStatus === 'Pending').reduce((acc, g) => acc + g.familyCount, 0);
  const pendingTotalHeadCount = pendingMainCount + pendingFamilySum;

  // Uninvited local guests estimate
  const totalUninvitedEst = estUninvitedVillagers + estUninvitedRelatives;

  // Expected headcount on peak events
  const peakExpectedHeadcount = confirmedTotalHeadCount + totalUninvitedEst;

  // Filter lists
  const filteredGuestsList = guests.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.contact.includes(searchQuery) || 
                          g.roomAllocated.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = filterGroup === 'All' || g.group === filterGroup;
    const matchesRsvp = filterRsvp === 'All' || g.rsvpStatus === filterRsvp;
    return matchesSearch && matchesGroup && matchesRsvp;
  });

  return (
    <div className="space-y-8 pb-12" id="planner-guests-root">
      
      {/* Dynamic Summary Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="guests-stats-dashboard">
        {/* Card 1: Main Headcount summary */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm text-left flex items-center gap-4">
          <div className="p-3 bg-orange-100 dark:bg-orange-500/10 rounded-xl text-orange-600 dark:text-orange-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Confirmed Headcount</span>
            <h3 className="text-xl font-black text-stone-900 dark:text-white leading-none mt-1">
              {confirmedTotalHeadCount} <span className="text-xs font-normal text-stone-500">({confirmedMainCount} main + {confirmedFamilySum} fam)</span>
            </h3>
            <span className="text-[9px] text-green-600 font-bold font-mono uppercase mt-0.5 block flex items-center gap-1">
              🟢 RSVP Confirmed
            </span>
          </div>
        </div>

        {/* Card 2: Pending Confirmations */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm text-left flex items-center gap-4">
          <div className="p-3 bg-orange-100 dark:bg-orange-500/10 rounded-xl text-orange-655">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Pending Confirmation</span>
            <h3 className="text-xl font-black text-stone-900 dark:text-white leading-none mt-1">
              {pendingTotalHeadCount} <span className="text-xs font-normal text-stone-500">({pendingMainCount} main + {pendingFamilySum} fam)</span>
            </h3>
            <span className="text-[9px] text-orange-600 font-bold font-mono uppercase mt-0.5 block">
              🟡 Followups Needed
            </span>
          </div>
        </div>

        {/* Card 3: Uninvited & Village Estimates */}
        <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm text-left flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Uninvited Estimates</span>
            <b className="font-mono text-xs text-orange-600">{totalUninvitedEst} Guests</b>
          </div>
          {/* Quick inline counters */}
          <div className="grid grid-cols-2 gap-2 text-[9px] font-bold">
            <div className="bg-stone-50 dark:bg-stone-900 p-1.5 rounded border border-stone-200/50">
              <span className="text-stone-400 uppercase tracking-widest block mb-1">Local Villagers</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setEstUninvitedVillagers(Math.max(0, estUninvitedVillagers - 10))} className="px-1 bg-stone-200 rounded text-stone-750">-10</button>
                <span className="text-xs text-stone-800 dark:text-white">{estUninvitedVillagers}</span>
                <button onClick={() => setEstUninvitedVillagers(estUninvitedVillagers + 10)} className="px-1 bg-stone-200 rounded text-stone-750">+10</button>
              </div>
            </div>
            <div className="bg-stone-50 dark:bg-stone-900 p-1.5 rounded border border-stone-200/50">
              <span className="text-stone-400 uppercase tracking-widest block mb-1">Local Relatives</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setEstUninvitedRelatives(Math.max(0, estUninvitedRelatives - 5))} className="px-1 bg-stone-200 rounded text-stone-750">-5</button>
                <span className="text-xs text-stone-800 dark:text-white">{estUninvitedRelatives}</span>
                <button onClick={() => setEstUninvitedRelatives(estUninvitedRelatives + 5)} className="px-1 bg-stone-200 rounded text-stone-750">+5</button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Total Expected Headcount (PEAK) */}
        <div className="bg-gradient-to-tr from-[#C51C13] to-orange-600 text-white p-5 rounded-2xl shadow-md text-left flex items-center gap-4 relative overflow-hidden">
          <div className="absolute right-[-10px] bottom-[-10px] text-white/5 font-black text-7xl select-none">
            📯
          </div>
          <div className="p-3 bg-white/20 rounded-xl z-10">
            <Activity className="w-6 h-6 text-orange-200" />
          </div>
          <div className="z-10">
            <span className="text-[10px] uppercase tracking-wider text-orange-200 font-black block">Expected Headcount Peak</span>
            <h3 className="text-2xl font-black leading-none mt-1">
              {peakExpectedHeadcount}
            </h3>
            <span className="text-[9px] text-stone-100 font-mono italic mt-1 block">
              *Sum of fully Confirmed + Uninvited estimates
            </span>
          </div>
        </div>
      </div>

      {/* Guest day-wise expectation chart simulation */}
      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-4 shadow-sm text-left">
        <h4 className="text-xs font-black uppercase text-stone-400 tracking-wider mb-2.5">ESTIMATED TOTAL HEADCOUNT BY EVENT DAY</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-100 dark:border-stone-700">
            <span className="font-extrabold text-stone-500 uppercase block">Event Day 1 (Mehndi & Sangeet)</span>
            <div className="flex justify-between items-baseline mt-2">
              <b className="text-lg font-black text-rose-700 dark:text-rose-400">{Math.round((confirmedTotalHeadCount * 0.7) + (totalUninvitedEst * 0.3))} Adults</b>
              <span className="text-[10px] font-mono text-stone-400">~70% confirmed attending</span>
            </div>
          </div>
          <div className="p-3 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-100 dark:border-stone-700">
            <span className="font-extrabold text-stone-500 uppercase block">Event Day 2 (Varmala & Shadi)</span>
            <div className="flex justify-between items-baseline mt-2">
              <b className="text-lg font-black text-orange-700 dark:text-orange-400">{peakExpectedHeadcount} Adults</b>
              <span className="text-[10px] font-mono text-stone-400">🔥 Peak Capacity Load</span>
            </div>
          </div>
          <div className="p-3 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-100 dark:border-stone-700">
            <span className="font-extrabold text-stone-500 uppercase block">Event Day 3 (Feast Reception)</span>
            <div className="flex justify-between items-baseline mt-2">
              <b className="text-lg font-black text-amber-700 dark:text-amber-400">{Math.round((confirmedTotalHeadCount * 1.0) + (totalUninvitedEst * 0.8))} Adults</b>
              <span className="text-[10px] font-mono text-stone-400">High local villager turnouts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main interface: Add Guest Form vs Searchable Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Guest Addition panel on left */}
        <div className="lg:col-span-1 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm text-left">
          <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white pb-3 border-b border-stone-100 dark:border-stone-700 flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-orange-600" />
            <span>Add Guest Details</span>
          </h3>

          <form onSubmit={handleAddGuestSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Primary Guest Name</label>
              <input
                type="text"
                placeholder="Name"
                value={gName}
                onChange={e => setGName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Gender</label>
                <select
                  value={gGender}
                  onChange={e => setGGender(e.target.value as any)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 dark:text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Age</label>
                <input
                  type="number"
                  placeholder="e.g. 30"
                  value={gAge}
                  onChange={e => setGAge(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Accompanying Fam</label>
                <input
                  type="number"
                  placeholder="Accompanying"
                  value={gFamily}
                  onChange={e => setGFamily(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Affiliation Group</label>
                <select
                  value={gGroup}
                  onChange={e => setGGroup(e.target.value as any)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                >
                  <option value="Bride Family">Bride Side</option>
                  <option value="Groom Family">Groom Side</option>
                  <option value="Local Villagers">Villagers</option>
                  <option value="VIP Relatives">VIP Relatives</option>
                  <option value="Mutual Friends">Friends</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Contact Details</label>
              <input
                type="text"
                placeholder="Phone No"
                value={gContact}
                onChange={e => setGContact(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Status on RSVP</label>
              <select
                value={gRsvp}
                onChange={e => setGRsvp(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending followup</option>
                <option value="Declined">Declined / Out-of-Country</option>
              </select>
            </div>

            {/* Accommodation fields integrated right here! */}
            <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 space-y-2">
              <span className="text-[9px] uppercase font-mono font-bold text-amber-700 block">Accommodation Assignment</span>
              <div>
                <b className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">Room Allocation</b>
                <input
                  type="text"
                  placeholder="e.g. Suite 204, Family Dorm A"
                  value={gRoom}
                  onChange={e => setGRoom(e.target.value)}
                  className="w-full px-2 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-[11px] rounded"
                />
              </div>
            </div>

            {/* Gift Assignment fields integrated */}
            <div className="p-3 bg-rose-500/5 rounded-xl border border-rose-500/10 space-y-2">
              <span className="text-[9px] uppercase font-mono font-bold text-rose-700 block">Return Gift Planner</span>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <b className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">Gift Item Assigned</b>
                  <input
                    type="text"
                    value={gGift}
                    onChange={e => setGGift(e.target.value)}
                    className="w-full px-2 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-[11px] rounded"
                  />
                </div>
                <div>
                  <b className="block text-[9px] text-stone-500 font-bold uppercase mb-0.5">Status of Gift</b>
                  <select
                    value={gGiftStatus}
                    onChange={e => setGGiftStatus(e.target.value as any)}
                    className="w-full px-2 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-[11px] rounded"
                  >
                    <option value="Pending">Pending Assigning</option>
                    <option value="Assigned">Procured & Assigned</option>
                    <option value="Gifted">Handed Over 🎉</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Host Special Instructions</label>
              <textarea
                placeholder="Dietary rules or VIP greeting notes..."
                value={gNotes}
                onChange={e => setGNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Record & Map Guest</span>
            </button>
          </form>
        </div>

        {/* Guest Directory table list on right */}
        <div className="lg:col-span-3 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-4 text-left">
          
          {/* Header Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-light-100 pb-4">
            <div>
              <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white">Utsav Guest Registry Directory</h3>
              <p className="text-[11px] text-stone-400 mt-0.5">Filter, track RSVP responses, allocate rooms, and check off return gifts in real-time.</p>
            </div>
            
            {/* Search Box */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search by name, room or contact..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border dark:border-stone-700 focus:ring-1 focus:ring-orange-600 focus:outline-none bg-stone-50 dark:bg-stone-900 dark:text-white"
              />
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-455" />
            </div>
          </div>

          {/* Filtering Dropdowns */}
          <div className="flex gap-2.5 flex-wrap">
            <button
              onClick={() => setFilterGroup('All')}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                filterGroup === 'All'
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-stone-5 dark:bg-stone-900 text-stone-500 dark:text-stone-300 hover:bg-stone-100 dark:border-stone-700'
              }`}
            >
              All Groups ({guests.length})
            </button>
            {['Bride Family', 'Groom Family', 'Local Villagers', 'VIP Relatives', 'Mutual Friends'].map((grp) => (
              <button
                key={grp}
                onClick={() => setFilterGroup(grp)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                  filterGroup === grp
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-stone-5 dark:bg-stone-900 text-stone-500 dark:text-stone-300 hover:bg-stone-100 dark:border-stone-700'
                }`}
              >
                {grp === 'Bride Family' ? 'Bride Side' : grp === 'Groom Family' ? 'Groom Side' : grp} ({guests.filter(g => g.group === grp).length})
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-450 self-center">RSVP:</span>
            {['All', 'Confirmed', 'Pending', 'Declined'].map((rsvp) => (
              <button
                key={rsvp}
                onClick={() => setFilterRsvp(rsvp)}
                className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                  filterRsvp === rsvp
                    ? 'bg-orange-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-900 text-stone-400 hover:text-stone-600'
                }`}
              >
                {rsvp} ({rsvp === 'All' ? guests.length : guests.filter(g => g.rsvpStatus === rsvp).length})
              </button>
            ))}
          </div>

          {/* Table list */}
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-left border-collapse text-stone-900 dark:text-stone-100">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-900 text-[10px] uppercase font-bold tracking-wider text-stone-500 border-b border-stone-200 dark:border-stone-700">
                  <th className="p-3">Guest / Group</th>
                  <th className="p-3">Contact Detail</th>
                  <th className="p-3">Family Size</th>
                  <th className="p-3">RSVP Status</th>
                  <th className="p-3 font-mono">Room Allocation</th>
                  <th className="p-3 font-mono">Return Gift Assignment</th>
                  <th className="p-3 text-center">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-150 dark:divide-stone-700 text-xs">
                {filteredGuestsList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-stone-400 font-bold uppercase tracking-widest">
                      No guests match filters in root index.
                    </td>
                  </tr>
                ) : (
                  filteredGuestsList.map((g) => (
                    <tr key={g.id} className="hover:bg-orange-500/5 transition-colors">
                      {/* Guest and Group detail */}
                      <td className="p-3">
                        <div>
                          <b className="text-stone-950 dark:text-white block font-extrabold">{g.name}</b>
                          <span className="text-[9px] font-mono uppercase bg-orange-655/10 text-orange-655 font-bold px-1 rounded block w-max mt-0.5">
                            {g.group === 'Bride Family' ? 'Bride Side' : g.group === 'Groom Family' ? 'Groom Side' : g.group}
                          </span>
                        </div>
                      </td>

                      {/* Contact & Gender */}
                      <td className="p-3">
                        <span className="block font-mono text-[11px]">{g.contact}</span>
                        <span className="text-[10px] text-stone-400 font-bold">{g.age} yrs / {g.gender}</span>
                      </td>

                      {/* Family size */}
                      <td className="p-3 font-mono text-center">
                        <span className="px-2 py-0.5 font-black text-xs rounded bg-stone-100 border border-stone-200 font-bold dark:bg-stone-900 dark:border-stone-700">
                          +{g.familyCount}
                        </span>
                      </td>

                      {/* RSVP Status dropdown directly editable */}
                      <td className="p-3">
                        <select
                          value={g.rsvpStatus}
                          onChange={(e) => handleToggleRsvp(g.id, e.target.value as any)}
                          className={`text-[10px] font-black uppercase tracking-wider rounded px-2 py-0.5 border ${
                            g.rsvpStatus === 'Confirmed'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                              : g.rsvpStatus === 'Pending'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-600'
                              : 'bg-red-500/10 border-red-500/30 text-red-600'
                          }`}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Pending">Pending</option>
                          <option value="Declined">Declined</option>
                        </select>
                      </td>

                      {/* Room Allocated dynamically typed */}
                      <td className="p-3">
                        <div className="flex gap-1 items-center">
                          <Home className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <input
                            type="text"
                            value={g.roomAllocated}
                            onChange={(e) => handleUpdateRoom(g.id, e.target.value)}
                            className="bg-transparent text-[11px] border-b border-transparent hover:border-stone-200 focus:border-orange-500 focus:outline-none w-full font-mono text-stone-700 dark:text-stone-300"
                            placeholder="Set suite room"
                          />
                        </div>
                      </td>

                      {/* Return Gift Item and status */}
                      <td className="p-3">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold block truncate max-w-[150px]">{g.returnGiftItem}</span>
                          <select
                            value={g.returnGiftStatus}
                            onChange={(e) => handleUpdateGiftStatus(g.id, e.target.value as any)}
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              g.returnGiftStatus === 'Gifted'
                                ? 'bg-emerald-500 text-white'
                                : g.returnGiftStatus === 'Assigned'
                                ? 'bg-amber-500 text-stone-950'
                                : 'bg-stone-200 text-stone-500 dark:bg-stone-900'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Assigned">Assigned</option>
                            <option value="Gifted">Gifted</option>
                          </select>
                        </div>
                      </td>

                      {/* Delete button */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeleteGuest(g.id)}
                          className="p-1 hover:bg-stone-100 dark:hover:bg-stone-905 text-stone-400 hover:text-red-500 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
