import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Card } from '@/modules/events/components/Card';
import { PageLayout } from '@/modules/events/components/PageLayout';
import { EventPlanningGate } from '@/modules/events/components/EventPlanningGate';
import { EventVendor, VendorStatus, VendorSummary, eventModuleApi } from '../api/eventApi';
import { useEventWorkspace } from '../context';

const formatRupees = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;

const statusOptions: VendorStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];

export function VendorsPage() {
  const { selectedEventId } = useEventWorkspace();
  const [data, setData] = useState<VendorSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVendors = useCallback(async () => {
    if (!selectedEventId) return;
    setIsLoading(true);
    setError(null);
    try {
      setData(await eventModuleApi.listVendors(selectedEventId));
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setError(message || 'Failed to load vendors');
    } finally {
      setIsLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  const updateVendorStatus = async (vendor: EventVendor, status: VendorStatus) => {
    if (!selectedEventId) return;
    try {
      await eventModuleApi.updateVendor(selectedEventId, vendor.id, { status });
      await loadVendors();
    } catch {
      setError('Failed to update vendor');
    }
  };

  const vendors = data?.vendors ?? [];
  const stats = data?.stats ?? { total: 0, confirmed: 0, pending: 0, paid: 0 };

  return (
    <PageLayout title="Vendor Marketplace & Grid" subtitle="Localized, certified directory of service specialists">
      <EventPlanningGate isLoading={isLoading} error={error} onRetry={loadVendors}>
        <div className="flex justify-end">
          <button onClick={loadVendors} className="btn-secondary">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--app-fg)]">{stats.total}</div>
              <div className="text-sm text-[var(--app-fg-muted)] mt-1">Total Vendors</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.confirmed}</div>
              <div className="text-sm text-[var(--app-fg-muted)] mt-1">Confirmed</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.pending}</div>
              <div className="text-sm text-[var(--app-fg-muted)] mt-1">Pending</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.paid}</div>
              <div className="text-sm text-[var(--app-fg-muted)] mt-1">Advance Paid</div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {vendors.map((vendor) => (
            <Card key={vendor.id} className="p-6">
              <div className="flex justify-between items-start mb-4 gap-3 flex-wrap">
                <div>
                  <h3 className="font-semibold text-[var(--app-fg)]">{vendor.name}</h3>
                  <p className="text-sm text-[var(--app-fg-muted)] mt-1">{vendor.category}</p>
                </div>
                <select
                  value={vendor.status}
                  onChange={(event) => updateVendorStatus(vendor, event.target.value as VendorStatus)}
                  className="input-theme text-xs"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[var(--panel-border)]">
                <div>
                  <p className="text-xs text-[var(--app-fg-muted)] mb-1">Total Payment</p>
                  <p className="font-semibold text-[var(--app-fg)]">{formatRupees(vendor.total_amount_paise)}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--app-fg-muted)] mb-1">Advance Paid</p>
                  <p className="font-semibold text-green-600 dark:text-green-400">{formatRupees(vendor.advance_paise)}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--app-fg-muted)] mb-1">Balance Due</p>
                  <p className="font-semibold text-orange-600 dark:text-orange-400">
                    {formatRupees(Math.max(0, vendor.total_amount_paise - vendor.advance_paise))}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--app-fg-muted)] mb-1">Service Date</p>
                  <p className="font-semibold text-[var(--app-fg)]">{vendor.service_date || 'TBD'}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </EventPlanningGate>
    </PageLayout>
  );
}
