import React from 'react';
import { LayoutDashboard, Store, ClipboardList, Users, Megaphone, ArrowLeft, ShieldAlert, Calendar, ChefHat, Truck, IndianRupee, Gift } from 'lucide-react';
import { AnimatedDiya } from '../../web/GoldenDeco';

interface AdminSidebarProps {
  currentAdminTab: string;
  onSelectTab: (tab: string) => void;
  onExitAdmin: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentAdminTab, onSelectTab, onExitAdmin }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'restaurants', name: 'Products & Stores', icon: Store },
    { id: 'orders', name: 'Order Logs', icon: ClipboardList },
    { id: 'customers', name: 'Customers Sync', icon: Users },
    { id: 'marketing', name: 'Marketing & Campaigns', icon: Megaphone },
  ];

  const plannerItems = [
    { id: 'planner-events', name: 'Events & Rituals', icon: Calendar },
    { id: 'planner-guests', name: 'Guests & RSVP', icon: Users },
    { id: 'planner-feast', name: 'Feast & Catering', icon: ChefHat },
    { id: 'planner-vendors', name: 'Vendors Directory', icon: Truck },
    { id: 'planner-budget', name: 'Budget & Expenses', icon: IndianRupee },
    { id: 'planner-chuman', name: 'Chuman (Gifts)', icon: Gift },
    { id: 'planner-inventory', name: 'Bartan & Cylinders', icon: ClipboardList },
  ];

  return (
    <aside className="w-64 bg-white border-r border-stone-200 h-screen sticky top-0 flex flex-col justify-between text-stone-850 z-30 shrink-0 overflow-y-auto" id="admin-sidebar" style={{ contentVisibility: 'auto' }}>
      <div>
        
        {/* Admin Header Branding */}
        <div className="p-6 border-b border-stone-100 flex items-center gap-2">
          <div className="p-1 bg-gradient-to-tr from-rose-600 to-orange-600 rounded-lg shadow-md shrink-0">
            <AnimatedDiya className="w-7 h-7" />
          </div>
          <div className="text-left">
            <h1 className="text-[18px] font-black text-transparent bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text leading-none tracking-wide">
              UTSAV MASTER
            </h1>
            <span className="text-[11px] uppercase tracking-widest block text-orange-600 font-mono font-bold mt-1">
              Enterprise Suite
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="p-4 space-y-1">
          <span className="text-[12px] uppercase font-extrabold text-stone-500 font-mono tracking-wider block px-3 mb-1 text-left">
            Core Commerce
          </span>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentAdminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-[13px] font-normal tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-stone-100 text-stone-950 shadow-sm font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
                id={`admin-sib-btn-${item.id}`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0 text-orange-600" />
                <span>{item.name}</span>
              </button>
            );
          })}

          <div className="pt-4 pb-1">
            <span className="text-[12px] uppercase font-extrabold text-stone-500 font-mono tracking-wider block px-3 mb-1 text-left">
              Utsav Planner (Mithila)
            </span>
          </div>
          {plannerItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentAdminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-[13px] font-normal tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-stone-100 text-stone-950 shadow-sm font-bold'
                    : 'text-stone-650 hover:text-stone-900 hover:bg-stone-50'
                }`}
                id={`admin-sib-btn-${item.id}`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Exit Control Panel */}
      <div className="p-4 border-t border-stone-100 space-y-3">
        <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200/80 text-[12px] text-stone-600 text-left">
          <ShieldAlert className="w-4 h-4 text-red-650 shrink-0" />
          <span>Role: Root Administrator (Satvik Level 5)</span>
        </div>
        
        <button
          onClick={onExitAdmin}
          className="w-full py-2.5 bg-stone-100 hover:bg-stone-205 rounded-xl text-[14px] font-bold tracking-wider text-stone-700 hover:text-stone-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
          id="btn-admin-exit"
        >
          <ArrowLeft className="w-4 h-4 text-black" />
          <span>Exit Suite</span>
        </button>
      </div>

    </aside>
  );
};
