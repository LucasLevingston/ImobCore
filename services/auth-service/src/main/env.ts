import { z } from 'zod'

// Validado uma vez, na borda do processo — falha rápido se a config estiver incompleta
const envSchema = z.object({
  AUTH_SERVICE_PORT: z.coerce.number().default(3001),
  AUTH_DATABASE_URL: z.string().min(1, 'AUTH_DATABASE_URL é obrigatória'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter ao menos 32 caracteres'),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(10),
})

export const env = envSchema.parse(process.env)
