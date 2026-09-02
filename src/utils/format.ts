export function formatDateTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-ES', { timeStyle: 'short' })
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7)
}

export function yearOf(iso: string): number {
  return Number(iso.slice(0, 4))
}

export function monthOf(iso: string): number {
  return Number(iso.slice(5, 7))
}

export function formatMonthName(month: number): string {
  const label = new Date(2000, month - 1, 1).toLocaleDateString('es-ES', { month: 'long' })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function formatMonthYear(iso: string): string {
  return `${formatMonthName(monthOf(iso))} ${yearOf(iso)}`
}

export function isToday(iso: string): boolean {
  return iso.slice(0, 10) === new Date().toISOString().slice(0, 10)
}

function durationMinutes(clockIn: string, clockOut: string | null): number {
  const end = clockOut ? new Date(clockOut) : new Date()
  const start = new Date(clockIn)
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000))
}

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60
  return `${hours}h ${remaining.toString().padStart(2, '0')}m`
}

export function formatDuration(clockIn: string, clockOut: string | null): string {
  return formatMinutes(durationMinutes(clockIn, clockOut))
}

export function formatTotalDuration(entries: { clockIn: string; clockOut: string | null }[]): string {
  const total = entries.reduce((sum, entry) => sum + durationMinutes(entry.clockIn, entry.clockOut), 0)
  return formatMinutes(total)
}
