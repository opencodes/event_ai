import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { DASHBOARD_NAV } from '@/constants/dashboardNav'
import { initials } from '@/lib/auth'
import { Logo } from '@/components/Logo'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <Logo to="/dashboard" className="sidebar-logo" />

      <nav className="sidebar-nav">
        {DASHBOARD_NAV.map((section) => (
          <div key={section.title}>
            <div className="sidebar-section">{section.title}</div>
            <ul>
              {section.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/dashboard'}
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                    onClick={onClose}
                  >
                    <i className={`fa-solid ${item.icon}`} />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">{user ? initials(user.name) : '?'}</div>
          <div className="user-info">
            <div className="name">{user?.name ?? 'Guest'}</div>
            <div className="email">{user?.email ?? '—'}</div>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-outline btn-block btn-sm logout-btn"
          onClick={handleLogout}
        >
          <i className="fa-solid fa-right-from-bracket" /> Sign Out
        </button>
      </div>
    </aside>
  )
}
