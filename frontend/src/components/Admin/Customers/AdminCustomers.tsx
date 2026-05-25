import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { CustomerTable } from './CustomerTable';
import { CustomerDetailModal } from './CustomerDetailModal';

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

export const AdminCustomers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([
    { id: 'USR-012', name: 'Gaurav Sharma', email: 'gaurav.sharma@utsav.com', phone: '+91 98765 43210', wallet: 1250, loyalty: 480, status: 'Active', orderCount: 3, joined: '2026-01-10' },
    { id: 'USR-013', name: 'Aishwarya Roy', email: 'aishwarya.roy@utsav.com', phone: '+91 91002 02120', wallet: 450, loyalty: 190, status: 'Active', orderCount: 5, joined: '2026-03-04' },
    { id: 'USR-014', name: 'Virat Kohli', email: 'runmachine@kohlisocials.com', phone: '+91 99991 18182', wallet: 8900, loyalty: 1200, status: 'Active', orderCount: 12, joined: '2026-01-01' },
    { id: 'USR-015', name: 'Ananya Panday', email: 'ananya@pandayfilms.in', phone: '+91 95050 40402', wallet: 120, loyalty: 80, status: 'Restricted', orderCount: 1, joined: '2026-05-12' },
  ]);

  const sortedAndFiltered = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = (id: string, current: string) => {
    const next = current === 'Active' ? 'Restricted' : 'Active';
    const updatedUsers = users.map((u) => (u.id === id ? { ...u, status: next } : u));
    setUsers(updatedUsers);

    if (selectedUser && selectedUser.id === id) {
      setSelectedUser({ ...selectedUser, status: next });
    }
    alert(`User security level updated to ${next}.`);
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300" id="admin-customers-tab">
      {/* 1. SEARCH CRITERIA CONTROL */}
      <div className="bg-white dark:bg-stone-850 p-4 rounded-xl border border-orange-100/40 dark:border-stone-800 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:max-w-xs text-left">
          <input
            type="text"
            placeholder="Search verified profile indexes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border bg-stone-50 dark:bg-stone-900 rounded-xl focus:outline-none dark:border-stone-800 text-stone-900 dark:text-white"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-orange-605" />
        </div>
        <span className="text-xs text-stone-400 font-bold hidden sm:inline font-mono">Active Synchronized Directory Nodes</span>
      </div>

      {/* 2. CUSTOMER METADATA TABLE */}
      <CustomerTable users={sortedAndFiltered} onSelectUser={setSelectedUser} />

      {/* 3. PROFILE DETAILS INSPECTOR MODAL */}
      <CustomerDetailModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};
