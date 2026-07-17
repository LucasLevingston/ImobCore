'use client'

import { ThemeProvider, Toaster } from '@microfrontends/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { SessionProvider } from './SessionProvider'

// Composição raiz do Portal (docs/ARCHITECTURE.md seção 05a). Tratamento de
// erro fica a cargo de app/error.tsx (Next.js) — mesmo padrão já usado em
// auth-frontend/properties-frontend, sem duplicar um ErrorBoundary manual aqui.
export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
