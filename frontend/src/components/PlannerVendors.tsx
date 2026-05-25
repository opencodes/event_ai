import React, { useState, useEffect } from 'react';
import { Truck, Plus, Trash2, Phone, IndianRupee, ListChecks, CheckCircle, HelpCircle, AlertTriangle } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  category: 'Kirana / Grocery' | 'Milk Supplier' | 'Curd Supplier' | 'Sweet Shop / Halwai' | 'Tent / Catering Support' | 'Other vendors';
  serviceDetails: string;
  pricing: number; // Contract Pricing
  advancePaid: number;
  contact: string;
  status: 'Contract Created' | 'Advance Paid' | 'Partially Paid' | 'Settle on Completion';
}

const DEFAULT_VENDORS: Vendor[] = [
  {
    id: 'ven-1',
    name: 'Mithila Halshali Flour Mills (Ramesh Jha)',
    category: 'Kirana / Grocery',
    serviceDetails: 'Basmati Rice Dubar (15 bags), High-grade Sugar flour, Pure Cow Ghee buckets supply.',
    pricing: 45000,
    advancePaid: 15000,
    contact: '+91 98450 12345',
    status: 'Partially Paid'
  },
  {
    id: 'ven-2',
    name: 'Sudha Dairy Co-Op Transit Agency',
    category: 'Milk Supplier',
    serviceDetails: '250 Litres whole-fat milk packets and cream deliveries for Sangeet & Shadi days.',
    pricing: 18000,
    advancePaid: 18000,
    contact: '+91 99312 88776',
    status: 'Advance Paid'
  },
  {
    id: 'ven-3',
    name: 'Laljee tents & Lightings, Sector 56',
    category: 'Tent / Catering Support',
    serviceDetails: 'Maharaja stage setups, gold steel marigold hanging poles, 450 cushion golden chairs.',
    pricing: 85000,
    advancePaid: 25000,
    contact: '+91 91024 43221',
    status: 'Partially Paid'
  }
];

