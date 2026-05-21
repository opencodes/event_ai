import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/auth';
import { useAppSettings } from '@/core/settings';
import { Phase1Event, eventModuleApi } from '../api/eventApi';

interface EventWorkspaceContextValue {
  events: Phase1Event[];
  selectedEvent: Phase1Event | null;
  selectedEventId: string | null;
  isLoadingEvents: boolean;
  setSelectedEventId: (eventId: string | null, options?: { navigateToEvent?: boolean }) => void;
  refreshEvents: () => Promise<void>;
}

const EventWorkspaceContext = createContext<EventWorkspaceContextValue | null>(null);

export function EventWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { settings, updateSettings } = useAppSettings();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Phase1Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const selectedEventId = settings.activeEventId ?? null;

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) ?? null,
    [events, selectedEventId]
  );

  const setSelectedEventId = (eventId: string | null, options?: { navigateToEvent?: boolean }) => {
    updateSettings({ ...settings, activeEventId: eventId });
    if (eventId && options?.navigateToEvent) {
      if (options?.navigateToEvent) navigate(`/events/${eventId}`);
    }
  };

  const refreshEvents = async () => {
    if (!isAuthenticated) {
      setEvents([]);
      setSelectedEventId(null);
      return;
    }

    setIsLoadingEvents(true);
    try {
      const list = await eventModuleApi.listEvents();
      setEvents(list);
      if (list.length === 0) {
        setSelectedEventId(null);
        return;
      }
      const stillExists = selectedEventId && list.some((event) => event.id === selectedEventId);
      if (!stillExists) {
        setSelectedEventId(list[0].id);
      }
    } finally {
      setIsLoadingEvents(false);
    }
  };

  useEffect(() => {
    refreshEvents().catch(() => {
      setEvents([]);
      updateSettings({ ...settings, activeEventId: null });
    });
  }, [isAuthenticated]);

  return (
    <EventWorkspaceContext.Provider
      value={{
        events,
        selectedEvent,
        selectedEventId,
        isLoadingEvents,
        setSelectedEventId,
        refreshEvents,
      }}
    >
      {children}
    </EventWorkspaceContext.Provider>
  );
}

export function useEventWorkspace() {
  const context = useContext(EventWorkspaceContext);
  if (!context) {
    throw new Error('useEventWorkspace must be used inside EventWorkspaceProvider');
  }
  return context;
}
