interface DashboardPlaceholderProps {
  title: string
  icon: string
  description: string
  actionLabel: string
}

export function DashboardPlaceholder({
  title,
  icon,
  description,
  actionLabel,
}: DashboardPlaceholderProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>{title}</h2>
      </div>
      <div className="panel-body empty-state">
        <i className={`fa-solid ${icon}`} />
        <p>{description}</p>
        <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          {actionLabel}
        </button>
      </div>
    </div>
  )
}
