import type { PrismaClient } from '@prisma/client'
import type { User } from '../../../domain/entities/user.entity'
import type { CreateUserData, UserRepository } from '../../../domain/repositories/user-repository'

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } })
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } })
  }

  async create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({ data })
  }
}
