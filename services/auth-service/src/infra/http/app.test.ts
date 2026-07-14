import type { FastifyInstance } from 'fastify'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { InMemoryRefreshTokenRepository } from '../../test-utils/fakes/in-memory-refresh-token-repository'
import { InMemoryUserRepository } from '../../test-utils/fakes/in-memory-user-repository'
import { BcryptHasher } from '../cryptography/bcrypt-hasher'
import { JwtTokenProvider } from '../cryptography/jwt-token-provider'
import { Sha256TokenHasher } from '../cryptography/sha256-token-hasher'
import { buildApp } from './app'

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

async function makeApp() {
  const app = await buildApp({
    userRepository: new InMemoryUserRepository(),
    refreshTokenRepository: new InMemoryRefreshTokenRepository(),
    passwordHasher: new BcryptHasher(),
    tokenProvider: new JwtTokenProvider(),
    tokenHasher: new Sha256TokenHasher(),
    refreshTokenTtlMs: REFRESH_TOKEN_TTL_MS,
    corsOrigin: 'http://localhost:3000',
    logger: false,
  })
  await app.ready()
  return app
}

async function registerAndLogin(app: FastifyInstance) {
  await request(app.server)
    .post('/register')
    .send({ name: 'Lucas Levingston', email: 'lucas@email.com', password: 'super-secret-1' })

  const response = await request(app.server)
    .post('/login')
    .send({ email: 'lucas@email.com', password: 'super-secret-1' })

  const setCookieHeader = response.headers['set-cookie']
  const refreshCookie = Array.isArray(setCookieHeader) ? setCookieHeader[0] : undefined
  if (!refreshCookie) {
    throw new Error('login response did not set a refresh token cookie')
  }
  return { accessToken: response.body.accessToken as string, refreshCookie }
}

