import { createContext } from 'react'
import type { Employee } from '../types'

export interface AuthContextValue {
  user: Employee | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
