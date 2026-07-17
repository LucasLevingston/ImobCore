import {
  accessTokenResponseSchema,
  loginSchema,
  registerUserSchema,
  userResponseSchema,
} from '@microfrontends/validation-schemas'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
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
  const typedApp = app.withTypeProvider<ZodTypeProvider>()

  typedApp.post(
    '/register',
    { schema: { tags: ['auth'], body: registerUserSchema, response: { 201: userResponseSchema } } },
    makeRegisterController(deps.registerUserUseCase),
  )
  typedApp.post(
    '/login',
    { schema: { tags: ['auth'], body: loginSchema, response: { 200: accessTokenResponseSchema } } },
    makeLoginController(deps.loginUseCase, deps.refreshTokenTtlMs),
  )
  typedApp.post(
    '/refresh',
    { schema: { tags: ['auth'], response: { 200: accessTokenResponseSchema } } },
    makeRefreshController(deps.refreshTokenUseCase, deps.refreshTokenTtlMs),
  )
  app.post('/logout', makeLogoutController(deps.logoutUseCase))
  typedApp.get(
    '/me',
    {
      onRequest: deps.authenticate,
      schema: { tags: ['auth'], response: { 200: userResponseSchema } },
    },
    makeMeController(deps.getProfileUseCase),
  )
}
