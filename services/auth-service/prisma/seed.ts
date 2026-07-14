import { PrismaClient } from '@prisma/client'
import { BcryptHasher } from '../src/infra/cryptography/bcrypt-hasher'

const prisma = new PrismaClient()
const hasher = new BcryptHasher()

async function main() {
  const passwordHash = await hasher.hash('senha-123')

  await prisma.user.upsert({
    where: { email: 'dev@microfrontends.local' },
    update: {},
    create: {
      name: 'Usuário de Desenvolvimento',
      email: 'dev@microfrontends.local',
      passwordHash,
    },
  })

  console.info('Seed concluído: dev@microfrontends.local / senha-123')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
