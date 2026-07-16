import jwt from 'jsonwebtoken'
import type { AccessTokenPayload, TokenProvider } from '../../domain/cryptography/token-provider'

export class JwtTokenProvider implements TokenProvider {
  constructor(private readonly secret: string = process.env.JWT_SECRET ?? '') {
    // Sem default seguro pra segredo criptográfico — falha rápido em vez de verificar com string vazia
    if (!this.secret) {
      throw new Error('JWT_SECRET não configurado.')
    }
  }

  verifyAccessToken(token: string): AccessTokenPayload | null {
    try {
      // jwt.verify só retorna string quando o payload assinado foi uma string —
      // o auth-service sempre assina objetos, então o cast é seguro
      const { sub, email } = jwt.verify(token, this.secret) as jwt.JwtPayload &
        Partial<AccessTokenPayload>
      if (typeof sub !== 'string' || typeof email !== 'string') return null
      return { sub, email }
    } catch {
      return null
    }
  }
}
