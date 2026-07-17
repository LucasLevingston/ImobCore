import type { FastifyReply, FastifyRequest } from 'fastify'
import type { SearchPropertiesQuery } from '../../../application/dto/search-properties-query.types'
import type { SearchPropertiesUseCase } from '../../../application/usecases/search-properties/search-properties.usecase'
import { toPropertyResponse } from '../mappers/property-response.mapper'
import { toFiltersAndPagination } from '../utils/query-mapper'

// Query já validada pelo schema Zod registrado na rota (property.routes.ts)
export function makeSearchPropertiesController(useCase: SearchPropertiesUseCase) {
  return async function searchPropertiesController(
    request: FastifyRequest<{ Querystring: SearchPropertiesQuery }>,
    reply: FastifyReply,
  ) {
    const { q, ...rest } = request.query
    const { filters, pagination } = toFiltersAndPagination(rest)
    const result = await useCase.execute(q, filters, pagination)
    return reply.status(200).send({ ...result, items: result.items.map(toPropertyResponse) })
  }
}
