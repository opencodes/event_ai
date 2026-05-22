import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Card } from '@/modules/events/components/Card';
import { PageLayout } from '@/modules/events/components/PageLayout';
import { EventPlanningGate } from '@/modules/events/components/EventPlanningGate';
import { GiftingSummary, eventModuleApi } from '../api/eventApi';
import { useEventWorkspace } from '../context';

const formatLakhs = (paise: number) => `₹${(paise / 10000000).toFixed(1)}L`;

export function GiftingPage() {
  const { selectedEventId } = useEventWorkspace();
  const [data, setData] = useState<GiftingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contributorName, setContributorName] = useState('');
  const [amountRupees, setAmountRupees] = useState('');

  const loadGifts = useCallback(async () => {
    if (!selectedEventId) return;
    setIsLoading(true);
    setError(null);
    try {
      setData(await eventModuleApi.listContributions(selectedEventId));
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setError(message || 'Failed to load gifts');
    } finally {
      setIsLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    loadGifts();
  }, [loadGifts]);

  const addContribution = async () => {
    if (!selectedEventId || !contributorName.trim()) return;
    try {
      await eventModuleApi.createContribution(selectedEventId, {
        contributor_name: contributorName.trim(),
        amount_paise: Math.round(Number(amountRupees || 0) * 100),
        type: 'cash',
        status: 'received',
      });
      setContributorName('');
      setAmountRupees('');
      await loadGifts();
    } catch {
      setError('Failed to add contribution');
    }
  };

  const summary = data?.summary;
  const gifts = data?.contributions ?? [];

  return (
    <PageLayout title="Lifafa Gifting Ledger" subtitle="Digital register for tracking traditional custom gifts">
      <EventPlanningGate isLoading={isLoading} error={error} onRetry={loadGifts}>
        {summary && (
          <>
            <div className="flex flex-wrap gap-2 justify-end">
              <input
                value={contributorName}
                onChange={(event) => setContributorName(event.target.value)}
                placeholder="Contributor name"
                className="input-theme min-w-[180px]"
              />
              <input
                value={amountRupees}
                onChange={(event) => setAmountRupees(event.target.value)}
                placeholder="Amount (₹)"
                type="number"
                min={0}
                className="input-theme w-32"
              />
              <button onClick={addContribution} disabled={!contributorName.trim()} className="btn-primary">
                <Plus className="w-4 h-4" />
                <span>Add Gift</span>
              </button>
              <button onClick={loadGifts} className="btn-secondary">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {formatLakhs(summary.total_cash_paise)}
                  </div>
                  <div className="text-sm text-[var(--app-fg-muted)] mt-2">Total Cash Gifts</div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--app-fg)]">{summary.total_physical}</div>
                  <div className="text-sm text-[var(--app-fg-muted)] mt-2">Physical Presents</div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{summary.total_contributors}</div>
                  <div className="text-sm text-[var(--app-fg-muted)] mt-2">Total Contributors</div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="font-semibold text-[var(--app-fg)] mb-4">Gift Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--panel-border)]">
                      <th className="text-left py-3 px-2 font-medium text-[var(--app-fg)]">Contributor Name</th>
                      <th className="text-center py-3 px-2 font-medium text-[var(--app-fg)]">Amount / Gift</th>
                      <th className="text-center py-3 px-2 font-medium text-[var(--app-fg)]">Type</th>
                      <th className="text-center py-3 px-2 font-medium text-[var(--app-fg)]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gifts.map((gift) => (
                      <tr key={gift.id} className="border-b border-[var(--panel-border)] hover:bg-[var(--surface-muted)] transition">
                        <td className="py-3 px-2 text-[var(--app-fg)]">{gift.contributor_name}</td>
                        <td className="py-3 px-2 text-center">
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            ₹{(gift.amount_paise / 100).toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center text-[var(--app-fg-muted)] capitalize">{gift.type}</td>
                        <td className="py-3 px-2 text-center">
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium capitalize">
                            {gift.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 border-2 border-blue-200 dark:border-blue-900">
              <p className="text-sm text-[var(--app-fg)] font-medium mb-2">Reciprocal Social Exchange</p>
              <p className="text-xs text-[var(--app-fg-muted)]">
                Track reciprocal obligations to ensure appropriate return gifts and thank you gestures are maintained for all contributors during future events or occasions.
              </p>
            </Card>
          </>
        )}
      </EventPlanningGate>
    </PageLayout>
  );
}
