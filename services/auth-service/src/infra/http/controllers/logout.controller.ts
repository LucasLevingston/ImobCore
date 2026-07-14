import type { FastifyReply, FastifyRequest } from 'fastify'
import type { LogoutUseCase } from '../../../application/usecases/logout/logout.usecase'
import { REFRESH_TOKEN_COOKIE_NAME } from '../cookies/refresh-token-cookie'

export function makeLogoutController(useCase: LogoutUseCase) {
  return async function logoutController(request: FastifyRequest, reply: FastifyReply) {
    const rawRefreshToken = request.cookies[REFRESH_TOKEN_COOKIE_NAME]
    if (rawRefreshToken) {
      await useCase.execute(rawRefreshToken)
    }

    reply.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { path: '/' })
    return reply.status(204).send()
  }
}
