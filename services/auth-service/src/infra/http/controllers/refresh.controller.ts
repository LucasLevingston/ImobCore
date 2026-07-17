import type { FastifyReply, FastifyRequest } from 'fastify'
import { UnauthorizedError } from '../../../application/errors/unauthorized-error'
import type { RefreshTokenUseCase } from '../../../application/usecases/refresh-token/refresh-token.usecase'
import { refreshTokenCookieOptions } from '../cookies/refresh-token-cookie'
import { REFRESH_TOKEN_COOKIE_NAME } from '../cookies/refresh-token-cookie.constants'

export function makeRefreshController(useCase: RefreshTokenUseCase, refreshTokenTtlMs: number) {
  return async function refreshController(request: FastifyRequest, reply: FastifyReply) {
    const rawRefreshToken = request.cookies[REFRESH_TOKEN_COOKIE_NAME]
    if (!rawRefreshToken) {
      throw new UnauthorizedError('Refresh token ausente.')
    }

    const { accessToken, refreshToken } = await useCase.execute(rawRefreshToken)

    reply.setCookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      refreshTokenCookieOptions(refreshTokenTtlMs),
    )
    return reply.status(200).send({ accessToken })
  }
}
