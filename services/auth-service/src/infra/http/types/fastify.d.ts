import type { AccessTokenPayload } from '../../../domain/cryptography/token-provider'

declare module 'fastify' {
  interface FastifyRequest {
    user?: AccessTokenPayload
  }
}
