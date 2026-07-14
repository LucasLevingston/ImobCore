import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import httpProxy from '@fastify/http-proxy'
import rateLimit from '@fastify/rate-limit'
import Fastify, { type FastifyInstance } from 'fastify'
import { pingUpstream } from './ping-upstream'
import { resolveRequestId } from './plugins/request-id'

export interface AppDependencies {
  authServiceUrl: string
  propertiesServiceUrl: string
  corsOrigin: string | string[]
  logger?: boolean
  rateLimitMax?: number
  rateLimitTimeWindow?: string
}

// Composition root do gateway: só proxy + cross-cutting (CORS, rate-limit,
// request-id, health agregado) — nunca regra de negócio (docs seção 04a).
export async function buildApp(deps: AppDependencies): Promise<FastifyInstance> {
  const app = Fastify({ logger: deps.logger ?? true })

  await app.register(helmet)
  await app.register(cors, { origin: deps.corsOrigin, credentials: true })
  await app.register(rateLimit, {
    max: deps.rateLimitMax ?? 100,
    timeWindow: deps.rateLimitTimeWindow ?? '1 minute',
  })

  app.addHook('onRequest', async (request, reply) => {
    const requestId = resolveRequestId(request.headers['x-request-id'])
    request.headers['x-request-id'] = requestId
    reply.header('x-request-id', requestId)
  })

  app.get('/health', () => ({ status: 'ok' }))
  app.get('/health/ready', async (_request, reply) => {
    const [auth, properties] = await Promise.all([
      pingUpstream(deps.authServiceUrl),
      pingUpstream(deps.propertiesServiceUrl),
    ])
    const ready = auth && properties
    return reply.status(ready ? 200 : 503).send({
      status: ready ? 'ready' : 'not-ready',
      services: { auth, properties },
    })
  })

  await app.register(httpProxy, {
    upstream: deps.authServiceUrl,
    prefix: '/api/auth',
    rewritePrefix: '',
  })

  await app.register(httpProxy, {
    upstream: deps.propertiesServiceUrl,
    prefix: '/api/properties',
    rewritePrefix: '/properties',
  })

  return app
}
