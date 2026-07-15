import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import type { GetPropertyUseCase } from '../../../application/usecases/get-property/get-property.usecase'
import { toPropertyResponse } from '../mappers/property-response.mapper'

const paramsSchema = z.object({ id: z.string() })

export function makeGetPropertyController(useCase: GetPropertyUseCase) {
  return async function getPropertyController(request: FastifyRequest, reply: FastifyReply) {
    const { id } = paramsSchema.parse(request.params)
    const property = await useCase.execute(id)
    return reply.status(200).send(toPropertyResponse(property))
  }
}
