import { describe, expect, it } from 'vitest'
import { buildFilterValues } from './PropertyFilters.utils'

const EMPTY_RAW = { q: '', city: '', type: '', status: '', minPrice: '', maxPrice: '' } as const

describe('buildFilterValues', () => {
  it('should return an empty object when nothing is filled in', () => {
    expect(buildFilterValues(EMPTY_RAW)).toEqual({})
  })

  it('should include only the filled-in text fields', () => {
    expect(buildFilterValues({ ...EMPTY_RAW, q: 'cobertura', city: 'São Paulo' })).toEqual({
      q: 'cobertura',
      city: 'São Paulo',
    })
  })

  it('should include type and status when selected', () => {
    expect(buildFilterValues({ ...EMPTY_RAW, type: 'House', status: 'Available' })).toEqual({
      type: 'House',
      status: 'Available',
    })
  })

  it('should convert price fields to numbers', () => {
    expect(buildFilterValues({ ...EMPTY_RAW, minPrice: '100000', maxPrice: '500000' })).toEqual({
      minPrice: 100_000,
      maxPrice: 500_000,
    })
  })
})
