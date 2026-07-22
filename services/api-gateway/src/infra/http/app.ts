import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import httpProxy from '@fastify/http-proxy'
import rateLimit from '@fastify/rate-limit'
import Fastify, { type FastifyInstance } from 'fastify'
import type { AppDependencies } from './app.types'
import { pingUpstream } from './ping-upstream'
import { isMutatingMethod } from './plugins/is-mutating-method'
import { isOriginAllowed } from './plugins/origin-guard'
import { resolveRequestId } from './plugins/request-id'

// Nunca logar Authorization ou cookie (refresh token), mesmo em erro (docs
// seção 26) — o gateway só transporta esses headers, nunca os inspeciona
const REDACT_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'res.headers["set-cookie"]',
]

// Composition root do gateway: só proxy + cross-cutting (CORS, rate-limit,
// request-id, health agregado) — nunca regra de negócio (docs seção 04a).
export async function buildApp(deps: AppDependencies): Promise<FastifyInstance> {
  const app = Fastify({
    logger: deps.logger === false ? false : { redact: REDACT_PATHS },
  })

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

  // CSRF: CORS sozinho só impede o JS de um site malicioso de LER a resposta
  // cross-origin — não impede o browser de ENVIAR a requisição mutável em
  // primeiro lugar (cookie de sessão vai junto automaticamente). Rejeita
  // aqui, antes de qualquer rota, se Origin/Referer não bate com um frontend
  // conhecido (docs seção 18).
  app.addHook('onRequest', async (request, reply) => {
    if (!isMutatingMethod(request.method)) return
    if (isOriginAllowed(request.headers.origin, request.headers.referer, deps.corsOrigin)) return

    return reply.status(403).send({
      statusCode: 403,
      error: 'ForbiddenError',
      message: 'Origem da requisição não permitida.',
    })
  })

  app.get('/health', () => ({ status: 'ok' }))
  app.get('/health/ready', async (_request, reply) => {
    const results = await Promise.all(
      deps.services.map(
        async (service) => [service.name, await pingUpstream(service.url)] as const,
      ),
    )
    const ready = results.every(([, ok]) => ok)
    return reply.status(ready ? 200 : 503).send({
      status: ready ? 'ready' : 'not-ready',
      services: Object.fromEntries(results),
    })
  })

  // Loop sobre deps.services em vez de um app.register(httpProxy, ...) por
  // serviço — um novo downstream (docs seção 04a) vira uma entrada na lista
  // que server.ts monta, não uma nova chamada aqui.
  for (const service of deps.services) {
    await app.register(httpProxy, {
      upstream: service.url,
      prefix: service.prefix,
      rewritePrefix: service.rewritePrefix,
    })
  }

  return app
}
