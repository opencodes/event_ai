import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { useAuth } from '@/context/AuthContext'
import { isValidEmail } from '@/lib/auth'

export function SignupPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [nameError, setNameError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [confirmError, setConfirmError] = useState(false)
  const [termsError, setTermsError] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')
    const confirm = String(form.get('confirm') ?? '')
    const terms = form.get('terms') === 'on'

    const nameInvalid = !name
    const emailInvalid = !email || !isValidEmail(email)
    const passwordInvalid = password.length < 8
    const confirmInvalid = password !== confirm
    const termsInvalid = !terms

    setNameError(nameInvalid)
    setEmailError(emailInvalid)
    setPasswordError(passwordInvalid)
    setConfirmError(confirmInvalid)
    setTermsError(termsInvalid)

    if (nameInvalid || emailInvalid || passwordInvalid || confirmInvalid || termsInvalid) return

    login({ name, email })
    navigate('/dashboard')
  }

  return (
    <AuthLayout
      brandTitle="Begin Your Journey"
      brandDescription="Join hosts and artisans who honor Indian ceremony traditions — from Vivah to Mundan and every sacred gathering in between."
    >
      <h1>Create Account</h1>
      <p className="subtitle">Start planning authentic celebrations today.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Full name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            placeholder="Priya Sharma"
            autoComplete="name"
            required
          />
          <p className={`form-error${nameError ? ' visible' : ''}`}>Please enter your full name.</p>
        </div>

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
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <p className="form-hint">Use 8+ characters with letters and numbers.</p>
          <p className={`form-error${passwordError ? ' visible' : ''}`}>
            Password must be at least 8 characters.
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="confirm">Confirm password</label>
          <input
            type="password"
            id="confirm"
            name="confirm"
            className="form-control"
            placeholder="Repeat password"
            autoComplete="new-password"
            required
          />
          <p className={`form-error${confirmError ? ' visible' : ''}`}>Passwords do not match.</p>
        </div>

        <div className="checkbox-row">
          <input type="checkbox" id="terms" name="terms" required />
          <label htmlFor="terms">I agree to the Terms of Service and Privacy Policy</label>
        </div>
        <p className={`form-error${termsError ? ' visible' : ''}`}>
          You must accept the terms to continue.
        </p>

        <button type="submit" className="btn btn-primary btn-block">
          Create Account
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
