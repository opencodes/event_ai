import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, LayoutGrid, Scale, Activity, CheckCircle, AlertCircle } from 'lucide-react';

interface Expense {
  id: string;
  name: string;
  category: 'Grocery' | 'Catering' | 'Decoration' | 'Attire' | 'Gifts' | 'Miscellaneous' | 'Venue' | 'Vendors';
  cost: number;
  status: 'Paid' | 'Pending';
  date: string;
  paidTo: string; // Beneficiary
}

const DEFAULT_EXPENSES: Expense[] = [
  { id: 'exp-1', name: 'Central Mandap Florist Advance', category: 'Decoration', cost: 35000, status: 'Paid', date: '2026-11-05', paidTo: 'Patna Flora Agencies' },
  { id: 'exp-2', name: 'Gold Silk Benarasi Saree & Dhoti pack', category: 'Attire', cost: 48000, status: 'Paid', date: '2026-11-02', paidTo: 'Zari Silks Emporium' },
  { id: 'exp-3', name: 'Raw Halwai ingredients (first listing purchase)', category: 'Grocery', cost: 55000, status: 'Paid', date: '2026-11-09', paidTo: 'Ramesh Kirana Merchant' },
  { id: 'exp-4', name: 'Mithai Box Return Souvenirs Procurement', category: 'Gifts', cost: 24000, status: 'Pending', date: '2026-11-12', paidTo: 'Kesaria Golden Sweets' },
  { id: 'exp-5', name: 'Sound Systems & Fireworks permission clearances', category: 'Miscellaneous', cost: 12000, status: 'Pending', date: '2026-11-10', paidTo: 'Local Sound & Lightings' }
];

