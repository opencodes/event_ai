import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw, ListChecks } from 'lucide-react';
import { Card } from '@/modules/events/components/Card';
import { PageLayout } from '@/modules/events/components/PageLayout';
import { EventPlanningGate } from '@/modules/events/components/EventPlanningGate';
import { EventTimelinePipeline } from '@/modules/events/components/EventTimelinePipeline';
import { Phase1Event, Phase1EventRitual, Phase1SubEvent, eventModuleApi } from '../api/eventApi';
import { formatTimelineDateTime, toDatetimeLocalValue } from '../utils/eventTimeline';
import { useEventWorkspace } from '../context';

const statusOptions = [
  { value: 'planned', label: 'upcoming' },
  { value: 'in_progress', label: 'in-progress' },
  { value: 'completed', label: 'completed' },
];

const uiStatusClass = (status: string) => {
  if (status === 'completed') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  if (status === 'in_progress') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
};

const blankRitualForm = {
  name: '',
  sub_event_id: '',
  scheduled_at: '',
};

export function RitualsPage() {
  const { selectedEventId } = useEventWorkspace();
  const [event, setEvent] = useState<Phase1Event | null>(null);
  const [rituals, setRituals] = useState<Phase1EventRitual[]>([]);
  const [subEvents, setSubEvents] = useState<Phase1SubEvent[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newRitual, setNewRitual] = useState(blankRitualForm);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [newSamagriName, setNewSamagriName] = useState('');

  const subEventName = (id?: string | null) =>
    subEvents.find((se) => se.id === id)?.name ?? 'Unassigned';

  const loadRituals = useCallback(async () => {
    if (!selectedEventId) return;
    setIsLoading(true);
    setError(null);
    try {
      const loaded = await eventModuleApi.getEvent(selectedEventId);
      setEvent(loaded);
      setSubEvents(loaded.sub_events ?? []);
      const list = (loaded.rituals ?? []).filter((r) => !r.skipped);
      setRituals(list);
      setActiveIndex((prev) => {
        if (prev === null || prev >= list.length) return list.length > 0 ? 0 : null;
        return prev;
      });
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setError(message || 'Failed to load rituals');
    } finally {
      setIsLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    loadRituals();
  }, [loadRituals]);

  useEffect(() => {
    setNewChecklistTitle('');
    setNewSamagriName('');
  }, [activeIndex]);

  const addRitual = async () => {
    if (!selectedEventId || !newRitual.name.trim() || !newRitual.scheduled_at) {
      setError('Ritual name, sub-event tag, and date/time are required.');
      return;
    }
    if (!newRitual.sub_event_id) {
      setError('Select a sub-event to tag this ritual.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await eventModuleApi.addRitual(selectedEventId, {
        ritual_key: `custom_${Date.now()}`,
        name: newRitual.name.trim(),
        sort_order: rituals.length,
        skipped: false,
        sub_event_id: newRitual.sub_event_id,
        scheduled_at: new Date(newRitual.scheduled_at).toISOString(),
      });
      setNewRitual(blankRitualForm);
      await loadRituals();
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setError(message || 'Failed to add ritual');
    } finally {
      setIsSaving(false);
    }
  };

  const saveRitualField = async (
    ritual: Phase1EventRitual,
    payload: { name?: string; scheduled_at?: string; sub_event_id?: string | null; status?: string }
  ) => {
    if (!selectedEventId) return;
    try {
      const updated = await eventModuleApi.updateRitual(selectedEventId, ritual.id, payload);
      setRituals((items) => items.map((item) => (item.id === ritual.id ? { ...item, ...updated } : item)));
      await loadRituals();
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setError(message || 'Failed to update ritual');
      await loadRituals();
    }
  };

  const addChecklistItem = async (ritual: Phase1EventRitual) => {
    if (!selectedEventId || !newChecklistTitle.trim()) return;
    setIsSaving(true);
    try {
      const item = await eventModuleApi.addChecklistItem(ritual.id, {
        title: newChecklistTitle.trim(),
        is_done: false,
        sort_order: ritual.checklists?.length ?? 0,
      });
      setNewChecklistTitle('');
      setRituals((items) =>
        items.map((r) =>
          r.id === ritual.id ? { ...r, checklists: [...(r.checklists ?? []), item] } : r
        )
      );
    } catch {
      setError('Failed to add checklist item');
    } finally {
      setIsSaving(false);
    }
  };

  const addSamagriItem = async (ritual: Phase1EventRitual) => {
    if (!selectedEventId || !newSamagriName.trim()) return;
    setIsSaving(true);
    try {
      const item = await eventModuleApi.addSamagriItem(ritual.id, {
        name: newSamagriName.trim(),
        quantity: '1',
        unit: 'item',
        procured: false,
      });
      setNewSamagriName('');
      setRituals((items) =>
        items.map((r) =>
          r.id === ritual.id ? { ...r, samagri: [...(r.samagri ?? []), item] } : r
        )
      );
    } catch {
      setError('Failed to add samagri item');
    } finally {
      setIsSaving(false);
    }
  };

  const activeRitual = activeIndex !== null ? rituals[activeIndex] : null;
  const canAddRitual = Boolean(
    newRitual.name.trim() && newRitual.sub_event_id && newRitual.scheduled_at && subEvents.length > 0
  );

  return (
    <PageLayout title="Vedic Ritual Milestones & Timelines" subtitle="Tag rituals to sub-events with required date and time">
      <EventPlanningGate isLoading={isLoading} error={error} onRetry={loadRituals}>
        <EventTimelinePipeline event={event} title="Ceremony pipeline" />

        <Card className="p-4 space-y-3">
          <h2 className="font-semibold text-[var(--app-fg)] text-sm">Add ritual</h2>
          {subEvents.length === 0 ? (
            <p className="text-sm text-[var(--app-fg-muted)]">
              Create sub-events in the event wizard or schedule first, then tag rituals here.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <input
                value={newRitual.name}
                onChange={(e) => setNewRitual({ ...newRitual, name: e.target.value })}
                placeholder="Ritual name"
                className="input-theme"
              />
              <select
                value={newRitual.sub_event_id}
                onChange={(e) => setNewRitual({ ...newRitual, sub_event_id: e.target.value })}
                className="input-theme"
                required
              >
                <option value="">Select sub-event *</option>
                {subEvents.map((se) => (
                  <option key={se.id} value={se.id}>{se.name}</option>
                ))}
              </select>
              <input
                type="datetime-local"
                value={newRitual.scheduled_at}
                onChange={(e) => setNewRitual({ ...newRitual, scheduled_at: e.target.value })}
                className="input-theme"
                required
              />
              <button onClick={addRitual} disabled={isSaving || !canAddRitual} className="btn-primary">
                <Plus className="w-4 h-4" />
                <span>Add Ritual</span>
              </button>
            </div>
          )}
          <div className="flex justify-end">
            <button onClick={loadRituals} className="btn-secondary">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </Card>

        {rituals.length === 0 ? (
          <Card className="p-6 text-sm text-[var(--app-fg-muted)]">
            No rituals yet. Fill in name, sub-event, and date/time above.
          </Card>
        ) : (
          <div className="flex flex-col lg:flex-row gap-4">
            <Card className="p-4 lg:w-1/3">
              <h2 className="font-semibold text-[var(--app-fg)] mb-3 flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-[var(--primary)]" />
                Event Rituals
              </h2>
              <div className="space-y-2">
                {rituals.map((ritual, index) => (
                  <button
                    key={ritual.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      activeIndex === index
                        ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                        : 'border-[var(--panel-border)] hover:bg-[var(--surface-muted)]'
                    }`}
                  >
                    <p className="font-medium text-sm text-[var(--app-fg)] truncate">{ritual.name}</p>
                    <p className="text-xs text-[var(--app-fg-muted)] mt-1">{subEventName(ritual.sub_event_id)}</p>
                    <p className="text-xs text-[var(--app-fg-muted)]">
                      {ritual.scheduled_at ? formatTimelineDateTime(ritual.scheduled_at) : 'No schedule'}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block ${uiStatusClass(ritual.status ?? 'planned')}`}>
                      {ritual.status ?? 'planned'}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-5 lg:flex-1">
              {activeRitual ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--app-fg-muted)] uppercase tracking-wide">Ritual name</label>
                      <input
                        type="text"
                        value={activeRitual.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          setRituals((items) => items.map((r, i) => (i === activeIndex ? { ...r, name } : r)));
                        }}
                        onBlur={(e) => saveRitualField(activeRitual, { name: e.target.value })}
                        className="input-theme mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--app-fg-muted)] uppercase tracking-wide">Sub-event *</label>
                      <select
                        value={activeRitual.sub_event_id ?? ''}
                        onChange={(e) => {
                          const sub_event_id = e.target.value || null;
                          setRituals((items) => items.map((r, i) => (i === activeIndex ? { ...r, sub_event_id } : r)));
                          saveRitualField(activeRitual, { sub_event_id });
                        }}
                        className="input-theme mt-1"
                      >
                        <option value="">Select sub-event</option>
                        {subEvents.map((se) => (
                          <option key={se.id} value={se.id}>{se.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--app-fg-muted)] uppercase tracking-wide">Date & time *</label>
                      <input
                        type="datetime-local"
                        value={toDatetimeLocalValue(activeRitual.scheduled_at)}
                        onChange={(e) => {
                          const local = e.target.value;
                          setRituals((items) =>
                            items.map((r, i) =>
                              i === activeIndex ? { ...r, scheduled_at: local ? new Date(local).toISOString() : '' } : r
                            )
                          );
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) return;
                          saveRitualField(activeRitual, { scheduled_at: new Date(e.target.value).toISOString() });
                        }}
                        className="input-theme mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--app-fg-muted)] uppercase tracking-wide">Status</label>
                      <select
                        value={activeRitual.status ?? 'planned'}
                        onChange={(e) => saveRitualField(activeRitual, { status: e.target.value })}
                        className="input-theme mt-1 text-sm"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-[var(--panel-border)] pt-4">
                    <h3 className="font-semibold text-[var(--app-fg)] text-sm mb-3">Preparation Checklist</h3>
                    <div className="space-y-2 mb-3">
                      {(activeRitual.checklists ?? []).map((item) => (
                        <p key={item.id} className="text-sm text-[var(--app-fg)] px-2 py-1 bg-[var(--surface-muted)] rounded">
                          {item.title}
                        </p>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={newChecklistTitle}
                        onChange={(e) => setNewChecklistTitle(e.target.value)}
                        placeholder="e.g. Book Pandit"
                        className="input-theme flex-1 text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && addChecklistItem(activeRitual)}
                      />
                      <button
                        onClick={() => addChecklistItem(activeRitual)}
                        disabled={isSaving || !newChecklistTitle.trim()}
                        className="btn-secondary text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-[var(--panel-border)] pt-4">
                    <h3 className="font-semibold text-[var(--app-fg)] text-sm mb-3">Samagri List</h3>
                    <div className="space-y-2 mb-3">
                      {(activeRitual.samagri ?? []).map((item) => (
                        <p key={item.id} className="text-sm text-[var(--app-fg)] px-2 py-1 bg-[var(--surface-muted)] rounded">
                          {item.name}
                          {item.quantity ? ` · ${item.quantity}${item.unit ? ` ${item.unit}` : ''}` : ''}
                        </p>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={newSamagriName}
                        onChange={(e) => setNewSamagriName(e.target.value)}
                        placeholder="e.g. Ghee, Flowers"
                        className="input-theme flex-1 text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && addSamagriItem(activeRitual)}
                      />
                      <button
                        onClick={() => addSamagriItem(activeRitual)}
                        disabled={isSaving || !newSamagriName.trim()}
                        className="btn-secondary text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--app-fg-muted)]">Select a ritual to view details.</p>
              )}
            </Card>
          </div>
        )}
      </EventPlanningGate>
    </PageLayout>
  );
}
