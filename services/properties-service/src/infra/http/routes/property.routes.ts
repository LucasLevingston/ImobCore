import { propertyResponseSchema } from '@microfrontends/validation-schemas'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { createPropertySchema } from '../../../application/dto/create-property.dto'
import { listPropertiesQuerySchema } from '../../../application/dto/list-properties-query.dto'
import { searchPropertiesQuerySchema } from '../../../application/dto/search-properties-query.dto'
import { updatePropertySchema } from '../../../application/dto/update-property.dto'
import { makeCreatePropertyController } from '../controllers/create-property.controller'
import { makeDeletePropertyController } from '../controllers/delete-property.controller'
import { makeGetDashboardMetricsController } from '../controllers/get-dashboard-metrics.controller'
import { makeGetPropertyController } from '../controllers/get-property.controller'
import { makeListPropertiesController } from '../controllers/list-properties.controller'
import { makeSearchPropertiesController } from '../controllers/search-properties.controller'
import { makeUpdatePropertyController } from '../controllers/update-property.controller'
import { propertyIdParamsSchema } from '../schemas/property-params.schema'
import { paginatedPropertiesSchema } from './paginated-properties.schema'
import type { PropertyRoutesDependencies } from './property-routes.types'

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
