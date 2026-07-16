import { http, HttpResponse } from 'msw'

const BASE = process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? 'http://localhost:3004'

export const MOCK_USER = {
  id: 'user-1',
  name: 'Lucas Levingston',
  email: 'lucas@email.com',
  createdAt: '2026-01-01T00:00:00.000Z',
}

export const authHandlers = [
  http.get(`${BASE}/api/auth/me`, () => {
    return HttpResponse.json(MOCK_USER, { status: 200 })
  }),

  http.post(`${BASE}/api/auth/refresh`, () => {
    return HttpResponse.json({ accessToken: 'new.mock.access.token' }, { status: 200 })
  }),

  http.post(`${BASE}/api/auth/logout`, () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
