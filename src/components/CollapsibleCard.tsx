import type { ReactNode } from 'react'
import { useIsMobile } from '../utils/useIsMobile'

export function CollapsibleCard({ header, children }: { header: ReactNode; children: ReactNode }) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <details className="card details-card">
        <summary>{header}</summary>
        {children}
      </details>
    )
  }

  return (
    <div className="card">
      <div className="details-card-header">{header}</div>
      {children}
    </div>
  )
}
