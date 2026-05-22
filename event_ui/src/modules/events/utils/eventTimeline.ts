import { Phase1Event, Phase1EventRitual, Phase1SubEvent } from '../api/eventApi';

export type TimelineNodeType = 'event_start' | 'sub_event' | 'ritual';
export type TimelineNodeState = 'completed' | 'current' | 'in_progress' | 'upcoming';

export interface TimelineNode {
  id: string;
  type: TimelineNodeType;
  title: string;
  subtitle?: string;
  scheduledAt: string;
  status: string;
  state: TimelineNodeState;
  subEventId?: string | null;
  subEventName?: string;
}

const parseTime = (value?: string) => {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
};

const ritualPipelineState = (ritual: Phase1EventRitual, now: number): TimelineNodeState => {
  if (ritual.status === 'completed') return 'completed';
  if (ritual.status === 'in_progress') return 'in_progress';
  const at = parseTime(ritual.scheduled_at);
  if (at !== null && at <= now) return 'in_progress';
  return 'upcoming';
};

const subEventPipelineState = (subEvent: Phase1SubEvent, rituals: Phase1EventRitual[], now: number): TimelineNodeState => {
  if (subEvent.status === 'completed') return 'completed';
  if (subEvent.status === 'in_progress') return 'in_progress';
  const linked = rituals.filter((r) => r.sub_event_id === subEvent.id);
  if (linked.some((r) => r.status === 'in_progress')) return 'in_progress';
  if (linked.length > 0 && linked.every((r) => r.status === 'completed')) return 'completed';
  const startsAt = parseTime(subEvent.starts_at);
  if (startsAt !== null && startsAt <= now) return 'in_progress';
  return 'upcoming';
};

const markCurrentNode = (nodes: TimelineNode[]): TimelineNode[] => {
  if (nodes.length === 0) return nodes;

  let currentIndex = nodes.findIndex((node) => node.state === 'in_progress');
  if (currentIndex < 0) currentIndex = nodes.findIndex((node) => node.state === 'upcoming');
  if (currentIndex < 0) currentIndex = nodes.length - 1;

  return nodes.map((node, index) => {
    if (index < currentIndex) return { ...node, state: 'completed' };
    if (index === currentIndex) return { ...node, state: 'current' };
    return { ...node, state: 'upcoming' };
  });
};

export const buildEventTimeline = (event: Phase1Event | null): TimelineNode[] => {
  if (!event) return [];

  const now = Date.now();
  const subEvents = [...(event.sub_events ?? [])].sort(
    (a, b) => (parseTime(a.starts_at) ?? 0) - (parseTime(b.starts_at) ?? 0)
  );
  const rituals = (event.rituals ?? []).filter((r) => !r.skipped);
  const subEventById = new Map(subEvents.map((se) => [se.id, se]));

  const nodes: TimelineNode[] = [];

  if (event.start_at) {
    nodes.push({
      id: `event-start-${event.id}`,
      type: 'event_start',
      title: 'Event begins',
      subtitle: event.title,
      scheduledAt: event.start_at,
      status: event.status,
      state: parseTime(event.start_at)! <= now ? 'completed' : 'upcoming',
    });
  }

  subEvents.forEach((subEvent) => {
    const scheduledAt = subEvent.starts_at ?? event.start_at;
    if (!scheduledAt) return;
    nodes.push({
      id: subEvent.id,
      type: 'sub_event',
      title: subEvent.name,
      subtitle: subEvent.phase?.replace('_', ' '),
      scheduledAt,
      status: subEvent.status ?? 'planned',
      state: subEventPipelineState(subEvent, rituals, now),
      subEventId: subEvent.id,
      subEventName: subEvent.name,
    });
  });

  rituals.forEach((ritual) => {
    if (!ritual.scheduled_at) return;
    const linked = ritual.sub_event_id ? subEventById.get(ritual.sub_event_id) : undefined;
    nodes.push({
      id: ritual.id,
      type: 'ritual',
      title: ritual.name,
      subtitle: linked ? linked.name : 'General',
      scheduledAt: ritual.scheduled_at,
      status: ritual.status ?? 'planned',
      state: ritualPipelineState(ritual, now),
      subEventId: ritual.sub_event_id ?? null,
      subEventName: linked?.name,
    });
  });

  nodes.sort((a, b) => parseTime(a.scheduledAt)! - parseTime(b.scheduledAt)!);
  return markCurrentNode(nodes);
};

export const formatTimelineDateTime = (value: string) =>
  new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export const toDatetimeLocalValue = (iso?: string) => {
  if (!iso) return '';
  const date = new Date(iso);
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
