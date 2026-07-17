import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type RenderHookOptions, type RenderHookResult, renderHook } from '@testing-library/react'

function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}

// Mesma razão do renderWithProviders — hooks TanStack Query precisam de um
// QueryClientProvider no contexto, mesmo em teste de hook isolado (sem UI)
export function renderHookWithProviders<TResult, TProps>(
  callback: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps>,
): RenderHookResult<TResult, TProps> {
  const queryClient = createTestQueryClient()

  return renderHook(callback, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
    ...options,
  })
}
