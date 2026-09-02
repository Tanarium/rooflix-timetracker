import { useMemo, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { useTimeEntries } from '../context/useTimeEntries'
import { useCorrectionRequests } from '../context/useCorrectionRequests'
import { CorrectionRequestForm } from '../components/CorrectionRequestForm'
import { formatDate, formatDateTime, isToday } from '../utils/format'
import '../styles/shared.css'

const statusLabels = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  rejected: 'Rechazada',
} as const

const statusBadgeClass = {
  pending: 'badge-neutral',
  approved: 'badge-success',
  rejected: 'badge-danger',
} as const

const typeLabels = {
  'missing-clock-out': 'Falta salida',
  'missing-day': 'Día sin fichar',
} as const

export function MyRequestsPage() {
  const { user } = useAuth()
  const { getEntriesForEmployee } = useTimeEntries()
  const { getRequestsForEmployee } = useCorrectionRequests()
  const [openForm, setOpenForm] = useState<'missing-day' | string | null>(null)

  const entries = useMemo(() => (user ? getEntriesForEmployee(user.id) : []), [user, getEntriesForEmployee])
  const requests = useMemo(() => (user ? getRequestsForEmployee(user.id) : []), [user, getRequestsForEmployee])

  const pendingEntries = useMemo(
    () => entries.filter((entry) => entry.clockOut === null && !isToday(entry.clockIn)),
    [entries],
  )

  if (!user) return null

  return (
    <div className="page">
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1>Mis solicitudes</h1>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setOpenForm(openForm === 'missing-day' ? null : 'missing-day')}
        >
          Crear petición
        </button>
      </div>

      {openForm === 'missing-day' && (
        <div style={{ marginTop: 16 }}>
          <CorrectionRequestForm
            employeeId={user.id}
            mode="missing-day"
            onDone={() => setOpenForm(null)}
          />
        </div>
      )}

      {pendingEntries.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <h2>Fichajes sin salida</h2>
          <div className="table-scroll" style={{ marginTop: 16 }}>
            <table>
              <thead>
                <tr>
                  <th>Entrada</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pendingEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{formatDateTime(entry.clockIn)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setOpenForm(openForm === entry.id ? null : entry.id)}
                      >
                        Solicitar corrección
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pendingEntries.map(
        (entry) =>
          openForm === entry.id && (
            <div key={entry.id} style={{ marginTop: 16 }}>
              <CorrectionRequestForm
                employeeId={user.id}
                mode="missing-clock-out"
                entry={entry}
                onDone={() => setOpenForm(null)}
              />
            </div>
          ),
      )}

      <div className="card" style={{ marginTop: 16 }}>
        <h2>Historial</h2>
        {requests.length === 0 ? (
          <p className="empty-state" style={{ marginTop: 16 }}>
            Todavía no has enviado ninguna solicitud.
          </p>
        ) : (
          <div className="table-scroll" style={{ marginTop: 16 }}>
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{formatDate(request.date)}</td>
                    <td>{typeLabels[request.type]}</td>
                    <td>{request.reason}</td>
                    <td>
                      <span className={`badge ${statusBadgeClass[request.status]}`}>
                        {statusLabels[request.status]}
                      </span>
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
