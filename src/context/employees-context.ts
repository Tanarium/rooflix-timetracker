import { createContext } from 'react'
import type { Employee } from '../types'

export interface EmployeesContextValue {
  employees: Employee[]
  toggleActive: (id: string) => Promise<void>
}

export const EmployeesContext = createContext<EmployeesContextValue | undefined>(undefined)
