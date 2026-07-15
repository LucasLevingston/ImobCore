import helmet from '@fastify/helmet'
import Fastify, { type FastifyInstance } from 'fastify'
import { CreatePropertyUseCase } from '../../application/usecases/create-property/create-property.usecase'
import { DeletePropertyUseCase } from '../../application/usecases/delete-property/delete-property.usecase'
import { GetDashboardMetricsUseCase } from '../../application/usecases/get-dashboard-metrics/get-dashboard-metrics.usecase'
import { GetPropertyUseCase } from '../../application/usecases/get-property/get-property.usecase'
import { ListPropertiesUseCase } from '../../application/usecases/list-properties/list-properties.usecase'
import { SearchPropertiesUseCase } from '../../application/usecases/search-properties/search-properties.usecase'
import { UpdatePropertyUseCase } from '../../application/usecases/update-property/update-property.usecase'
import type { TokenProvider } from '../../domain/cryptography/token-provider'
import type { PropertyRepository } from '../../domain/repositories/property-repository'
import { makeAuthenticate } from './middlewares/authenticate'
import { errorHandler } from './middlewares/error-handler'
import { registerPropertyRoutes } from './routes/property.routes'

export interface AppDependencies {
  propertyRepository: PropertyRepository
  tokenProvider: TokenProvider
  checkReadiness?: () => Promise<boolean>
  logger?: boolean
}

// Composition root: monta plugins, use cases e rotas a partir de dependências
// injetadas — testes passam fakes, main/server.ts passa implementações Prisma reais.
export async function buildApp(deps: AppDependencies): Promise<FastifyInstance> {
  const app = Fastify({ logger: deps.logger ?? true })

  // CORS e rate-limit ficam só no api-gateway (seção 04a) — este service não
  // recebe mais tráfego direto de browser, só helmet fica (defesa em profundidade)
  await app.register(helmet)

  app.setErrorHandler(errorHandler)

  const createPropertyUseCase = new CreatePropertyUseCase(deps.propertyRepository)
  const getPropertyUseCase = new GetPropertyUseCase(deps.propertyRepository)
  const updatePropertyUseCase = new UpdatePropertyUseCase(deps.propertyRepository)
  const deletePropertyUseCase = new DeletePropertyUseCase(deps.propertyRepository)
  const listPropertiesUseCase = new ListPropertiesUseCase(deps.propertyRepository)
  const searchPropertiesUseCase = new SearchPropertiesUseCase(deps.propertyRepository)
  const getDashboardMetricsUseCase = new GetDashboardMetricsUseCase(deps.propertyRepository)

  app.get('/health', () => ({ status: 'ok' }))
  app.get('/health/ready', async (_request, reply) => {
    const ready = deps.checkReadiness ? await deps.checkReadiness() : true
    return reply.status(ready ? 200 : 503).send({ status: ready ? 'ready' : 'not-ready' })
  })

  registerPropertyRoutes(app, {
    createPropertyUseCase,
    getPropertyUseCase,
    updatePropertyUseCase,
    deletePropertyUseCase,
    listPropertiesUseCase,
    searchPropertiesUseCase,
    getDashboardMetricsUseCase,
    authenticate: makeAuthenticate(deps.tokenProvider),
  })

  return app
}
