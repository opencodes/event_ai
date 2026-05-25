import React from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  wallet: number;
  loyalty: number;
  status: string;
  orderCount: number;
  joined: string;
}

interface CustomerDetailModalProps {
  user: User | null;
  onClose: () => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  user,
  onClose,
  onToggleStatus,
}) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-stone-850 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 border border-orange-100 dark:border-stone-750 shadow-2xl animate-in fade-in zoom-in-95 leading-relaxed text-left relative text-neutral-700 dark:text-neutral-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-500 font-bold cursor-pointer"
        >
          ✕
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b pb-4 dark:border-stone-800">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500 to-red-650 flex items-center justify-center text-xl">
              🎖️
            </div>
            <div>
              <h4 className="font-extrabold text-stone-900 dark:text-white text-base font-sans">
                {user.name}
              </h4>
              <p className="text-xs text-stone-400 font-medium">Verifying Identity Index {user.id}</p>
            </div>
          </div>

          {/* Data points */}
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-stone-600 dark:text-stone-300">
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border dark:border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase font-mono">Shree Wallet Bal.</span>
              <b className="text-sm font-black text-stone-900 dark:text-white mt-1 block">₹{user.wallet}</b>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border dark:border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase font-mono">Loyalty points</span>
              <b className="text-sm font-black text-orange-650 mt-1 block">{user.loyalty} pts</b>
            </div>
          </div>

          {/* Timeline segment */}
          <div className="space-y-2 text-xs">
            <h5 className="font-bold text-stone-400 block font-mono uppercase tracking-wider text-[10px]">User Activity Timeline</h5>
            <div className="space-y-2 pt-1 border-l-2 border-orange-200 dark:border-orange-900/40 pl-4 ml-2">
              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-orange-600 rounded-full" />
                <p className="font-bold text-stone-800 dark:text-stone-200 font-sans">Order FED-9831 delivered successfully</p>
                <span className="text-[9px] text-stone-400">23 May 19:40</span>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-orange-600 rounded-full" />
                <p className="font-bold text-stone-800 dark:text-stone-200 font-sans">Deposited ₹1000 cash in wallet</p>
                <span className="text-[9px] text-stone-400">20 May 11:21</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="pt-4 border-t dark:border-stone-800 flex gap-3 font-semibold text-xs text-neutral-850">
            <button
              onClick={() => onToggleStatus(user.id, user.status)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors border cursor-pointer ${
                user.status === 'Active'
                  ? 'bg-red-50 text-red-650 border-red-200 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50'
                  : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950/20 dark:text-green-450 dark:border-green-900/50'
              }`}
            >
              {user.status === 'Active' ? 'Restrict Diner' : 'Authorize Diner'}
            </button>
            <button
              onClick={() => alert(`Credits Top-up of ₹500 pushed dynamically to user ${user.id}`)}
              className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer dark:bg-stone-800 dark:hover:bg-stone-700"
            >
              Reward ₹500 Gift
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
