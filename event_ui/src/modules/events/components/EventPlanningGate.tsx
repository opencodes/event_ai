import { useNavigate } from 'react-router-dom';
import { CalendarDays, RefreshCw } from 'lucide-react';
import { useEventWorkspace } from '../context';

interface EventPlanningGateProps {
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function EventPlanningGate({ children, isLoading, error, onRetry }: EventPlanningGateProps) {
  const navigate = useNavigate();
  const { selectedEventId, selectedEvent } = useEventWorkspace();

  if (!selectedEventId) {
    return (
      <section className="rounded-xl border border-[var(--panel-border)] glass-black-surface p-8 text-center">
        <CalendarDays className="w-12 h-12 mx-auto text-[var(--app-fg-muted)] mb-4" />
        <h2 className="text-lg font-semibold text-[var(--app-fg)]">No active event selected</h2>
        <p className="text-sm text-[var(--app-fg-muted)] mt-1">Choose an event workspace to load planning data.</p>
        <button onClick={() => navigate('/events')} className="btn-primary mt-5">
          Open Events
        </button>
      </section>
    );
  }

  return (
    <>
      {selectedEvent && (
        <p className="text-sm text-[var(--app-fg-muted)] -mt-2">
          Active event: <span className="font-semibold text-[var(--app-fg)]">{selectedEvent.title}</span>
        </p>
      )}
      {error && (
        <div className="alert-error flex items-center justify-between gap-3">
          <p className="text-sm">{error}</p>
          {onRetry && (
            <button onClick={onRetry} className="text-sm font-semibold inline-flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          )}
        </div>
      )}
      {isLoading ? (
        <section className="rounded-xl border border-[var(--panel-border)] glass-black-surface p-8 text-sm text-[var(--app-fg-muted)]">
          Loading...
        </section>
      ) : (
        children
      )}
    </>
  );
}
