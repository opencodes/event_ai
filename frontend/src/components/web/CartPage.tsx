import React, { useState, useMemo } from 'react';
import { ShoppingBag, ArrowLeft, Trash2, MapPin, Gift, Plus, Minus, CreditCard, ChevronRight, CalendarCheck, ShieldAlert } from 'lucide-react';
import { CartItem, SavedAddress, UserProfile } from '../../types';
import { FESTIVE_COUPONS } from '../../data';
import { AnimatedDiya } from './GoldenDeco';

interface CartPageProps {
  cart: CartItem[];
  onNavigate: (page: string, data?: any) => void;
  onAddToCart: (item: any, restId: string, restName: string) => void;
  onRemoveFromCart: (itemId: string) => void;
  onClearCart: () => void;
  userProfile: UserProfile;
  onUpdateWallet: (newBalance: number) => void;
  onAddOrderToHistory: (items: any[], total: number, restName: string, restImg: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cart,
  onNavigate,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  userProfile,
  onUpdateWallet,
  onAddOrderToHistory,
}) => {
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(userProfile.addresses[0]?.id || '');
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [customCouponInput, setCustomCouponInput] = useState('');

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.foodItem.price * item.quantity, 0);
  }, [cart]);

  // Calculations
  const deliveryCharges = cartTotal > 499 ? 0 : 49;
  const platformFees = 15;
  const restaurantGst = Math.round(cartTotal * 0.05); // 5% GST

  const couponDiscount = useMemo(() => {
    if (!activeCoupon) return 0;
    if (activeCoupon === 'DUSSEHRA50') {
      return Math.min(Math.round(cartTotal * 0.5), 120); // 50% discount up to 120
    }
    if (activeCoupon === 'FESTIVEFEAST') {
      return cartTotal >= 499 ? 100 : 0;
    }
    if (activeCoupon === 'WELCOMEUTSAV') {
      return Math.min(Math.round(cartTotal * 0.6), 150); // 60% up to 150
    }
    return 0;
  }, [activeCoupon, cartTotal]);

  const grandTotal = Math.max(0, cartTotal + deliveryCharges + platformFees + restaurantGst - couponDiscount);

  const handleApplyCoupon = (code: string) => {
    setCouponError('');
    const coupon = FESTIVE_COUPONS.find((c) => c.code === code);
    if (!coupon) {
      setCouponError('Invalid coupon code!');
      return;
    }

    if (code === 'FESTIVEFEAST' && cartTotal < 499) {
      setCouponError('Minimum order value for Festive Feast is ₹499!');
      return;
    }

    setActiveCoupon(code);
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    setCouponError('');
  };

  // Checkout trigger
  const handleCheckout = () => {
    if (grandTotal > userProfile.walletBalance) {
      alert(`Insufficient funds in your Shree Wallet (Balance: ₹${userProfile.walletBalance}). Please use the User Profile page settings to top-up, or reduce cart items!`);
      return;
    }

    setIsProcessingCheckout(true);

    // Simulate placing order
    setTimeout(() => {
      // Deduct from wallet
      const newBalance = userProfile.walletBalance - grandTotal;
      onUpdateWallet(newBalance);

      // Map cart to history format
      const historyItems = cart.map((c) => ({
        name: c.foodItem.name,
        quantity: c.quantity,
        price: c.foodItem.price,
      }));

      // Find first rest image/name (since they belong to same restaurant or combined)
      const restName = cart[0]?.restaurantName || 'Kesaria Golden Sweets';
      const restImg = 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=100&auto=format&fit=crop&q=60';

      // Record in history
      onAddOrderToHistory(historyItems, grandTotal, restName, restImg);

      // Clean Cart
      onClearCart();
      setIsProcessingCheckout(false);

      alert(`🪔 Success! Order Placed beautifully! ₹${grandTotal} deducted from Shree Wallet. Track progress inside User Profile.`);
      onNavigate('profile');
    }, 1500);
  };

  const activeAddress = userProfile.addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen bg-stone-50 dark:bg-stone-900 text-left" id="cart-workspace">
      
      {/* Back link */}
      <button
        onClick={() => onNavigate('restaurants')}
        className="flex items-center gap-2 text-sm font-bold text-stone-605 dark:text-stone-300 hover:text-orange-600 transition-colors"
        id="btn-back-to-menu-from-cart"
      >
        <ArrowLeft className="w-4 h-4 text-orange-600" />
        <span>Continue Exploring Food Markets</span>
      </button>

      {cart.length === 0 ? (
        /* Empty Basket State */
        <div className="bg-white dark:bg-stone-850 p-12 rounded-3xl text-center border ring-1 ring-orange-100 max-w-md mx-auto space-y-4" id="cart-empty-state">
          <ShoppingBag className="w-16 h-16 text-orange-600 mx-auto stroke-1" />
          <h3 className="text-xl font-extrabold text-stone-900 dark:text-white">Your Feast Basket is Empty</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Good food is always waiting for validation. Go to the vendor catalog and discover delicious sweets, thalis, and curries!
          </p>
          <button
            onClick={() => onNavigate('restaurants')}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow transition"
          >
            Start Ordering Feasts
          </button>
        </div>
      ) : (
        /* Main Cart Experience */
        <div className="grid md:grid-cols-5 gap-8" id="cart-filled-bento">
          
          {/* LEFT: Items list and Delivery Address (Col span 3) */}
          <div className="md:col-span-3 space-y-6">
            
            {/* Basket items card */}
            <div className="bg-white dark:bg-stone-850 rounded-2xl p-6 border border-orange-100/40 dark:border-stone-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-4 border-stone-102 dark:border-stone-800">
                <h3 className="font-extrabold text-lg text-stone-950 dark:text-white">
                  Cart Items Basket ({cart.length})
                </h3>
                <button
                  onClick={onClearCart}
                  className="text-xs font-bold text-red-650 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>

              {/* Items loop */}
              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {cart.map((item) => (
                  <div key={item.foodItem.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        {item.foodItem.isVeg ? (
                          <span className="w-3.5 h-3.5 rounded border border-green-700 flex items-center justify-center p-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-700 block" />
                          </span>
                        ) : (
                          <span className="w-3.5 h-3.5 rounded border border-red-700 flex items-center justify-center p-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-700 block" />
                          </span>
                        )}
                        <h4 className="font-extrabold text-sm text-stone-900 dark:text-stone-100">
                          {item.foodItem.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-stone-400">
                        Kitchen: {item.restaurantName}
                      </p>
                      <span className="text-xs font-semibold text-orange-605">₹{item.foodItem.price} mỗi phần</span>
                    </div>

                    {/* Quantity Selector controls */}
                    <div className="flex items-center gap-3">
                      <div className="bg-stone-50 dark:bg-stone-800 border dark:border-stone-700 rounded-lg p-1 flex items-center gap-2">
                        <button
                          onClick={() => onRemoveFromCart(item.foodItem.id)}
                          className="p-1 text-stone-400 hover:text-stone-900 dark:hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold font-mono text-stone-905 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onAddToCart(item.foodItem, item.restaurantId, item.restaurantName)}
                          className="p-1 text-orange-600 hover:text-orange-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-black text-sm text-stone-900 dark:text-white min-w-[50px] text-right">
                        ₹{item.foodItem.price * item.quantity}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* 2. DELIVERY ADDRESS CARD */}
            <div className="bg-white dark:bg-stone-850 rounded-2xl p-6 border border-orange-100/40 dark:border-stone-800 shadow-sm space-y-4" id="address-card">
              <div className="flex items-center gap-2 border-b pb-4 border-stone-102 dark:border-stone-800">
                <MapPin className="w-5 h-5 text-orange-600 shrink-0" />
                <h3 className="font-extrabold text-lg text-stone-950 dark:text-white">
                  Selecet Delivery Address
                </h3>
              </div>

              <div className="grid gap-3">
                {userProfile.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      selectedAddressId === addr.id
                        ? 'border-orange-600 bg-orange-50/20 dark:bg-amber-950/10'
                        : 'border-stone-200 dark:border-stone-800 hover:border-orange-200 bg-transparent'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1 accent-orange-600"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white bg-orange-600 px-2 py-0.5 rounded uppercase">
                          {addr.type}
                        </span>
                        {addr.landmark && (
                          <span className="text-[11px] font-medium text-stone-400">({addr.landmark})</span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-200">
                        {addr.addressLine}
                      </p>
                      <p className="text-xs text-stone-400">{addr.city}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: Coupon codes & Bill summary (Col span 2) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* 3. COUPONS BOX */}
            <div className="bg-white dark:bg-stone-850 rounded-2xl p-6 border border-orange-100/40 dark:border-stone-800 shadow-sm space-y-4" id="coupon-box">
              <div className="flex items-center gap-2 border-b pb-4 border-stone-104 dark:border-stone-800">
                <Gift className="w-5 h-5 text-orange-600 shrink-0" />
                <h3 className="font-extrabold text-base text-stone-950 dark:text-white">
                  Coupon Offers & Festivals
                </h3>
              </div>

              {activeCoupon ? (
                /* Coupon Applied State */
                <div className="bg-green-50/60 dark:bg-green-950/20 p-4 rounded-xl border border-green-200 dark:border-green-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-green-700 bg-green-100 dark:bg-green-950/60 px-2 py-0.5 rounded font-mono">
                      APPLIED: {activeCoupon}
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-650 hover:underline font-bold"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-xs text-green-800 dark:text-green-300">
                    Congrats! You saved <span className="font-extrabold">₹{couponDiscount}</span> off this order.
                  </p>
                </div>
              ) : (
                /* Unapplied coupons form */
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER COUPON CODE"
                      value={customCouponInput}
                      onChange={(e) => setCustomCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 border rounded-lg text-xs font-mono font-bold uppercase placeholder-stone-400 dark:border-stone-700 text-stone-900 dark:text-white dark:bg-stone-800"
                    />
                    <button
                      onClick={() => handleApplyCoupon(customCouponInput)}
                      className="px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-lg hover:bg-orange-700 uppercase"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-xs font-medium text-red-650">{couponError}</p>}

                  {/* Quick select coupons list */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest font-mono">
                      Click to Apply Golden Deals
                    </span>
                    <div className="grid gap-2">
                      {FESTIVE_COUPONS.slice(0, 3).map((cpn) => (
                        <div
                          key={cpn.code}
                          onClick={() => handleApplyCoupon(cpn.code)}
                          className="flex justify-between items-center p-2.5 rounded-lg border border-dashed hover:border-orange-500 hover:bg-orange-50/10 cursor-pointer transition-colors text-left"
                        >
                          <div>
                            <span className="text-xs font-black font-mono text-orange-600 dark:text-orange-400">
                              {cpn.code}
                            </span>
                            <p className="text-[10px] text-stone-400 mt-0.5">{cpn.desc}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-stone-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. BILL SUMMARY CARD */}
            <div className="bg-white dark:bg-stone-850 rounded-2xl p-6 border border-orange-100/40 dark:border-stone-800 shadow-sm space-y-4" id="bill-summary-card">
              <h3 className="font-extrabold text-lg text-stone-950 dark:text-white border-b pb-4 border-stone-102 dark:border-stone-800">
                Detailed Billing Summary
              </h3>

              <div className="space-y-3.5 text-xs text-stone-550 dark:text-stone-300 font-medium">
                <div className="flex justify-between">
                  <span>Food Order Item Subtotal</span>
                  <span className="font-bold text-stone-900 dark:text-white">₹{cartTotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Satvik Delivery Partner Charges</span>
                  {deliveryCharges === 0 ? (
                    <span className="text-green-700 dark:text-green-400 font-bold border-b border-dashed border-green-500">FREE OVER ₹499</span>
                  ) : (
                    <span className="font-bold text-stone-900 dark:text-white">₹{deliveryCharges}</span>
                  )}
                </div>

                <div className="flex justify-between">
                  <span>Utsav Platform Fee</span>
                  <span className="font-bold text-stone-900 dark:text-white">₹{platformFees}</span>
                </div>

                <div className="flex justify-between">
                  <span>Festive GST & Kitchen Taxes (5%)</span>
                  <span className="font-bold text-stone-900 dark:text-white">₹{restaurantGst}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-750 font-bold">
                    <span>Coupon Reward Code Savings</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}

                <div className="border-t border-dashed border-stone-200 dark:border-stone-700 pt-4 flex justify-between text-sm text-stone-900 dark:text-white font-black leading-none">
                  <span className="uppercase text-xs tracking-wider">Grand Total (Incl. GST)</span>
                  <span className="text-orange-600 dark:text-orange-400 text-lg">₹{grandTotal}</span>
                </div>
              </div>

              {/* PAYMENT WALLET METHOD & CHECKOUT BUTTON */}
              <div className="pt-4 border-t border-stone-102 dark:border-stone-800 space-y-4">
                
                {/* Wallet Balance Display info */}
                <div className="bg-amber-500/10 p-3.5 rounded-xl border border-amber-300/30 text-xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-600" />
                    <div className="text-left">
                      <b className="font-bold text-amber-900 dark:text-amber-305 block">Shree Wallet Account</b>
                      <span className="text-stone-400 text-[10px]">Primary Active Gateway</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <b className="font-black text-amber-700 dark:text-amber-400 text-sm block">₹{userProfile.walletBalance}</b>
                    {userProfile.walletBalance < grandTotal ? (
                      <span className="text-red-650 text-[9px] font-bold">Needs ₹{grandTotal - userProfile.walletBalance}</span>
                    ) : (
                      <span className="text-green-700 text-[9px] font-semibold">Funds Approved</span>
                    )}
                  </div>
                </div>

                {/* Checkout Submit Trigger Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isProcessingCheckout || userProfile.walletBalance < grandTotal}
                  className="w-full py-4 text-center font-black tracking-wider text-xs uppercase text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-lg hover:shadow-xl active:scale-95 disabled:bg-stone-300 dark:disabled:bg-stone-800 disabled:text-stone-400 disabled:scale-100 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  id="checkout-trigger-button"
                >
                  {isProcessingCheckout ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Placing Sacred Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Place Festive Feast Order &bull; ₹{grandTotal}</span>
                    </>
                  )}
                </button>

                {userProfile.walletBalance < grandTotal && (
                  <div className="flex items-start gap-1 p-2 border border-red-500/20 bg-red-50/10 rounded-lg text-[10px] text-red-650">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Please go to User Profile using navbar dropdown and top-up your Wallet before clicking checkout.</span>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
