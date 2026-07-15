import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
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

      instance.get('/search', makeSearchPropertiesController(deps.searchPropertiesUseCase))
      instance.get('/metrics', makeGetDashboardMetricsController(deps.getDashboardMetricsUseCase))
      instance.get('/', makeListPropertiesController(deps.listPropertiesUseCase))
      instance.get('/:id', makeGetPropertyController(deps.getPropertyUseCase))
      instance.post('/', makeCreatePropertyController(deps.createPropertyUseCase))
      instance.put('/:id', makeUpdatePropertyController(deps.updatePropertyUseCase))
      instance.delete('/:id', makeDeletePropertyController(deps.deletePropertyUseCase))
    },
    { prefix: '/properties' },
  )
}
