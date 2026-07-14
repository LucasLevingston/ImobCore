import { randomBytes } from 'node:crypto'
import jwt from 'jsonwebtoken'
import type { AccessTokenPayload, TokenProvider } from '../../domain/cryptography/token-provider'

export class JwtTokenProvider implements TokenProvider {
  constructor(
    private readonly secret: string = process.env.JWT_SECRET ?? '',
    private readonly expiresIn: string = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ?? '15m',
  ) {
    // Sem default seguro pra segredo criptográfico — falha rápido em vez de assinar com string vazia
    if (!this.secret) {
      throw new Error('JWT_SECRET não configurado.')
    }
  }

  generateAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn } as jwt.SignOptions)
  }

  verifyAccessToken(token: string): AccessTokenPayload | null {
    try {
      // jwt.verify só retorna string quando o payload assinado foi uma string —
      // este provider sempre assina objetos (generateAccessToken), então o cast é seguro
      const { sub, email } = jwt.verify(token, this.secret) as jwt.JwtPayload &
        Partial<AccessTokenPayload>
      if (typeof sub !== 'string' || typeof email !== 'string') return null
      return { sub, email }
    } catch {
      return null
    }
  }

  generateRefreshToken(): string {
    return randomBytes(32).toString('hex')
  }
}
