'use client'

import { ErrorState } from '@microfrontends/ui'
import { useEffect } from 'react'
import './globals.css'

// Next.js só aciona isso quando o próprio root layout (error.tsx não cobre
// esse caso) lança — precisa renderizar <html>/<body> própria porque o
// layout que os fornecia é exatamente o que quebrou.
export default function GlobalError({
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
    <html lang="pt-BR">
      <body>
        <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center p-6">
          <ErrorState
            title="Algo deu errado"
            message="Ocorreu um erro inesperado. Tente novamente em instantes."
            onRetry={reset}
          />
        </div>
      </body>
    </html>
  )
}
