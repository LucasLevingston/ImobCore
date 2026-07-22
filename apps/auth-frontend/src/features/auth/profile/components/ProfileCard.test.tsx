import { screen, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { env } from '../../../../lib/env'
import { server } from '../../../../mocks/server'
import { useAuthStore } from '../../../../stores/auth-store'
import { renderWithProviders } from '../../../../test-utils/renderWithProviders'
import { ProfileCard } from './ProfileCard'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL

describe('ProfileCard', () => {
  it('should show a loading state while fetching', () => {
    useAuthStore.getState().setSession('token', null)
    renderWithProviders(<ProfileCard />)

    expect(screen.getAllByRole('status').length).toBeGreaterThan(0)
    useAuthStore.getState().clear()
  })

  it("should render the user's name and email after loading", async () => {
    useAuthStore.getState().setSession('token', null)
    server.use(
      http.get(`${BASE}/api/auth/me`, () =>
        HttpResponse.json({
          id: 'user-1',
          name: 'Lucas Levingston',
          email: 'lucas@email.com',
          createdAt: '2026-01-01T00:00:00.000Z',
        }),
      ),
    )

    renderWithProviders(<ProfileCard />)

    expect(await screen.findByText('Lucas Levingston')).toBeInTheDocument()
    expect(screen.getByText('lucas@email.com')).toBeInTheDocument()
    useAuthStore.getState().clear()
  })

  it('should render a single-letter avatar initial for a one-word name', async () => {
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

    renderWithProviders(<ProfileCard />)

    expect(await screen.findByText('L')).toBeInTheDocument()
    useAuthStore.getState().clear()
  })

  it('should render an error state with a retry button on failure', async () => {
    useAuthStore.getState().setSession('token', null)
    server.use(
      http.get(`${BASE}/api/auth/me`, () =>
        HttpResponse.json({ message: 'boom' }, { status: 500 }),
      ),
    )

    renderWithProviders(<ProfileCard />)

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument()
    useAuthStore.getState().clear()
  })

  it('should refetch the profile when the retry button is clicked', async () => {
    useAuthStore.getState().setSession('token', null)
    let callCount = 0
    server.use(
      http.get(`${BASE}/api/auth/me`, () => {
        callCount += 1
        if (callCount === 1) {
          return HttpResponse.json({ message: 'boom' }, { status: 500 })
        }
        return HttpResponse.json({
          id: 'user-1',
          name: 'Lucas Levingston',
          email: 'lucas@email.com',
          createdAt: '2026-01-01T00:00:00.000Z',
        })
      }),
    )
    const { user } = renderWithProviders(<ProfileCard />)

    await user.click(await screen.findByRole('button', { name: 'Tentar novamente' }))

    await waitFor(() => expect(screen.getByText('Lucas Levingston')).toBeInTheDocument())
    expect(callCount).toBe(2)
    useAuthStore.getState().clear()
  })
})
