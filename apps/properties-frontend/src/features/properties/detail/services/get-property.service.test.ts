import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { env } from '../../../../lib/env'
import { MOCK_PROPERTY } from '../../../../mocks/handlers/properties'
import { server } from '../../../../mocks/server'
import { getProperty } from './get-property.service'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL

describe('getProperty', () => {
  it('should call GET /api/properties/:id and return the property', async () => {
    const result = await getProperty(MOCK_PROPERTY.id)

    expect(result).toEqual(MOCK_PROPERTY)
  })

  it('should propagate a 404 as an ApiError', async () => {
    server.use(
      http.get(`${BASE}/api/properties/ghost`, () =>
        HttpResponse.json({ message: 'Imóvel não encontrado.' }, { status: 404 }),
      ),
    )

    await expect(getProperty('ghost')).rejects.toMatchObject({ status: 404 })
  })
})
