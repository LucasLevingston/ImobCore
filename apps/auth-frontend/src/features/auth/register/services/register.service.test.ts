import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { env } from '../../../../lib/env'
import { server } from '../../../../mocks/server'
import { registerService } from './register.service'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL

describe('registerService', () => {
  it('should POST to /api/auth/register with the given data and return the created user', async () => {
    server.use(
      http.post(`${BASE}/api/auth/register`, async ({ request }) => {
        const body = await request.json()
        return HttpResponse.json(
          { id: 'user-1', ...(body as object), createdAt: '2026-01-01T00:00:00.000Z' },
          { status: 201 },
        )
      }),
    )

    const result = await registerService.register({
      name: 'Lucas',
      email: 'lucas@email.com',
      password: 'super-secret-1',
    })

    expect(result).toEqual({
      id: 'user-1',
      name: 'Lucas',
      email: 'lucas@email.com',
      password: 'super-secret-1',
      createdAt: '2026-01-01T00:00:00.000Z',
    })
  })
})
