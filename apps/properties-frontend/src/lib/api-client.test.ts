import { HttpResponse, http } from 'msw'
import { afterEach, describe, expect, it } from 'vitest'
import { server } from '../mocks/server'
import { useAuthStore } from '../stores/auth-store'
import { ApiError, apiClient } from './api-client'
import { env } from './env'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL

describe('apiClient', () => {
  afterEach(() => {
    useAuthStore.getState().clear()
  })

  it('should perform a GET request and return parsed JSON', async () => {
    server.use(
      http.get(`${BASE}/api/properties/x`, () => HttpResponse.json({ id: 'x', title: 'Casa' })),
    )

    const result = await apiClient.get<{ id: string; title: string }>('/api/properties/x')

    expect(result).toEqual({ id: 'x', title: 'Casa' })
  })

  it('should perform a POST request sending the body as JSON', async () => {
    server.use(
      http.post(`${BASE}/api/properties`, async ({ request }) => {
        const body = await request.json()
        return HttpResponse.json({ received: body })
      }),
    )

    const result = await apiClient.post<{ received: unknown }>('/api/properties', {
      title: 'Casa',
    })

    expect(result.received).toEqual({ title: 'Casa' })
  })

  it('should attach the Authorization header when an access token is set', async () => {
    useAuthStore.getState().setSession('my-access-token', null)
    let receivedAuth: string | null = null
    server.use(
      http.get(`${BASE}/api/properties/x`, ({ request }) => {
        receivedAuth = request.headers.get('authorization')
        return HttpResponse.json({ ok: true })
      }),
    )

    await apiClient.get('/api/properties/x')

    expect(receivedAuth).toBe('Bearer my-access-token')
  })

  it('should not attach an Authorization header when there is no access token', async () => {
    let receivedAuth: string | null = 'not-checked-yet'
    server.use(
      http.get(`${BASE}/api/properties/x`, ({ request }) => {
        receivedAuth = request.headers.get('authorization')
        return HttpResponse.json({ ok: true })
      }),
    )

    await apiClient.get('/api/properties/x')

    expect(receivedAuth).toBeNull()
  })

  it('should return undefined for a 204 No Content response', async () => {
    server.use(
      http.delete(`${BASE}/api/properties/x`, () => new HttpResponse(null, { status: 204 })),
    )

    const result = await apiClient.delete('/api/properties/x')

    expect(result).toBeUndefined()
  })

  it('should throw ApiError with the status and message for a non-2xx response', async () => {
    server.use(
      http.post(`${BASE}/api/properties`, () =>
        HttpResponse.json({ message: 'Dado inválido.' }, { status: 400 }),
      ),
    )

    await expect(apiClient.post('/api/properties', {})).rejects.toMatchObject({
      status: 400,
      message: 'Dado inválido.',
    })
  })

  it('should throw an instance of ApiError', async () => {
    server.use(http.post(`${BASE}/api/properties`, () => HttpResponse.json({}, { status: 500 })))

    await expect(apiClient.post('/api/properties', {})).rejects.toBeInstanceOf(ApiError)
  })

  it('should fall back to a default message when the error response body is not valid JSON', async () => {
    server.use(
      http.post(`${BASE}/api/properties`, () => new HttpResponse('not json', { status: 500 })),
    )

    await expect(apiClient.post('/api/properties', {})).rejects.toMatchObject({
      status: 500,
      message: 'Erro desconhecido.',
    })
  })

  it('should retry once with a new token after a successful silent refresh on 401', async () => {
    useAuthStore.getState().setSession('expired-token', null)
    let callCount = 0
    server.use(
      http.get(`${BASE}/api/properties/x`, ({ request }) => {
        callCount += 1
        const auth = request.headers.get('authorization')
        if (auth === 'Bearer expired-token') {
          return HttpResponse.json({ message: 'Token expirado.' }, { status: 401 })
        }
        return HttpResponse.json({ ok: true, auth })
      }),
      http.post(`${BASE}/api/auth/refresh`, () =>
        HttpResponse.json({ accessToken: 'fresh-token' }),
      ),
    )

    const result = await apiClient.get<{ ok: boolean; auth: string }>('/api/properties/x')

    expect(callCount).toBe(2)
    expect(result.auth).toBe('Bearer fresh-token')
    expect(useAuthStore.getState().accessToken).toBe('fresh-token')
  })

  it('should clear the session and throw when refresh also fails after a 401', async () => {
    useAuthStore.getState().setSession('expired-token', null)
    server.use(
      http.get(`${BASE}/api/properties/x`, () =>
        HttpResponse.json({ message: 'Token expirado.' }, { status: 401 }),
      ),
      http.post(`${BASE}/api/auth/refresh`, () =>
        HttpResponse.json({ message: 'Refresh inválido.' }, { status: 401 }),
      ),
    )

    await expect(apiClient.get('/api/properties/x')).rejects.toBeInstanceOf(ApiError)
    expect(useAuthStore.getState().accessToken).toBeNull()
  })

  it('should clear the session when the refresh call itself throws a network error', async () => {
    useAuthStore.getState().setSession('expired-token', null)
    server.use(
      http.get(`${BASE}/api/properties/x`, () =>
        HttpResponse.json({ message: 'Token expirado.' }, { status: 401 }),
      ),
      http.post(`${BASE}/api/auth/refresh`, () => HttpResponse.error()),
    )

    await expect(apiClient.get('/api/properties/x')).rejects.toBeInstanceOf(ApiError)
    expect(useAuthStore.getState().accessToken).toBeNull()
  })

  it('should perform a PUT request sending the body as JSON', async () => {
    server.use(
      http.put(`${BASE}/api/properties/x`, async ({ request }) =>
        HttpResponse.json(await request.json()),
      ),
    )

    const result = await apiClient.put<{ title: string }>('/api/properties/x', { title: 'Novo' })

    expect(result).toEqual({ title: 'Novo' })
  })

  it('should perform a DELETE request', async () => {
    let called = false
    server.use(
      http.delete(`${BASE}/api/properties/x`, () => {
        called = true
        return new HttpResponse(null, { status: 204 })
      }),
    )

    await apiClient.delete('/api/properties/x')

    expect(called).toBe(true)
  })
})
