import type { Role } from '../../types'
import { useEmployees } from '../../context/useEmployees'
import { useAuth } from '../../context/useAuth'
import '../../styles/shared.css'

const roleLabels: Record<Role, string> = {
  employee: 'Empleado',
  admin: 'Administrador',
  superadmin: 'Superadmin',
}

export function EmployeesPage() {
  const { employees, toggleActive } = useEmployees()
  const { user } = useAuth()

  const canToggle = (targetRole: Role) =>
    user?.role === 'superadmin' || targetRole === 'employee'

  return (
    <div className="page">
      <h1>Empleados</h1>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{roleLabels[employee.role]}</td>
                  <td>
                    <span className={`badge ${employee.active ? 'badge-success' : 'badge-neutral'}`}>
                      {employee.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    {canToggle(employee.role) && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => toggleActive(employee.id)}
                      >
                        {employee.active ? 'Desactivar' : 'Activar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
