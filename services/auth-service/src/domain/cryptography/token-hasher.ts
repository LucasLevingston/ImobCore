// Hash determinístico (SHA-256) — diferente de PasswordHasher (bcrypt, salgado):
// refresh token precisa de lookup direto por hash no banco, não comparação 1-a-1.
export interface TokenHasher {
  hash(token: string): string
}
