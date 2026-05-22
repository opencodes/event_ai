import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Card } from '@/modules/events/components/Card';
import { PageLayout } from '@/modules/events/components/PageLayout';
import { EventPlanningGate } from '@/modules/events/components/EventPlanningGate';
import { BhojPlan, eventModuleApi } from '../api/eventApi';
import { useEventWorkspace } from '../context';

export function BhojPage() {
  const { selectedEventId } = useEventWorkspace();
  const [plan, setPlan] = useState<BhojPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlan = useCallback(async () => {
    if (!selectedEventId) return;
    setIsLoading(true);
    setError(null);
    try {
      setPlan(await eventModuleApi.getBhojPlan(selectedEventId));
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setError(message || 'Failed to load bhoj plan');
    } finally {
      setIsLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  const updateQuantity = async (category: string, quantity: number) => {
    if (!selectedEventId) return;
    try {
      const updated = await eventModuleApi.updateBhojIngredient(selectedEventId, category, { quantity });
      setPlan(updated);
    } catch {
      setError('Failed to update ingredient');
    }
  };

  const maxIngredientQty = plan?.ingredients.reduce((max, row) => Math.max(max, row.quantity), 0) ?? 200;

  return (
    <PageLayout title="Bhoj Procurement Calculator" subtitle="Formula-driven bulk grocery inventory planner">
      <EventPlanningGate isLoading={isLoading} error={error} onRetry={loadPlan}>
        {plan && (
          <>
            <div className="flex justify-end">
              <button onClick={loadPlan} className="btn-secondary">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>

            <Card className="p-6">
              <h2 className="font-semibold text-[var(--app-fg)] mb-4">Person Count Summary</h2>
              <div className="space-y-3">
                {plan.person_summary.map((person) => (
                  <div key={person.category} className="flex justify-between items-center">
                    <span className="text-[var(--app-fg-muted)]">{person.category}</span>
                    <span className="font-semibold text-[var(--app-fg)]">{person.count}</span>
                  </div>
                ))}
                <div className="border-t border-[var(--panel-border)] pt-3 flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span className="text-lg text-green-600 dark:text-green-400">{plan.total_headcount}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-semibold text-[var(--app-fg)] mb-4">Bhoj Items</h2>
              <div className="space-y-4">
                {plan.meals.map((bhoj) => (
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

            <Card className="p-6">
              <h2 className="font-semibold text-[var(--app-fg)] mb-4">Bhoj Ingredient Summary</h2>
              <div className="space-y-4">
                {plan.ingredients.map((ing) => (
                  <div key={ing.category}>
                    <div className="flex justify-between mb-2 gap-3 flex-wrap">
                      <span className="text-sm font-medium text-[var(--app-fg)]">{ing.category}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          value={ing.quantity}
                          onChange={(event) => updateQuantity(ing.category, Number(event.target.value))}
                          className="input-theme w-24 text-sm"
                        />
                        <span className="text-sm font-semibold text-[var(--app-fg)]">{ing.unit}</span>
                      </div>
                    </div>
                    <div className="w-full bg-[var(--surface-muted)] rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full"
                        style={{ width: `${maxIngredientQty > 0 ? (ing.quantity / maxIngredientQty) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </EventPlanningGate>
    </PageLayout>
  );
}
