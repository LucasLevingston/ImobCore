# api-gateway

Único ponto de entrada HTTP público pra `auth-service` e `properties-service` — Fastify + `@fastify/http-proxy`.

**Status:** Fase 2a concluída. Ver `/docs/ARCHITECTURE.md` seção 04a.

## Responsabilidades

- Proxy: `/api/auth/*` → `auth-service` (`/api/auth` removido do path), `/api/properties/*` → `properties-service` (só `/api` removido, mantém `/properties`)
- CORS e rate limiting centralizados aqui — `auth-service`/`properties-service` não recebem mais tráfego direto de browser
- `x-request-id`: reaproveita o header do cliente ou gera um novo, propaga pro upstream
- `GET /health` (liveness local) e `GET /health/ready` (agrega o `/health` dos dois services)
- **Nunca** valida JWT nem decide autorização — só transporte. Cada service continua validando o próprio token (RNF05)

## Rotas

```
ANY  /api/auth/*        → proxy pra auth-service
ANY  /api/properties/*  → proxy pra properties-service
GET  /health             → liveness local
GET  /health/ready       → { status, services: { auth, properties } }
```

## Variáveis de ambiente

Ver `.env.example` na raiz. Obrigatórias: `AUTH_SERVICE_URL`, `PROPERTIES_SERVICE_URL`, `CORS_ORIGIN`.

## Como rodar

```bash
npm run dev --workspace=api-gateway
```

## Como testar

```bash
npm run test --workspace=api-gateway            # 19 testes, sem Docker — upstreams fake via Fastify em memória
npm run test:coverage --workspace=api-gateway    # cobertura (95%+)
```

## Docker

```bash
docker compose up api-gateway -d   # depende de auth-service healthy
```
