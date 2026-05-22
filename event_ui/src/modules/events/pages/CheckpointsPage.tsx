import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Card } from '@/modules/events/components/Card';
import { PageLayout } from '@/modules/events/components/PageLayout';
import { EventPlanningGate } from '@/modules/events/components/EventPlanningGate';
import { CheckpointStatus, EventCheckpoint, eventModuleApi } from '../api/eventApi';
import { useEventWorkspace } from '../context';

const statusCycle: CheckpointStatus[] = ['not-started', 'in-progress', 'completed'];

const nextStatus = (status: CheckpointStatus) => {
  const index = statusCycle.indexOf(status);
  return statusCycle[(index + 1) % statusCycle.length];
};

export function CheckpointsPage() {
  const { selectedEventId } = useEventWorkspace();
  const [checkpoints, setCheckpoints] = useState<EventCheckpoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const loadCheckpoints = useCallback(async () => {
    if (!selectedEventId) return;
    setIsLoading(true);
    setError(null);
    try {
      setCheckpoints(await eventModuleApi.listCheckpoints(selectedEventId));
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setError(message || 'Failed to load checkpoints');
    } finally {
      setIsLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    loadCheckpoints();
  }, [loadCheckpoints]);

  const toggleCheckpoint = async (checkpoint: EventCheckpoint) => {
    if (!selectedEventId) return;
    const status = nextStatus(checkpoint.status);
    setCheckpoints((items) => items.map((item) => (item.id === checkpoint.id ? { ...item, status } : item)));
    try {
      const updated = await eventModuleApi.updateCheckpoint(selectedEventId, checkpoint.id, { status });
      setCheckpoints((items) => items.map((item) => (item.id === checkpoint.id ? updated : item)));
    } catch {
      await loadCheckpoints();
    }
  };

  const addCheckpoint = async () => {
    if (!selectedEventId || !newTitle.trim()) return;
    try {
      const created = await eventModuleApi.createCheckpoint(selectedEventId, {
        title: newTitle.trim(),
        priority: 'medium',
        status: 'not-started',
      });
      setCheckpoints((items) => [...items, created]);
      setNewTitle('');
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setError(message || 'Failed to add checkpoint');
    }
  };

  return (
    <PageLayout title="Critical Planning Checkpoints" subtitle="Track all essential wedding planning milestones">
      <EventPlanningGate isLoading={isLoading} error={error} onRetry={loadCheckpoints}>
        <div className="flex flex-wrap gap-2">
          <input
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder="Add a checkpoint"
            className="input-theme flex-1 min-w-[200px]"
          />
          <button onClick={addCheckpoint} disabled={!newTitle.trim()} className="btn-primary">
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
          <button onClick={loadCheckpoints} className="btn-secondary">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid gap-4">
          {checkpoints.map((checkpoint) => (
            <Card key={checkpoint.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checkpoint.status === 'completed'}
                      onChange={() => toggleCheckpoint(checkpoint)}
                      className="w-5 h-5"
                    />
                    <h3 className="font-semibold text-[var(--app-fg)]">{checkpoint.title}</h3>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => toggleCheckpoint(checkpoint)}
                      className={`text-xs px-2 py-1 rounded-full ${
                        checkpoint.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        checkpoint.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}
                    >
                      {checkpoint.status}
                    </button>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      checkpoint.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {checkpoint.priority} priority
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </EventPlanningGate>
    </PageLayout>
  );
}
