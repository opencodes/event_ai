import { useEffect, useState } from 'react';
import { Sidebar } from '@/layout';
import { Header } from '@/layout';
import { CalendarDays, CheckCircle2, ClipboardList, Package } from 'lucide-react';
import { Phase1Event, eventModuleApi } from '@/modules/events/api/eventApi';
import { useEventWorkspace } from '@/modules/events/context';

const formatDate = (value?: string) => {
  if (!value) return 'Not scheduled';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function Dashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { selectedEventId, selectedEvent } = useEventWorkspace();
  const [eventDetail, setEventDetail] = useState<Phase1Event | null>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    let isMounted = true;
    if (!selectedEventId) {
      setEventDetail(null);
      return;
    }

    setIsLoadingEvent(true);
    eventModuleApi.getEvent(selectedEventId)
      .then((event) => {
        if (isMounted) setEventDetail(event);
      })
      .catch(() => {
        if (isMounted) setEventDetail(selectedEvent ?? null);
      })
      .finally(() => {
        if (isMounted) setIsLoadingEvent(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedEventId, selectedEvent]);

  const activeEvent = eventDetail ?? selectedEvent;
  const subEventCount = activeEvent?.sub_events?.length ?? 0;
  const ritualCount = activeEvent?.rituals?.length ?? 0;
  const checklistCount = activeEvent?.rituals?.reduce((total, ritual) => total + (ritual.checklists?.length ?? 0), 0) ?? 0;
  const samagriCount = activeEvent?.rituals?.reduce((total, ritual) => total + (ritual.samagri?.length ?? 0), 0) ?? 0;

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
            <div>
              <h1 className="text-2xl font-bold text-[var(--app-fg)]">Workspace</h1>
              <p className="text-sm text-[var(--app-fg-muted)] mt-1">
                {activeEvent ? `Showing data for ${activeEvent.title}.` : 'Select an event from the sidebar to activate a workspace.'}
              </p>
            </div>

            {!activeEvent ? (
              <section className="glass-black-surface border border-[var(--panel-border)] rounded-xl p-8 text-center">
                <CalendarDays className="w-12 h-12 mx-auto text-[var(--app-fg-muted)] mb-4" />
                <h2 className="text-lg font-semibold text-[var(--app-fg)]">No active event selected</h2>
                <p className="text-sm text-[var(--app-fg-muted)] mt-1">Use the Events accordion in the sidebar to choose an event. Every module will use that active event as its workspace.</p>
              </section>
            ) : (
              <>
                <section className="glass-black-surface border border-[var(--panel-border)] rounded-xl p-5 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-[var(--app-fg)]">{activeEvent.title}</h2>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--surface-muted)] text-[var(--app-fg-muted)]">
                          {activeEvent.status}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--app-fg-muted)] mt-2">{activeEvent.description || 'No description added.'}</p>
                    </div>
                    <div className="text-sm text-[var(--app-fg-muted)] md:text-right">
                      <p className="font-semibold text-[var(--app-fg)] capitalize">{activeEvent.ceremony_type}</p>
                      <p className="mt-1">{formatDate(activeEvent.start_at)}</p>
                    </div>
                  </div>
                </section>

                {isLoadingEvent && (
                  <p className="text-sm text-[var(--app-fg-muted)]">Loading active event workspace...</p>
                )}

                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <article className="rounded-xl p-4 glass-black-surface border border-[var(--panel-border)]">
                    <CalendarDays className="w-4 h-4 text-[var(--primary)] mb-3" />
                    <p className="text-xs text-[var(--app-fg-muted)]">Sub-events</p>
                    <p className="mt-2 text-2xl font-bold text-[var(--app-fg)]">{subEventCount}</p>
                  </article>
                  <article className="rounded-xl p-4 glass-black-surface border border-[var(--panel-border)]">
                    <ClipboardList className="w-4 h-4 text-[var(--primary)] mb-3" />
                    <p className="text-xs text-[var(--app-fg-muted)]">Rituals</p>
                    <p className="mt-2 text-2xl font-bold text-[var(--app-fg)]">{ritualCount}</p>
                  </article>
                  <article className="rounded-xl p-4 glass-black-surface border border-[var(--panel-border)]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--primary)] mb-3" />
                    <p className="text-xs text-[var(--app-fg-muted)]">Checklist Items</p>
                    <p className="mt-2 text-2xl font-bold text-[var(--app-fg)]">{checklistCount}</p>
                  </article>
                  <article className="rounded-xl p-4 glass-black-surface border border-[var(--panel-border)]">
                    <Package className="w-4 h-4 text-[var(--primary)] mb-3" />
                    <p className="text-xs text-[var(--app-fg-muted)]">Samagri Items</p>
                    <p className="mt-2 text-2xl font-bold text-[var(--app-fg)]">{samagriCount}</p>
                  </article>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
