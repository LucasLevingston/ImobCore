import { describe, expect, it } from 'vitest'
import { makeProperty } from '../../../test-utils/factories/make-property'
import { toPropertyResponse } from './property-response.mapper'

describe('toPropertyResponse', () => {
  it('should serialize createdAt/updatedAt as ISO strings', () => {
    const property = makeProperty()

    const response = toPropertyResponse(property)

    expect(response.createdAt).toBe(property.createdAt.toISOString())
    expect(response.updatedAt).toBe(property.updatedAt.toISOString())
  })

  it('should preserve all other fields unchanged', () => {
    const property = makeProperty({ title: 'Casa de campo' })

    const response = toPropertyResponse(property)

    expect(response.title).toBe('Casa de campo')
    expect(response.id).toBe(property.id)
    expect(response.price).toBe(property.price)
  })
})
