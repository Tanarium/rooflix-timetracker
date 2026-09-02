import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { CorrectionRequest, RequestStatus } from '../types'
import { supabase } from '../lib/supabaseClient'
import { mapCorrectionRequest, type CorrectionRequestRow } from '../lib/mappers'
import { useAuth } from './useAuth'
import { useTimeEntries } from './useTimeEntries'
import { CorrectionRequestsContext, type SubmitCorrectionInput } from './correction-requests-context'

export function CorrectionRequestsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { refetch: refetchTimeEntries } = useTimeEntries()
  const [requests, setRequests] = useState<CorrectionRequest[]>([])

  const refetch = useCallback(async () => {
    const { data, error } = await supabase
      .from('correction_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setRequests((data as CorrectionRequestRow[]).map(mapCorrectionRequest))
    }
  }, [])

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear stale data on logout
      setRequests([])
      return
    }

    let ignore = false
    supabase
      .from('correction_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!ignore && !error && data) setRequests((data as CorrectionRequestRow[]).map(mapCorrectionRequest))
      })
    return () => {
      ignore = true
    }
  }, [user])

  const getRequestsForEmployee = useCallback(
    (employeeId: string) => requests.filter((request) => request.employeeId === employeeId),
    [requests],
  )

  const submitRequest = useCallback(
    async (input: SubmitCorrectionInput) => {
      const { error } = await supabase.from('correction_requests').insert({
        employee_id: input.employeeId,
        date: input.date,
        type: input.type,
        related_entry_id: input.relatedEntryId,
        proposed_clock_in: input.proposedClockIn,
        proposed_clock_out: input.proposedClockOut,
        reason: input.reason,
      })

      if (!error) await refetch()
    },
    [refetch],
  )

  const resolveRequest = useCallback(
    async (id: string, decision: Exclude<RequestStatus, 'pending'>) => {
      const { error } = await supabase
        .from('correction_requests')
        .update({ status: decision })
        .eq('id', id)

      if (!error) {
        // El trigger de la base de datos aplica el cambio en time_entries al aprobar.
        await Promise.all([refetch(), refetchTimeEntries()])
      }
    },
    [refetch, refetchTimeEntries],
  )

  const value = useMemo(
    () => ({ requests, getRequestsForEmployee, submitRequest, resolveRequest }),
    [requests, getRequestsForEmployee, submitRequest, resolveRequest],
  )

  return (
    <CorrectionRequestsContext.Provider value={value}>{children}</CorrectionRequestsContext.Provider>
  )
}
