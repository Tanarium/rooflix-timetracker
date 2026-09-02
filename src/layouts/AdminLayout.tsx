import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { ThemeToggle } from '../components/ThemeToggle'
import { ShellNav } from './ShellNav'
import { ShellBrand } from './ShellBrand'
import './Layout.css'

export function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="shell">
      <header className="shell-header">
        <ShellBrand role={user?.role ?? 'admin'} />
        <ShellNav role={user?.role ?? 'admin'} />
        <div className="shell-user">
          <span>{user?.name}</span>
          <ThemeToggle />
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
