'use client'

import { ErrorState } from '@microfrontends/ui'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center p-6">
      <ErrorState
        title="Algo deu errado"
        message={error.message || 'Tente novamente em instantes.'}
        onRetry={reset}
      />
    </div>
  )
}
