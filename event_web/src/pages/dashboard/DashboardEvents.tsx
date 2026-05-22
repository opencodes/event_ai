import { EventsTable } from '@/components/EventsTable'

export function DashboardEvents() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>My Events</h2>
        <button type="button" className="btn btn-secondary btn-sm">
          + New Event
        </button>
      </div>
      <div className="panel-body" style={{ padding: 0 }}>
        <EventsTable showLocation showActions />
      </div>
    </div>
  )
}
