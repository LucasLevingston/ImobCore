import type { FastifyReply, FastifyRequest } from 'fastify'
import type { UpdatePropertyInput } from '../../../application/dto/update-property.dto'
import type { UpdatePropertyUseCase } from '../../../application/usecases/update-property/update-property.usecase'
import { toPropertyResponse } from '../mappers/property-response.mapper'
import type { PropertyIdParams } from '../schemas/property-params.schema'

// Params e body já validados pelo schema Zod registrado na rota (property.routes.ts)
export function makeUpdatePropertyController(useCase: UpdatePropertyUseCase) {
  return async function updatePropertyController(
    request: FastifyRequest<{ Params: PropertyIdParams; Body: UpdatePropertyInput }>,
    reply: FastifyReply,
  ) {
    const property = await useCase.execute(request.params.id, request.body)
    return reply.status(200).send(toPropertyResponse(property))
  }
}
