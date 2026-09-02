import { useContext } from 'react'
import { CorrectionRequestsContext } from './correction-requests-context'

export function useCorrectionRequests() {
  const context = useContext(CorrectionRequestsContext)
  if (!context) {
    throw new Error('useCorrectionRequests debe usarse dentro de un CorrectionRequestsProvider')
  }
  return context
}
