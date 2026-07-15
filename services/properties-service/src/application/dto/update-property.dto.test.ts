import { describe, expect, it } from 'vitest'
import { updatePropertySchema } from './update-property.dto'

describe('updatePropertySchema', () => {
  it('should accept an empty object (no changes)', () => {
    expect(updatePropertySchema.safeParse({}).success).toBe(true)
  })

  it('should accept a partial payload with a single field', () => {
    const result = updatePropertySchema.safeParse({ price: 400_000 })
    expect(result.success).toBe(true)
  })

  it('should still validate field constraints when present', () => {
    const result = updatePropertySchema.safeParse({ price: -10 })
    expect(result.success).toBe(false)
  })

  it('should reject an invalid property type when present', () => {
    expect(updatePropertySchema.safeParse({ type: 'Castle' }).success).toBe(false)
  })
})
