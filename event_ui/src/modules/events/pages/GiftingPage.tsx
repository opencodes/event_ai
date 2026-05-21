import { Card } from '@/modules/events/components/Card';
import { PageLayout } from '@/modules/events/components/PageLayout';

export function GiftingPage() {
  const giftingSummary = {
    totalCash: 100000,
    totalPhysical: 20,
    totalContributors: 50,
  };

  const gifts = [
    { id: 1, name: 'Rakesh Kumar', amount: 10000, type: 'Cash' },
    { id: 2, name: 'Sita Devi', amount: 5000, type: 'Cash' },
    { id: 3, name: 'Ram Kumar', amount: 15000, type: 'Cash' },
    { id: 4, name: 'Radha Devi', amount: 20000, type: 'Cash' },
    { id: 5, name: 'Krishna Kumar', amount: 25000, type: 'Cash' },
    { id: 6, name: 'Laxmi Devi', amount: 25000, type: 'Cash' },
  ];

  return (
    <PageLayout title="Lifafa Gifting Ledger" subtitle="Digital register for tracking traditional custom gifts">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">₹{(giftingSummary.totalCash / 100000).toFixed(1)}L</div>
            <div className="text-sm text-[var(--app-fg-muted)] mt-2">Total Cash Gifts</div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--app-fg)]">{giftingSummary.totalPhysical}</div>
            <div className="text-sm text-[var(--app-fg-muted)] mt-2">Physical Presents</div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{giftingSummary.totalContributors}</div>
            <div className="text-sm text-[var(--app-fg-muted)] mt-2">Total Contributors</div>
          </div>
        </Card>
      </div>

      {/* Gift Breakdown */}
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
                  <td className="py-3 px-2 text-[var(--app-fg)]">{gift.name}</td>
                  <td className="py-3 px-2 text-center">
                    <span className="font-semibold text-green-600 dark:text-green-400">₹{gift.amount.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-2 text-center text-[var(--app-fg-muted)]">{gift.type}</td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">
                      Received
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Reciprocal Exchange Note */}
      <Card className="p-6 border-2 border-blue-200 dark:border-blue-900">
        <p className="text-sm text-[var(--app-fg)] font-medium mb-2">💝 Reciprocal Social Exchange</p>
        <p className="text-xs text-[var(--app-fg-muted)]">
          Track reciprocal obligations to ensure appropriate return gifts and thank you gestures are maintained for all contributors during future events or occasions.
        </p>
      </Card>
    </PageLayout>
  );
}
