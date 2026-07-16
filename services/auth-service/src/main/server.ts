import { buildApp } from '../infra/http/app'
import { BcryptHasher } from '../infra/cryptography/bcrypt-hasher'
import { JwtTokenProvider } from '../infra/cryptography/jwt-token-provider'
import { Sha256TokenHasher } from '../infra/cryptography/sha256-token-hasher'
import { prisma } from '../infra/database/prisma/client'
import { PrismaRefreshTokenRepository } from '../infra/database/prisma/prisma-refresh-token-repository'
import { PrismaUserRepository } from '../infra/database/prisma/prisma-user-repository'
import { parseDurationToMs } from '../infra/utils/parse-duration'
import { env } from './env'

async function main() {
  const app = await buildApp({
    userRepository: new PrismaUserRepository(prisma),
    refreshTokenRepository: new PrismaRefreshTokenRepository(prisma),
    passwordHasher: new BcryptHasher(env.BCRYPT_SALT_ROUNDS),
    tokenProvider: new JwtTokenProvider(env.JWT_SECRET, env.JWT_ACCESS_TOKEN_EXPIRES_IN),
    tokenHasher: new Sha256TokenHasher(),
    refreshTokenTtlMs: parseDurationToMs(env.JWT_REFRESH_TOKEN_EXPIRES_IN),
    checkReadiness: async () => {
      try {
        await prisma.$queryRaw`SELECT 1`
        return true
      } catch {
        return false
      }
    },
  })

  await app.listen({ port: env.AUTH_SERVICE_PORT, host: '0.0.0.0' })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
