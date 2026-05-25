import React, { useState, useEffect } from 'react';
import { Gift, Plus, Trash2, Calendar, Sparkles, IndianRupee, Award, AlertCircle } from 'lucide-react';

interface ChumanGift {
  id: string;
  guestName: string;
  type: 'Cash' | 'Physical Item';
  amountOrValue: number; // Value of cash or physical item
  itemName?: string;      // Physical item descriptors (e.g., Gold Coin)
  date: string;
  notes: string;
}

const DEFAULT_CHUMAN_ENTRIES: ChumanGift[] = [
  { id: 'chu-1', guestName: 'Pandey Jha Ji (Mama Ji)', type: 'Cash', amountOrValue: 11000, date: '2026-11-12', notes: 'Given as central Shadi blessings during the main Vedika ceremony.' },
  { id: 'chu-2', guestName: 'Shree Mukhiya Ji (Village Chief)', type: 'Physical Item', amountOrValue: 7500, itemName: 'Brass Puja Thali & Saffron Shawl', date: '2026-11-12', notes: 'Grand greeting gift presented on stage.' },
  { id: 'chu-3', guestName: 'Kumari Arati Jha', type: 'Cash', amountOrValue: 5100, date: '2026-11-10', notes: 'Presented during pre-wedding Sangeet and Aarti.' },
  { id: 'chu-4', guestName: 'Suresh Chandra Mishra', type: 'Physical Item', amountOrValue: 15000, itemName: '24K Gold Plated Silver Coin (50g)', date: '2026-11-12', notes: 'Treasured family collection gift.' }
];

