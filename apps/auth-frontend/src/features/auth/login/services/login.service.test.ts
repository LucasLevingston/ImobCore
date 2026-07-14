import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { env } from '../../../../lib/env'
import { server } from '../../../../mocks/server'
import { loginService } from './login.service'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL

describe('loginService', () => {
  it('should POST to /api/auth/login and return the access token', async () => {
    server.use(
      http.post(`${BASE}/api/auth/login`, () => HttpResponse.json({ accessToken: 'the-token' })),
    )

    const result = await loginService.login({ email: 'lucas@email.com', password: 'x' })

    expect(result).toEqual({ accessToken: 'the-token' })
  })
})
