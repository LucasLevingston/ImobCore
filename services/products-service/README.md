# products-service

Microservice de produtos — Fastify + Prisma + PostgreSQL.

**Status:** aguardando implementação (Fase 4 do roadmap). Ver `/README.md` na raiz do monorepo.

## Responsabilidades (quando implementado)

- CRUD de produtos, busca, paginação, filtros
- Valida JWT emitido pelo `auth-service` (segredo compartilhado via env var — sem chamada de rede entre serviços)
- Banco próprio (`products_db`) — nunca compartilhado com `auth-service`

## Rotas planejadas

```
GET    /products
GET    /products/:id
POST   /products
PUT    /products/:id
DELETE /products/:id
```
