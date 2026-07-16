import { defineConfig } from 'prisma/config'

// Prisma 7: url some do datasource do schema.prisma — CLI (migrate/db push/
// studio) usa isto aqui. O runtime (client.ts) usa o adapter, não isto.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.PROPERTIES_DATABASE_URL,
  },
})
