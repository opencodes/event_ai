import React from 'react';
import { Mail, Phone } from 'lucide-react';

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

interface CustomerTableProps {
  users: User[];
  onSelectUser: (user: User) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({ users, onSelectUser }) => {
  return (
    <div className="bg-white dark:bg-stone-850 rounded-2xl border border-orange-100/40 dark:border-stone-800 shadow-sm overflow-hidden text-left">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-neutral-800 dark:text-stone-300">
          <thead className="text-[10px] font-bold text-stone-400 bg-stone-50 dark:bg-stone-900/45 p-4">
            <tr>
              <th className="p-4">Customer ID</th>
              <th className="p-4">Diner Name</th>
              <th className="p-4">Sync Channels</th>
              <th className="p-4">Shree Wallet</th>
              <th className="p-4">Loyalty Balance</th>
              <th className="p-4">Index Status</th>
              <th className="p-4 text-right">Master Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/10 transition-colors">
                <td className="p-4 font-mono font-bold text-orange-600">{user.id}</td>
                
                {/* Name cell */}
                <td className="p-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-extrabold text-sm capitalize shrink-0">
                      {user.name[0]}
                    </div>
                    <div>
                      <b className="font-extrabold text-stone-900 dark:text-white block text-sm">{user.name}</b>
                      <span className="text-[10px] text-stone-400 block font-medium">Joined: {user.joined}</span>
                    </div>
                  </div>
                </td>

                {/* Contact channels */}
                <td className="p-4 space-y-0.5">
                  <p className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-orange-500 shrink-0" /> {user.email}</p>
                  <p className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-orange-500 shrink-0" /> {user.phone}</p>
                </td>

                {/* Wallet */}
                <td className="p-4 font-bold text-stone-900 dark:text-white">
                  ₹{user.wallet}
                </td>

                {/* Loyalty Points */}
                <td className="p-4">
                  <span className="font-bold text-orange-600">{user.loyalty} points</span>
                </td>

                {/* Status */}
                <td className="p-4">
                  <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${
                    user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-650'
                  }`}>
                    {user.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4 text-right">
                  <button
                    onClick={() => onSelectUser(user)}
                    className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
                  >
                    Inspect Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
