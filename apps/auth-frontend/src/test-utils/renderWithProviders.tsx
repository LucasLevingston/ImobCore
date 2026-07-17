import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type RenderOptions, type RenderResult, render } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import type { ReactElement } from 'react'

function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}

interface RenderWithProvidersResult extends RenderResult {
  user: UserEvent
  queryClient: QueryClient
}

// Providers reais da app (só QueryClient por ora — Zustand não precisa de
// provider) — evita repetir wrapper em todo teste de componente
export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions,
): RenderWithProvidersResult {
  const queryClient = createTestQueryClient()
  const user = userEvent.setup()

  const result = render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
    ...options,
  })

  return { user, queryClient, ...result }
}
