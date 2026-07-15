import { describe, expect, it } from 'vitest'
import { listPropertiesQuerySchema } from './list-properties-query.dto'

describe('listPropertiesQuerySchema', () => {
  it('should apply default pagination and sorting when nothing is given', () => {
    const result = listPropertiesQuerySchema.parse({})
    expect(result).toMatchObject({ page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' })
  })

  it('should coerce numeric query strings', () => {
    const result = listPropertiesQuerySchema.parse({
      minPrice: '100000',
      maxPrice: '500000',
      bedrooms: '2',
      page: '3',
      limit: '10',
    })
    expect(result).toMatchObject({
      minPrice: 100_000,
      maxPrice: 500_000,
      bedrooms: 2,
      page: 3,
      limit: 10,
    })
  })

  it('should correctly coerce the string "false" to boolean false', () => {
    const result = listPropertiesQuerySchema.parse({ acceptsPets: 'false' })
    expect(result.acceptsPets).toBe(false)
  })

  it('should correctly coerce the string "true" to boolean true', () => {
    const result = listPropertiesQuerySchema.parse({ acceptsFinancing: 'true' })
    expect(result.acceptsFinancing).toBe(true)
  })

  it('should accept a native boolean value unchanged', () => {
    const result = listPropertiesQuerySchema.parse({ acceptsFinancing: true, acceptsPets: false })
    expect(result.acceptsFinancing).toBe(true)
    expect(result.acceptsPets).toBe(false)
  })

  it('should reject a limit above 100', () => {
    expect(listPropertiesQuerySchema.safeParse({ limit: '101' }).success).toBe(false)
  })

  it('should reject an invalid sortBy value', () => {
    expect(listPropertiesQuerySchema.safeParse({ sortBy: 'unknown' }).success).toBe(false)
  })

  it('should reject an invalid property type filter', () => {
    expect(listPropertiesQuerySchema.safeParse({ type: 'Castle' }).success).toBe(false)
  })
})
