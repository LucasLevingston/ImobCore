import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { GetProfileUseCase } from '../../../application/usecases/get-profile/get-profile.usecase'
import type { LoginUseCase } from '../../../application/usecases/login/login.usecase'
import type { LogoutUseCase } from '../../../application/usecases/logout/logout.usecase'
import type { RefreshTokenUseCase } from '../../../application/usecases/refresh-token/refresh-token.usecase'
import type { RegisterUserUseCase } from '../../../application/usecases/register-user/register-user.usecase'
import { makeLoginController } from '../controllers/login.controller'
import { makeLogoutController } from '../controllers/logout.controller'
import { makeMeController } from '../controllers/me.controller'
import { makeRefreshController } from '../controllers/refresh.controller'
import { makeRegisterController } from '../controllers/register.controller'

interface AuthRoutesDependencies {
  registerUserUseCase: RegisterUserUseCase
  loginUseCase: LoginUseCase
  refreshTokenUseCase: RefreshTokenUseCase
  logoutUseCase: LogoutUseCase
  getProfileUseCase: GetProfileUseCase
  authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  refreshTokenTtlMs: number
}

export function registerAuthRoutes(app: FastifyInstance, deps: AuthRoutesDependencies): void {
  app.post('/register', makeRegisterController(deps.registerUserUseCase))
  app.post('/login', makeLoginController(deps.loginUseCase, deps.refreshTokenTtlMs))
  app.post('/refresh', makeRefreshController(deps.refreshTokenUseCase, deps.refreshTokenTtlMs))
  app.post('/logout', makeLogoutController(deps.logoutUseCase))
  app.get('/me', { onRequest: deps.authenticate }, makeMeController(deps.getProfileUseCase))
}
