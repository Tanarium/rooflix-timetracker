import { useMemo, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { useTimeEntries } from '../context/useTimeEntries'
import { useCorrectionRequests } from '../context/useCorrectionRequests'
import { CorrectionRequestForm } from '../components/CorrectionRequestForm'
import {
  formatDate,
  formatDateTime,
  formatDuration,
  formatMonthName,
  formatMonthYear,
  isToday,
  monthOf,
  yearOf,
} from '../utils/format'
import { groupEntriesByMonth } from '../utils/groupByMonth'
import '../styles/shared.css'

const ALL = 'all'

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

export function MyRecordsPage() {
  const { user } = useAuth()
  const { getEntriesForEmployee } = useTimeEntries()
  const { getRequestsForEmployee } = useCorrectionRequests()
  const [openForm, setOpenForm] = useState<'missing-day' | string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<typeof ALL | number>(ALL)
  const [selectedYear, setSelectedYear] = useState<typeof ALL | number>(ALL)

  const entries = useMemo(() => (user ? getEntriesForEmployee(user.id) : []), [user, getEntriesForEmployee])
  const requests = useMemo(() => (user ? getRequestsForEmployee(user.id) : []), [user, getRequestsForEmployee])

  const availableMonths = useMemo(
    () => Array.from(new Set(entries.map((entry) => monthOf(entry.clockIn)))).sort((a, b) => a - b),
    [entries],
  )

  const availableYears = useMemo(
    () => Array.from(new Set(entries.map((entry) => yearOf(entry.clockIn)))).sort((a, b) => a - b),
    [entries],
  )

  if (!user) return null

  const filteredEntries = entries.filter((entry) => {
    if (selectedMonth !== ALL && monthOf(entry.clockIn) !== selectedMonth) return false
    if (selectedYear !== ALL && yearOf(entry.clockIn) !== selectedYear) return false
    return true
  })

  return (
    <div className="page">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <h1>Mis registros</h1>
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

      <div className="card filters" style={{ marginTop: 16 }}>
        <div className="field">
          <label htmlFor="month-filter">Mes</label>
          <select
            id="month-filter"
            value={selectedMonth}
            onChange={(event) =>
              setSelectedMonth(event.target.value === ALL ? ALL : Number(event.target.value))
            }
          >
            <option value={ALL}>Todos los meses</option>
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {formatMonthName(month)}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="year-filter">Año</label>
          <select
            id="year-filter"
            value={selectedYear}
            onChange={(event) =>
              setSelectedYear(event.target.value === ALL ? ALL : Number(event.target.value))
            }
          >
            <option value={ALL}>Todos los años</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="stack" style={{ marginTop: 16 }}>
        {filteredEntries.length === 0 ? (
          <div className="card">
            <p className="empty-state">No hay fichajes con los filtros seleccionados.</p>
          </div>
        ) : (
          groupEntriesByMonth(filteredEntries).map((group) => (
            <section key={group.key} className="card stack">
              <h2>{formatMonthYear(group.entries[0].clockIn)}</h2>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Entrada</th>
                      <th>Salida</th>
                      <th>Duración</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.entries.map((entry) => (
                      <tr key={entry.id}>
                        <td>{formatDateTime(entry.clockIn)}</td>
                        <td>{formatDateTime(entry.clockOut)}</td>
                        <td>{formatDuration(entry.clockIn, entry.clockOut)}</td>
                        <td>
                          {entry.clockOut === null && !isToday(entry.clockIn) && (
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setOpenForm(openForm === entry.id ? null : entry.id)}
                            >
                              Solicitar corrección
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))
        )}
      </div>

      {filteredEntries.map(
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

      {requests.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2>Mis solicitudes</h2>
          <div className="card" style={{ marginTop: 16 }}>
            <div className="table-scroll">
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
          </div>
        </div>
      )}
    </div>
  )
}
