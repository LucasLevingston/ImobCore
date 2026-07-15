import { execSync } from 'node:child_process'
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { PrismaClient } from '../../../generated/prisma'
import { PrismaRefreshTokenRepository } from './prisma-refresh-token-repository'
import { PrismaUserRepository } from './prisma-user-repository'

describe('PrismaRefreshTokenRepository (integration)', () => {
  let container: StartedPostgreSqlContainer
  let prisma: PrismaClient
  let repository: PrismaRefreshTokenRepository
  let userRepository: PrismaUserRepository

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:16-alpine').start()
    const url = container.getConnectionUri()
    execSync('npx prisma db push --skip-generate', {
      env: { ...process.env, AUTH_DATABASE_URL: url },
      stdio: 'inherit',
    })
    prisma = new PrismaClient({ datasources: { db: { url } } })
    repository = new PrismaRefreshTokenRepository(prisma)
    userRepository = new PrismaUserRepository(prisma)
  }, 60_000)

  afterAll(async () => {
    await prisma.$disconnect()
    await container.stop()
  })

  beforeEach(async () => {
    await prisma.refreshToken.deleteMany()
    await prisma.user.deleteMany()
  })

  it('should create a refresh token and find it by its hash', async () => {
    const user = await userRepository.create({
      name: 'Lucas',
      email: 'lucas@email.com',
      passwordHash: 'hash',
    })

    await repository.create({
      tokenHash: 'hashed-token',
      userId: user.id,
      expiresAt: new Date(Date.now() + 60_000),
    })

    const found = await repository.findByTokenHash('hashed-token')

    expect(found?.userId).toBe(user.id)
    expect(found?.revokedAt).toBeNull()
  })

  it('should return null when the token hash does not exist', async () => {
    expect(await repository.findByTokenHash('unknown-hash')).toBeNull()
  })

  it('should set revokedAt when revoking a token', async () => {
    const user = await userRepository.create({
      name: 'Lucas',
      email: 'lucas@email.com',
      passwordHash: 'hash',
    })
    const token = await repository.create({
      tokenHash: 'hashed-token',
      userId: user.id,
      expiresAt: new Date(Date.now() + 60_000),
    })

    await repository.revoke(token.id)

    const found = await repository.findByTokenHash('hashed-token')
    expect(found?.revokedAt).not.toBeNull()
  })

  it('should cascade-delete refresh tokens when the owning user is deleted', async () => {
    const user = await userRepository.create({
      name: 'Lucas',
      email: 'lucas@email.com',
      passwordHash: 'hash',
    })
    await repository.create({
      tokenHash: 'hashed-token',
      userId: user.id,
      expiresAt: new Date(Date.now() + 60_000),
    })

    await prisma.user.delete({ where: { id: user.id } })

    expect(await repository.findByTokenHash('hashed-token')).toBeNull()
  })
})
