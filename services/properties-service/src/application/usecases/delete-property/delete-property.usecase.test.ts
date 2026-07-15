import { describe, expect, it } from 'vitest'
import { InMemoryPropertyRepository } from '../../../test-utils/fakes/in-memory-property-repository'
import { makeProperty } from '../../../test-utils/factories/make-property'
import { NotFoundError } from '../../errors/not-found-error'
import { DeletePropertyUseCase } from './delete-property.usecase'

function makeSut() {
  const propertyRepository = new InMemoryPropertyRepository()
  const useCase = new DeletePropertyUseCase(propertyRepository)
  return { useCase, propertyRepository }
}

describe('DeletePropertyUseCase', () => {
  it('should remove the property from the repository', async () => {
    const { useCase, propertyRepository } = makeSut()
    const property = makeProperty()
    propertyRepository.properties.push(property)

    await useCase.execute(property.id)

    expect(propertyRepository.properties).toHaveLength(0)
  })

  it('should throw NotFoundError when the property does not exist', async () => {
    const { useCase } = makeSut()

    await expect(useCase.execute('non-existent-id')).rejects.toBeInstanceOf(NotFoundError)
  })
})
