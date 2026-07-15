import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../../../../stores/auth-store'
import { renderWithProviders } from '../../../../test-utils/renderWithProviders'
import { LogoutButton } from './LogoutButton'

describe('LogoutButton', () => {
  it('should render with the label "Sair"', () => {
    renderWithProviders(<LogoutButton />)
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
  })

  it('should clear the auth store and call onLoggedOut when clicked', async () => {
    useAuthStore
      .getState()
      .setSession('token', {
        id: 'user-1',
        name: 'Lucas',
        email: 'lucas@email.com',
        createdAt: '2026-01-01T00:00:00.000Z',
      })
    const onLoggedOut = vi.fn()
    const { user } = renderWithProviders(<LogoutButton onLoggedOut={onLoggedOut} />)

    await user.click(screen.getByRole('button', { name: 'Sair' }))

    await waitFor(() => expect(onLoggedOut).toHaveBeenCalledTimes(1))
    expect(useAuthStore.getState().accessToken).toBeNull()
  })

  it('should not throw when clicked without an onLoggedOut callback', async () => {
    useAuthStore.getState().setSession('token', null)
    const { user } = renderWithProviders(<LogoutButton />)

    await user.click(screen.getByRole('button', { name: 'Sair' }))

    await waitFor(() => expect(useAuthStore.getState().accessToken).toBeNull())
  })
})
