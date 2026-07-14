import { waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it } from 'vitest'
import { env } from '../../../../lib/env'
import { server } from '../../../../mocks/server'
import { useAuthStore } from '../../../../stores/auth-store'
import { renderHookWithProviders } from '../../../../test-utils/renderHookWithProviders'
import { useProfile } from './useProfile'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL

describe('useProfile', () => {
  afterEach(() => {
    useAuthStore.getState().clear()
  })

  it('should not fetch when there is no access token', () => {
    const { result } = renderHookWithProviders(() => useProfile())
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('should fetch the profile when an access token is present', async () => {
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

    const { result } = renderHookWithProviders(() => useProfile())

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.name).toBe('Lucas')
  })

  it('should sync the fetched profile into the auth store', async () => {
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

    renderHookWithProviders(() => useProfile())

    await waitFor(() => expect(useAuthStore.getState().user?.name).toBe('Lucas'))
  })
})
