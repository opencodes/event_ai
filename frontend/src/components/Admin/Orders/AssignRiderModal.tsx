import React from 'react';
import { X } from 'lucide-react';

interface AssignRiderModalProps {
  orderId: string | null;
  onClose: () => void;
  ridersList: string[];
  onAssignRider: (orderId: string, rider: string) => void;
}

export const AssignRiderModal: React.FC<AssignRiderModalProps> = ({
  orderId,
  onClose,
  ridersList,
  onAssignRider,
}) => {
  if (!orderId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-stone-850 rounded-2xl max-w-sm w-full p-6 space-y-4 relative border border-orange-100 dark:border-stone-700 shadow-2xl animate-in zoom-in-95 text-left text-neutral-800 dark:text-stone-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 dark:hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
        
        <h4 className="font-extrabold text-sm text-stone-900 dark:text-white uppercase">
          Assign Satvik Delivery Rider Hub
        </h4>
        <p className="text-xs text-stone-400 font-medium">Select active partner to assign to order {orderId}.</p>

        <div className="space-y-1">
          {ridersList.map((r) => (
            <button
              key={r}
              onClick={() => onAssignRider(orderId, r)}
              className="w-full text-left px-3 py-2.5 bg-stone-50 hover:bg-orange-50 dark:bg-stone-900 dark:hover:bg-orange-950/20 text-stone-700 dark:text-stone-200 font-bold text-xs rounded-lg transition-colors border border-transparent hover:border-orange-100 cursor-pointer"
            >
              💡 {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
