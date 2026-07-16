import { z } from 'zod'

const envSchema = z.object({
  API_GATEWAY_PORT: z.coerce.number().default(3004),
  AUTH_SERVICE_URL: z.string().min(1, 'AUTH_SERVICE_URL é obrigatória'),
  PROPERTIES_SERVICE_URL: z.string().min(1, 'PROPERTIES_SERVICE_URL é obrigatória'),
  CORS_ORIGIN: z.string().min(1, 'CORS_ORIGIN é obrigatória'),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_TIME_WINDOW: z.string().default('1 minute'),
})

export const env = envSchema.parse(process.env)
