import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
})

export type RegisterUserInput = z.infer<typeof registerUserSchema>

// Nunca inclui passwordHash — fronteira explícita entre entidade de domínio
// e resposta HTTP (ver services/auth-service/.../user-response.mapper.ts)
export const userResponseSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
})

export type UserResponse = z.infer<typeof userResponseSchema>

export const accessTokenResponseSchema = z.object({
  accessToken: z.string(),
})

export type AccessTokenResponse = z.infer<typeof accessTokenResponseSchema>
