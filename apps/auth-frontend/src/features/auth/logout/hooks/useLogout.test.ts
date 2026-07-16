import { waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it } from 'vitest'
import { env } from '../../../../lib/env'
import { server } from '../../../../mocks/server'
import { useAuthStore } from '../../../../stores/auth-store'
import { renderHookWithProviders } from '../../../../test-utils/renderHookWithProviders'
import { useLogout } from './useLogout'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL
const user = {
  id: 'user-1',
  name: 'Lucas',
  email: 'lucas@email.com',
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('useLogout', () => {
  afterEach(() => {
    useAuthStore.getState().clear()
  })

  it('should clear the auth store after a successful logout', async () => {
    useAuthStore.getState().setSession('some-token', user)
    const { result } = renderHookWithProviders(() => useLogout())

    result.current.mutate()

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(useAuthStore.getState().accessToken).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('should also clear the auth store even if the logout request fails', async () => {
    server.use(
      http.post(`${BASE}/api/auth/logout`, () =>
        HttpResponse.json({ message: 'boom' }, { status: 500 }),
      ),
    )
    useAuthStore.getState().setSession('some-token', user)
    const { result } = renderHookWithProviders(() => useLogout())

    result.current.mutate()

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(useAuthStore.getState().accessToken).toBeNull()
  })
})
