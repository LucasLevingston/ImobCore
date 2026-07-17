import { afterEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithUser } from '../test-utils/renderWithUser'
import { SessionContext } from '../contexts/SessionContext'
import type { SessionContextValue } from '../contexts/SessionContext.types'
import { logoutService } from '../services/logout.service'
import { UserMenu } from './UserMenu'

const authenticatedValue: SessionContextValue = {
  user: { id: 'user-1', name: 'Lucas Levingston', email: 'lucas@email.com', createdAt: '' },
  isAuthenticated: true,
  isLoading: false,
}

function renderMenu(value: SessionContextValue = authenticatedValue) {
  return renderWithUser(
    <SessionContext.Provider value={value}>
      <UserMenu />
    </SessionContext.Provider>,
  )
}

describe('UserMenu', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render nothing actionable while the session is loading', () => {
    renderMenu({ user: null, isAuthenticated: false, isLoading: true })
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should render the trigger with the user initials as the avatar fallback', () => {
    renderMenu()
    expect(screen.getByText('LL')).toBeInTheDocument()
  })

  it('should show the user name and email after opening the menu', async () => {
    const { user } = renderMenu()
    await user.click(screen.getByRole('button', { name: /Lucas Levingston/ }))
    expect(await screen.findByText('lucas@email.com')).toBeInTheDocument()
  })

  it('should call the logout service when "Sair" is clicked', async () => {
    const logoutSpy = vi.spyOn(logoutService, 'logout').mockResolvedValue(undefined)
    // jsdom não implementa navegação real — sem isso, location.reload() gera
    // ruído de "Not implemented" no console durante o teste
    const reloadSpy = vi.fn()
    vi.stubGlobal('location', { ...window.location, reload: reloadSpy })

    const { user } = renderMenu()
    await user.click(screen.getByRole('button', { name: /Lucas Levingston/ }))
    await user.click(await screen.findByText('Sair'))

    await waitFor(() => expect(logoutSpy).toHaveBeenCalled())
    vi.unstubAllGlobals()
  })
})
