import type { FastifyReply, FastifyRequest } from 'fastify'
import type { GetPropertyUseCase } from '../../../application/usecases/get-property/get-property.usecase'
import { toPropertyResponse } from '../mappers/property-response.mapper'
import type { PropertyIdParams } from '../schemas/property-params.schema'

// Params já validados pelo schema Zod registrado na rota (property.routes.ts)
export function makeGetPropertyController(useCase: GetPropertyUseCase) {
  return async function getPropertyController(
    request: FastifyRequest<{ Params: PropertyIdParams }>,
    reply: FastifyReply,
  ) {
    const property = await useCase.execute(request.params.id)
    return reply.status(200).send(toPropertyResponse(property))
  }
}
