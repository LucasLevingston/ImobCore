export interface AccessTokenPayload {
  sub: string
  email: string
}

// Access token: JWT stateless (curta duração). Refresh token: string opaca de alta
// entropia (não é JWT) — armazenada como hash, permite revogação real no banco.
export interface TokenProvider {
  generateAccessToken(payload: AccessTokenPayload): string
  verifyAccessToken(token: string): AccessTokenPayload | null
  generateRefreshToken(): string
}
