import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { env } from '../../../../lib/env'
import { server } from '../../../../mocks/server'
import { listProperties } from './list-properties.service'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL

describe('listProperties', () => {
  it('should call GET /api/properties when there is no search term', async () => {
    let calledPath = ''
    server.use(
      http.get(`${BASE}/api/properties`, ({ request }) => {
        calledPath = new URL(request.url).pathname
        return HttpResponse.json({ items: [], total: 0, page: 1, limit: 20, totalPages: 0 })
      }),
    )

    await listProperties({ city: 'São Paulo', page: 1 })

    expect(calledPath).toBe('/api/properties')
  })

  it('should call GET /api/properties/search when a search term is given', async () => {
    let calledPath = ''
    server.use(
      http.get(`${BASE}/api/properties/search`, ({ request }) => {
        calledPath = new URL(request.url).pathname
        return HttpResponse.json({ items: [], total: 0, page: 1, limit: 20, totalPages: 0 })
      }),
    )

    await listProperties({ q: 'cobertura' })

    expect(calledPath).toBe('/api/properties/search')
  })

  it('should send only defined filters as query params', async () => {
    let calledSearch = ''
    server.use(
      http.get(`${BASE}/api/properties`, ({ request }) => {
        calledSearch = new URL(request.url).search
        return HttpResponse.json({ items: [], total: 0, page: 1, limit: 20, totalPages: 0 })
      }),
    )

    await listProperties({ city: 'São Paulo', minPrice: undefined, page: 2 })

    const params = new URLSearchParams(calledSearch)
    expect(params.get('city')).toBe('São Paulo')
    expect(params.has('minPrice')).toBe(false)
    expect(params.get('page')).toBe('2')
  })

  it('should return the paginated result', async () => {
    server.use(
      http.get(`${BASE}/api/properties`, () =>
        HttpResponse.json({ items: [], total: 5, page: 1, limit: 20, totalPages: 1 }),
      ),
    )

    const result = await listProperties({})

    expect(result.total).toBe(5)
  })
})
