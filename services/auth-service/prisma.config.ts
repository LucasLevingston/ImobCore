import { defineConfig } from 'prisma/config'

// Prisma 7: url some do datasource do schema.prisma — CLI (migrate/db push/
// studio) usa isto aqui. O runtime (client.ts) usa o adapter, não isto.
// Sem .env no projeto (convenção já existente: env vars sempre vêm do shell
// ou do docker-compose, nunca de arquivo) — nada a carregar aqui.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.AUTH_DATABASE_URL,
  },
})
