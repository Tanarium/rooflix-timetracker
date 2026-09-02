import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Employee } from '../types'
import { supabase } from '../lib/supabaseClient'
import { mapEmployee, type EmployeeRow } from '../lib/mappers'
import { useAuth } from './useAuth'
import { EmployeesContext } from './employees-context'

export function EmployeesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])

  const fetchEmployees = useCallback(async () => {
    const { data, error } = await supabase.from('employees').select('*').order('name')
    if (!error && data) {
      setEmployees((data as EmployeeRow[]).map(mapEmployee))
    }
  }, [])

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear stale data on logout
      setEmployees([])
      return
    }

    let ignore = false
    supabase
      .from('employees')
      .select('*')
      .order('name')
      .then(({ data, error }) => {
        if (!ignore && !error && data) setEmployees((data as EmployeeRow[]).map(mapEmployee))
      })
    return () => {
      ignore = true
    }
  }, [user])

  const toggleActive = useCallback(
    async (id: string) => {
      const employee = employees.find((item) => item.id === id)
      if (!employee) return

      const { error } = await supabase
        .from('employees')
        .update({ active: !employee.active })
        .eq('id', id)

      if (!error) {
        await fetchEmployees()
      }
    },
    [employees, fetchEmployees],
  )

  const value = useMemo(() => ({ employees, toggleActive }), [employees, toggleActive])

  return <EmployeesContext.Provider value={value}>{children}</EmployeesContext.Provider>
}
