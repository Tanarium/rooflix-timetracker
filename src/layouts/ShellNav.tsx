import { NavLink } from 'react-router-dom'
import type { Role } from '../types'

export function ShellNav({ role }: { role: Role }) {
  return (
    <nav className="shell-nav">
      <NavLink to="/app/time-clock">Fichaje</NavLink>
      <NavLink to="/app/my-records">Mis registros</NavLink>
      <NavLink to="/app/requests">Mis solicitudes</NavLink>
      {role !== 'employee' && (
        <>
          <NavLink to="/admin/employees">Empleados</NavLink>
          <NavLink to="/admin/time-records">Registros</NavLink>
          <NavLink to="/admin/requests">Solicitudes</NavLink>
        </>
      )}
    </nav>
  )
}
