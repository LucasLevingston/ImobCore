import type { FastifyInstance } from 'fastify'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { makeCreatePropertyInput } from '../../test-utils/factories/make-create-property-input'
import { makeProperty } from '../../test-utils/factories/make-property'
import { InMemoryPropertyRepository } from '../../test-utils/fakes/in-memory-property-repository'
import { JwtTokenProvider } from '../cryptography/jwt-token-provider'
import { buildApp } from './app'

const JWT_SECRET = 'test-secret-key-with-at-least-32-characters'

function makeAccessToken(sub = 'broker-1', email = 'broker@email.com') {
  return jwt.sign({ sub, email }, JWT_SECRET, { expiresIn: '15m' })
}

async function makeApp(propertyRepository = new InMemoryPropertyRepository()) {
  const app = await buildApp({
    propertyRepository,
    tokenProvider: new JwtTokenProvider(JWT_SECRET),
    logger: false,
  })
  await app.ready()
  return { app, propertyRepository }
}

describe('properties-service HTTP routes', () => {
  let app: FastifyInstance
  let propertyRepository: InMemoryPropertyRepository
  let accessToken: string

  beforeEach(async () => {
    ;({ app, propertyRepository } = await makeApp())
    accessToken = makeAccessToken()
  })

  afterEach(async () => {
    await app.close()
  })

  describe('GET /health', () => {
    it('should return 200 with status ok', async () => {
      const response = await request(app.server).get('/health')
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ status: 'ok' })
    })
  })

  describe('GET /health/ready', () => {
    it('should return 200 when no readiness check is configured', async () => {
      const response = await request(app.server).get('/health/ready')
      expect(response.status).toBe(200)
    })

    it('should return 503 when checkReadiness resolves false', async () => {
      const notReadyApp = await buildApp({
        propertyRepository: new InMemoryPropertyRepository(),
        tokenProvider: new JwtTokenProvider(JWT_SECRET),
        logger: false,
        checkReadiness: async () => false,
      })
      await notReadyApp.ready()

      const response = await request(notReadyApp.server).get('/health/ready')

      expect(response.status).toBe(503)
      await notReadyApp.close()
    })
  })

  describe('buildApp logger default', () => {
    it('should default logger to enabled when not specified', async () => {
      const appWithDefaultLogger = await buildApp({
        propertyRepository: new InMemoryPropertyRepository(),
        tokenProvider: new JwtTokenProvider(JWT_SECRET),
      })

      expect(appWithDefaultLogger.log).toBeDefined()
      await appWithDefaultLogger.close()
    })
  })

  describe('buildApp in production', () => {
    afterEach(() => {
      vi.unstubAllEnvs()
    })

    it('should not register the /docs swagger UI route', async () => {
      vi.stubEnv('NODE_ENV', 'production')
      const prodApp = await buildApp({
        propertyRepository: new InMemoryPropertyRepository(),
        tokenProvider: new JwtTokenProvider(JWT_SECRET),
        logger: false,
      })
      await prodApp.ready()

      try {
        const response = await request(prodApp.server).get('/docs')
        expect(response.status).toBe(404)
      } finally {
        await prodApp.close()
      }
    })
  })

  describe('auth guard', () => {
    it('should return 401 for any /properties route without a token', async () => {
      const response = await request(app.server).get('/properties')
      expect(response.status).toBe(401)
    })
  })

  describe('POST /properties', () => {
    it('should create a property and return 201 with the broker id from the token', async () => {
      const response = await request(app.server)
        .post('/properties')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(makeCreatePropertyInput())

      expect(response.status).toBe(201)
      expect(response.body.brokerId).toBe('broker-1')
      expect(response.body.title).toBe('Apartamento 2 quartos no Centro')
    })

    it('should return 400 for an invalid payload', async () => {
      const response = await request(app.server)
        .post('/properties')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'ab' })

      expect(response.status).toBe(400)
    })
  })

  describe('GET /properties', () => {
    it('should list properties with a pagination envelope', async () => {
      propertyRepository.properties.push(makeProperty(), makeProperty())

      const response = await request(app.server)
        .get('/properties')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(200)
      expect(response.body.total).toBe(2)
      expect(response.body.items).toHaveLength(2)
    })

    it('should apply query filters', async () => {
      propertyRepository.properties.push(
        makeProperty({ city: 'São Paulo' }),
        makeProperty({ city: 'Rio de Janeiro' }),
      )

      const response = await request(app.server)
        .get('/properties')
        .query({ city: 'São Paulo' })
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(200)
      expect(response.body.total).toBe(1)
    })
  })

  describe('GET /properties/search', () => {
    it('should return matches for the search term', async () => {
      propertyRepository.properties.push(makeProperty({ title: 'Cobertura vista mar' }))

      const response = await request(app.server)
        .get('/properties/search')
        .query({ q: 'cobertura' })
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(200)
      expect(response.body.total).toBe(1)
    })

    it('should return 400 when the search term is missing', async () => {
      const response = await request(app.server)
        .get('/properties/search')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(400)
    })
  })

  describe('GET /properties/metrics', () => {
    it('should return aggregated dashboard metrics', async () => {
      propertyRepository.properties.push(makeProperty({ status: 'Sold' }))

      const response = await request(app.server)
        .get('/properties/metrics')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(200)
      expect(response.body.total).toBe(1)
      expect(response.body.byStatus.Sold).toBe(1)
    })
  })

  describe('GET /properties/:id', () => {
    it('should return the property', async () => {
      const property = makeProperty()
      propertyRepository.properties.push(property)

      const response = await request(app.server)
        .get(`/properties/${property.id}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(200)
      expect(response.body.id).toBe(property.id)
    })

    it('should return 404 when the property does not exist', async () => {
      const response = await request(app.server)
        .get('/properties/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(404)
    })
  })

  describe('PUT /properties/:id', () => {
    it('should update the property', async () => {
      const property = makeProperty({ price: 300_000 })
      propertyRepository.properties.push(property)

      const response = await request(app.server)
        .put(`/properties/${property.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ price: 320_000 })

      expect(response.status).toBe(200)
      expect(response.body.price).toBe(320_000)
    })

    it('should return 404 when the property does not exist', async () => {
      const response = await request(app.server)
        .put('/properties/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ price: 1000 })

      expect(response.status).toBe(404)
    })
  })

  describe('DELETE /properties/:id', () => {
    it('should delete the property and return 204', async () => {
      const property = makeProperty()
      propertyRepository.properties.push(property)

      const response = await request(app.server)
        .delete(`/properties/${property.id}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(204)
      expect(propertyRepository.properties).toHaveLength(0)
    })

    it('should return 404 when the property does not exist', async () => {
      const response = await request(app.server)
        .delete('/properties/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(404)
    })
  })
})
