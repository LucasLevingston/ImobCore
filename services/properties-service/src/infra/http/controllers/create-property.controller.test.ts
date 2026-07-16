import { describe, expect, it, vi } from 'vitest'
import { CreatePropertyUseCase } from '../../../application/usecases/create-property/create-property.usecase'
import { UnauthorizedError } from '../../../application/errors/unauthorized-error'
import { InMemoryPropertyRepository } from '../../../test-utils/fakes/in-memory-property-repository'
import { makeCreatePropertyInput } from '../../../test-utils/factories/make-create-property-input'
import { makeCreatePropertyController } from './create-property.controller'

function makeReply() {
  return { status: vi.fn().mockReturnThis(), send: vi.fn().mockReturnThis() }
}

describe('createPropertyController', () => {
  it('should throw UnauthorizedError when request.user is not set', async () => {
    const useCase = new CreatePropertyUseCase(new InMemoryPropertyRepository())
    const controller = makeCreatePropertyController(useCase)
    const request = { user: undefined, body: makeCreatePropertyInput() } as never

    await expect(controller(request, makeReply() as never)).rejects.toBeInstanceOf(
      UnauthorizedError,
    )
  })
})
