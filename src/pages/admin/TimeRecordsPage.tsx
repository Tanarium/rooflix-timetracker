import { useMemo, useState } from 'react'
import { useTimeEntries } from '../../context/useTimeEntries'
import { useEmployees } from '../../context/useEmployees'
import type { Employee, TimeEntry } from '../../types'
import {
  formatDate,
  formatDateTime,
  formatDuration,
  formatMonthName,
  formatMonthYear,
  formatTime,
  formatTotalDuration,
  monthOf,
  yearOf,
} from '../../utils/format'
import { groupEntriesByMonth } from '../../utils/groupByMonth'
import { CollapsibleCard } from '../../components/CollapsibleCard'
import '../../styles/shared.css'

type StatusFilter = 'all' | 'incomplete' | 'complete'
const ALL = 'all'

export function TimeRecordsPage() {
  const { entries } = useTimeEntries()
  const { employees } = useEmployees()
  const trackedEmployees = useMemo(
    () => employees.filter((employee) => employee.role === 'employee'),
    [employees],
  )
  const [selectedEmployee, setSelectedEmployee] = useState<typeof ALL | string>(ALL)
  const [selectedMonth, setSelectedMonth] = useState<typeof ALL | number>(ALL)
  const [selectedYear, setSelectedYear] = useState<typeof ALL | number>(ALL)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const availableMonths = useMemo(
    () => Array.from(new Set(entries.map((entry) => monthOf(entry.clockIn)))).sort((a, b) => a - b),
    [entries],
  )

  const availableYears = useMemo(
    () => Array.from(new Set(entries.map((entry) => yearOf(entry.clockIn)))).sort((a, b) => a - b),
    [entries],
  )

  const filtersActive =
    selectedEmployee !== ALL || selectedMonth !== ALL || selectedYear !== ALL || statusFilter !== 'all'

  const matchesFilters = (entry: TimeEntry) => {
    if (selectedEmployee !== ALL && entry.employeeId !== selectedEmployee) return false
    if (selectedMonth !== ALL && monthOf(entry.clockIn) !== selectedMonth) return false
    if (selectedYear !== ALL && yearOf(entry.clockIn) !== selectedYear) return false
    if (statusFilter === 'incomplete' && entry.clockOut !== null) return false
    if (statusFilter === 'complete' && entry.clockOut === null) return false
    return true
  }

  const filteredEntries = entries.filter(
    (entry) =>
      trackedEmployees.some((employee) => employee.id === entry.employeeId) && matchesFilters(entry),
  )

  const sortedAscending = (list: TimeEntry[]) =>
    [...list].sort((a, b) => a.clockIn.localeCompare(b.clockIn))

  return (
    <div className="page">
      <h1>Registros de fichaje</h1>

      <div style={{ marginTop: 16 }}>
        <CollapsibleCard
          header={
            <>
              Filtros
              {filtersActive && <span className="badge badge-neutral">Activos</span>}
            </>
          }
        >
          <div className="filters" style={{ marginTop: 16 }}>
            <div className="field">
              <label htmlFor="employee-filter">Empleado</label>
              <select
                id="employee-filter"
                value={selectedEmployee}
                onChange={(event) => setSelectedEmployee(event.target.value)}
              >
                <option value={ALL}>Todos los empleados</option>
                {trackedEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

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

            <div className="field">
              <label htmlFor="status-filter">Estado del fichaje</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              >
                <option value="all">Todos</option>
                <option value="incomplete">Incompletos (sin salida)</option>
                <option value="complete">Completos</option>
              </select>
            </div>
          </div>
        </CollapsibleCard>
      </div>

      <div className="stack" style={{ marginTop: 16 }}>
        {statusFilter === 'incomplete' ? (
          <IncompleteEntriesTable entries={sortedAscending(filteredEntries)} employees={trackedEmployees} />
        ) : (
          <PerEmployeeTables
            employees={trackedEmployees}
            entries={filteredEntries}
            hideEmployeesWithNoMatches={filtersActive}
            sortedAscending={sortedAscending}
          />
        )}
      </div>
    </div>
  )
}

function PerEmployeeTables({
  employees,
  entries,
  hideEmployeesWithNoMatches,
  sortedAscending,
}: {
  employees: Employee[]
  entries: TimeEntry[]
  hideEmployeesWithNoMatches: boolean
  sortedAscending: (list: TimeEntry[]) => TimeEntry[]
}) {
  const rows = employees
    .map((employee) => ({
      employee,
      entries: sortedAscending(entries.filter((entry) => entry.employeeId === employee.id)),
    }))
    .filter((row) => !hideEmployeesWithNoMatches || row.entries.length > 0)

  if (rows.length === 0) {
    return (
      <div className="card">
        <p className="empty-state">Ningún empleado coincide con los filtros seleccionados.</p>
      </div>
    )
  }

  return (
    <>
      {rows.map(({ employee, entries: employeeEntries }) => {
        if (employeeEntries.length === 0) {
          return (
            <section key={employee.id} className="card stack">
              <h2>{employee.name}</h2>
              <p className="empty-state">Sin fichajes registrados.</p>
            </section>
          )
        }

        return (
          <CollapsibleCard
            key={employee.id}
            header={
              <>
                <h2>{employee.name}</h2>
                <span className="badge badge-neutral">Total: {formatTotalDuration(employeeEntries)}</span>
              </>
            }
          >
            <div className="stack" style={{ marginTop: 16 }}>
              {groupEntriesByMonth(employeeEntries).map((group) => (
                <div key={group.key}>
                  <h3 style={{ marginBottom: 8 }}>{formatMonthYear(group.entries[0].clockIn)}</h3>
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
                </div>
              ))}
            </div>
          </CollapsibleCard>
        )
      })}
    </>
  )
}

function IncompleteEntriesTable({
  entries,
  employees,
}: {
  entries: TimeEntry[]
  employees: Employee[]
}) {
  const employeeName = (employeeId: string) =>
    employees.find((employee) => employee.id === employeeId)?.name ?? 'Desconocido'

  if (entries.length === 0) {
    return (
      <div className="card">
        <p className="empty-state">No hay fichajes incompletos con los filtros seleccionados.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Fecha</th>
              <th>Entrada</th>
              <th>Pendiente</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{employeeName(entry.employeeId)}</td>
                <td>{formatDate(entry.clockIn)}</td>
                <td>{formatTime(entry.clockIn)}</td>
                <td>
                  <span className="badge badge-neutral">Falta fichar salida</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