export const PlannerChuman: React.FC = () => {
  const [chumanList, setChumanList] = useState<ChumanGift[]>(() => {
    const saved = localStorage.getItem('utsav_planner_chuman');
    return saved ? JSON.parse(saved) : DEFAULT_CHUMAN_ENTRIES;
  });

  // Filter type selection
  const [activeFilter, setActiveFilter] = useState<'All' | 'Cash' | 'Physical Item'>('All');

  // Inputs
  const [cName, setCName] = useState('');
  const [cType, setCType] = useState<'Cash' | 'Physical Item'>('Cash');
  const [cValue, setCValue] = useState('');
  const [cItemName, setCItemName] = useState('');
  const [cDate, setCDate] = useState('');
  const [cNotes, setCNotes] = useState('');

  useEffect(() => {
    localStorage.setItem('utsav_planner_chuman', JSON.stringify(chumanList));
  }, [chumanList]);

  const handleAddChumanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName || !cValue) return;

    const newGift: ChumanGift = {
      id: `chu-${Date.now()}`,
      guestName: cName,
      type: cType,
      amountOrValue: parseFloat(cValue) || 0,
      itemName: cType === 'Physical Item' ? (cItemName || 'Assorted Gift Box') : undefined,
      date: cDate || new Date().toISOString().split('T')[0],
      notes: cNotes
    };

    setChumanList([newGift, ...chumanList]);
    setCName('');
    setCValue('');
    setCItemName('');
    setCNotes('');
  };

  const handleDeleteChuman = (id: string) => {
    setChumanList(chumanList.filter(item => item.id !== id));
  };

  // CALCULATIONS
  const totalReceivedCombined = chumanList.reduce((acc, item) => acc + item.amountOrValue, 0);
  const totalCashGiftsSum = chumanList.filter(i => i.type === 'Cash').reduce((acc, i) => acc + i.amountOrValue, 0);
  const totalPhysicalEstimatedSum = chumanList.filter(i => i.type === 'Physical Item').reduce((acc, i) => acc + i.amountOrValue, 0);
  const cashEntriesCount = chumanList.filter(i => i.type === 'Cash').length;
  const physicalEntriesCount = chumanList.filter(i => i.type === 'Physical Item').length;

  const filteredChuman = chumanList.filter(item => {
    return activeFilter === 'All' || item.type === activeFilter;
  });

  return (
    <div className="space-y-8 pb-12" id="planner-chuman-root">
      
      {/* Visual top Ribbon with Maithili explanations */}
      <div className="bg-gradient-to-tr from-[#C51C13] to-orange-650 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none text-9xl">
          🌸
        </div>
        <div>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
            Traditional Mithila Gifting
          </span>
          <h1 className="text-2xl font-black uppercase mt-1 tracking-tight">Chuman Master Ledger (चुमन पंजी)</h1>
          <p className="text-stone-100 text-xs mt-1 max-w-xl">
            Record auspicious cash gifts (*Chuman* / *Shagun*) and register physical wedding gifts with estimated asset valuations to maintain precise family logs.
          </p>
        </div>
        <div className="bg-stone-900/40 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-2xl text-left shrink-0">
          <span className="text-[10px] uppercase font-mono font-bold text-orange-200">Auspicious Blessings Counter</span>
          <b className="text-xl font-bold block text-white mt-1">₹ {totalReceivedCombined.toLocaleString('en-IN')}</b>
        </div>
      </div>

      {/* Visual Aggregate Counters cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="chuman-aggregates">
        
        {/* Cash gifts ledger summary */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm text-left flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl text-emerald-600">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Cash Shagun Gifts (चुमन राशि)</span>
            <h3 className="text-xl font-black text-stone-900 dark:text-white mt-1 leading-none">
              ₹ {totalCashGiftsSum.toLocaleString('en-IN')}
            </h3>
            <span className="text-[9px] text-green-600 font-mono font-bold mt-1 uppercase block">
              💸 {cashEntriesCount} Cash envelopes logged
            </span>
          </div>
        </div>

        {/* Physical gifts ledger summary */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm text-left flex items-center gap-4">
          <div className="p-3 bg-rose-100 dark:bg-rose-500/10 rounded-xl text-rose-600">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Physical Gift Valuation</span>
            <h3 className="text-xl font-black text-stone-900 dark:text-white mt-1 leading-none">
              ₹ {totalPhysicalEstimatedSum.toLocaleString('en-IN')}
            </h3>
            <span className="text-[9px] text-orange-600 font-mono font-bold mt-1 uppercase block text-left">
              🎁 {physicalEntriesCount} Assets & ornaments recorded
            </span>
          </div>
        </div>

        {/* Traditional Diya summary info */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm text-left flex items-center gap-4">
          <div className="p-3 bg-orange-100 dark:bg-orange-500/10 rounded-xl text-orange-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Average Gift Multiplier</span>
            <h3 className="text-xl font-black text-stone-900 dark:text-white mt-1 leading-none">
              ₹ {chumanList.length > 0 ? Math.round(totalReceivedCombined / chumanList.length).toLocaleString('en-IN') : 0}
            </h3>
            <span className="text-[9px] text-stone-400 block font-mono mt-1">Per individual blessing entry</span>
          </div>
        </div>

      </div>

      {/* Adding Panel vs Table list layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LHS addition form */}
        <div className="lg:col-span-1 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm text-left">
          <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white pb-3 border-b border-light-100 flex items-center gap-2 mb-4">
            <Plus className="w-4 h-4 text-orange-600" />
            <span>Record Gift blessing</span>
          </h3>

          <form onSubmit={handleAddChumanSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Auspicious Giver (Guest Name)</label>
              <input
                type="text"
                placeholder="Name"
                value={cName}
                onChange={e => setCName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-600"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Gift Format Type</label>
              <select
                value={cType}
                onChange={e => setCType(e.target.value as any)}
                className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 text-stone-900 dark:text-white font-bold"
              >
                <option value="Cash">Cash Envelope (Envelope Shagun)</option>
                <option value="Physical Item">Physical Asset / Ornament / Saree</option>
              </select>
            </div>

            {cType === 'Physical Item' && (
              <div>
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Gift Item Name / Descriptors</label>
                <input
                  type="text"
                  placeholder="e.g. Gold Plated Silver Coin"
                  value={cItemName}
                  onChange={e => setCItemName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:ring-1"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">
                {cType === 'Cash' ? 'Auspicious Sum (₹ Cash Amount)' : 'Estimated Market Value (₹ Equivalent)'}
              </label>
              <input
                type="number"
                placeholder="₹ Value"
                value={cValue}
                onChange={e => setCValue(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Presented Date</label>
              <input
                type="date"
                value={cDate}
                onChange={e => setCDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Additional blessing / Custom Notes</label>
              <textarea
                placeholder="Details of families background or other descriptions..."
                value={cNotes}
                onChange={e => setCNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Record Blessing</span>
            </button>
          </form>
        </div>

        {/* RHS searchable listing and tracking table */}
        <div className="lg:col-span-3 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-4 text-left flex flex-col justify-between">
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b">
              <div>
                <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white">Chuman & Shagun Logs</h3>
                <p className="text-[11px] text-stone-400 mt-0.5">Categorized list index of all recorded auspicious gifts for ceremony record audit checks.</p>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2.5 pt-3">
              {(['All', 'Cash', 'Physical Item'] as const).map((fil) => (
                <button
                  key={fil}
                  onClick={() => setActiveFilter(fil)}
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all tracking-wider border ${
                    activeFilter === fil
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-stone-50 dark:bg-stone-900 text-stone-500 dark:text-stone-300 hover:bg-stone-105'
                  }`}
                >
                  {fil === 'All' ? 'Complete Envelopes' : fil} ({fil === 'All' ? chumanList.length : chumanList.filter(c => c.type === fil).length})
                </button>
              ))}
            </div>

            {/* Table registry list */}
            <div className="overflow-x-auto rounded-xl mt-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-900 text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200 dark:border-stone-700 font-mono">
                    <th className="p-3 text-left">Blessing Giver Name</th>
                    <th className="p-3 text-left">Gift Format Type</th>
                    <th className="p-3 text-left">Physical Descriptors description</th>
                    <th className="p-3 text-left">Recorded Date</th>
                    <th className="p-3 text-right">Envelope Valuation (₹)</th>
                    <th className="p-3 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-stone-150">
                  {filteredChuman.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-400 font-bold uppercase tracking-wider">
                        No recorded blessings found under this list filter.
                      </td>
                    </tr>
                  ) : (
                    filteredChuman.map((item) => (
                      <tr key={item.id} className="hover:bg-orange-500/5 transition-colors">
                        
                        {/* Name and notes */}
                        <td className="p-3 text-left">
                          <b className="text-stone-950 dark:text-white block font-extrabold">{item.guestName}</b>
                          {item.notes && <p className="text-[10px] text-stone-400 italic mt-0.5 font-mono">Note: {item.notes}</p>}
                        </td>

                        {/* Format */}
                        <td className="p-3 text-left">
                          <span className={`px-2 py-0.5 rounded text-[10px] tracking-wider uppercase font-black ${
                            item.type === 'Cash'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-orange-500/10 text-orange-600'
                          }`}>
                            {item.type}
                          </span>
                        </td>

                        {/* Description */}
                        <td className="p-3 text-left text-stone-500">
                          {item.itemName || '— Enveloped Cash Shagun —'}
                        </td>

                        {/* Date */}
                        <td className="p-3 text-stone-400 font-mono text-[11px]">
                          {item.date}
                        </td>

                        {/* Cost/Value */}
                        <td className="p-3 text-right font-bold text-stone-900 dark:text-white font-mono">
                          ₹ {item.amountOrValue.toLocaleString('en-IN')}
                        </td>

                        {/* Action erase */}
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteChuman(item.id)}
                            className="p-1 hover:bg-stone-100 text-stone-400 hover:text-red-500 rounded"
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

          <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700 text-[10px] text-stone-400 italic">
            <span>ℹ️ These listings represent traditional village wedding record booklets to assist reciprocal family gifting audits in future invitations.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
