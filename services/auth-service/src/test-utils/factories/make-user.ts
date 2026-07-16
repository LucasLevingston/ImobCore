import { randomUUID } from 'node:crypto'
import type { User } from '../../domain/entities/user.entity'

// Factory: evita repetir objeto User inteiro em cada teste — só sobrescreve o que importa
export function makeUser(overrides: Partial<User> = {}): User {
  const now = new Date()
  return {
    id: randomUUID(),
    name: 'Lucas Levingston',
    email: 'lucas@email.com',
    passwordHash: 'hashed-password',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}
