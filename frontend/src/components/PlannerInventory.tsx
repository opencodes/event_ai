import React, { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Calendar, ClipboardList, CheckCircle, Flame, AlertCircle } from 'lucide-react';

interface MiscItem {
  id: string;
  name: string;
  quantity: number;
  source: string;
  cost: number;
  notes: string;
}

interface BartanUtensil {
  id: string;
  utensilName: string;
  quantity: number;
  dateTaken: string;
  source: string; // from whom taken
  status: 'Received' | 'Returned';
}

interface GasCylinder {
  id: string;
  vendor: string;
  quantity: number;
  price: number;
  dateReceived: string;
  paymentStatus: 'Paid' | 'Pending';
  returnStatus: 'Received Full' | 'Empty Returned';
}

const DEFAULT_MISC: MiscItem[] = [
  { id: 'misc-1', name: 'Decorative Marigold Toran strings (ext. pack)', quantity: 150, source: 'Local Phool Bazaar', cost: 4500, notes: 'Needed for gate garlands backup styling.' },
  { id: 'misc-2', name: 'Altar Puja Red Velvet spread clothing', quantity: 6, source: 'Mukhiya Textiles', cost: 2400, notes: 'For Vedika mandap setup.' }
];

const DEFAULT_BARTAN: BartanUtensil[] = [
  { id: 'bar-1', utensilName: 'Massive Patila Degchi (For Biryani slow-cook)', quantity: 4, dateTaken: '2026-11-09', source: 'Laljee Tent House', status: 'Received' },
  { id: 'bar-2', utensilName: 'Brass Halwai Karahi (Extra Large Sweet pots)', quantity: 3, dateTaken: '2026-11-08', source: 'Mukhiya Ji Guesthouse', status: 'Received' },
  { id: 'bar-3', utensilName: 'Decorative Brass Serving spoons & Thalis set', quantity: 120, dateTaken: '2026-11-09', source: 'Ramesh Renter Store', status: 'Returned' }
];

const DEFAULT_CYLINDERS: GasCylinder[] = [
  { id: 'cyl-1', vendor: 'HP Gas Agencies (Manoj Agency)', quantity: 8, price: 9200, dateReceived: '2026-11-09', paymentStatus: 'Paid', returnStatus: 'Received Full' },
  { id: 'cyl-2', vendor: 'Indane Gas Suppliers District Hub', quantity: 4, price: 4600, dateReceived: '2026-11-05', paymentStatus: 'Pending', returnStatus: 'Empty Returned' }
];

