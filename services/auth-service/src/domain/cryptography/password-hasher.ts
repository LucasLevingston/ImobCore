// DIP: use cases dependem desta abstração — implementação concreta (bcryptjs) fica em infra
export interface PasswordHasher {
  hash(plain: string): Promise<string>
  compare(plain: string, hash: string): Promise<boolean>
}
