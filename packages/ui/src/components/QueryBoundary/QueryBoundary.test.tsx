import { QueryClient, QueryClientProvider, useSuspenseQuery } from '@tanstack/react-query'
import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithUser } from '../../test-utils'
import { QueryBoundary } from './QueryBoundary'

function createQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } })
}

function ProbeQuery({ queryFn }: { queryFn: () => Promise<string> }) {
  const { data } = useSuspenseQuery({ queryKey: ['probe'], queryFn })
  return <p>{data}</p>
}

function renderBoundary(queryFn: () => Promise<string>) {
  const queryClient = createQueryClient()
  return renderWithUser(
    <QueryClientProvider client={queryClient}>
      <QueryBoundary>
        <ProbeQuery queryFn={queryFn} />
      </QueryBoundary>
    </QueryClientProvider>,
  )
}

describe('QueryBoundary', () => {
  it('should render the loading fallback while the suspended query is pending', () => {
    renderBoundary(() => new Promise(() => {}))
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('should render children once the query resolves', async () => {
    renderBoundary(() => Promise.resolve('imóveis carregados'))
    expect(await screen.findByText('imóveis carregados')).toBeInTheDocument()
  })

  it('should render the default error fallback when the query throws', async () => {
    renderBoundary(() => Promise.reject(new Error('falha de rede')))
    expect(await screen.findByText('falha de rede')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument()
  })

  it('should fall back to a default message when the thrown value has no message', async () => {
    renderBoundary(() => Promise.reject({}))
    expect(await screen.findByText('Não foi possível carregar os dados.')).toBeInTheDocument()
  })

  it('should render a custom errorFallback when provided instead of the default ErrorState', async () => {
    const queryClient = createQueryClient()
    renderWithUser(
      <QueryClientProvider client={queryClient}>
        <QueryBoundary errorFallback={() => <p>Erro customizado</p>}>
          <ProbeQuery queryFn={() => Promise.reject(new Error('falha'))} />
        </QueryBoundary>
      </QueryClientProvider>,
    )

    expect(await screen.findByText('Erro customizado')).toBeInTheDocument()
  })

  it('should render a custom loadingFallback when provided instead of the default Loading', () => {
    const queryClient = createQueryClient()
    renderWithUser(
      <QueryClientProvider client={queryClient}>
        <QueryBoundary loadingFallback={<p>Carregando imóveis...</p>}>
          <ProbeQuery queryFn={() => new Promise(() => {})} />
        </QueryBoundary>
      </QueryClientProvider>,
    )

    expect(screen.getByText('Carregando imóveis...')).toBeInTheDocument()
  })

  it('should call onReset and retry the query when resetErrorBoundary is triggered', async () => {
    const queryClient = createQueryClient()
    let attempt = 0
    const queryFn = vi.fn(() => {
      attempt += 1
      return attempt === 1
        ? Promise.reject(new Error('falha temporária'))
        : Promise.resolve('ok agora')
    })
    // Simula a integração real: onReset também limpa o estado de erro da query
    // no cache (sem isso, useSuspenseQuery re-lançaria o mesmo erro em cache).
    const onReset = vi.fn(() => void queryClient.resetQueries())

    const { user } = renderWithUser(
      <QueryClientProvider client={queryClient}>
        <QueryBoundary onReset={onReset}>
          <ProbeQuery queryFn={queryFn} />
        </QueryBoundary>
      </QueryClientProvider>,
    )

    expect(await screen.findByText('falha temporária')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(onReset).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('ok agora')).toBeInTheDocument()
  })
})
