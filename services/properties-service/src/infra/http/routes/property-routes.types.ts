import type { FastifyReply, FastifyRequest } from 'fastify'
import type { CreatePropertyUseCase } from '../../../application/usecases/create-property/create-property.usecase'
import type { DeletePropertyUseCase } from '../../../application/usecases/delete-property/delete-property.usecase'
import type { GetDashboardMetricsUseCase } from '../../../application/usecases/get-dashboard-metrics/get-dashboard-metrics.usecase'
import type { GetPropertyUseCase } from '../../../application/usecases/get-property/get-property.usecase'
import type { ListPropertiesUseCase } from '../../../application/usecases/list-properties/list-properties.usecase'
import type { SearchPropertiesUseCase } from '../../../application/usecases/search-properties/search-properties.usecase'
import type { UpdatePropertyUseCase } from '../../../application/usecases/update-property/update-property.usecase'

export interface PropertyRoutesDependencies {
  createPropertyUseCase: CreatePropertyUseCase
  getPropertyUseCase: GetPropertyUseCase
  updatePropertyUseCase: UpdatePropertyUseCase
  deletePropertyUseCase: DeletePropertyUseCase
  listPropertiesUseCase: ListPropertiesUseCase
  searchPropertiesUseCase: SearchPropertiesUseCase
  getDashboardMetricsUseCase: GetDashboardMetricsUseCase
  authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
}
