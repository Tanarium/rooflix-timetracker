import { useMemo, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { useTimeEntries } from '../context/useTimeEntries'
import { formatDateTime, formatDuration, formatMonthName, formatMonthYear, monthOf, yearOf } from '../utils/format'
import { groupEntriesByMonth } from '../utils/groupByMonth'
import '../styles/shared.css'

const ALL = 'all'

export function MyRecordsPage() {
  const { user } = useAuth()
  const { getEntriesForEmployee } = useTimeEntries()
  const [selectedMonth, setSelectedMonth] = useState<typeof ALL | number>(ALL)
  const [selectedYear, setSelectedYear] = useState<typeof ALL | number>(ALL)

  const entries = useMemo(() => (user ? getEntriesForEmployee(user.id) : []), [user, getEntriesForEmployee])

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
      <h1>Mis registros</h1>

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
    </div>
  )
}
