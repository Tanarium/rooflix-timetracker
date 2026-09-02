import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import '../styles/shared.css'
import './LoginPage.css'

export function LoginPage() {
  const { user, loading: authLoading, login } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (authLoading) {
    return <div className="login-page">Cargando…</div>
  }

  if (user) {
    const redirectTo = user.role === 'employee' ? '/app' : '/admin'
    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <form className="card login-card stack" onSubmit={handleSubmit}>
        <div style={{ textAlign: 'center' }}>
          <img
            src={`${import.meta.env.BASE_URL}logos/logo_transpa.png`}
            alt="Rooflix TimeTracker"
            className="login-logo"
          />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
