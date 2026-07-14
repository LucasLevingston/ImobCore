# auth-frontend

Micro Frontend de autenticação — Next.js (App Router).

**Status:** aguardando implementação (Fase 3 do roadmap). Ver `/README.md` na raiz do monorepo.

## Responsabilidades (quando implementado)

- Login, cadastro, logout, refresh token, perfil do usuário
- Consome exclusivamente `auth-service`
- Sem lógica de produtos
- Expõe via Module Federation: `Header`, `AuthStatus`, `UserMenu` (consumidos por `products-frontend`)
