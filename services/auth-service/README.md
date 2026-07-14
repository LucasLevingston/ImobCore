# auth-service

Microservice de autenticação — Fastify + Prisma + PostgreSQL.

**Status:** aguardando implementação (Fase 2 do roadmap). Ver `/README.md` na raiz do monorepo.

## Responsabilidades (quando implementado)

- Cadastro, login, refresh token, logout, perfil
- JWT (access + refresh), hash de senha com bcrypt
- Banco próprio (`auth_db`) — nunca compartilhado com `products-service`

## Rotas planejadas

```
POST /register
POST /login
POST /refresh
POST /logout
GET  /me
```
