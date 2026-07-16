import type { FastifyReply, FastifyRequest } from 'fastify'
import { listPropertiesQuerySchema } from '../../../application/dto/list-properties-query.dto'
import type { ListPropertiesUseCase } from '../../../application/usecases/list-properties/list-properties.usecase'
import { toPropertyResponse } from '../mappers/property-response.mapper'
import { toFiltersAndPagination } from '../utils/query-mapper'

export function makeListPropertiesController(useCase: ListPropertiesUseCase) {
  return async function listPropertiesController(request: FastifyRequest, reply: FastifyReply) {
    const query = listPropertiesQuerySchema.parse(request.query)
    const { filters, pagination } = toFiltersAndPagination(query)
    const result = await useCase.execute(filters, pagination)
    return reply.status(200).send({ ...result, items: result.items.map(toPropertyResponse) })
  }
}
