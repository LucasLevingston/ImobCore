import helmet from '@fastify/helmet'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import Fastify, { type FastifyInstance } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
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

// Nunca logar Authorization ou cookie, mesmo em erro (docs seção 26) — este
// service não tem body sensível (sem senha/token), só headers de sessão
const REDACT_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'res.headers["set-cookie"]',
]

export interface AppDependencies {
  propertyRepository: PropertyRepository
  tokenProvider: TokenProvider
  checkReadiness?: () => Promise<boolean>
  logger?: boolean
}

// Composition root: monta plugins, use cases e rotas a partir de dependências
// injetadas — testes passam fakes, main/server.ts passa implementações Prisma reais.
export async function buildApp(deps: AppDependencies): Promise<FastifyInstance> {
  // requestIdHeader: correlaciona os logs deste service com o x-request-id
  // gerado pelo api-gateway (docs seção 25) — sem isso o Fastify usa seu
  // próprio contador incremental, sem relação com a requisição de origem
  const app = Fastify({
    logger: deps.logger === false ? false : { redact: REDACT_PATHS },
    requestIdHeader: 'x-request-id',
  })

  // CORS e rate-limit ficam só no api-gateway (seção 04a) — este service não
  // recebe mais tráfego direto de browser, só helmet fica (defesa em profundidade)
  await app.register(helmet)

  // fastify-type-provider-zod: valida request (body/params/querystring) e
  // serializa response direto a partir dos MESMOS schemas Zod já usados pela
  // regra de negócio (@microfrontends/validation-schemas) — sem isso, spec
  // OpenAPI teria que ser mantida à mão, ou duplicada em JSON Schema puro.
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  await app.register(swagger, {
    openapi: {
      info: { title: 'properties-service', version: '1.0.0' },
    },
    transform: jsonSchemaTransform,
  })
  // /docs só em dev — nunca expor spec/UI publicamente em produção sem auth
  // (não é dado sensível em si, mas é reconhecimento gratuito da API interna)
  if (process.env.NODE_ENV !== 'production') {
    await app.register(swaggerUi, { routePrefix: '/docs' })
  }

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
