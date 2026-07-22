import { buildApp } from '../infra/http/app'
import { env } from './env'

async function main() {
  const app = await buildApp({
    services: [
      { name: 'auth', url: env.AUTH_SERVICE_URL, prefix: '/api/auth', rewritePrefix: '' },
      {
        name: 'properties',
        url: env.PROPERTIES_SERVICE_URL,
        prefix: '/api/properties',
        rewritePrefix: '/properties',
      },
    ],
    corsOrigin: env.CORS_ORIGIN.split(','),
    rateLimitMax: env.RATE_LIMIT_MAX,
    rateLimitTimeWindow: env.RATE_LIMIT_TIME_WINDOW,
  })

  await app.listen({ port: env.API_GATEWAY_PORT, host: '0.0.0.0' })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
