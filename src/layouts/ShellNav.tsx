import { NavLink } from 'react-router-dom'
import type { Role } from '../types'

export function ShellNav({ role }: { role: Role }) {
  return (
    <nav className="shell-nav">
      {role !== 'superadmin' && (
        <>
          <NavLink to="/fichaje">Fichaje</NavLink>
          <NavLink to="/mis-registros">Mis registros</NavLink>
          <NavLink to="/mis-solicitudes">Mis solicitudes</NavLink>
        </>
      )}
      {role !== 'employee' && (
        <>
          <NavLink to="/empleados">Empleados</NavLink>
          <NavLink to="/registros">Registros</NavLink>
          <NavLink to="/solicitudes">Solicitudes</NavLink>
        </>
      )}
    </nav>
  )
}
