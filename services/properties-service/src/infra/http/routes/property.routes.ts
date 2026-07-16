import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { propertyResponseSchema } from '@microfrontends/validation-schemas'
import { createPropertySchema } from '../../../application/dto/create-property.dto'
import { listPropertiesQuerySchema } from '../../../application/dto/list-properties-query.dto'
import { searchPropertiesQuerySchema } from '../../../application/dto/search-properties-query.dto'
import { updatePropertySchema } from '../../../application/dto/update-property.dto'
import type { CreatePropertyUseCase } from '../../../application/usecases/create-property/create-property.usecase'
import type { DeletePropertyUseCase } from '../../../application/usecases/delete-property/delete-property.usecase'
import type { GetDashboardMetricsUseCase } from '../../../application/usecases/get-dashboard-metrics/get-dashboard-metrics.usecase'
import type { GetPropertyUseCase } from '../../../application/usecases/get-property/get-property.usecase'
import type { ListPropertiesUseCase } from '../../../application/usecases/list-properties/list-properties.usecase'
import type { SearchPropertiesUseCase } from '../../../application/usecases/search-properties/search-properties.usecase'
import type { UpdatePropertyUseCase } from '../../../application/usecases/update-property/update-property.usecase'
import { makeCreatePropertyController } from '../controllers/create-property.controller'
import { makeDeletePropertyController } from '../controllers/delete-property.controller'
import { makeGetDashboardMetricsController } from '../controllers/get-dashboard-metrics.controller'
import { makeGetPropertyController } from '../controllers/get-property.controller'
import { makeListPropertiesController } from '../controllers/list-properties.controller'
import { makeSearchPropertiesController } from '../controllers/search-properties.controller'
import { makeUpdatePropertyController } from '../controllers/update-property.controller'
import { propertyIdParamsSchema } from '../schemas/property-params.schema'

const paginatedPropertiesSchema = z.object({
  items: z.array(propertyResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})

interface PropertyRoutesDependencies {
  createPropertyUseCase: CreatePropertyUseCase
  getPropertyUseCase: GetPropertyUseCase
  updatePropertyUseCase: UpdatePropertyUseCase
  deletePropertyUseCase: DeletePropertyUseCase
  listPropertiesUseCase: ListPropertiesUseCase
  searchPropertiesUseCase: SearchPropertiesUseCase
  getDashboardMetricsUseCase: GetDashboardMetricsUseCase
  authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
}

// Todas as rotas exigem access token (docs seção 10) — hook aplicado uma vez no register
export function registerPropertyRoutes(
  app: FastifyInstance,
  deps: PropertyRoutesDependencies,
): void {
  app.register(
    async (instance) => {
      instance.addHook('onRequest', deps.authenticate)
      const typedInstance = instance.withTypeProvider<ZodTypeProvider>()

      typedInstance.get(
        '/search',
        {
          schema: {
            tags: ['properties'],
            querystring: searchPropertiesQuerySchema,
            response: { 200: paginatedPropertiesSchema },
          },
        },
        makeSearchPropertiesController(deps.searchPropertiesUseCase),
      )
      typedInstance.get(
        '/metrics',
        { schema: { tags: ['properties'] } },
        makeGetDashboardMetricsController(deps.getDashboardMetricsUseCase),
      )
      typedInstance.get(
        '/',
        {
          schema: {
            tags: ['properties'],
            querystring: listPropertiesQuerySchema,
            response: { 200: paginatedPropertiesSchema },
          },
        },
        makeListPropertiesController(deps.listPropertiesUseCase),
      )
      typedInstance.get(
        '/:id',
        {
          schema: {
            tags: ['properties'],
            params: propertyIdParamsSchema,
            response: { 200: propertyResponseSchema },
          },
        },
        makeGetPropertyController(deps.getPropertyUseCase),
      )
      typedInstance.post(
        '/',
        {
          schema: {
            tags: ['properties'],
            body: createPropertySchema,
            response: { 201: propertyResponseSchema },
          },
        },
        makeCreatePropertyController(deps.createPropertyUseCase),
      )
      typedInstance.put(
        '/:id',
        {
          schema: {
            tags: ['properties'],
            params: propertyIdParamsSchema,
            body: updatePropertySchema,
            response: { 200: propertyResponseSchema },
          },
        },
        makeUpdatePropertyController(deps.updatePropertyUseCase),
      )
      typedInstance.delete(
        '/:id',
        { schema: { tags: ['properties'], params: propertyIdParamsSchema } },
        makeDeletePropertyController(deps.deletePropertyUseCase),
      )
    },
    { prefix: '/properties' },
  )
}
