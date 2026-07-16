import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it } from 'vitest'
import { env } from '../../lib/env'
import { server } from '../../mocks/server'
import { useAuthStore } from '../../stores/auth-store'
import { renderWithProviders } from '../../test-utils/renderWithProviders'
import { UserMenu } from './UserMenu'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL

describe('UserMenu', () => {
  afterEach(() => {
    useAuthStore.getState().clear()
  })

  it('should render login and register links when not authenticated', () => {
    renderWithProviders(<UserMenu />)

    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('link', { name: 'Criar conta' })).toHaveAttribute('href', '/register')
  })

  it('should render a profile link and a logout button when authenticated', async () => {
    useAuthStore.getState().setSession('token', null)
    server.use(
      http.get(`${BASE}/api/auth/me`, () =>
        HttpResponse.json({
          id: 'user-1',
          name: 'Lucas',
          email: 'lucas@email.com',
          createdAt: '2026-01-01T00:00:00.000Z',
        }),
      ),
    )

    renderWithProviders(<UserMenu />)

    expect(await screen.findByRole('link', { name: 'Meu perfil' })).toHaveAttribute(
      'href',
      '/profile',
    )
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
  })

  it('should clear the session when logout is clicked', async () => {
    useAuthStore.getState().setSession('token', null)
    server.use(
      http.get(`${BASE}/api/auth/me`, () =>
        HttpResponse.json({
          id: 'user-1',
          name: 'Lucas',
          email: 'lucas@email.com',
          createdAt: '2026-01-01T00:00:00.000Z',
        }),
      ),
    )
    const { user } = renderWithProviders(<UserMenu />)

    await user.click(await screen.findByRole('button', { name: 'Sair' }))

    await waitFor(() => expect(useAuthStore.getState().accessToken).toBeNull())
  })
})
