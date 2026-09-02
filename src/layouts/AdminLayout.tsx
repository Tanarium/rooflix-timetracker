import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import './Layout.css'

export function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="shell">
      <header className="shell-header">
        <span className="shell-brand">Rooflix TimeTracker · Admin</span>
        <nav className="shell-nav">
          <NavLink to="/admin/employees">Empleados</NavLink>
          <NavLink to="/admin/time-records">Registros</NavLink>
          <NavLink to="/admin/requests">Solicitudes</NavLink>
        </nav>
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
