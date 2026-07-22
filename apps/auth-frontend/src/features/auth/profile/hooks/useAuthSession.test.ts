import { waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { afterEach, describe, expect, it } from 'vitest'
import { env } from '../../../../lib/env'
import { server } from '../../../../mocks/server'
import { useAuthStore } from '../../../../stores/auth-store'
import { renderHookWithProviders } from '../../../../test-utils/renderHookWithProviders'
import { useAuthSession } from './useAuthSession'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL

describe('useAuthSession', () => {
  afterEach(() => {
    useAuthStore.getState().clear()
  })

  it('should report not authenticated when there is no access token', () => {
    const { result } = renderHookWithProviders(() => useAuthSession())

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeUndefined()
  })

  it('should report not authenticated while the profile has not loaded yet', () => {
    useAuthStore.getState().setSession('token', null)
    const { result } = renderHookWithProviders(() => useAuthSession())

    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should report authenticated once a token and profile are both present', async () => {
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

    const { result } = renderHookWithProviders(() => useAuthSession())

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true))
    expect(result.current.user?.name).toBe('Lucas')
  })
})
