import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, CheckCircle2, ClipboardList, Package, RefreshCw } from 'lucide-react';
import { Sidebar, Header } from '@/layout';
import { Phase1Event, eventModuleApi } from '../api/eventApi';
import { useEventWorkspace } from '../context';

const formatDateTime = (value?: string) => {
  if (!value) return 'Not scheduled';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [event, setEvent] = useState<Phase1Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setSelectedEventId } = useEventWorkspace();

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const loadEvent = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const loadedEvent = await eventModuleApi.getEvent(id);
      setEvent(loadedEvent);
      setSelectedEventId(loadedEvent.id || id);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load event');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, [id]);

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
            <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--app-fg-muted)] hover:text-[var(--app-fg)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Events</span>
            </button>

            {error && (
              <div className="alert-error flex items-center justify-between gap-3">
                <p className="text-sm">{error}</p>
                <button onClick={loadEvent} className="text-sm font-semibold inline-flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry
                </button>
              </div>
            )}

            {isLoading ? (
              <section className="glass-black-surface border border-[var(--panel-border)] rounded-xl p-8 text-sm text-[var(--app-fg-muted)]">
                Loading event...
              </section>
            ) : event ? (
              <>
                <section className="glass-black-surface border border-[var(--panel-border)] rounded-xl p-5 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h1 className="text-2xl font-bold text-[var(--app-fg)]">{event.title}</h1>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--surface-muted)] text-[var(--app-fg-muted)]">
                          {event.status}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--app-fg-muted)]">{event.description || 'No description added.'}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm md:min-w-[360px]">
                      <div className="rounded-lg border border-[var(--panel-border)] bg-[var(--surface-muted)] p-3">
                        <p className="text-[var(--app-fg-muted)]">Ceremony</p>
                        <p className="font-semibold text-[var(--app-fg)] capitalize mt-1">{event.ceremony_type}</p>
                      </div>
                      <div className="rounded-lg border border-[var(--panel-border)] bg-[var(--surface-muted)] p-3">
                        <p className="text-[var(--app-fg-muted)]">Start</p>
                        <p className="font-semibold text-[var(--app-fg)] mt-1">{formatDateTime(event.start_at)}</p>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <section className="glass-black-surface border border-[var(--panel-border)] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarDays className="w-4 h-4 text-[var(--primary)]" />
                      <h2 className="font-semibold text-[var(--app-fg)]">Schedule</h2>
                    </div>
                    {(event.sub_events ?? []).length === 0 ? (
                      <p className="text-sm text-[var(--app-fg-muted)]">No sub-events added.</p>
                    ) : (
                      <div className="space-y-3">
                        {event.sub_events?.map((subEvent) => (
                          <div key={subEvent.id} className="rounded-lg border border-[var(--panel-border)] p-3">
                            <p className="font-semibold text-[var(--app-fg)]">{subEvent.name}</p>
                            <p className="text-sm text-[var(--app-fg-muted)] mt-1">{formatDateTime(subEvent.starts_at)}</p>
                            {subEvent.phase && <p className="text-xs text-[var(--app-fg-muted)] mt-1 capitalize">{subEvent.phase.replace('_', ' ')}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="lg:col-span-2 glass-black-surface border border-[var(--panel-border)] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <ClipboardList className="w-4 h-4 text-[var(--primary)]" />
                      <h2 className="font-semibold text-[var(--app-fg)]">Rituals</h2>
                    </div>
                    {(event.rituals ?? []).length === 0 ? (
                      <p className="text-sm text-[var(--app-fg-muted)]">No rituals added.</p>
                    ) : (
                      <div className="space-y-4">
                        {event.rituals?.map((ritual) => (
                          <article key={ritual.id} className="rounded-lg border border-[var(--panel-border)] p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3 className="font-semibold text-[var(--app-fg)]">{ritual.name}</h3>
                              {ritual.skipped && <span className="text-xs font-semibold text-[var(--app-fg-muted)]">Skipped</span>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--app-fg)] mb-2">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Checklist
                                </div>
                                {(ritual.checklists ?? []).length === 0 ? (
                                  <p className="text-sm text-[var(--app-fg-muted)]">No checklist items.</p>
                                ) : (
                                  <ul className="space-y-2">
                                    {ritual.checklists?.map((item) => (
                                      <li key={item.id} className="text-sm text-[var(--app-fg-muted)]">
                                        {item.is_done ? 'Done: ' : 'Todo: '}
                                        {item.title}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--app-fg)] mb-2">
                                  <Package className="w-4 h-4" />
                                  Samagri
                                </div>
                                {(ritual.samagri ?? []).length === 0 ? (
                                  <p className="text-sm text-[var(--app-fg-muted)]">No samagri items.</p>
                                ) : (
                                  <ul className="space-y-2">
                                    {ritual.samagri?.map((item) => (
                                      <li key={item.id} className="text-sm text-[var(--app-fg-muted)]">
                                        {item.name}
                                        {item.quantity && <span> · {item.quantity}{item.unit ? ` ${item.unit}` : ''}</span>}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              </>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
};
