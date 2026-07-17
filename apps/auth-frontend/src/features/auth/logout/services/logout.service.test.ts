import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { env } from '../../../../lib/env'
import { server } from '../../../../mocks/server'
import { logoutService } from './logout.service'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL

describe('logoutService', () => {
  it('should POST to /api/auth/logout', async () => {
    let called = false
    server.use(
      http.post(`${BASE}/api/auth/logout`, () => {
        called = true
        return new HttpResponse(null, { status: 204 })
      }),
    )

    await logoutService.logout()

    expect(called).toBe(true)
  })
})
