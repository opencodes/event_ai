import { useNavigate } from 'react-router-dom'
import { EventsTable } from '@/components/EventsTable'

export function DashboardOverview() {
  const navigate = useNavigate()

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <i className="fa-solid fa-calendar-check stat-icon" />
          <div className="stat-value">3</div>
          <div className="stat-label">Active Events</div>
        </div>
        <div className="stat-card">
          <i className="fa-solid fa-users stat-icon" />
          <div className="stat-value">248</div>
          <div className="stat-label">Total Guests</div>
        </div>
        <div className="stat-card">
          <i className="fa-solid fa-list-check stat-icon" />
          <div className="stat-value">12</div>
          <div className="stat-label">Open Tasks</div>
        </div>
        <div className="stat-card">
          <i className="fa-solid fa-indian-rupee-sign stat-icon" />
          <div className="stat-value">₹4.2L</div>
          <div className="stat-label">Budget Tracked</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="panel-body">
          <div className="quick-actions">
            <button
              type="button"
              className="quick-action-card"
              onClick={() => navigate('/dashboard/events')}
            >
              <i className="fa-solid fa-plus-circle" />
              <h3>Create Event</h3>
              <p>Start a new Vivah, Mundan, or ceremony</p>
            </button>
            <button
              type="button"
              className="quick-action-card"
              onClick={() => navigate('/dashboard/rsvp')}
            >
              <i className="fa-solid fa-envelope" />
              <h3>Send Invites</h3>
              <p>Manage RSVP and guest lists</p>
            </button>
            <button
              type="button"
              className="quick-action-card"
              onClick={() => navigate('/dashboard/marketplace')}
            >
              <i className="fa-solid fa-magnifying-glass" />
              <h3>Find Vendors</h3>
              <p>Halwai, videographer, décor & more</p>
            </button>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Recent Events</h2>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => navigate('/dashboard/events')}
          >
            View All
          </button>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          <EventsTable />
        </div>
      </div>
    </>
  )
}
