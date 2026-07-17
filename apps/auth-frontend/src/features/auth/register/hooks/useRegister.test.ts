import { waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { env } from '../../../../lib/env'
import { server } from '../../../../mocks/server'
import { renderHookWithProviders } from '../../../../test-utils/renderHookWithProviders'
import { useRegister } from './useRegister'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL

describe('useRegister', () => {
  it('should start idle', () => {
    const { result } = renderHookWithProviders(() => useRegister())
    expect(result.current.isIdle).toBe(true)
  })

  it('should succeed and expose the created user data', async () => {
    const { result } = renderHookWithProviders(() => useRegister())

    result.current.mutate({ name: 'Lucas', email: 'lucas@email.com', password: 'super-secret-1' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.email).toBe('lucas@email.com')
  })

  it('should expose an error when the email is already registered', async () => {
    server.use(
      http.post(`${BASE}/api/auth/register`, () =>
        HttpResponse.json({ message: 'E-mail já cadastrado.' }, { status: 409 }),
      ),
    )
    const { result } = renderHookWithProviders(() => useRegister())

    result.current.mutate({ name: 'Lucas', email: 'lucas@email.com', password: 'super-secret-1' })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe('E-mail já cadastrado.')
  })
})
