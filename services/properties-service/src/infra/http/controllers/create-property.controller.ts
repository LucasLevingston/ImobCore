import type { FastifyReply, FastifyRequest } from 'fastify'
import type { CreatePropertyInput } from '../../../application/dto/create-property.dto'
import { UnauthorizedError } from '../../../application/errors/unauthorized-error'
import type { CreatePropertyUseCase } from '../../../application/usecases/create-property/create-property.usecase'
import { toPropertyResponse } from '../mappers/property-response.mapper'

// Body já validado pelo schema Zod registrado na rota (property.routes.ts) —
// Fastify rejeita 400 antes deste handler rodar se o shape não bater.
export function makeCreatePropertyController(useCase: CreatePropertyUseCase) {
  return async function createPropertyController(
    request: FastifyRequest<{ Body: CreatePropertyInput }>,
    reply: FastifyReply,
  ) {
    if (!request.user) {
      throw new UnauthorizedError()
    }
    const property = await useCase.execute({ ...request.body, brokerId: request.user.sub })
    return reply.status(201).send(toPropertyResponse(property))
  }
}
