import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Card } from '@/modules/events/components/Card';
import { PageLayout } from '@/modules/events/components/PageLayout';
import { EventPlanningGate } from '@/modules/events/components/EventPlanningGate';
import { ClothingPlan, eventModuleApi } from '../api/eventApi';
import { useEventWorkspace } from '../context';

export function ClothingPage() {
  const { selectedEventId } = useEventWorkspace();
  const [plan, setPlan] = useState<ClothingPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlan = useCallback(async () => {
    if (!selectedEventId) return;
    setIsLoading(true);
    setError(null);
    try {
      setPlan(await eventModuleApi.getClothingPlan(selectedEventId));
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setError(message || 'Failed to load clothing plan');
    } finally {
      setIsLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  const updatePurchased = async (itemName: string, purchased: number) => {
    if (!selectedEventId) return;
    try {
      const updated = await eventModuleApi.updateClothingItem(selectedEventId, itemName, { purchased });
      setPlan(updated);
    } catch {
      setError('Failed to update clothing item');
    }
  };

  return (
    <PageLayout title="Clothing Allocation Matrix" subtitle="Coordinate traditional ethnic wear for family members">
      <EventPlanningGate isLoading={isLoading} error={error} onRetry={loadPlan}>
        {plan && (
          <>
            <div className="flex justify-end">
              <button onClick={loadPlan} className="btn-secondary">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--app-fg)]">{plan.totals.required}</div>
                  <div className="text-sm text-[var(--app-fg-muted)] mt-1">Total Items Required</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{plan.totals.purchased}</div>
                  <div className="text-sm text-[var(--app-fg-muted)] mt-1">Items Purchased</div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="font-semibold text-[var(--app-fg)] mb-4">Clothing Status</h2>
              <div className="space-y-4">
                {plan.items.map((item) => (
                  <div key={item.item}>
                    <div className="flex justify-between mb-2 gap-3 flex-wrap">
                      <span className="text-sm font-medium text-[var(--app-fg)]">{item.item}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={item.required}
                          value={item.purchased}
                          onChange={(event) => updatePurchased(item.item, Number(event.target.value))}
                          className="input-theme w-20 text-sm"
                        />
                        <span className="text-xs text-[var(--app-fg-muted)]">/ {item.required} Purchased</span>
                      </div>
                    </div>
                    <div className="w-full bg-[var(--surface-muted)] rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
                        style={{ width: `${item.required > 0 ? (item.purchased / item.required) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-semibold text-[var(--app-fg)] mb-4">Distribution List</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--panel-border)]">
                      <th className="text-left py-2 px-2 font-medium text-[var(--app-fg)]">Family</th>
                      <th className="text-center py-2 px-2 font-medium text-[var(--app-fg)]">Saris</th>
                      <th className="text-center py-2 px-2 font-medium text-[var(--app-fg)]">Kurtas</th>
                      <th className="text-center py-2 px-2 font-medium text-[var(--app-fg)]">Dhotis</th>
                      <th className="text-center py-2 px-2 font-medium text-[var(--app-fg)]">Sherwanis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.distributions.map((dist) => (
                      <tr key={dist.family} className="border-b border-[var(--panel-border)]">
                        <td className="py-3 px-2 text-[var(--app-fg-muted)]">{dist.family}</td>
                        <td className="py-3 px-2 text-center text-[var(--app-fg)]">{dist.saris}</td>
                        <td className="py-3 px-2 text-center text-[var(--app-fg)]">{dist.kurtas}</td>
                        <td className="py-3 px-2 text-center text-[var(--app-fg)]">{dist.dhotis}</td>
                        <td className="py-3 px-2 text-center text-[var(--app-fg)]">{dist.sherwanis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </EventPlanningGate>
    </PageLayout>
  );
}
