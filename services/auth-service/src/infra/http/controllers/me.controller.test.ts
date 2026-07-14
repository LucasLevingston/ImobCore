import { describe, expect, it, vi } from 'vitest'
import { UnauthorizedError } from '../../../application/errors/unauthorized-error'
import { InMemoryUserRepository } from '../../../test-utils/fakes/in-memory-user-repository'
import { makeUser } from '../../../test-utils/factories/make-user'
import { GetProfileUseCase } from '../../../application/usecases/get-profile/get-profile.usecase'
import { makeMeController } from './me.controller'

function makeReply() {
  return { status: vi.fn().mockReturnThis(), send: vi.fn().mockReturnThis() }
}

describe('meController', () => {
  it('should throw UnauthorizedError when request.user is not set', async () => {
    const useCase = new GetProfileUseCase(new InMemoryUserRepository())
    const controller = makeMeController(useCase)
    const request = { user: undefined } as never

    await expect(controller(request, makeReply() as never)).rejects.toBeInstanceOf(
      UnauthorizedError,
    )
  })

  it('should respond with the profile when request.user is set', async () => {
    const userRepository = new InMemoryUserRepository()
    const user = makeUser()
    userRepository.users.push(user)
    const useCase = new GetProfileUseCase(userRepository)
    const controller = makeMeController(useCase)
    const request = { user: { sub: user.id, email: user.email } } as never
    const reply = makeReply()

    await controller(request, reply as never)

    expect(reply.status).toHaveBeenCalledWith(200)
  })
})