describe('auth-service HTTP routes', () => {
  let app: FastifyInstance

  beforeEach(async () => {
    app = await makeApp()
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

    it('should return 200 when checkReadiness resolves true', async () => {
      const readyApp = await buildApp({
        userRepository: new InMemoryUserRepository(),
        refreshTokenRepository: new InMemoryRefreshTokenRepository(),
        passwordHasher: new BcryptHasher(),
        tokenProvider: new JwtTokenProvider(),
        tokenHasher: new Sha256TokenHasher(),
        refreshTokenTtlMs: REFRESH_TOKEN_TTL_MS,
        corsOrigin: 'http://localhost:3000',
        logger: false,
        checkReadiness: async () => true,
      })
      await readyApp.ready()

      const response = await request(readyApp.server).get('/health/ready')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({ status: 'ready' })
      await readyApp.close()
    })

    it('should return 503 when checkReadiness resolves false', async () => {
      const notReadyApp = await buildApp({
        userRepository: new InMemoryUserRepository(),
        refreshTokenRepository: new InMemoryRefreshTokenRepository(),
        passwordHasher: new BcryptHasher(),
        tokenProvider: new JwtTokenProvider(),
        tokenHasher: new Sha256TokenHasher(),
        refreshTokenTtlMs: REFRESH_TOKEN_TTL_MS,
        corsOrigin: 'http://localhost:3000',
        logger: false,
        checkReadiness: async () => false,
      })
      await notReadyApp.ready()

      const response = await request(notReadyApp.server).get('/health/ready')

      expect(response.status).toBe(503)
      expect(response.body).toEqual({ status: 'not-ready' })
      await notReadyApp.close()
    })
  })

  describe('buildApp logger default', () => {
    it('should default logger to enabled when not specified', async () => {
      const appWithDefaultLogger = await buildApp({
        userRepository: new InMemoryUserRepository(),
        refreshTokenRepository: new InMemoryRefreshTokenRepository(),
        passwordHasher: new BcryptHasher(),
        tokenProvider: new JwtTokenProvider(),
        tokenHasher: new Sha256TokenHasher(),
        refreshTokenTtlMs: REFRESH_TOKEN_TTL_MS,
        corsOrigin: 'http://localhost:3000',
      })

      expect(appWithDefaultLogger.log).toBeDefined()
      await appWithDefaultLogger.close()
    })
  })

  describe('POST /register', () => {
    it('should create a user and return 201 without the password hash', async () => {
      const response = await request(app.server)
        .post('/register')
        .send({ name: 'Lucas Levingston', email: 'lucas@email.com', password: 'super-secret-1' })

      expect(response.status).toBe(201)
      expect(response.body.email).toBe('lucas@email.com')
      expect(response.body).not.toHaveProperty('passwordHash')
    })

    it('should return 400 for an invalid payload', async () => {
      const response = await request(app.server)
        .post('/register')
        .send({ name: 'L', email: 'not-an-email', password: '123' })

      expect(response.status).toBe(400)
    })

    it('should return 409 when the email is already registered', async () => {
      await request(app.server)
        .post('/register')
        .send({ name: 'Lucas', email: 'lucas@email.com', password: 'super-secret-1' })

      const response = await request(app.server)
        .post('/register')
        .send({ name: 'Outro', email: 'lucas@email.com', password: 'super-secret-1' })

      expect(response.status).toBe(409)
    })
  })

  describe('POST /login', () => {
    it('should return 200 with an access token and set the refresh token cookie', async () => {
      await request(app.server)
        .post('/register')
        .send({ name: 'Lucas', email: 'lucas@email.com', password: 'super-secret-1' })

      const response = await request(app.server)
        .post('/login')
        .send({ email: 'lucas@email.com', password: 'super-secret-1' })

      expect(response.status).toBe(200)
      expect(typeof response.body.accessToken).toBe('string')
      expect(response.headers['set-cookie']?.[0]).toMatch(/refreshToken=/)
      expect(response.headers['set-cookie']?.[0]).toMatch(/HttpOnly/)
    })

    it('should return 401 for a wrong password', async () => {
      await request(app.server)
        .post('/register')
        .send({ name: 'Lucas', email: 'lucas@email.com', password: 'super-secret-1' })

      const response = await request(app.server)
        .post('/login')
        .send({ email: 'lucas@email.com', password: 'wrong-password' })

      expect(response.status).toBe(401)
    })
  })

  describe('GET /me', () => {
    it('should return 401 without an Authorization header', async () => {
      const response = await request(app.server).get('/me')
      expect(response.status).toBe(401)
    })

    it("should return the authenticated user's profile", async () => {
      const { accessToken } = await registerAndLogin(app)

      const response = await request(app.server)
        .get('/me')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(200)
      expect(response.body.email).toBe('lucas@email.com')
    })
  })

  describe('POST /refresh', () => {
    it('should return 401 without a refresh token cookie', async () => {
      const response = await request(app.server).post('/refresh')
      expect(response.status).toBe(401)
    })

    it('should issue a new access token and rotate the refresh cookie', async () => {
      const { refreshCookie } = await registerAndLogin(app)

      const response = await request(app.server).post('/refresh').set('Cookie', refreshCookie)

      expect(response.status).toBe(200)
      expect(typeof response.body.accessToken).toBe('string')
      expect(response.headers['set-cookie']?.[0]).toMatch(/refreshToken=/)
    })
  })

  describe('POST /logout', () => {
    it('should return 204 and clear the refresh token cookie', async () => {
      const { refreshCookie } = await registerAndLogin(app)

      const response = await request(app.server).post('/logout').set('Cookie', refreshCookie)

      expect(response.status).toBe(204)
      expect(response.headers['set-cookie']?.[0]).toMatch(/refreshToken=;/)
    })

    it('should revoke the refresh token so it can no longer be used to refresh', async () => {
      const { refreshCookie } = await registerAndLogin(app)

      await request(app.server).post('/logout').set('Cookie', refreshCookie)
      const response = await request(app.server).post('/refresh').set('Cookie', refreshCookie)

      expect(response.status).toBe(401)
    })

    it('should return 204 even without a refresh token cookie (idempotent)', async () => {
      const response = await request(app.server).post('/logout')
      expect(response.status).toBe(204)
    })
  })
})