export const PlannerInventory: React.FC = () => {
  // Persistence states
  const [miscItems, setMiscItems] = useState<MiscItem[]>(() => {
    const saved = localStorage.getItem('utsav_planner_misc');
    return saved ? JSON.parse(saved) : DEFAULT_MISC;
  });

  const [bartans, setBartans] = useState<BartanUtensil[]>(() => {
    const saved = localStorage.getItem('utsav_planner_bartan');
    return saved ? JSON.parse(saved) : DEFAULT_BARTAN;
  });

  const [cylinders, setCylinders] = useState<GasCylinder[]>(() => {
    const saved = localStorage.getItem('utsav_planner_cylinders');
    return saved ? JSON.parse(saved) : DEFAULT_CYLINDERS;
  });

  // Active Sub Tab: 'misc' | 'bartan' | 'cylinder'
  const [activeTab, setActiveTab] = useState<'misc' | 'bartan' | 'cylinder'>('bartan');

  // Misc Form inputs
  const [mName, setMName] = useState('');
  const [mQty, setMQty] = useState('1');
  const [mSource, setMSource] = useState('');
  const [mCost, setMCost] = useState('');
  const [mNotes, setMNotes] = useState('');

  // Bartan form inputs
  const [bName, setBName] = useState('');
  const [bQty, setBQty] = useState('10');
  const [bDate, setBDate] = useState('');
  const [bSource, setBSource] = useState('');
  const [bStatus, setBStatus] = useState<'Received' | 'Returned'>('Received');

  // Cylinder form inputs
  const [cVendor, setCVendor] = useState('');
  const [cQty, setCQty] = useState('4');
  const [cPrice, setCPrice] = useState('');
  const [cDate, setCDate] = useState('');
  const [cPayStatus, setCPayStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [cReturn, setCReturn] = useState<'Received Full' | 'Empty Returned'>('Received Full');

  useEffect(() => {
    localStorage.setItem('utsav_planner_misc', JSON.stringify(miscItems));
  }, [miscItems]);

  useEffect(() => {
    localStorage.setItem('utsav_planner_bartan', JSON.stringify(bartans));
  }, [bartans]);

  useEffect(() => {
    localStorage.setItem('utsav_planner_cylinders', JSON.stringify(cylinders));
  }, [cylinders]);

  // Handle Misc Add
  const handleAddMisc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName || !mSource) return;

    const newItem: MiscItem = {
      id: `misc-${Date.now()}`,
      name: mName,
      quantity: parseInt(mQty, 10) || 1,
      source: mSource,
      cost: parseFloat(mCost) || 0,
      notes: mNotes
    };

    setMiscItems([...miscItems, newItem]);
    setMName('');
    setMQty('1');
    setMSource('');
    setMCost('');
    setMNotes('');
  };

  // Handle Bartan Add
  const handleAddBartan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bName || !bSource) return;

    const newBartan: BartanUtensil = {
      id: `bar-${Date.now()}`,
      utensilName: bName,
      quantity: parseInt(bQty, 10) || 1,
      dateTaken: bDate || new Date().toISOString().split('T')[0],
      source: bSource,
      status: bStatus
    };

    setBartans([...bartans, newBartan]);
    setBName('');
    setBQty('10');
    setBDate('');
    setBSource('');
  };

  // Handle Cylinder Add
  const handleAddCylinder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cVendor || !cPrice) return;

    const newCyl: GasCylinder = {
      id: `cyl-${Date.now()}`,
      vendor: cVendor,
      quantity: parseInt(cQty, 10) || 1,
      price: parseFloat(cPrice) || 0,
      dateReceived: cDate || new Date().toISOString().split('T')[0],
      paymentStatus: cPayStatus,
      returnStatus: cReturn
    };

    setCylinders([...cylinders, newCyl]);
    setCVendor('');
    setCQty('4');
    setCPrice('');
    setCDate('');
  };

  // Status Toggles
  const handleToggleBartanStatus = (id: string) => {
    setBartans(bartans.map(b => {
      if (b.id === id) {
        return { ...b, status: b.status === 'Received' ? 'Returned' : 'Received' };
      }
      return b;
    }));
  };

  const handleToggleCylinderReturn = (id: string) => {
    setCylinders(cylinders.map(c => {
      if (c.id === id) {
        return { ...c, returnStatus: c.returnStatus === 'Received Full' ? 'Empty Returned' : 'Received Full' };
      }
      return c;
    }));
  };

  const handleToggleCylinderPay = (id: string) => {
    setCylinders(cylinders.map(c => {
      if (c.id === id) {
        return { ...c, paymentStatus: c.paymentStatus === 'Paid' ? 'Pending' : 'Paid' };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-8 pb-12" id="planner-inventory-root">
      
      {/* Visual Navigation switcher sub-tabs */}
      <div className="flex bg-white dark:bg-stone-800 p-2 rounded-2xl border border-stone-200/60 dark:border-stone-700 max-w-lg mb-4 text-xs font-bold gap-2 select-none">
        <button
          onClick={() => setActiveTab('bartan')}
          className={`px-4 py-2.5 rounded-xl uppercase tracking-wider flex items-center gap-2 flex-grow transition-colors ${
            activeTab === 'bartan'
              ? 'bg-orange-600 text-white'
              : 'text-stone-500 hover:text-stone-900 bg-transparent'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Utensils (बरतन पंजी)</span>
        </button>
        <button
          onClick={() => setActiveTab('cylinder')}
          className={`px-4 py-2.5 rounded-xl uppercase tracking-wider flex items-center gap-2 flex-grow transition-colors ${
            activeTab === 'cylinder'
              ? 'bg-orange-600 text-white'
              : 'text-stone-500 hover:text-stone-900 bg-transparent'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Cylinders (गैस सिलेंडर)</span>
        </button>
        <button
          onClick={() => setActiveTab('misc')}
          className={`px-4 py-2.5 rounded-xl uppercase tracking-wider flex items-center gap-2 flex-grow transition-colors ${
            activeTab === 'misc'
              ? 'bg-orange-600 text-white'
              : 'text-stone-500 hover:text-stone-900 bg-transparent'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Misc Items (विविध)</span>
        </button>
      </div>

      {/* RENDER VIEW 1: UTENSILS / BARTAN */}
      {activeTab === 'bartan' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 text-left" id="bartan-inventory-tracker">
          
          {/* Form */}
          <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-4 font-sans h-max">
            <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white pb-3 border-b flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-orange-600" />
              <span>Record Rent Bartan</span>
            </h3>

            <form onSubmit={handleAddBartan} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Utensil / Plate Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Copper Patila 50KG capacity"
                  value={bName}
                  onChange={e => setBName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Quantity</label>
                  <input
                    type="number"
                    value={bQty}
                    onChange={e => setBQty(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Date taken</label>
                  <input
                    type="date"
                    value={bDate}
                    onChange={e => setBDate(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Source / Outfitter (From Whom)</label>
                <input
                  type="text"
                  placeholder="e.g. Saffron Tents & Supples Ltd"
                  value={bSource}
                  onChange={e => setBSource(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Operational Status</label>
                <select
                  value={bStatus}
                  onChange={e => setBStatus(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50"
                >
                  <option value="Received">Received & Active In Kitchen</option>
                  <option value="Returned">Cleaned & Returned in Full</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold uppercase transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Record Rent Entry</span>
              </button>
            </form>
          </div>

          {/* Directory */}
          <div className="lg:col-span-3 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white pb-3 border-b flex justify-between items-center">
              <span>Utensils & Rent Bartan Ledger Directory</span>
              <span className="text-[10px] font-mono text-orange-600">Total Lines: {bartans.length}</span>
            </h3>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-900 text-[10px] uppercase font-bold text-stone-500 border-b font-mono">
                    <th className="p-3">Utensil Particulars</th>
                    <th className="p-3 text-center">Rental Volume</th>
                    <th className="p-3">Sourced Rent Supplier</th>
                    <th className="p-3">Date Borrowed</th>
                    <th className="p-3 text-center">Status state</th>
                    <th className="p-3 text-center">Erase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150 text-xs text-stone-900 dark:text-stone-100">
                  {bartans.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-400 font-bold uppercase">No utensil registries active.</td>
                    </tr>
                  ) : (
                    bartans.map(b => (
                      <tr key={b.id} className="hover:bg-orange-500/5 transition-colors">
                        <td className="p-3">
                          <b className="text-stone-950 dark:text-white font-extrabold">{b.utensilName}</b>
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-orange-600">{b.quantity} pieces</td>
                        <td className="p-3 font-semibold">{b.source}</td>
                        <td className="p-3 font-mono text-stone-450">{b.dateTaken}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleBartanStatus(b.id)}
                            className={`px-3 py-1 font-black text-[9px] uppercase tracking-wider rounded-xl border ${
                              b.status === 'Returned'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                                : 'bg-orange-500/10 border-orange-500/30 text-orange-600 animate-pulse'
                            }`}
                          >
                            {b.status === 'Returned' ? '🟢 Returned' : '🟠 Borrowed'}
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <button onClick={() => setBartans(bartans.filter(it => it.id !== b.id))} className="text-stone-400 hover:text-red-500 p-1">
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
      )}

      {/* RENDER VIEW 2: GAS CYLINDERS */}
      {activeTab === 'cylinder' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 text-left" id="cylinder-inventory-tracker">
          
          {/* Form */}
          <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-4 font-sans h-max">
            <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white pb-3 border-b flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-600" />
              <span>Record Cylinder Supply</span>
            </h3>

            <form onSubmit={handleAddCylinder} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Gas Vendor / Agency</label>
                <input
                  type="text"
                  placeholder="e.g. Indane Manoj Agencies Ltd"
                  value={cVendor}
                  onChange={e => setCVendor(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Cylinders Count</label>
                  <input
                    type="number"
                    value={cQty}
                    onChange={e => setCQty(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Total Bill Price</label>
                  <input
                    type="number"
                    placeholder="Total ₹"
                    value={cPrice}
                    onChange={e => setCPrice(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Date Received</label>
                  <input
                    type="date"
                    value={cDate}
                    onChange={e => setCDate(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Payment State</label>
                  <select
                    value={cPayStatus}
                    onChange={e => setCPayStatus(e.target.value as any)}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border bg-stone-50"
                  >
                    <option value="Paid">Paid Fully</option>
                    <option value="Pending">Dues Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Cylinder empty states</label>
                <select
                  value={cReturn}
                  onChange={e => setCReturn(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border bg-stone-50"
                >
                  <option value="Received Full">Received Full Cylinders</option>
                  <option value="Empty Returned">Empty Shells Returned</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold uppercase transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Save Cylinder Log</span>
              </button>
            </form>
          </div>

          {/* Directory */}
          <div className="lg:col-span-3 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white pb-3 border-b flex justify-between items-center">
              <span>Gas Cylinders Logs & Return Registry</span>
              <span className="text-[10px] font-mono text-orange-600 font-extrabold uppercase">Active cylinders fuel trackers</span>
            </h3>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-900 text-[10px] uppercase font-bold text-stone-500 border-b font-mono">
                    <th className="p-3">Agency Vendor Sourced</th>
                    <th className="p-3 text-center">Procured Volume</th>
                    <th className="p-3 text-right">Invoiced Price</th>
                    <th className="p-3 text-center">Received Date</th>
                    <th className="p-3 text-center">Payment Status</th>
                    <th className="p-3 text-center">Empty Return Status</th>
                    <th className="p-3 text-center">Erase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150 text-xs text-stone-900 dark:text-stone-100">
                  {cylinders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-stone-400 font-bold uppercase">No cylinder tracking logs found.</td>
                    </tr>
                  ) : (
                    cylinders.map(c => (
                      <tr key={c.id} className="hover:bg-orange-500/5 transition-colors">
                        <td className="p-3 font-extrabold">{c.vendor}</td>
                        <td className="p-3 text-center font-mono font-bold">{c.quantity} HP cylinders</td>
                        <td className="p-3 text-right font-mono font-bold">₹{c.price.toLocaleString('en-IN')}</td>
                        <td className="p-3 font-mono text-center text-stone-450">{c.dateReceived}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleCylinderPay(c.id)}
                            className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase border ${
                              c.paymentStatus === 'Paid'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                                : 'bg-red-500/10 text-red-650 border-red-500/30'
                            }`}
                          >
                            {c.paymentStatus === 'Paid' ? 'Paid' : 'Pending'}
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleCylinderReturn(c.id)}
                            className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase border ${
                              c.returnStatus === 'Empty Returned'
                                ? 'bg-stone-100 text-stone-505 dark:bg-stone-900'
                                : 'bg-orange-500/10 text-orange-600 border-orange-500/30'
                            }`}
                          >
                            {c.returnStatus}
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <button onClick={() => setCylinders(cylinders.filter(it => it.id !== c.id))} className="text-stone-400 hover:text-red-500 p-1">
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
      )}

      {/* RENDER VIEW 3: MISCELLANEOUS ITEMS */}
      {activeTab === 'misc' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 text-left" id="misc-inventory-tracker">
          
          {/* Form */}
          <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-4 font-sans h-max">
            <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white pb-3 border-b flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-600" />
              <span>Record Misc Item</span>
            </h3>

            <form onSubmit={handleAddMisc} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Item Title / Specifics</label>
                <input
                  type="text"
                  placeholder="e.g. Red Halwai Mandap fabrics"
                  value={mName}
                  onChange={e => setMName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Quantity</label>
                  <input
                    type="number"
                    value={mQty}
                    onChange={e => setMQty(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border bg-stone-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Cost (₹)</label>
                  <input
                    type="number"
                    placeholder="Value ₹"
                    value={mCost}
                    onChange={e => setMCost(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border bg-stone-50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Supplied / Borrowed Source</label>
                <input
                  type="text"
                  placeholder="From whom obtained"
                  value={mSource}
                  onChange={e => setMSource(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border bg-stone-50"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Operational descriptors</label>
                <textarea
                  placeholder="Notes or warehouse placement location..."
                  value={mNotes}
                  onChange={e => setMNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border bg-stone-50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold uppercase transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Save Entry line</span>
              </button>
            </form>
          </div>

          {/* Directory */}
          <div className="lg:col-span-3 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white pb-3 border-b flex justify-between items-center">
              <span>Miscellaneous Event Materials Inventory</span>
              <span className="text-[10px] font-mono text-orange-650">Total list: {miscItems.length} lines</span>
            </h3>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-900 text-[10px] uppercase font-bold text-stone-500 border-b font-mono">
                    <th className="p-3">Material Specified details</th>
                    <th className="p-3 text-center">Rental Volume</th>
                    <th className="p-3 text-right">Equivalent cost (₹)</th>
                    <th className="p-3">Borrow Source Sourced</th>
                    <th className="p-3">Additional description notes</th>
                    <th className="p-3 text-center">Erase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150 text-xs text-stone-900 dark:text-stone-100">
                  {miscItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-400 font-bold uppercase">No recorded miscellaneous item lines.</td>
                    </tr>
                  ) : (
                    miscItems.map(m => (
                      <tr key={m.id} className="hover:bg-orange-500/5 transition-colors">
                        <td className="p-3 font-extrabold">{m.name}</td>
                        <td className="p-3 text-center font-mono font-bold">{m.quantity} items</td>
                        <td className="p-3 text-right font-mono font-bold">₹{m.cost.toLocaleString('en-IN')}</td>
                        <td className="p-3 font-semibold">{m.source}</td>
                        <td className="p-3 text-stone-500 text-[10px]">{m.notes || '—'}</td>
                        <td className="p-3 text-center">
                          <button onClick={() => setMiscItems(miscItems.filter(it => it.id !== m.id))} className="text-stone-400 hover:text-red-500 p-1">
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
      )}

    </div>
  );
};
