import { randomUUID } from 'node:crypto'
import type { User } from '../../domain/entities/user.entity'
import type { CreateUserData, UserRepository } from '../../domain/repositories/user-repository'

// Fake em memória — permite testar use cases sem subir Postgres (unit, rápido, determinístico)
export class InMemoryUserRepository implements UserRepository {
  public readonly users: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) ?? null
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) ?? null
  }

  async create(data: CreateUserData): Promise<User> {
    const now = new Date()
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      createdAt: now,
      updatedAt: now,
    }
    this.users.push(user)
    return user
  }
}
