import { Card } from '@/modules/events/components/Card';
import { PageLayout } from '@/modules/events/components/PageLayout';

export function CheckpointsPage() {
  const checkpoints = [
    { id: 1, title: 'Venue Booking', status: 'not-started', priority: 'high' },
    { id: 2, title: 'Vendor Confirmation', status: 'in-progress', priority: 'high' },
    { id: 3, title: 'Ritual Scheduling', status: 'not-started', priority: 'medium' },
    { id: 4, title: 'Initial Budget Allocation', status: 'completed', priority: 'high' },
  ];

  return (
    <PageLayout title="Critical Planning Checkpoints" subtitle="Track all essential wedding planning milestones">
      <div className="grid gap-4">
        {checkpoints.map((checkpoint) => (
          <Card key={checkpoint.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-5 h-5" defaultChecked={checkpoint.status === 'completed'} />
                  <h3 className="font-semibold text-[var(--app-fg)]">{checkpoint.title}</h3>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    checkpoint.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    checkpoint.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {checkpoint.status}
                  </span>
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
    </PageLayout>
  );
}
