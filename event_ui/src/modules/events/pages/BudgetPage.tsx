import { Card } from '@/modules/events/components/Card';
import { PageLayout } from '@/modules/events/components/PageLayout';

export function BudgetPage() {
  const budget = {
    total: 500000,
    spent: 250000,
    remaining: 250000,
  };

  const expenses = [
    { category: 'Venue', amount: 100000, percentage: 20, status: 'confirmed' },
    { category: 'Catering', amount: 50000, percentage: 10, status: 'confirmed' },
    { category: 'Decor', amount: 30000, percentage: 6, status: 'in-progress' },
    { category: 'Clothing', amount: 20000, percentage: 4, status: 'pending' },
    { category: 'Miscellaneous', amount: 50000, percentage: 10, status: 'pending' },
  ];

  return (
    <PageLayout title="Budget & Expense Tracker" subtitle="Monitor and control wedding planning finances">
      {/* Budget Overview */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-[var(--app-fg-muted)] mb-1">Total Budget</p>
              <p className="text-3xl font-bold text-[var(--app-fg)]">₹{(budget.total / 100000).toFixed(1)}L</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[var(--app-fg-muted)] mb-1">Spent</p>
              <p className="text-2xl font-semibold text-orange-600 dark:text-orange-400">₹{(budget.spent / 100000).toFixed(1)}L</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[var(--app-fg-muted)] mb-1">Remaining</p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400">₹{(budget.remaining / 100000).toFixed(1)}L</p>
            </div>
          </div>

          {/* Overall Progress */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-[var(--app-fg)]">Budget Utilization</span>
              <span className="text-sm font-semibold text-[var(--app-fg)]">{(budget.spent / budget.total * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-[var(--surface-muted)] rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full" 
                style={{ width: `${(budget.spent / budget.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Expense Breakdown */}
      <Card className="p-6">
        <h2 className="font-semibold text-[var(--app-fg)] mb-4">Expense Breakdown</h2>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.category}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex-1">
                  <p className="font-medium text-[var(--app-fg)]">{expense.category}</p>
                  <p className="text-xs text-[var(--app-fg-muted)]">{expense.percentage}% of total budget</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[var(--app-fg)]">₹{(expense.amount / 1000).toFixed(0)}K</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    expense.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    expense.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {expense.status}
                  </span>
                </div>
              </div>
              <div className="w-full bg-[var(--surface-muted)] rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full" 
                  style={{ width: `${expense.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-[var(--app-fg-muted)]">Total Expense</p>
          <p className="text-2xl font-bold text-[var(--app-fg)] mt-2">₹{(budget.spent / 100000).toFixed(1)}L</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-[var(--app-fg-muted)]">Budget Left</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">₹{(budget.remaining / 100000).toFixed(1)}L</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-[var(--app-fg-muted)]">Budget Used</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2">{(budget.spent / budget.total * 100).toFixed(0)}%</p>
        </Card>
      </div>
    </PageLayout>
  );
}
