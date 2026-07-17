import { describe, expect, it } from 'vitest'
import { makeProperty } from '../../../test-utils/factories/make-property'
import { InMemoryPropertyRepository } from '../../../test-utils/fakes/in-memory-property-repository'
import { NotFoundError } from '../../errors/not-found-error'
import { UpdatePropertyUseCase } from './update-property.usecase'

function makeSut() {
  const propertyRepository = new InMemoryPropertyRepository()
  const useCase = new UpdatePropertyUseCase(propertyRepository)
  return { useCase, propertyRepository }
}

describe('UpdatePropertyUseCase', () => {
  it('should update and return the property with the given changes', async () => {
    const { useCase, propertyRepository } = makeSut()
    const property = makeProperty({ price: 300_000 })
    propertyRepository.properties.push(property)

    const result = await useCase.execute(property.id, { price: 320_000 })

    expect(result.price).toBe(320_000)
    expect(result.id).toBe(property.id)
  })

  it('should throw NotFoundError when the property does not exist', async () => {
    const { useCase } = makeSut()

    await expect(useCase.execute('non-existent-id', { price: 1 })).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })
})
