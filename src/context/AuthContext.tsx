import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Employee } from '../types'
import { supabase } from '../lib/supabaseClient'
import { mapEmployee, type EmployeeRow } from '../lib/mappers'
import { AuthContext } from './auth-context'

async function fetchEmployeeProfile(userId: string): Promise<Employee | null> {
  const { data, error } = await supabase.from('employees').select('*').eq('id', userId).single()

  if (error || !data) return null
  return mapEmployee(data as EmployeeRow)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active) return
      setUser(session ? await fetchEmployeeProfile(session.user.id) : null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return
      setUser(session ? await fetchEmployeeProfile(session.user.id) : null)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)

    const profile = await fetchEmployeeProfile(data.user.id)
    if (!profile || !profile.active) {
      await supabase.auth.signOut()
      throw new Error('Tu cuenta no existe o está desactivada.')
    }
    setUser(profile)
  }, [])

  const logout = useCallback(() => {
    void supabase.auth.signOut()
  }, [])

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
