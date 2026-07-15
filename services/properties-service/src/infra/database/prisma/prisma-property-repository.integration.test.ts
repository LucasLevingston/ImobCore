import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { makeCreatePropertyInput } from '../../../test-utils/factories/make-create-property-input'
import { PrismaPropertyRepository } from './prisma-property-repository'

// Integração real — sobe Postgres via Testcontainers (precisa de Docker rodando).
// Nunca roda junto da suíte unitária (`npm test`) — só via `npm run test:integration`.
describe('PrismaPropertyRepository (integration)', () => {
  let container: StartedPostgreSqlContainer
  let prisma: PrismaClient
  let repository: PrismaPropertyRepository

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:16-alpine').start()
    const url = container.getConnectionUri()
    execSync('npx prisma db push --skip-generate', {
      env: { ...process.env, PROPERTIES_DATABASE_URL: url },
      stdio: 'inherit',
    })
    prisma = new PrismaClient({ datasources: { db: { url } } })
    repository = new PrismaPropertyRepository(prisma)
  }, 60_000)

  afterAll(async () => {
    await prisma.$disconnect()
    await container.stop()
  })

  beforeEach(async () => {
    await prisma.property.deleteMany()
  })

  const brokerId = 'broker-1'

  it('should create a property and convert Decimal fields to plain numbers', async () => {
    const created = await repository.create({ ...makeCreatePropertyInput(), brokerId })

    expect(typeof created.price).toBe('number')
    expect(created.price).toBe(350_000)
    expect(created.brokerId).toBe(brokerId)
  })

  it('should find a property by id', async () => {
    const created = await repository.create({ ...makeCreatePropertyInput(), brokerId })

    const found = await repository.findById(created.id)

    expect(found?.id).toBe(created.id)
  })

  it('should return null when the id does not exist', async () => {
    expect(await repository.findById('00000000-0000-0000-0000-000000000000')).toBeNull()
  })

  it('should update only the given fields', async () => {
    const created = await repository.create({ ...makeCreatePropertyInput(), brokerId })

    const updated = await repository.update(created.id, { price: 400_000 })

    expect(updated.price).toBe(400_000)
    expect(updated.title).toBe(created.title)
  })

  it('should delete a property', async () => {
    const created = await repository.create({ ...makeCreatePropertyInput(), brokerId })

    await repository.delete(created.id)

    expect(await repository.findById(created.id)).toBeNull()
  })

  it('should list properties filtered by city with pagination', async () => {
    await repository.create({ ...makeCreatePropertyInput(), brokerId, city: 'São Paulo' })
    await repository.create({ ...makeCreatePropertyInput(), brokerId, city: 'Rio de Janeiro' })

    const result = await repository.list(
      { city: 'São Paulo' },
      { page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' },
    )

    expect(result.total).toBe(1)
    expect(result.items[0]?.city).toBe('São Paulo')
  })

  it('should search properties by title', async () => {
    await repository.create({
      ...makeCreatePropertyInput(),
      brokerId,
      title: 'Cobertura duplex vista mar',
    })
    await repository.create({ ...makeCreatePropertyInput(), brokerId, title: 'Casa no interior' })

    const result = await repository.search(
      'cobertura',
      {},
      { page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' },
    )

    expect(result.total).toBe(1)
  })

  it('should compute dashboard metrics grouped by status and city', async () => {
    await repository.create({
      ...makeCreatePropertyInput(),
      brokerId,
      status: 'Sold',
      city: 'São Paulo',
      district: 'Centro',
      price: 200_000,
    })
    await repository.create({
      ...makeCreatePropertyInput(),
      brokerId,
      status: 'Available',
      city: 'São Paulo',
      district: 'Centro',
      price: 400_000,
    })

    const metrics = await repository.getDashboardMetrics()

    expect(metrics.total).toBe(2)
    expect(metrics.byStatus.Sold).toBe(1)
    expect(metrics.averagePrice).toBe(300_000)
    expect(metrics.byCity).toContainEqual({ city: 'São Paulo', count: 2 })
  })
})