export const PlannerVendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('utsav_planner_vendors');
    return saved ? JSON.parse(saved) : DEFAULT_VENDORS;
  });

  // Category filter
  const [activeCategory, setActiveCategory] = useState('All');

  // Input states
  const [vName, setVName] = useState('');
  const [vCategory, setVCategory] = useState<'Kirana / Grocery' | 'Milk Supplier' | 'Curd Supplier' | 'Sweet Shop / Halwai' | 'Tent / Catering Support' | 'Other vendors'>('Kirana / Grocery');
  const [vService, setVService] = useState('');
  const [vPricing, setVPric] = useState('');
  const [vAdvance, setVAdv] = useState('');
  const [vContact, setVContact] = useState('');
  const [vStatus, setVStatus] = useState<any>('Contract Created');

  useEffect(() => {
    localStorage.setItem('utsav_planner_vendors', JSON.stringify(vendors));
  }, [vendors]);

  const handleAddVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName || !vPricing || !vContact) return;

    const pricingNum = parseFloat(vPricing) || 0;
    const advanceNum = parseFloat(vAdvance) || 0;

    let calStatus = 'Contract Created';
    if (advanceNum === pricingNum && pricingNum > 0) {
      calStatus = 'Advance Paid';
    } else if (advanceNum > 0 && advanceNum < pricingNum) {
      calStatus = 'Partially Paid';
    } else if (pricingNum > 0 && advanceNum === 0) {
      calStatus = 'Settle on Completion';
    }

    const newVen: Vendor = {
      id: `ven-${Date.now()}`,
      name: vName,
      category: vCategory,
      serviceDetails: vService,
      pricing: pricingNum,
      advancePaid: advanceNum,
      contact: vContact,
      status: calStatus as any
    };

    setVendors([...vendors, newVen]);
    setVName('');
    setVService('');
    setVPric('');
    setVAdv('');
    setVContact('');
  };

  const handleDeleteVendor = (id: string) => {
    setVendors(vendors.filter(v => v.id !== id));
  };

  // Direct Contract Settlements
  const handleQuickAdvanceSettle = (id: string, settleAmount: number) => {
    setVendors(vendors.map(v => {
      if (v.id === id) {
        const nextAdv = Math.min(v.pricing, v.advancePaid + settleAmount);
        const nextStatus = nextAdv === v.pricing ? 'Advance Paid' : 'Partially Paid';
        return { ...v, advancePaid: nextAdv, status: nextStatus as any };
      }
      return v;
    }));
  };

  // CALCULATIONS FOR DIRECT PAYMENT OVERVIEW dashboard
  const totalVendorsCount = vendors.length;
  const totalContractVal = vendors.reduce((acc, v) => acc + v.pricing, 0);
  const totalAdvancesPaid = vendors.reduce((acc, v) => acc + v.advancePaid, 0);
  const totalOutstandingBal = totalContractVal - totalAdvancesPaid;

  // Filter categorization
  const filteredVendors = vendors.filter(v => {
    return activeCategory === 'All' || v.category === activeCategory;
  });

  return (
    <div className="space-y-8 pb-12" id="planner-vendors-root">
      
      {/* Financial health board widget */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="vendors-ledger-dashboard">
        
        {/* Metric 1 */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm text-left flex items-center gap-4">
          <div className="p-3 bg-orange-105 rounded-xl text-orange-600">
            <Truck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Assigned Suppliers</span>
            <h3 className="text-xl font-black text-stone-900 dark:text-white mt-1 leading-none">
              {totalVendorsCount} <span className="text-xs font-normal text-stone-500">Contractors</span>
            </h3>
            <span className="text-[9px] text-orange-600 font-mono font-bold mt-1 uppercase block">🟢 Active Logistics</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm text-left flex items-center gap-4">
          <div className="p-3 bg-stone-100 dark:bg-stone-900 rounded-xl text-stone-600 dark:text-stone-300">
            <IndianRupee className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Total Service Budgets</span>
            <h3 className="text-xl font-black text-stone-900 dark:text-white mt-1 leading-none">
              ₹ {totalContractVal.toLocaleString('en-IN')}
            </h3>
            <span className="text-[9px] text-stone-500 mt-1 uppercase block font-mono">Consolidated Bids</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm text-left flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Total Paid Advance</span>
            <h3 className="text-xl font-black text-stone-900 dark:text-white mt-1 leading-none">
              ₹ {totalAdvancesPaid.toLocaleString('en-IN')}
            </h3>
            <span className="text-[9px] text-green-600 font-mono font-bold mt-1 uppercase block">🛡️ Guaranteed Deposits</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl text-left flex items-center gap-4">
          <div className="p-3 bg-rose-500/20 rounded-xl text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-rose-800 dark:text-rose-400 font-bold block">Outstanding Balances due</span>
            <h3 className="text-xl font-black text-rose-700 dark:text-rose-400 mt-1 leading-none">
              ₹ {totalOutstandingBal.toLocaleString('en-IN')}
            </h3>
            <span className="text-[9px] text-rose-600 hover:underline font-mono uppercase mt-1 block font-bold cursor-help" onClick={() => alert('Settle these dues directly inside active rows below.')}>
              ⏳ Settle post ceremony ➔
            </span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left add supplier form */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm text-left">
          <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white pb-3 border-b border-light-100 flex items-center gap-2 mb-4">
            <Plus className="w-4 h-4 text-orange-600" />
            <span>Select & Add Vendor</span>
          </h3>

          <form onSubmit={handleAddVendorSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Supplier Category</label>
              <select
                value={vCategory}
                onChange={e => setVCategory(e.target.value as any)}
                className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white"
              >
                <option value="Kirana / Grocery">Kirana / Grocery Store</option>
                <option value="Milk Supplier">Milk Supplier / Dairy</option>
                <option value="Curd Supplier">Curd Supplier / Halwai</option>
                <option value="Sweet Shop / Halwai">Sweet Shop / Central Halwai</option>
                <option value="Tent / Catering Support">Tent & Catering Support</option>
                <option value="Other vendors">Other Special Vendor</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Vendor/Merchant Name</label>
              <input
                type="text"
                placeholder="e.g. Sudha milk distributors Co-op"
                value={vName}
                onChange={e => setVName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:ring-1 focus:ring-orange-600"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Contact Phone</label>
              <input
                type="text"
                placeholder="+91 xxxxx xxxxx"
                value={vContact}
                onChange={e => setVContact(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:ring-1"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Contract Price</label>
                <input
                  type="number"
                  placeholder="Total ₹"
                  value={vPricing}
                  onChange={e => setVPric(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Paid Deposit</label>
                <input
                  type="number"
                  placeholder="Paid ₹"
                  value={vAdvance}
                  onChange={e => setVAdv(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Service particulars / Items list</label>
              <textarea
                placeholder="List specific ingredients weights or material counts..."
                value={vService}
                onChange={e => setVService(e.target.value)}
                rows={3}
                className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Record Vendor Link</span>
            </button>
          </form>
        </div>

        {/* Right Directory listing with filter tabs */}
        <div className="lg:col-span-3 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-4 text-left flex flex-col justify-between">
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b">
              <div>
                <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white">Active Service Logistics</h3>
                <p className="text-[11px] text-stone-400 mt-0.5">Maintain supplier pricing, verify advance deposits status, and settle pending payments.</p>
              </div>
            </div>

            {/* Filter tags */}
            <div className="flex gap-2.5 flex-wrap pt-3">
              {['All', 'Kirana / Grocery', 'Milk Supplier', 'Curd Supplier', 'Sweet Shop / Halwai', 'Tent / Catering Support', 'Other vendors'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-0.8 rounded-full text-[10px] font-bold uppercase transition-all border ${
                    activeCategory === cat
                      ? 'bg-orange-600 text-white border-orange-600 font-extrabold'
                      : 'bg-stone-50 dark:bg-stone-900 text-stone-500 dark:text-stone-300 hover:bg-stone-100 dark:border-stone-700'
                  }`}
                >
                  {cat === 'All' ? 'All Vendors' : cat} ({cat === 'All' ? vendors.length : vendors.filter(v => v.category === cat).length})
                </button>
              ))}
            </div>

            {/* Table layout */}
            <div className="overflow-x-auto rounded-xl mt-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-900 text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200 dark:border-stone-700 font-mono">
                    <th className="p-3 text-left">Vendor particulars</th>
                    <th className="p-3 text-left">Service details</th>
                    <th className="p-3 text-right">Contract Dues</th>
                    <th className="p-3 text-right">Outstanding Balance</th>
                    <th className="p-3 text-center">Quick Record Settlement</th>
                    <th className="p-3 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-stone-150 dark:divide-stone-700">
                  {filteredVendors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-400 font-semibold uppercase tracking-wider">
                        No active vendors match this logistics node category.
                      </td>
                    </tr>
                  ) : (
                    filteredVendors.map((v) => {
                      const balance = v.pricing - v.advancePaid;
                      return (
                        <tr key={v.id} className="hover:bg-orange-500/5 transition-colors">
                          
                          {/* Vendor and Phone */}
                          <td className="p-3 text-left">
                            <b className="text-stone-900 dark:text-white font-extrabold block">{v.name}</b>
                            <span className="text-[9px] font-mono select-all bg-stone-100 dark:bg-stone-900 text-stone-500 px-1 py-0.2 rounded w-max block mt-1">{v.contact}</span>
                            <span className="text-[10px] font-bold text-orange-605 block mt-0.5">{v.category}</span>
                          </td>

                          {/* Detail summary */}
                          <td className="p-3 text-left">
                            <p className="text-[11px] text-stone-605 leading-relaxed truncate max-w-[200px]" title={v.serviceDetails}>
                              {v.serviceDetails || 'General logistics and deliveries support.'}
                            </p>
                          </td>

                          {/* Pricing total and advance */}
                          <td className="p-3 text-right">
                            <span className="block font-bold">₹ {v.pricing.toLocaleString('en-IN')}</span>
                            <span className="text-[10px] text-emerald-600 block font-mono">Adv: ₹{v.advancePaid.toLocaleString('en-IN')}</span>
                          </td>

                          {/* Outstanding Balance */}
                          <td className="p-3 text-right">
                            <span className={`font-mono font-bold ${balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                              ₹ {balance.toLocaleString('en-IN')}
                            </span>
                            <span className={`text-[8px] font-black uppercase tracking-wider block ${balance > 0 ? 'text-rose-500' : 'text-emerald-500 font-mono'}`}>
                              {balance === 0 ? 'Fully Settled' : 'Dues Pending'}
                            </span>
                          </td>

                          {/* Quick Payment action buttons */}
                          <td className="p-3 text-center">
                            {balance === 0 ? (
                              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">💰 Closed Contract</span>
                            ) : (
                              <div className="flex gap-1 justify-center">
                                <button
                                  onClick={() => handleQuickAdvanceSettle(v.id, Math.min(balance, 5000))}
                                  className="px-2 py-1 bg-stone-100 dark:bg-stone-900 text-[10px] font-bold rounded border dark:border-stone-700 hover:bg-orange-600 hover:text-white text-stone-850 transition-all font-mono"
                                  title="Pay ₹5000 Advance"
                                >
                                  +₹5K Adv
                                </button>
                                <button
                                  onClick={() => handleQuickAdvanceSettle(v.id, balance)}
                                  className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded hover:bg-emerald-700 transition-all uppercase tracking-tight"
                                  title="Settle all contract dues"
                                >
                                  Settle All
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Cancel button */}
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleDeleteVendor(v.id)}
                              className="p-1 hover:bg-stone-105 rounded text-stone-400 hover:text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-700 text-[11px] text-stone-400 flex items-center gap-2">
            <span>ℹ️ Advance status categories are calculated automatedly based on paid vs invoice balance ratio.</span>
          </div>

        </div>

      </div>

    </div>
  );
};
