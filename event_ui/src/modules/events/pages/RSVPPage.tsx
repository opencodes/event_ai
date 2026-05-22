import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Card } from '@/modules/events/components/Card';
import { PageLayout } from '@/modules/events/components/PageLayout';
import { EventPlanningGate } from '@/modules/events/components/EventPlanningGate';
import { RsvpAnalytics, eventModuleApi } from '../api/eventApi';
import { useEventWorkspace } from '../context';

export function RSVPPage() {
  const { selectedEventId } = useEventWorkspace();
  const [analytics, setAnalytics] = useState<RsvpAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    if (!selectedEventId) return;
    setIsLoading(true);
    setError(null);
    try {
      setAnalytics(await eventModuleApi.getRsvpAnalytics(selectedEventId));
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setError(message || 'Failed to load RSVP analytics');
    } finally {
      setIsLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return (
    <PageLayout title="Guest RSVP Portal" subtitle="WhatsApp-based guest confirmations and preferences">
      <EventPlanningGate isLoading={isLoading} error={error} onRetry={loadAnalytics}>
        {analytics && (
          <>
            <div className="flex justify-end">
              <button onClick={loadAnalytics} className="btn-secondary">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--app-fg)]">{analytics.total_invited}</div>
                  <div className="text-sm text-[var(--app-fg-muted)] mt-1">Total Invited</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{analytics.rsvp_received}</div>
                  <div className="text-sm text-[var(--app-fg-muted)] mt-1">RSVP Received</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{analytics.pending}</div>
                  <div className="text-sm text-[var(--app-fg-muted)] mt-1">Pending</div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="font-semibold text-[var(--app-fg)] mb-4">Dietary Preferences</h2>
              <div className="space-y-3">
                {analytics.dietary_preferences.map((pref) => (
                  <div key={pref.label} className="flex justify-between items-center">
                    <span className="text-sm text-[var(--app-fg-muted)]">{pref.label}</span>
                    <span className="font-semibold text-[var(--app-fg)]">{pref.count}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6">
                <h2 className="font-semibold text-[var(--app-fg)] mb-4">Gender Distribution</h2>
                <div className="space-y-3">
                  {analytics.gender_distribution.map((gender) => (
                    <div key={gender.label} className="flex justify-between items-center">
                      <span className="text-sm text-[var(--app-fg-muted)]">{gender.label}</span>
                      <span className="font-semibold text-[var(--app-fg)]">{gender.count}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold text-[var(--app-fg)] mb-4">Age Groups</h2>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {analytics.age_groups.map((age) => (
                    <div key={age.label} className="flex justify-between items-center text-sm">
                      <span className="text-[var(--app-fg-muted)]">{age.label}</span>
                      <span className="font-semibold text-[var(--app-fg)]">{age.count}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}
      </EventPlanningGate>
    </PageLayout>
  );
}
