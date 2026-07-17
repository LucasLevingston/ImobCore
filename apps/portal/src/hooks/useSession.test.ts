import { waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { env } from '../lib/env'
import { MOCK_USER } from '../mocks/handlers/auth'
import { server } from '../mocks/server'
import { renderHookWithProviders } from '../test-utils/renderHookWithProviders'
import { useSession } from './useSession'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL

describe('useSession', () => {
  it('should start loading and then resolve with the current user', async () => {
    const { result } = renderHookWithProviders(() => useSession())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(MOCK_USER)
  })

  it('should surface an error state when GET /api/auth/me fails', async () => {
    server.use(
      http.get(`${BASE}/api/auth/me`, () =>
        HttpResponse.json({ message: 'Não autenticado.' }, { status: 401 }),
      ),
    )

    const { result } = renderHookWithProviders(() => useSession())

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
