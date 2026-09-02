export type Role = 'employee' | 'admin' | 'superadmin'

export interface Employee {
  id: string
  name: string
  email: string
  active: boolean
  role: Role
  createdAt: string
}

export interface TimeEntry {
  id: string
  employeeId: string
  clockIn: string
  clockOut: string | null
  createdAt: string
  updatedAt: string
}

export type CorrectionType = 'missing-clock-out' | 'missing-day'
export type RequestStatus = 'pending' | 'approved' | 'rejected'

export interface CorrectionRequest {
  id: string
  employeeId: string
  date: string
  type: CorrectionType
  relatedEntryId: string | null
  proposedClockIn: string | null
  proposedClockOut: string
  reason: string
  status: RequestStatus
  createdAt: string
  resolvedAt: string | null
  resolvedBy: string | null
}
