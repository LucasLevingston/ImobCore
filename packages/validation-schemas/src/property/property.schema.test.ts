import { describe, expect, it } from 'vitest'
import { PROPERTY_STATUSES, PROPERTY_TYPES } from './property.constants'
import { createPropertySchema, propertyResponseSchema } from './property.schema'

const validInput = {
  title: 'Apartamento reformado',
  description: 'Apartamento amplo com vista pro mar',
  type: 'Apartment' as const,
  status: 'Available' as const,
  price: 350000,
  condominiumFee: 450,
  iptu: 120,
  bedrooms: 2,
  bathrooms: 1,
  garageSpaces: 1,
  area: 65,
  lotArea: null,
  floor: 3,
  furnished: false,
  acceptsFinancing: true,
  acceptsPets: true,
  address: 'Rua das Flores',
  number: '123',
  district: 'Centro',
  city: 'São Paulo',
  state: 'SP',
  zipCode: '01000000',
  latitude: null,
  longitude: null,
}

describe('createPropertySchema', () => {
  it('should accept a fully valid property payload', () => {
    const result = createPropertySchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('should reject a title shorter than 3 characters', () => {
    const result = createPropertySchema.safeParse({ ...validInput, title: 'ab' })
    expect(result.success).toBe(false)
  })

  it('should reject a description shorter than 10 characters', () => {
    const result = createPropertySchema.safeParse({ ...validInput, description: 'curta' })
    expect(result.success).toBe(false)
  })

  it('should reject a non-positive price', () => {
    const result = createPropertySchema.safeParse({ ...validInput, price: 0 })
    expect(result.success).toBe(false)
  })

  it('should reject a state that is not exactly 2 characters', () => {
    const result = createPropertySchema.safeParse({ ...validInput, state: 'São Paulo' })
    expect(result.success).toBe(false)
  })

  it('should reject an unknown property type', () => {
    const result = createPropertySchema.safeParse({ ...validInput, type: 'Castle' })
    expect(result.success).toBe(false)
  })

  it('should default status to Available when omitted', () => {
    const withoutStatus: Partial<typeof validInput> = { ...validInput }
    delete withoutStatus.status
    const result = createPropertySchema.parse(withoutStatus)
    expect(result.status).toBe('Available')
  })

  it('should default nullable numeric fields to null when omitted', () => {
    const withoutFee: Partial<typeof validInput> = { ...validInput }
    delete withoutFee.condominiumFee
    const result = createPropertySchema.parse(withoutFee)
    expect(result.condominiumFee).toBeNull()
  })
})

describe('PROPERTY_TYPES', () => {
  it('should list all 7 property types', () => {
    expect(PROPERTY_TYPES).toEqual([
      'Apartment',
      'House',
      'Land',
      'Commercial',
      'Farm',
      'Studio',
      'Penthouse',
    ])
  })
})

describe('PROPERTY_STATUSES', () => {
  it('should list all 5 property statuses', () => {
    expect(PROPERTY_STATUSES).toEqual(['Available', 'Reserved', 'Sold', 'Rented', 'Inactive'])
  })
})

describe('propertyResponseSchema', () => {
  const validResponse = {
    ...validInput,
    id: 'a3c1f9e0-0000-4000-8000-000000000000',
    brokerId: 'b3c1f9e0-0000-4000-8000-000000000000',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }

  it('should accept a fully valid property response', () => {
    const result = propertyResponseSchema.safeParse(validResponse)
    expect(result.success).toBe(true)
  })

  it('should reject a response missing id', () => {
    const withoutId: Partial<typeof validResponse> = { ...validResponse }
    delete withoutId.id
    const result = propertyResponseSchema.safeParse(withoutId)
    expect(result.success).toBe(false)
  })

  it('should accept a non-UUID id (opaque identifier, no format required)', () => {
    const result = propertyResponseSchema.safeParse({
      ...validResponse,
      id: 'broker-1',
      brokerId: 'broker-1',
    })
    expect(result.success).toBe(true)
  })

  it('should reject a response with a non-ISO createdAt', () => {
    const result = propertyResponseSchema.safeParse({ ...validResponse, createdAt: 'yesterday' })
    expect(result.success).toBe(false)
  })
})
