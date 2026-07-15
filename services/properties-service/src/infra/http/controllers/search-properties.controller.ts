import type { FastifyReply, FastifyRequest } from 'fastify'
import { searchPropertiesQuerySchema } from '../../../application/dto/search-properties-query.dto'
import type { SearchPropertiesUseCase } from '../../../application/usecases/search-properties/search-properties.usecase'
import { toPropertyResponse } from '../mappers/property-response.mapper'
import { toFiltersAndPagination } from '../utils/query-mapper'

export function makeSearchPropertiesController(useCase: SearchPropertiesUseCase) {
  return async function searchPropertiesController(request: FastifyRequest, reply: FastifyReply) {
    const { q, ...rest } = searchPropertiesQuerySchema.parse(request.query)
    const { filters, pagination } = toFiltersAndPagination(rest)
    const result = await useCase.execute(q, filters, pagination)
    return reply.status(200).send({ ...result, items: result.items.map(toPropertyResponse) })
  }
}
