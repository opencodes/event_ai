import { Card } from '@/modules/events/components/Card';
import { PageLayout } from '@/modules/events/components/PageLayout';

export function BhojPage() {
  const personSummary = [
    { category: 'Within Family', count: 30 },
    { category: 'Extended Family', count: 20 },
    { category: 'Friends', count: 15 },
    { category: 'Colleagues', count: 10 },
    { category: 'Village Community', count: 25 },
  ];

  const bhojItems = [
    { day: 'Day 1', type: 'Maithila Bhoj (Pure Vegetarian)', items: ['Sabji 1 Aloo Baingan', 'Sabji 2 Kaddu', 'Sabji 3 Bhindi', 'Rice Basmati', 'Daal Tadka', 'Rasgulla', 'Dahi', 'Chini'] },
  ];

  const ingredients = [
    { category: 'Grains', quantity: 200, unit: 'kg' },
    { category: 'Spices', quantity: 50, unit: 'kg' },
    { category: 'Dairy', quantity: 100, unit: 'liters' },
    { category: 'Vegetables', quantity: 150, unit: 'kg' },
  ];

  return (
    <PageLayout title="Bhoj Procurement Calculator" subtitle="Formula-driven bulk grocery inventory planner">
      {/* Person Count Summary */}
      <Card className="p-6">
        <h2 className="font-semibold text-[var(--app-fg)] mb-4">Person Count Summary</h2>
        <div className="space-y-3">
          {personSummary.map((person) => (
            <div key={person.category} className="flex justify-between items-center">
              <span className="text-[var(--app-fg-muted)]">{person.category}</span>
              <span className="font-semibold text-[var(--app-fg)]">{person.count}</span>
            </div>
          ))}
          <div className="border-t border-[var(--panel-border)] pt-3 flex justify-between items-center font-semibold">
            <span>Total</span>
            <span className="text-lg text-green-600 dark:text-green-400">100</span>
          </div>
        </div>
      </Card>

      {/* Bhoj Items */}
      <Card className="p-6">
        <h2 className="font-semibold text-[var(--app-fg)] mb-4">Bhoj Items</h2>
        <div className="space-y-4">
          {bhojItems.map((bhoj) => (
            <div key={bhoj.day}>
              <h3 className="font-medium text-[var(--app-fg)] mb-2">{bhoj.day}: {bhoj.type}</h3>
              <div className="grid grid-cols-2 gap-2">
                {bhoj.items.map((item) => (
                  <div key={item} className="text-sm text-[var(--app-fg-muted)] px-3 py-2 bg-[var(--surface-muted)] rounded">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Ingredient Summary */}
      <Card className="p-6">
        <h2 className="font-semibold text-[var(--app-fg)] mb-4">Bhoj Ingredient Summary</h2>
        <div className="space-y-4">
          {ingredients.map((ing) => (
            <div key={ing.category}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-[var(--app-fg)]">{ing.category}</span>
                <span className="text-sm font-semibold text-[var(--app-fg)]">{ing.quantity} {ing.unit}</span>
              </div>
              <div className="w-full bg-[var(--surface-muted)] rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full" 
                  style={{ width: `${(ing.quantity / 200) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PageLayout>
  );
}
