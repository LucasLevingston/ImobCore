export interface AccessTokenPayload {
  sub: string
  email: string
}

// properties-service nunca emite token (não é dono da sessão) — só verifica a
// assinatura localmente com o mesmo JWT_SECRET do auth-service (docs seção 10).
export interface TokenProvider {
  verifyAccessToken(token: string): AccessTokenPayload | null
}
