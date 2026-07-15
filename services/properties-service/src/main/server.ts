import { buildApp } from '../infra/http/app'
import { JwtTokenProvider } from '../infra/cryptography/jwt-token-provider'
import { prisma } from '../infra/database/prisma/client'
import { PrismaPropertyRepository } from '../infra/database/prisma/prisma-property-repository'
import { env } from './env'

async function main() {
  const app = await buildApp({
    propertyRepository: new PrismaPropertyRepository(prisma),
    tokenProvider: new JwtTokenProvider(env.JWT_SECRET),
    checkReadiness: async () => {
      try {
        await prisma.$queryRaw`SELECT 1`
        return true
      } catch {
        return false
      }
    },
  })

  await app.listen({ port: env.PROPERTIES_SERVICE_PORT, host: '0.0.0.0' })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
