import type { FastifyInstance } from 'fastify'

export interface FakeUpstream {
  app: FastifyInstance
  url: string
  close: () => Promise<void>
}
