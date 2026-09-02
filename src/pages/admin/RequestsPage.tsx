import { useState } from 'react'
import { useCorrectionRequests } from '../../context/useCorrectionRequests'
import { useEmployees } from '../../context/useEmployees'
import type { RequestStatus } from '../../types'
import { formatDate, formatTime } from '../../utils/format'
import '../../styles/shared.css'

type StatusFilter = 'all' | 'pending' | 'resolved'

const statusLabels: Record<RequestStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  rejected: 'Rechazada',
}

const statusBadgeClass: Record<RequestStatus, string> = {
  pending: 'badge-neutral',
  approved: 'badge-success',
  rejected: 'badge-danger',
}

const typeLabels = {
  'missing-clock-out': 'Falta salida',
  'missing-day': 'Día sin fichar',
} as const

export function RequestsPage() {
  const { requests, resolveRequest } = useCorrectionRequests()
  const { employees } = useEmployees()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending')

  const employeeName = (employeeId: string) =>
    employees.find((employee) => employee.id === employeeId)?.name ?? 'Desconocido'

  const filtered = requests
    .filter((request) => {
      if (statusFilter === 'pending') return request.status === 'pending'
      if (statusFilter === 'resolved') return request.status !== 'pending'
      return true
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className="page">
      <h1>Solicitudes de corrección</h1>

      <div className="card filters" style={{ marginTop: 16 }}>
        <div className="field">
          <label htmlFor="request-status-filter">Estado</label>
          <select
            id="request-status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          >
            <option value="pending">Pendientes</option>
            <option value="resolved">Resueltas</option>
            <option value="all">Todas</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        {filtered.length === 0 ? (
          <p className="empty-state">No hay solicitudes con este filtro.</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Empleado</th>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Propuesta</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((request) => (
                  <tr key={request.id}>
                    <td>{employeeName(request.employeeId)}</td>
                    <td>{formatDate(request.date)}</td>
                    <td>{typeLabels[request.type]}</td>
                    <td>
                      {request.proposedClockIn ? `${formatTime(request.proposedClockIn)} – ` : ''}
                      {formatTime(request.proposedClockOut)}
                    </td>
                    <td style={{ whiteSpace: 'normal', minWidth: 160 }}>{request.reason}</td>
                    <td>
                      <span className={`badge ${statusBadgeClass[request.status]}`}>
                        {statusLabels[request.status]}
                      </span>
                    </td>
                    <td>
                      {request.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => resolveRequest(request.id, 'approved')}
                          >
                            Aprobar
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => resolveRequest(request.id, 'rejected')}
                          >
                            Rechazar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
