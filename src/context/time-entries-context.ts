import { createContext } from 'react'
import type { TimeEntry } from '../types'

export interface TimeEntriesContextValue {
  entries: TimeEntry[]
  getOpenEntry: (employeeId: string) => TimeEntry | undefined
  getEntriesForEmployee: (employeeId: string) => TimeEntry[]
  clockIn: (employeeId: string) => Promise<void>
  clockOut: (employeeId: string) => Promise<void>
  refetch: () => Promise<void>
}

export const TimeEntriesContext = createContext<TimeEntriesContextValue | undefined>(undefined)
