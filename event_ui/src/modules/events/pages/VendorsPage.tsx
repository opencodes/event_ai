import { Card } from '@/modules/events/components/Card';
import { PageLayout } from '@/modules/events/components/PageLayout';

export function VendorsPage() {
  const vendors = [
    { id: 1, name: 'Maithila Bhoj Caterers', category: 'Food Catering', payment: '₹50,000', advance: '₹25,000', balance: '₹25,000', date: 'Day 1', status: 'confirmed' },
    { id: 2, name: 'Sangeet Shehnai Group', category: 'Music', payment: '₹30,000', advance: '₹0', balance: '₹30,000', date: 'Day 2', status: 'pending' },
    { id: 3, name: 'EcoTent Solutions', category: 'Tent Builders', payment: '₹1,00,000', advance: '₹50,000', balance: '₹50,000', date: 'Day 1-3', status: 'confirmed' },
    { id: 4, name: 'Shubh Vedic Purohits', category: 'Vedic Priests', payment: '₹25,000', advance: '₹0', balance: '₹25,000', date: 'Day 1', status: 'pending' },
    { id: 5, name: 'Eternal Moments Photography', category: 'Photography', payment: '₹45,000', advance: '₹20,000', balance: '₹25,000', date: 'Day 1-3', status: 'confirmed' },
  ];

  return (
    <PageLayout title="Vendor Marketplace & Grid" subtitle="Localized, certified directory of service specialists">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--app-fg)]">{vendors.length}</div>
            <div className="text-sm text-[var(--app-fg-muted)] mt-1">Total Vendors</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">3</div>
            <div className="text-sm text-[var(--app-fg-muted)] mt-1">Confirmed</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">2</div>
            <div className="text-sm text-[var(--app-fg-muted)] mt-1">Pending</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">3</div>
            <div className="text-sm text-[var(--app-fg-muted)] mt-1">Paid</div>
          </div>
        </Card>
      </div>

      {/* Vendors List */}
      <div className="space-y-4">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-[var(--app-fg)]">{vendor.name}</h3>
                <p className="text-sm text-[var(--app-fg-muted)] mt-1">{vendor.category}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                vendor.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
              }`}>
                {vendor.status}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-[var(--panel-border)]">
              <div>
                <p className="text-xs text-[var(--app-fg-muted)] mb-1">Total Payment</p>
                <p className="font-semibold text-[var(--app-fg)]">{vendor.payment}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--app-fg-muted)] mb-1">Advance Paid</p>
                <p className="font-semibold text-green-600 dark:text-green-400">{vendor.advance}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--app-fg-muted)] mb-1">Balance Due</p>
                <p className="font-semibold text-orange-600 dark:text-orange-400">{vendor.balance}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--app-fg-muted)] mb-1">Service Date</p>
                <p className="font-semibold text-[var(--app-fg)]">{vendor.date}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
