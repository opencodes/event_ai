import React from 'react';

interface RecentOrder {
  id: string;
  customerName: string;
  restaurantName: string;
  items: string;
  amount: number;
  status: string;
  time: string;
}

interface RecentOrdersTableProps {
  recentOrders: RecentOrder[];
  onNavigateTab: (tab: string) => void;
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ recentOrders, onNavigateTab }) => {
  return (
    <div className="lg:col-span-3 bg-white dark:bg-stone-850 rounded-2xl border border-orange-100/40 dark:border-stone-800 shadow-sm overflow-hidden text-left space-y-4 p-5">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-black text-stone-950 dark:text-white">Recent Festive Orders Index</h3>
        <button
          onClick={() => onNavigateTab('orders')}
          className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
        >
          Master Orders Queue &rarr;
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-stone-700 dark:text-stone-300">
          <thead className="text-[10px] font-bold text-stone-400 bg-stone-50 dark:bg-stone-900/50">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Store Joint</th>
              <th className="p-3">Items list</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
            {recentOrders.map((ord) => (
              <tr key={ord.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition-colors">
                <td className="p-3 font-mono font-bold text-orange-600">{ord.id}</td>
                <td className="p-3 text-stone-900 dark:text-white font-extrabold">{ord.customerName}</td>
                <td className="p-3 text-stone-500">{ord.restaurantName}</td>
                <td className="p-3 text-stone-400 truncate max-w-[150px]">{ord.items}</td>
                <td className="p-3 font-bold text-stone-900 dark:text-white">₹{ord.amount}</td>
                <td className="p-3">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                      ord.status === 'Delivered'
                        ? 'bg-green-100 text-green-700'
                        : ord.status === 'Cancelled'
                        ? 'bg-red-100 text-red-650'
                        : 'bg-orange-100 text-orange-700 font-bold'
                    }`}
                  >
                    {ord.status}
                  </span>
                </td>
                <td className="p-3 text-stone-400">{ord.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
