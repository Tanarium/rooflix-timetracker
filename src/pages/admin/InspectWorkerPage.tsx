import { useMemo, useState } from 'react'
import { useEmployees } from '../../context/useEmployees'
import { useTimeEntries } from '../../context/useTimeEntries'
import {
  formatDateTime,
  formatDuration,
  formatMonthName,
  formatMonthYear,
  formatTotalDuration,
  isThisMonth,
  isThisWeek,
  monthOf,
  yearOf,
} from '../../utils/format'
import { groupEntriesByMonth } from '../../utils/groupByMonth'
import { exportMonthlyPdf } from '../../lib/exportMonthlyPdf'
import '../../styles/shared.css'

const ALL = 'all'

export function InspectWorkerPage() {
  const { employees } = useEmployees()
  const { entries } = useTimeEntries()

  const trackedEmployees = useMemo(
    () => employees.filter((employee) => employee.role === 'employee' || employee.role === 'admin'),
    [employees],
  )

  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [selectedMonth, setSelectedMonth] = useState<typeof ALL | number>(ALL)
  const [selectedYear, setSelectedYear] = useState<typeof ALL | number>(ALL)

  const employee = trackedEmployees.find((item) => item.id === selectedEmployeeId) ?? null

  const employeeEntries = useMemo(
    () =>
      entries
        .filter((entry) => entry.employeeId === selectedEmployeeId)
        .sort((a, b) => a.clockIn.localeCompare(b.clockIn)),
    [entries, selectedEmployeeId],
  )

  const availableMonths = useMemo(
    () => Array.from(new Set(employeeEntries.map((entry) => monthOf(entry.clockIn)))).sort((a, b) => a - b),
    [employeeEntries],
  )

  const availableYears = useMemo(
    () => Array.from(new Set(employeeEntries.map((entry) => yearOf(entry.clockIn)))).sort((a, b) => a - b),
    [employeeEntries],
  )

  const filteredEntries = employeeEntries.filter((entry) => {
    if (selectedMonth !== ALL && monthOf(entry.clockIn) !== selectedMonth) return false
    if (selectedYear !== ALL && yearOf(entry.clockIn) !== selectedYear) return false
    return true
  })

  const weekTotal = formatTotalDuration(employeeEntries.filter((entry) => isThisWeek(entry.clockIn)))
  const monthTotal = formatTotalDuration(employeeEntries.filter((entry) => isThisMonth(entry.clockIn)))
  const openEntry = employeeEntries.find((entry) => entry.clockOut === null)

  const canExport =
    employee !== null && selectedMonth !== ALL && selectedYear !== ALL && filteredEntries.length > 0

  const handleExport = () => {
    if (!canExport || !employee) return
    exportMonthlyPdf(employee, formatMonthYear(filteredEntries[0].clockIn), filteredEntries)
  }

  const selectEmployee = (id: string) => {
    setSelectedEmployeeId(id)
    setSelectedMonth(ALL)
    setSelectedYear(ALL)
  }

  return (
    <div className="page">
      <h1>Inspeccionar trabajador</h1>

      <div className="card filters" style={{ marginTop: 16 }}>
        <div className="field">
          <label htmlFor="worker-select">Trabajador</label>
          <select
            id="worker-select"
            value={selectedEmployeeId}
            onChange={(event) => selectEmployee(event.target.value)}
          >
            <option value="">Selecciona un trabajador</option>
            {trackedEmployees.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="worker-month-filter">Mes</label>
          <select
            id="worker-month-filter"
            value={selectedMonth}
            disabled={!employee}
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
          <label htmlFor="worker-year-filter">Año</label>
          <select
            id="worker-year-filter"
            value={selectedYear}
            disabled={!employee}
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

      {!employee ? (
        <div className="card" style={{ marginTop: 16 }}>
          <p className="empty-state">Selecciona un trabajador para ver su detalle.</p>
        </div>
      ) : (
        <>
          <div
            className="card"
            style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}
          >
            <span className="badge badge-neutral">Esta semana: {weekTotal}</span>
            <span className="badge badge-neutral">Este mes: {monthTotal}</span>
            {openEntry && (
              <span className="badge badge-success">
                Turno en curso desde {formatDateTime(openEntry.clockIn)}
              </span>
            )}
          </div>

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" className="btn" disabled={!canExport} onClick={handleExport}>
              Descargar PDF del mes
            </button>
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
                        </tr>
                      </thead>
                      <tbody>
                        {group.entries.map((entry) => (
                          <tr key={entry.id}>
                            <td>{formatDateTime(entry.clockIn)}</td>
                            <td>{formatDateTime(entry.clockOut)}</td>
                            <td>{formatDuration(entry.clockIn, entry.clockOut)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
