import type * as React from 'react'
import type { FallbackProps } from 'react-error-boundary'

export interface QueryBoundaryProps {
  children: React.ReactNode
  loadingFallback?: React.ReactNode
  errorFallback?: (props: FallbackProps) => React.ReactNode
  onReset?: () => void
}
