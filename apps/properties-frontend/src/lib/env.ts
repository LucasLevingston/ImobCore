import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_API_GATEWAY_URL: z.string().min(1, 'NEXT_PUBLIC_API_GATEWAY_URL é obrigatória'),
  NEXT_PUBLIC_AUTH_FRONTEND_URL: z.string().min(1, 'NEXT_PUBLIC_AUTH_FRONTEND_URL é obrigatória'),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_API_GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL,
  NEXT_PUBLIC_AUTH_FRONTEND_URL: process.env.NEXT_PUBLIC_AUTH_FRONTEND_URL,
})
