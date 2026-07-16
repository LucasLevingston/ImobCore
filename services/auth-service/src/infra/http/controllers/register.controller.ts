import type { FastifyReply, FastifyRequest } from 'fastify'
import type { RegisterUserInput } from '../../../application/dto/register-user.dto'
import type { RegisterUserUseCase } from '../../../application/usecases/register-user/register-user.usecase'
import { toUserResponse } from '../mappers/user-response.mapper'

// Body já validado pelo schema Zod registrado na rota (auth.routes.ts)
export function makeRegisterController(useCase: RegisterUserUseCase) {
  return async function registerController(
    request: FastifyRequest<{ Body: RegisterUserInput }>,
    reply: FastifyReply,
  ) {
    const user = await useCase.execute(request.body)
    return reply.status(201).send(toUserResponse(user))
  }
}
