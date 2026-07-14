import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { PrismaUserRepository } from './prisma-user-repository'

// Integração real — sobe Postgres via Testcontainers (precisa de Docker rodando).
// Nunca roda junto da suíte unitária (`npm test`) — só via `npm run test:integration`.
describe('PrismaUserRepository (integration)', () => {
  let container: StartedPostgreSqlContainer
  let prisma: PrismaClient
  let repository: PrismaUserRepository

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:16-alpine').start()
    const url = container.getConnectionUri()
    execSync('npx prisma db push --skip-generate', {
      env: { ...process.env, AUTH_DATABASE_URL: url },
      stdio: 'inherit',
    })
    prisma = new PrismaClient({ datasources: { db: { url } } })
    repository = new PrismaUserRepository(prisma)
  }, 60_000)

  afterAll(async () => {
    await prisma.$disconnect()
    await container.stop()
  })

  beforeEach(async () => {
    await prisma.refreshToken.deleteMany()
    await prisma.user.deleteMany()
  })

  it('should create a user and find it by email', async () => {
    await repository.create({ name: 'Lucas', email: 'lucas@email.com', passwordHash: 'hash' })

    const found = await repository.findByEmail('lucas@email.com')

    expect(found?.name).toBe('Lucas')
  })

  it('should find a user by id', async () => {
    const created = await repository.create({
      name: 'Lucas',
      email: 'lucas@email.com',
      passwordHash: 'hash',
    })

    const found = await repository.findById(created.id)

    expect(found?.id).toBe(created.id)
  })

  it('should return null when email does not exist', async () => {
    expect(await repository.findByEmail('ghost@email.com')).toBeNull()
  })

  it('should return null when id does not exist', async () => {
    expect(await repository.findById('00000000-0000-0000-0000-000000000000')).toBeNull()
  })

  it('should enforce unique email at the database level', async () => {
    await repository.create({ name: 'Lucas', email: 'lucas@email.com', passwordHash: 'hash' })

    await expect(
      repository.create({ name: 'Outro', email: 'lucas@email.com', passwordHash: 'hash' }),
    ).rejects.toThrow()
  })
})
