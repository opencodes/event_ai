import { GitBranch } from 'lucide-react';
import { Phase1Event } from '../api/eventApi';
import { buildEventTimeline, formatTimelineDateTime, TimelineNode, TimelineNodeState } from '../utils/eventTimeline';

interface EventTimelinePipelineProps {
  event: Phase1Event | null;
  title?: string;
  compact?: boolean;
}

const stateStyles: Record<TimelineNodeState, { ring: string; fill: string; connector: string; label: string }> = {
  completed: {
    ring: 'border-green-500 bg-green-500',
    fill: 'text-white',
    connector: 'bg-green-500',
    label: 'text-green-600 dark:text-green-400',
  },
  current: {
    ring: 'border-[var(--primary)] bg-[var(--primary)] ring-4 ring-[var(--primary)]/25',
    fill: 'text-white',
    connector: 'bg-[var(--primary)]',
    label: 'text-[var(--primary-text)] font-bold',
  },
  in_progress: {
    ring: 'border-blue-500 bg-blue-500 animate-pulse',
    fill: 'text-white',
    connector: 'bg-blue-500',
    label: 'text-blue-600 dark:text-blue-400 font-semibold',
  },
  upcoming: {
    ring: 'border-[var(--panel-border)] bg-[var(--surface-muted)]',
    fill: 'text-[var(--app-fg-muted)]',
    connector: 'bg-[var(--panel-border)]',
    label: 'text-[var(--app-fg-muted)]',
  },
};

const nodeIcon = (node: TimelineNode) => {
  if (node.state === 'completed') return '✓';
  if (node.state === 'current' || node.state === 'in_progress') return '●';
  return '○';
};

const typeBadge = (type: TimelineNode['type']) => {
  if (type === 'event_start') return 'Start';
  if (type === 'sub_event') return 'Sub-event';
  return 'Ritual';
};

export function EventTimelinePipeline({ event, title = 'Event roadmap', compact = false }: EventTimelinePipelineProps) {
  const nodes = buildEventTimeline(event);
  const currentNode = nodes.find((node) => node.state === 'current' || node.state === 'in_progress');

  if (!event) {
    return (
      <section className="rounded-xl border border-[var(--panel-border)] glass-black-surface p-6 text-sm text-[var(--app-fg-muted)]">
        Select an event to view the roadmap pipeline.
      </section>
    );
  }

  if (nodes.length === 0) {
    return (
      <section className="rounded-xl border border-[var(--panel-border)] glass-black-surface p-6">
        <h2 className="font-semibold text-[var(--app-fg)] flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-[var(--primary)]" />
          {title}
        </h2>
        <p className="text-sm text-[var(--app-fg-muted)] mt-3">
          Add sub-events and rituals with scheduled date & time to build the pipeline.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-[var(--panel-border)] glass-black-surface p-5 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-semibold text-[var(--app-fg)] flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[var(--primary)]" />
            {title}
          </h2>
          {!compact && (
            <p className="text-sm text-[var(--app-fg-muted)] mt-1">
              Jenkins-style pipeline view of your ceremony roadmap
            </p>
          )}
        </div>
        {currentNode && (
          <div className="text-sm rounded-lg border border-[var(--panel-border)] bg-[var(--surface-muted)] px-3 py-2">
            <span className="text-[var(--app-fg-muted)]">You are here: </span>
            <span className="font-semibold text-[var(--app-fg)]">{currentNode.title}</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex items-start min-w-max px-2">
          {nodes.map((node, index) => {
            const styles = stateStyles[node.state];
            const isLast = index === nodes.length - 1;
            return (
              <div key={node.id} className="flex items-start">
                <div className={`flex flex-col items-center ${compact ? 'w-[120px]' : 'w-[148px]'}`}>
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 ${styles.ring} ${styles.fill}`}
                    title={`${node.title} — ${node.state}`}
                  >
                    {nodeIcon(node)}
                  </div>
                  <span className="text-[10px] uppercase tracking-wide text-[var(--app-fg-muted)] mt-2">
                    {typeBadge(node.type)}
                  </span>
                  <p className={`text-xs text-center mt-1 line-clamp-2 px-1 ${styles.label}`}>
                    {node.title}
                  </p>
                  {!compact && node.subtitle && (
                    <p className="text-[10px] text-center text-[var(--app-fg-muted)] mt-0.5 line-clamp-1 px-1">
                      {node.subtitle}
                    </p>
                  )}
                  <p className="text-[10px] text-center text-[var(--app-fg-muted)] mt-1">
                    {formatTimelineDateTime(node.scheduledAt)}
                  </p>
                </div>
                {!isLast && (
                  <div className={`h-0.5 ${compact ? 'w-8' : 'w-12'} mt-5 shrink-0 ${styles.connector}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-[var(--app-fg-muted)] pt-1 border-t border-[var(--panel-border)]">
        <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Completed</span>
        <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" /> Current</span>
        <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> In progress</span>
        <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[var(--surface-muted)] border border-[var(--panel-border)]" /> Upcoming</span>
      </div>
    </section>
  );
}
