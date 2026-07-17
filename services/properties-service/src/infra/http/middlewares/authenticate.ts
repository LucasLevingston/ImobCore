import type { FastifyReply, FastifyRequest } from 'fastify'
import { UnauthorizedError } from '../../../application/errors/unauthorized-error'
import type { TokenProvider } from '../../../domain/cryptography/token-provider'

const BEARER_PREFIX = 'Bearer '

export function makeAuthenticate(tokenProvider: TokenProvider) {
  // Precisa ser async: hooks onRequest do Fastify esperam Promise ou callback
  // `done` — uma função síncrona sem nenhum dos dois trava a requisição
  return async function authenticate(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    const header = request.headers.authorization

    if (!header?.startsWith(BEARER_PREFIX)) {
      throw new UnauthorizedError('Token de acesso ausente.')
    }

    const token = header.slice(BEARER_PREFIX.length)
    const payload = tokenProvider.verifyAccessToken(token)

    if (!payload) {
      throw new UnauthorizedError('Token de acesso inválido ou expirado.')
    }

    request.user = payload
  }
}
