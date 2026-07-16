import type { User } from '../../../domain/entities/user.entity'

export interface UserResponse {
  id: string
  name: string
  email: string
  createdAt: string
}

// Nunca inclui passwordHash — fronteira explícita entre entidade de domínio e resposta HTTP
export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  }
}
