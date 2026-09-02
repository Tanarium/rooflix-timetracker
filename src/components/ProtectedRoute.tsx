import { Navigate, Outlet } from 'react-router-dom'
import type { Role } from '../types'
import { useAuth } from '../context/useAuth'

export function ProtectedRoute({ allowedRoles }: { allowedRoles: Role[] }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="page">Cargando…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
