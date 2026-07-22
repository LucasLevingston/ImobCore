import type { FastifyInstance } from 'fastify'
import request from 'supertest'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { startFakeUpstream } from '../../test-utils/fake-upstream'
import type { FakeUpstream } from '../../test-utils/fake-upstream.types'
import { buildApp } from './app'

describe('api-gateway', () => {
  let authUpstream: FakeUpstream
  let propertiesUpstream: FakeUpstream
  let app: FastifyInstance

  beforeAll(async () => {
    authUpstream = await startFakeUpstream()
    propertiesUpstream = await startFakeUpstream()
  })

  afterAll(async () => {
    await authUpstream.close()
    await propertiesUpstream.close()
  })

  afterEach(async () => {
    await app.close()
  })

  interface MakeAppOverrides {
    authUrl?: string
    propertiesUrl?: string
    corsOrigin?: string[]
    logger?: boolean
    rateLimitMax?: number
    rateLimitTimeWindow?: string
  }

  async function makeApp(overrides: MakeAppOverrides = {}) {
    app = await buildApp({
      services: [
        {
          name: 'auth',
          url: overrides.authUrl ?? authUpstream.url,
          prefix: '/api/auth',
          rewritePrefix: '',
        },
        {
          name: 'properties',
          url: overrides.propertiesUrl ?? propertiesUpstream.url,
          prefix: '/api/properties',
          rewritePrefix: '/properties',
        },
      ],
      corsOrigin: overrides.corsOrigin ?? ['http://localhost:3000'],
      logger: overrides.logger ?? false,
      rateLimitMax: overrides.rateLimitMax,
      rateLimitTimeWindow: overrides.rateLimitTimeWindow,
    })
    await app.ready()
    return app
  }

  describe('GET /health', () => {
    it('should return 200 without checking upstreams', async () => {
      await makeApp()
      const response = await request(app.server).get('/health')
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ status: 'ok' })
    })
  })

  describe('GET /health/ready', () => {
    it('should return 200 when both upstreams are healthy', async () => {
      await makeApp()
      const response = await request(app.server).get('/health/ready')
      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        status: 'ready',
        services: { auth: true, properties: true },
      })
    })

    it('should return 503 when an upstream is unreachable', async () => {
      await makeApp({ propertiesUrl: 'http://127.0.0.1:1' })
      const response = await request(app.server).get('/health/ready')
      expect(response.status).toBe(503)
      expect(response.body).toEqual({
        status: 'not-ready',
        services: { auth: true, properties: false },
      })
    })
  })

  describe('proxy /api/auth/*', () => {
    it('should forward requests to the auth-service upstream, stripping /api/auth', async () => {
      await makeApp()
      const response = await request(app.server)
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:3000')
        .send({ email: 'lucas@email.com', password: 'x' })

      expect(response.status).toBe(200)
      expect(response.body.received).toEqual({ email: 'lucas@email.com', password: 'x' })
    })
  })

  describe('proxy /api/properties/*', () => {
    it('should forward requests to the properties-service upstream, keeping /properties', async () => {
      await makeApp()
      const response = await request(app.server).get('/api/properties/123')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({ id: '123' })
    })
  })

  describe('x-request-id', () => {
    it('should generate a request id and forward it upstream when absent', async () => {
      await makeApp()
      const response = await request(app.server)
        .post('/api/auth/echo/anything')
        .set('Origin', 'http://localhost:3000')
        .send({})

      expect(response.headers['x-request-id']).toBeDefined()
      expect(response.body.headers['x-request-id']).toBe(response.headers['x-request-id'])
    })

    it('should reuse the incoming x-request-id instead of generating a new one', async () => {
      await makeApp()
      const response = await request(app.server)
        .post('/api/auth/echo/anything')
        .set('Origin', 'http://localhost:3000')
        .set('x-request-id', 'my-custom-id')
        .send({})

      expect(response.headers['x-request-id']).toBe('my-custom-id')
      expect(response.body.headers['x-request-id']).toBe('my-custom-id')
    })
  })

  describe('CSRF Origin guard', () => {
    it('should reject a mutating request with no Origin/Referer', async () => {
      await makeApp()
      const response = await request(app.server)
        .post('/api/auth/login')
        .send({ email: 'lucas@email.com', password: 'x' })

      expect(response.status).toBe(403)
    })

    it('should reject a mutating request from an origin outside the allowlist', async () => {
      await makeApp()
      const response = await request(app.server)
        .post('/api/auth/login')
        .set('Origin', 'http://evil.example')
        .send({ email: 'lucas@email.com', password: 'x' })

      expect(response.status).toBe(403)
    })

    it('should never block a non-mutating request, even without Origin', async () => {
      await makeApp()
      const response = await request(app.server).get('/api/properties/123')

      expect(response.status).toBe(200)
    })
  })

  describe('CORS', () => {
    it('should allow the configured origin', async () => {
      await makeApp()
      const response = await request(app.server)
        .get('/health')
        .set('Origin', 'http://localhost:3000')

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000')
    })
  })

  describe('buildApp defaults', () => {
    it('should build successfully using default logger and rate-limit settings', async () => {
      app = await buildApp({
        services: [
          { name: 'auth', url: authUpstream.url, prefix: '/api/auth', rewritePrefix: '' },
          {
            name: 'properties',
            url: propertiesUpstream.url,
            prefix: '/api/properties',
            rewritePrefix: '/properties',
          },
        ],
        corsOrigin: ['http://localhost:3000'],
      })
      await app.ready()

      const response = await request(app.server).get('/health')
      expect(response.status).toBe(200)
    })
  })

  describe('rate limiting', () => {
    it('should return 429 after exceeding the configured limit', async () => {
      await makeApp({ rateLimitMax: 2, rateLimitTimeWindow: '1 minute' })

      await request(app.server).get('/health')
      await request(app.server).get('/health')
      const response = await request(app.server).get('/health')

      expect(response.status).toBe(429)
    })
  })
})
