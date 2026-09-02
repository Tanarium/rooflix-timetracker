import type { TimeEntry } from '../types'
import { monthKey } from './format'

export interface MonthGroup {
  key: string
  entries: TimeEntry[]
}

export function groupEntriesByMonth(entries: TimeEntry[]): MonthGroup[] {
  const groups = new Map<string, TimeEntry[]>()
  for (const entry of entries) {
    const key = monthKey(entry.clockIn)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(entry)
  }
  return Array.from(groups.entries()).map(([key, monthEntries]) => ({ key, entries: monthEntries }))
}
