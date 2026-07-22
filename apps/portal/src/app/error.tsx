'use client'

import { ErrorState } from '@microfrontends/ui'
import { useEffect } from 'react'

// Nunca mostra error.message pro usuário — pode ser texto técnico em inglês,
// stack trace ou vazar detalhe interno; a mensagem exibida é sempre fixa e
// segura, o erro real vai só pro console (logging/observabilidade)
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center p-6">
      <ErrorState
        title="Algo deu errado"
        message="Ocorreu um erro inesperado. Tente novamente em instantes."
        onRetry={reset}
      />
    </div>
  )
}
