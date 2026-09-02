import { useAuth } from '../context/useAuth'
import { useTimeEntries } from '../context/useTimeEntries'
import '../styles/shared.css'

export function TimeClockPage() {
  const { user } = useAuth()
  const { getOpenEntry, clockIn, clockOut } = useTimeEntries()

  if (!user) return null

  const openEntry = getOpenEntry(user.id)

  return (
    <div className="page">
      <div className="card stack" style={{ alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <h1>{user.name}</h1>
          <span className={`badge ${openEntry ? 'badge-success' : 'badge-neutral'}`}>
            {openEntry ? 'Turno en curso' : 'Sin fichar'}
          </span>
        </div>

        {openEntry && (
          <p>
            Entrada registrada a las{' '}
            {new Date(openEntry.clockIn).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}

        {openEntry ? (
          <button
            type="button"
            className="btn btn-danger btn-lg"
            style={{ marginTop: 12 }}
            onClick={() => clockOut(user.id)}
          >
            Fichar salida
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-success btn-lg"
            style={{ marginTop: 12 }}
            onClick={() => clockIn(user.id)}
          >
            Fichar entrada
          </button>
        )}
      </div>
    </div>
  )
}
