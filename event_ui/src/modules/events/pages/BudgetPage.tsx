import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Card } from '@/modules/events/components/Card';
import { PageLayout } from '@/modules/events/components/PageLayout';
import { EventPlanningGate } from '@/modules/events/components/EventPlanningGate';
import { BudgetSummary, ExpenseStatus, eventModuleApi } from '../api/eventApi';
import { useEventWorkspace } from '../context';

const formatLakhs = (paise: number) => `₹${(paise / 10000000).toFixed(1)}L`;
const formatThousands = (paise: number) => `₹${(paise / 100000).toFixed(0)}K`;

const statusOptions: ExpenseStatus[] = ['pending', 'in-progress', 'confirmed'];

export function BudgetPage() {
  const { selectedEventId } = useEventWorkspace();
  const [budget, setBudget] = useState<BudgetSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBudget = useCallback(async () => {
    if (!selectedEventId) return;
    setIsLoading(true);
    setError(null);
    try {
      setBudget(await eventModuleApi.getBudgetSummary(selectedEventId));
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setError(message || 'Failed to load budget');
    } finally {
      setIsLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    loadBudget();
  }, [loadBudget]);

  const updateExpenseStatus = async (expenseId: string, status: ExpenseStatus) => {
    if (!selectedEventId) return;
    try {
      await eventModuleApi.updateExpense(selectedEventId, expenseId, { status });
      await loadBudget();
    } catch {
      setError('Failed to update expense');
    }
  };

  const spentPct = budget && budget.total_paise > 0
    ? (budget.spent_paise / budget.total_paise) * 100
    : 0;

  return (
    <PageLayout title="Budget & Expense Tracker" subtitle="Monitor and control wedding planning finances">
      <EventPlanningGate isLoading={isLoading} error={error} onRetry={loadBudget}>
        {budget && (
          <>
            <div className="flex justify-end">
              <button onClick={loadBudget} className="btn-secondary">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-end flex-wrap gap-4">
                  <div>
                    <p className="text-sm text-[var(--app-fg-muted)] mb-1">Total Budget</p>
                    <p className="text-3xl font-bold text-[var(--app-fg)]">{formatLakhs(budget.total_paise)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--app-fg-muted)] mb-1">Spent</p>
                    <p className="text-2xl font-semibold text-orange-600 dark:text-orange-400">{formatLakhs(budget.spent_paise)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--app-fg-muted)] mb-1">Remaining</p>
                    <p className="text-2xl font-semibold text-green-600 dark:text-green-400">{formatLakhs(budget.remaining_paise)}</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--app-fg)]">Budget Utilization</span>
                    <span className="text-sm font-semibold text-[var(--app-fg)]">{spentPct.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-[var(--surface-muted)] rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full"
                      style={{ width: `${Math.min(spentPct, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-semibold text-[var(--app-fg)] mb-4">Expense Breakdown</h2>
              <div className="space-y-4">
                {budget.expenses.map((expense) => (
                  <div key={expense.id}>
                    <div className="flex justify-between items-center mb-2 gap-3 flex-wrap">
                      <div className="flex-1">
                        <p className="font-medium text-[var(--app-fg)]">{expense.category}</p>
                        <p className="text-xs text-[var(--app-fg-muted)]">{expense.percentage ?? 0}% of total budget</p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <p className="font-semibold text-[var(--app-fg)]">{formatThousands(expense.amount_paise)}</p>
                        <select
                          value={expense.status}
                          onChange={(event) => updateExpenseStatus(expense.id, event.target.value as ExpenseStatus)}
                          className="input-theme text-xs min-w-[120px]"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="w-full bg-[var(--surface-muted)] rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full"
                        style={{ width: `${Math.min(expense.percentage ?? 0, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <p className="text-sm text-[var(--app-fg-muted)]">Total Expense</p>
                <p className="text-2xl font-bold text-[var(--app-fg)] mt-2">{formatLakhs(budget.spent_paise)}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-[var(--app-fg-muted)]">Budget Left</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{formatLakhs(budget.remaining_paise)}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-[var(--app-fg-muted)]">Budget Used</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2">{spentPct.toFixed(0)}%</p>
              </Card>
            </div>
          </>
        )}
      </EventPlanningGate>
    </PageLayout>
  );
}
