import type { CookieSerializeOptions } from '@fastify/cookie'

// Centraliza as opções do cookie — evita duplicar httpOnly/secure/sameSite
// em login/refresh/logout (DRY) e mantém a política de segurança num único lugar.
export function refreshTokenCookieOptions(maxAgeMs: number): CookieSerializeOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: Math.floor(maxAgeMs / 1000),
  }
}
