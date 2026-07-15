import { z } from 'zod'

// Validado uma vez, na borda do processo — falha rápido se a config estiver incompleta
const envSchema = z.object({
  PROPERTIES_SERVICE_PORT: z.coerce.number().default(3002),
  PROPERTIES_DATABASE_URL: z.string().min(1, 'PROPERTIES_DATABASE_URL é obrigatória'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter ao menos 32 caracteres'),
})

export const env = envSchema.parse(process.env)
