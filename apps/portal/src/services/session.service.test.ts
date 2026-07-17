import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { env } from '../lib/env'
import { server } from '../mocks/server'
import { sessionService } from './session.service'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL

describe('sessionService', () => {
  it('should fetch the current user via GET /api/auth/me', async () => {
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

    const result = await sessionService.getMe()

    expect(result).toEqual({
      id: 'user-1',
      name: 'Lucas',
      email: 'lucas@email.com',
      createdAt: '2026-01-01T00:00:00.000Z',
    })
  })
})
