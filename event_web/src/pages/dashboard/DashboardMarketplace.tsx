export function DashboardMarketplace() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Community Marketplace</h2>
      </div>
      <div className="panel-body">
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          Discover trusted local artisans and vendors who understand traditional Indian
          celebrations.
        </p>
        <div className="quick-actions">
          <div className="quick-action-card">
            <i className="fa-solid fa-video" />
            <h3>Videographers</h3>
            <p>12 vendors nearby</p>
          </div>
          <div className="quick-action-card">
            <i className="fa-solid fa-bowl-food" />
            <h3>Halwais</h3>
            <p>8 vendors nearby</p>
          </div>
          <div className="quick-action-card">
            <i className="fa-solid fa-palette" />
            <h3>Decorators</h3>
            <p>15 vendors nearby</p>
          </div>
        </div>
      </div>
    </div>
  )
}
