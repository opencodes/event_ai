import { Card } from '@/modules/events/components/Card';
import { PageLayout } from '@/modules/events/components/PageLayout';

export function ClothingPage() {
  const clothingSummary = [
    { item: 'Silk Saris', required: 20, purchased: 10, available: 20 },
    { item: 'Kurtas', required: 15, purchased: 5, available: 15 },
    { item: 'Dhotis', required: 10, purchased: 5, available: 10 },
    { item: 'Sherwanis', required: 5, purchased: 2, available: 5 },
  ];

  const distributions = [
    { family: "Bride's Family", saris: 10, kurtas: 5, dhotis: 3, sherwanis: 2 },
    { family: "Groom's Family", saris: 10, kurtas: 10, dhotis: 7, sherwanis: 3 },
    { family: 'Close Relatives', saris: 5, kurtas: 5, dhotis: 5, sherwanis: 2 },
  ];

  return (
    <PageLayout title="Clothing Allocation Matrix" subtitle="Coordinate traditional ethnic wear for family members">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--app-fg)]">50</div>
            <div className="text-sm text-[var(--app-fg-muted)] mt-1">Total Items Required</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">22</div>
            <div className="text-sm text-[var(--app-fg-muted)] mt-1">Items Purchased</div>
          </div>
        </Card>
      </div>

      {/* Clothing Items */}
      <Card className="p-6">
        <h2 className="font-semibold text-[var(--app-fg)] mb-4">Clothing Status</h2>
        <div className="space-y-4">
          {clothingSummary.map((item) => (
            <div key={item.item}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-[var(--app-fg)]">{item.item}</span>
                <span className="text-xs text-[var(--app-fg-muted)]">{item.purchased}/{item.required} Purchased</span>
              </div>
              <div className="w-full bg-[var(--surface-muted)] rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full" 
                  style={{ width: `${(item.purchased / item.required) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Distribution */}
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
              {distributions.map((dist) => (
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
    </PageLayout>
  );
}
