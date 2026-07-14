import type { FastifyReply, FastifyRequest } from 'fastify'
import { loginSchema } from '../../../application/dto/login.dto'
import type { LoginUseCase } from '../../../application/usecases/login/login.usecase'
import {
  REFRESH_TOKEN_COOKIE_NAME,
  refreshTokenCookieOptions,
} from '../cookies/refresh-token-cookie'

export function makeLoginController(useCase: LoginUseCase, refreshTokenTtlMs: number) {
  return async function loginController(request: FastifyRequest, reply: FastifyReply) {
    const input = loginSchema.parse(request.body)
    const { accessToken, refreshToken } = await useCase.execute(input)

    reply.setCookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      refreshTokenCookieOptions(refreshTokenTtlMs),
    )
    return reply.status(200).send({ accessToken })
  }
}
