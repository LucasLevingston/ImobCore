import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { updatePropertySchema } from '../../../application/dto/update-property.dto'
import type { UpdatePropertyUseCase } from '../../../application/usecases/update-property/update-property.usecase'
import { toPropertyResponse } from '../mappers/property-response.mapper'

const paramsSchema = z.object({ id: z.string() })

export function makeUpdatePropertyController(useCase: UpdatePropertyUseCase) {
  return async function updatePropertyController(request: FastifyRequest, reply: FastifyReply) {
    const { id } = paramsSchema.parse(request.params)
    const input = updatePropertySchema.parse(request.body)
    const property = await useCase.execute(id, input)
    return reply.status(200).send(toPropertyResponse(property))
  }
}
