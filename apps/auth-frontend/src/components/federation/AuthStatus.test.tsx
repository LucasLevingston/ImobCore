import { screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { afterEach, describe, expect, it } from 'vitest'
import { env } from '../../lib/env'
import { server } from '../../mocks/server'
import { useAuthStore } from '../../stores/auth-store'
import { renderWithProviders } from '../../test-utils/renderWithProviders'
import { AuthStatus } from './AuthStatus'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL

describe('AuthStatus', () => {
  afterEach(() => {
    useAuthStore.getState().clear()
  })

  it('should render nothing when there is no access token', () => {
    const { container } = renderWithProviders(<AuthStatus />)
    expect(container).toBeEmptyDOMElement()
  })

  it("should render the user's name once authenticated", async () => {
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

    renderWithProviders(<AuthStatus />)

    expect(await screen.findByText('Lucas Levingston')).toBeInTheDocument()
  })
})
