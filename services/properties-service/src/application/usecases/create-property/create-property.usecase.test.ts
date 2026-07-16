import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { InMemoryPropertyRepository } from '../../../test-utils/fakes/in-memory-property-repository'
import { makeCreatePropertyInput } from '../../../test-utils/factories/make-create-property-input'
import { CreatePropertyUseCase } from './create-property.usecase'

function makeSut() {
  const propertyRepository = new InMemoryPropertyRepository()
  const useCase = new CreatePropertyUseCase(propertyRepository)
  return { useCase, propertyRepository }
}

describe('CreatePropertyUseCase', () => {
  it('should create and return a property with a generated id', async () => {
    const { useCase } = makeSut()
    const brokerId = randomUUID()

    const result = await useCase.execute({ ...makeCreatePropertyInput(), brokerId })

    expect(result.id).toBeDefined()
    expect(result.title).toBe('Apartamento 2 quartos no Centro')
    expect(result.brokerId).toBe(brokerId)
  })

  it('should persist the property in the repository', async () => {
    const { useCase, propertyRepository } = makeSut()

    await useCase.execute({ ...makeCreatePropertyInput(), brokerId: randomUUID() })

    expect(propertyRepository.properties).toHaveLength(1)
  })
})
