import { describe, expect, it } from 'vitest'
import { makeProperty } from '../../../test-utils/factories/make-property'
import { InMemoryPropertyRepository } from '../../../test-utils/fakes/in-memory-property-repository'
import { SearchPropertiesUseCase } from './search-properties.usecase'

function makeSut() {
  const propertyRepository = new InMemoryPropertyRepository()
  const useCase = new SearchPropertiesUseCase(propertyRepository)
  return { useCase, propertyRepository }
}

const defaultPagination = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt' as const,
  sortOrder: 'desc' as const,
}

describe('SearchPropertiesUseCase', () => {
  it('should match properties by title, description, or address', async () => {
    const { useCase, propertyRepository } = makeSut()
    propertyRepository.properties.push(
      makeProperty({ title: 'Cobertura duplex vista mar' }),
      makeProperty({ title: 'Casa no interior' }),
    )

    const result = await useCase.execute('cobertura', {}, defaultPagination)

    expect(result.total).toBe(1)
    expect(result.items[0]?.title).toBe('Cobertura duplex vista mar')
  })

  it('should combine the search term with filters', async () => {
    const { useCase, propertyRepository } = makeSut()
    propertyRepository.properties.push(
      makeProperty({ title: 'Apartamento Centro', city: 'São Paulo' }),
      makeProperty({ title: 'Apartamento Centro', city: 'Rio de Janeiro' }),
    )

    const result = await useCase.execute('apartamento', { city: 'São Paulo' }, defaultPagination)

    expect(result.total).toBe(1)
    expect(result.items[0]?.city).toBe('São Paulo')
  })
})
