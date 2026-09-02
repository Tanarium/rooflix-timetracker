import { createContext } from 'react'
import type { CorrectionRequest, CorrectionType, RequestStatus } from '../types'

export interface SubmitCorrectionInput {
  employeeId: string
  date: string
  type: CorrectionType
  relatedEntryId: string | null
  proposedClockIn: string | null
  proposedClockOut: string
  reason: string
}

export interface CorrectionRequestsContextValue {
  requests: CorrectionRequest[]
  getRequestsForEmployee: (employeeId: string) => CorrectionRequest[]
  submitRequest: (input: SubmitCorrectionInput) => Promise<void>
  resolveRequest: (id: string, decision: Exclude<RequestStatus, 'pending'>) => Promise<void>
}

export const CorrectionRequestsContext = createContext<CorrectionRequestsContextValue | undefined>(
  undefined,
)
