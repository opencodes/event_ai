import { FormEvent, useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export function DashboardSettings() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user || !name.trim()) return
    updateUser({ name: name.trim(), email: user.email })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Account Settings</h2>
        {saved && <span style={{ color: 'var(--color-accent)', fontSize: '0.9rem' }}>Saved</span>}
      </div>
      <div className="panel-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="settings-name">Display name</label>
            <input
              type="text"
              id="settings-name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="settings-email">Email</label>
            <input
              type="email"
              id="settings-email"
              className="form-control"
              value={user?.email ?? ''}
              readOnly
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}
