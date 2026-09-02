import { useContext } from 'react'
import { TimeEntriesContext } from './time-entries-context'

export function useTimeEntries() {
  const context = useContext(TimeEntriesContext)
  if (!context) {
    throw new Error('useTimeEntries debe usarse dentro de un TimeEntriesProvider')
  }
  return context
}
