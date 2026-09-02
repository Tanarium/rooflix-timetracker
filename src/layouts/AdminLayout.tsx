import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { ShellNav } from './ShellNav'
import './Layout.css'

export function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="shell">
      <header className="shell-header">
        <span className="shell-brand">
          <img
            src={`${import.meta.env.BASE_URL}logos/logo_letras.png`}
            alt="Rooflix TimeTracker"
            className="shell-logo"
          />
          <span>· Admin</span>
        </span>
        <ShellNav role={user?.role ?? 'admin'} />
        <div className="shell-user">
          <span>{user?.name}</span>
          <button type="button" className="btn btn-secondary" onClick={logout}>
            Salir
          </button>
        </div>
      </header>
      <main className="shell-main">
        <Outlet />
      </main>
    </div>
  )
}
