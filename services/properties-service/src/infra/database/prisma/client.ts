import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../../generated/prisma/client'

// Prisma 7: adapter obrigatório (motor Rust removido) — connection_limit
// que antes ia na query string do DATABASE_URL agora é `max` do pool do
// próprio driver `pg` (nunca mais parseado pelo Prisma)
const adapter = new PrismaPg({
  connectionString: process.env.PROPERTIES_DATABASE_URL,
  max: 5,
})

export const prisma = new PrismaClient({ adapter })
