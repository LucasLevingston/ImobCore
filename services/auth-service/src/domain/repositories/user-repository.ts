import type { User } from '../entities/user.entity'

export interface CreateUserData {
  name: string
  email: string
  passwordHash: string
}

// DIP: use cases dependem desta abstração — implementação concreta (Prisma) fica em infra
export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  create(data: CreateUserData): Promise<User>
}
