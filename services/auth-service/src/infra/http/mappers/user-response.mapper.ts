import type { User } from '../../../domain/entities/user.entity'
import type { UserResponse } from './user-response.mapper.types'

// Nunca inclui passwordHash — fronteira explícita entre entidade de domínio e resposta HTTP
export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  }
}
