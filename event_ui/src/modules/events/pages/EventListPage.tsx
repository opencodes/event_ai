import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Eye, Plus, RefreshCw } from 'lucide-react';
import { Sidebar, Header } from '@/layout';
import { useEventWorkspace } from '../context';

const formatDate = (value?: string) => {
  if (!value) return 'Not scheduled';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const EventListPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { events, isLoadingEvents, refreshEvents, setSelectedEventId } = useEventWorkspace();

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const loadEvents = async () => {
    setError(null);
    try {
      await refreshEvents();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load events');
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden app-shell">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isCollapsed={sidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMobileMenuToggle={handleMenuToggle} />

        <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[var(--app-fg)]">Events</h1>
                <p className="text-sm text-[var(--app-fg-muted)] mt-1">Manage ceremony drafts, schedules, rituals, and published events.</p>
              </div>
              <button
                onClick={() => navigate('/events/new')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg ai-gradient-button text-white font-semibold text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </button>
            </div>

            {error && (
              <div className="alert-error flex items-center justify-between gap-3">
                <p className="text-sm">{error}</p>
                <button onClick={loadEvents} className="text-sm font-semibold inline-flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry
                </button>
              </div>
            )}

            <section className="glass-black-surface border border-[var(--panel-border)] rounded-xl overflow-hidden">
              {isLoadingEvents ? (
                <div className="p-8 text-sm text-[var(--app-fg-muted)]">Loading events...</div>
              ) : events.length === 0 ? (
                <div className="p-10 text-center">
                  <CalendarDays className="w-12 h-12 mx-auto text-[var(--app-fg-muted)] mb-4" />
                  <h2 className="text-lg font-semibold text-[var(--app-fg)]">No events yet</h2>
                  <p className="text-sm text-[var(--app-fg-muted)] mt-1">Create your first ceremony plan to start adding sub-events and rituals.</p>
                  <button
                    onClick={() => navigate('/events/new')}
                    className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg ai-gradient-button text-white font-semibold text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Event</span>
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[var(--panel-border)]">
                  {events.map((event) => (
                    <article key={event.id} className="p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-semibold text-[var(--app-fg)] truncate">{event.title}</h2>
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--surface-muted)] text-[var(--app-fg-muted)]">
                            {event.status}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--app-fg-muted)] mt-1">
                          {event.ceremony_type} · {formatDate(event.start_at)}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedEventId(event.id, { navigateToEvent: true })}
                        className="self-start md:self-auto inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--panel-border)] text-sm font-semibold text-[var(--app-fg)] hover:bg-[var(--surface-muted)] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};
