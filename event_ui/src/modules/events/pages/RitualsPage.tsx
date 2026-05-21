import { Card } from '@/modules/events/components/Card';
import { PageLayout } from '@/modules/events/components/PageLayout';

export function RitualsPage() {
  const rituals = [
    { id: 1, title: 'Shubh Lagan & Ghurdwari', time: '10:00 AM', status: 'upcoming', priority: 'high' },
    { id: 2, title: 'Haldi Ceremony', time: '12:00 PM', status: 'in-progress', priority: 'high' },
    { id: 3, title: 'Mehendi Ceremony', time: '2:00 PM', status: 'in-progress', priority: 'high' },
    { id: 4, title: 'Sangeet Ceremony', time: '4:00 PM', status: 'completed', priority: 'medium' },
    { id: 5, title: 'Main Wedding Ceremony', time: '6:00 PM', status: 'completed', priority: 'high' },
    { id: 6, title: 'Bidai', time: '8:00 PM', status: 'completed', priority: 'medium' },
  ];

  return (
    <PageLayout title="Vedic Ritual Milestones & Timelines" subtitle="Track all ceremonies aligned with auspicious muhurats">
      <div className="grid gap-4">
        {rituals.map((ritual) => (
          <Card key={ritual.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--app-fg)]">{ritual.title}</h3>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-[var(--app-fg-muted)]">{ritual.time}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    ritual.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    ritual.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {ritual.status}
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
