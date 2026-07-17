import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { env } from '../../../../lib/env'
import { server } from '../../../../mocks/server'
import { deleteProperty } from './delete-property.service'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL

describe('deleteProperty', () => {
  it('should DELETE /api/properties/:id', async () => {
    let called = false
    server.use(
      http.delete(`${BASE}/api/properties/property-1`, () => {
        called = true
        return new HttpResponse(null, { status: 204 })
      }),
    )

    await deleteProperty('property-1')

    expect(called).toBe(true)
  })
})
