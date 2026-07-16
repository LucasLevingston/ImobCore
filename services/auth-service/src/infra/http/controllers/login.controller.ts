import type { FastifyReply, FastifyRequest } from 'fastify'
import type { LoginInput } from '../../../application/dto/login.dto'
import type { LoginUseCase } from '../../../application/usecases/login/login.usecase'
import {
  REFRESH_TOKEN_COOKIE_NAME,
  refreshTokenCookieOptions,
} from '../cookies/refresh-token-cookie'

// Body já validado pelo schema Zod registrado na rota (auth.routes.ts)
export function makeLoginController(useCase: LoginUseCase, refreshTokenTtlMs: number) {
  return async function loginController(
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply,
  ) {
    const { accessToken, refreshToken } = await useCase.execute(request.body)

    reply.setCookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      refreshTokenCookieOptions(refreshTokenTtlMs),
    )
    return reply.status(200).send({ accessToken })
  }
}
