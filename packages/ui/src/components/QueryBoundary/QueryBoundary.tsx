import * as React from 'react'
import { ErrorBoundary, getErrorMessage, type FallbackProps } from 'react-error-boundary'
import { Loading } from '../Loading'
import { ErrorState } from '../Error'

export interface QueryBoundaryProps {
  children: React.ReactNode
  loadingFallback?: React.ReactNode
  errorFallback?: (props: FallbackProps) => React.ReactNode
  onReset?: () => void
}

// SRP: só orquestra loading/erro de uma árvore que usa useSuspenseQuery —
// não sabe nada sobre a query em si (isso fica no hook do consumidor).
// Composição, não reimplementação: reusa Loading e ErrorState já existentes.
export function QueryBoundary({
  children,
  loadingFallback,
  errorFallback,
  onReset,
}: QueryBoundaryProps) {
  return (
    <ErrorBoundary
      {...(onReset ? { onReset } : {})}
      fallbackRender={(fallbackProps) =>
        errorFallback ? (
          errorFallback(fallbackProps)
        ) : (
          <ErrorState
            message={getErrorMessage(fallbackProps.error) ?? 'Não foi possível carregar os dados.'}
            onRetry={fallbackProps.resetErrorBoundary}
          />
        )
      }
    >
      <React.Suspense fallback={loadingFallback ?? <Loading />}>{children}</React.Suspense>
    </ErrorBoundary>
  )
}
