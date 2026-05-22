import {
  SAMPLE_EVENTS,
  statusBadgeClass,
  statusLabel,
  type EventRow,
} from '@/constants/events'

interface EventsTableProps {
  showLocation?: boolean
  showActions?: boolean
}

export function EventsTable({ showLocation, showActions }: EventsTableProps) {
  return (
    <table className="events-table">
      <thead>
        <tr>
          <th>Event</th>
          <th>Type</th>
          <th>Date</th>
          {showLocation ? <th>Location</th> : <th>Guests</th>}
          <th>Status</th>
          {showActions && <th />}
        </tr>
      </thead>
      <tbody>
        {SAMPLE_EVENTS.map((event) => (
          <EventTableRow
            key={event.name}
            event={event}
            showLocation={showLocation}
            showActions={showActions}
          />
        ))}
      </tbody>
    </table>
  )
}

function EventTableRow({
  event,
  showLocation,
  showActions,
}: {
  event: EventRow
  showLocation?: boolean
  showActions?: boolean
}) {
  return (
    <tr>
      <td>
        <strong>{event.name}</strong>
      </td>
      <td>{event.type}</td>
      <td>{event.date}</td>
      <td>{showLocation ? event.location : event.guests}</td>
      <td>
        <span className={`badge ${statusBadgeClass(event.status)}`}>
          {statusLabel(event.status)}
        </span>
      </td>
      {showActions && (
        <td>
          <button type="button" className="btn btn-outline btn-sm">
            Open
          </button>
        </td>
      )}
    </tr>
  )
}
