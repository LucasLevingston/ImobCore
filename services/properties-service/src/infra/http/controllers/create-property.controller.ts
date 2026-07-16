import type { FastifyReply, FastifyRequest } from 'fastify'
import { createPropertySchema } from '../../../application/dto/create-property.dto'
import type { CreatePropertyUseCase } from '../../../application/usecases/create-property/create-property.usecase'
import { UnauthorizedError } from '../../../application/errors/unauthorized-error'
import { toPropertyResponse } from '../mappers/property-response.mapper'

export function makeCreatePropertyController(useCase: CreatePropertyUseCase) {
  return async function createPropertyController(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
      throw new UnauthorizedError()
    }
    const input = createPropertySchema.parse(request.body)
    const property = await useCase.execute({ ...input, brokerId: request.user.sub })
    return reply.status(201).send(toPropertyResponse(property))
  }
}
