import cookie from '@fastify/cookie'
import helmet from '@fastify/helmet'
import Fastify, { type FastifyInstance } from 'fastify'
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
  const app = Fastify({ logger: deps.logger ?? true })

  // CORS e rate-limit ficam só no api-gateway (seção 04a) — este service não
  // recebe mais tráfego direto de browser, só helmet fica (defesa em profundidade)
  await app.register(helmet)
  await app.register(cookie)

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
