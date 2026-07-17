import { describe, expect, it } from 'vitest'
import { makeProperty } from '../../../test-utils/factories/make-property'
import { InMemoryPropertyRepository } from '../../../test-utils/fakes/in-memory-property-repository'
import { GetDashboardMetricsUseCase } from './get-dashboard-metrics.usecase'

function makeSut() {
  const propertyRepository = new InMemoryPropertyRepository()
  const useCase = new GetDashboardMetricsUseCase(propertyRepository)
  return { useCase, propertyRepository }
}

describe('GetDashboardMetricsUseCase', () => {
  it('should aggregate total, status counts, average price, and grouping by city/district', async () => {
    const { useCase, propertyRepository } = makeSut()
    propertyRepository.properties.push(
      makeProperty({ status: 'Available', price: 200_000, city: 'São Paulo', district: 'Centro' }),
      makeProperty({ status: 'Sold', price: 400_000, city: 'São Paulo', district: 'Centro' }),
      makeProperty({
        status: 'Rented',
        price: 300_000,
        city: 'Rio de Janeiro',
        district: 'Copacabana',
      }),
    )

    const result = await useCase.execute()

    expect(result.total).toBe(3)
    expect(result.byStatus).toMatchObject({
      Available: 1,
      Sold: 1,
      Rented: 1,
      Reserved: 0,
      Inactive: 0,
    })
    expect(result.averagePrice).toBe(300_000)
    expect(result.byCity).toContainEqual({ city: 'São Paulo', count: 2 })
    expect(result.byDistrict).toContainEqual({ district: 'Copacabana', count: 1 })
  })

  it('should return zeroed metrics when there are no properties', async () => {
    const { useCase } = makeSut()

    const result = await useCase.execute()

    expect(result.total).toBe(0)
    expect(result.averagePrice).toBe(0)
    expect(result.byCity).toEqual([])
  })
})
