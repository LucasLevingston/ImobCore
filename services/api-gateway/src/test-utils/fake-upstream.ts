import Fastify, { type FastifyInstance } from 'fastify'

export interface FakeUpstream {
  app: FastifyInstance
  url: string
  close: () => Promise<void>
}

// Simula um service real (auth-service/properties-service) só com o que o
// gateway precisa: /health + uma rota que ecoa path/headers recebidos —
// permite testar o proxy fim-a-fim sem Docker nem os services reais.
export async function startFakeUpstream(): Promise<FakeUpstream> {
  const app = Fastify({ logger: false })

  app.get('/health', () => ({ status: 'ok' }))

  app.all('/echo/*', (request) => ({
    method: request.method,
    url: request.url,
    headers: request.headers,
    body: request.body ?? null,
  }))

  app.post('/login', (request) => ({ received: request.body }))
  app.get('/properties/:id', (request) => ({ id: (request.params as { id: string }).id }))

  const address = await app.listen({ port: 0, host: '127.0.0.1' })

  return {
    app,
    url: address,
    close: () => app.close(),
  }
}