export const PlannerBudget: React.FC = () => {
  const [masterBudget, setMasterBudget] = useState<number>(() => {
    const saved = localStorage.getItem('utsav_planner_budget_limit');
    return saved ? parseFloat(saved) : 500000; // 5 Lakhs INR
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('utsav_planner_expenses');
    return saved ? JSON.parse(saved) : DEFAULT_EXPENSES;
  });

  // Form Inputs
  const [tempBudgetInput, setTempBudgetInput] = useState('');
  const [expName, setExpName] = useState('');
  const [expCategory, setExpCategory] = useState<'Grocery' | 'Catering' | 'Decoration' | 'Attire' | 'Gifts' | 'Miscellaneous' | 'Venue' | 'Vendors'>('Catering');
  const [expCost, setExpCost] = useState('');
  const [expStatus, setExpStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [expDate, setExpDate] = useState('');
  const [expPaidTo, setExpPaidTo] = useState('');

  // Category search state
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    localStorage.setItem('utsav_planner_budget_limit', masterBudget.toString());
  }, [masterBudget]);

  useEffect(() => {
    localStorage.setItem('utsav_planner_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleSetBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(tempBudgetInput) || 0;
    if (val > 0) {
      setMasterBudget(val);
      setTempBudgetInput('');
      alert(`Master Event limit configured safely to ₹${val.toLocaleString('en-IN')}.`);
    }
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expName || !expCost || !expPaidTo) return;

    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      name: expName,
      category: expCategory,
      cost: parseFloat(expCost) || 0,
      status: expStatus,
      date: expDate || new Date().toISOString().split('T')[0],
      paidTo: expPaidTo
    };

    setExpenses([...expenses, newExp]);
    setExpName('');
    setExpCost('');
    setExpPaidTo('');
    setExpDate('');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleTogglePaidStatus = (id: string) => {
    setExpenses(expenses.map(exp => {
      if (exp.id === id) {
        return { ...exp, status: exp.status === 'Paid' ? 'Pending' : 'Paid' };
      }
      return exp;
    }));
  };

  // CALCULATIONS / DRILLS
  const totalCostCombined = expenses.reduce((acc, e) => acc + e.cost, 0);
  const totalPaidSum = expenses.filter(e => e.status === 'Paid').reduce((acc, e) => acc + e.cost, 0);
  const totalPendingSum = expenses.filter(e => e.status === 'Pending').reduce((acc, e) => acc + e.cost, 0);
  const remainingBudgetLeft = masterBudget - totalCostCombined;
  const allocationPercentage = Math.min(100, Math.round((totalCostCombined / masterBudget) * 100));

  // Category wise breaks
  const uniqueCategories: Expense['category'][] = ['Grocery', 'Catering', 'Decoration', 'Attire', 'Gifts', 'Miscellaneous', 'Venue', 'Vendors'];
  const getCategorySum = (cat: Expense['category']) => {
    return expenses.filter(e => e.category === cat).reduce((acc, e) => acc + e.cost, 0);
  };

  const filteredExpenses = expenses.filter(e => {
    return activeCategory === 'All' || e.category === activeCategory;
  });

  return (
    <div className="space-y-8 pb-12" id="planner-budget-root">
      
      {/* Graphical Progress & Stats Bar */}
      <div className="bg-white dark:bg-stone-800 p-6 rounded-3xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm text-left">
        <h2 className="text-sm font-black uppercase text-stone-400 tracking-wider mb-4">Master Financial Ledger Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Master Event Budget</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-xl font-black text-stone-900 dark:text-white leading-none">
                ₹ {masterBudget.toLocaleString('en-IN')}
              </h3>
            </div>
            
            {/* Direct Form Inline to update budget */}
            <form onSubmit={handleSetBudgetSubmit} className="mt-3 flex gap-2">
              <input
                type="number"
                placeholder="Adjust limit ₹"
                value={tempBudgetInput}
                onChange={e => setTempBudgetInput(e.target.value)}
                className="px-2 py-1 text-[10px] rounded border w-24 bg-white dark:bg-stone-900 text-stone-950 dark:text-white font-mono"
              />
              <button type="submit" className="text-[10px] bg-orange-600 text-white px-2 py-1 rounded font-bold uppercase hover:bg-orange-700 transition">
                Set
              </button>
            </form>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Consolidated Outlays</span>
            <h3 className="text-xl font-black text-orange-600 mt-1 leading-none">
              ₹ {totalCostCombined.toLocaleString('en-IN')}
            </h3>
            <span className="text-[9px] text-stone-400 block font-mono mt-1">Sum of {expenses.length} distinct lines</span>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Dues Settled (Paid)</span>
            <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 leading-none">
              ₹ {totalPaidSum.toLocaleString('en-IN')}
            </h3>
            <span className="text-[9px] text-emerald-600 font-bold font-mono uppercase block mt-1">Ready Clearances</span>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl">
            <span className="text-[10px] uppercase tracking-wider text-stone-450 font-bold block">Dues Uncleared (Pending)</span>
            <h3 className="text-xl font-black text-rose-600 dark:text-rose-450 mt-1 leading-none">
              ₹ {totalPendingSum.toLocaleString('en-IN')}
            </h3>
            <span className="text-[9px] text-rose-500 font-mono block mt-1">Owed to merchant lists</span>
          </div>
        </div>

        {/* Dynamic Progress indicator */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-700">
          <div className="flex justify-between items-baseline mb-2 text-xs">
            <span className="font-extrabold uppercase text-stone-500 text-[10px]">Consolidated Budget Utilization Progress</span>
            <span className={`font-mono font-bold ${remainingBudgetLeft >= 0 ? 'text-emerald-600' : 'text-red-500 font-black'}`}>
              {remainingBudgetLeft >= 0 
                ? `Remaining Balance: ₹ ${remainingBudgetLeft.toLocaleString('en-IN')} (${100 - allocationPercentage}% Left)` 
                : `💥 OVERBUDGET SLIPPAGE: ₹ ${Math.abs(remainingBudgetLeft).toLocaleString('en-IN')} OVER CONTRACT`
              }
            </span>
          </div>
          <div className="w-full bg-stone-100 dark:bg-stone-900 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 font-mono text-[9px] text-white flex items-center justify-end pr-2.5 font-bold ${
                allocationPercentage > 90 
                  ? 'bg-gradient-to-r from-orange-600 to-rose-600' 
                  : 'bg-orange-600'
              }`}
              style={{ width: `${allocationPercentage}%` }}
            >
              {allocationPercentage}% UTILISED
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Category Breakdown Ledger Charts */}
      <div className="bg-white dark:bg-stone-800 p-5 rounded-3xl border border-stone-200/60 dark:border-stone-700/60 p-4 shadow-sm text-left">
        <h4 className="text-xs font-black uppercase text-stone-400 tracking-wider mb-3">CONSOLIDATED CATEGORY PIE SCALE</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 text-center">
          {uniqueCategories.map(cat => {
            const sum = getCategorySum(cat);
            const ratio = totalCostCombined > 0 ? Math.round((sum / totalCostCombined) * 105) : 0;
            return (
              <div key={cat} className="p-2.5 bg-stone-50 dark:bg-stone-900 rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tight truncate block">{cat}</span>
                <b className="text-xs text-stone-900 dark:text-white block mt-1.5">₹{sum.toLocaleString('en-IN')}</b>
                {sum > 0 && <span className="text-[8px] font-mono font-bold text-orange-600 mt-1 uppercase">占比 ~{ratio}%</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form: List interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Expenditure creation panel */}
        <div className="lg:col-span-1 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm text-left">
          <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white pb-3 border-b border-light-100 flex items-center gap-2 mb-4">
            <Plus className="w-4 h-4 text-orange-600" />
            <span>Record Outflow Line</span>
          </h3>

          <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Expenditure / Line Title</label>
              <input
                type="text"
                placeholder="e.g. Halwai dry fruits"
                value={expName}
                onChange={e => setExpName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-55 dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-orange-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Group Category</label>
                <select
                  value={expCategory}
                  onChange={e => setExpCategory(e.target.value as any)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 text-stone-900 dark:text-white"
                >
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Total Cost (INR)</label>
                <input
                  type="number"
                  placeholder="Cost ₹"
                  value={expCost}
                  onChange={e => setExpCost(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Date of billing</label>
              <input
                type="date"
                value={expDate}
                onChange={e => setExpDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Paid to (Supplier/Merchant)</label>
              <input
                type="text"
                placeholder="e.g. Sudha Dairy Agent"
                value={expPaidTo}
                onChange={e => setExpPaidTo(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Payment Status</label>
              <select
                value={expStatus}
                onChange={e => setExpStatus(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50"
              >
                <option value="Paid">Cleared / Paid In Full</option>
                <option value="Pending">Pending / Promised dues</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Record Line</span>
            </button>
          </form>
        </div>

        {/* Ledger logs list and tracking view */}
        <div className="lg:col-span-3 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-4 text-left flex flex-col justify-between">
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b">
              <div>
                <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white">Detailed Expenditure Ledgers</h3>
                <p className="text-[11px] text-stone-400 mt-0.5">Filter outflows chronologically and execute fast clearances directly on un-cleared items.</p>
              </div>
            </div>

            {/* Selector Categories tabs */}
            <div className="flex gap-2 flex-wrap pt-3">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-3 py-0.8 rounded-full text-[9px] font-black uppercase transition-all tracking-wider border ${
                  activeCategory === 'All'
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-stone-50 dark:bg-stone-900 text-stone-500 dark:text-stone-300 hover:bg-stone-100 dark:border-stone-700'
                }`}
              >
                Show All ({expenses.length})
              </button>
              {uniqueCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-0.8 rounded-full text-[9px] font-black uppercase transition-all tracking-wider border ${
                    activeCategory === cat
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-stone-50 dark:bg-stone-900 text-stone-500 dark:text-stone-300 hover:bg-stone-100 dark:border-stone-700'
                  }`}
                >
                  {cat} ({expenses.filter(e => e.category === cat).length})
                </button>
              ))}
            </div>

            {/* List logs table */}
            <div className="overflow-x-auto rounded-xl mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-900 text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200 dark:border-stone-700 font-mono">
                    <th className="p-3">Reference / Category</th>
                    <th className="p-3">Beneficiary Paid-to</th>
                    <th className="p-3">Billing Date</th>
                    <th className="p-3 text-right">Sum Cost (INR)</th>
                    <th className="p-3 text-center">Payment Status</th>
                    <th className="p-3 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150 text-xs">
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-400 font-bold uppercase tracking-widest">
                        No recorded expenses under this categorical ledger group.
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-orange-500/5 transition-colors">
                        
                        {/* Reference name */}
                        <td className="p-3">
                          <div>
                            <b className="text-stone-950 dark:text-white block font-extrabold">{exp.name}</b>
                            <span className="text-[9px] font-bold font-mono text-orange-600 bg-orange-600/10 px-1 py-0.2 rounded w-max block mt-0.5">
                              {exp.category}
                            </span>
                          </div>
                        </td>

                        {/* Paid to */}
                        <td className="p-3 font-mono font-medium text-stone-700 dark:text-stone-300">
                          {exp.paidTo}
                        </td>

                        {/* Date */}
                        <td className="p-3 text-stone-450 font-mono text-[11px]">
                          {exp.date}
                        </td>

                        {/* Cost */}
                        <td className="p-3 text-right font-bold text-stone-950 dark:text-white">
                          ₹ {exp.cost.toLocaleString('en-IN')}
                        </td>

                        {/* Status change toggle switch */}
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleTogglePaidStatus(exp.id)}
                            className={`px-3 py-1 font-black text-[9px] uppercase tracking-wider rounded-xl border transition-all ${
                              exp.status === 'Paid'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                                : 'bg-red-500/10 border-red-500/30 text-red-605 animate-pulse'
                            }`}
                            title="Click to toggle transaction status"
                          >
                            {exp.status === 'Paid' ? '🟢 Paid / Cleared' : '🔴 Unpaid / Pending'}
                          </button>
                        </td>

                        {/* Erase layout */}
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
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

          <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700 text-[10px] text-stone-400 italic">
            💡 Pro-tip: Click the status pills in the table to instantly swap transaction payment clearances in real-time.
          </div>
        </div>

      </div>

    </div>
  );
};
