import type { CorrectionRequest, Employee, Role, TimeEntry } from '../types'

export interface EmployeeRow {
  id: string
  name: string
  email: string
  role: Role
  active: boolean
  created_at: string
}

export interface TimeEntryRow {
  id: string
  employee_id: string
  clock_in: string
  clock_out: string | null
  created_at: string
  updated_at: string
}

export interface CorrectionRequestRow {
  id: string
  employee_id: string
  date: string
  type: CorrectionRequest['type']
  related_entry_id: string | null
  proposed_clock_in: string | null
  proposed_clock_out: string
  reason: string
  status: CorrectionRequest['status']
  created_at: string
  resolved_at: string | null
  resolved_by: string | null
}

export function mapEmployee(row: EmployeeRow): Employee {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    active: row.active,
    createdAt: row.created_at,
  }
}

export function mapTimeEntry(row: TimeEntryRow): TimeEntry {
  return {
    id: row.id,
    employeeId: row.employee_id,
    clockIn: row.clock_in,
    clockOut: row.clock_out,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapCorrectionRequest(row: CorrectionRequestRow): CorrectionRequest {
  return {
    id: row.id,
    employeeId: row.employee_id,
    date: row.date,
    type: row.type,
    relatedEntryId: row.related_entry_id,
    proposedClockIn: row.proposed_clock_in,
    proposedClockOut: row.proposed_clock_out,
    reason: row.reason,
    status: row.status,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at,
    resolvedBy: row.resolved_by,
  }
}
