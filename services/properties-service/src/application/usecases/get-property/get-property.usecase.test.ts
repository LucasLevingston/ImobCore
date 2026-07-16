import { describe, expect, it } from 'vitest'
import { InMemoryPropertyRepository } from '../../../test-utils/fakes/in-memory-property-repository'
import { makeProperty } from '../../../test-utils/factories/make-property'
import { NotFoundError } from '../../errors/not-found-error'
import { GetPropertyUseCase } from './get-property.usecase'

function makeSut() {
  const propertyRepository = new InMemoryPropertyRepository()
  const useCase = new GetPropertyUseCase(propertyRepository)
  return { useCase, propertyRepository }
}

describe('GetPropertyUseCase', () => {
  it('should return the property matching the given id', async () => {
    const { useCase, propertyRepository } = makeSut()
    const property = makeProperty()
    propertyRepository.properties.push(property)

    const result = await useCase.execute(property.id)

    expect(result).toEqual(property)
  })

  it('should throw NotFoundError when the property does not exist', async () => {
    const { useCase } = makeSut()

    await expect(useCase.execute('non-existent-id')).rejects.toBeInstanceOf(NotFoundError)
  })
})
