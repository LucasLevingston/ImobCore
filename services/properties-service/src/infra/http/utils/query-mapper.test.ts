import { describe, expect, it } from 'vitest'
import { listPropertiesQuerySchema } from '../../../application/dto/list-properties-query.dto'
import { toFiltersAndPagination } from './query-mapper'

describe('toFiltersAndPagination', () => {
  it('should split pagination fields from filter fields', () => {
    const query = listPropertiesQuerySchema.parse({ city: 'São Paulo', page: '2', limit: '10' })

    const { filters, pagination } = toFiltersAndPagination(query)

    expect(filters).toEqual({ city: 'São Paulo' })
    expect(pagination).toEqual({ page: 2, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' })
  })

  it('should produce empty filters when none are given', () => {
    const query = listPropertiesQuerySchema.parse({})

    const { filters } = toFiltersAndPagination(query)

    expect(filters).toEqual({})
  })
})
