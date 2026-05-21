import { Card } from '@/modules/events/components/Card';
import { PageLayout } from '@/modules/events/components/PageLayout';

export function RSVPPage() {
  const guestStats = {
    totalInvited: 100,
    rsvpReceived: 75,
    pending: 25,
  };

  const dietaryPreferences = [
    { label: 'Pure Vegetarian', count: 60 },
    { label: 'Vegan', count: 10 },
    { label: 'Gluten-Free', count: 5 },
    { label: 'No Preference', count: 5 },
  ];

  const genderDistribution = [
    { label: 'Male', count: 40 },
    { label: 'Female', count: 35 },
  ];

  const ageGroups = [
    { label: 'Children (0-12)', count: 15 },
    { label: 'Children Female (0-12)', count: 15 },
    { label: 'Adults (13-60)', count: 50 },
    { label: 'Adults Female (13-60)', count: 50 },
    { label: 'Seniors (60+)', count: 10 },
    { label: 'Seniors Female (60+)', count: 10 },
  ];

  return (
    <PageLayout title="Guest RSVP Portal" subtitle="WhatsApp-based guest confirmations and preferences">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--app-fg)]">{guestStats.totalInvited}</div>
            <div className="text-sm text-[var(--app-fg-muted)] mt-1">Total Invited</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{guestStats.rsvpReceived}</div>
            <div className="text-sm text-[var(--app-fg-muted)] mt-1">RSVP Received</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{guestStats.pending}</div>
            <div className="text-sm text-[var(--app-fg-muted)] mt-1">Pending</div>
          </div>
        </Card>
      </div>

      {/* Dietary Preferences */}
      <Card className="p-6">
        <h2 className="font-semibold text-[var(--app-fg)] mb-4">Dietary Preferences</h2>
        <div className="space-y-3">
          {dietaryPreferences.map((pref) => (
            <div key={pref.label} className="flex justify-between items-center">
              <span className="text-sm text-[var(--app-fg-muted)]">{pref.label}</span>
              <span className="font-semibold text-[var(--app-fg)]">{pref.count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Gender & Age Distribution */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6">
          <h2 className="font-semibold text-[var(--app-fg)] mb-4">Gender Distribution</h2>
          <div className="space-y-3">
            {genderDistribution.map((gender) => (
              <div key={gender.label} className="flex justify-between items-center">
                <span className="text-sm text-[var(--app-fg-muted)]">{gender.label}</span>
                <span className="font-semibold text-[var(--app-fg)]">{gender.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-[var(--app-fg)] mb-4">Age Groups</h2>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {ageGroups.map((age) => (
              <div key={age.label} className="flex justify-between items-center text-sm">
                <span className="text-[var(--app-fg-muted)]">{age.label}</span>
                <span className="font-semibold text-[var(--app-fg)]">{age.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
