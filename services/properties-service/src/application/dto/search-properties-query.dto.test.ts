import { describe, expect, it } from 'vitest'
import { searchPropertiesQuerySchema } from './search-properties-query.dto'

describe('searchPropertiesQuerySchema', () => {
  it('should accept a query with a search term', () => {
    const result = searchPropertiesQuerySchema.safeParse({ q: 'apartamento' })
    expect(result.success).toBe(true)
  })

  it('should reject an empty search term', () => {
    expect(searchPropertiesQuerySchema.safeParse({ q: '' }).success).toBe(false)
  })

  it('should reject a missing search term', () => {
    expect(searchPropertiesQuerySchema.safeParse({}).success).toBe(false)
  })

  it('should still apply list filters together with the search term', () => {
    const result = searchPropertiesQuerySchema.parse({ q: 'centro', city: 'São Paulo', page: '2' })
    expect(result).toMatchObject({ q: 'centro', city: 'São Paulo', page: 2 })
  })
})
