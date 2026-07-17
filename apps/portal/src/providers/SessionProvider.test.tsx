import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useSessionContext } from '../contexts/useSessionContext'
import { MOCK_USER } from '../mocks/handlers/auth'
import { renderWithProviders } from '../test-utils/renderWithProviders'
import { SessionProvider } from './SessionProvider'

function Consumer() {
  const { user, isAuthenticated, isLoading } = useSessionContext()
  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="user">{user?.name ?? 'sem usuário'}</span>
    </div>
  )
}

describe('SessionProvider', () => {
  it('should start in a loading state', () => {
    renderWithProviders(
      <SessionProvider>
        <Consumer />
      </SessionProvider>,
    )
    expect(screen.getByTestId('loading')).toHaveTextContent('true')
  })

  it('should resolve to the authenticated user once the session loads', async () => {
    renderWithProviders(
      <SessionProvider>
        <Consumer />
      </SessionProvider>,
    )

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'))
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
    expect(screen.getByTestId('user')).toHaveTextContent(MOCK_USER.name)
  })
})
