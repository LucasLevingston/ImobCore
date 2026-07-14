import bcrypt from 'bcryptjs'
import type { PasswordHasher } from '../../domain/cryptography/password-hasher'

export class BcryptHasher implements PasswordHasher {
  constructor(private readonly saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10)) {}

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash)
  }
}
