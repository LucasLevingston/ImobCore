import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import type { DeletePropertyUseCase } from '../../../application/usecases/delete-property/delete-property.usecase'

const paramsSchema = z.object({ id: z.string() })

export function makeDeletePropertyController(useCase: DeletePropertyUseCase) {
  return async function deletePropertyController(request: FastifyRequest, reply: FastifyReply) {
    const { id } = paramsSchema.parse(request.params)
    await useCase.execute(id)
    return reply.status(204).send()
  }
}
