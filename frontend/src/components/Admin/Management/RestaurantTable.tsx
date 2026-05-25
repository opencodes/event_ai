import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { Restaurant } from '../../../types';

interface RestaurantTableProps {
  restaurants: Restaurant[];
  statusMap: Record<string, boolean>;
  onToggleStatus: (id: string) => void;
  onDeleteRestaurant: (id: string) => void;
}

export const RestaurantTable: React.FC<RestaurantTableProps> = ({
  restaurants,
  statusMap,
  onToggleStatus,
  onDeleteRestaurant,
}) => {
  return (
    <div className="bg-white dark:bg-stone-850 rounded-2xl border border-orange-100/40 dark:border-stone-800 shadow-sm overflow-hidden text-left">
      <div className="px-5 py-4 border-b border-light-100 dark:border-stone-800">
        <h3 className="font-extrabold text-sm text-stone-900 dark:text-white">
          Active Kitchen Stores Index
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-neutral-800 dark:text-stone-300">
          <thead className="text-[10px] font-bold text-stone-400 bg-stone-50 dark:bg-stone-900/40">
            <tr>
              <th className="p-4">Store Banner</th>
              <th className="p-4">Kitchen Outlet Name</th>
              <th className="p-4">Gourmet Tags</th>
              <th className="p-4">Delivery KPI</th>
              <th className="p-4">Fee Indicator</th>
              <th className="p-4">Approval Status</th>
              <th className="p-4 text-right">Database Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
            {restaurants.map((rest) => {
              const isOnline = statusMap[rest.id] !== false;
              return (
                <tr key={rest.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/20 transition-colors">
                  {/* Banner info */}
                  <td className="p-4">
                    <img
                      src={rest.image}
                      alt={rest.name}
                      className="w-12 h-10 object-cover rounded-lg border dark:border-stone-800 shadow-sm shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  </td>

                  {/* Name */}
                  <td className="p-4 font-extrabold text-stone-900 dark:text-white text-sm">
                    {rest.name}
                  </td>

                  {/* Cuisines list */}
                  <td className="p-4 text-stone-500 dark:text-stone-400">
                    {rest.cuisine.join(', ')}
                  </td>

                  {/* Delivery time */}
                  <td className="p-4 font-semibold">
                    <span className="font-black text-stone-900 dark:text-white">{rest.deliveryTime} mins</span>
                    <p className="text-[10px] text-stone-400 font-medium">Avg distance: {rest.distance}km</p>
                  </td>

                  {/* Cost indicator */}
                  <td className="p-4 font-bold text-stone-850 dark:text-stone-300">
                    ₹{rest.costForTwo} for two
                  </td>

                  {/* Status Toggle */}
                  <td className="p-4">
                    <button
                      onClick={() => onToggleStatus(rest.id)}
                      className="flex items-center gap-1.5 focus:outline-none cursor-pointer"
                      title="Click to toggle store live approval"
                    >
                      {isOnline ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-green-600 block shrink-0" />
                          <span className="text-green-700 dark:text-green-400 font-bold">APPROVED LIVE</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-red-650 block shrink-0" />
                          <span className="text-stone-400 font-bold">MUTED INDEX</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions tools */}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => alert('Fast store layout edits are ready under admin control profiles.')}
                        className="p-1.5 text-stone-400 hover:text-orange-600 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                        title="Store Details layout configs"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteRestaurant(rest.id)}
                        className="p-1.5 text-stone-400 hover:text-red-650 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                        title="Erase from indices"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
