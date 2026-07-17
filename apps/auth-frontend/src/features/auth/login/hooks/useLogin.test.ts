import { waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { afterEach, describe, expect, it } from 'vitest'
import { env } from '../../../../lib/env'
import { server } from '../../../../mocks/server'
import { useAuthStore } from '../../../../stores/auth-store'
import { renderHookWithProviders } from '../../../../test-utils/renderHookWithProviders'
import { useLogin } from './useLogin'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL

describe('useLogin', () => {
  afterEach(() => {
    useAuthStore.getState().clear()
  })

  it('should store the access token in the auth store on success', async () => {
    server.use(
      http.post(`${BASE}/api/auth/login`, () => HttpResponse.json({ accessToken: 'the-token' })),
    )
    const { result } = renderHookWithProviders(() => useLogin())

    result.current.mutate({ email: 'lucas@email.com', password: 'super-secret-1' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(useAuthStore.getState().accessToken).toBe('the-token')
  })

  it('should not touch the auth store when login fails', async () => {
    server.use(
      http.post(`${BASE}/api/auth/login`, () =>
        HttpResponse.json({ message: 'E-mail ou senha inválidos.' }, { status: 401 }),
      ),
    )
    const { result } = renderHookWithProviders(() => useLogin())

    result.current.mutate({ email: 'lucas@email.com', password: 'wrong' })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(useAuthStore.getState().accessToken).toBeNull()
  })
})
