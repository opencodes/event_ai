import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { useAuth } from '@/context/AuthContext'
import { getUser, isValidEmail } from '@/lib/auth'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')

    const emailInvalid = !email || !isValidEmail(email)
    const passwordInvalid = password.length < 6

    setEmailError(emailInvalid)
    setPasswordError(passwordInvalid)
    if (emailInvalid || passwordInvalid) return

    const stored = getUser()
    const name = stored?.email === email ? stored.name : email.split('@')[0]

    login({ name, email })
    navigate('/dashboard')
  }

  return (
    <AuthLayout
      brandTitle="Welcome Back"
      brandDescription="Continue planning your traditional celebrations with authenticity, community, and excellence at every step."
    >
      <h1>Sign In</h1>
      <p className="subtitle">Enter your credentials to access your dashboard.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
          <p className={`form-error${emailError ? ' visible' : ''}`}>
            Please enter a valid email address.
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            placeholder="••••••••"
            autoComplete="current-password"
            minLength={6}
            required
          />
          <p className={`form-error${passwordError ? ' visible' : ''}`}>
            Password must be at least 6 characters.
          </p>
        </div>

        <div className="checkbox-row">
          <input type="checkbox" id="remember" name="remember" />
          <label htmlFor="remember">Remember me on this device</label>
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Sign In
        </button>
      </form>

      <p className="auth-footer">
        Don&apos;t have an account? <Link to="/signup">Create one</Link>
      </p>
    </AuthLayout>
  )
}
