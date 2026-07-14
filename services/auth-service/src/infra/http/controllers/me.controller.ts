import type { FastifyReply, FastifyRequest } from 'fastify'
import { UnauthorizedError } from '../../../application/errors/unauthorized-error'
import type { GetProfileUseCase } from '../../../application/usecases/get-profile/get-profile.usecase'
import { toUserResponse } from '../mappers/user-response.mapper'

export function makeMeController(useCase: GetProfileUseCase) {
  return async function meController(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
      throw new UnauthorizedError()
    }
    const user = await useCase.execute(request.user.sub)
    return reply.status(200).send(toUserResponse(user))
  }
}
