import React, { useState, useEffect } from 'react';
import { ChefHat, Plus, Trash2, Calendar, Users, Scale, AlertCircle, ShoppingBag, Sparkles } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  category: 'Starter' | 'Main Course' | 'Breads' | 'Dessert' | 'Beverage';
  estimatedServingPerGuest: number; // e.g. 1.2 servings
  // Ingredient per guest ratios
  paneerRatioGrams: number;
  basmatiRiceRatioGrams: number;
  cowGheeRatioGrams: number;
  flourRatioGrams: number;
  sugarRatioGrams: number;
  milkYogurtRatioLiters: number;
  spicesRatioGrams: number;
}

interface FeastDayPlan {
  id: string;
  date: string;
  mealType: 'Breakfast' | 'Lunch' | 'High Tea' | 'Dinner';
  expectedGuests: number;
  menuItems: MenuItem[];
}

const PRE_SEEDED_MENU_ITEMS: MenuItem[] = [
  { id: 'men-1', name: 'Kesari Kaju Katli (Sweets)', category: 'Dessert', estimatedServingPerGuest: 1.5, paneerRatioGrams: 0, basmatiRiceRatioGrams: 0, cowGheeRatioGrams: 5, flourRatioGrams: 0, sugarRatioGrams: 100, milkYogurtRatioLiters: 0, spicesRatioGrams: 2 },
  { id: 'men-2', name: 'Saffron Veg Dum Biryani', category: 'Main Course', estimatedServingPerGuest: 1.2, paneerRatioGrams: 30, basmatiRiceRatioGrams: 150, cowGheeRatioGrams: 20, flourRatioGrams: 0, sugarRatioGrams: 0, milkYogurtRatioLiters: 0.05, spicesRatioGrams: 15 },
  { id: 'men-3', name: 'Shahi Paneer Deluxe Curry', category: 'Main Course', estimatedServingPerGuest: 1.0, paneerRatioGrams: 120, basmatiRiceRatioGrams: 0, cowGheeRatioGrams: 15, flourRatioGrams: 0, sugarRatioGrams: 5, milkYogurtRatioLiters: 0.1, spicesRatioGrams: 12 },
  { id: 'men-4', name: 'Crispy Butter Puris Basket', category: 'Breads', estimatedServingPerGuest: 4.0, paneerRatioGrams: 0, basmatiRiceRatioGrams: 0, cowGheeRatioGrams: 10, flourRatioGrams: 120, sugarRatioGrams: 0, milkYogurtRatioLiters: 0, spicesRatioGrams: 2 },
  { id: 'men-5', name: 'Utsav Special Cardamom Lassi', category: 'Beverage', estimatedServingPerGuest: 1.0, paneerRatioGrams: 0, basmatiRiceRatioGrams: 0, cowGheeRatioGrams: 0, flourRatioGrams: 0, sugarRatioGrams: 40, milkYogurtRatioLiters: 0.25, spicesRatioGrams: 1 }
];

const DEFAULT_FEAST_PLANS: FeastDayPlan[] = [
  {
    id: 'fst-1',
    date: '2026-11-10',
    mealType: 'Dinner',
    expectedGuests: 180,
    menuItems: [
      PRE_SEEDED_MENU_ITEMS[1], // Biryani
      PRE_SEEDED_MENU_ITEMS[3], // Puris
      PRE_SEEDED_MENU_ITEMS[4]  // Lassi
    ]
  },
  {
    id: 'fst-2',
    date: '2026-11-12',
    mealType: 'Dinner',
    expectedGuests: 350,
    menuItems: [
      PRE_SEEDED_MENU_ITEMS[0], // Kaju Katli
      PRE_SEEDED_MENU_ITEMS[1], // Biryani
      PRE_SEEDED_MENU_ITEMS[2], // Paneer
      PRE_SEEDED_MENU_ITEMS[3]  // Puris
    ]
  }
];

