import { useState } from 'react'
import type { FormEvent } from 'react'
import type { TimeEntry } from '../types'
import { useCorrectionRequests } from '../context/useCorrectionRequests'
import { formatDate } from '../utils/format'

type CorrectionRequestFormProps =
  | { employeeId: string; mode: 'missing-clock-out'; entry: TimeEntry; onDone: () => void }
  | { employeeId: string; mode: 'missing-day'; onDone: () => void }

function toIso(dateStr: string, timeStr: string): string {
  return new Date(`${dateStr}T${timeStr}:00`).toISOString()
}

const today = new Date().toISOString().slice(0, 10)

export function CorrectionRequestForm(props: CorrectionRequestFormProps) {
  const { submitRequest } = useCorrectionRequests()
  const [date, setDate] = useState('')
  const [clockInTime, setClockInTime] = useState('')
  const [clockOutTime, setClockOutTime] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  const fixedDate = props.mode === 'missing-clock-out' ? props.entry.clockIn.slice(0, 10) : null

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!reason.trim()) {
      setError('Cuéntanos brevemente qué pasó.')
      return
    }

    if (props.mode === 'missing-clock-out') {
      if (!clockOutTime) {
        setError('Indica la hora de salida.')
        return
      }
      const proposedClockOut = toIso(fixedDate!, clockOutTime)
      if (proposedClockOut <= props.entry.clockIn) {
        setError('La salida debe ser posterior a la entrada registrada.')
        return
      }
      submitRequest({
        employeeId: props.employeeId,
        date: fixedDate!,
        type: 'missing-clock-out',
        relatedEntryId: props.entry.id,
        proposedClockIn: null,
        proposedClockOut,
        reason: reason.trim(),
      })
    } else {
      if (!date || !clockInTime || !clockOutTime) {
        setError('Completa la fecha, la entrada y la salida.')
        return
      }
      if (date > today) {
        setError('No puedes solicitar un día futuro.')
        return
      }
      const proposedClockIn = toIso(date, clockInTime)
      const proposedClockOut = toIso(date, clockOutTime)
      if (proposedClockOut <= proposedClockIn) {
        setError('La salida debe ser posterior a la entrada.')
        return
      }
      submitRequest({
        employeeId: props.employeeId,
        date,
        type: 'missing-day',
        relatedEntryId: null,
        proposedClockIn,
        proposedClockOut,
        reason: reason.trim(),
      })
    }

    props.onDone()
  }

  return (
    <form className="card stack" onSubmit={handleSubmit}>
      {props.mode === 'missing-clock-out' ? (
        <p>
          Falta la salida del <strong>{formatDate(props.entry.clockIn)}</strong>. Indica la hora
          correcta.
        </p>
      ) : (
        <p>Indica el día completo que no llegaste a fichar.</p>
      )}

      <div className="form-row">
        {props.mode === 'missing-day' && (
          <div className="field">
            <label htmlFor="cr-date">Fecha</label>
            <input
              id="cr-date"
              type="date"
              max={today}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </div>
        )}

        {props.mode === 'missing-day' && (
          <div className="field">
            <label htmlFor="cr-clock-in">Hora de entrada</label>
            <input
              id="cr-clock-in"
              type="time"
              value={clockInTime}
              onChange={(event) => setClockInTime(event.target.value)}
              required
            />
          </div>
        )}

        <div className="field">
          <label htmlFor="cr-clock-out">Hora de salida</label>
          <input
            id="cr-clock-out"
            type="time"
            value={clockOutTime}
            onChange={(event) => setClockOutTime(event.target.value)}
            required
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="cr-reason">Motivo</label>
        <textarea
          id="cr-reason"
          rows={2}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          required
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="form-row">
        <button type="submit" className="btn">
          Enviar solicitud
        </button>
        <button type="button" className="btn btn-secondary" onClick={props.onDone}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
