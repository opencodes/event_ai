import React, { useState } from 'react';
import { User, MapPin, History, Wallet, Award, Settings, Plus, RotateCcw, MessageSquare, CreditCard, LifeBuoy } from 'lucide-react';
import { UserProfile, SavedAddress } from '../../types';
import { AnimatedDiya } from './GoldenDeco';

interface UserProfilePageProps {
  userProfile: UserProfile;
  onUpdateWallet: (newBalance: number) => void;
  onNavigate: (page: string) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ userProfile, onUpdateWallet, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'wallet' | 'addresses' | 'support' | 'settings'>('orders');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newType, setNewType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addresses, setAddresses] = useState<SavedAddress[]>(userProfile.addresses);

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(topUpAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid amount to top up.');
      return;
    }
    const newBal = userProfile.walletBalance + amt;
    onUpdateWallet(newBal);
    setTopUpAmount('');
    alert(`Success! Credited ₹${amt} in your Shree Wallet. New Balance: ₹${newBal}`);
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStreet.trim() === '') return;
    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      type: newType,
      addressLine: newStreet,
      city: 'Noida, UP',
    };
    setAddresses([...addresses, newAddr]);
    setNewStreet('');
    alert('Address saved securely. Happy festive dining!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen bg-stone-50 dark:bg-stone-900 text-left" id="profile-container">
      
      {/* 1. TOP USER HERO BLOCK */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-center gap-6 border border-stone-700 shadow-xl" id="profile-header-card">
        <div className="flex items-center gap-4 text-left">
          <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-red-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg shrink-0">
            🦁
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">{userProfile.name}</h2>
            <p className="text-stone-400 text-xs sm:text-sm font-semibold">{userProfile.email} | {userProfile.phone}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
              <span className="bg-orange-600 px-2 py-0.5 rounded font-bold font-mono uppercase text-white">
                Festive Premium Member
              </span>
              <span className="text-amber-400 font-bold">
                ⭐ Verified Account Verified
              </span>
            </div>
          </div>
        </div>

        {/* Live Wallet & Loyalty display widgets */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-center bg-stone-850 p-3 sm:p-4 rounded-xl border border-stone-700 text-stone-200">
            <div className="text-[10px] font-bold text-amber-500 uppercase font-mono tracking-widest">
              Shree Wallet
            </div>
            <div className="text-xl font-black text-white mt-0.5">₹{userProfile.walletBalance}</div>
            <div className="text-[9px] text-stone-400">Primary Balance</div>
          </div>

          <div className="text-center bg-stone-850 p-3 sm:p-4 rounded-xl border border-stone-700 text-stone-200">
            <div className="text-[10px] font-bold text-amber-500 uppercase font-mono tracking-widest">
              Utsav Points
            </div>
            <div className="text-xl font-black text-amber-400 mt-0.5">{userProfile.royaltyPoints} pts</div>
            <div className="text-[9px] text-stone-400">Loyalty Rewards</div>
          </div>
        </div>
      </div>

      {/* 2. TABBED METADATA INTERFACE */}
      <div className="grid md:grid-cols-4 gap-8">
        
        {/* Navigation sidebar */}
        <div className="space-y-1.5 self-start bg-white dark:bg-stone-850 p-2 rounded-2xl shadow border border-orange-100/40 dark:border-stone-800" id="profile-navigation-panel">
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
              activeTab === 'orders'
                ? 'bg-orange-600 text-white'
                : 'text-stone-700 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Orders History ({userProfile.orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
              activeTab === 'wallet'
                ? 'bg-orange-600 text-white'
                : 'text-stone-700 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-800'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Wallet & Saffron Credit</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
              activeTab === 'addresses'
                ? 'bg-orange-600 text-white'
                : 'text-stone-700 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
              activeTab === 'support'
                ? 'bg-orange-600 text-white'
                : 'text-stone-700 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Support Tickets</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
              activeTab === 'settings'
                ? 'bg-orange-600 text-white'
                : 'text-stone-700 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>

        </div>

        {/* Detail Display view space */}
        <div className="md:col-span-3">
          
          {/* TAB 1: ORDER HISTORY LOG */}
          {activeTab === 'orders' && (
            <div className="space-y-4" id="view-orders-history">
              <h3 className="text-lg font-black text-stone-900 dark:text-white mb-2">
                Sacred Food History Log
              </h3>
              
              {userProfile.orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white dark:bg-stone-850 p-5 rounded-2xl border border-orange-100/35 dark:border-stone-800 shadow-sm space-y-4 text-left"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-3 border-stone-105 dark:border-stone-800">
                    <div className="flex items-center gap-3">
                      <img
                        src={ord.restaurantImage}
                        alt={ord.restaurantName}
                        className="w-10 h-10 object-cover rounded-lg shrink-0 border dark:border-stone-800"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-extrabold text-sm text-stone-905 dark:text-stone-100">
                          {ord.restaurantName}
                        </h4>
                        <span className="text-[11px] text-stone-400 font-mono">{ord.date}</span>
                      </div>
                    </div>

                    {/* Status design */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-stone-400 font-bold">{ord.id}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded ${
                          ord.status === 'Delivered'
                            ? 'bg-green-100 text-green-700'
                            : ord.status === 'Cancelled'
                            ? 'bg-red-105 text-red-650'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                  </div>

                  {/* Items loop */}
                  <ul className="space-y-1">
                    {ord.items.map((it, idx) => (
                      <li key={idx} className="text-xs text-stone-600 dark:text-stone-300 flex justify-between">
                        <span>
                          {it.name} <b className="text-orange-600 font-black">x{it.quantity}</b>
                        </span>
                        <span>₹{it.price * it.quantity}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between border-t border-dashed border-stone-200 dark:border-stone-700 pt-3 text-xs font-bold text-stone-700 dark:text-stone-300">
                    <div>
                      <span>Total debited limit: <b className="text-stone-900 dark:text-white font-black text-sm">₹{ord.totalAmount}</b></span>
                    </div>

                    {/* Action button inside order card */}
                    {ord.status === 'Delivered' && (
                      <button
                        onClick={() => alert('Feature incoming! Our delivery agent says namaste.')}
                        className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 hover:bg-orange-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:text-orange-600 font-bold text-[11px] rounded transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder Feast</span>
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* TAB 2: WALLET MANAGEMENT */}
          {activeTab === 'wallet' && (
            <div className="bg-white dark:bg-stone-850 p-6 rounded-2xl border border-orange-100/40 dark:border-stone-800 shadow-sm space-y-6" id="view-wallet">
              <div className="flex items-center gap-2 border-b pb-4 border-stone-105 dark:border-stone-800">
                <Wallet className="w-5 h-5 text-orange-600 shrink-0" />
                <h3 className="text-lg font-black text-stone-900 dark:text-white">
                  Shree Wallet Cash & Credits
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 items-start">
                {/* Balance display details */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 p-5 rounded-xl text-white shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none">
                      <AnimatedDiya className="w-full h-full" />
                    </div>
                    
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFDFB2]">UTSAV CREDITS DEBIT CHIP</span>
                    <h4 className="text-2xl font-black mt-2">₹{userProfile.walletBalance}</h4>
                    <p className="text-[11px] text-[#FFA26B] mt-1">Certified Satvik Food Limit</p>
                    
                    <div className="mt-4 flex items-center justify-between text-xs font-mono font-black border-t border-white/20 pt-2">
                      <span>GAURAV SHARMA</span>
                      <span>12 / 2030 Exp</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-400">
                    Wallet can be directly used for rapid 1-click checkout. Cancelled orders will credit instantly into this wallet. Perfect for Dussehra festivals!
                  </p>
                </div>

                {/* Top Up Form */}
                <form onSubmit={handleTopUp} className="space-y-4 p-4 rounded-xl border border-dashed border-orange-100 dark:border-stone-750">
                  <h4 className="font-extrabold text-sm text-stone-905 dark:text-stone-250">
                    Add Festive Money to Wallet
                  </h4>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono block">Amount to deposit (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 500, 1000, 2000"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm font-bold placeholder-stone-400 dark:border-stone-700 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-1 focus:ring-orange-500 outline-none"
                    />
                  </div>

                  {/* Hot amounts buttons */}
                  <div className="flex gap-2">
                    {[200, 500, 1000].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setTopUpAmount(v.toString())}
                        className="flex-1 py-1.5 bg-stone-50 dark:bg-stone-900 text-stone-650 hover:bg-orange-50 text-xs font-extrabold rounded-lg border dark:border-stone-700 hover:border-orange-200 transition"
                      >
                        +₹{v}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-orange-600 text-white font-bold text-xs rounded-lg uppercase tracking-wider shadow-md hover:bg-orange-700 shadow-orange-500/20 active:scale-95 transition-all"
                  >
                    Deposit money (Simulate)
                  </button>
                </form>

              </div>
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-white dark:bg-stone-850 p-6 rounded-2xl border border-orange-100/40 dark:border-stone-800 shadow-sm space-y-6" id="view-addresses">
              <div className="flex items-center justify-between border-b pb-4 border-stone-105 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-600 shrink-0" />
                  <h3 className="text-lg font-black text-stone-900 dark:text-white">
                    Saved Delivery Locations
                  </h3>
                </div>
              </div>

              {/* Loop Saved addresses list */}
              <div className="grid gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800 flex justify-between items-center text-left"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white bg-orange-600 px-2.5 py-0.5 rounded uppercase">
                          {addr.type}
                        </span>
                        {addr.landmark && (
                          <span className="text-xs font-semibold text-stone-400">({addr.landmark})</span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {addr.addressLine}
                      </p>
                      <p className="text-xs text-stone-400">{addr.city}</p>
                    </div>

                    <button
                      onClick={() => {
                        setAddresses(addresses.filter((a) => a.id !== addr.id));
                        alert('Address removed.');
                      }}
                      className="text-xs font-bold text-red-656 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              {/* Address Form */}
              <form onSubmit={handleAddNewAddress} className="space-y-4 p-4 border border-dashed rounded-xl border-orange-100 dark:border-stone-750">
                <h4 className="font-extrabold text-sm text-stone-905 dark:text-stone-100 flex items-center gap-1">
                  <Plus className="w-4 h-4 text-orange-605" />
                  <span>Register Another Festive Delivery Station</span>
                </h4>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">Location Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full px-3 py-2 border rounded-lg text-xs font-bold dark:border-stone-700 dark:bg-stone-800 text-stone-900 dark:text-white"
                    >
                      <option value="Home">Home (🏡)</option>
                      <option value="Work">Work (💼)</option>
                      <option value="Other">Other (📍)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">Street Address Line</label>
                    <input
                      type="text"
                      placeholder="Apartment name, building, street, landmark"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-xs font-semibold placeholder-stone-400 dark:border-stone-700 dark:bg-stone-800 text-stone-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs rounded-lg uppercase tracking-wider transition"
                >
                  Save Location
                </button>
              </form>

            </div>
          )}

          {/* TAB 4: SUPPORT */}
          {activeTab === 'support' && (
            <div className="bg-white dark:bg-stone-850 p-6 rounded-2xl border border-orange-100/40 dark:border-stone-800 shadow-sm space-y-6" id="view-support">
              <div className="flex items-center gap-2 border-b pb-4 border-stone-105 dark:border-stone-800">
                <LifeBuoy className="w-5 h-5 text-orange-605 shrink-0" />
                <h3 className="text-lg font-black text-stone-900 dark:text-white">
                  Satvik Quick Support Desk
                </h3>
              </div>

              <div className="space-y-4">
                {userProfile.supportTickets.map((tck) => (
                  <div key={tck.id} className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border text-left space-y-3 dark:border-stone-800">
                    <div className="flex justify-between items-start gap-2 border-b border-stone-200/50 dark:border-stone-800 pb-2">
                      <div>
                        <span className="text-[10px] font-bold font-mono text-orange-605 uppercase">{tck.category}</span>
                        <h4 className="font-extrabold text-sm text-stone-900 dark:text-white mt-1">{tck.subject}</h4>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${tck.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {tck.status}
                      </span>
                    </div>

                    {/* Messages */}
                    <div className="space-y-3 pt-2">
                      {tck.messages.map((m, idx) => (
                        <div key={idx} className={`flex flex-col ${m.sender === 'User' ? 'items-end' : 'items-start'}`}>
                          <div className={`p-3 rounded-xl max-w-sm text-xs leading-relaxed ${
                            m.sender === 'User' 
                              ? 'bg-orange-600 text-white rounded-tr-none' 
                              : 'bg-white dark:bg-stone-800 border dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-tl-none shadow-sm'
                          }`}>
                            <p>{m.text}</p>
                            <span className="text-[9px] block text-right font-light mt-1 opacity-75">{m.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-stone-850 p-6 rounded-2xl border border-orange-100/40 dark:border-stone-800 shadow-sm space-y-6" id="view-settings">
              <div className="flex items-center gap-2 border-b pb-4 border-stone-105 dark:border-stone-800">
                <Settings className="w-5 h-5 text-orange-605 shrink-0" />
                <h3 className="text-lg font-black text-stone-900 dark:text-white">
                  Satvik Account Controls
                </h3>
              </div>

              <div className="grid gap-4 text-xs font-semibold text-stone-600 dark:text-stone-300">
                <div className="flex justify-between items-center p-3 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg">
                  <div>
                    <h5 className="font-bold text-stone-900 dark:text-white">Push Notifications</h5>
                    <p className="text-[11px] text-stone-400">Receive Diwali reward coupons instantly</p>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-orange-600" />
                </div>

                <div className="flex justify-between items-center p-3 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg">
                  <div>
                    <h5 className="font-bold text-stone-900 dark:text-white">WhatsApp Updates Sync</h5>
                    <p className="text-[11px] text-stone-400">Get order prepare status and live rider ETA list</p>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-orange-600" />
                </div>

                <div className="flex justify-between items-center p-3 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg">
                  <div>
                    <h5 className="font-bold text-stone-900 dark:text-white">Bio ID Login Verification</h5>
                    <p className="text-[11px] text-stone-400">Protect Shree Wallet checkout security</p>
                  </div>
                  <input type="checkbox" className="accent-orange-600" />
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