export const PlannerFeast: React.FC = () => {
  const [plans, setPlans] = useState<FeastDayPlan[]>(() => {
    const saved = localStorage.getItem('utsav_planner_feast');
    return saved ? JSON.parse(saved) : DEFAULT_FEAST_PLANS;
  });

  const [allItems] = useState<MenuItem[]>(PRE_SEEDED_MENU_ITEMS);

  // Form Inputs
  const [fDate, setFDate] = useState('');
  const [fMealType, setFMealType] = useState<'Breakfast' | 'Lunch' | 'High Tea' | 'Dinner'>('Dinner');
  const [fExpectedGuests, setFExpectedGuests] = useState('250');
  const [selectedItemsIds, setSelectedItemsIds] = useState<string[]>([]);

  // Item custom ratio add state
  const [customItemName, setCustomItemName] = useState('');
  const [customItemCat, setCustomItemCat] = useState<'Starter' | 'Main Course' | 'Breads' | 'Dessert' | 'Beverage'>('Main Course');
  const [customPaneerG, setCustomPaneerG] = useState('0');
  const [customRiceG, setCustomRiceG] = useState('0');
  const [customGheeG, setCustomGheeG] = useState('0');
  const [customFlourG, setCustomFlourG] = useState('0');
  const [customSugarG, setCustomSugarG] = useState('0');
  const [customMilkL, setCustomMilkL] = useState('0');
  const [customSpicesG, setCustomSpicesG] = useState('0');

  useEffect(() => {
    localStorage.setItem('utsav_planner_feast', JSON.stringify(plans));
  }, [plans]);

  const handleSelectItemToggle = (id: string) => {
    if (selectedItemsIds.includes(id)) {
      setSelectedItemsIds(selectedItemsIds.filter(i => i !== id));
    } else {
      setSelectedItemsIds([...selectedItemsIds, id]);
    }
  };

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fDate || selectedItemsIds.length === 0) {
      alert('Please select at least one menu item.');
      return;
    }

    const compiledItems = allItems.filter(item => selectedItemsIds.includes(item.id));
    const newPlan: FeastDayPlan = {
      id: `fst-${Date.now()}`,
      date: fDate,
      mealType: fMealType,
      expectedGuests: parseInt(fExpectedGuests, 10) || 100,
      menuItems: compiledItems
    };

    setPlans([...plans, newPlan]);
    setFDate('');
    setSelectedItemsIds([]);
  };

  const handleDeletePlan = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
  };

  // RAW MATERIAL INGREDIENT ESTIMATION AGGREGATOR ENGINE
  const calculateTotalIngredients = () => {
    let totalPaneerKG = 0;
    let totalRiceKG = 0;
    let totalGheeKG = 0;
    let totalFlourKG = 0;
    let totalSugarKG = 0;
    let totalMilkYogurtLiters = 0;
    let totalSpicesKG = 0;

    plans.forEach(plan => {
      const guests = plan.expectedGuests;
      plan.menuItems.forEach(item => {
        const factor = item.estimatedServingPerGuest; // serves multiplier
        
        // Sum ratios
        totalPaneerKG += (item.paneerRatioGrams * guests * factor) / 1000;
        totalRiceKG += (item.basmatiRiceRatioGrams * guests * factor) / 1000;
        totalGheeKG += (item.cowGheeRatioGrams * guests * factor) / 1000;
        totalFlourKG += (item.flourRatioGrams * guests * factor) / 1000;
        totalSugarKG += (item.sugarRatioGrams * guests * factor) / 1000;
        totalMilkYogurtLiters += item.milkYogurtRatioLiters * guests * factor;
        totalSpicesKG += (item.spicesRatioGrams * guests * factor) / 1000;
      });
    });

    return {
      paneer: Math.ceil(totalPaneerKG),
      rice: Math.ceil(totalRiceKG),
      ghee: Math.ceil(totalGheeKG),
      flour: Math.ceil(totalFlourKG),
      sugar: Math.ceil(totalSugarKG),
      milk: Math.ceil(totalMilkYogurtLiters),
      spices: Math.ceil(totalSpicesKG)
    };
  };

  const rawMaterials = calculateTotalIngredients();

  return (
    <div className="space-y-8 pb-12" id="planner-feast-root">
      
      {/* Ingredient Autocalculator Display Board */}
      <div className="bg-white dark:bg-stone-800 border bg-gradient-to-br from-white to-stone-50/10 dark:from-stone-800 dark:to-stone-900 border-orange-600/30 rounded-3xl p-6 text-stone-900 dark:text-white shadow-sm relative overflow-hidden" id="ingredient-autocalc-board">
        <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.03] dark:opacity-5 pointer-events-none">
          <ChefHat className="w-full h-full text-orange-600" />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-stone-100 dark:border-stone-700/60 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-orange-600 text-white font-black text-[9px] uppercase tracking-wider rounded-md">
                Master Auto-calc engine
              </span>
              <span className="text-orange-600 font-mono text-[10px] uppercase font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-spin text-orange-600" />
                Raw Ingredient Demand Chart
              </span>
            </div>
            <h2 className="text-xl font-black mt-1 uppercase tracking-tight text-stone-900 dark:text-white">Catering Raw Materials Aggregation</h2>
            <p className="text-xs text-stone-600 dark:text-stone-300 max-w-xl">
              This panel automatically aggregates flour, milk, spices, basmati rice, ghee and paneer weights in real-time by multiplying meal plans, item recipes, and expected headcounts.
            </p>
          </div>
          <div className="text-right">
            <span className="text-stone-500 dark:text-stone-400 text-[10px] uppercase block font-mono">Total Meal Plans Loaded</span>
            <span className="text-2xl font-black text-orange-600">{plans.length} Slots</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-7 gap-3 text-center">
          <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-200/40 dark:border-stone-700/50">
            <span className="text-[9px] uppercase font-mono font-bold text-stone-500 dark:text-stone-400 block">Basmati Rice</span>
            <b className="text-base text-orange-655 block mt-1">{rawMaterials.rice} <span className="text-xs font-normal text-stone-500 dark:text-stone-400">KG</span></b>
            <span className="text-[8px] text-stone-400 dark:text-stone-500 block uppercase font-mono tracking-widest mt-1">Scented Rice</span>
          </div>
          <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-200/40 dark:border-stone-700/50">
            <span className="text-[9px] uppercase font-mono font-bold text-stone-500 dark:text-stone-400 block">Royal Ghee</span>
            <b className="text-base text-orange-655 block mt-1">{rawMaterials.ghee} <span className="text-xs font-normal text-stone-500 dark:text-stone-400">KG</span></b>
            <span className="text-[8px] text-stone-400 dark:text-stone-500 block uppercase font-mono tracking-widest mt-1">Pure Cow Ghee</span>
          </div>
          <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-200/40 dark:border-stone-700/50">
            <span className="text-[9px] uppercase font-mono font-bold text-stone-500 dark:text-stone-400 block">Fresh Paneer</span>
            <b className="text-base text-orange-655 block mt-1">{rawMaterials.paneer} <span className="text-xs font-normal text-stone-500 dark:text-stone-400">KG</span></b>
            <span className="text-[8px] text-stone-400 dark:text-stone-500 block uppercase font-mono tracking-widest mt-1">Cottage Cheese</span>
          </div>
          <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-200/40 dark:border-stone-700/50">
            <span className="text-[9px] uppercase font-mono font-bold text-stone-500 dark:text-stone-400 block">Maida / Flour</span>
            <b className="text-base text-orange-655 block mt-1">{rawMaterials.flour} <span className="text-xs font-normal text-stone-500 dark:text-stone-400">KG</span></b>
            <span className="text-[8px] text-stone-400 dark:text-stone-500 block uppercase font-mono tracking-widest mt-1">Wheat Base</span>
          </div>
          <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-200/40 dark:border-stone-700/50">
            <span className="text-[9px] uppercase font-mono font-bold text-stone-500 dark:text-stone-400 block">Pure Sugar</span>
            <b className="text-base text-orange-655 block mt-1">{rawMaterials.sugar} <span className="text-xs font-normal text-stone-500 dark:text-stone-400">KG</span></b>
            <span className="text-[8px] text-stone-400 dark:text-stone-500 block uppercase font-mono tracking-widest mt-1">Sweets / Syrup</span>
          </div>
          <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-200/40 dark:border-stone-700/50">
            <span className="text-[9px] uppercase font-mono font-bold text-stone-500 dark:text-stone-400 block">Milk / Dairy</span>
            <b className="text-base text-orange-655 block mt-1">{rawMaterials.milk} <span className="text-xs font-normal text-stone-500 dark:text-stone-400">Litres</span></b>
            <span className="text-[8px] text-stone-400 dark:text-stone-500 block uppercase font-mono tracking-widest mt-1">Yogurt/Cream</span>
          </div>
          <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-200/40 dark:border-stone-700/50">
            <span className="text-[9px] uppercase font-mono font-bold text-stone-500 dark:text-stone-400 block">Royal Spices</span>
            <b className="text-base text-orange-655 block mt-1">{rawMaterials.spices} <span className="text-xs font-normal text-stone-500 dark:text-stone-400">KG</span></b>
            <span className="text-[8px] text-stone-400 dark:text-stone-500 block uppercase font-mono tracking-widest mt-1">Cardamom/Masala</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Add Plan Form & Active Meal plans list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        
        {/* Feast Planners Creator Form */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-5">
          <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white pb-3 border-b border-light-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-600" />
            <span>Schedule Feast Day</span>
          </h3>

          <form onSubmit={handleAddPlan} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Feast Date</label>
              <input
                type="date"
                value={fDate}
                onChange={e => setFDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 focus:outline-none focus:ring-1 focus ring-orange-500 text-stone-900 dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Meal category</label>
                <select
                  value={fMealType}
                  onChange={e => setFMealType(e.target.value as any)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="High Tea">High Tea</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1">Exp. Headcount</label>
                <input
                  type="number"
                  placeholder="Expected count"
                  value={fExpectedGuests}
                  onChange={e => setFExpectedGuests(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50"
                  required
                />
              </div>
            </div>

            {/* Menu checklist */}
            <div>
              <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-1.5">Compose Menu Items</label>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto border rounded-lg p-2.5 bg-stone-50 dark:bg-stone-900">
                {allItems.map(item => (
                  <label key={item.id} className="flex items-center gap-2 text-xs p-1 cursor-pointer select-none text-stone-700 dark:text-stone-300 hover:text-stone-950">
                    <input
                      type="checkbox"
                      checked={selectedItemsIds.includes(item.id)}
                      onChange={() => handleSelectItemToggle(item.id)}
                      className="rounded border-stone-300 text-orange-600 focus:ring-orange-600 w-3.5 h-3.5"
                    />
                    <div className="flex justify-between w-full">
                      <b>{item.name}</b>
                      <span className="text-[9px] font-mono font-bold text-orange-600">({item.category})</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Record Feast Day</span>
            </button>
          </form>
        </div>

        {/* Active Feast Schedules */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white pb-3 border-b border-light-100">
            Active Feast & Meal Planners
          </h3>

          {plans.length === 0 ? (
              <div className="text-center py-12 text-stone-400">
                <AlertCircle className="w-8 h-8 mx-auto text-orange-605 opacity-60 mb-2" />
              <p className="text-xs font-bold uppercase tracking-wider">No Scheduled Feasts</p>
              <p className="text-[10px] mt-1">Configure kitchen days on the left to activate auto ingredient scaling.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map(plan => (
                <div key={plan.id} className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 flex flex-col justify-between gap-3 text-left">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2 py-0.5 rounded bg-orange-600 text-white font-mono font-bold text-[9px] uppercase tracking-wider">
                        🍛 {plan.mealType}
                      </span>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="p-1 hover:bg-stone-200 text-stone-400 hover:text-red-500 rounded"
                        title="Delete scheduling"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between">
                      <h4 className="text-sm font-extrabold text-stone-800 dark:text-white">{plan.date}</h4>
                      <div className="flex items-center gap-1 font-mono text-xs font-bold text-orange-655">
                        <Users className="w-3.5 h-3.5" />
                        <span>{plan.expectedGuests} Guests</span>
                      </div>
                    </div>

                    {/* Food list */}
                    <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700 space-y-1.5">
                      <span className="text-[9px] uppercase font-bold text-stone-400 block tracking-widest font-mono">Kitchen Menu</span>
                      <ul className="space-y-1">
                        {plan.menuItems.map((menuItem, idx) => (
                          <li key={idx} className="text-xs flex justify-between text-stone-700 dark:text-stone-300">
                            <span>🔹 {menuItem.name}</span>
                            <span className="text-[10px] font-bold font-mono text-stone-400">x{menuItem.estimatedServingPerGuest} serves/head</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Quantity estimates box */}
                  <div className="p-2.5 bg-orange-600/5 dark:bg-orange-600/10 rounded-lg text-[10px] text-stone-500 flex justify-between items-center">
                    <span className="font-bold">Raw Spices & Dry Fruits Estimate:</span>
                    <b className="font-mono text-orange-600">
                      ~{Math.ceil(plan.menuItems.reduce((acc, item) => acc + (item.spicesRatioGrams * plan.expectedGuests * item.estimatedServingPerGuest) / 1000, 0))} KG
                    </b>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
