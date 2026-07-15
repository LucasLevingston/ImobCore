import { describe, expect, it } from 'vitest'
import { propertyFormSchema } from './property-form.schema'

function makeValidPayload() {
  return {
    title: 'Apartamento 2 quartos no Centro',
    description: 'Apartamento reformado, próximo ao metrô.',
    type: 'Apartment',
    status: 'Available',
    price: '350000',
    bedrooms: '2',
    bathrooms: '1',
    garageSpaces: '1',
    area: '65',
    furnished: false,
    acceptsFinancing: true,
    acceptsPets: true,
    address: 'Rua das Flores',
    number: '123',
    district: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01000-000',
  }
}

describe('propertyFormSchema', () => {
  it('should accept a valid payload and coerce numeric strings', () => {
    const result = propertyFormSchema.safeParse(makeValidPayload())

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.price).toBe(350_000)
      expect(result.data.bedrooms).toBe(2)
    }
  })

  it('should default nullable optional fields to null when omitted', () => {
    const result = propertyFormSchema.safeParse(makeValidPayload())

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.condominiumFee).toBeNull()
      expect(result.data.lotArea).toBeNull()
    }
  })

  it('should reject a title shorter than 3 characters', () => {
    const result = propertyFormSchema.safeParse({ ...makeValidPayload(), title: 'ab' })
    expect(result.success).toBe(false)
  })

  it('should reject a non-positive price', () => {
    const result = propertyFormSchema.safeParse({ ...makeValidPayload(), price: '0' })
    expect(result.success).toBe(false)
  })

  it('should reject a state with more than 2 characters', () => {
    const result = propertyFormSchema.safeParse({ ...makeValidPayload(), state: 'SPX' })
    expect(result.success).toBe(false)
  })

  it('should reject an invalid property type', () => {
    const result = propertyFormSchema.safeParse({ ...makeValidPayload(), type: 'Castle' })
    expect(result.success).toBe(false)
  })

  it('should treat an empty string as null for optional numeric fields (not coerce to 0)', () => {
    const result = propertyFormSchema.safeParse({
      ...makeValidPayload(),
      condominiumFee: '',
      floor: '',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.condominiumFee).toBeNull()
      expect(result.data.floor).toBeNull()
    }
  })
})
