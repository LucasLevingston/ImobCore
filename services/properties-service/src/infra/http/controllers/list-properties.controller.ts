import type { FastifyReply, FastifyRequest } from 'fastify'
import type { ListPropertiesQuery } from '../../../application/dto/list-properties-query.dto'
import type { ListPropertiesUseCase } from '../../../application/usecases/list-properties/list-properties.usecase'
import { toPropertyResponse } from '../mappers/property-response.mapper'
import { toFiltersAndPagination } from '../utils/query-mapper'

// Query já validada pelo schema Zod registrado na rota (property.routes.ts)
export function makeListPropertiesController(useCase: ListPropertiesUseCase) {
  return async function listPropertiesController(
    request: FastifyRequest<{ Querystring: ListPropertiesQuery }>,
    reply: FastifyReply,
  ) {
    const { filters, pagination } = toFiltersAndPagination(request.query)
    const result = await useCase.execute(filters, pagination)
    return reply.status(200).send({ ...result, items: result.items.map(toPropertyResponse) })
  }
}
