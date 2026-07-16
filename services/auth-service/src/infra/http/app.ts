import cookie from '@fastify/cookie'
import helmet from '@fastify/helmet'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import Fastify, { type FastifyInstance } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { GetProfileUseCase } from '../../application/usecases/get-profile/get-profile.usecase'
import { LoginUseCase } from '../../application/usecases/login/login.usecase'
import { LogoutUseCase } from '../../application/usecases/logout/logout.usecase'
import { RefreshTokenUseCase } from '../../application/usecases/refresh-token/refresh-token.usecase'
import { RegisterUserUseCase } from '../../application/usecases/register-user/register-user.usecase'
import type { PasswordHasher } from '../../domain/cryptography/password-hasher'
import type { TokenHasher } from '../../domain/cryptography/token-hasher'
import type { TokenProvider } from '../../domain/cryptography/token-provider'
import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token-repository'
import type { UserRepository } from '../../domain/repositories/user-repository'
import { makeAuthenticate } from './middlewares/authenticate'
import { errorHandler } from './middlewares/error-handler'
import { registerAuthRoutes } from './routes/auth.routes'

// Nunca logar senha, Authorization ou cookie — mesmo em erro (docs seção 26).
// Corpo de /register e /login carrega "password" em texto puro na requisição.
const REDACT_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'res.headers["set-cookie"]',
  'req.body.password',
]

export interface AppDependencies {
  userRepository: UserRepository
  refreshTokenRepository: RefreshTokenRepository
  passwordHasher: PasswordHasher
  tokenProvider: TokenProvider
  tokenHasher: TokenHasher
  refreshTokenTtlMs: number
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
  await app.register(cookie)

  // fastify-type-provider-zod: valida request e serializa response direto a
  // partir dos MESMOS schemas Zod já usados pela regra de negócio
  // (@microfrontends/validation-schemas) — mesma abordagem de properties-service.
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  await app.register(swagger, {
    openapi: {
      info: { title: 'auth-service', version: '1.0.0' },
    },
    transform: jsonSchemaTransform,
  })
  if (process.env.NODE_ENV !== 'production') {
    await app.register(swaggerUi, { routePrefix: '/docs' })
  }

  app.setErrorHandler(errorHandler)

  const registerUserUseCase = new RegisterUserUseCase(deps.userRepository, deps.passwordHasher)
  const loginUseCase = new LoginUseCase(
    deps.userRepository,
    deps.refreshTokenRepository,
    deps.passwordHasher,
    deps.tokenProvider,
    deps.tokenHasher,
    deps.refreshTokenTtlMs,
  )
  const refreshTokenUseCase = new RefreshTokenUseCase(
    deps.refreshTokenRepository,
    deps.userRepository,
    deps.tokenProvider,
    deps.tokenHasher,
    deps.refreshTokenTtlMs,
  )
  const logoutUseCase = new LogoutUseCase(deps.refreshTokenRepository, deps.tokenHasher)
  const getProfileUseCase = new GetProfileUseCase(deps.userRepository)

  app.get('/health', () => ({ status: 'ok' }))
  app.get('/health/ready', async (_request, reply) => {
    const ready = deps.checkReadiness ? await deps.checkReadiness() : true
    return reply.status(ready ? 200 : 503).send({ status: ready ? 'ready' : 'not-ready' })
  })

  registerAuthRoutes(app, {
    registerUserUseCase,
    loginUseCase,
    refreshTokenUseCase,
    logoutUseCase,
    getProfileUseCase,
    authenticate: makeAuthenticate(deps.tokenProvider),
    refreshTokenTtlMs: deps.refreshTokenTtlMs,
  })

  return app
}
