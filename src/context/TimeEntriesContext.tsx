import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { TimeEntry } from '../types'
import { supabase } from '../lib/supabaseClient'
import { mapTimeEntry, type TimeEntryRow } from '../lib/mappers'
import { useAuth } from './useAuth'
import { TimeEntriesContext } from './time-entries-context'

export function TimeEntriesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [entries, setEntries] = useState<TimeEntry[]>([])

  const refetch = useCallback(async () => {
    const { data, error } = await supabase.from('time_entries').select('*').order('clock_in')
    if (!error && data) {
      setEntries((data as TimeEntryRow[]).map(mapTimeEntry))
    }
  }, [])

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear stale data on logout
      setEntries([])
      return
    }

    let ignore = false
    supabase
      .from('time_entries')
      .select('*')
      .order('clock_in')
      .then(({ data, error }) => {
        if (!ignore && !error && data) setEntries((data as TimeEntryRow[]).map(mapTimeEntry))
      })
    return () => {
      ignore = true
    }
  }, [user])

  const getOpenEntry = useCallback(
    (employeeId: string) =>
      entries.find((entry) => entry.employeeId === employeeId && entry.clockOut === null),
    [entries],
  )

  const getEntriesForEmployee = useCallback(
    (employeeId: string) =>
      entries
        .filter((entry) => entry.employeeId === employeeId)
        .sort((a, b) => a.clockIn.localeCompare(b.clockIn)),
    [entries],
  )

  const clockIn = useCallback(
    async (employeeId: string) => {
      if (getOpenEntry(employeeId)) return

      const { error } = await supabase
        .from('time_entries')
        .insert({ employee_id: employeeId, clock_in: new Date().toISOString() })

      if (!error) await refetch()
    },
    [getOpenEntry, refetch],
  )

  const clockOut = useCallback(
    async (employeeId: string) => {
      const { error } = await supabase
        .from('time_entries')
        .update({ clock_out: new Date().toISOString() })
        .eq('employee_id', employeeId)
        .is('clock_out', null)

      if (!error) await refetch()
    },
    [refetch],
  )

  const value = useMemo(
    () => ({ entries, getOpenEntry, getEntriesForEmployee, clockIn, clockOut, refetch }),
    [entries, getOpenEntry, getEntriesForEmployee, clockIn, clockOut, refetch],
  )

  return <TimeEntriesContext.Provider value={value}>{children}</TimeEntriesContext.Provider>
}
