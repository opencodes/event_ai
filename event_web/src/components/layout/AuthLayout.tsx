import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
interface AuthLayoutProps {
  brandTitle: string
  brandDescription: string
  children: ReactNode
}

export function AuthLayout({ brandTitle, brandDescription, children }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-panel auth-panel--brand">
        <div className="auth-brand-content">
          <div className="logo">
            Utsav <span>Connect</span>
          </div>
          <h2>{brandTitle}</h2>
          <p>{brandDescription}</p>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-card">
          <Link to="/" className="auth-back">
            <i className="fa-solid fa-arrow-left" /> Back to home
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
