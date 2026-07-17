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
      http.get(`${BASE}/api/auth/me`, () => HttpResponse.json({ id: 'user-1', name: 'Lucas' })),
    )

    const result = await apiClient.get<{ id: string; name: string }>('/api/auth/me')

    expect(result).toEqual({ id: 'user-1', name: 'Lucas' })
  })

  it('should perform a POST request sending the body as JSON', async () => {
    server.use(
      http.post(`${BASE}/api/auth/login`, async ({ request }) => {
        const body = await request.json()
        return HttpResponse.json({ received: body })
      }),
    )

    const result = await apiClient.post<{ received: unknown }>('/api/auth/login', {
      email: 'lucas@email.com',
    })

    expect(result.received).toEqual({ email: 'lucas@email.com' })
  })

  it('should attach the Authorization header when an access token is set', async () => {
    useAuthStore.getState().setSession('my-access-token', null)
    let receivedAuth: string | null = null
    server.use(
      http.get(`${BASE}/api/auth/me`, ({ request }) => {
        receivedAuth = request.headers.get('authorization')
        return HttpResponse.json({ ok: true })
      }),
    )

    await apiClient.get('/api/auth/me')

    expect(receivedAuth).toBe('Bearer my-access-token')
  })

  it('should not attach an Authorization header when there is no access token', async () => {
    let receivedAuth: string | null = 'not-checked-yet'
    server.use(
      http.get(`${BASE}/api/auth/me`, ({ request }) => {
        receivedAuth = request.headers.get('authorization')
        return HttpResponse.json({ ok: true })
      }),
    )

    await apiClient.get('/api/auth/me')

    expect(receivedAuth).toBeNull()
  })

  it('should return undefined for a 204 No Content response', async () => {
    server.use(http.post(`${BASE}/api/auth/logout`, () => new HttpResponse(null, { status: 204 })))

    const result = await apiClient.post('/api/auth/logout')

    expect(result).toBeUndefined()
  })

  it('should throw ApiError with the status and message for a non-2xx response', async () => {
    server.use(
      http.post(`${BASE}/api/auth/register`, () =>
        HttpResponse.json({ message: 'E-mail já cadastrado.' }, { status: 409 }),
      ),
    )

    await expect(apiClient.post('/api/auth/register', {})).rejects.toMatchObject({
      status: 409,
      message: 'E-mail já cadastrado.',
    })
  })

  it('should throw an instance of ApiError', async () => {
    server.use(http.post(`${BASE}/api/auth/register`, () => HttpResponse.json({}, { status: 500 })))

    await expect(apiClient.post('/api/auth/register', {})).rejects.toBeInstanceOf(ApiError)
  })

  it('should fall back to a default message when the error response body is not valid JSON', async () => {
    server.use(
      http.post(`${BASE}/api/auth/register`, () => new HttpResponse('not json', { status: 500 })),
    )

    await expect(apiClient.post('/api/auth/register', {})).rejects.toMatchObject({
      status: 500,
      message: 'Erro desconhecido.',
    })
  })

  it('should retry once with a new token after a successful silent refresh on 401', async () => {
    useAuthStore.getState().setSession('expired-token', null)
    let meCallCount = 0
    server.use(
      http.get(`${BASE}/api/auth/me`, ({ request }) => {
        meCallCount += 1
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

    const result = await apiClient.get<{ ok: boolean; auth: string }>('/api/auth/me')

    expect(meCallCount).toBe(2)
    expect(result.auth).toBe('Bearer fresh-token')
    expect(useAuthStore.getState().accessToken).toBe('fresh-token')
  })

  it('should clear the session and throw when refresh also fails after a 401', async () => {
    useAuthStore.getState().setSession('expired-token', null)
    server.use(
      http.get(`${BASE}/api/auth/me`, () =>
        HttpResponse.json({ message: 'Token expirado.' }, { status: 401 }),
      ),
      http.post(`${BASE}/api/auth/refresh`, () =>
        HttpResponse.json({ message: 'Refresh inválido.' }, { status: 401 }),
      ),
    )

    await expect(apiClient.get('/api/auth/me')).rejects.toBeInstanceOf(ApiError)
    expect(useAuthStore.getState().accessToken).toBeNull()
  })

  it('should clear the session when the refresh call itself throws a network error', async () => {
    useAuthStore.getState().setSession('expired-token', null)
    server.use(
      http.get(`${BASE}/api/auth/me`, () =>
        HttpResponse.json({ message: 'Token expirado.' }, { status: 401 }),
      ),
      http.post(`${BASE}/api/auth/refresh`, () => HttpResponse.error()),
    )

    await expect(apiClient.get('/api/auth/me')).rejects.toBeInstanceOf(ApiError)
    expect(useAuthStore.getState().accessToken).toBeNull()
  })

  it('should perform a PUT request sending the body as JSON', async () => {
    server.use(
      http.put(`${BASE}/api/auth/me`, async ({ request }) =>
        HttpResponse.json(await request.json()),
      ),
    )

    const result = await apiClient.put<{ name: string }>('/api/auth/me', { name: 'Novo nome' })

    expect(result).toEqual({ name: 'Novo nome' })
  })

  it('should perform a DELETE request', async () => {
    let called = false
    server.use(
      http.delete(`${BASE}/api/auth/me`, () => {
        called = true
        return new HttpResponse(null, { status: 204 })
      }),
    )

    await apiClient.delete('/api/auth/me')

    expect(called).toBe(true)
  })
})
