import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_API_GATEWAY_URL: z.string().min(1, 'NEXT_PUBLIC_API_GATEWAY_URL é obrigatória'),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_API_GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL,
})
