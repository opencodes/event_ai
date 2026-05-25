import React from 'react';
import { X, User, MapPin } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  restaurant: string;
  items: string;
  amount: number;
  status: string;
  time: string;
  address: string;
  phone: string;
  partner?: string;
}

interface OrderDetailsDrawerProps {
  order: Order | null;
  onClose: () => void;
  onAdvanceStage: (id: string, currentStatus: string) => void;
}

export const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({
  order,
  onClose,
  onAdvanceStage,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-stone-850 p-6 sm:p-8 shadow-2xl overflow-y-auto border-l border-orange-100 dark:border-stone-750 animate-in slide-in-from-right duration-250 text-left text-neutral-700 dark:text-neutral-200">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 rounded-full cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="space-y-6">
        <div className="border-b pb-4 dark:border-stone-800">
          <span className="text-xs font-bold font-mono text-orange-600 block uppercase">Order details secure panel</span>
          <h3 className="text-xl font-black text-stone-900 dark:text-white mt-1">
            {order.id}
          </h3>
        </div>

        {/* Customer Info segment */}
        <div className="space-y-3 p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border dark:border-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300">
          <h5 className="font-extrabold text-sm text-stone-900 dark:text-white flex items-center gap-1.5 border-b pb-2">
            <User className="w-4 h-4 text-orange-600" />
            <span>Customer Information</span>
          </h5>
          <p>Name: <b className="text-stone-950 dark:text-white">{order.customer}</b></p>
          <p>Phone: {order.phone}</p>
          <p className="flex items-start gap-1">
            <MapPin className="w-4 h-4 text-orange-606 shrink-0 mt-0.5" />
            <span>Address: {order.address}</span>
          </p>
        </div>

        {/* Kitchen and item details */}
        <div className="space-y-4">
          <h5 className="font-extrabold text-stone-900 dark:text-white border-b pb-2 text-sm">Store and Items</h5>
          <div className="text-sm font-black text-stone-850 dark:text-white">
            Kitchen outlet: <span className="text-orange-606">{order.restaurant}</span>
          </div>
          <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl text-xs font-mono text-stone-600 dark:text-stone-300">
            {order.items}
          </div>
        </div>

        {/* Status indicators */}
        <div className="space-y-2 text-xs font-semibold">
          <h5 className="font-bold text-stone-400 uppercase tracking-widest font-mono">Workflow controls</h5>
          <div className="flex gap-2">
            <div className="flex-1 bg-stone-100 dark:bg-stone-900 p-2 text-center rounded">
              <span className="text-[10px] text-stone-400">Current status</span>
              <b className="block text-orange-605 font-extrabold mt-1 uppercase text-xs">{order.status}</b>
            </div>
            <div className="flex-1 bg-stone-100 dark:bg-stone-900 p-2 text-center rounded">
              <span className="text-[10px] text-stone-400">Rider Partner</span>
              <b className="block text-green-700 dark:text-green-400 font-extrabold mt-1 text-xs">{order.partner ? order.partner : 'Unassigned'}</b>
            </div>
          </div>
        </div>

        {/* Quick Actions inside Drawer */}
        <div className="pt-6 border-t dark:border-stone-800 flex gap-3">
          <button
            onClick={() => alert('Customer notified over SMS and WhatsApp sync dispatch channels.')}
            className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer"
          >
            Sync Notification
          </button>
          {order.status !== 'Delivered' && (
            <button
              onClick={() => onAdvanceStage(order.id, order.status)}
              className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer"
            >
              Advance Stage
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
