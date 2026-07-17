import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SessionContext } from '../contexts/SessionContext'
import type { SessionContextValue } from '../contexts/SessionContext.types'
import { renderWithUser } from '../test-utils/renderWithUser'
import { PortalGreeting } from './PortalGreeting'

function renderGreeting(value: SessionContextValue) {
  return renderWithUser(
    <SessionContext.Provider value={value}>
      <PortalGreeting />
    </SessionContext.Provider>,
  )
}

describe('PortalGreeting', () => {
  it('should greet the user by first name once the session loads', () => {
    renderGreeting({
      user: { id: 'user-1', name: 'Lucas Levingston', email: 'lucas@email.com', createdAt: '' },
      isAuthenticated: true,
      isLoading: false,
    })
    expect(screen.getByRole('heading', { name: /Lucas/ })).toBeInTheDocument()
  })

  it('should render a loading skeleton while the session is loading', () => {
    renderGreeting({ user: null, isAuthenticated: false, isLoading: true })
    expect(screen.getByRole('status')).toHaveTextContent(/carregando/i)
  })

  it('should render a generic greeting when there is no user', () => {
    renderGreeting({ user: null, isAuthenticated: false, isLoading: false })
    expect(screen.getByRole('heading')).toHaveTextContent('Bem-vindo(a)')
  })
})
