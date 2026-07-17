import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SessionContext } from './SessionContext'
import { useSessionContext } from './useSessionContext'

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

describe('SessionContext', () => {
  it('should expose the value provided via SessionContext.Provider', () => {
    render(
      <SessionContext.Provider
        value={{
          user: { id: 'user-1', name: 'Lucas', email: 'lucas@email.com', createdAt: '' },
          isAuthenticated: true,
          isLoading: false,
        }}
      >
        <Consumer />
      </SessionContext.Provider>,
    )

    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
    expect(screen.getByTestId('user')).toHaveTextContent('Lucas')
  })

  it('should throw when useSessionContext is used outside a provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Consumer />)).toThrow(
      'useSessionContext deve ser usado dentro de um SessionProvider',
    )
    consoleError.mockRestore()
  })
})
