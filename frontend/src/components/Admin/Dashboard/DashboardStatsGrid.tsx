import React from 'react';
import { IndianRupee, ShoppingCart, Users, Store } from 'lucide-react';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  activeRestaurants: number;
}

interface DashboardStatsGridProps {
  stats: Stats;
}

export const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="admin-dashboard-stats-grid">
      {/* Total Revenue */}
      <div className="bg-white dark:bg-stone-850 p-5 rounded-2xl border border-orange-100/40 dark:border-stone-800 shadow-sm flex items-center justify-between gap-4">
        <div className="space-y-1 text-left">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">Gross Revenue Today</span>
          <h4 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">₹{stats.totalRevenue}</h4>
          <span className="text-[10px] font-semibold text-green-700 dark:text-green-400 block px-2 py-0.5 bg-green-500/10 rounded-full w-fit">
            ▲ +24% vs yesterday
          </span>
        </div>
        <div className="p-3.5 bg-gradient-to-tr from-orange-600 to-orange-700 rounded-xl text-white">
          <IndianRupee className="w-5 h-5 shrink-0" />
        </div>
      </div>

      {/* Total Orders */}
      <div className="bg-white dark:bg-stone-850 p-5 rounded-2xl border border-orange-100/40 dark:border-stone-800 shadow-sm flex items-center justify-between gap-4">
        <div className="space-y-1 text-left">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">Total Festive Orders</span>
          <h4 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">{stats.totalOrders} packs</h4>
          <span className="text-[10px] font-semibold text-green-700 dark:text-green-400 block px-2 py-0.5 bg-green-500/10 rounded-full w-fit">
            ▲ +18% peak orders
          </span>
        </div>
        <div className="p-3.5 bg-gradient-to-tr from-red-500 to-rose-650 rounded-xl text-white">
          <ShoppingCart className="w-5 h-5 shrink-0" />
        </div>
      </div>

      {/* Active Customers */}
      <div className="bg-white dark:bg-stone-850 p-5 rounded-2xl border border-orange-100/40 dark:border-stone-800 shadow-sm flex items-center justify-between gap-4">
        <div className="space-y-1 text-left">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">Active Customers</span>
          <h4 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">{stats.activeCustomers} users</h4>
          <span className="text-[10px] font-semibold text-green-700 dark:text-green-400 block px-2 py-0.5 bg-green-500/10 rounded-full w-fit">
            ▲ +9.8% customer retention
          </span>
        </div>
        <div className="p-3.5 bg-gradient-to-tr from-stone-800 to-stone-900 rounded-xl text-white">
          <Users className="w-5 h-5 shrink-0" />
        </div>
      </div>

      {/* Active Restaurants */}
      <div className="bg-white dark:bg-stone-850 p-5 rounded-2xl border border-orange-100/40 dark:border-stone-800 shadow-sm flex items-center justify-between gap-4">
        <div className="space-y-1 text-left">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">Kitchens Approved</span>
          <h4 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">{stats.activeRestaurants} hub stores</h4>
          <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 block px-2 py-0.5 bg-orange-600/10 rounded-full w-fit">
            ● 100% cloud delivery
          </span>
        </div>
        <div className="p-3.5 bg-gradient-to-tr from-[#9C27B0] to-[#E91E63] rounded-xl text-white">
          <Store className="w-5 h-5 shrink-0" />
        </div>
      </div>
    </div>
  );
};
