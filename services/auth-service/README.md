# auth-service

Microservice de autenticação — Fastify + Prisma + PostgreSQL.

**Status:** Fase 2 concluída. Ver `/docs/ARCHITECTURE.md` seções 09 e 13.

## Responsabilidades

- Cadastro, login, refresh token (rotativo), logout, perfil
- JWT (access token, 15 min) + refresh token opaco (7 dias, hash SHA-256 no banco)
- Hash de senha com bcrypt (`bcryptjs`, salt configurável)
- Banco próprio (`auth_db`) — nunca compartilhado com `properties-service`

## Arquitetura

```
src/
├── domain/            entities (User, RefreshToken) + interfaces (repositories, cryptography)
├── application/        use cases (RegisterUser, Login, RefreshToken, Logout, GetProfile) + DTOs Zod + erros
├── infra/
│   ├── cryptography/    BcryptHasher, JwtTokenProvider, Sha256TokenHasher
│   ├── database/prisma/ PrismaUserRepository, PrismaRefreshTokenRepository
│   ├── http/            app.ts (composition root), controllers, rotas, middlewares, mappers
│   └── utils/           parseDurationToMs
└── main/               server.ts, env.ts (validação Zod de env vars)
```

## Rotas

```
POST /register   → cria usuário
POST /login       → autentica, retorna accessToken + Set-Cookie refreshToken (httpOnly)
POST /refresh     → rotaciona refresh token, retorna novo accessToken
POST /logout      → revoga refresh token atual
GET  /me          → perfil do usuário autenticado (Bearer accessToken)
GET  /health      → liveness
GET  /health/ready→ readiness (checa conexão com o banco)
```

## Variáveis de ambiente

Ver `.env.example` na raiz do monorepo. Obrigatórias: `AUTH_DATABASE_URL`, `JWT_SECRET` (mín. 32 caracteres — o serviço falha ao subir sem isso, propositalmente).

## Como rodar

```bash
docker compose up postgres-auth -d
npm run prisma:migrate --workspace=auth-service   # ainda pendente: gerar migration inicial (precisa de Docker rodando)
npm run dev --workspace=auth-service
```

## Como testar

```bash
npm run test --workspace=auth-service              # unitário (use cases, crypto, HTTP via Supertest+fakes) — 101 testes, 100% cobertura, não precisa de Docker
npm run test:coverage --workspace=auth-service      # cobertura (95%+ em domain/application/infra exceto repositórios Prisma)
npm run test:integration --workspace=auth-service   # PrismaUserRepository/PrismaRefreshTokenRepository via Testcontainers — precisa de Docker rodando
```

**Nota:** os testes de integração dos repositórios Prisma foram escritos mas não puderam ser executados neste ambiente (Docker Desktop indisponível durante o desenvolvimento). Rodar `npm run test:integration --workspace=auth-service` com Docker ativo antes de considerar a Fase 2 100% verificada.

## Docker

```bash
docker compose up auth-service -d
```
