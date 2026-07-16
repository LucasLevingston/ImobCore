import type { FastifyReply, FastifyRequest } from 'fastify'
import type { DeletePropertyUseCase } from '../../../application/usecases/delete-property/delete-property.usecase'
import type { PropertyIdParams } from '../schemas/property-params.schema'

// Params já validados pelo schema Zod registrado na rota (property.routes.ts)
export function makeDeletePropertyController(useCase: DeletePropertyUseCase) {
  return async function deletePropertyController(
    request: FastifyRequest<{ Params: PropertyIdParams }>,
    reply: FastifyReply,
  ) {
    await useCase.execute(request.params.id)
    return reply.status(204).send()
  }
}
