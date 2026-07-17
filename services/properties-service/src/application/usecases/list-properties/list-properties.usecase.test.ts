import { describe, expect, it } from 'vitest'
import { makeProperty } from '../../../test-utils/factories/make-property'
import { InMemoryPropertyRepository } from '../../../test-utils/fakes/in-memory-property-repository'
import { ListPropertiesUseCase } from './list-properties.usecase'

function makeSut() {
  const propertyRepository = new InMemoryPropertyRepository()
  const useCase = new ListPropertiesUseCase(propertyRepository)
  return { useCase, propertyRepository }
}

const defaultPagination = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt' as const,
  sortOrder: 'desc' as const,
}

describe('ListPropertiesUseCase', () => {
  it('should list all properties when no filters are given', async () => {
    const { useCase, propertyRepository } = makeSut()
    propertyRepository.properties.push(makeProperty(), makeProperty())

    const result = await useCase.execute({}, defaultPagination)

    expect(result.total).toBe(2)
    expect(result.items).toHaveLength(2)
  })

  it('should apply filters when given', async () => {
    const { useCase, propertyRepository } = makeSut()
    propertyRepository.properties.push(
      makeProperty({ city: 'São Paulo' }),
      makeProperty({ city: 'Rio de Janeiro' }),
    )

    const result = await useCase.execute({ city: 'São Paulo' }, defaultPagination)

    expect(result.total).toBe(1)
    expect(result.items[0]?.city).toBe('São Paulo')
  })
})
