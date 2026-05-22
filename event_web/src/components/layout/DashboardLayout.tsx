import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { PAGE_META } from '@/constants/dashboardNav'

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const meta = PAGE_META[pathname] ?? PAGE_META['/dashboard']

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <button
              type="button"
              className="sidebar-toggle"
              aria-label="Toggle menu"
              onClick={() => setSidebarOpen((o) => !o)}
            >
              <i className="fa-solid fa-bars" />
            </button>
            <h1>{meta.title}</h1>
            <p className="breadcrumb">{meta.breadcrumb}</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm">
            <i className="fa-solid fa-plus" /> New Event
          </button>
        </header>

        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
