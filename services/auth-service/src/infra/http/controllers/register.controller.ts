import type { FastifyReply, FastifyRequest } from 'fastify'
import { registerUserSchema } from '../../../application/dto/register-user.dto'
import type { RegisterUserUseCase } from '../../../application/usecases/register-user/register-user.usecase'
import { toUserResponse } from '../mappers/user-response.mapper'

export function makeRegisterController(useCase: RegisterUserUseCase) {
  return async function registerController(request: FastifyRequest, reply: FastifyReply) {
    const input = registerUserSchema.parse(request.body)
    const user = await useCase.execute(input)
    return reply.status(201).send(toUserResponse(user))
  }
}
