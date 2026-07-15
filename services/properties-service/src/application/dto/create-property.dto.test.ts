import { describe, expect, it } from 'vitest'
import { makeCreatePropertyInput } from '../../test-utils/factories/make-create-property-input'
import { createPropertySchema } from './create-property.dto'

describe('createPropertySchema', () => {
  it('should accept a valid payload', () => {
    const result = createPropertySchema.safeParse(makeCreatePropertyInput())
    expect(result.success).toBe(true)
  })

  it('should default status to Available when omitted', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { status, ...rest } = makeCreatePropertyInput()
    const result = createPropertySchema.safeParse(rest)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe('Available')
    }
  })

  it('should reject a title shorter than 3 characters', () => {
    const result = createPropertySchema.safeParse(makeCreatePropertyInput({ title: 'ab' }))
    expect(result.success).toBe(false)
  })

  it('should reject an invalid property type', () => {
    const payload = { ...makeCreatePropertyInput(), type: 'Castle' }
    expect(createPropertySchema.safeParse(payload).success).toBe(false)
  })

  it('should reject a non-positive price', () => {
    const result = createPropertySchema.safeParse(makeCreatePropertyInput({ price: 0 }))
    expect(result.success).toBe(false)
  })

  it('should reject a state with more than 2 characters', () => {
    const result = createPropertySchema.safeParse(makeCreatePropertyInput({ state: 'SPX' }))
    expect(result.success).toBe(false)
  })

  it('should reject missing required fields', () => {
    expect(createPropertySchema.safeParse({}).success).toBe(false)
  })

  it('should accept null for optional numeric fields', () => {
    const result = createPropertySchema.safeParse(
      makeCreatePropertyInput({ condominiumFee: null, iptu: null, lotArea: null, floor: null }),
    )
    expect(result.success).toBe(true)
  })
})
